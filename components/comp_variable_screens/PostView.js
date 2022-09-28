import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text, Image, Alert } from 'react-native';

import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, get, child, set } from "firebase/database";

import { Share as Share_Post } from '../comp_variable_items/PostShare';

import SVG_Basket from '../../assets/svg/Basket';
import SVG_Ad from '../../assets/svg/Ad';

import BackHeader from '../comp_static_items/BackHeader';
import UserHeader from '../comp_static_items/UserHeader';

import CommentsModal from '../comp_variable_items/CommentsModal';
import ReportModal from '../comp_variable_items/ReportModal';
import ViewInteractionsBar from '../comp_static_items/ViewInteractionsBar';

const USER_PLACEHOLDER = {
    name: "",
    pbUri: "https://www.colorhexa.com/587db0.png",
    isAdmin: false
}
const POST_PLACEHOLDER = {
    title: "",
    type: 0,
    creator: "",
    description: "",
    imgUri: "https://www.colorhexa.com/587db0.png",
    created: "27.3.2022 21:20",
    comments: [],
    isBanned: false
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function PostView({ navigation, route }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const uid = getAuth().currentUser.uid;

    const [creator, setCreator] = useState(null);

    const [commentsVisible, setCommentsVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);

    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [post, setPost] = useState(POST_PLACEHOLDER)
    const {postID, isBusinessPost} = route.params;
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const loadData = () => {
        const db = getDatabase();
        onValue(ref(db, 'posts/' + postID), snapshot => {
            if (!snapshot.exists()) {
                setPost({
                    ...POST_PLACEHOLDER,
                    isBanned: true
                });
                return;
            }
            const data = snapshot.val();
            
            setCreator(data['creator']);

            if (snapshot.hasChild('isBanned')) {
                if (data['isBanned']) {
                    setPost({
                        ...POST_PLACEHOLDER,
                        isBanned: true
                    });
                    return;
                }
            }

            setPost({
                ...data,
                comments: snapshot.hasChild('comments') ? data['comments'] : [],
                isBanned: false
            });
        });
    }

    const loadUser = () => {
        const db = ref(getDatabase());
        get(child(db, 'users/' + creator))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    const data = snapshot.val();

                    setUser({
                        name: data['name'],
                        description: data['description'],
                        pbUri: data['pbUri'],
                        gender: data['gender'],
                        ageGroup: data['ageGroup'],
                        isAdmin: snapshot.hasChild('isAdmin') ? data['isAdmin'] : false
                    });
                }
                else {
                    setUser(USER_PLACEHOLDER);
                }
            }).finally(() => {
                get(child(db, "users/" + uid + "/isAdmin"))
                    .then(snapshot => {
                        if (!snapshot.exists()) return;
                        const isA = snapshot.val();
                        setUserIsAdmin(isA);
                    })
            })
    }

    const deletePost = () => {
        const db = getDatabase();
        const storage = db;

        set(ref(db, "posts/" + postID), null)
            .then(() => {

                get(child(ref(db), "users/" + creator))
                    .then((snapshot) => {
                        const data = snapshot.val();
                        let a = data['posts'];
                        a.splice(a.indexOf(postID), 1);
                        set(ref(db, "users/" + creator), {
                            ...data,
                            posts: a
                        }).finally(() => navigation.goBack())
                    })
            })
    }

    useEffect(() => {
        if (post === POST_PLACEHOLDER) loadData();
    }, []);

    useEffect(() => {
        if (creator === null) return;
        loadUser();
    }, [creator]);

    const banPost = () => {

        Alert.alert("Chceš tutón post banować?", "Chceš woprawdźe post banować? Post je banowany, wužiwar nic.", [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    const db = getDatabase();
                    get(child(ref(db), "users/" + uid + "/isAdmin"))
                        .then(snapshot => {
                            if (!snapshot.exists()) return;
                            const isAdmin = snapshot.val();
                            if (!isAdmin) return;

                            set(ref(db, "posts/" + post.id), {
                                ...post,
                                isBanned: true
                            });
                        })
                        .finally(() => {
                            get(child(ref(db), "logs"))
                                .then(snap => {
                                    let logs = [];
                                    if (snap.exists()) logs = snap.val();
                                    logs.push({
                                        action: "post_banned",
                                        mod: uid,
                                        target: postID,
                                        timestamp: Date.now()
                                    });
                                    set(ref(db, "logs"), logs);
                                })
                        })
                        .catch(error => console.log("error PostView getLogs", error.code))
                    }
            }
        ])
    }

    return (
        <View style={[ styles.container ]}>

            <CommentsModal type={0} title={post.title} visible={commentsVisible} close={ () => setCommentsVisible(false) }
                commentsList={post.comments} creator={post.creator} id={post.id} />
            <ReportModal type={0} visible={reportVisible} close={ () => setReportVisible(false) } id={postID} />

            <BackHeader style={ styles.backHeader } title="Post" onPress={ () => navigation.goBack() } />

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
                    !post.isBanned ?
                        <UserHeader style={ styles.userHeader } onPress={ () => navigation.navigate('ProfileView', { userID: creator }) } user={user} userID={creator} /> :
                        <UserHeader style={ styles.userHeader } onPress={ () => {} } user={USER_PLACEHOLDER} userID={uid} />
                }

                    {/* Post */}
                <View style={[ styles.postOutlineContainer, { borderColor: !isBusinessPost ? "#143C63" : "#B06E6A" } ]} >
                    <View style={ styles.postContainer } >
                        {
                            !post.isBanned ?
                                <Image source={{ uri: post.imgUri }} style={ styles.img } resizeMode="cover" /> :
                                <View style={ styles.img }>
                                    <SVG_Basket style={ styles.pbImageIcon } fill="#143C63" /> 
                                </View>
                        }
                    </View>
                </View>


                    {/* Text */}
                <View style={ styles.textContainer }>
                        {/* Title */}
                    <Text style={[ styles.titleText, { color: !isBusinessPost ? "#143C63" : "#B06E6A" } ]}>
                        {post.title}
                    </Text>

                        {/* Desc */}
                    <Text style={[ styles.descText, { color: !isBusinessPost ? "#143C63" : "#B06E6A" } ]}>
                        {post.description}
                    </Text>
                    
                    {
                        isBusinessPost ?
                            <SVG_Ad style={styles.businessIcon} fill="#B06E6A" /> : null
                    }
                </View>

            </ScrollView>

            <ViewInteractionsBar style={ styles.interactionsContainer } userIsAdmin={userIsAdmin}
                onComment={ () => setCommentsVisible(true) }
                onShare={ () => Share_Post(post.imgUri, post.title) }
                onReport={ () => setReportVisible(true) }
                onBan={ banPost }
                comment={ !post.isBanned } share={ !post.isBanned  } report={ !post.isBanned && uid != creator } ban={ !post.isBanned && uid != creator } />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63"
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


    postOutlineContainer: {
        width: "100%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#143C63",
        
        zIndex: 3,
    },
    postContainer: {
        width: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    },
    img: {
        width: "100%",
        aspectRatio: 3/4,
        alignSelf: "center",

        justifyContent: "center",
        alignItems: "center"
    },
    pbImageIcon: {
        width: "50%",
        aspectRatio: 1,
        
        zIndex: 99,
    },


    textContainer: {
        width: "90%",
        alignSelf: "center",
        marginVertical: 10
    },
    titleText: {
        width: "100%",
        marginBottom: 10,

        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },
    descText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
    },


    interactionsContainer: {
        height: "6%",
        width: "100%",
        alignSelf: "center",
        zIndex: 99,
    },

    businessIcon: {
        width: 50,
        aspectRatio: 5/3,
        marginTop: 10,

    }
});