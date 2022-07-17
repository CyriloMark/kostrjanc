import React, { useState, useEffect } from "react";

import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { get, child, getDatabase, ref } from "firebase/database";

export default function UpdateVersionView() {

  const [recentVersion, setRecentVersion] = useState();

  useEffect(() => {
    get(child(ref(getDatabase()), "version"))
      .then(ver => setRecentVersion(ver.val()))
      .catch(error => console.log("error", error.code))
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image source={require('../assets/app-system-icons/icon.png')} style={ styles.icon } resizeMode="contain" />
        <Text style={ styles.heading }>Twój kostrjanc njeje wjac na najnowšim stawje! Prošu instaluj sej najaktualnišu wersiju</Text>
        <Text style={ styles.subHeading }>Twoja wersija {require('../app.json').expo.version}</Text>
        <Text style={ styles.subHeading }>Aktualna wersija {recentVersion}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#5884B0",
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    flex: .4,
    aspectRatio: 1,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
    overflow: "visible",
    marginVertical: 10
  },
  heading: {
    width: "80%",
    color: "#143C63",
    fontFamily: "Inconsolata_Black",
    fontSize: 25,
    marginVertical: 10,
    textAlign: "center"
  },
  subHeading: {
    color: "#143C63",
    fontFamily: "Inconsolata_Light",
    fontSize: 25,
    marginVertical: 5
  },
});
