import React, { useState, useEffect } from "react";

import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../comp_static_items/AppHeader";

import { get, child, getDatabase, ref } from "firebase/database";

export default function UpdateVersionView() {

  const [recentVersion, setRecentVersion] = useState();

  useEffect(() => {
    get(child(ref(getDatabase()), "version"))
      .then(ver => setRecentVersion(ver.val()))
      .catch(error => console.log("error UpdateVersionView version", error.code))
  }, []);

  return (
    <SafeAreaView style={ styles.container } >

      <AppHeader style={styles.header} />

      <ScrollView style={ styles.contentContainer } contentContainerStyle={[ styles.contentInnerContainer, { marginVertical: -5 } ]} showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false} bounces={false}>

        <View style={ styles.iconContainer }>
          <Image source={require('../../assets/app-system-icons/icon.png')} style={ styles.icon } resizeMode="contain" />
        </View>

        <Text style={ styles.heading }>Twój kostrjanc njeje wjac na najnowšim stawje! Prošu instaluj sej najaktualnišu wersiju</Text>
        <Text style={ styles.subHeading }>Twoja wersija {require('../../app.json').expo.version}</Text>
        <Text style={ styles.subHeading }>Aktualna wersija {recentVersion}</Text>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#143C63",
  },

  contentContainer: {
      flex: .8,
      width: "100%",
      paddingVertical: 5,
      borderRadius: 25,
  },
  contentInnerContainer: {
      paddingHorizontal: 10,
      backgroundColor: "#000",
      flex: 1,

      justifyContent: "center",
      alignItems: "center"
  },

  header: {
      flex: .08,
      width: "100%",

      alignSelf: "center",

      zIndex: 99
  },

  iconContainer: {
    width: "40%",
    aspectRatio: 1,
    marginVertical: 25,

    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "100%",
    height: "100%"
  },
  heading: {
    width: "100%",
    color: "#5884B0",
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    marginVertical: 5,
    textAlign: "center"
  },
  subHeading: {
    width: "80%",
    color: "#5884B0",
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    marginVertical: 5,
    textAlign: "center"
  },
});
