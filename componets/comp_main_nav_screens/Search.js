import React, { useCallback, useState, useEffect } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, Keyboard, Platform } from "react-native";

import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth } from 'firebase/auth';

import Navbar from '../comp_static_items/Navbar';
import SearchHeader from '../comp_static_items/SearchHeader';
import UserCard from '../comp_static_items/UserHeader';

import { lerp } from './Landing';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Search({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers(input);
        getRandomUser();
        wait(2000).then(() => setRefreshing(false));
    }, []);
    
    const [input, setInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [randomUser, setRandomUser] = useState(null);

    const fetchUsers = (text) => {
        if (text.length <= 0) {
            setSearchResult([]);
            return;
        }

        const db = getDatabase();
        get(child(ref(db), "users"))
            .then(snapshot => {
                setSearchResult([]);

                const data = snapshot.val();

                let searchQuery = text.toLowerCase();

                for (const key in data) {
                    let user = data[key].name.toLowerCase();

                    if (user.slice(0, searchQuery.length).indexOf(searchQuery) !== -1) {

                        if (searchResult.length <= 10) {
                            setSearchResult(prevResult => {
                                return [...prevResult, {
                                    name: data[key].name,
                                    pbUri: data[key].pbUri,
                                    id: key
                                }]
                            })
                        }

                    }
                }
            })
            .catch(error => console.log("error", error.code))
    }

    const getRandomUser = () => {

        const db = getDatabase();
        get(child(ref(db), "users"))
            .then(snapshot => {
                const users = snapshot.val();
                const filteredPairList = Object.entries(users).filter(i => !i[1].isBanned).filter(i => !(i[0] === getAuth().currentUser.uid));

                const randomUser = filteredPairList[Math.round(lerp(0, filteredPairList.length - 1, Math.random()))];
                setRandomUser({
                    id: randomUser[0],
                    name: randomUser[1].name,
                    pbUri: randomUser[1].pbUri,
                })
            })
            .catch(error => console.log("error", error.code))
    }

    useEffect(() => {
        getRandomUser();
    }, [])

    return (
        <View style={ styles.container } >

            <SearchHeader style={ styles.searchHeader } input={input} onPress={ () => fetchUsers(input) } onText={ (text) => {
                setInput(text);
                fetchUsers(text);
            } } />

            <ScrollView style={ styles.contentContainer } contentContainerStyle={ styles.contentInnerContainer } keyboardDismissMode='on-drag'
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }}
                refreshControl={
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
                    searchResult.length !== 0 ?
                    searchResult.map((user, key) =>
                        <UserCard key={key} user={user} style={ styles.card } userID={user.id} onPress={ () => navigation.navigate('ProfileView', { userID: user.id }) } />
                    ) : randomUser ?
                        <View style={ styles.randomUserContainer }>
                            <Text style={ styles.hint }>Pytaj za něčim!</Text>
                            <View style={ styles.crossLine } />
                            <Text style={ styles.hint }>Pohladaj raz pola...</Text>
                            <UserCard style={ styles.card } user={randomUser} userID={randomUser.id} onPress={ () => navigation.navigate('ProfileView', { userID: randomUser.id }) } />
                        </View> : <Text style={ styles.hint }>Pytaj za něčim!</Text>
                }

            </ScrollView>

            <Navbar style={ styles.navbar } active={1}
                onPressRecent={ () => { navigation.navigate("Recent") }}
                onPressSearch={ () => { navigation.navigate("Search") }}
                onPressAdd={ () => { navigation.navigate("Add") }}
                onPressProfile={ () => { navigation.navigate("Profile") }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
    },

    searchHeader: {
        flex: .12,
        width: "100%",
    
        alignSelf: "center",
    
        zIndex: 99
    },

    navbar: {
        height: "6%",
        width: "80%",
        alignSelf: "center",
        zIndex: 99,
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
        flex: 1,
        marginBottom: -5
    },

    card: {
        width: "90%",
        alignSelf: "center",
        marginTop: 5
    },
    
    randomUserContainer: {
        width: "100%",
    },
    hint: {
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#5884B0",
        textAlign: "center",
        marginVertical: 25
    },
    crossLine: {
        width: "100%",
        height: 1,
        backgroundColor: "#143C63",
        borderRadius: 10
    }

})