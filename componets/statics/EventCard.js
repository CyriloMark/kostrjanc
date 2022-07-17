import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import { getDatabase, ref, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";

import MapView from 'react-native-maps';

import SVG_Basket from '../../assets/svg/Basket';

const EVENT_PLACEHOLDER = {
    title: "hey",
    description: "test",
    created: "27.3.2022 21:20",
    checks: 0,
    isBanned: false
}

export default function EventCard(props) {

    const [event, setEvent] = useState(EVENT_PLACEHOLDER);
    const [pin, setPin] = useState(null);
    const [imgUris, setImgUris] = useState(null);

    const loadData = () => {
        const db = getDatabase();

        get(child(ref(db), 'events/' + props.eventID))
            .then(snapshot => {
                const data = snapshot.val();

                if (snapshot.hasChild('isBanned')) {
                    if (data['isBanned']) {
                        setEvent({
                            ...EVENT_PLACEHOLDER,
                            isBanned: true
                        });
                        return;
                    }
                }

                setEvent({
                    id: data['id'],
                    creator: data['creator'],
                    title: data['title'],
                    description: data['description'],
                    geoCords: data['geoCords'],
                    created: data['created'],
                    checks: data['checks'],
                    isBanned: false
                });
                setPin(data['geoCords']);

                getChecksUris(data['checks']);
            })
            .catch(error => console.log("error", error.code));
    }

    let getChecksUris = (c) => {

        const IMGamt = 3;

        let finalList = [];
        let uriList = [];

        const db = getDatabase();
        get(child(ref(db), "users/" + getAuth().currentUser.uid + "/following"))
            .then(snapshot => {
                if (snapshot.exists()) {
                    const ids = snapshot.val();
                    c.forEach(el => {
                        if (ids.includes(el)) finalList.push(el);
                    })
                }
            })
            .finally(() => {
                get(child(ref(db), "users/" + getAuth().currentUser.uid + "/follower"))
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            const ids = snapshot.val();
                            c.forEach(el => {
                                if (ids.includes(el) && !finalList.includes(el)) finalList.push(el);
                            })
                        }
                    })
                    .finally(() => {
                        if (finalList.length > IMGamt) {
                            finalList.splice(IMGamt - 1, finalList.length - IMGamt);
                        } else if (finalList.length < IMGamt && c.length >= IMGamt) {
                            let otherChecks = c.filter(i => !finalList.includes(i));
                            for (let i = 0; i < IMGamt - finalList.length; i++) {
                                finalList.push(otherChecks[i]);
                            }
                        } else if (finalList.length < IMGamt && c.length <= IMGamt) {
                            let otherChecks = c.filter(i => !finalList.includes(i));
                            otherChecks.forEach(a => finalList.push(a));
                        }

                        for (let i = 0; i < finalList.length; i++) {
                            get(child(ref(db), "users/" + finalList[i] + "/pbUri"))
                                .then(snap => {
                                    uriList.push(snap.val());
                                })
                                .finally(() => {
                                    if (finalList.length - 1 === i) setImgUris(uriList);
                                })
                                .catch(error => console.log("error", error.code))
                        }

                    })
            })
    }

    useEffect(() => {
        if (event === EVENT_PLACEHOLDER) loadData();
    }, []);

    return (
        <Pressable style={[ props.style, { borderRadius: 15, overflow: "hidden", justifyContent: "center", alignItems: "center" } ]} onPress={ props.onPress }>

            {
                pin != null ?
                <MapView style={styles.map}
                accessible={false} focusable={false}
                initialRegion={ event.geoCords }
                /> : null
            }
            <SVG_Basket style={[ styles.postDelIcon, { opacity: event.isBanned ? 1 : 0 } ]} fill="#5884B0" />

            {
                !event.isBanned ?

                <View style={ styles.eventCardContainer }>
                        {/* Info Text */}
                    <View style={ styles.eventCardInfoContainer }>
                            {/* Title */}
                        <Text style={ styles.eventCardInfoTitle }>{event.title}</Text>
                            {/* Describtion */}
                        <Text style={ styles.eventCardInfoBio } >{event.description}</Text>
                    </View>

                    <View style={ styles.checkPBContainer } >
                        {
                            imgUris ?
                            imgUris.map((el, key) =>
                                <Image key={key} source={{ uri: el }} style={[ styles.checkPBItem, key === 0 ? {} : styles.checkPBItemNF, { zIndex: 40-key } ]} />
                            ) : null
                        }
                    </View>

                </View>

                : null
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    map: {
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        borderRadius: 15,
        zIndex: 2,
    },
    postDelIcon: {
        position: "absolute",
        width: "50%",
        height: "50%",
        zIndex: 99,
    },


    eventCardContainer: {
        width: "100%",
        paddingHorizontal: 25,
        paddingVertical: 10,
        backgroundColor: "rgba(176, 110, 106, .8)",
        zIndex: 3
    },
    eventCardInfoContainer: {
        width: "100%",
    },
    eventCardInfoTitle: {
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        marginVertical: 10,
    },
    eventCardInfoBio: {
        width: "80%",
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
    },
    eventCardInterationsContainer: {
        width: "100%",
        flexDirection: "row",
        padding: 10
    },
    eventCardInterationsBtn: {
        backgroundColor: "#143C63",
        borderRadius: 25,

        paddingVertical: 10,
        paddingHorizontal: 25,
        marginRight: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    eventCardInterationsBtnText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
    },

    checkPBContainer: {
        width: "100%",
        margin: 10,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
    },
    checkPBItem: {
        padding: 15,
        borderRadius: 50,
    },
    checkPBItemNF: {
        marginLeft: -10
    }
})