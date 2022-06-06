import React, { useEffect, useState, useRef } from "react";

import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

import { initializeApp } from "firebase/app"

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from "firebase/database";

import BannView from "./componets/BannView";

const app = initializeApp({
  apiKey: "AIzaSyAKOoHKDJSBvVUbKMG0F5uYLnuwgSINYk0",
  authDomain: "kostrjanc.firebaseapp.com",
  databaseURL: "https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kostrjanc",
  storageBucket: "kostrjanc.appspot.com",
  messagingSenderId: "919686819174",
  appId: "1:919686819174:web:e5d7f4dd63f8ca62c6aca7"
});

import Loading from "./componets/Loading";

import AuthManager from "./componets/auth/AuthManager";
import ViewportManager from "./componets/main/ViewportManager";

import { NavigationContainer } from "@react-navigation/native";

export default function App() {

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [banned, setBanned] = useState(false);

  const [fontsLoaded, fontsError] = useFonts({
    Inconsolata_Light: require("./assets/fonts/Inconsolata-ExtraLight.ttf"),
    Inconsolata_Regular: require("./assets/fonts/Inconsolata-Regular.ttf"),
    Inconsolata_Black: require("./assets/fonts/Inconsolata-Black.ttf"),
  });

  useEffect(() => {
    
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true);
            setLoaded(true);
        } else {
            setLoggedIn(false);
            setLoaded(true);
        }
    });

    if (getAuth().currentUser !== null) {
      const db = getDatabase();
      onValue(ref(db, "users/" + getAuth().currentUser.uid + "/isBanned"), (snapshot) => {
        const data = snapshot.val();
        setBanned(data);
      });
    }

  });

  if (!fontsLoaded) {
    return (<></>); 
  }

  if (!loaded) {
    return <Loading />
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <AuthManager />
      </NavigationContainer>
    )
  }

  if (banned) return <BannView />

  return (
    <NavigationContainer>
      <StatusBar animated barStyle="light-content" hidden={false} networkActivityIndicatorVisible />
      <SafeAreaProvider style={{ flex: 1 }}>
        <ViewportManager />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}