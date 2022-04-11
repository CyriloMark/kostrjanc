import React from 'react'

import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import MapView from 'react-native-maps';

import SVG_Post from '../../assets/svg/Post';
import SVG_Event from '../../assets/svg/Event';

export const PostType = {
    Post: 0,
    Event: 1
}

export default function PostPreview(props) {

    return (
        <View style={[ props.style, { overflow: "visible", zIndex: 2 } ]}>
            <Pressable style={ styles.postItemContainer } onPress={ props.press } >
                {
                    props.item.type === PostType.Post
                    ? <Preview_Post imgUri={props.item.imgUri} postShowText={props.postShowText} title={props.item.title} style={ styles.boxStyle } />
                    : <Preview_Event title={props.item.title} geoCords={props.item.geoCords} checked={true} style={ styles.boxStyle } />
                }
            </Pressable>
        </View>
    )
}

export function Preview_Post (props) {
    return (
        <View style={ props.style }>
            <View style={ styles.previewPostContainer }>

                <Image blurRadius={0} source={{ uri: props.imgUri }} style={ styles.previewPostBGImg } resizeMode="cover" />

                <SVG_Post style={ styles.typePin } fill="#fff" />

                <View style={ styles.previewPostContent }>
                    <Text style={[ styles.previewPostTitle, { opacity: !props.postShowText ? 0 : 1 } ]}>
                        {props.title}
                    </Text>
                </View>

            </View>
        </View>
    )
}

export function Preview_Event (props) {
    return (
        <View style={ props.style }>
            <View style={ styles.previewEventContainer }>

                <MapView style={styles.map}
                    accessible={false} focusable={false}
                    initialRegion={ props.geoCords }
                />

                <SVG_Event style={ styles.typePin } fill="#fff" />

                <View style={ styles.previewEventContent }>
                    <Text style={ styles.previewEventTitle }>
                        {props.title}
                    </Text>
                </View>

                    {/* CheckedPin */}
                <View style={[ styles.previewEventPin, { opacity: !props.checked ? 0 : 1 } ]} />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    boxStyle: {
        flex: 1,
        width: "100%"
    },

    postItemContainer: {
        flex: 1,
        aspectRatio: .9,
    },
    postItemText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#5884B0",
    },

    typePin: {
        position: "absolute",
        width: "15%",
        aspectRatio: 1,
        borderRadius: 50,

        top: 15,
        right: 15,

        zIndex: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },


    previewPostContainer: {
        flex: 1,

        borderRadius: 25,
        overflow: "hidden"
    },
    previewPostBGImg: {
        position: "absolute",
        width: "100%",
        height: "100%",

        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        overflow: "hidden"
    },
    previewPostContent: {
        flex: 1,
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    previewPostTitle: {
        width: "80%",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "rgba(255, 255, 255, .5)",
    },

    previewEventContainer: {
        flex: 1,
        backgroundColor: "blue",

        borderRadius: 25,
        overflow: "hidden"
    },

    previewEventContent: {
        flex: 1,
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        
        backgroundColor: "rgba(88, 132, 176, .8)",
        zIndex: 3
    },
    previewEventTitle: {
        width: "80%",

        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "rgba(0, 0, 0, 1)"
    },
    previewEventPin: {
        position: "absolute",
        width: "25%",
        aspectRatio: 1,
        borderRadius: 50,

        bottom: 10,
        right: 10,

        zIndex: 5,
        backgroundColor: "#9FB012",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    map: {
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        borderRadius: 15,
        zIndex: 2
    },
});