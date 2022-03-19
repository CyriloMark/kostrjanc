import React, { useState, useEffect } from 'react'

import { View, StyleSheet, Text } from 'react-native';

export default function AuthPage() {
  return (
    <View style={ styles.container }>
        <Text style={ styles.text }>Hey</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
      fontFamily: "Inconsolata_Regular",
      color: "red",
      fontSize: 20,
    }
});
