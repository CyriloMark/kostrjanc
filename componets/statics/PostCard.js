import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import { getDatabase, ref, onValue, get, child } from "firebase/database";

import SVG_Heart from '../../assets/svg/Heart';
import SVG_Recent from '../../assets/svg/Recent';
import SVG_Share from '../../assets/svg/Share';

const USER_PLACEHOLDER = {
    name: "",
    pbUri: "https://www.colorhexa.com/587db0.png"
}
const POST_PLACEHOLDER = {
    title: "",
    description: "",
    imgUri: "https://www.colorhexa.com/587db0.png",
    likes: 0,
    created: "27.3.2022 21:20"
}

export default function PostCard(props) {
    
    const [navVisibility, setNavVisibility] = useState(true);

    const [creator, setCreator] = useState(null);

    const [user, setUser] = useState(USER_PLACEHOLDER);
    const [post, setPost] = useState(POST_PLACEHOLDER)

    const loadData = () => {
        const db = getDatabase();
        onValue(ref(db, 'posts/' + props.postID), snapshot => {
            const data = snapshot.val();
            
            setCreator(data['creator']);

            setPost({
                id: data['id'],
                creator: data['creator'],
                title: data['title'],
                description: data['description'],
                imgUri: data['imgUri'],
                created: data['created'],
                likes: data['likes'],
            });
        });
    }

    const loadUser = () => {
        const db = ref(getDatabase());
        get(child(db, 'users/' + creator))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    const data = snapshot.val();

                    console.log("yes");
                    setUser({
                        name: data['name'],
                        description: data['description'],
                        pbUri: data['pbUri'],
                        gender: data['gender'],
                        ageGroup: data['ageGroup']
                    });
                }
                else {
                    console.log("no");
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
            <Pressable style={ styles.postContainer } onLongPress={ () => setNavVisibility(!navVisibility) } onPress={ props.onPress } >

                <Image source={{ uri: post.imgUri }} style={ styles.postBGImg } resizeMode="cover" />

                    {/* User Nav */}
                <View style={[ styles.postNavContainer, { opacity: navVisibility ? 1 : 0} ]}>

                        {/* Header User */}
                    <View style={ styles.postHeader }>
                            {/* Icon */}
                        <View style={ styles.headerIconContainer }>
                            <Image source={{ uri: user.pbUri }} style={ styles.headerIcon } resizeMode="cover" />
                        </View>
                        <Text style={ styles.headerTitleText }>{user.name}</Text>
                    </View>

                    <View style={ styles.postInteractions }>

                            {/* Like */}
                        <Pressable style={[ styles.postInteractionsItem, { backgroundColor: !true ? "#143C63" : "#9FB012" } ]} onPress={ props.onLikePress } >
                            <SVG_Heart style={ styles.postInteractionsItemText } fill={ !props.liked ? "#B06E6A" : "#143C63" } />
                        </Pressable>
                            {/* Comment */}
                        <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} >
                            <SVG_Recent style={ styles.postInteractionsItemText } fill="#B06E6A" />
                        </Pressable>
                            {/* Share */}
                        <Pressable style={[ styles.postInteractionsItem, { backgroundColor: "#143C63" } ]} >
                            <SVG_Share style={ styles.postInteractionsItemText } fill="#B06E6A" />
                        </Pressable>
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
    },

    postBGImg: {
        width: "100%",
        aspectRatio: 3/4,
        alignSelf: "center"
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
