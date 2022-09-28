import React, { useState, useEffect } from 'react'

import { View, StyleSheet, Image, Pressable } from 'react-native';

import { getAuth } from 'firebase/auth';

import PostCard from "./PostCard";
import EventCard from "./EventCard";

import SVG_Ad from '../../assets/svg/Ad';
import SVG_Search from '../../assets/svg/Search';

export default function AdCard(props) {

    const [ad, setAd] = useState(null);

    useEffect(() => {
        getAuth().currentUser.getIdToken(true)
            .then(idToken => {

                fetch("http://vps343020.ovh.net:8080/get_ad", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: idToken,
                        amount: 1,
                    })
                })
                    .then(res => res.json()
                        .then(data => setAd(data[0]))
                        .catch(error => {
                            setAd(null);
                            console.log("error get_ad", error.code);
                        }))
                    .catch(error => console.log("error fetch ads", error.code))
            })
    }, []);

    return(
        <View style={ props.style }>
            <Pressable style={ styles.container } >

                    {/* IMG */}
                <View style={ styles.contentContainer }>
                    {
                        ad ?
                            ad.targetType === 0 ?
                                <PostCard style={styles.card} postID={ad.target} onPress={ () => props.press(ad) } /> :
                                <EventCard style={styles.card} eventID={ad.target} />
                            : null
                    }
                </View>

                    {/* Menu */}
                <View style={ styles.menuContainer }>
                    <SVG_Ad fill="#B06E6A" style={[ styles.icon, { aspectRatio: 5/3 } ]} />
                    <Pressable style={[ styles.icon, { aspectRatio: 1, height: "80%" } ]} onPress={ad ? () => props.press(ad) : null} >
                        <SVG_Search fill="#B06E6A" style={{ width: "100%", aspectRatio: 1 }} />
                    </Pressable>
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
    },

    contentContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",

        padding: 15,

        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#B06E6A",

        backgroundColor: "rgba(176, 110, 106, .15)",

        overflow: "hidden",
    },
    card: {
        flex: 1,
        width: "100%",
    },

    menuContainer: {
        width: "100%",
        aspectRatio: 8,
        
        paddingHorizontal: 10,
        paddingTop: 10,

        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        height: "100%",
        marginRight: 10,
    },
});