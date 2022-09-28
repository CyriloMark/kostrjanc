import React, { useState, useEffect, useCallback } from 'react'

import { Animated, View, StyleSheet, ScrollView, RefreshControl, Pressable, Text, Alert, Image, Dimensions } from 'react-native';

import { getDatabase, ref, onValue, get, child, remove, set } from "firebase/database";
import { getAuth } from 'firebase/auth';

import MapView, { Marker } from 'react-native-maps';

import { impactAsync } from 'expo-haptics';

import CommentsModal from '../comp_variable_items/CommentsModal';
import ReportModal from '../comp_variable_items/ReportModal';
import UserListModal from '../comp_variable_items/UserListModal';

import SVG_Recent from '../../assets/svg/Recent';
import SVG_Basket from '../../assets/svg/Basket';
import SVG_Live from '../../assets/svg/Live';
import SVG_Event from '../../assets/svg/Event';
import SVG_Brush from '../../assets/svg/Brush';
import SVG_Cash from '../../assets/svg/Cash';
import SVG_Web from '../../assets/svg/Web';
import SVG_Flag from '../../assets/svg/Flag';

import BackHeader from '../comp_static_items/BackHeader';
import UserHeader from '../comp_static_items/UserHeader';
import ViewInteractionsBar from '../comp_static_items/ViewInteractionsBar';
import MainSplitLine from '../comp_static_items/MainSplitLine';

import { LinkButton } from '../comp_static_screens/Settings'

import { EVENT_TAGS, EVENT_TYPES, SelectableBtn } from './EventCreate';

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
    ending: 0,
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

const DEFAULT_ICON_WIDTH = Dimensions.get("window").width * 0.05;

