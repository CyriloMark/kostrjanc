import React from 'react'

import { View, StyleSheet, Text } from "react-native";

import AppHeader from '../statics/AppHeader';

export default function Landing() {
  return (
    <View style={ styles.container }>
      <AppHeader style={{ width: "100%", height: "10%" }} />
      <Text>Landing</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#5884B0",
      padding: 10
  }
});
