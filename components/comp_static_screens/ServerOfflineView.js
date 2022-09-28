import React from "react";

import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../comp_static_items/AppHeader";

import { convertTimestampIntoString } from "../comp_variable_screens/EventView";

import SVG_Web from '../../assets/svg/Web'

export default function ServerOfflineView(props) {

    let getText = () => {
        if (!props.status) return;
        let output = <></>;
        let input = props.status.split('/');

        switch (input[0]) {
            case "offline":
                output = (
                    <Text style={styles.subHeading}>
                        Na kostrjanc so dźěła abo jedyn tamny problem wobsteji,
                        zo je so dyrbjał serwer hasnyć. Čas, hdy serwer so zaso startuje,
                        njemóže so paušalnje prajić.
                    </Text>
                )
                break;
                // pause/5 hodź./1662901993471
            case "pause":
                output = (
                    <>
                        <Text style={styles.subHeading}>Na kostrjanc so dźěła abo jedyn tamny problem wobsteji, zo je so dyrbjał serwer hasnyć.</Text>
                        <Text style={styles.subHeading}>Čas so na {input[1]}trochuje.</Text>
                        <Text style={styles.subHeading}>Započatk běše w {"\n"}{convertTimestampIntoString(parseInt(input[2]))}</Text>
                    </>
                )
                break;
            default:
                break;
        }
        return output;
    }

    return (
        <SafeAreaView style={ styles.container } >

            <AppHeader style={styles.header} />

            <ScrollView style={ styles.contentContainer } contentContainerStyle={[ styles.contentInnerContainer, { marginVertical: -5 } ]} showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} bounces={false}>

                <View style={ styles.webIconBG }>
                    <SVG_Web style={ styles.webIcon } bg="#5884B0" fill="#000000" />
                    <View style={styles.line} />
                </View>

                <Text style={styles.heading}>kostrjanc je tučasnje offline.</Text>

                {
                    getText()
                }

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

    webIconBG: {
        width: "40%",
        aspectRatio: 1,
        marginVertical: 25,
        backgroundColor: "#5884B0",
        borderRadius: 100,
        padding: 25,

        justifyContent: "center",
        alignItems: "center"
    },
    webIcon: {
        width: "100%",
        aspectRatio: 1
    },
    line: {
        position: "absolute",
        width: "100%",
        height: 5,
        transform: [{ rotate: "45deg" }],
        backgroundColor: "#000000",
        borderRadius: 5
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
    },
    button2: {
        width: "100%",
        marginVertical: 25,
        padding: 25,
        backgroundColor: "red"
    }
})