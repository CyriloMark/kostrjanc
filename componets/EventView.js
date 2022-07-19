import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text, Alert } from 'react-native';

import { getDatabase, ref, onValue, get, child, remove, set } from "firebase/database";
import { getAuth } from 'firebase/auth';

import MapView, { Marker } from 'react-native-maps';

import CommentsModal from './statics/CommentsModal';
import ReportModal from './statics/ReportModal';
import UserListModal from './statics/UserListModal';

import SVG_Recent from '../assets/svg/Recent';
import SVG_Share from '../assets/svg/Share';
import SVG_Warn from '../assets/svg/Warn';
import SVG_Basket from '../assets/svg/Basket';
import SVG_Ban from '../assets/svg/Ban'

import BackHeader from './statics/BackHeader';
import UserHeader from './statics/UserHeader';
import DeleteButton from './statics/DeleteButton';

const USER_PLACEHOLDER = {
    name: "",
    pbUri: "https://www.colorhexa.com/587db0.png"
}
const EVENT_PLACEHOLDER = {
    title: "",
    description: "",
    created: "",
    checks: [],
    starting: 0,
    comments: [],
    isBanned: false,
    geoCords: {
        latitude: 90,
        latitudeDelta: 90,
        longitude: -36,
        longitudeDelta: 124
    }
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

let userDatabase;
export default function EventView({ navigation, route }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const uid = getAuth().currentUser.uid;
    
    const [creator, setCreator] = useState(null);

    const [commentsVisible, setCommentsVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);

    const [checksVisible, setChecksVisible] = useState(false);
    const [checksUserList, setChecksUserList] = useState([]);

    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [event, setEvent] = useState(EVENT_PLACEHOLDER);
    const [pin, setPin] = useState(null);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    
    const {eventID} = route.params;

    const loadData = () => {
        const db = getDatabase();
        onValue(ref(db, 'events/' + eventID), snapshot => {
            if (!snapshot.exists()) {
                setEvent({
                    ...EVENT_PLACEHOLDER,
                    isBanned: true
                });
                return;
            }
            const data = snapshot.val();
            
            setCreator(data['creator']);

            if (snapshot.hasChild('isBanned')) {
                if (data['isBanned']) {
                    setEvent({
                        ...EVENT_PLACEHOLDER,
                        isBanned: true
                    });
                    return;
                }
            }

            setEvent({
                ...data,
                checks: snapshot.hasChild('checks') ? data['checks'] : [],
                comments: snapshot.hasChild('comments') ? data['comments'] : [],
                isBanned: false
            });
            setPin(data['geoCords']);
        });
    }

    const loadUser = () => {
        const db = ref(getDatabase());
        get(child(db, 'users/' + creator))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    const data = snapshot.val();
                    userDatabase = data;

                    setUser({
                        name: data['name'],
                        description: data['description'],
                        pbUri: data['pbUri'],
                        gender: data['gender'],
                        ageGroup: data['ageGroup'],
                    });
                }
                else {
                    setUser(USER_PLACEHOLDER);
                }
            }).finally(() => {
                get(child(db, "users/" + getAuth().currentUser.uid + "/isAdmin"))
                    .then(snapshot => {
                        if (!snapshot.exists()) return;
                        const isA = snapshot.val();
                        setUserIsAdmin(isA);
                    })
            })
    }

    useEffect(() => {
        if (event === EVENT_PLACEHOLDER) loadData();
    }, []);

    useEffect(() => {
        if (creator === null) return;
        loadUser();
    }, [creator]);

    
    const convertTimestampIntoString = (val) => {
        const date = new Date(val);

        let min = date.getMinutes().toString().length === 1 ? date.getMinutes() + "0" : date.getMinutes()
        return (date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + min + " hodź.");
    }

    const deleteEvent = () => {
        ref(getDatabase(), 'events').off();
        remove(ref(getDatabase(), 'events/' + event.id))
            .then(() => {

                let userEventList = userDatabase['events']
                
                userEventList.splice(userEventList.indexOf(event.id), 1);
                set(ref(getDatabase(), 'users/' + creator), {
                    ...userDatabase,
                    events: userEventList
                })
            })
            .finally(() => {
                navigation.navigate('Recent');
            })
            .catch((error) => console.log("error", error.code))
    }

    const checkEvent = () => {
        if (event.isBanned) return;

        let a = event.checks;

        if (a.includes(uid)) {
            a.splice(a.indexOf(uid), 1)
            setEvent({
                ...event,
                checks: a
            });
        } else {
            a.push(uid)
            setEvent({
                ...event,
                checks: a
            });
        }

        const db = getDatabase();
        set(ref(db, "events/" + event.id), {
            ...event
        });
    }

    const getChecksUserList = () => {
        if (event.isBanned) return;
        setChecksVisible(true);

        const db = ref(getDatabase());

        let list = [];
        for(let i = 0; i < event.checks.length; i++) {
            get(child(db, "users/" + event.checks[i]))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const a = snapshot.val();
                        list.push({
                            name: a['name'],
                            pbUri: a['pbUri']
                        });
                    }
                })
                .catch((error) => console.log("error get", error.code))
                .finally(() => {
                    if (i === event.checks.length - 1) setChecksUserList(list);
                })
        }
    }

    const banEvent = () => {

        Alert.alert("Chceš tutón ewent banować?", "Chceš woprawdźe ewent banować? Ewent je banowany, wužiwar nic.", [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    const db = getDatabase();
                    get(child(ref(db), "users/" + getAuth().currentUser.uid + "/isAdmin"))
                        .then(snapshot => {
                            if (!snapshot.exists()) return;
                            const isAdmin = snapshot.val();
                            if (!isAdmin) return;

                            set(ref(db, "events/" + event.id), {
                                ...event,
                                isBanned: true
                            });
                        })
                        .catch(error => console.log("error", error.code))
                    }
            }
        ])
    }

    return (
        <View style={ styles.container }>

            <CommentsModal type={1} title={event.title} visible={commentsVisible} close={ () => setCommentsVisible(false) } commentsList={event.comments} />
            <ReportModal type={1} visible={reportVisible} close={ () => setReportVisible(false) } id={eventID}  />

            <UserListModal close={ () => setChecksVisible(false) } visible={checksVisible} title={"Tute ludźo su tež pódla"} userList={checksUserList} />

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title="Event" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#143C63"
                        title=''
                        colors={["#143C63"]}
                    /> }>

                {
                    !event.isBanned ?
                        <UserHeader onPress={ () => navigation.navigate('ProfileView', { userID: creator }) } user={user} userID={creator} /> :
                        <UserHeader onPress={ () => {} } user={USER_PLACEHOLDER} userID={getAuth().currentUser.uid} />
                }

                    {/* MapView */}
                <View style={ styles.mapViewContainer }>
                    <SVG_Basket style={[ styles.pbImageIcon, { opacity: event.isBanned ? 1 : 0 } ]} fill="#5884B0" />
                    {
                        pin != null ?
                        <MapView style={styles.map}
                            accessible={false} focusable={false}
                            initialRegion={ event.geoCords } >
                            {
                                !event.isBanned ?
                                    <Marker title={event.title} coordinate={event.geoCords} /> : null
                            }
                        </MapView> : null
                    }
                </View>

                {
                    !event.isBanned ?

                    <View style={[ styles.interactionsContainer, styles.shadow ]}>
                            {/* Comment */}
                        <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} onPress={ () => setCommentsVisible(true) } >
                            <SVG_Recent style={ styles.postInteractionsItemText } fill="#B06E6A" />
                        </Pressable>
                            {/* Share */}
                        {/* <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} >
                            <SVG_Share style={ styles.postInteractionsItemText } fill="#B06E6A" />
                        </Pressable> */}
                            {/* Report */}
                        <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} onPress={ () => setReportVisible(true) } >
                            <SVG_Warn style={ styles.postInteractionsItemText } fill="#B06E6A" />
                        </Pressable>

                            {/* Admin Ban */}
                        {
                            userIsAdmin ?
                            <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} onPress={ banEvent } >
                                <SVG_Ban style={ styles.postInteractionsItemText } fill="#B06E6A" />
                            </Pressable> : null
                        }
                    </View>

                    : null
                }

                    {/* Describtion */}
                <View style={ styles.descriptionContainer }>
                    <Text style={ styles.titleText }>{event.title}</Text>
                    <Text style={ styles.titleText }>{convertTimestampIntoString(event.starting)}</Text>
                    <Text style={ styles.descriptionText }>{event.description}</Text>
                </View>

                    {/* Checks */}
                <Pressable style={ styles.userListContainer  } onPress={ () => { getChecksUserList(); } }>
                    <Text style={ styles.userListText }>
                        <Text style={{fontFamily: "Inconsolata_Black"}}>{event.checks.length }</Text> su tež pódla</Text>
                </Pressable>

                    {/* Join */}
                <Pressable style={[ styles.joinBtnContainer, { backgroundColor: !(event.checks.includes(uid)) ? "#B06E6A" : "#9FB012" } ]} onPress={ checkEvent }>
                    <Text style={ [styles.joinText, { color: (!true) ? "#143C63" : "#143C63" } ]} >
                        { !(event.checks.includes(uid)) ? "Sym tež tu" : "Njejsym tu"}
                    </Text>
                </Pressable>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0",
        paddingHorizontal: 10,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10
    },

    backHeader: {
        position: "absolute",
        width: "100%",
        height: "10%",
        top: 10,

        alignSelf: "center",

        zIndex: 99
    },

    userHeader: {
        width: "100%",
        position: "relative",
        zIndex: 2,
    },

    mapViewContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        marginTop: 10,
        position: "relative",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    pbImageIcon: {
        position: "absolute",
        width: "50%",
        height: "50%",
        zIndex: 99,
    },
    map: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",
        zIndex: 3
    },

    descriptionContainer: {
        width: "90%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        position: "relative",
        marginTop: 10,
        alignSelf: "center",
        
        paddingHorizontal: 25,
        paddingVertical: 10,

        elevation: 10,
    },
    titleText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#5884B0",
        marginBottom: 10
    },
    descriptionText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#5884B0"
    },

    interactionsContainer: {
        width: "100%",
        position: "relative",
        borderRadius: 15,
        marginTop: 10,
        alignSelf: "center",
        
        padding: 10,
        backgroundColor: "#143C63",
        
        flexDirection: "row",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        
        zIndex: 3,
    },
    postInteractionsItem: {
        flex: .1,
        aspectRatio: 1,
        borderRadius: 50,

        marginRight: 10,
        padding: 12,
    },
    postInteractionsItemText: {
        flex: 1,
        width: "100%"
    },

    userListContainer: {
        width: "90%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        position: "relative",
        marginTop: 25,
        alignSelf: "center",
        
        paddingHorizontal: 25,
        paddingVertical: 10,

        elevation: 10,
    },
    userListText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#5884B0"
    },

    joinBtnContainer: {
        width: "60%",
        backgroundColor: "",
        padding: 25,

        position: "relative",
        alignSelf: "center",
        marginTop: 25,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#143C63",

        borderRadius: 15,
        elevation: 10
    },
    joinText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#143C63"
    },

    deleteBtn: {
        width: "60%",
        marginTop: 25,
        alignSelf: "center"
    },

    reportContainer: {
        width: "40%",
        borderRadius: 100,
        aspectRatio: 1,
        marginTop: 25,
        alignSelf: "center",
        paddingHorizontal: 35,
        paddingBottom: 10,
        backgroundColor: "#143C63",
        alignItems: "center",
        justifyContent: "center"
    },
    reportText: {
        height: "100%",
        width: "100%"
    },
});