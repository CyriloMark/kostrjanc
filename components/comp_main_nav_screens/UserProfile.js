import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Switch,
} from "react-native";

import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import * as Storage from "firebase/storage";

import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { ageOptions, SelectableBtn } from "../comp_auth/AuthUserRegister";

import Navbar from "../comp_static_items/Navbar";
import PostPreview from "../comp_variable_items/PostPreview";
import EditButton from "../comp_static_items/EditButton";
import UserListModal from "../comp_variable_items/UserListModal";
import Modal from "../comp_variable_items/Modal";

import SVG_Post from "../../assets/svg/Post";
import SVG_Admin from "../../assets/svg/Admin";
import SVG_Moderator from "../../assets/svg/Moderator";

const LOCAL_USER_Placeholder = {
  name: "",
  description: "",
  ageGroup: 0,
  gender: 0,
  pbUri: "https://www.colorhexa.com/587db0.png",
  posts: [],
  events: [],
  follower: [],
  following: [],
  isAdmin: false,
  isMod: false,
};

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const arraySplitter = (data, coloums) => {
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
};

const userUploadMetadata = {
  contentType: "image/jpeg",
};

let pbChanged = false;

const ONEWEEK = 1000 * 60 * 60 * 24 * 7;

export default function UserProfile({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUser();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const editScrollRef = useRef();
  const [pbImageUri, setPbImageUri] = useState(null);

  const [LOCAL_USER, setLOCAL_USER] = useState(LOCAL_USER_Placeholder);
  const [postEventList, setPostEventList] = useState([]);

  const [editScreenVisible, setEditScreenVisible] = useState(false);

  const [editDataInput, setEditDataInput] = useState(LOCAL_USER_Placeholder);

  const [followerVisible, setFollowerVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);
  const [followerUserList, setFollowerUserList] = useState([]);
  const [followingUserList, setFollowingUserList] = useState([]);

  // Load User -> LOCAL_USER, postEventList
  const loadUser = () => {
    const db = getDatabase();
    let postEventDatas = [];

    get(child(ref(db), "users/" + getAuth().currentUser.uid))
      .then((snapshot) => {
        const data = snapshot.val();

        let userData = {
          ...data,
          follower: snapshot.hasChild("follower") ? data["follower"] : [],
          following: snapshot.hasChild("following") ? data["following"] : [],
        };

        getFollowerUserList(
          snapshot.hasChild("follower") ? data["follower"] : []
        );
        getFollowingUserList(
          snapshot.hasChild("following") ? data["following"] : []
        );

        setLOCAL_USER(userData);

        const hasPosts = snapshot.hasChild("posts");
        const hasEvents = snapshot.hasChild("events");

        if (hasPosts) {
          for (let i = 0; i < userData.posts.length; i++) {
            get(child(ref(db), "posts/" + userData.posts[i]))
              .then((post) => {
                const postData = post.val();
                if (!postData.isBanned) postEventDatas.push(postData);
                if (i === userData.posts.length - 1 && !hasEvents)
                  sortArrayByDate(postEventDatas);
              })
              .catch((error) => console.log("error posts", error.code));
          }
        }

        if (hasEvents) {
          for (let i = 0; i < userData.events.length; i++) {
            get(child(ref(db), "events/" + userData.events[i]))
              .then((event) => {
                const eventData = event.val();
                if (
                  !eventData.isBanned &&
                  Date.now() < eventData.ending + ONEWEEK
                )
                  postEventDatas.push(eventData);
                if (i === userData.events.length - 1)
                  sortArrayByDate(postEventDatas);
              })
              .catch((error) => console.log("error events", error.code));
          }
        }
      })
      .catch((error) => console.log("error user", error.code));
  };

  // OBSOLET
  const getPostsAndEvents = (hasPosts, hasEvents) => {
    const db = getDatabase();
    let postEventDatas = [];

    if (hasPosts) {
      get(child(ref(db), "users/" + getAuth().currentUser.uid + "/posts"))
        .then((snap) => {
          if (snap.exists()) {
            const posts = snap.val();

            setLOCAL_USER({
              ...LOCAL_USER,
              posts: posts,
            });

            for (let i = 0; i < posts.length; i++) {
              get(child(ref(db), "posts/" + posts[i]))
                .then((post) => {
                  const postData = post.val();

                  postEventDatas.push(postData);
                  if (i === posts.length - 1 && !hasEvents)
                    sortArrayByDate(postEventDatas);
                })
                .catch((error) => console.log("error posts", error.code));
            }
          }
        })
        .catch((e) => console.log("error", e.code));
    }

    if (hasEvents) {
      get(child(ref(db), "users/" + getAuth().currentUser.uid + "/events"))
        .then((snap) => {
          if (snap.exists()) {
            const events = snap.val();

            setLOCAL_USER({
              ...LOCAL_USER,
              events: events,
            });

            for (let i = 0; i < events.length; i++) {
              get(child(ref(db), "events/" + events[i]))
                .then((event) => {
                  const eventData = event.val();

                  postEventDatas.push(eventData);
                  if (i === events.length - 1) sortArrayByDate(postEventDatas);
                })
                .catch((error) => console.log("error events", error.code));
            }
          }
        })
        .catch((e) => console.log("error", e.code));
    }
  };

  useEffect(() => {
    if (LOCAL_USER === LOCAL_USER_Placeholder) loadUser();
  }, []);

  // Array Sort Alg. - von groß zu klein
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

  // Change User Data - Firebase
  const overrideUserData = async () => {
    if (pbChanged) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed!"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", pbImageUri, true);
        xhr.send(null);
      });

      Storage.deleteObject(
        Storage.ref(
          Storage.getStorage(),
          "profile_pics/" + getAuth().currentUser.uid
        )
      )
        .then(() => {
          Storage.uploadBytes(
            Storage.ref(
              Storage.getStorage(),
              "profile_pics/" + getAuth().currentUser.uid
            ),
            blob,
            userUploadMetadata
          )
            .then((snapshot) => {
              Storage.getDownloadURL(
                Storage.ref(
                  Storage.getStorage(),
                  "profile_pics/" + getAuth().currentUser.uid
                )
              )
                .then((url) => {
                  set(
                    ref(getDatabase(), "users/" + getAuth().currentUser.uid),
                    {
                      ...LOCAL_USER,
                      isBanned: false,
                      name: editDataInput.name,
                      description: editDataInput.description,
                      ageGroup: editDataInput.ageGroup,
                      gender: editDataInput.gender,
                      pbUri: url,
                    }
                  );
                })
                .catch((error) => console.log("error download", error.code));
            })
            .catch((error) => console.log("error upload", error.code));
        })
        .catch((error) => console.log("error delete", error.code));
    } else {
      set(ref(getDatabase(), "users/" + getAuth().currentUser.uid), {
        ...LOCAL_USER,
        isBanned: false,
        name: editDataInput.name,
        description: editDataInput.description,
        ageGroup: editDataInput.ageGroup,
        gender: editDataInput.gender,
      });
    }

    setEditScreenVisible(false);
  };

  // Load IMG - Compress
  const openImagePickerAsync = async () => {
    let permissionResult = await requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    let pickerResult = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      aspect: [1, 1],
      allowsMultipleSelection: false,
    });
    if (pickerResult.cancelled) return;

    const croppedPicker = await manipulateAsync(
      pickerResult.uri,
      [
        {
          resize: {
            width: 256,
            height: 256,
          },
        },
      ],
      {
        compress: 0.5,
        format: SaveFormat.JPEG,
      }
    );

    pbChanged = true;
    setPbImageUri(croppedPicker.uri);
  };

  // Get Follower List -> followerUserList
  const getFollowerUserList = (users) => {
    const db = ref(getDatabase());

    let list = [];
    for (let i = 0; i < users.length; i++) {
      get(child(db, "users/" + users[i]))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const a = snapshot.val();

            if (snapshot.hasChild("isBanned")) {
              if (!a["isBanned"]) {
                list.push({
                  name: a["name"],
                  pbUri: a["pbUri"],
                });
              }
            } else {
              list.push({
                name: a["name"],
                pbUri: a["pbUri"],
              });
            }
          }
        })
        .catch((error) => console.log("error get", error.code))
        .finally(() => {
          if (i === users.length - 1) setFollowerUserList(list);
        });
    }
  };

  // Get Following Users List -> followingUserList
  const getFollowingUserList = (users) => {
    const db = ref(getDatabase());

    let list = [];
    for (let i = 0; i < users.length; i++) {
      get(child(db, "users/" + users[i]))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const a = snapshot.val();

            if (snapshot.hasChild("isBanned")) {
              if (!a["isBanned"]) {
                list.push({
                  name: a["name"],
                  pbUri: a["pbUri"],
                });
              }
            } else {
              list.push({
                name: a["name"],
                pbUri: a["pbUri"],
              });
            }
          }
        })
        .catch((error) => console.log("error get", error.code))
        .finally(() => {
          if (i === users.length - 1) setFollowingUserList(list);
        });
    }
  };

  return (
    <View style={styles.container}>
      {/* Follower */}
      <UserListModal
        close={() => setFollowerVisible(false)}
        visible={followerVisible}
        title={"Tute ludźo ći sćěhuja"}
        userList={followerUserList}
      />
      {/* Following */}
      <UserListModal
        close={() => setFollowingVisible(false)}
        visible={followingVisible}
        title={"Tutym ludźom ty sćěhuješ"}
        userList={followingUserList}
      />

      {/* EDIT */}
      <Modal
        onRequestClose={() => setEditScreenVisible(false)}
        visible={editScreenVisible}
        content={
          <ScrollView
            ref={editScrollRef}
            style={{ width: "100%" }}
            scrollEnabled
            bounces
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          >
            {/* Name */}
            <View
              style={[styles_edit.sectionContainer, styles_edit.inputContainer]}
            >
              <TextInput
                style={styles_edit.input}
                placeholder="Wopisaj tebje..."
                maxLength={512}
                multiline={false}
                numberOfLines={1}
                placeholderTextColor={"#5884B0"}
                selectionColor={"#5884B0"}
                keyboardType="default"
                keyboardAppearance="dark"
                value={editDataInput.name}
                autoCapitalize="words"
                textContentType="name"
                onChangeText={(value) =>
                  setEditDataInput({
                    ...editDataInput,
                    name: value,
                  })
                }
              />
            </View>

            {/* IMG */}
            <View style={styles_edit.sectionContainer}>
              <Pressable
                style={styles_edit.imgOutlineContainer}
                onPress={openImagePickerAsync}
              >
                <View style={styles_edit.imgContainer}>
                  <Image
                    source={{ uri: pbImageUri }}
                    style={styles_edit.img}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            </View>

            {/* Gender */}
            <View style={styles_edit.sectionContainer}>
              <View style={styles_edit.genderContainer}>
                <Text style={styles_edit.genderText}>hólc</Text>

                <Switch
                  style={styles_edit.switch}
                  value={editDataInput.gender === 0 ? false : true}
                  thumbColor={"#B06E6A"}
                  ios_backgroundColor={"#000000"}
                  onValueChange={(value) =>
                    setEditDataInput({
                      ...editDataInput,
                      gender: value ? 1 : 0,
                    })
                  }
                  trackColor={{
                    false: "#000000",
                    true: "#000000",
                  }}
                />

                <Text style={styles_edit.genderText}>holca</Text>
              </View>
            </View>

            {/* Age */}
            <View style={styles_edit.sectionContainer}>
              <View style={styles_edit.inputContainer}>
                {arraySplitter(ageOptions, 2).map((list, listKey) => (
                  <View key={listKey} style={styles_edit.ageGroupListContainer}>
                    {list.map((ageGroup, ageGroupKey) => (
                      <SelectableBtn
                        key={ageGroupKey}
                        selected={editDataInput.ageGroup === ageGroup.id}
                        title={ageGroup.ageGroup}
                        subTitle={ageGroup.ages}
                        style={styles_edit.ageBtn}
                        onPress={() => {
                          setEditDataInput({
                            ...editDataInput,
                            ageGroup: ageGroup.id,
                          });
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Bio */}
            <View
              style={[styles_edit.sectionContainer, styles_edit.inputContainer]}
            >
              <TextInput
                style={styles_edit.input}
                placeholder="Wopisaj tebje..."
                maxLength={512}
                multiline
                placeholderTextColor={"#5884B0"}
                selectionColor={"#5884B0"}
                keyboardType="default"
                keyboardAppearance="dark"
                value={editDataInput.description}
                autoCapitalize="sentences"
                textContentType="none"
                onChangeText={(value) =>
                  setEditDataInput({
                    ...editDataInput,
                    description: value,
                  })
                }
              />
            </View>

            {/* Submit */}
            <Pressable
              style={styles_edit.submitBtnContainer}
              onPress={overrideUserData}
            >
              <Text style={styles_edit.submitBtn}>Změnić</Text>
            </Pressable>
          </ScrollView>
        }
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>{LOCAL_USER.name}</Text>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInnerContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces
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
              source={{ uri: LOCAL_USER.pbUri }}
              style={styles.profileHeaderIcon}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.profileHeaderText}>{LOCAL_USER.name}</Text>

          {/* Profile Bio */}
          <Text style={styles.profileBioText}>{LOCAL_USER.description}</Text>

          <View style={styles.profileAwardContainer}>
            {LOCAL_USER.isMod && !LOCAL_USER.isAdmin ? (
              <SVG_Moderator style={styles.awardIcon} fill={"#B06E6A"} />
            ) : null}
            {LOCAL_USER.isAdmin ? (
              <SVG_Admin style={styles.awardIcon} fill={"#B06E6A"} />
            ) : null}
          </View>
        </View>

        {/* Follow-Lists */}
        <View style={styles.profileFollowListsContainer}>
          {/* Follower */}
          <Pressable
            style={styles.profileFollowContainer}
            onPress={() => {
              setFollowerVisible(true);
            }}
          >
            <Text style={styles.profileFollowText}>
              <Text style={{ fontFamily: "Barlow_Bold" }}>
                {followerUserList.length}
              </Text>{" "}
              wužiwarjo ći sćěhuja
            </Text>
          </Pressable>
          {/* Following */}
          <Pressable
            style={styles.profileFollowContainer}
            onPress={() => {
              setFollowingVisible(true);
            }}
          >
            <Text style={styles.profileFollowText}>
              Ty sćehuješ{" "}
              <Text style={{ fontFamily: "Barlow_Bold" }}>
                {followingUserList.length}
              </Text>{" "}
              wužiwarnjam
            </Text>
          </Pressable>
        </View>

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

        <EditButton
          style={styles.editBtn}
          onPress={() => {
            pbChanged = false;
            setPbImageUri(LOCAL_USER.pbUri);
            setEditDataInput(LOCAL_USER);
            setEditScreenVisible(true);
          }}
        />
      </ScrollView>

      <Navbar
        style={styles.navbar}
        active={3}
        onPressRecent={() => {
          navigation.navigate("Recent");
        }}
        onPressSearch={() => {
          navigation.navigate("Search");
        }}
        onPressAdd={() => {
          navigation.navigate("Add");
        }}
        onPressProfile={() => {
          navigation.navigate("Profile");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5884B0",
  },

  navbar: {
    flex: 0.07,
    width: "100%",
    alignSelf: "center",
    zIndex: 99,
  },

  header: {
    flex: 0.08,
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#000000",
    fontFamily: "Barlow_Bold",
    fontSize: 20,
    marginLeft: 10,
  },

  contentContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: 5,
    borderRadius: 25,
  },
  contentInnerContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#000",
    minHeight: "100%",
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
    backgroundColor: "#000000",
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

  profileFollowListsContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  profileFollowContainer: {
    width: "100%",
    flex: 1,

    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#143C63",

    position: "relative",
    marginVertical: 2,

    paddingHorizontal: 25,
    paddingVertical: 10,
    justifyContent: "center",
  },
  profileFollowText: {
    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
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

  editBtn: {
    width: "80%",
    marginTop: 10,
    marginBottom: 25,
    alignSelf: "center",
  },
});

const styles_edit = StyleSheet.create({
  sectionContainer: {
    width: "100%",
    marginVertical: 10,
  },

  genderContainer: {
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
  },
  switch: {
    flex: 0.2,
  },
  genderText: {
    flex: 0.4,
    textAlign: "center",

    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
  },

  ageGroupListContainer: {
    width: "80%",
    flexDirection: "row",
    alignSelf: "center",
    padding: 0,
    margin: 0,
  },
  ageBtn: {
    flex: 1,
    margin: 5,
  },

  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 10,

    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",

    textAlignVertical: "center",

    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#143C63",
  },

  imgOutlineContainer: {
    width: "80%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

    borderRadius: 500,
    borderWidth: 1,
    borderColor: "#143C63",

    zIndex: 3,
  },
  imgContainer: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  img: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 500,
  },

  submitBtnContainer: {
    width: "60%",

    backgroundColor: "#B06E6A",
    borderRadius: 15,

    paddingHorizontal: 25,
    paddingVertical: 25,
    marginVertical: 10,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  submitBtn: {
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#000000",
  },
});
