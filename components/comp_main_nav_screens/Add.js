import React, { useState } from "react";

import { View, StyleSheet, Text, ScrollView } from "react-native";

import Navbar from "../comp_static_items/Navbar";
import PostPreview from "../comp_variable_items/PostPreview";

const Data_PLACEHOLDER = [
  {
    type: 0,
    title: "Nowy post wozjewić",
  },
  {
    type: 1,
    title: "Nowy ewent wozjewić",
    geoCords: {
      latitude: 51.2392335862277,
      latitudeDelta: 0.01,
      longitude: 14.281389642218592,
      longitudeDelta: 0.005,
    },
    checks: [],
  },
];

export default function Add({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} adjustsFontSizeToFit>
          Post abo ewent wozjewić
        </Text>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInnerContainer}
        keyboardDismissMode="on-drag"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={ styles.innerContainer }> */}

        <Text style={styles.titleText}>Wuzwol sej typ:</Text>

        <View style={styles.itemsContainer}>
          <PostPreview
            style={styles.item}
            postShowText
            item={Data_PLACEHOLDER[0]}
            press={() => navigation.navigate("PostCreate")}
          />
          <PostPreview
            style={styles.item}
            item={Data_PLACEHOLDER[1]}
            press={() => navigation.navigate("EventCreate")}
          />
        </View>

        {/* </View> */}
      </ScrollView>

      <Navbar
        style={styles.navbar}
        active={2}
        onPressRecent={() => {
          navigation.navigate("Recent");
        }}
        onPressSearch={() => {
          navigation.navigate("Search");
        }}
        onPressAdd={() => {
          navigation.navigate("Add");
        }}
        onPressProfile={() => {
          navigation.navigate("Profile");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5884B0",
  },

  titleContainer: {
    flex: 0.08,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    textAlign: "center",
    color: "#000000",
  },

  contentContainer: {
    flex: 0.9,
    width: "100%",
    paddingVertical: 5,
    borderRadius: 25,
  },

  contentInnerContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    flex: 1,
    marginVertical: -5,
  },

  navbar: {
    height: "6%",
    width: "80%",
    alignSelf: "center",
    zIndex: 99,
  },

  titleText: {
    textAlign: "center",
    paddingVertical: 25,

    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#5884B0",
  },

  itemsContainer: {
    width: "100%",
    flexDirection: "row",
  },

  item: {
    aspectRatio: 0.9,
    flex: 1,

    borderRadius: 25,
    margin: 10,
    backgroundColor: "#143C63",

    justifyContent: "center",
    alignItems: "center",
  },
});
