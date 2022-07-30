import React from 'react'

import { View, Modal as M, StyleSheet, Pressable, Keyboard } from "react-native"

export default function Modal(props) {
    return (
        <M style={ styles.container } animated transparent animationType='slide' visible={props.visible} onRequestClose={ props.onRequestClose } presentationStyle="overFullScreen">
            <Pressable style={ styles.layer } onPress={ props.onRequestClose }>
                <Pressable style={ styles.content } onPress={ () => Keyboard.dismiss() }>

                    <Pressable style={ styles.closeLine } onPress={ props.onRequestClose } />

                    {
                        props.content
                    }

                </Pressable>
            </Pressable>
        </M>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    layer: {
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    content: {
        width: "100%",
        backgroundColor: "#000000",
        paddingHorizontal: 25,
        paddingBottom: 25,
        minHeight: 100,
        maxHeight: "90%",
        
        borderWidth: 1,
        borderColor: "#143C63",
        borderBottomColor: "#000000",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    closeLine: {
        height: 5,
        width: "40%",
        backgroundColor: "#143C63",
        borderRadius: 5,
        alignSelf: "center",
        marginVertical: 10,
    }
});