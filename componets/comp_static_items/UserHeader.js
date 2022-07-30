import React, { useEffect, useState } from 'react'

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import { getAuth } from 'firebase/auth';
import { getDatabase, set, ref, get, child } from 'firebase/database';

import SVG_Add from '../../assets/svg/Add';

export default function UserHeader(props) {

    const [following, setFollowing] = useState(false);

    const follow = () => {
        const db = getDatabase();
        const uid = getAuth().currentUser.uid;

        get(child(ref(db), "users/" + uid))
            .then((result) => {

                if (result.exists()) {
                    let a = result.val();

                    let following = [];
                    if (result.hasChild('following')) following = a['following'];
                    else following = [];
                    following.push(props.userID);

                    set(ref(db, "users/" + uid), {
                        ...a,
                        following: following
                    }).catch((error) => console.log("error s", error.code))
                }

            }).catch((error) => console.log("error g", error.code))
            .finally(() => {

                get(child(ref(db), "users/" + props.userID))
                .then((result) => {

                    if (result.exists()) {
                        let a = result.val();

                        let follower = [];
                        if (result.hasChild('follower')) follower = a['follower'];
                        else follower = [];
                        follower.push(uid);

                        set(ref(db, "users/" + props.userID), {
                            ...a,
                            follower: follower
                        }).catch((error) => console.log("error s", error.code))
                    }

                }).catch((error) => console.log("error g", error.code))

                .finally(() => setFollowing(true));
            })
    }

    useEffect(() => {
        get(child(ref(getDatabase()), "users/" + getAuth().currentUser.uid + "/following"))
            .then((result) => {
                if (result.exists()) {
                    const data = result.val();
                    setFollowing(data.includes(props.userID));
                } else {
                    setFollowing(false);
                }
            })
    })

    return (
        <View style={ props.style }>
                {/* User */}
            <Pressable style={ styles.container } onPress={props.onPress}>

                <View style={ styles.profilePBContainer }>
                    <Image source={{ uri: props.user.pbUri }} style={ styles.icon } resizeMode="cover" />
                </View>
                <Text allowFontScaling style={ styles.profileText }>{props.user.name}</Text>

                    {/* Follow */}
                {
                    !(!(getAuth().currentUser.uid === props.userID) && !following) ?
                        null :
                        <Pressable style={ styles.followBtn } onPress={ props.onPress } >
                            <View style={ styles.followBtnBG }>
                                <SVG_Add style={ styles.followBtnIcon } fill={"#000000"} />
                            </View>
                        </Pressable>
                }
                
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",

        position: "relative",
        marginVertical: 2,

        padding: 10,

        flexDirection: "row",
        alignItems: "center",
    },

    profilePBContainer: {
        flex: .15,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 50,
    },    

    profileText: {
        flex: .75,
        fontFamily: "Barlow_Regular",
        fontSize: 25,
        color: "#5884B0",
        paddingHorizontal: 10,
    },

    followBtn: {
        flex: .1,
        alignItems: "center",
    },
    followBtnBG: {
        width: "100%",
        aspectRatio: 1,
        paddingVertical: 10,

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,

        backgroundColor: "#5884B0"
    },
    followBtnIcon: {
        aspectRatio: 1,
        borderRadius: 50,
    },
})