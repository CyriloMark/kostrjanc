import React, { useState } from 'react'

import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView } from 'react-native';

import SVG_Search from '../../assets/svg/Search';

export default function SearchHeader(props) {

    return (
        <View style={ props.style }>

                {/* Header */}
            <View style={ styles.headerContainer } >
                    
                <TextInput style={ styles.input } placeholder="Pytaj něšto..." maxLength={128} editable
                    multiline={false} numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                    keyboardType="default" keyboardAppearance='dark' value={props.input} onChangeText={ props.onText } />

                    {/* Search Btn */}
                <Pressable style={ styles.searchBtn } onPress={ props.onPress } >
                    <View style={ styles.searchBtnBG }>
                        <SVG_Search style={ styles.searchBtnIcon } fill={"#143C63"} />
                    </View>
                </Pressable>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        borderRadius: 25,
        
        flexDirection: "row",
        alignItems: "center",
        padding: 10,

        backgroundColor: "#143C63",
    },

    searchBtn: {
        marginVertical: 5,
        flex: .2,
        alignItems: "center",
    },
    searchBtnBG: {
        aspectRatio: 1,
        height: "100%",
        paddingVertical: 10,

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,

        backgroundColor: "#5884B0"
    },
    searchBtnIcon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,
    },
    
    input: {
        flex: .8,
        height: "80%",
        paddingHorizontal: 10,
        marginHorizontal: 10,

        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
        
        borderRadius: 15,
    }
})