const mapTypes = [
    "standard", "hybrid",
]

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
    const [currentMapType, setCurrentMapType] = useState(0);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const [isLive, setIsLive] = useState(false);
    
    const {eventID} = route.params;

    const checksDefaultFlex = new Animated.Value(9);

    const checkIfLive = (st, en) => {
        const date = Date.now();
        if (date >= st && date <= en) setIsLive(true);
        else setIsLive(false);
    }

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
            checkIfLive(data['starting'], data['ending']);
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
            .catch((error) => console.log("error EventView delEvent", error.code))
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
            Animated.spring(checksDefaultFlex, {
                toValue: 9,
                useNativeDriver: false,
                speed: 1
            }).start();
        } else {
            a.push(uid)
            setEvent({
                ...event,
                checks: a
            });
            Animated.spring(checksDefaultFlex, {
                toValue: 1,
                useNativeDriver: false,
                speed: 1,
            }).start();
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
                        .finally(() => {
                            get(child(ref(db), "logs"))
                                .then(snap => {
                                    let logs = [];
                                    if (snap.exists()) logs = snap.val();
                                    logs.push({
                                        action: "event_banned",
                                        mod: uid,
                                        target: eventID,
                                        timestamp: Date.now()
                                    });
                                    set(ref(db, "logs"), logs);
                                })
                        })
                        .catch(error => console.log("error EventView getLogs", error.code))
                    }
            }
        ])
    }


    return (
        <View style={ styles.container }>

            <CommentsModal type={1} title={event.title} visible={commentsVisible} close={ () => setCommentsVisible(false) }
                commentsList={event.comments} creator={event.creator} id={event.id}  />
            <ReportModal type={1} visible={reportVisible} close={ () => setReportVisible(false) } id={eventID}  />

            <UserListModal close={ () => setChecksVisible(false) } visible={checksVisible} title={"Tute ludźo su tež pódla"} userList={checksUserList} />

            <BackHeader style={ styles.backHeader } title="Ewent" onPress={ () => navigation.goBack() } />

            <ScrollView style={ styles.contentContainer } contentContainerStyle={ styles.contentInnerContainer } showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
                    style={{ marginTop: -5 }}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#000000"
                    title=''
                    colors={["#000000"]}
                />
            }>

                {
                    !event.isBanned ?
                        <UserHeader style={ styles.userHeader } onPress={ () => navigation.navigate('ProfileView', { userID: creator }) } user={user} userID={creator} /> :
                        <UserHeader style={ styles.userHeader } onPress={ () => {} } user={USER_PLACEHOLDER} userID={getAuth().currentUser.uid} />
                }

                    {/* Map */}
                <View style={ styles.mapOutlineContainer } >
                    <View style={ styles.mapContainer } >
                        {
                            !event.isBanned ?
                                (pin != null ?
                                <View>
                                    <MapView style={styles.map} userInterfaceStyle='dark' showsUserLocation showsScale mapType={mapTypes[currentMapType]}
                                        accessible={false} focusable={false}
                                        initialRegion={ event.geoCords } >
                                        {
                                            !event.isBanned ?
                                                <Marker title={event.title} coordinate={event.geoCords} /> : null

                                        }
                                    </MapView>
                                    <View style={ styles.mapTypeContainer }>

                                            {/* Standart */}
                                        <Pressable style={ styles.typeBtnContainer } onPress={ () => setCurrentMapType(0) } >
                                            <View style={ styles.typeBtnBG }>
                                                <SVG_Recent style={ styles.typeBtnIcon } fill="#000000" />
                                            </View>
                                        </Pressable>

                                            {/* Hybrid */}
                                        <Pressable style={ styles.typeBtnContainer } onPress={ () => setCurrentMapType(1) } >
                                            <View style={ styles.typeBtnBG }>
                                                <SVG_Recent style={ styles.typeBtnIcon } fill="#000000" />
                                            </View>
                                        </Pressable>

                                    </View>
                                </View> : null) : 
                                <View style={ styles.map }>
                                    <SVG_Basket style={ styles.delIcon } fill="#143C63" /> 
                                </View>
                        }
                    </View>
                </View>

                    {/* Text */}
                <View style={ styles.textContainer }>

                        {/* Title Container */}
                    <View style={ styles.titleContainer }>

                            {/* Live */}
                        {
                            isLive ?
                                <View style={ styles.liveContainer }>
                                    <SVG_Live style={ styles.liveIcon } fill="#B06E6A" /> 
                                </View> : null
                        }

                            {/* Title */}
                        <Text style={ styles.titleText }>
                            {event.title}
                        </Text>
                    </View>

                        {/* Desc */}
                    <Text style={ styles.descText }>
                        {event.description}
                    </Text>

                        {/* Times */}
                    <View style={ styles.timeContainer } >

                            {/* Starting */}
                        <View style={ styles.timeChildContainer }>
                            <View style={ styles.timeSignContainer }>
                                <SVG_Event style={ styles.timeIcon } fill="#5884B0" />
                            </View>
                            <Text style={ styles.timeText }>
                                {convertTimestampIntoString(event.starting)}
                            </Text>
                        </View>

                        <View style={ styles.timeChildContainer }>
                            <View style={ styles.timeSignContainer }>
                                <View style={ styles.timelineContainer }>
                                    <View style={ styles.timeline } />
                                </View>
                            </View>
                        </View>

                            {/* Ending */}
                        <View style={ styles.timeChildContainer }>
                            <View style={ styles.timeSignContainer }>
                                <SVG_Flag style={ styles.timeIcon } fill="#5884B0" />
                            </View>
                            <Text style={ styles.timeText }>
                                {convertTimestampIntoString(event.ending)}
                            </Text>
                        </View>
                    </View>
                </View>

                {
                    event.eventOptions ?
                        <MainSplitLine style={styles.line} /> : null
                }

                    {/* Event Options */}
                {
                    event.eventOptions && !event.isBanned ?
                        <View style={{ width: "100%" }} >

                                {/* Title */}
                            <Text style={[ styles.titleText, { marginBottom: 5, alignSelf: "baseline" } ]}>Přidatne informacije k ewenće</Text>

                            <View style={ styles.sectionInfoContainer }>


                                    {/* theme */}
                                {
                                    event.eventOptions.theme ?
                                        <View style={ styles.sectionIconTextContainer }>
                                            <View style={ styles.sectionIconContainer }>
                                                <SVG_Brush style={ styles.sectionIcon } fill="#5884B0" />
                                            </View>
                                            <View style={ styles.sectionBodyContainer }>
                                                <Text style={ styles.sectionText } >{event.eventOptions.theme}</Text>
                                            </View>
                                        </View>
                                        : null
                                }

                                    {/* typ */}
                                {
                                    event.eventOptions.type !== undefined ?
                                        <View style={ styles.sectionIconTextContainer }>
                                            <View style={ styles.sectionIconContainer }>
                                                <SVG_Event style={ styles.sectionIcon } fill="#5884B0" />
                                            </View>
                                            <View style={ styles.sectionBodyContainer }>
                                                <Text style={ styles.sectionText } >{EVENT_TYPES[event.eventOptions.type]}</Text>
                                            </View>
                                        </View>
                                        : null
                                }

                                    {/* entrance_fee */}
                                {
                                    event.eventOptions.entrance_fee !== undefined ?
                                        <View style={ styles.sectionIconTextContainer }>
                                            <View style={ styles.sectionIconContainer }>
                                                <SVG_Cash style={ styles.sectionIcon } fill="#5884B0" />
                                            </View>
                                            <View style={ styles.sectionBodyContainer }>
                                                <Text style={ styles.sectionText_Thin } numberOfLines={1} ellipsizeMode="clip" >{event.eventOptions.entrance_fee}€</Text>
                                            </View>
                                        </View>
                                        : null
                                }
                            </View>


                                {/* Website */}
                            {
                                event.eventOptions.website ?      
                                    <View style={ styles.sectionContainer }>
                                        <Text style={ styles.sectionTitleText }>Website</Text>
                                        <LinkButton lineAmt={1} style={ styles.sectionButton } title={event.eventOptions.website} link={event.eventOptions.website} />
                                    </View>                          
                                    : null
                            }

                                {/* Image */}
                            {
                                event.eventOptions.adBanner !== undefined ?
                                    <View style={ styles.sectionContainer }>
                                        <Text style={ styles.sectionTitleText }>Wabjenski plakat/wobraz</Text>
                                        <View style={ styles.adBannerOutlineContainer } >
                                            <View style={ styles.adBannerContainer } >
                                                <Image source={{ uri: event.eventOptions.adBanner.uri }} style={[ styles.img, { aspectRatio: event.eventOptions.adBanner.aspect } ]} resizeMode="cover" />
                                            </View>
                                        </View>
                                    </View>
                                    : null
                            }

                                {/* Tags */}
                            {
                                event.eventOptions.tags ?
                                    <View style={[ styles.sectionContainer, { marginVertical: 0, marginTop: 10 } ]}>
                                        <Text style={ styles.sectionTitleText }>Tags</Text>
                                        <View style={ styles.tagContainer }>
                                            {
                                                event.eventOptions.tags.map((tag, key) =>
                                                    <SelectableBtn key={key} style={ styles.tag } title={EVENT_TAGS[tag]} />
                                                )
                                            }
                                        </View>
                                    </View>
                                    : null
                            }

                        </View>
                    : null
                }

                <MainSplitLine style={styles.line} />

                    {/* Check + List */}
                <View style={ styles.checksContainer }>

                        {/* Check */}
                    <Pressable style={[ styles.checkBtnContainer, {
                        backgroundColor: !(event.checks.includes(uid)) ? "#B06E6A" : "#143C63" } ]}
                        onPress={ () => {
                                checkEvent();
                                impactAsync("medium");
                            } } >
                        <Text style={ styles.checksBtnText } >
                            { !(event.checks.includes(uid)) ? "Sym tež tu" : "Njejsym tu"}
                        </Text>
                    </Pressable>
                        
                        {/* List */}
                    <Pressable style={ styles.checksListContainer  } onPress={ getChecksUserList }>
                        <Text style={ styles.checksListText }>
                            <Text style={{fontFamily: "Barlow_Bold"}}>{event.checks.length}</Text> {getCorrectChecksWord(event.checks.length)} pódla</Text>                            
                    </Pressable>

                </View>

            </ScrollView>

            <ViewInteractionsBar style={ styles.interactionsContainer } userIsAdmin={userIsAdmin}
                onComment={ () => setCommentsVisible(true) }
                onReport={ () => setReportVisible(true) }
                onBan={ banEvent }
                comment={ !event.isBanned  } report={ !event.isBanned && uid != creator } ban={ !event.isBanned && uid != creator } />


        </View>
    )
}

