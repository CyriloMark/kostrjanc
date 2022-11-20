import React from "react";

import { View, Text, StyleSheet, Image, Pressable } from "react-native";

import SVG_Settings from "../../assets/svg/Settings";

export default function AppHeader(props) {
  return (
    <View style={props.style}>
      {/* Header */}
      <Pressable style={styles.headerContainer} onPress={props.press}>
        <Text style={styles.headerTitleText}>kostrjanc</Text>

        {props.showSettings ? (
          <Pressable style={styles.settingsBtn} onPress={props.settingsPress}>
            <View style={styles.settingsBtnBG}>
              <SVG_Settings style={styles.settingsBtnIcon} fill={"#5884B0"} />
            </View>
          </Pressable>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,

    backgroundColor: "#5884B0",
  },

  settingsBtn: {
    height: "100%",
    flex: 0.2,
    alignItems: "center",
  },
  settingsBtnBG: {
    aspectRatio: 1,
    height: "100%",
    paddingVertical: 7,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,

    backgroundColor: "#000000",
  },
  settingsBtnIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 50,
  },

  headerTitleText: {
    flex: 0.8,
    color: "#000000",
    marginLeft: 10,
    fontFamily: "Barlow_Bold",
    fontSize: 20,
  },
});
