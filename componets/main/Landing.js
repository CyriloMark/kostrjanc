import React, { useCallback, useState } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";

import AppHeader from '../statics/AppHeader';
import Navbar from '../statics/Navbar';

import EventCard from '../statics/EventCard';
import PostCard from '../statics/PostCard';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const user = {
  name: "knecht",
  pbUri: "https://picsum.photos/536/354"
}

export default function Landing({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);

  const [pinEventChecked, setPinEventChecked] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={ styles.container } >

      <AppHeader style={ styles.header } />

      <Navbar style={ styles.navbar } active={0}
        onPressRecent={ () => { navigation.navigate("Recent") }}
        onPressSearch={ () => { navigation.navigate("Search") }}
        onPressAdd={ () => { navigation.navigate("Add") }}
        onPressProfile={ () => { navigation.navigate("Profile") }} />

      <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "35%", }]}
        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          />
        } >

        <EventCard checked={pinEventChecked} style={ styles.card } title="Witaj, kak so ći haha a što tam je wjedźe?" bio="sy tež tu?"
          onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />
        <PostCard user={user} style={ styles.card } imgUri="https://picsum.photos/536/354" />
        <EventCard checked={pinEventChecked} style={ styles.card } title="Witaj, kak so ći haha a što tam je wjedźe?" bio="sy tež tu?"
          onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />
        <EventCard checked={pinEventChecked} style={ styles.card } title="Witaj, kak so ći haha a što tam je wjedźe?" bio="sy tež tu?"
          onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />
        <EventCard checked={pinEventChecked} style={ styles.card } title="Witaj, kak so ći haha a što tam je wjedźe?" bio="sy tež tu?"
          onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5884B0",
    paddingHorizontal: 10,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
  },

  header: {

    position: "absolute",
    height: "10%",
    width: "100%",
    top: 10,

    alignSelf: "center",

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
    elevation: 10,

    zIndex: 99
  },
  navbar: {
    width: "80%",
    height: "10%",
    bottom: "5%",
    alignSelf: "center",
    position: "absolute",
    zIndex: 99,

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  card: {
    width: "90%",
    position: "relative",
    marginTop: "5%",
    alignSelf: "center",

    elevation: 10,
},
});
