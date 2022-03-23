import React from 'react'

import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import Landing from './Landing';
import Add from './Add';
import Profile from './Profile';

const Stack = createStackNavigator();

export default function ViewportManager() {
  return (
    <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Recent" screenOptions={{
                animationEnabled: false,
                gestureEnabled: false,
                cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }} >
            <Stack.Screen name="Recent" component={Landing} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Landing} options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={Add} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0",
    },
    bodyContainer: {
        flex: 1,
        width: "100%",
    },
    navbarStyle: {
        height: "10%",
        width: "80%",
        borderRadius: 25,
        backgroundColor: "#143C63",
        alignSelf: "center",
        position: "relative",
        bottom: "2%",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,

        justifyContent: "center"
    },
    navbarItem: {
        height: "100%",
        aspectRatio: 1,
        marginHorizontal: 10,
        padding: "15%",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    navbarIcon: {
        aspectRatio: 1,
        width: "100%",
        height: "100%",
    },
    navbarIndicator: {
        opacity: 0,
    },
    sceneContainer: {
        flex: 1,
        width: "100%",
    }
});
