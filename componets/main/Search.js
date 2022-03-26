import React, { useCallback, useState } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, KeyboardAvoidingView, Keyboard, Platform } from "react-native";

import Navbar from '../statics/Navbar';
import SearchHeader from '../statics/SearchHeader';

import UserCard from '../statics/UserHeader';

const userList = [
    {
        name: "Cyril Mark",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "StanchMat",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "Lucinnnn",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "Fijałka",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "Cyril Mark",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "StanchMat",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "Lucinnnn",
        pbUri: "https://picsum.photos/536/354"
    },
    {
        name: "Fijałka",
        pbUri: "https://picsum.photos/536/354"
    },
]

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Search({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={ styles.container } >
            <KeyboardAvoidingView behavior='height' enabled={ Platform.OS != 'ios' } style={{ height: "100%" }}>

                <SearchHeader style={ styles.searchHeader } />
                    
                <Navbar style={ styles.navbar } active={1}
                    onPressRecent={ () => { navigation.navigate("Recent") }}
                    onPressSearch={ () => { navigation.navigate("Search") }}
                    onPressAdd={ () => { navigation.navigate("Add") }}
                    onPressProfile={ () => { navigation.navigate("Profile") }}
                />

                <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "35%", }]}
                    showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }} keyboardDismissMode='on-drag' refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                    />
                }>

                    {
                        userList.map((user, key) =>
                            <UserCard key={key} user={user} style={ styles.card } />
                        )
                    }

                </ScrollView>

            </KeyboardAvoidingView>
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

    searchHeader: {
        position: "absolute",
        height: "10%",
        width: "100%",
        top: 10,

        alignSelf: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,

        zIndex: 99
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

    card: {
        width: "90%",
        position: "relative",
        marginTop: "5%",
        alignSelf: "center",
    
        elevation: 10,
    },
})