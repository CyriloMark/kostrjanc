import React, { useState, useEffect } from "react";

import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  Keyboard,
  TextInput,
  Text,
  Pressable,
  Alert,
} from "react-native";

import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
  UIImagePickerPresentationStyle,
} from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import MapView, { Marker } from "react-native-maps";

import { arraySplitter } from "./ProfileView";

import BackHeader from "../comp_static_items/BackHeader";

import SVG_Post from "../../assets/svg/Post";

const userUploadMetadata = {
  contentType: "image/jpeg",
};

const initialRegion = {
  latitude: 51.186106956552244,
  longitude: 14.435684115023259,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const EVENT_TYPES = [
  "wiki/wustajenca",
  "schadźow./zhromadź.",
  "jubilej/swjedźeń",
  "teamowy/załožbowy ewent",
  "seminar/webinar/workshop",
  "party/barcamp",
  "festiwal",
  "cyrkwinski swjedźeń",
  "druhi",
];

export const EVENT_TAGS = [
  "p16",
  "p18",
  "'muttizettel'",
  "narodniny",
  "darmotny zastup",
  "zymne piwo",
  "shisha",
  "mjezynarodne",
  "Kóždy je witany!",
  "dźěło",
  "kwas",
  "dj",
  "catering",
  "Buisness",
  "wjesny klub",
  "alkohol",
  "njealkoholiske",
  "toćene piwo",
  "slěbory kwas",
  "złoty kwas",
  "18",
  "20",
  "30",
  "33",
  "40",
  "50",
  "60",
  "100",
  "přiroda",
  "zwěrjo",
  "live hudźba",
  "priwatne",
  "Jenož z přeprošenjom",
  "zhormadnosć",
  "wiki",
  "hody",
  "jutry",
];

export const splittArrayIntoNEqualy = (array, amt) => {
  let output = [];
  let amtPerLine = Math.floor(array.length / amt);
  for (let i = 0; i < amt; i++) {
    let a = [];
    for (let j = 0; j < amtPerLine; j++) a.push(array[j + amtPerLine * i]);
    output.push(a);
  }
  if (array.length % amt !== 0)
    for (let i = 0; i < array.length % amt; i++)
      output[amt - 1].push(array[array.length - 1 - i]);
  return output;
};

const EVENT_PLACEHOLDER = {
  title: "",
  description: "",
  starting: 0,
  ending: 0,
  geoCords: {
    latitude: 90,
    latitudeDelta: 90,
    longitude: -36,
    longitudeDelta: 124,
  },
};

const additionalData_PLACEHOLDER = {
  adBannerUri: "",
  entrance_fee: "",
  tags: [],
  theme: "",
  type: -1,
  website: "",
};

const tagLineAmt = 3;

let btnPressed;
export default function EventCreate({ navigation }) {
  const [pin, setPin] = useState(initialRegion);
  const [imageUri, setImageUri] = useState(null);
  const [imageAspect, setImageAspect] = useState(1);

  const [eventData, setEventData] = useState(EVENT_PLACEHOLDER);
  const [additionalData, setAdditionalData] = useState(
    additionalData_PLACEHOLDER
  );

  const [submittalbe, setSubmittalbe] = useState(false);

  const [userIsBuisness, setUserIsBuisness] = useState(false);

  const convertTextIntoTimestamp = (val) => {
    // "10.12.2022 19:25"
    // "December 10, 1815 19:25"

    const splitRegex = /\D/;
    let dateSplit = val.split(splitRegex);

    if (dateSplit.length != 5) return null;

    const dateFormat = new Date(
      dateSplit[2],
      dateSplit[1] - 1,
      dateSplit[0],
      dateSplit[3],
      dateSplit[4],
      0,
      0
    );
    const a = Date.parse(dateFormat);
    return a;
  };

  const publish = async () => {
    if (btnPressed) return;
    if (!submittalbe) return;
    if (eventData.starting === "undefined") return;
    btnPressed = true;

    const id = Date.now();
    const db = getDatabase();

    set(ref(db, "events/" + id), {
      id: id,
      type: 1,
      title: eventData.title,
      description: eventData.description,
      starting: eventData.starting,
      ending: eventData.ending,
      created: id,
      creator: getAuth().currentUser.uid,
      geoCords: pin,
    }).finally(async () => {
      get(child(ref(db), "users/" + getAuth().currentUser.uid))
        .then((userData) => {
          const data = userData.val();

          let a;
          if (userData.hasChild("events")) a = data["events"];
          else a = [];
          a.push(id);

          set(ref(db, "users/" + getAuth().currentUser.uid), {
            ...data,
            events: a,
          });
        })
        .catch((error) => console.log("error userudata", error.code))
        .finally(async () => {
          get(
            child(ref(db), "users/" + getAuth().currentUser.uid + "/isBuisness")
          ).then(async (snap) => {
            let isBuisness = false;
            if (snap.exists()) isBuisness = snap.val();

            if (!isBuisness) {
              Alert.alert(
                "Ewent zarjadowany",
                'Waš nowy ewent "' +
                  eventData.title +
                  '" je so wuspěšnje zarjadował.',
                [
                  {
                    text: "Ok",
                    style: "default",
                    onPress: navigation.navigate("Recent"),
                  },
                ]
              );
              return;
            }

            let eventOptions = {};
            if (isBuisness) {
              if (additionalData.entrance_fee.length !== 0) {
                let a = eventOptions;
                eventOptions = {
                  ...a,
                  entrance_fee: parseFloat(additionalData.entrance_fee),
                };
              }
              if (additionalData.tags.length !== 0) {
                let a = eventOptions;
                eventOptions = {
                  ...a,
                  tags: additionalData.tags,
                };
              }
              if (additionalData.theme.length !== 0) {
                let a = eventOptions;
                eventOptions = {
                  ...a,
                  theme: additionalData.theme,
                };
              }
              if (additionalData.type !== -1) {
                let a = eventOptions;
                eventOptions = {
                  ...a,
                  type: additionalData.type,
                };
              }
              if (additionalData.website.length !== 0) {
                let a = eventOptions;
                eventOptions = {
                  ...a,
                  website: additionalData.website,
                };
              }
            }

            if (!imageUri) {
              set(
                ref(db, "events/" + id + "/eventOptions"),
                eventOptions
              ).finally(() => {
                Alert.alert(
                  "Ewent zarjadowany",
                  'Waš nowy ewent "' +
                    eventData.title +
                    '" je so wuspěšnje zarjadował.',
                  [
                    {
                      text: "Ok",
                      style: "default",
                      onPress: navigation.navigate("Recent"),
                    },
                  ]
                );
              });
              return;
            }

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

            const itemRef = storageRef(storage, "event_pics/" + id);
            uploadBytes(itemRef, blob, userUploadMetadata)
              .finally(() => {
                getDownloadURL(itemRef)
                  .then((url) => {
                    eventOptions.adBanner = {
                      uri: url,
                      aspect: imageAspect,
                    };
                    set(
                      ref(db, "events/" + id + "/eventOptions"),
                      eventOptions
                    ).finally(() => {
                      Alert.alert(
                        "Ewent zarjadowany",
                        'Waš nowy ewent "' +
                          eventData.title +
                          '" je so wuspěšnje zarjadował.',
                        [
                          {
                            text: "Ok",
                            style: "default",
                            onPress: navigation.navigate("Recent"),
                          },
                        ]
                      );
                    });
                  })
                  .error((error) => console.log("download error", error.code));
              })
              .catch((error) => console.log("error upload", error.code));
          });
        });
    });
  };

  const openImagePickerAsync = async () => {
    let permissionResult = await requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    let pickerResult = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      allowsMultipleSelection: false,
      presentationStyle: UIImagePickerPresentationStyle.PageSheet,
    });
    if (pickerResult.cancelled) return;

    let aspect = pickerResult.width / pickerResult.height;
    setImageAspect(aspect);

    const croppedPicker = await manipulateAsync(
      pickerResult.uri,
      [
        {
          resize: {
            width: 1000 * aspect,
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

  useEffect(() => {
    btnPressed = false;
    get(
      child(
        ref(getDatabase()),
        "users/" + getAuth().currentUser.uid + "/isBuisness"
      )
    ).then((snapshot) => {
      if (!snapshot.exists()) return;
      const isB = snapshot.val();
      setUserIsBuisness(isB);
    });
  }, []);

  const checkIfPublishable = () => {
    if (
      !(
        eventData.title.length !== 0 &&
        eventData.description.length !== 0 &&
        eventData.starting &&
        eventData.ending &&
        eventData.starting < eventData.ending
      )
    )
      setSubmittalbe(false);
    else setSubmittalbe(true);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        style={styles.backHeader}
        title="Nowy ewent wozjewić"
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
        {/* required */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Tute podaća zu žadane za nowy ewent</Text>

          {/* Map */}
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Podaj městnosć ewenta</Text>

            <View style={styles.mapOutlineContainer}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  userInterfaceStyle="dark"
                  showsUserLocation
                  showsScale
                  rotateEnabled={false}
                  accessible={false}
                  focusable={false}
                  onRegionChange={(result) => setPin(result)}
                  initialRegion={eventData.geoCords}
                >
                  <Marker title={eventData.title} coordinate={pin} />
                </MapView>
              </View>
            </View>
          </View>

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
            value={eventData.title}
            autoCapitalize="sentences"
            autoComplete={false}
            textContentType="name"
            editable
            onChangeText={(value) => {
              setEventData({
                ...eventData,
                title: value,
              });
              checkIfPublishable();
            }}
          />

          {/* Desc */}
          <TextInput
            style={styles.input}
            placeholder="Wopisaj twój ewent..."
            maxLength={512}
            multiline
            placeholderTextColor={"#5884B0"}
            selectionColor={"#5884B0"}
            keyboardType="default"
            keyboardAppearance="dark"
            value={eventData.description}
            autoCapitalize="sentences"
            autoComplete={false}
            editable
            onChangeText={(value) => {
              setEventData({
                ...eventData,
                description: value,
              });
              checkIfPublishable();
            }}
          />

          {/* Starting */}
          <TextInput
            style={styles.input}
            placeholder="Započatk"
            maxLength={32}
            multiline={false}
            numberOfLines={1}
            placeholderTextColor={"#5884B0"}
            selectionColor={"#5884B0"}
            keyboardType="numbers-and-punctuation"
            keyboardAppearance="dark"
            autoCapitalize="none"
            autoComplete={false}
            editable
            onChangeText={(value) => {
              setEventData({
                ...eventData,
                starting: convertTextIntoTimestamp(value),
              });
              checkIfPublishable();
            }}
          />
          {/* Ending */}
          <TextInput
            style={styles.input}
            placeholder="Kónc"
            maxLength={32}
            multiline={false}
            numberOfLines={1}
            placeholderTextColor={"#5884B0"}
            selectionColor={"#5884B0"}
            keyboardType="numbers-and-punctuation"
            keyboardAppearance="dark"
            autoCapitalize="none"
            autoComplete={false}
            editable
            onChangeText={(value) => {
              setEventData({
                ...eventData,
                ending: convertTextIntoTimestamp(value),
              });
              checkIfPublishable();
            }}
          />
          <Text style={styles.timeHint}>(forma: dźeń.měsac.lěto hodź:min)</Text>
        </View>

        {/* optional */}
        {userIsBuisness ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>
              Tute podaća su za konkretne informacije, njedyrbja so ale podać
            </Text>

            {/* Type */}
            <View style={styles.sectionContainer}>
              <Text style={styles.text}>Kajki typ je twój ewent?</Text>
              <View style={styles.inputContainer}>
                {arraySplitter(EVENT_TYPES, 3).map((list, listKey) => (
                  <View key={listKey} style={styles.typeListContainer}>
                    {list.map((type, key) => (
                      <SelectableBtn
                        key={key}
                        selected={
                          additionalData.type === EVENT_TYPES.indexOf(type)
                        }
                        title={type}
                        style={styles.typeBtn}
                        onPress={() => {
                          setAdditionalData({
                            ...additionalData,
                            type: EVENT_TYPES.indexOf(type),
                          });
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Thema */}
            <TextInput
              style={styles.input}
              placeholder="Tema ewenta"
              maxLength={16}
              multiline={false}
              numberOfLines={1}
              placeholderTextColor={"#5884B0"}
              selectionColor={"#5884B0"}
              keyboardType="default"
              keyboardAppearance="dark"
              value={additionalData.theme}
              autoCapitalize="words"
              autoComplete={false}
              textContentType="none"
              editable
              onChangeText={(value) => {
                setAdditionalData({
                  ...additionalData,
                  theme: value,
                });
              }}
            />

            {/* Entrance fee */}
            <TextInput
              style={styles.input}
              placeholder="Zastupna płaćizna w €"
              maxLength={16}
              multiline={false}
              numberOfLines={1}
              placeholderTextColor={"#5884B0"}
              selectionColor={"#5884B0"}
              keyboardType="decimal-pad"
              keyboardAppearance="dark"
              autoCapitalize="none"
              autoComplete={false}
              textContentType="none"
              editable
              onChangeText={(value) => {
                setAdditionalData({
                  ...additionalData,
                  entrance_fee: value,
                });
              }}
            />

            {/* Website */}
            <TextInput
              style={styles.input}
              placeholder="Website k ewenće"
              maxLength={16}
              multiline={false}
              numberOfLines={1}
              placeholderTextColor={"#5884B0"}
              selectionColor={"#5884B0"}
              keyboardType="web-search"
              keyboardAppearance="dark"
              value={additionalData.website}
              autoCapitalize="none"
              autoComplete={false}
              textContentType="URL"
              editable
              onChangeText={(value) => {
                setAdditionalData({
                  ...additionalData,
                  website: value,
                });
              }}
            />

            {/* Image */}
            <View style={styles.sectionContainer}>
              <Text style={styles.text}>Wabjenski plakat/wobraz</Text>
              <Pressable
                style={styles.imgOutlineContainer}
                onPress={openImagePickerAsync}
              >
                <View style={styles.imgContainer}>
                  {imageUri !== null ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={[styles.img, { aspectRatio: imageAspect }]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.img,
                        styles.imgBorder,
                        { aspectRatio: imageAspect },
                      ]}
                    >
                      <SVG_Post style={styles.imageHintIcon} fill="#143C63" />
                      <Text style={styles.imageHintText}>
                        Tłoć, zo wobrazy přepytać móžeš
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>

            {/* Tags */}
            <View style={styles.sectionContainer}>
              <Text style={styles.text}>Tags</Text>

              <View style={styles.tagsScrollContainer}>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  style={{ width: "100%" }}
                  contentContainerStyle={{ flexDirection: "column" }}
                  showsVerticalScrollIndicator={false}
                  keyboardDismissMode="on-drag"
                  horizontal
                  bounces
                  onScrollBeginDrag={() => {
                    if (Platform.OS === "ios") Keyboard.dismiss;
                  }}
                >
                  {splittArrayIntoNEqualy(EVENT_TAGS, tagLineAmt).map(
                    (line, lineKey) => (
                      <View key={lineKey} style={styles.tagLineContainer}>
                        {line.map((tag, key) => (
                          <SelectableBtn
                            key={key}
                            selected={additionalData.tags.includes(
                              EVENT_TAGS.indexOf(tag)
                            )}
                            title={tag}
                            style={styles.tagBtn}
                            onPress={() => {
                              let t = [].concat(additionalData.tags);
                              if (!t.includes(EVENT_TAGS.indexOf(tag)))
                                t.push(EVENT_TAGS.indexOf(tag));
                              else
                                t.splice(t.indexOf(EVENT_TAGS.indexOf(tag)), 1);
                              setAdditionalData({
                                ...additionalData,
                                tags: t,
                              });
                            }}
                          />
                        ))}
                      </View>
                    )
                  )}
                </ScrollView>
              </View>
            </View>

            <Text style={styles.subtext}>
              Jeli chceš za ewent wabować, potom móžeš po wozjewjenju so na
              Buisness-Dashboard we syći pod dashboard.kostrjanc.de podać.
              {"\n"}Dalše kroki su rozkładźene.
            </Text>
          </View>
        ) : null}

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

export const SelectableBtn = (props) => {
  return (
    <View style={props.style}>
      <Pressable
        style={[
          stylesSB.container,
          { borderColor: !props.selected ? "#143C63" : "#B06E6A" },
        ]}
        onPress={props.onPress}
      >
        <View style={stylesSB.textContainer}>
          <Text
            style={[
              stylesSB.title,
              { color: !props.selected ? "#5884B0" : "#B06E6A" },
            ]}
          >
            {props.title}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

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

  sectionContainer: {
    width: "100%",
    marginVertical: 10,
  },
  title: {
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#5884B0",
    marginVertical: 5,
  },
  text: {
    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
    marginBottom: 5,
  },
  subtext: {
    fontFamily: "Barlow_Regular",
    fontSize: 15,
    color: "#5884B0",
    marginBottom: 5,
  },

  mapOutlineContainer: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#143C63",

    marginTop: 5,

    zIndex: 3,
  },
  mapContainer: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
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
  timeHint: {
    width: "100%",
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    color: "#5884B0",
    alignSelf: "center",
    textAlign: "center",
  },

  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  typeListContainer: {
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    padding: 0,
    margin: 0,
  },
  typeBtn: {
    flex: 1,
    margin: 5,
  },

  imgOutlineContainer: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",

    marginTop: 5,

    borderRadius: 25,
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
    alignSelf: "center",

    justifyContent: "center",
    alignItems: "center",
  },
  imgBorder: {
    borderRadius: 25,
    borderWidth: 5,
    borderStyle: "dashed",
    borderColor: "#B06E6A",
    paddingVertical: 25,
  },
  imageHintIcon: {
    width: "25%",
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

  tagsScrollContainer: {
    width: "100%",
    flexDirection: "column",
  },
  tagLineContainer: {
    flexDirection: "row",
    flex: 1,
  },
  tagBtn: {
    margin: 5,
  },

  checkBtnContainer: {
    width: "60%",

    borderRadius: 15,

    marginBottom: 25,

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
});

const stylesSB = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,

    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",

    fontFamily: "Barlow_Regular",
    fontSize: 15,
    textAlign: "center",
  },
});
