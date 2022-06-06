import React from "react";

import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinkButton } from "./Settings";
import AppHeader from "./statics/AppHeader";

export default function BannView() {
  return (
    <SafeAreaView style={styles.container}>
        <AppHeader style={styles.header} />

        <View style={styles.bodyContainer}>
            
            <Text style={styles.heading}>Ty sy z kostrjanc wuzamknjeny.</Text>
            <Text style={styles.subHeading}>Njejsy so prawje zadźeržał a něk je moderacija tebje blokěrowała.</Text>

            <LinkButton style={ styles.button } title={"Zo bychmy móhli tebje zaso aktiwěrołać, přizjeł so w syći!"} link="https://kostrjanc.de/pomoc" />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0",
        paddingHorizontal: 10,
    },
    header: {
        width: "100%",
        height: "10%",
        top: 10,
    },
    bodyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        width: "100%",
        color: "#143C63",
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        marginVertical: 10,
        textAlign: "center"
    },
    subHeading: {
        width: "80%",
        color: "#143C63",
        fontFamily: "Inconsolata_Light",
        fontSize: 25,
        marginVertical: 10,
        textAlign: "center"
    },
    button: {
        width: "100%",
        marginVertical: 10
    }
});
