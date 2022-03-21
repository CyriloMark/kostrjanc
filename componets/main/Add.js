import React, { useCallback, useState } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";

import Navbar from '../statics/Navbar';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Add({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={ styles.container } >

            <Navbar style={ styles.navbar } active={2}
                onPressRecent={ () => { navigation.navigate("Recent") }}
                onPressSearch={ () => { navigation.navigate("Search") }}
                onPressAdd={ () => { navigation.navigate("Add") }}
                onPressProfile={ () => { navigation.navigate("Profile") }}
            />

            <ScrollView style={{ width: "100%", flex: 1 }} contentContainerStyle={{ width: "100%" }}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                />
            }>


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
    navbar: {
        width: "80%",
        height: "10%",
        bottom: "2%",
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
        elevation: 5,
      },
})