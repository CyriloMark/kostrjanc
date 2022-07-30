import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import { getDatabase, ref, get, child } from "firebase/database";

import SVG_Basket from '../../assets/svg/Basket';

const USER_PLACEHOLDER = {
    name: "",
    pbUri: "https://www.colorhexa.com/587db0.png"
}
const POST_PLACEHOLDER = {
    title: "",
    description: "",
    imgUri: "https://www.colorhexa.com/587db0.png",
    created: "27.3.2022 21:20",
    isBanned: false
}

export default function PostCard(props) {

    const [creator, setCreator] = useState(null);

    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [post, setPost] = useState(POST_PLACEHOLDER)

    const loadData = () => {
        const db = getDatabase();

        get(child(ref(db), 'posts/' + props.postID))
            .then(snapshot => {
                const data = snapshot.val();

                setCreator(data['creator']);

                if (snapshot.hasChild('isBanned')) {
                    if (data['isBanned']) {
                        setPost({
                            ...POST_PLACEHOLDER,
                            isBanned: true
                        });
                        return;
                    }
                }

                setPost({
                    id: data['id'],
                    creator: data['creator'],
                    title: data['title'],
                    description: data['description'],
                    imgUri: data['imgUri'],
                    created: data['created'],
                    isBanned: false
                });
            })
            .catch(error => console.log("error", error.code));
    }

    const loadUser = () => {
        const db = ref(getDatabase());
        get(child(db, 'users/' + creator))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    const data = snapshot.val();

                    setUser({
                        name: data['name'],
                        description: data['description'],
                        pbUri: data['pbUri'],
                        gender: data['gender'],
                        ageGroup: data['ageGroup']
                    });
                }
                else {
                    setUser(USER_PLACEHOLDER);
                }
            })
    }

    useEffect(() => {
        if (post === POST_PLACEHOLDER) loadData();
    }, []);

    useEffect(() => {
        if (creator === null) return;
        loadUser();
    }, [creator]);


    return (
        <View style={ props.style }>
            <Pressable style={ styles.container } onPress={ !post.isBanned ? props.onPress : null } >

                    {/* Header */}
                <View style={ styles.userContainer }>
                       {/* Icon */}
                    <View style={ styles.userIconContainer }>
                        <Image source={{ uri: !post.isBanned ? user.pbUri : USER_PLACEHOLDER.pbUri  }} style={ styles.icon } resizeMode="cover" />
                    </View>
                    <Text style={ styles.userTitleText }>{ !post.isBanned ? user.name : "" }</Text>
                </View>

                    {/* IMG */}
                <View style={ styles.imageContainer }>
                    {
                        !post.isBanned ?
                            <Image source={{ uri: post.imgUri }} style={ styles.image } resizeMode="cover" /> :
                            <SVG_Basket style={ styles.delIcon } fill="#143C63" />
                    }
                </View>

            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        zIndex: 3,
        justifyContent: "center",
        aspectRatio: 1,
    },

    userContainer: {
        width: "100%",
        flex: .1,
        
        paddingHorizontal: 10,
        paddingBottom: 10,

        flexDirection: "row",
        alignItems: "center",
    },
    userIconContainer: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        aspectRatio: 1,
        height: "100%",
        borderRadius: 50,
    },

    userTitleText: {
        flex: .75,
        color: "#5884B0",
        marginLeft: 10,
        fontFamily: "Barlow_Regular",
        fontSize: 20,
    },

    imageContainer: {
        flex: .9,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        overflow: "hidden",
    },
    image: {
        flex: 1,
        width: "100%",
    },
    delIcon: {
        flex: .5,
        width: "100%",
        zIndex: 99,
    },
});