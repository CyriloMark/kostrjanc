import React, { useEffect, useRef, useState } from "react";

import { View, Image, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        {/* ICON */}
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/app-system-icons/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.heading}>kostrjanc</Text>
        <Text style={styles.subHeading}>1. serbski social media</Text>
      </View>

      <Text style={styles.version}>
        wersija {require("../../app.json").expo.version}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5884B0",
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: "60%",
    aspectRatio: 1,
    marginVertical: 25,

    backgroundColor: "#000000",
    borderRadius: 50,
    padding: 25,

    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "100%",
    height: "100%",
  },
  heading: {
    width: "100%",
    color: "#000000",
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    marginVertical: 5,
    textAlign: "center",
  },
  subHeading: {
    width: "80%",
    color: "#000000",
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    marginVertical: 5,
    textAlign: "center",
  },

  version: {
    color: "#000000",

    fontFamily: "RobotoMono_Thin",
    fontSize: 15,

    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    margin: 25,
    textAlign: "center",
  },
});
