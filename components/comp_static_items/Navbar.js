import React from "react";

import { View, StyleSheet, Pressable } from "react-native";

import SVG_Recent from "../../assets/svg/Recent";
import SVG_Search from "../../assets/svg/Search";
import SVG_Add from "../../assets/svg/Add";
import SVG_Profile from "../../assets/svg/Profile";

export default function Navbar(props) {
  return (
    <View style={props.style}>
      <View style={styles.container}>
        <Pressable
          style={[
            styles.navbarItem,
            { transform: [{ scale: props.active === 0 ? 1.1 : 1 }] },
          ]}
          onPress={props.onPressRecent}
          hitSlop={10}
        >
          <SVG_Recent fill={props.active === 0 ? "#000000" : "#143C63"} />
        </Pressable>
        <Pressable
          style={[
            styles.navbarItem,
            { transform: [{ scale: props.active === 1 ? 1.1 : 1 }] },
          ]}
          onPress={props.onPressSearch}
          hitSlop={10}
        >
          <SVG_Search fill={props.active === 1 ? "#000000" : "#143C63"} />
        </Pressable>
        <Pressable
          style={[
            styles.navbarItem,
            { transform: [{ scale: props.active === 2 ? 1.1 : 1 }] },
          ]}
          onPress={props.onPressAdd}
          hitSlop={10}
        >
          <SVG_Add fill={props.active === 2 ? "#000000" : "#143C63"} />
        </Pressable>
        <Pressable
          style={[
            styles.navbarItem,
            { transform: [{ scale: props.active === 3 ? 1.1 : 1 }] },
          ]}
          onPress={props.onPressProfile}
          hitSlop={10}
        >
          <SVG_Profile fill={props.active === 3 ? "#000000" : "#143C63"} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#5884B0",

    flexDirection: "row",
    padding: 10,
  },
  navbarItem: {
    flex: 1,
    height: "80%",
  },
});
