import React from 'react'

import { View, StyleSheet } from "react-native";

export default function MainSplitLine(props) {
    return (
        <View style={[ props.style, { padding: 15 } ]}>
            <View style={ styles.line } />
        </View>
    )
}

const styles = StyleSheet.create({
    line: {
        width: "100%",
        height: 1,
        backgroundColor: "#143C63"
    }
});
