import React, { useCallback, useState, useEffect } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, KeyboardAvoidingView, Keyboard, Platform } from "react-native";

import Navbar from '../statics/Navbar';
import SearchHeader from '../statics/SearchHeader';

import UserCard from '../statics/UserHeader';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Search({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers(input);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    
    const [input, setInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const fetchUsers = (text) => {
        if (text.length <= 0) {
            setSearchResult([]);
            return;
        }

        fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/users.json")
            .then(
                response => response.json()
            )
                .then(responseData => {
                    setSearchResult([]);

                    let searchQuery = text.toLowerCase();

                    for (const key in responseData) {
                        let user = responseData[key].name.toLowerCase();

                        if (user.slice(0, searchQuery.length).indexOf(searchQuery) !== -1) {

                            if (searchResult.length <= 10) {
                                setSearchResult(prevResult => {
                                    return [...prevResult, {
                                        name: responseData[key].name,
                                        pbUri: responseData[key].pbUri,
                                        id: key
                                    }]
                                })
                            }

                        }
                    }
                })
    }

    return (
        <View style={ styles.container } >
            <KeyboardAvoidingView behavior='height' enabled={ Platform.OS != 'ios' } style={{ height: "100%" }}>

                <SearchHeader style={ styles.searchHeader } input={input} onPress={ () => fetchUsers(input) } onText={ (text) => {
                    setInput(text);
                    fetchUsers(text);
                } } />
                    
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
                        searchResult.length !== 0 ?
                        searchResult.map((user, key) =>
                            <UserCard key={key} user={user} style={ styles.card } userID={user.id} onPress={ () => navigation.navigate('ProfileView', { userID: user.id }) } />
                        ) : <Text style={ styles.hint }>Pytaj za něčim!</Text>
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

    hint: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#143C63",
        textAlign: "center",
        marginVertical: 25
    }
})