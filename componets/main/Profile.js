import React, { useState, useEffect, useCallback } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, Pressable, FlatList } from "react-native";

import EventCard from '../statics/EventCard';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Data = [
    {
        id: 1,
        name: "hey"
    },
    {
        id: 2,
        name: "du"
    },
    {
        id: 3,
        name: "esel"
    },
    {
        id: 4,
        name: "du"
    },
    {
        id: 5,
        name: "esel"
    },
    {
        id: 6,
        name: "du"
    },
    {
        id: 7,
        name: "esel"
    },
];

const data3 = [
    [
        {
            id: 1,
            name: "hey"
        },
        {
            id: 2,
            name: "du"
        },
    ],
    [
        {
            id: 3,
            name: "hey"
        },
        {
            id: 4,
            name: "du"
        },
    ],
    [
        {
            id: 5,
            name: "hey"
        },
        {
            id: 6,
            name: "du"
        },
    ],
    [
        {
            id: 7,
            name: "hey"
        },
    ],
];

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
}

export default function Profile() {

    const [refreshing, setRefreshing] = useState(false);
    
    const [splittedData, setSplittedData] = useState([{ id: 0, name: "" }]);
    const [data, setData] = useState(data3);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        setSplittedData(arraySplitter(Data, 2));
    });

    return (
        <View style={ styles.container } >
            <ScrollView contentContainerStyle={{ width: "100%" }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
                }>

                    {/* Profile Header */}
                <View style={ styles.profileHeader }>

                        {/* Icon */}
                    <View style={ styles.profileHeaderIconContainer } >
                        <View style={ styles.profileHeaderIcon } />
                    </View>

                    <View style={ styles.profileHeaderTextContainer }>
                        <Text style={ styles.profileHeaderText }>
                            Cyril Mark
                        </Text>
                    </View>
                </View>

                    {/* Profile Bio */}
                <View style={ styles.profileBioContainer }>
                    <Text style={ styles.profileBioText }>Elit dolore eu non fugiat proident laboris sunt laborum dolor et ad consectetur sunt esse.</Text>
                </View>

                <EventCard style={ styles.eventCardAlert } title="Witaj, kak so ći wjedźe?" bio="sy tež tu?" />

                    {/* Post List */}
                <View style={ styles.postContainer }>
                    { data.map((list, listKey) => 
                        <View key={listKey} style={ styles.postItemListContainer }>
                            { list.map((item, itemKey) => 
                                <View key={itemKey} style={ styles.postItemContainer } >
                                    <Text style={ styles.postItemText } >{item.name}</Text>
                                </View>
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
        padding: 10,
    },

    profileHeader: {
        width: "100%",
        flexDirection: "row",
    },
    profileHeaderIconContainer: {
        flex: 1,
        padding: "5%"
    },
    profileHeaderIcon: {
        aspectRatio: 1,
        borderRadius: 100, 
        backgroundColor: "#C4C4C4",
    },
    profileHeaderTextContainer: {
        flex: 2,
        justifyContent: "center",
    },
    profileHeaderText: {
        fontFamily: "Inconsolata_Black",
        textAlign: "center",
        fontSize: 25,
        color: "#143C63"
    },

    profileBioContainer: {
        width: "100%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        position: "relative",
        marginTop: "2%",
        alignSelf: "center",
        
        paddingHorizontal: 25,
        paddingVertical: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 5,
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

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 5,
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
    postItemContainer: {
        flex: 1,
        margin: "2%",
        aspectRatio: .9,
        borderRadius: 25,


        justifyContent: "center",
        alignItems: "center",
        padding: 10,

        backgroundColor: "#143C63",
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 5,
    },
    postItemText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#5884B0",
    },
});
    