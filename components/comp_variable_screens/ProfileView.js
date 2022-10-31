import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  Pressable,
  Alert,
} from "react-native";

import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth } from "firebase/auth";

import { impactAsync } from "expo-haptics";

import BackHeader from "../comp_static_items/BackHeader";
import PostPreview from "../comp_variable_items/PostPreview";

import SVG_Admin from "../../assets/svg/Admin";
import SVG_Moderator from "../../assets/svg/Moderator";

import ReportModal from "../comp_variable_items/ReportModal";
import ViewInteractionsBar from "../comp_static_items/ViewInteractionsBar";

const USER_PLACEHOLDER = {
  name: "",
  description: "",
  ageGroup: 0,
  gender: 0,
  pbUri: "https://www.colorhexa.com/587db0.png",
  posts: [],
  events: [],
  follower: [],
  following: [],
};

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export function arraySplitter(data, coloums) {
  let splitter =
    Math.floor(data.length / coloums) + (data.length % coloums === 0 ? 0 : 1);
  let newData = [];

  for (let i = 0; i < splitter; i++) {
    let currentObject = [];
    for (let j = i * coloums; j < coloums + i * coloums; j++) {
      if (j < data.length) currentObject.push(data[j]);
    }
    newData.push(currentObject);
  }
  return newData;
}

