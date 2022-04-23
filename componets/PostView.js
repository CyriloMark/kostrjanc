import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text, Image, Alert } from 'react-native';

import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, get, child, set } from "firebase/database";

import SVG_Recent from '../assets/svg/Recent';
import SVG_Share from '../assets/svg/Share';
import SVG_Warn from '../assets/svg/Warn';

import BackHeader from './statics/BackHeader';
import UserHeader from './statics/UserHeader';
import DeleteButton from './statics/DeleteButton';

import CommentsModal from './statics/CommentsModal';
import ReportModal from './statics/ReportModal';

const USER_PLACEHOLDER = {
    name: "",
    pbUri: "https://www.colorhexa.com/587db0.png"
}
const POST_PLACEHOLDER = {
    title: "",
    creator: "",
    description: "",
    imgUri: "https://www.colorhexa.com/587db0.png",
    created: "27.3.2022 21:20",
    comments: []
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

    const [creator, setCreator] = useState(null);

    const [commentsVisible, setCommentsVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);

    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [post, setPost] = useState(POST_PLACEHOLDER)
    const {postID} = route.params;

    const loadData = () => {
        const db = getDatabase();
        onValue(ref(db, 'posts/' + postID), snapshot => {
            const data = snapshot.val();
            
            setCreator(data['creator']);

            setPost({
                id: data['id'],
                creator: data['creator'],
                title: data['title'],
                description: data['description'],
                imgUri: data['imgUri'],
                created: data['created'],
                comments: snapshot.hasChild('comments') ? data['comments'] : [],
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
                        ageGroup: data['ageGroup']
                    });
                }
                else {
                    setUser(USER_PLACEHOLDER);
                }
            })
    }

    useEffect(() => {
        if (post === POST_PLACEHOLDER) loadData();
    }, []);

    useEffect(() => {
        if (creator === null) return;
        loadUser();
    }, [creator]);

    return (
        <View style={ styles.container }>
        
            <CommentsModal type={0} title={post.title} visible={commentsVisible} close={ () => setCommentsVisible(false) } commentsList={post.comments} postID={post.id} />
            <ReportModal type={0} visible={reportVisible} close={ () => setReportVisible(false) } id={postID} />

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title="Post" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    /> }>

                <UserHeader onPress={ () => navigation.navigate('ProfileView', { userID: creator }) } user={user} userID={creator} />

                    {/* Post */}
                <View style={[ styles.postContainer, styles.shadow ]} >
                    <Image source={{ uri: post.imgUri }} style={ styles.img } resizeMode="cover" />
                </View>

                    {/* Interations */}
                <View style={[ styles.interactionsContainer, styles.shadow ]}>
                        {/* Comment */}
                    <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} onPress={ () => setCommentsVisible(true) } >
                        <SVG_Recent style={ styles.postInteractionsItemText } fill="#B06E6A" />
                    </Pressable>
                        {/* Share */}
                    <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} >
                        <SVG_Share style={ styles.postInteractionsItemText } fill="#B06E6A" />
                    </Pressable>
                        {/* Report */}
                    <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} onPress={ () => setReportVisible(true) } >
                        <SVG_Warn style={ styles.postInteractionsItemText } fill="#B06E6A" />
                    </Pressable>
                </View>

                    {/* Describtion */}
                <View style={ styles.descriptionContainer }>
                    <Text style={ styles.titleText }>{post.title}</Text>
                    <Text style={ styles.descriptionText }>{post.description}</Text>
                </View>

                    {/* Delete */}
                {
                    getAuth().currentUser.uid === creator ?    
                        <DeleteButton style={ styles.deleteBtn } /> :
                        null
                }

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

    postContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        marginTop: 10,
        position: "relative",
        overflow: "hidden"
    },
    img: {
        width: "100%",
        aspectRatio: 3/4,
        alignSelf: "center"
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


    deleteBtn: {
        width: "60%",
        marginTop: 25,
        alignSelf: "center"
    },
});