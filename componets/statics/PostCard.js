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
    
    const [navVisibility, setNavVisibility] = useState(true);

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
        <View style={[props.style, { borderRadius: 15, overflow: "hidden" } ]}>
            <Pressable style={ styles.postContainer } onLongPress={ () => setNavVisibility(!navVisibility) } onPress={ !post.isBanned ? props.onPress : null } >

                <Image source={{ uri: post.imgUri }} style={ styles.postBGImg } resizeMode="cover" />
                <SVG_Basket style={[ styles.postDelIcon, { opacity: post.isBanned ? 1 : 0 } ]} fill="#143C63" />

                    {/* User Nav */}
                <View style={[ styles.postNavContainer, { opacity: navVisibility ? 1 : 0} ]}>

                        {/* Header User */}
                    <View style={ styles.postHeader }>
                            {/* Icon */}
                        <View style={ styles.headerIconContainer }>
                            <Image source={{ uri: !post.isBanned ? user.pbUri : USER_PLACEHOLDER.pbUri  }} style={ styles.headerIcon } resizeMode="cover" />
                        </View>
                        <Text style={ styles.headerTitleText }>{ !post.isBanned ? user.name : "" }</Text>
                    </View>

                </View>

            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        width: "100%",
        zIndex: 3,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },

    postBGImg: {
        width: "100%",
        aspectRatio: 3/4,
        alignSelf: "center",
    },
    postDelIcon: {
        position: "absolute",
        width: "50%",
        height: "50%",
        zIndex: 99,
    },

    postNavContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        padding: 10
    },

    postHeader: {
        height: "15%",
        width: "100%",
        borderRadius: 15,

        position: "absolute",
        top: 10,
        alignSelf: "center",
        
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#143C63",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    headerIconContainer: {
        height: "100%",
        flex: .2,
        alignItems: "center",
        justifyContent: "center",
    },
    headerIcon: {
        aspectRatio: 1,
        height: "100%",
        borderRadius: 50,
    },
    headerTitleText: {
        flex: .75,
        color: "#5884B0",
        marginLeft: "5%",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },

    postInteractions: {
        height: "10%",
        width: "100%",

        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    postInteractionsItem: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,

        marginLeft: 10,
        padding: 12,
    },
    postInteractionsItemText: {
        flex: 1,
        width: "100%"
    }
});
