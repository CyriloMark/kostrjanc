import React, { useEffect, useState } from 'react'

import { Modal as M, StyleSheet, Pressable, Keyboard, Platform } from "react-native"

import Add from "../../assets/svg/Add";

export default function Modal (props) {

    return(
        <M style={ styles.container } animationType='slide' visible={ props.visible } onRequestClose={ props.onRequestClose } presentationStyle="formSheet">
            <Pressable style={ Platform.OS === 'ios' ? styles.layerIOS : styles.layerA } onPress={ Keyboard.dismiss } >

                <Pressable hitSlop={10} style={ styles.closeLine } onPress={ props.onRequestClose } >
                    <Pressable style={ styles.closeBtnContainer } onPress={ props.onRequestClose } >
                        <Add style={{ transform: [{ rotate: "45deg" }] }} fill="#000000" />
                    </Pressable>
                </Pressable>

                {
                    props.content
                }

            </Pressable>
        </M>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    layerIOS: {
        width: "100%",
        height: "100%",
        alignItems: "center",

        paddingHorizontal: 25,
        paddingBottom: 25,

        backgroundColor: "#000000",

        borderWidth: 1,
        borderColor: "#143C63",
        borderRadius: 10,
        borderBottomColor: "#000000",
    },
    layerA: {
        width: "100%",
        height: "100%",
        alignItems: "center",

        paddingHorizontal: 25,
        paddingBottom: 25,

        backgroundColor: "#000000",

        borderWidth: 1,
        borderColor: "#143C63",
        borderBottomColor: "#000000",
    },
    content: {
        width: "100%",
        backgroundColor: "#000000",
        paddingHorizontal: 25,
        paddingBottom: 25,
        
        borderWidth: 1,
        borderColor: "#143C63",
        borderBottomColor: "#000000",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    closeLine: {
        height: 40,
        width: "100%",
        alignSelf: "center",
        marginVertical: 10,
    },
    closeBtnContainer: {
        height: "100%",
        aspectRatio: 1,
        alignSelf: "flex-end",
        borderRadius: 50,
        padding: 7,
        backgroundColor: "#143C63",
    }
});