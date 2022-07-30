import React from "react";

import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinkButton } from "./Settings";

import AppHeader from "../comp_static_items/AppHeader";

import SVG_Ban from '../../assets/svg/Ban'

export default function BannView() {

    return (
        <SafeAreaView style={ styles.container } >

            <AppHeader style={styles.header} />

            <ScrollView style={ styles.contentContainer } contentContainerStyle={[ styles.contentInnerContainer, { marginVertical: -5 } ]} showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} bounces={false}>

                <View style={ styles.banIconBG }>
                    <SVG_Ban style={ styles.banIcon } fill="#000000" />
                </View>

                <Text style={styles.heading}>Ty sy z kostrjanc wuzamknjeny.</Text>
                <Text style={styles.subHeading}>Njejsy so prawje zadźeržał a něk je moderacija tebje blokěrowała.</Text>

                <LinkButton style={ styles.button } title={"Zo bychmy móhli tebje zaso aktiwěrołać, přizjeł so w syći!"} link="https://kostrjanc.de/pomoc" />

            </ScrollView>
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
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

        justifyContent: "center",
        alignItems: "center"
    },
    
    header: {
        flex: .08,
        width: "100%",
    
        alignSelf: "center",
    
        zIndex: 99
    },

    banIconBG: {
        width: "40%",
        aspectRatio: 1,
        marginVertical: 25,
        backgroundColor: "#5884B0",
        borderRadius: 100,
        padding: 25,

        justifyContent: "center",
        alignItems: "center"
    },
    banIcon: {
        width: "100%",
        aspectRatio: 1
    },

    heading: {
        width: "100%",
        color: "#5884B0",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        marginVertical: 5,
        textAlign: "center"
    },
    subHeading: {
        width: "80%",
        color: "#5884B0",
        color: "#5884B0",
        fontFamily: "RobotoMono_Thin",
        fontSize: 15,
        marginVertical: 5,
        textAlign: "center"
    },

    button: {
        width: "100%",
        marginVertical: 25
    }
})