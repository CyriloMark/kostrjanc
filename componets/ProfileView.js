import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, Image, Pressable } from "react-native";

import { getDatabase, ref, child, get, onValue, set } from "firebase/database";
import { getAuth } from 'firebase/auth';

import BackHeader from './statics/BackHeader';
import PostPreview from './statics/PostPreview';

import SVG_Admin from '../assets/svg/Admin';
import SVG_Moderator from '../assets/svg/Moderator';

const USER_PLACEHOLDER = {
    name: "",
    description: "",
    ageGroup: 0,
    gender: 0,
    pbUri: "https://www.colorhexa.com/587db0.png",
    posts: [],
    events: [],
    follower: [],
    following: []
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const arraySplitter = (data , coloums) => {

    let splitter = Math.floor(data.length / coloums) + ((data.length % coloums) === 0 ? 0 : 1);
    let newData = [];
    
    for (let i = 0; i < splitter; i++) {

        let currentObject = [];
        for (let j = i * coloums; j < coloums + i * coloums; j++) {
            if (j < data.length)
                currentObject.push(data[j]);
        }
        newData.push(currentObject);
    }
    return(newData);
}

export default function ProfileView({ navigation, route }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadUser();
        wait(2000).then(() => setRefreshing(false));
    }, []);
    
    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [following, setFollowing] = useState(false);

    const [postEventList, setPostEventList] = useState([]);

    const {userID} = route.params;

    const loadUser = () => {

        const db = getDatabase();

        let postEventDatas = [];

        onValue(ref(db, 'users/' + userID), snapshot => {
            const data = snapshot.val();

            let userData = {
                ...data,
                follower: snapshot.hasChild('follower') ? data['follower'] : [],
                following: snapshot.hasChild('following') ? data['following'] : []
            };

            const hasPosts = snapshot.hasChild('posts');
            const hasEvents = snapshot.hasChild('events');

            if (!hasPosts && !hasEvents) setUser(userData);

            if (hasPosts) {
                const posts = data['posts'];
                
                userData = {
                    ...userData,
                    posts: posts
                }
                if (!hasEvents) setUser(userData);

                for(let i = 0; i < posts.length; i++) {
                    get(child(ref(db), "posts/" + posts[i]))
                        .then((post) => {
                            const postData = post.val();
    
                            postEventDatas.push(postData);
                            if (i === posts.length - 1 && !hasEvents) sortArrayByDate(postEventDatas);
                        })
                        .catch((error) => console.log("error posts", error.code));
                }
            }
            
            if (hasEvents){
                const events = data['events'];
                
                userData = {
                    ...userData,
                    events: events
                }
                setUser(userData);

                for(let i = 0; i < events.length; i++) {
                    get(child(ref(db), "events/" + events[i]))
                        .then((event) => {
                            const eventData = event.val();
    
                            postEventDatas.push(eventData);
                            if (i === events.length - 1) sortArrayByDate(postEventDatas);
                        })
                        .catch((error) => console.log("error events", error.code));
                }
            }

        });
    }

    const sortArrayByDate = (data) => {
        let dates = data;
        for(let i = data.length - 1; i >= 0; i--) {
            for (let j = 1; j <= i; j++) {
                if (dates[j - 1].created > dates[j].created) {
                    let temp = dates[j - 1];
                    dates[j - 1] = dates[j];
                    dates[j] = temp;
                }
            }
        }
        dates.reverse();

        setPostEventList(dates);
    }

    const follow = () => {

        const db = getDatabase();
        const uid = getAuth().currentUser.uid;

        get(child(ref(db), "users/" + uid))
            .then((result) => {

                if (result.exists()) {
                    let a = result.val();

                    let following = [];
                    if (result.hasChild('following')) following = a['following'];
                    else following = [];
                    following.push(userID);

                    set(ref(db, "users/" + uid), {
                        ...a,
                        following: following
                    })
                        .catch((error) => console.log("error s", error.code))
                }

            })
            .catch((error) => console.log("error g", error.code))
            .finally(() => {

                get(child(ref(db), "users/" + userID))
                    .then((result) => {

                        if (result.exists()) {
                            let a = result.val();

                            let follower = [];
                            if (result.hasChild('follower')) follower = a['follower'];
                            else follower = [];
                            follower.push(uid);

                            set(ref(db, "users/" + userID), {
                                ...a,
                                follower: follower
                            })
                                .catch((error) => console.log("error s", error.code))
                        }

                    })
                    .catch((error) => console.log("error g", error.code))
                    .finally(() => setFollowing(true));
            })
    }

    const unfollow = () => {
        const db = getDatabase();
        const uid = getAuth().currentUser.uid;

        get(child(ref(db), "users/" + uid))
            .then((result) => {

                if (result.exists()) {
                    let a = result.val();

                    let following = a['following'];
                    console.log(following);
                    following.splice(following.indexOf(userID), 1);

                    set(ref(db, "users/" + uid), {
                        ...a,
                        following: following
                    })
                        .catch((error) => console.log("error s", error.code))
                }

            })
            .catch((error) => console.log("error g 3", error.code))
            .finally(() => {

                get(child(ref(db), "users/" + userID))
                    .then((result) => {

                        if (result.exists()) {
                            let a = result.val();

                            let follower = a['follower'];
                            follower.splice(follower.indexOf(uid), 1);

                            set(ref(db, "users/" + userID), {
                                ...a,
                                follower: follower
                            }).catch((error) => console.log("error s", error.code))
                        }

                    })
                    .catch((error) => console.log("error g 2", error.code))

                    .finally(() => setFollowing(false));
            })
    }

    useEffect(() => {
        
        get(child(ref(getDatabase()), "users/" + getAuth().currentUser.uid + "/following"))
            .then((result) => {
                if (result.exists()) {
                    const data = result.val();
                    setFollowing(data.includes(userID));
                } else setFollowing(false);
            })
    })

    useEffect(() => {
        if (user === USER_PLACEHOLDER) loadUser();
    }, []);

    return(
        <View style={ styles.container } >

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title={user.name} onPress={ () => navigation.goBack() } />
            
            <ScrollView style={{ width: "100%", marginTop: "25%", flex: 1 }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "35%" }]} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    /> }>


                    {/* Profile Header */}
                <View style={ styles.profileHeader }>

                        {/* Icon */}
                    <View style={ styles.profileHeaderIconContainer } >
                        <Image source={{ uri: user.pbUri }} style={ styles.profileHeaderIcon } resizeMode="cover" />
                    </View>

                    <View style={ styles.profileHeaderTextContainer }>
                        <Text style={ styles.profileHeaderText }>
                            {user.name}
                        </Text>
                    </View>
                </View>

                {
                    user.isAdmin ?
                        <SVG_Admin style={styles.adminCrown} fill={"#B06E6A"} /> : null
                }
                {
                    user.isMod ?
                        <SVG_Moderator style={styles.adminCrown} fill={"#B06E6A"} /> : null
                }

                    {/* Follow */}
                {
                    getAuth().currentUser.uid !== userID ?
                            !following ?
                                <Pressable style={[ styles.followBtn, { backgroundColor: "#B06E6A" } ]} onPress={ follow }>
                                    <Text style={[ styles.followText, { color: "#143C63" } ]}>Sćěhować</Text>
                                </Pressable> : 
                                <Pressable style={[ styles.followBtn, { backgroundColor: "#143C63", } ]} onPress={ unfollow }>
                                    <Text style={[ styles.followText, { color: "#5884B0" } ]}>Wjac nic sćehować</Text>
                                </Pressable>
                        : null
                        
                }

                    {/* Profile Bio */}
                <View style={ styles.profileBioContainer }>
                    <Text style={ styles.profileBioText }>{user.description}</Text>
                </View>

                <View style={ styles.postContainer }>
                    { arraySplitter(postEventList, 2).map((list, listKey) => 
                        <View key={listKey} style={ styles.postItemListContainer }>
                            { list.map((item, itemKey) => 
                                <PostPreview key={itemKey} item={item} style={ styles.postPreview }
                                    press={ () => {
                                        item.type === 0 ?
                                            navigation.navigate('PostView', { postID: item.id }) :
                                            navigation.navigate('EventView', { eventID: item.id })
                                    } } />
                            ) }
                        </View>
                    ) }
                </View>

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
    },

    backHeader: {
        position: "absolute",
        width: "100%",
        height: "10%",
        top: 10,
        alignSelf: "center",

        zIndex: 99
    },

    profileHeader: {
        width: "100%",
        flexDirection: "row",
    },
    profileHeaderIconContainer: {
        flex: 1,
        padding: 10,
    },
    profileHeaderIcon: {
        aspectRatio: 1,
        borderRadius: 100,
    },
    profileHeaderTextContainer: {
        flex: 2,
        justifyContent: "center",
    },
    profileHeaderText: {
        fontFamily: "Inconsolata_Black",
        textAlign: "center",
        fontSize: 25,
        color: "#143C63",
        elevation: 10,
    },

    adminCrown: {
        aspectRatio: 1,
        width: "60%",
        alignSelf: "center",
        marginVertical: 10
    },

    followBtn: {
        width: "60%",
        padding: 25,
        marginVertical: 10,
        
        borderRadius: 25,

        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    followText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },

    profileBioContainer: {
        width: "90%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        position: "relative",
        marginVertical: 10,
        alignSelf: "center",
        
        paddingHorizontal: 25,
        paddingVertical: 10,

        elevation: 10,
    },
    profileBioText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#5884B0"
    },

    postContainer: {
        width: "100%",

        position: "relative",
        marginVertical: 10,
    },


    postItemListContainer: {
        width: "100%",
        flexDirection: "row",
        padding: 0,
        margin: 0,
    },
    
    postPreview: {
        flex: 1,
        aspectRatio: .9,
        margin: 10,
    }
})