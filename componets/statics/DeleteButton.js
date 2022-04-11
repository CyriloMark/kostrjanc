import React from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

import SVG_Basket from '../../assets/svg/Basket';

export default function DeleteButton(props) {
    return (
        <View style={ props.style }>
            <Pressable style={ styles.container } onPress={props.onPress}>
                <View style={styles.basketContainer} >
                    <SVG_Basket fill={"#143C63"} style={ styles.basketIcon } />
                </View>
                <Text style={styles.text}>Zhašeć</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 15,

        flexDirection: "row",
        paddingHorizontal: 25,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#B06E6A",
    },

    basketContainer: {
        flex: .2,
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1,
    },
    basketIcon: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 50,
    },
    text: {
        flex: .8,
        paddingHorizontal: 10,
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#143C63",
        textAlign: "center",
    }
});