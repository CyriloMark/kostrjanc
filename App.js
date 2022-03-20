import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

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
      <SafeAreaProvider>
        <ViewportManager />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
