import React from "react";

import { View, StyleSheet, TextInput, Pressable } from "react-native";

import SVG_Search from "../../assets/svg/Search";

export default function SearchHeader(props) {
  return (
    <View style={props.style}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pytaj něšto..."
          maxLength={128}
          editable
          multiline={false}
          numberOfLines={1}
          placeholderTextColor={"#000000"}
          selectionColor={"#5884B0"}
          keyboardType="default"
          keyboardAppearance="dark"
          value={props.input}
          onChangeText={props.onText}
        />

        {/* Search Btn */}
        <Pressable style={styles.searchBtn} onPress={props.onPress}>
          <View style={styles.searchBtnBG}>
            <SVG_Search style={styles.searchBtnIcon} fill={"#5884B0"} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    borderRadius: 25,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,

    backgroundColor: "#5884B0",
  },

  searchBtn: {
    height: "100%",
    flex: 0.2,
    alignItems: "center",
  },
  searchBtnBG: {
    aspectRatio: 1,
    height: "100%",
    paddingVertical: 10,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,

    backgroundColor: "#000000",
  },
  searchBtnIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 50,
  },

  input: {
    flex: 0.8,
    height: "80%",
    marginHorizontal: 10,

    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#000000",

    borderRadius: 15,
  },
});
