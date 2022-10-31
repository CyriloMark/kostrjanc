import React, { useRef } from "react";

import { View, StyleSheet, ScrollView, Text } from "react-native";

import Modal from "../comp_variable_items/Modal";

export default function RulesAgbModal(props) {
  const mainScroll = useRef();

  return (
    <Modal
      onRequestClose={props.close}
      visible={props.visible}
      content={
        <ScrollView
          ref={mainScroll}
          style={{ width: "100%" }}
          scrollEnabled
          bounces
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.title}>
            Powšitkowne wobchodne wuměnjenja a regule za wužiwanje kostrjanc
          </Text>

          <Text style={styles.text}>
            Eiusmod labore laborum fugiat esse proident eu aute anim eiusmod
            anim minim nulla. Reprehenderit reprehenderit sint veniam irure ea
            culpa minim mollit reprehenderit aute. Pariatur non eiusmod
            exercitation dolore anim proident nostrud aliqua. Laboris nisi
            voluptate id labore anim exercitation laboris laboris nulla. Labore
            velit magna voluptate do ut cillum consequat consectetur duis.
          </Text>
        </ScrollView>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: {
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 10,

    color: "#5884B0",
    fontFamily: "Barlow_Bold",
    fontSize: 25,
  },
  text: {
    marginVertical: 10,
    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
  },
});
