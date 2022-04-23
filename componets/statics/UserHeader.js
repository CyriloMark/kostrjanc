import React, { useEffect, useState } from 'react'

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

import { getAuth } from 'firebase/auth';
import { getDatabase, set, ref, get, child } from 'firebase/database';

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
            <Pressable style={[ styles.userContainer, styles.shadow ]} onPress={props.onPress}>
                <View style={ styles.userIconContainer }>
                    <Image source={{ uri: props.user.pbUri }} style={ styles.userIcon } resizeMode="cover" />
                </View>
                <Text style={ styles.userTitleText }>{props.user.name}</Text>
                {
                    !(!(getAuth().currentUser.uid === props.userID) && !following) ?
                        null :
                        <Pressable style={[ styles.userAddContainer ]} onPress={follow}>
                            <Text style={[ styles.userAddText, styles.shadow ]}>+</Text>
                        </Pressable>
                }
                
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    userContainer: {
        width: "100%",
        borderRadius: 15,

        flexDirection: "row",
        alignItems: "center",
        padding: 10,

        backgroundColor: "#143C63",
    },
    userIconContainer: {
        flex: .2,
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1,
    },
    userIcon: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 50,
    },
    userTitleText: {
        flex: .6,
        color: "#5884B0",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,

        marginHorizontal: "5%",
        alignSelf: "center",
    },
    userAddContainer: {
        flex: .2,
        justifyContent: "center",
        alignItems: "center",
    },
    userAddText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        color: "#B06E6A",
        elevation: 10,
    },
})