import React from 'react'

import { View, StyleSheet, TextInput, Pressable, Dimensions } from 'react-native';

import SVG_Search from '../../assets/svg/Search';

export default function SearchHeader(props) {

    return (
        <View style={ props.style }>
                {/* Header */}
            <View style={ styles.headerContainer }>
                    
                <TextInput style={ styles.input } placeholder="Pytaj něšto..." maxLength={128}
                    multiline={false} numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                    keyboardType="default" keyboardAppearance='dark' value={props.input} onChangeText={ props.onText } />

                    {/* Search Btn */}
                <Pressable style={ styles.searchBtn } onPress={ props.onPress } >
                    <SVG_Search style={ styles.searchBtnIcon } fill={"#B06E6A"} />
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
    
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
    },

    searchBtn: {
        flex: .2,
        alignItems: "center",
        paddingVertical: 10,
        justifyContent: "center",
    },
    searchBtnIcon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,
        elevation: 10
    },
    
    input: {
        flex: .8,
        height: "80%",
        paddingHorizontal: 10,
        marginHorizontal: 10,


        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        color: "#5884B0",
        
        borderRadius: 15,
        elevation: 10
    }
})