export default function ProfileView({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUser();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [reportVisible, setReportVisible] = useState(false);

  const [user, setUser] = useState(USER_PLACEHOLDER);
  const [following, setFollowing] = useState(false);

  const uid = getAuth().currentUser.uid;

  const [postEventList, setPostEventList] = useState([]);

  const { userID } = route.params;

  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const loadUser = () => {
    const db = getDatabase();

    let postEventDatas = [];

    get(child(ref(db), "users/" + userID)).then((snapshot) => {
      if (!snapshot.exists()) {
        setUser({
          ...USER_PLACEHOLDER,
          isBanned: true,
        });
      }

      const data = snapshot.val();

      if (snapshot.hasChild("isBanned")) {
        if (data["isBanned"]) {
          setUser({
            ...USER_PLACEHOLDER,
            isBanned: true,
          });
          return;
        }
      }

      let userData = {
        ...data,
        follower: snapshot.hasChild("follower") ? data["follower"] : [],
        following: snapshot.hasChild("following") ? data["following"] : [],
      };

      const hasPosts = snapshot.hasChild("posts");
      const hasEvents = snapshot.hasChild("events");

      if (!hasPosts && !hasEvents) setUser(userData);

      if (hasPosts) {
        const posts = data["posts"];

        userData = {
          ...userData,
          posts: posts,
        };
        if (!hasEvents) setUser(userData);

        for (let i = 0; i < posts.length; i++) {
          get(child(ref(db), "posts/" + posts[i]))
            .then((post) => {
              const postData = post.val();
              if (!postData.isBanned) postEventDatas.push(postData);
              if (i === posts.length - 1 && !hasEvents)
                sortArrayByDate(postEventDatas);
            })
            .catch((error) => console.log("error posts", error.code));
        }
      }

      if (hasEvents) {
        const events = data["events"];

        userData = {
          ...userData,
          events: events,
        };
        setUser(userData);

        for (let i = 0; i < events.length; i++) {
          get(child(ref(db), "events/" + events[i]))
            .then((event) => {
              const eventData = event.val();
              if (!eventData.isBanned) postEventDatas.push(eventData);
              if (i === events.length - 1) sortArrayByDate(postEventDatas);
            })
            .catch((error) => console.log("error events", error.code));
        }
      }
    });
  };

  const sortArrayByDate = (data) => {
    let dates = data;
    for (let i = data.length - 1; i >= 0; i--) {
      for (let j = 1; j <= i; j++) {
        if (dates[j - 1].created > dates[j].created) {
          let temp = dates[j - 1];
          dates[j - 1] = dates[j];
          dates[j] = temp;
        }
      }
    }
    dates.reverse();

    setPostEventList(dates);
  };

  const follow = () => {
    if (user.isBanned) return;

    const db = getDatabase();
    const uid = getAuth().currentUser.uid;

    get(child(ref(db), "users/" + uid))
      .then((result) => {
        if (result.exists()) {
          let a = result.val();

          let following = [];
          if (result.hasChild("following")) following = a["following"];
          else following = [];
          following.push(userID);

          set(ref(db, "users/" + uid), {
            ...a,
            following: following,
          }).catch((error) => console.log("error s", error.code));
        }
      })
      .catch((error) => console.log("error g", error.code))
      .finally(() => {
        get(child(ref(db), "users/" + userID))
          .then((result) => {
            if (result.exists()) {
              let a = result.val();

              let follower = [];
              if (result.hasChild("follower")) follower = a["follower"];
              else follower = [];
              follower.push(uid);

              set(ref(db, "users/" + userID), {
                ...a,
                follower: follower,
              }).catch((error) => console.log("error s", error.code));
            }
          })
          .catch((error) => console.log("error g", error.code))
          .finally(() => setFollowing(true));
      });
  };

  const unfollow = () => {
    if (user.isBanned) return;

    const db = getDatabase();
    const uid = getAuth().currentUser.uid;

    get(child(ref(db), "users/" + uid))
      .then((result) => {
        if (result.exists()) {
          let a = result.val();

          let following = a["following"];
          following.splice(following.indexOf(userID), 1);

          set(ref(db, "users/" + uid), {
            ...a,
            following: following,
          }).catch((error) => console.log("error s", error.code));
        }
      })
      .catch((error) => console.log("error g 3", error.code))
      .finally(() => {
        get(child(ref(db), "users/" + userID))
          .then((result) => {
            if (result.exists()) {
              let a = result.val();

              let follower = a["follower"];
              follower.splice(follower.indexOf(uid), 1);

              set(ref(db, "users/" + userID), {
                ...a,
                follower: follower,
              }).catch((error) => console.log("error s", error.code));
            }
          })
          .catch((error) => console.log("error g 2", error.code))

          .finally(() => setFollowing(false));
      });
  };

  useEffect(() => {
    get(
      child(
        ref(getDatabase()),
        "users/" + getAuth().currentUser.uid + "/following"
      )
    )
      .then((result) => {
        if (result.exists()) {
          const data = result.val();
          setFollowing(data.includes(userID));
        } else setFollowing(false);
      })
      .finally(() => {
        if (!(getAuth().currentUser.uid === userID)) {
          get(
            child(
              ref(getDatabase()),
              "users/" + getAuth().currentUser.uid + "/isAdmin"
            )
          ).then((snapshot) => {
            if (!snapshot.exists()) return;
            const isA = snapshot.val();
            setUserIsAdmin(isA);
          });
        }
      });
  });

  useEffect(() => {
    if (user === USER_PLACEHOLDER) loadUser();
  }, []);

  const banUser = () => {
    Alert.alert(
      "Chceš tutoho wužiwarja banować?",
      "Chceš woprawdźe wužiwarja banować? Wšitke posty a ewenty wužiwarja su potom tež banowane.",
      [
        {
          text: "Ně",
          style: "destructive",
        },
        {
          text: "Haj",
          style: "default",
          onPress: () => {
            const db = getDatabase();

            const pList = user.posts ? user.posts : [];
            const eList = user.events ? user.events : [];

            console.log(pList, eList);

            get(
              child(ref(db), "users/" + getAuth().currentUser.uid + "/isAdmin")
            )
              .then((snapshot) => {
                if (!snapshot.exists()) return;
                const isAdmin = snapshot.val();
                if (!isAdmin) return;

                set(ref(db, "users/" + userID), {
                  ...user,
                  isBanned: true,
                }).finally(() => {
                  pList.forEach((p) => {
                    set(ref(db, "posts/" + p + "/isBanned"), true);
                  });
                  eList.forEach((e) => {
                    set(ref(db, "events/" + e + "/isBanned"), true);
                  });

                  get(child(ref(db), "logs")).then((snap) => {
                    let logs = [];
                    if (snap.exists()) logs = snap.val();
                    logs.push({
                      action: "user_banned",
                      mod: uid,
                      target: userID,
                      timestamp: Date.now(),
                    });
                    set(ref(db, "logs"), logs);
                  });
                });
              })
              .catch((error) =>
                console.log("error ProfileView getLogs", error.code)
              );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader
        style={styles.backHeader}
        title={user.name}
        onPress={() => navigation.goBack()}
      />
      <ReportModal
        type={2}
        visible={reportVisible}
        close={() => setReportVisible(false)}
        id={userID}
      />

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInnerContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            style={{ marginTop: -5 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            title=""
            colors={["#000000"]}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Icon */}
          <View style={styles.profileHeaderPBContainer}>
            <Image
              source={{ uri: user.pbUri }}
              style={styles.profileHeaderIcon}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.profileHeaderText}>{user.name}</Text>

          {/* Profile Bio */}
          <Text style={styles.profileBioText}>{user.description}</Text>

          <View style={styles.profileAwardContainer}>
            {user.isMod && !user.isAdmin ? (
              <SVG_Moderator style={styles.awardIcon} fill={"#B06E6A"} />
            ) : null}
            {user.isAdmin ? (
              <SVG_Admin style={styles.awardIcon} fill={"#B06E6A"} />
            ) : null}
          </View>
        </View>

        {/* Check */}
        {getAuth().currentUser.uid !== userID && !user.isBanned ? (
          <Pressable
            style={[
              styles.checkBtnContainer,
              {
                backgroundColor: !following ? "#B06E6A" : "#143C63",
              },
            ]}
            onPress={() => {
              if (!following) follow();
              else unfollow();
              impactAsync("medium");
            }}
          >
            <Text style={styles.checksBtnText}>
              {!following ? "Sćěhować" : "Nic swjac sćěhować"}
            </Text>
          </Pressable>
        ) : null}

        {/* Post List */}
        <View style={styles.postContainer}>
          {arraySplitter(postEventList, 2).map((list, listKey) => (
            <View key={listKey} style={styles.postItemListContainer}>
              {list.map((item, itemKey) => (
                <PostPreview
                  postShowText={false}
                  key={itemKey}
                  item={item}
                  style={styles.postPreview}
                  press={() => {
                    item.type === 0
                      ? navigation.push("PostView", { postID: item.id })
                      : navigation.push("EventView", { eventID: item.id });
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <ViewInteractionsBar
        style={styles.interactionsContainer}
        userIsAdmin={userIsAdmin}
        onReport={() => setReportVisible(true)}
        onBan={banUser}
        report={uid != userID}
        ban={uid != userID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5884B0",
  },

  contentContainer: {
    flex: 0.8,
    width: "100%",
    paddingVertical: 5,
    borderRadius: 25,
  },
  contentInnerContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#000",
    minHeight: "100%",
  },

  backHeader: {
    flex: 0.1,
    width: "100%",

    alignSelf: "center",

    zIndex: 99,
  },

  profileHeader: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    paddingTop: 25,
  },
  profileHeaderPBContainer: {
    aspectRatio: 1,
    width: "60%",
    borderRadius: 100,
    backgroundColor: "red",
  },
  profileHeaderIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 50,
  },
  profileHeaderText: {
    width: "90%",
    marginVertical: 25,
    fontFamily: "Barlow_Bold",
    textAlign: "center",
    fontSize: 50,
    color: "#5884B0",
  },

  profileBioText: {
    fontFamily: "Barlow_Regular",
    fontSize: 25,
    color: "#5884B0",
    marginBottom: 25,
  },
  profileAwardContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  awardIcon: {
    width: "50%",
    aspectRatio: 1,
    marginHorizontal: 10,
    alignSelf: "center",
  },

  checkBtnContainer: {
    width: "60%",

    borderRadius: 15,

    marginVertical: 10,

    paddingHorizontal: 25,
    paddingVertical: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  checksBtnText: {
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#000000",
  },

  postContainer: {
    width: "100%",

    position: "relative",
    marginVertical: 10,
  },
  postItemListContainer: {
    width: "100%",
    flexDirection: "row",
  },
  postPreview: {
    flex: 1,
    aspectRatio: 0.9,
    margin: 5,
  },

  interactionsContainer: {
    height: "6%",
    width: "100%",
    alignSelf: "center",
    zIndex: 99,
  },
});
