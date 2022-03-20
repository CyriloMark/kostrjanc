import React from 'react'

import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Landing from './Landing';

const Navbar = createMaterialTopTabNavigator();

export default function ViewportManager() {
  return (
    <SafeAreaView style={styles.container}>
        <Navbar.Navigator initialRouteName="Landing"
            shifting={false} labeled={true} backBehavior='initialRoute'
            style={ styles.bodyContainer } tabBarPosition="bottom"
            sceneContainerStyle={ styles.sceneContainer }
            screenOptions={{
                tabBarShowLabel: false,
                tabBarShowIcon: true,
                tabBarIndicatorStyle: styles.navbarIndicator,
                lazy: true,
                lazyPreloadDistance: 4,
                tabBarStyle: styles.navbarStyle,
                swipeEnabled: false,
                tabBarScrollEnabled: false 
            }}
            >
            <Navbar.Screen name='Landing' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <Text>Lan</Text>
                )
            }} />
            <Navbar.Screen name='Search' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <Text>Sea</Text>
                )
            }} />
            <Navbar.Screen name='Add' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <Text>Add</Text>
                )
            }} />
            <Navbar.Screen name='Profile' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <Text>Pro</Text>
                )
            }} />
        </Navbar.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0"
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
        elevation: 5,

        justifyContent: "center"
    },
    navbarIndicator: {
        opacity: 0,
    },
    sceneContainer: {
        flex: 1,
        width: "100%",
    }
});
