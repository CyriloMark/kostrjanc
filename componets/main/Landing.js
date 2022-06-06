import React, { useCallback, useState, useEffect } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";

import AppHeader from '../statics/AppHeader';
import Navbar from '../statics/Navbar';

import EventCard from '../statics/EventCard';
import PostCard from '../statics/PostCard';
import BannerCard from '../statics/BannerCard';

let postEvents = [];
let showingPosts = [];
let showingEvents = [];

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Landing({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    postEvents = [];
    getNewBanners();
    getNewPosts();
    getNewEvents();

    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [postEventList, setPostEventList] = useState(null);
  const [banners, setBanners] = useState(null);

  const getNewBanners = () => {
    const db = getDatabase();
    get(child(ref(db), 'banners'))
      .then((snapshot) => {
        if (!snapshot.exists()) return;

        const currentDate = Date.now();
        let ba = [];

        snapshot.forEach(child => {
          if (child.val()["ending"] > currentDate && child.val()["starting"] < currentDate) {
            ba.push(child.key);
          }
          else if (child.val()["ending"] < currentDate) {
            set(ref(db, "banners/" + child.key), null)
          }
        });
        setBanners(ba);
      })
      .catch((error) => console.log("banners", error.code));
  }

  const getNewPosts = () => {
    const db = getDatabase();
    
    showingPosts = [];

    let following = [];
    let follower = [];

    fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/users/" + getAuth().currentUser.uid + "/following.json")
      .then(
        response => response.json()
      )
        .then(f => f ? following = f : following = [])
        .finally(() => {

          fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/users/" + getAuth().currentUser.uid + "/follower.json")
            .then(
              response => response.json()
            )
              .then(f => f ? follower = f : follower = [])
              .finally(() => {
                
                const combined = following;
                combined.concat(follower);

                let postIds = [];

                for (let i = 0; i < combined.length; i++) {
                  get(child(ref(db), 'users/' + combined[i] + "/posts"))
                    .then(pSnap => {
                      if (!pSnap.exists()) return;
                      let pList = pSnap.val();
                      
                      pList.forEach(p => postIds.push(p));
                    })
                    .finally(() => {
                      if (i == combined.length - 1) {

                        if (postIds.length <= 20) {
                          const amtLeft = 20 - postIds.length;
                          getPostExceptOf(postIds, amtLeft);
                        } else {
                          let finalPosts = sortArrayByDate(postIds).splice(19, postIds.length - 20);
                          showingPosts.push(finalPosts);
                          finalPosts.forEach(p => postEvents.push(p));;
                          setPostEventList(postEvents);
                        }
                        
                      }
                  })
                }
              })
        })
  }

  const getNewEvents = () => {
    const db = getDatabase();
    
    showingEvents = [];

    let following = [];
    let follower = [];

    fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/users/" + getAuth().currentUser.uid + "/following.json")
      .then(
        response => response.json()
      )
        .then(f => f ? following = f : following = [])
        .finally(() => {

          fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/users/" + getAuth().currentUser.uid + "/follower.json")
            .then(
              response => response.json()
            )
              .then(f => f ? follower = f : follower = [])
              .finally(() => {
                
                const combined = following;
                combined.concat(follower);

                let eventIds = [];

                for (let i = 0; i < combined.length; i++) {
                  get(child(ref(db), 'users/' + combined[i] + "/posts"))
                    .then(eSnap => {
                      if (!eSnap.exists()) return;
                      let eList = eSnap.val();
                      
                      eList.forEach(p => eList.push(p));
                    })
                    .finally(() => {
                      if (i == combined.length - 1) {

                        if (eventIds.length <= 5) {
                          const amtLeft = 5 - eventIds.length;
                          getEventsExceptOf(eventIds, amtLeft);
                        } else {
                          const finalEvents = sortArrayByDate(eventIds).splice(4, eventIds.length - 5);
                          showingEvents.push(finalEvents);
                          finalEvents.forEach(e => postEvents.push(e));
                          setPostEventList(postEvents);
                        }
                        
                      }
                  })
                }
              })
        })
  }

  useEffect(() => {
    getNewBanners();
    getNewPosts();
    getNewEvents();
  }, [])

  let getPostExceptOf = (except, amt) => {
    fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/posts.json")
      .then(
        response => response.json()
      ).then(posts => {

        let allPosts = Object.values(posts);
        const filteredPosts = allPosts.filter(p => !except.includes(p["id"])) 

        if (filteredPosts.length === 0) {
          const finalPosts = sortArrayByDate(except);
          showingPosts.push(finalPosts);
          
          finalPosts.forEach(p => postEvents.push(p));
          setPostEventList(postEvents);
        } else if (filteredPosts.length <= amt) {
          let ids = [];
          filteredPosts.forEach(p => ids.push(p["id"]));

          const finalPosts = sortArrayByDate(except).concat(ids);
          showingPosts.push(finalPosts);

          finalPosts.forEach(p => postEvents.push(p));
          setPostEventList(postEvents);
        } else if (filteredPosts.length > amt) {

        }

      })
  }

  let getEventsExceptOf = (except, amt) => {
    fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/events.json")
      .then(
        response => response.json()
      ).then(events => {

        let allEvents = Object.values(events);
        const filteredEvents = allEvents.filter(e => !except.includes(e["id"])) 

        if (filteredEvents.length === 0) {
          const finalEvents = sortArrayByDate(except);
          showingEvents.push(finalEvents);
          
          finalEvents.forEach(e => postEvents.push(e));
          setPostEventList(postEvents);
        } else if (filteredEvents.length <= amt) {
          let ids = [];
          filteredEvents.forEach(p => ids.push(p["id"]));

          const finalEvents = sortArrayByDate(except).concat(ids);
          showingEvents.push(finalEvents);
          
          finalEvents.forEach(e => postEvents.push(e));
          setPostEventList(postEvents);
        } else if (filteredEvents.length > amt) {

        }

      })
  }

  return (
    <View style={ styles.container } >

      <AppHeader style={ styles.header } settingsPress={ () => navigation.navigate('Settings') } showSettings />

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
          banners !== null ?
          banners.map((data, key) =>
            <BannerCard key={key} style={styles.card} bannerID={data} />
          ) : null
        }

        {
          postEventList ?
          postEventList.map((data, key) => {
            showingPosts.includes(data) ?
              console.log("hs", data, key) : console.log("kne", data, key);
              // <PostCard key={key} style={styles.card} postID={data} onPress={ () => navigation.navigate('PostView', { postID: data }) } /> :
              // <EventCard key={key} style={styles.card} eventID={data} onPress={ () => navigation.navigate('EventView', { eventID: data }) } />
          }) : null
        }
{/*         
        {
          console.log("pe", postEvents)
        }
        {
          console.log("pel", postEventList)
        }*/}
        {
          console.log("sp",showingPosts)
        } 

      </ScrollView>
    </View>
  )
}

export function sortArrayByDate (data) {
  let dates = data;
        
  for(let i = data.length - 1; i >= 0; i--) {
      for (let j = 1; j <= i; j++) {
          if (dates[j - 1].created > dates[j].created) {
              let temp = dates[j - 1];
              dates[j - 1] = dates[j];
              dates[j] = temp;
          }
      }
  }
  dates.reverse();

  return dates;
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
