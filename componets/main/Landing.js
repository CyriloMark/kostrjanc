import React, { useCallback, useState, useEffect } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";

import { getDatabase, ref, child, get } from "firebase/database";

import AppHeader from '../statics/AppHeader';
import Navbar from '../statics/Navbar';

import EventCard from '../statics/EventCard';
import PostCard from '../statics/PostCard';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Landing({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNewPosts();
    getNewEvents();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [posts, setPosts] = useState(null);
  const [events, setEvents] = useState(null);

  const getNewPosts = () => {
    get(child(ref(getDatabase()), 'posts'))
      .then((snapshot) => {
        if (!snapshot.exists()) return;

        let po = [];
        snapshot.forEach((data) => {
          const key = data.key;
          console.log("id post nicht löschen!!!", key);
          po.push(key);
        });

        setPosts(po);
        console.log(posts, "POSTS");
      })
      .catch((error) => console.log("posts", error.code));
  }

  const getNewEvents = () => {
    get(child(ref(getDatabase()), 'events'))
      .then((snapshot) => {
        if (!snapshot.exists()) return;

        let ev = [];
        snapshot.forEach((data) => {
          const key = data.key;
          console.log("id event nicht löschen!!!", key);
          ev.push(key);
        });

        setEvents(ev);
        console.log(posts, "EVENTS");
      })
      .catch((error) => console.log("events", error.code));
  }

  useEffect(() => {
    getNewPosts();
    getNewEvents();
  }, [])

  return (
    <View style={ styles.container } >

      <AppHeader style={ styles.header } settingsPress={ () => navigation.navigate('Settings') } />

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

        {
          posts !== null ?
          posts.map((data, key) =>
            <PostCard key={key} style={styles.card} postID={data} onPress={ () => navigation.navigate('PostView', { postID: data }) } />
          ) : null
        }
        {
          events !== null ?
          events.map((data, key) =>
            <EventCard key={key} style={styles.card} eventID={data} onPress={ () => navigation.navigate('EventView', { eventID: data }) } />
          ) : null
        }

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
