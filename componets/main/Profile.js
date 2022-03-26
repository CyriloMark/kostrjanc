import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, Image } from "react-native";

import Navbar from '../statics/Navbar';
import EventCard from '../statics/EventCard';
import PostPreview from '../statics/PostPreview';

import { PostType } from '../statics/PostPreview';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Data = [
    {
        id: 0,
        type: PostType.Event,
        name: "hey",
        description: "test",
        geoCords: {
            latitude: 51.2392335862277,
            longitude: 14.281389642218592,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
        },
        checked: false
    },
    {
        id: 1,
        type: PostType.Post,
        name: "du bist hässlich\ndu\nstinkts\nund bist dumm!",
        description: "test",
        imgUri: 'https://play-lh.googleusercontent.com/NKnjiKMPtPaDcfN_mcG-F1nR9nBHgZAclG5IkfVrfpekMy0SoGagXbVdRXv1C1mIKhc=s180',
        liked: false
    },
    {
        id: 2,
        type: PostType.Event,
        name: "esel bist ja ein mongo geh töten",
        description: "test",
        geoCords: {
            latitude: 51.2392335862277,
            longitude: 14.281389642218592,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
        },
        checked: false
    },
    {
        id: 3,
        type: PostType.Event,
        name: "du",
        description: "test",
        geoCords: {
            latitude: 51.180707,
            longitude: 14.427958,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
        },
        checked: true
    },
    {
        id: 4,
        type: PostType.Post,
        name: "esel",
        description: "test",
        imgUri: 'https://glaswerk24.de/images/product_images/original_images/white_close_up_10.png',
        liked: false
    },
    {
        id: 5,
        type: PostType.Post,
        name: "hay ",
        description: "test\ns",
        imgUri: 'https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/Basti%20Party%20Cover.png?alt=media&token=bb5d175c-788a-4823-845c-fcf2aba6e4cf',
        liked: false
    },
];

const user = {
    name: "Cyril Mark",
    pbUri: "https://picsum.photos/536/354"
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

export default function Profile({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    
    const [pinEventChecked, setPinEventChecked] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={ styles.container } >

            <Navbar style={ styles.navbar } active={3}
                onPressRecent={ () => { navigation.navigate("Recent") }}
                onPressSearch={ () => { navigation.navigate("Search") }}
                onPressAdd={ () => { navigation.navigate("Add") }}
                onPressProfile={ () => { navigation.navigate("Profile") }}
            />


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
                    <Text style={ styles.profileBioText }>Elit dolore eu non fugiat proident laboris sunt laborum dolor et ad consectetur sunt esse.</Text>
                </View>

                <EventCard onPress={ () => navigation.navigate('EventView', { user: user, item: Data[3] }) } item={Data[3]} style={ styles.eventCardAlert } onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />

                    {/* Post List */}
                <View style={ styles.postContainer }>
                    { arraySplitter(Data, 2).map((list, listKey) => 
                        <View key={listKey} style={ styles.postItemListContainer }>
                            { list.map((item, itemKey) => 
                                <PostPreview key={itemKey} item={item} style={ styles.postPreview }
                                    press={ () => navigation.navigate(item.type === PostType.Post ? 'PostView' : 'EventView', { user: user, item: item }) } />
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

    navbar: {
        width: "80%",
        height: "10%",
        bottom: "5%",
        alignSelf: "center",
        position: "absolute",
        zIndex: 99,
    
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
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
    