import React from "react";
import { StyleSheet, View } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.container}>
      <View style={styles.navbarBG}>
        <View style={styles.icon}></View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  navbarBG: {
    width: 500,
    backgroundColor: "#143C63",
  },
  icon: {
    width: 50,
    height: 50,
  },
});
