import React from 'react'

import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function PostPreview(props) {
    return (
        <View style={ props.style }>
            <View style={ styles.postItemContainer } >
                <Text style={ styles.postItemText } >{props.item.name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postItemContainer: {
        flex: 1,
        aspectRatio: .9,
        borderRadius: 25,

        justifyContent: "center",
        alignItems: "center",
        padding: 10,

        backgroundColor: "#143C63",
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .5,
        shadowRadius: 6.27,
        elevation: 10,
    },
    postItemText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#5884B0",
    },
});