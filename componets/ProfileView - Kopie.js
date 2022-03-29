import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, Image } from "react-native";

import { getDatabase, ref, child, get, onValue } from "firebase/database";

import BackHeader from './statics/BackHeader';
import PostPreview from './statics/PostPreview';

const USER_Placeholder = {
    name: "",
    description: "",
    ageGroup: 0,
    gender: 0,
    pbUri: "https://www.colorhexa.com/587db0.png",
    posts: [],
    events: []
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
    
    const [user, setUser] = useState(USER_Placeholder);;

    const [postEventList, setPostEventList] = useState([]);

    const {userID} = route.params;

    const loadUser = () => {

        const db = getDatabase();

        let postEventDatas = [];

        onValue(ref(db, 'users/' + userID), snapshot => {
            const data = snapshot.val();

            let userData = {
                name: data['name'],
                description: data['description'],
                ageGroup: data['ageGroup'],
                gender: data['gender'],
                pbUri: data['pbUri'],
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
                            if (!hasEvents) sortArrayByDate(postEventDatas);
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
                            sortArrayByDate(postEventDatas);
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

        setPostEventList(dates);
    }

    useEffect(() => {
        if (user === USER_Placeholder) loadUser();
    }, []);

    return (
        <View style={ styles.container } >

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title="Event" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", flex: 1 }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "35%" }]} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
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

                    {/* Profile Bio */}
                <View style={ styles.profileBioContainer }>
                    <Text style={ styles.profileBioText }>{user.description}</Text>
                </View>

                    {/* Post List */}
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
        padding: "5%",
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

    profileBioContainer: {
        width: "90%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        position: "relative",
        marginTop: "2%",
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

    eventCardAlert: {
        width: "90%",
        position: "relative",
        marginTop: "5%",
        alignSelf: "center",   
        elevation: 10     
    },

    postContainer: {
        width: "100%",

        position: "relative",
        marginTop: "5%",
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
        margin: "2%",
    }
});
