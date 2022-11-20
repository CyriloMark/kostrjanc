import React, { useState, useEffect } from "react";

import {
  Alert,
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Keyboard,
  Pressable,
  Text,
  Image,
  TextInput,
} from "react-native";

import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
  UIImagePickerPresentationStyle,
} from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

import BackHeader from "../comp_static_items/BackHeader";

import SVG_Post from "../../assets/svg/Post";

const userUploadMetadata = {
  contentType: "image/jpeg",
};

const POST_PLACEHOLDER = {
  title: "",
  description: "",
  imgUri: "",
};

let btnPressed;
export default function PostCreate({ navigation }) {
  const [imageUri, setImageUri] = useState(null);

  const [postData, setPostData] = useState(POST_PLACEHOLDER);
  const [submittalbe, setSubmittalbe] = useState(false);

  const openImagePickerAsync = async () => {
    let permissionResult = await requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    let pickerResult = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      aspect: [9, 10],
      allowsMultipleSelection: false,
      presentationStyle: UIImagePickerPresentationStyle.PageSheet,
    });
    if (pickerResult.cancelled) return;

    const croppedPicker = await manipulateAsync(
      pickerResult.uri,
      [
        {
          resize: {
            width: 900,
            height: 1000,
          },
        },
      ],
      {
        compress: 0.5,
        format: SaveFormat.JPEG,
      }
    );

    setImageUri(croppedPicker.uri);
  };

  const publish = async () => {
    if (btnPressed) return;
    if (!submittalbe) return;
    btnPressed = true;

    const id = Date.now();
    const storage = getStorage();

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed!"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageUri, true);
      xhr.send(null);
    });

    const itemRef = storageRef(storage, "posts_pics/" + id);
    uploadBytes(itemRef, blob, userUploadMetadata).then(() => {
      getDownloadURL(itemRef).then((url) => {
        set(ref(getDatabase(), "posts/" + id), {
          id: id,
          type: 0,
          title: postData.title,
          description: postData.description,
          created: id,
          creator: getAuth().currentUser.uid,
          imgUri: url,
        });

        get(child(ref(getDatabase()), "users/" + getAuth().currentUser.uid))
          .then((userData) => {
            const data = userData.val();

            let a;
            if (userData.hasChild("posts")) a = data["posts"];
            else a = [];
            a.push(id);

            set(ref(getDatabase(), "users/" + getAuth().currentUser.uid), {
              ...data,
              posts: a,
            }).finally(() =>
              Alert.alert(
                "Post wozjawjeny",
                'Waš nowy post "' +
                  postData.title +
                  '" je so wuspěšnje wozjewił.',
                [
                  {
                    text: "Ok",
                    style: "default",
                    onPress: navigation.navigate("Recent"),
                  },
                ]
              )
            );
          })
          .catch(() => (btnPressed = false));
      });
    });
  };

  useEffect(() => {
    btnPressed = false;
  }, []);

  const checkIfPublishable = () => {
    if (
      !(
        imageUri != null &&
        postData.title.toString().length !== 0 &&
        postData.description.toString().length !== 0
      )
    )
      setSubmittalbe(false);
    else setSubmittalbe(true);
    return;
  };

  return (
    <View style={styles.container}>
      <BackHeader
        style={styles.backHeader}
        title="Nowy post wozjewić"
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={[
          styles.contentInnerContainer,
          { marginTop: -5 },
        ]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => {
          if (Platform.OS === "ios") Keyboard.dismiss;
        }}
      >
        {/* Image */}
        <Pressable
          style={styles.imgOutlineContainer}
          onPress={openImagePickerAsync}
        >
          <View style={styles.imgContainer}>
            {imageUri !== null ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.img}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.img, styles.imgBorder]}>
                <SVG_Post style={styles.imageHintIcon} fill="#143C63" />
                <Text style={styles.imageHintText}>
                  Tłoć, zo wobrazy přepytać móžeš
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Titul"
          maxLength={32}
          multiline={false}
          numberOfLines={1}
          placeholderTextColor={"#5884B0"}
          selectionColor={"#5884B0"}
          keyboardType="default"
          keyboardAppearance="dark"
          value={postData.title}
          autoCapitalize="sentences"
          autoComplete={false}
          textContentType="name"
          editable
          onChangeText={(value) => {
            setPostData({
              ...postData,
              title: value,
            });
            checkIfPublishable();
          }}
        />

        {/* Desc */}
        <TextInput
          style={styles.input}
          placeholder="Wopisaj twój post..."
          maxLength={512}
          multiline
          placeholderTextColor={"#5884B0"}
          selectionColor={"#5884B0"}
          keyboardType="default"
          keyboardAppearance="dark"
          value={postData.description}
          autoCapitalize="sentences"
          autoComplete={false}
          editable
          onChangeText={(value) => {
            setPostData({
              ...postData,
              description: value,
            });
            checkIfPublishable();
          }}
        />

        {/* Check */}
        <Pressable
          style={[
            styles.checkBtnContainer,
            {
              backgroundColor: submittalbe ? "#B06E6A" : "#143C63",
            },
          ]}
          onPress={publish}
        >
          <Text style={styles.checksBtnText}>Wozjewić</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5884B0",
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

  backHeader: {
    flex: 0.08,
    width: "100%",

    alignSelf: "center",

    zIndex: 99,
  },

  imgOutlineContainer: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#143C63",

    marginVertical: 10,

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
    aspectRatio: 3 / 4,
    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
  },
  imgBorder: {
    borderRadius: 25,
    borderWidth: 5,
    borderStyle: "dashed",
    borderColor: "#B06E6A",
  },
  imageHintIcon: {
    width: "50%",
    aspectRatio: 1,

    zIndex: 99,
  },
  imageHintText: {
    width: "60%",
    alignSelf: "center",

    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#143C63",
    textAlign: "center",
  },

  input: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 10,

    marginVertical: 5,

    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#143C63",

    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
  },

  checkBtnContainer: {
    width: "60%",

    borderRadius: 15,

    marginTop: 25,

    paddingHorizontal: 25,
    paddingVertical: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#B06E6A",
  },
  checksBtnText: {
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#000000",
  },
});
