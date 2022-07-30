import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import { getDatabase, ref, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";

import MapView, { Marker } from 'react-native-maps';

import { convertTimestampIntoString } from '../comp_variable_screens/EventView';

import SVG_Basket from '../../assets/svg/Basket';

const EVENT_PLACEHOLDER = {
    title: "",
    description: "",
    created: "",
    starting: "",
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
                    isBanned: false,
                    starting: data['starting']
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
        <View style={ props.style }>
            <Pressable style={ styles.container } onPress={ !event.isBanned ? props.onPress : null } >

                    {/* Header */}
                <View style={ styles.titleContainer }>
                    <Text style={ styles.titleText }>{ !event.isBanned ? event.title : "" }</Text>
                    <Text style={ styles.subText }>{ !event.isBanned ? convertTimestampIntoString(event.starting) : "" }</Text>
                </View>

                    {/* IMG */}
                <View style={ styles.mapContainer }>
                    {
                        !event.isBanned ?
                            (
                                pin != null ?
                                    <MapView style={styles.map} accessible={false} focusable={false} rotateEnabled={false} zoomEnabled={false} pitchEnabled={false} 
                                        initialRegion={ event.geoCords } scrollEnabled={false} >
                                        {
                                            !event.isBanned ?
                                                <Marker title={event.title} coordinate={event.geoCords} /> : null
                                        }
                                    </MapView> : null
                            ) :
                            <SVG_Basket style={ styles.delIcon } fill="#143C63" />
                    }
                </View>

                    {/* PB List */}
                <View style={ styles.checkPBContainer } >
                    <Text style={ styles.hintText }>Pódla su:</Text>
                    {
                        imgUris ?
                            imgUris.map((el, key) =>
                                <Image key={key} source={{ uri: el }} style={[ styles.checkPBItem, key === 0 ? {} : styles.checkPBItemNF, { zIndex: 40-key, opacity: 1 - parseFloat("." + (key * 2)) } ]} />
                            ) : null
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
        alignItems: "center",
    },

    titleContainer: {
        width: "100%",
        flex: .1,

        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    titleText: {
        width: "100%",
        color: "#5884B0",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },
    subText: {
        width: "100%",
        marginTop: 10,
        fontFamily: "RobotoMono_Thin",
        fontSize: 15,
        color: "#5884B0"
    },


    mapContainer: {
        aspectRatio: 2/1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        overflow: "hidden",
    },
    map: {
        flex: 1,
        width: "100%",
    },

    delIcon: {
        flex: .5,
        width: "100%",
        zIndex: 99,
    },

    checkPBContainer: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingTop: 10
    },
    hintText: {
        fontFamily: "RobotoMono_Thin",
        fontSize: 15,
        color: "#5884B0",
        marginRight: 10,
        alignSelf: "center"
    },
    checkPBItem: {
        padding: 15,
        borderRadius: 50,
    },
    checkPBItemNF: {
        marginLeft: -15
    }
});