import React, { useState } from 'react'

import { View, StyleSheet, TextInput, Pressable, Dimensions } from 'react-native';

import SVG_Search from '../../assets/svg/Search';

export default function SearchHeader(props) {

    const [input, setInput] = useState("");

    return (
        <View style={ props.style }>
                {/* Header */}
            <View style={ styles.headerContainer }>
                    
                <TextInput style={[ styles.input, styles.shadow ]} placeholder="Pytaj něšto..."
                    multiline={false} numberOfLines={1} placeholderTextColor={"#143C63"}
                    keyboardType="default" keyboardAppearance='dark' value={input} onChangeText={ (value) => setInput(value) } />

                    {/* Search Btn */}
                <Pressable style={ styles.searchBtn } onPress={ props.onPress } >
                    <SVG_Search style={[ styles.searchBtnIcon, styles.shadow ]} fill={"#B06E6A"} />
                </Pressable>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        height: Dimensions.get('screen').height * .1,
        backgroundColor: "#143C63",
        borderRadius: 25,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
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
        height: "100%",
        flex: .2,
        alignItems: "center",
        paddingVertical: 10,
        justifyContent: "center",
    },
    searchBtnIcon: {
        aspectRatio: 1,
        height: "100%",
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
        color: "#143C63",
        
        borderRadius: 15,
        backgroundColor: "#B06E6A",
        elevation: 10
    }
})