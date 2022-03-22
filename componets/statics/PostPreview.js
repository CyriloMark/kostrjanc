import React from 'react'

import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

export const PostType = {
    Post: 0,
    Event: 1
}

export default function PostPreview(props) {
    return (
        <View style={ props.style }>
            <View style={ styles.postItemContainer } >
                {
                    props.item.type === PostType.Post
                    ? <Preview_Post imgUri={props.item.imgUri} title={props.item.name} style={ styles.boxStyle } />
                    : <Preview_Event title={props.item.name} style={ styles.boxStyle } />
                }
            </View>
        </View>
    )
}

export function Preview_Post (props) {
    return (
        <View style={ props.style }>
            <View style={ styles.previewPostContainer }>

                <Image blurRadius={1} source={{ uri: props.imgUri }} style={ styles.previewPostBGImg } resizeMode="cover" />

                <View style={ styles.previewPostContent }>
                    <Text style={ styles.previewPostTitle }>
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

                <View style={ styles.previewEventContent }>
                    <Text style={ styles.previewEventTitle }>
                        {props.title}
                    </Text>
                </View>

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
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "rgba(0, 0, 0, .5)"
    },

    previewEventContainer: {
        flex: 1,
        backgroundColor: "blue",

        borderRadius: 25,
    },

    previewEventContent: {
        flex: 1,
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    previewEventTitle: {
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "rgba(0, 0, 0, .5)"
    },
});