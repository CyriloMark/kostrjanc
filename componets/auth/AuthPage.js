import React, { useState, useEffect } from 'react'

import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthPage() {

    const [loginScreenVisibility, setLoginScreenVisibility] = useState(false);

    return (

        <SafeAreaView style={ styles.container }>

            <Modal style={ styles.modalScreenContainer } animationType="slide" transparent={true} visible={loginScreenVisibility} >

            </Modal>  

                {/* Header */}
            <View style={ styles.headerContainer }>
                
                    {/* Icon */}
                <View style={ styles.headerIconContainer }>
                </View>
                <Text style={ styles.headerTitleText }>Kostrjanc</Text>

            </View>

                {/* Body */}
            <View style={ styles.bodyContainer }>

                    {/* Title */}
                <View style={ styles.titleContainer }>
                    <Text style={ styles.titleText }>Zaloguj so</Text>
                </View>

                    {/* Buttons */}
                <View style={ styles.btnsContainer }>
                    <Pressable style={ styles.btnContainer } onPress={ () => setLoginScreenVisibility(true) }>
                        <Text style={ styles.btnText } >Zalogować</Text>
                    </Pressable>
                    <Pressable style={ styles.btnContainer }>
                        <Text style={ styles.btnText } >Registrować</Text>
                    </Pressable>
                </View>

            </View>

                {/* Footer */}
            <View style={ styles.footerContainer }>
                <Text style={ styles.footerText }>© 2022 most rights reserved Produced by Mark, Cyril; Baier, Korla</Text>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#5884B0",
        alignItems: "center",
        paddingHorizontal: 10
    },

    headerContainer: {
        width: "100%",
        height: "10%",
        backgroundColor: "#143C63",
        borderRadius: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

        zIndex: 99,
        paddingHorizontal: 25,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    headerIconContainer: {
        flex: .15,
        maxHeight: "100%",
        backgroundColor: "#B06E6A",
        borderRadius: 50,
        aspectRatio: 1,
    },
    headerTitleText: {
        flex: .8,
        color: "#5884B0",
        marginLeft: "5%",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 5,
    },

    bodyContainer: {
        width: "100%",
        flex: 1,
        backgroundColor: "#5884B0",
        flexDirection: "column",
        alignItems: "center"
    },

    titleContainer: {
        flex: .3,
        justifyContent: "center",
        alignItems: "center",
    },
    titleText: {
        fontFamily: "Inconsolata_Black",
        color: "#143C63",
        fontSize: 50,
    },


    btnsContainer: {
        flex: .7,
        width: "100%",
        flexDirection: "column",
        alignItems: "center"
    },
    btnContainer: {
        flex: .2,
        width: "80%",
        backgroundColor: "#143C63",
        borderRadius: 15,
        marginBottom: "10%",

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
    btnText: {
        color: "#5884B0",
        fontFamily: "Inconsolata_Black",
        fontSize: 25
    },

    footerContainer: {
        position: "absolute",
        width: "100%",
        bottom: "5%",
        alignItems: "center"
    },
    footerText: {
        color: "#143C63",
        fontFamily: "Inconsolata_Light",
        fontSize: 10
    },


    modalScreenContainer: {
        position: "absolute",
    }
});
