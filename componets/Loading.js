import React from "react";

import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import Navbar from "./Navbar";

export default function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Navbar />
        <View style={styles.center}>
          <Text style={styles.heading}>kostrjanc</Text>
          <Text style={styles.subHeading}>přeni serbski social media</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#5884B0",
  },
  center: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "white",
    fontFamily: "Inconsolata_Regular",
    fontSize: 64,
  },
  subHeading: {
    color: "white",
    fontFamily: "Inconsolata_Regular",
    fontSize: 20,
  },
});
