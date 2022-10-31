import React from "react";

import { View, Pressable, StyleSheet, Text } from "react-native";

import SVG_Return from "../../assets/svg/Return";

export default function BackHeader(props) {
  return (
    <View style={props.style}>
      <View style={styles.container}>
        <Pressable style={styles.backBtn} onPress={props.onPress}>
          <View style={styles.backBtnBG}>
            <SVG_Return style={styles.backBtnIcon} fill={"#5884B0"} />
          </View>
        </Pressable>

        <Text numberOfLines={1} style={styles.titleText}>
          {props.title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,

    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5884B0",
  },
  backBtn: {
    marginVertical: 5,
    flex: 0.2,
    alignItems: "center",
  },
  backBtnBG: {
    aspectRatio: 1,
    height: "100%",
    paddingVertical: 10,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,

    backgroundColor: "#000000",
  },
  backBtnIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 50,
  },
  titleText: {
    flex: 0.8,
    color: "#000000",
    marginLeft: 10,
    fontFamily: "Barlow_Bold",
    fontSize: 25,
  },
});
