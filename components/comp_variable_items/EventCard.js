import React, { useState, useEffect } from "react";

import { View, Text, StyleSheet, Pressable, Image } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";

import MapView, { Marker } from "react-native-maps";

import { convertTimestampIntoString } from "../comp_variable_screens/EventView";

import SVG_Basket from "../../assets/svg/Basket";
import SVG_Live from "../../assets/svg/Live";

const EVENT_PLACEHOLDER = {
  title: "",
  description: "",
  created: "",
  starting: "",
  checks: 0,
  isBanned: false,
};

export default function EventCard(props) {
  const [event, setEvent] = useState(EVENT_PLACEHOLDER);
  const [pin, setPin] = useState(null);
  const [imgUris, setImgUris] = useState(null);

  const [isLive, setIsLive] = useState(false);

  const checkIfLive = (st, en) => {
    const date = Date.now();
    if (date >= st && date <= en) setIsLive(true);
    else setIsLive(false);
  };

  const loadData = () => {
    const db = getDatabase();

    get(child(ref(db), "events/" + props.eventID))
      .then((snapshot) => {
        const data = snapshot.val();

        if (snapshot.hasChild("isBanned")) {
          if (data["isBanned"]) {
            setEvent({
              ...EVENT_PLACEHOLDER,
              isBanned: true,
            });
            return;
          }
        }

        setEvent({
          ...data,
          checks: snapshot.hasChild("checks") ? data["checks"] : [],
          isBanned: false,
        });
        setPin(data["geoCords"]);
        checkIfLive(data["starting"], data["ending"]);
        getChecksUris(snapshot.hasChild("checks") ? data["checks"] : []);
      })
      .catch((error) => console.log("error eventCard getEvents", error.code));
  };

  let getChecksUris = (d) => {
    const IMGamt = 3;

    let finalList = [];
    let uriList = [];

    const db = getDatabase();
    get(child(ref(db), "users/" + getAuth().currentUser.uid + "/following"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const ids = snapshot.val();
          d.forEach((el) => {
            if (ids.includes(el)) finalList.push(el);
          });
        }
      })
      .finally(() => {
        get(child(ref(db), "users/" + getAuth().currentUser.uid + "/follower"))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const ids = snapshot.val();
              d.forEach((el) => {
                if (ids.includes(el) && !finalList.includes(el))
                  finalList.push(el);
              });
            }
          })
          .finally(() => {
            if (finalList.length > IMGamt) {
              finalList.splice(IMGamt - 1, finalList.length - IMGamt);
            } else if (finalList.length < IMGamt && d.length >= IMGamt) {
              let otherChecks = d.filter((i) => !finalList.includes(i));
              for (let i = 0; i < IMGamt - finalList.length; i++)
                finalList.push(otherChecks[i]);
            } else if (finalList.length < IMGamt && d.length <= IMGamt) {
              let otherChecks = d.filter((i) => !finalList.includes(i));
              otherChecks.forEach((a) => finalList.push(a));
            }

            for (let i = 0; i < finalList.length; i++) {
              get(child(ref(db), "users/" + finalList[i] + "/pbUri"))
                .then((snap) => {
                  uriList.push(snap.val());
                })
                .finally(() => {
                  if (finalList.length - 1 === i) setImgUris(uriList);
                })
                .catch((error) =>
                  console.log("error EventCard getUsersPBUri", error.code)
                );
            }
          });
      });
  };

  useEffect(() => {
    if (event === EVENT_PLACEHOLDER) loadData();
  }, []);

  return (
    <View style={props.style}>
      <Pressable
        style={styles.container}
        onPress={!event.isBanned ? props.onPress : null}
      >
        {/* Header */}
        <View style={styles.titleContainer}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            {/* Live */}
            {isLive ? (
              <View style={styles.liveContainer}>
                <SVG_Live style={styles.liveIcon} fill="#B06E6A" />
              </View>
            ) : null}
            <Text style={styles.titleText}>
              {!event.isBanned ? event.title : ""}
            </Text>
          </View>
          <Text style={styles.subText}>
            {!event.isBanned ? convertTimestampIntoString(event.starting) : ""}
          </Text>
        </View>

        {/* IMG */}
        <View style={styles.mapContainer}>
          {!event.isBanned ? (
            pin != null ? (
              <MapView
                style={styles.map}
                accessible={false}
                focusable={false}
                rotateEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                initialRegion={event.geoCords}
                scrollEnabled={false}
                onPress={props.onPress}
              >
                {!event.isBanned ? (
                  <Marker coordinate={event.geoCords} />
                ) : null}
              </MapView>
            ) : null
          ) : (
            <SVG_Basket style={styles.delIcon} fill="#143C63" />
          )}
        </View>

        {/* PB List */}
        <View style={styles.checkPBContainer}>
          <Text style={styles.hintText}>Pódla su:</Text>
          {imgUris
            ? imgUris.map((el, key) => (
                <Image
                  key={key}
                  source={{ uri: el }}
                  style={[
                    styles.checkPBItem,
                    key === 0 ? {} : styles.checkPBItemNF,
                    {
                      zIndex: 40 - key,
                      opacity: 1 - parseFloat("." + key * 2),
                    },
                  ]}
                />
              ))
            : null}
        </View>
      </Pressable>
    </View>
  );
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
    flex: 0.1,

    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  titleText: {
    flex: 0.9,
    color: "#5884B0",
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    alignSelf: "center",
  },
  subText: {
    width: "100%",
    marginTop: 10,
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    color: "#5884B0",
  },

  liveContainer: {
    alignSelf: "center",
    flex: 0.1,
    marginRight: 10,
  },
  liveIcon: {
    width: "100%",
    aspectRatio: 1,
  },

  mapContainer: {
    aspectRatio: 2 / 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  map: {
    flex: 1,
    minHeight: 25,
    width: "100%",
  },

  delIcon: {
    flex: 0.5,
    width: "100%",
    zIndex: 99,
  },

  checkPBContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  hintText: {
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    color: "#5884B0",
    marginRight: 10,
    alignSelf: "center",
  },
  checkPBItem: {
    padding: 15,
    borderRadius: 50,
  },
  checkPBItemNF: {
    marginLeft: -15,
  },
});
