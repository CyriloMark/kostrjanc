import React from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

import SVG_Pencil from '../../assets/svg/Pencil';

export default function EditButton(props) {
    return (
        <View style={ props.style }>
            <Pressable style={ styles.container } onPress={props.onPress}>
                <View style={styles.pencilContainer} >
                    <SVG_Pencil fill={"#143C63"} style={ styles.pencilIcon } />
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
        backgroundColor: "#5884B0",
    },

    pencilContainer: {
        flex: .2,
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
        flex: .8,
        paddingHorizontal: 10,
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#143C63",
        textAlign: "center",
    }
});