import React from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

import SVG_Pencil from '../../assets/svg/Pencil';

export default function EditButton(props) {
    return (
        <View style={ props.style }>
            <Pressable style={ styles.container } onPress={props.onPress}>
                <View style={styles.pencilContainer} >
                    <SVG_Pencil fill={"#5884B0"} style={ styles.pencilIcon } />
                </View>
                <Text style={styles.editText}>Wobdźěłać</Text>
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

        borderWidth: 1,
        borderColor: "#143C63"
    },

    pencilContainer: {
        flex: .15,
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1,
    },
    pencilIcon: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 50,
    },
    editText: {
        flex: .85,
        paddingHorizontal: 10,
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
        textAlign: "center",
    }
});