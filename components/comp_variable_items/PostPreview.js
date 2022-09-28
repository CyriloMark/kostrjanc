import React from 'react'

import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import MapView from 'react-native-maps';

import SVG_Post from '../../assets/svg/Post';
import SVG_Event from '../../assets/svg/Event';
import { getAuth } from 'firebase/auth';

export const PostType = {
    Post: 0,
    Event: 1
}

export default function PostPreview(props) {

    const getChecks = () => {
        if (props.item.checks) {
            return props.item.checks.includes(getAuth().currentUser.uid);
        }
        else return false;
    }

    let checked = getChecks();

    return (
        <View style={ props.style }>
            <Pressable style={ styles_main.container } onPress={ props.press } >
                {
                    props.item.type == 0
                        ? <Preview_Post imgUri={props.item.imgUri} postShowText={props.postShowText} title={props.item.title} style={ styles_main.box } />
                        : <Preview_Event title={props.item.title} geoCords={props.item.geoCords} checked={checked} style={ styles_main.box } />
                }
            </Pressable>
        </View>
    )
}

export function Preview_Post (props) {

    return (
        <View style={ props.style }>
            <View style={ styles_post.postContainer }>

                {
                    !props.postShowText ?
                        <Image source={{ uri: props.imgUri }} style={ styles_post.bgImg } resizeMode="cover" /> : 
                        <View style={ styles_post.bgEmptyContainer }>
                            <SVG_Post style={ styles_post.bgEmpty } fill="#5884B0" />
                        </View>
                }

                

                    {/* Pin */}
                <View style={ styles_main.pinContainer }>
                    <SVG_Post style={ styles_main.pin } fill="#000000" />
                </View>

                    {/* Text */}
                <View style={ styles_post.postTextContainer }>
                    <Text style={[ styles_post.postText, { opacity: !props.postShowText ? 0 : 1 } ]}>
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
            <View style={ styles_event.eventContainer }>

                <MapView style={ styles_event.map } accessible={false} focusable={false} rotateEnabled={false} zoomEnabled={false} 
                    initialRegion={ props.geoCords } pitchEnabled={false} scrollEnabled={false} 
                />

                    {/* Pin */}
                <View style={[ styles_main.pinContainer, { backgroundColor: !props.checked ? "#5884B0" : "#B06E6A"  } ]}>
                    <SVG_Event style={ styles_main.pin } fill="#000000" />
                </View>

                    {/* Text */}
                <View style={ styles_event.eventTextContainer }>
                    <Text style={ styles_event.eventText }>
                        {props.title}
                    </Text>
                </View>

            </View>
        </View>
    )
}

const styles_main = StyleSheet.create({
    container: {
        flex: 1,
        aspectRatio: .9,
    },

    box: {
        flex: 1,
        width: "100%",
    },


    pinContainer: {
        position: "absolute",
        width: "25%",
        aspectRatio: 1,
        top: 0,
        right: 0,

        justifyContent: "center",
        alignItems: "center",

        borderBottomLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: "#5884B0",

        zIndex: 5
    },
    pin: {
        width: "40%",
        aspectRatio: 1
    }
});


const styles_post = StyleSheet.create({
    postContainer: {
        flex: 1,
        borderRadius: 25,

        overflow: "hidden"
    },

    bgImg: {
        position: "absolute",
        width: "100%",
        height: "100%",

        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

    bgEmptyContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        overflow: "hidden",

        alignItems: "center",
        justifyContent: "center"
    },
    bgEmpty: {
        width: "50%",
        height: "50%",
    },

    postTextContainer: {
        flex: 1,
        width: "75%",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    postText: {
        width: "100%",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#000000",
    },
});


const styles_event = StyleSheet.create({
    eventContainer: {
        flex: 1,
        borderRadius: 25,
        overflow: "hidden",
    },

    map: {
        position: "absolute",
        width: "100%",
        height: "100%",

        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        overflow: "hidden",
        opacity: .5
    },

    eventTextContainer: {
        flex: 1,
        width: "75%",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    eventText: {
        width: "100%",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#5884B0",
    },
   
});