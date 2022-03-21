import React from 'react'

import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Landing from './Landing';
import Profile from './Profile';

import SVG_Recent from '../../assets/svg/Recent';
import SVG_Search from '../../assets/svg/Search';
import SVG_Add from '../../assets/svg/Add';
import SVG_Profile from '../../assets/svg/Profile';

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
                tabBarItemStyle: styles.navbarItem,
                tabBarIconStyle: styles.navbarIcon,
                tabBarLabelStyle: styles.navbarLabel,
                lazy: true,
                lazyPreloadDistance: 4,
                tabBarStyle: styles.navbarStyle,
                swipeEnabled: false,
                tabBarScrollEnabled: false,

                tabBarBounces: true
            }}
            >
            <Navbar.Screen name='Landing' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <SVG_Recent fill={focused ? "#B06E6A" : "#5884B0"} />
                )
            }} />
            <Navbar.Screen name='Search' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <SVG_Search fill={focused ? "#B06E6A" : "#5884B0"} />
                )
            }} />
            <Navbar.Screen name='Add' component={Landing} options={{
                tabBarIcon: ({ focused }) => (
                    <SVG_Add fill={focused ? "#B06E6A" : "#5884B0"} />
                )
            }} />
            <Navbar.Screen name='Profile' component={Profile} options={{
                tabBarIcon: ({ focused }) => (
                    <SVG_Profile fill={focused ? "#B06E6A" : "#5884B0"} />
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
    navbarItem: {
        height: "100%",
        aspectRatio: 1,
        marginHorizontal: 10,
        padding: "10%",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 5,
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
