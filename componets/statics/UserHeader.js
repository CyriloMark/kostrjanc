import React from 'react'

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

export default function UserHeader(props) {
    return (
        <View style={ props.style }>
                {/* User */}
            <Pressable style={[ styles.userContainer, styles.shadow ]} onPress={props.onPress}>
                <View style={ styles.userIconContainer }>
                    <Image source={{ uri: props.user.pbUri }} style={ styles.userIcon } resizeMode="cover" />
                </View>
                <Text style={ styles.userTitleText }>{props.user.name}</Text>
                <Pressable style={[ styles.userAddContainer ]}>
                    <Text style={[ styles.userAddText, styles.shadow ]}>+</Text>
                </Pressable>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    userContainer: {
        width: "100%",
        borderRadius: 15,

        flexDirection: "row",
        alignItems: "center",
        padding: 10,

        backgroundColor: "#143C63",
    },
    userIconContainer: {
        flex: .2,
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1,
    },
    userIcon: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 50,
    },
    userTitleText: {
        flex: .6,
        color: "#5884B0",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,

        marginHorizontal: "5%",
        alignSelf: "center",
    },
    userAddContainer: {
        flex: .2,
        justifyContent: "center",
        alignItems: "center",
    },
    userAddText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        color: "#B06E6A",
        elevation: 10,
    },
})