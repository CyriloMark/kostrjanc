import React from 'react'

import { View, StyleSheet, Dimensions } from 'react-native';

import SVG_Pin from '../../assets/svg/Pin';

const DEFAULT_ICON_WIDTH = Dimensions.get("window").width * 0.05;

export default function PinnedCard(props) {
    return (
        <View style={[ props.style, styles.container ]}>
            <SVG_Pin style={styles.pin} fill="#B06E6A" />
            {
                props.card
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#B06E6A",
        padding: 10
    },
    pin: {
        position: "absolute",
        right: 10,
        top: 10,
        width: DEFAULT_ICON_WIDTH,
        aspectRatio: 1
    }
});