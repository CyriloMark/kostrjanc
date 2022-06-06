import React from "react";

import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Loading() {

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          <Text style={styles.heading}>kostrjanc</Text>
          <Text style={styles.subHeading}>1. serbski social media</Text>
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
  heading: {
    color: "#143C63",
    fontFamily: "Inconsolata_Black",
    fontSize: 50,
    marginVertical: 10,
    textAlign: "center"
  },
  subHeading: {
    color: "#143C63",
    fontFamily: "Inconsolata_Light",
    fontSize: 25,
    marginVertical: 10
  },
});
