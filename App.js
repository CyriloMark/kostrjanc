import React, { useEffect, useState, useRef } from "react";

import { StatusBar, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";

import { initializeApp } from "firebase/app"

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, get, child, set } from "firebase/database";

const app = initializeApp({
  apiKey: "AIzaSyAKOoHKDJSBvVUbKMG0F5uYLnuwgSINYk0",
  authDomain: "kostrjanc.firebaseapp.com",
  databaseURL: "https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kostrjanc",
  storageBucket: "kostrjanc.appspot.com",
  messagingSenderId: "919686819174",
  appId: "1:919686819174:web:e5d7f4dd63f8ca62c6aca7",
  measurementId: "G-Z5ZWQ53FS8"
});

import Loading from "./components/comp_static_screens/Loading";
import BannView from "./components/comp_static_screens/BannView";
import UpdateVersionView from "./components/comp_static_screens/UpdateVersionView";
import ServerOfflineView from "./components/comp_static_screens/ServerOfflineView";

import AuthManager from "./components/comp_auth/AuthManager";
import ViewportManager from "./components/comp_main_nav_screens/ViewportManager";

import { NavigationContainer } from "@react-navigation/native";

import { setBackgroundColorAsync, setButtonStyleAsync } from 'expo-navigation-bar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export default function App() {

  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [banned, setBanned] = useState(false);
  const [recentVer, setRecentVer] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);

  const [expoPushToken, setExpoPushToken] = useState('');

  const [fontsLoaded, fontsError] = useFonts({
    RobotoMono_Thin: require("./assets/fonts/RobotoMono-Thin.ttf"),
    Barlow_Regular: require("./assets/fonts/Barlow-Regular.ttf"),
    Barlow_Bold: require("./assets/fonts/Barlow-Bold.ttf"),
  });

  useEffect(() => {
    
    const auth = getAuth();
    const db = getDatabase();

    if (loggedIn) registerForPushNotifications().then(token => setExpoPushToken(token));

    if (Platform.OS === 'android') {
      setBackgroundColorAsync("#143C63");
      setButtonStyleAsync("light");
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true);
            setLoaded(true);
        } else {
            setLoggedIn(false);
            setLoaded(true);
        }
    });

    onValue(ref(db, "status"), snap => {
      if (snap.exists()) {
        const data = snap.val();
        setServerStatus(data);
      }
    })

    if (getAuth().currentUser !== null) {
      onValue(ref(db, "users/" + getAuth().currentUser.uid + "/isBanned"), (snapshot) => {
        const data = snapshot.val();
        setBanned(data);
      });
    }

    onValue(ref(db, "version"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data === require('./app.json').expo.version) setRecentVer(true);
        else setRecentVer(false);
      }
    });
  });

  if (!fontsLoaded) {
    return (<View style={{ width: "100%", flex: 1, backgroundColor: "#000000" }} />); 
  }

  if (serverStatus) 
    if (serverStatus !== "online") return <ServerOfflineView status={serverStatus} />
  else if (!serverStatus) return <Loading />

  if (!recentVer) return <UpdateVersionView />
  
  if (!loaded) {
    return <Loading />
  }

  if (!loggedIn) {
    return (
      <NavigationContainer >
        <AuthManager />
      </NavigationContainer>
    )
  }

  if (banned) return <BannView />

  return (
    <NavigationContainer>
      <StatusBar animated barStyle="light-content" hidden={false} networkActivityIndicatorVisible />
      <SafeAreaProvider style={{ width: "100%", flex: 1, backgroundColor: "#000000" }}>
        <ViewportManager />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

async function registerForPushNotifications() {
  let token;
  if (isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log("Failed to get push token for push notification");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    const expoPushToken = (await get(child(ref(getDatabase()), "users/" + getAuth().currentUser.uid + "/expoPushToken"))).val();
    if (expoPushToken != token) set(ref(getDatabase(), "users/" + getAuth().currentUser.uid + "/expoPushToken"), token);

  } else console.log("no ph. Device");

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}