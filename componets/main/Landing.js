import React, { useCallback, useState } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";

import AppHeader from '../statics/AppHeader';
import Navbar from '../statics/Navbar';

import EventCard from '../statics/EventCard';
import PostCard from '../statics/PostCard';

import { PostType } from '../statics/PostPreview';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const event = {
  id: 0,
  type: PostType.Event,
  name: "hey",
  description: "test",
  geoCords: {
      latitude: 51.2392335862277,
      longitude: 14.281389642218592,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
  },
  checked: false
}

const user = {
  name: "Cyril Mark",
  pbUri: "https://picsum.photos/536/354"
}

export default function Landing({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);

  const [pinEventChecked, setPinEventChecked] = useState(false);
  const [postLike, setPostLike] = useState(false);

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

        <EventCard onPress={ () => navigation.navigate('EventView', { user: user, item: event }) } item={event} style={ styles.card } onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />
        <PostCard onPress={ () => navigation.navigate('PostView', { user: user, item: {imgUri: "https://picsum.photos/536/354"} }) } liked={postLike} user={user} style={ styles.card } imgUri="https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/Basti%20Party%20Cover.png?alt=media&token=bb5d175c-788a-4823-845c-fcf2aba6e4cf" onLikePress={ () => setPostLike(!postLike) } />
        <PostCard onPress={ () => navigation.navigate('PostView', { user: user, item: {imgUri: "https://picsum.photos/536/354"} }) } liked={postLike} user={user} style={ styles.card } imgUri="https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/Basti%20Party%20Cover.png?alt=media&token=bb5d175c-788a-4823-845c-fcf2aba6e4cf" onLikePress={ () => setPostLike(!postLike) } />
        <EventCard item={event} style={ styles.card } onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />
        <EventCard item={event} style={ styles.card } onBtnTogglePress={ () => setPinEventChecked(!pinEventChecked) } />

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
