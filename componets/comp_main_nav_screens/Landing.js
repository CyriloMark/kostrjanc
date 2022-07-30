import React, { useCallback, useState, useEffect } from 'react'

import { View, StyleSheet, ScrollView, RefreshControl, Text, Platform } from "react-native";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";

import AppHeader from '../comp_static_items/AppHeader';
import Navbar from '../comp_static_items/Navbar';

import BannerCard from '../comp_variable_items/BannerCard';
import PostCard from '../comp_variable_items/PostCard';
import EventCard from '../comp_variable_items/EventCard';
import AdCard from '../comp_variable_items/AdCard';

import MainSplitLine from '../comp_static_items/MainSplitLine';

let showingPosts = [];
let showingEvents = [];
let userSpecificContent = [];
let showingContentSize = 0;

let AMT_posts = 0;
let AMT_events = 0;
let AMT_ads = 0;

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

let noMorePostsAvaidable = false;

export default function Landing({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    noMorePostsAvaidable = false;

    getNewBanners();
    getNewPosts();

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
        });
        setBanners(ba);
      })
      .catch((error) => console.log("banners", error.code));
  }

  const getNewPosts = () => {
    const db = getDatabase();
    
    userSpecificContent = [];
    showingContentSize = 0;
    
    showingPosts = [];
    showingEvents = [];

    let following = [];
    let follower = [];

    get(child(ref(db), "users/" + getAuth().currentUser.uid + "/following"))
      .then(f => f.val() ? following = f.val() : following = [])
      .finally(() => {
        get(child(ref(db), "users/" + getAuth().currentUser.uid + "/follower"))
          .then(f => f.val() ? follower = f.val() : follower = [])
          .finally(() => {
            if (following.length === 0 && follower.length === 0) {
              getUserUnspecificPosts(AMT_posts, []);
              return;
            }

            const combined = following.length !== 0 ? following : follower;
            if (following.length !== 0) combined.concat(follower);

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
                    postIds.forEach(p => {
                      userSpecificContent.push(p);
                      showingPosts.push(p);
                    });
                    getNewEvents();
                  }
              })
            }
          })
          .catch(error => console.log("error", error.code))
      })
      .catch(error => console.log("error", error.code))
  }

  const getNewEvents = () => {
    const db = getDatabase();

    let following = [];
    let follower = [];

    get(child(ref(db), "users/" + getAuth().currentUser.uid + "/following"))
      .then(f => f.val() ? following = f.val() : following = [])
      .finally(() => {
        get(child(ref(db), "users/" + getAuth().currentUser.uid + "/follower"))
          .then(f => f.val() ? follower = f.val() : follower = [])
          .finally(() => {

            const combined = following.length !== 0 ? following : follower;
            if (following.length !== 0) combined.concat(follower);

            let eventIds = [];

            for (let i = 0; i < combined.length; i++) {
              get(child(ref(db), 'users/' + combined[i] + "/events"))
                .then(eSnap => {
                  if (!eSnap.exists()) return;
                  
                  let eList = eSnap.val();
                  eList.forEach(e => eventIds.push(e));
                })
                .finally(() => {
                  if (i === combined.length - 1) {
                    eventIds.forEach(e => {
                      userSpecificContent.push(e);
                      showingEvents.push(e);
                    });

                    getUserUnspecificPosts(AMT_posts - showingPosts.length, userSpecificContent.sort(function(a, b) { return b - a }));
                  }
              })
            }
          })
          .catch(error => console.log("error", error.code))
      })
      .catch(error => console.log("error", error.code))
  }

  useEffect(() => {
    fetch("https://kostrjanc-default-rtdb.europe-west1.firebasedatabase.app/AMT_post-event-ad.json")
      .then(resp => resp.json().then(amts => {
        AMT_posts = amts[0];
        AMT_events = amts[1];
        AMT_ads = amts[2];

        getNewBanners();
        getNewPosts();
      }))
    
  }, [])

  let getUserUnspecificPosts = (amt, input) => {

    const db = getDatabase();
    get(child(ref(db), "posts"))
      .then(snapshot => {
        const posts = snapshot.val();

        let allPosts = Object.values(posts);
        const filteredPosts = allPosts.filter(p => !showingPosts.includes(p["id"])).filter(p => !p["isBanned"]);

        let output = [];

        if (filteredPosts.length <= amt) {
          
          let ids = [];
          filteredPosts.forEach(p => ids.push(p["id"]));
          ids.forEach(p => output.push(p));
          
        } else if (filteredPosts.length > amt) {

          let ids = [];
          let a = filteredPosts;
          const size = filteredPosts.length;

          for(let i = 0; i < amt; i++) {
            let r = Math.round(lerp(0, size - i, Math.random()));
            ids.push(a[r].id);
            a.splice(r, 1);
          }
          ids.forEach(p => output.push(p));

        }

        output.forEach(p => showingPosts.push(p));
        getUserUnspecificEvents(AMT_events - showingEvents.length, output, input);
      })
      .catch(error => console.log("error", error.code))

  }

  let getUserUnspecificEvents = (amt, postsInput, safeContent) => {

    const db = getDatabase();
    get(child(ref(db), "events"))
      .then(snapshot => {
        const events = snapshot.val();

        let allEvents = Object.values(events);
        const filteredEvents = allEvents.filter(e => !showingEvents.includes(e["id"])).filter(e => !e["isBanned"]);
  
        let output = [];
  
        if (filteredEvents.length <= amt) {
  
          let ids = [];
          filteredEvents.forEach(e => ids.push(e["id"]));
          ids.forEach(e => output.push(e));
  
        } else if (filteredEvents.length > amt) {
          
          let ids = [];
          let a = filteredEvents;
          const size = filteredEvents.length;
  
          for(let i = 0; i < amt; i++) {
            let r = Math.round(lerp(0, size - i, Math.random()));
            ids.push(a[r].id);
            a.splice(r, 1);
          }
          ids.forEach(e => output.push(e));
        }

        if (postsInput.concat(output).length === 0) {
          noMorePostsAvaidable = true;

          output.forEach(e => showingEvents.push(e));
          const finalList = safeContent.concat(postsInput.concat(output).sort(function(a, b) { return b - a }));
          setPostEventList(finalList);
        } else {
          output.forEach(e => showingEvents.push(e));
          const finalList = safeContent.concat(postsInput.concat(output).sort(function(a, b) { return b - a }));

          getFillingAds(finalList, showingContentSize);
        }
      })
      .catch(error => console.log("error", error.code))
  }

  let getFillingAds = (peList, prevContentSize) => {
    let contentDiff = peList.length - prevContentSize;
    showingContentSize = peList.length;

    if (contentDiff === 0) {
      setPostEventList(peList);
      return;
    }

    let finalList = [].concat(peList);

    for (let i = 0; i < AMT_ads; i++) {
      const slot = Math.round(lerp(prevContentSize, peList.length, Math.random()));
      finalList.splice(slot, 0, "_ad");
    }

    setPostEventList(finalList);
  }

  let onHeaderPress = () => {
    if (postEventList.length != 0) return; 
      getNewBanners();
      getNewPosts();
  }

  return (
    <View style={ styles.container } >

      <AppHeader style={ styles.header } settingsPress={ () => navigation.navigate('Settings') } showSettings press={ onHeaderPress } />

      <ScrollView style={ styles.contentContainer } contentContainerStyle={ styles.contentInnerContainer }
        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            style={{ marginTop: -5 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            title=''
            tintColor="#000000"
            colors={["#000000"]}
          />
        } onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            //wenn ans Ende gescrollt wurde
            if (!refreshing) getUserUnspecificPosts(AMT_posts, postEventList);
          }}} scrollEventThrottle={400} >

        {
          banners ?
          banners.map((data, key) =>
            <BannerCard key={key} style={[ styles.card, { marginVertical: 10 }]} bannerID={data} />
          ) : null
        }

        {
          postEventList ?
            postEventList.map((data, key) =>
              data === "_ad" ?
                <View key={key}>
                  <AdCard style={styles.card} /> 
                  <MainSplitLine style={ styles.line } />
                </View> :
                  showingPosts.includes(data) ?
                    <View key={key} >
                      <PostCard style={styles.card} postID={data} onPress={ () => navigation.navigate('PostView', { postID: data }) } /> 
                      <MainSplitLine style={ styles.line } />
                    </View> :
                      showingEvents.includes(data) ?
                        <View key={key}>
                          <EventCard style={styles.card} eventID={data} onPress={ () => navigation.navigate('EventView', { eventID: data }) } />
                          <MainSplitLine style={ styles.line } />
                        </View> : null
            ) : null
        }

        {
          noMorePostsAvaidable ?
            <View style={ styles.endContainer }>
              <Text style={ styles.endText }>
                Ty sy cyły kostrjanc předźěłał!
              </Text>
            </View>
            : null
        }
      
      </ScrollView>

      <Navbar style={ styles.navbar } active={0}
        onPressRecent={ () => { navigation.navigate("Recent") }}
        onPressSearch={ () => { navigation.navigate("Search") }}
        onPressAdd={ () => { navigation.navigate("Add") }}
        onPressProfile={ () => { navigation.navigate("Profile") }} />

    </View>
  )
}

export const lerp = (min, max, ratio) => min * (1 - ratio) + max * ratio;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#143C63",
  },

  header: {
    flex: .08,
    width: "100%",

    alignSelf: "center",

    zIndex: 99
  },
  navbar: {
    height: "6%",
    width: "80%",
    alignSelf: "center",
    zIndex: 99,
  },

  contentContainer: {
    width: "100%",
    flex: .84,
    paddingVertical: 5,
    borderRadius: 25,
  },

  contentInnerContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    minHeight: "100%"
  },

  card: {
    width: "100%",
    position: "relative",
    alignSelf: "center",
  },
  line: {
    width: "60%",
    alignSelf: "center",
  },

  endContainer: {
    width: "80%",
    alignSelf: "center",

    alignItems: "center",
    paddingBottom: 25,
  },
  endText: {
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    textAlign: "center",
    color: "#143C63"
  }
});