function getCorrectChecksWord(size) {
    if (!(size == 1 || size == 2)) return "su";
    if (size == 1) return "je";
    if (size == 2) return "staj";
    return "su";
}

export const convertTimestampIntoString = (val) => {
    const date = new Date(val);

    let min = date.getMinutes().toString().length === 1 ?  "0" + date.getMinutes() : date.getMinutes()
    return (date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + min + " hodź.");
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
    },

    contentContainer: {
        flex: .8,
        width: "100%",
        paddingVertical: 5,
        borderRadius: 25,
    },
    contentInnerContainer: {
        paddingHorizontal: 10,
        backgroundColor: "#000",
        minHeight: "100%"
    },

    backHeader: {
        flex: .12,
        width: "100%",
    
        alignSelf: "center",
    
        zIndex: 99
    },
    userHeader: {
        width: "100%",
        alignItems: "center",
        marginVertical: 10
    },

    line: {
        width: "60%",
        alignSelf: "center",
    },

    mapOutlineContainer: {
        width: "100%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#143C63",
        
        zIndex: 3,
    },
    mapContainer: {
        width: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",

        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    },
    delIcon: {
        width: "50%",
        aspectRatio: 1,
        
        zIndex: 99,
    },

    mapTypeContainer: {
        width: "100%",
        aspectRatio: 8,
        marginTop: 10,

        flexDirection: "row",
    },
    typeBtnContainer: {
        flex: .1,
        height: "100%",
        marginHorizontal: 10,

        alignItems: "center",
        justifyContent: "center"
    },
    typeBtnBG: {
        aspectRatio: 1,
        height: "100%",

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        padding: 10,

        backgroundColor: "#5884B0"
    },
    typeBtnIcon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,
    },

    textContainer: {
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
    },

    titleContainer: {
        width: "100%",
        flexDirection: "row"
    },
    liveContainer: {
        alignSelf: "center",
        flex: .1,
        marginRight: 10,
    },
    liveIcon: {
        width: "100%",
        aspectRatio: 1,
    },

    titleText: {
        flex: .9,
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#5884B0",
        alignSelf: "center",
    },
    descText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
        marginVertical: 10
    },

    timeContainer: {
        width: "100%",
        alignItems: "center",
        flexDirection: "column"
    },
    timeChildContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    timeSignContainer: {
        width: DEFAULT_ICON_WIDTH,
        alignItems: "center",
        justifyContent: "center",
    },
    timeIcon: {
        width: "100%",
        aspectRatio: 1,
    },
    timeText: {
        fontFamily: "RobotoMono_Thin",
        fontSize: 20,
        color: "#5884B0",
        marginLeft: 10
    },
    timelineContainer: {
        aspectRatio: 1,
        marginVertical: 5,

        alignItems: "center",
        justifyContent: "center",
    },
    timeline: {
        width: 1,
        height: 25,
        backgroundColor: "#5884B0"
    },

    sectionInfoContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap"
    },

    sectionContainer: {
        width: "100%",
        marginTop: 10
    },
    sectionButton: {
        width: "100%",
        marginTop: 5,
    },
    sectionTitleText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
        marginBottom: 5
    },

    sectionIconTextContainer: {
        flexDirection: "row",
        alignItems: "center",

        margin: 5
    },
    sectionIconContainer: {
        width: DEFAULT_ICON_WIDTH,
        alignItems: "center",
        justifyContent: "center",
    },
    sectionIcon: {
        width: "100%",
        aspectRatio: 1
    },
    sectionBodyContainer: {
        justifyContent: "center",
        paddingHorizontal: 10
    },
    sectionText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
    },
    sectionText_Thin: {
        fontFamily: "RobotoMono_Thin",
        fontSize: 20,
        color: "#5884B0",
    },

    adBannerOutlineContainer: {
        width: "100%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",

        marginTop: 5,
        
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#143C63",
        
        zIndex: 3,
    },
    adBannerContainer: {
        width: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    },
    img: {
        width: "100%",
        alignSelf: "center",

        justifyContent: "center",
        alignItems: "center"
    },

    tagContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    tag: {
        margin: 5,
    },


    interactionsContainer: {
        height: "6%",
        width: "100%",
        alignSelf: "center",
        zIndex: 99,
    },


    checksContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    checkBtnContainer: {
        flex: 1,
        width: "60%",

        borderRadius: 15,

        marginBottom: 10,

        paddingHorizontal: 25,
        paddingVertical: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    checksBtnText: {
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#000000",
    },
    checksListContainer: {
        flex: 1,
        width: "100%",

        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",

        position: "relative",

        paddingHorizontal: 25,
        paddingVertical: 10,

        justifyContent: "center",
    },
    checksListText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
        textAlign: "center"
    },
});