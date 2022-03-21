import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

import { initializeApp } from "firebase/app"

const app = initializeApp({
  apiKey: "AIzaSyAKOoHKDJSBvVUbKMG0F5uYLnuwgSINYk0",
  authDomain: "kostrjanc.firebaseapp.com",
  projectId: "kostrjanc",
  storageBucket: "kostrjanc.appspot.com",
  messagingSenderId: "919686819174",
  appId: "1:919686819174:web:e5d7f4dd63f8ca62c6aca7"
});

import Loading from "./componets/Loading";

import ViewportManager from "./componets/main/ViewportManager";

import AuthPage from "./componets/auth/AuthPage";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {

  const [fontsLoaded, fontsError] = useFonts({
    Inconsolata_Light: require("./assets/fonts/Inconsolata-ExtraLight.ttf"),
    Inconsolata_Regular: require("./assets/fonts/Inconsolata-Regular.ttf"),
    Inconsolata_Black: require("./assets/fonts/Inconsolata-Black.ttf"),
  });

  if (!fontsLoaded) {
    return (<></>);
  }

  return (
    <NavigationContainer>
      <SafeAreaProvider style={{ flex: 1 }}>
        <ViewportManager />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
