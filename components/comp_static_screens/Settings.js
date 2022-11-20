import React, { useState, useEffect } from "react";

import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
} from "react-native";

import BackHeader from "../comp_static_items/BackHeader";

import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getDatabase, set, ref, child, get } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

import { setString } from "expo-clipboard";

import MainSplitLine from "../comp_static_items/MainSplitLine";

import { openURL } from "expo-linking";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

import SVG_Return from "../../assets/svg/Return";
import SVG_Telefon from "../../assets/svg/Telefon";

let userIDVisible = true;
export default function Settings({ navigation }) {
  const [userID, setUserID] = useState(getAuth().currentUser.uid);
  const [userIdText, setUserIdText] = useState("");

  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Copy uid to Clipboard
  const copyIDToClipboard = () => {
    if (!userIDVisible) {
      toggleIDHide();
      return;
    }
    setString(userID);
    Alert.alert("Twoja id je so kopěrowała!", "id: " + userID, [
      {
        text: "Ok",
        style: "default",
      },
    ]);
  };

  // Account Logout -> Auto - AuthLanding
  const logoutAccount = () => {
    Alert.alert(
      "Wotzjewić?",
      "Chceš ty so woprawdźe z twojeho konta wotzjewić?",
      [
        {
          text: "Ně",
          style: "destructive",
        },
        {
          text: "Haj",
          style: "default",
          onPress: () => {
            signOut(getAuth()).catch(() =>
              console.log("error logout", error.code)
            );
          },
        },
      ]
    );
  };

  // Account Delete -> Auto - AuthLanding
  const deleteAccount = () => {
    Alert.alert(
      "Konto wotstronić?",
      "Chceš ty woprawdźe twój konto wotstronić?",
      [
        {
          text: "Ně",
          style: "destructive",
        },
        {
          text: "Haj",
          style: "default",
          onPress: () => {
            Alert.alert(
              "Sy sej woprawdźe wěsty, twój konto je za přeco fuk!",
              "",
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
                    const storage = getStorage();

                    get(child(ref(db), "users/" + userID))
                      .then((snapshot) => {
                        const data = snapshot.val();

                        if (snapshot.hasChild("follower")) {
                          const followerList = data["follower"];
                          for (let i = 0; i < followerList.length; i++) {
                            get(
                              child(ref(db), "users/" + followerList[i])
                            ).then((snapshotFollower) => {
                              const followerData = snapshotFollower.val();
                              let a = followerData["following"];
                              a.splice(a.indexOf(userID), 1);
                              set(ref(db, "users/" + followerList[i]), {
                                ...followerData,
                                following: a,
                              });
                            });
                          }
                        }

                        if (snapshot.hasChild("following")) {
                          const followingList = data["following"];
                          for (let i = 0; i < followingList.length; i++) {
                            get(
                              child(ref(db), "users/" + followingList[i])
                            ).then((snapshotFollowing) => {
                              const followingData = snapshotFollowing.val();
                              let a = followingData["follower"];
                              a.splice(a.indexOf(userID), 1);
                              set(ref(db, "users/" + followingList[i]), {
                                ...followingData,
                                follower: a,
                              });
                            });
                          }
                        }

                        if (snapshot.hasChild("posts")) {
                          const postsList = data["posts"];
                          for (let i = 0; i < postsList.length; i++) {
                            set(ref(db, "posts/" + postsList[i]), null);
                            deleteObject(
                              storageRef(storage, "posts_pics/" + postsList[i])
                            );
                          }
                        }
                        if (snapshot.hasChild("events")) {
                          const eventsList = data["events"];
                          for (let i = 0; i < eventsList.length; i++) {
                            set(ref(db, "events/" + eventsList[i]), null);
                          }
                        }

                        deleteObject(
                          storageRef(storage, "profile_pics/" + userID)
                        );
                      })
                      .finally(() => {
                        set(ref(db, "users/" + userID), null).finally(() => {
                          deleteUser(getAuth().currentUser);
                        });
                      });
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Generate PDF with Account Info - API
  const getAccountData = () => {
    Alert.alert(
      "Kontowe informacije",
      "Chceš sej wšitke twoje kontowe daty pósłać dać?",
      [
        {
          text: "Ně",
          style: "destructive",
        },
        {
          text: "Haj",
          style: "default",
          onPress: () => {
            fetch("http://vps343020.ovh.net:8080/get_user_info", {
              method: "POST",
              mode: "cors",
              cache: "no-cache",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
              },
              redirect: "follow",
              referrerPolicy: "no-referrer",
              body: JSON.stringify({ user_id: getAuth().currentUser.uid }),
            }).then((resp) =>
              resp.blob().then((blob) => {
                const fr = new FileReader();
                fr.onload = async () => {
                  const fileUri =
                    FileSystem.documentDirectory +
                    "/daty_wot_" +
                    userID +
                    "na_kostrjanc.pdf";
                  await FileSystem.writeAsStringAsync(
                    fileUri,
                    fr.result.split(",")[1],
                    {
                      encoding: FileSystem.EncodingType.Base64,
                    }
                  );
                  shareAsync(fileUri);
                };
                fr.readAsDataURL(blob);
              })
            );
          },
        },
      ]
    );
  };

  // ID toggle *** <-> abc
  const toggleIDHide = () => {
    if (userIDVisible) {
      let a = "";
      userID.split("").forEach((e) => (a += "*"));
      setUserIdText(a);
    } else setUserIdText(userID);

    userIDVisible = !userIDVisible;
  };

  // Check if User is Admin
  useEffect(() => {
    get(child(ref(getDatabase()), "users/" + userID + "/isAdmin")).then(
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.val();
        setUserIsAdmin(data);
      }
    );
    toggleIDHide();
  }, []);

  // ADMIN Set Server State
  const ADMIN_setServerStatus = (opt) => {
    const db = getDatabase();

    get(child(ref(db), "users/" + getAuth().currentUser.uid + "/isAdmin")).then(
      (snapshot) => {
        if (!snapshot.exists()) return;
        const isAdmin = snapshot.val();
        if (!isAdmin) return;
      }
    );

    switch (opt) {
      case "offline":
        Alert.alert(
          "Chceš serwer na 'offline' stajić?",
          "Chceš woprawdźe serwer hasnyć? Po tym nichtó wjac přistup na serwer nima",
          [
            {
              text: "Ně",
              style: "destructive",
            },
            {
              text: "Haj",
              style: "default",
              onPress: () => {
                Alert.prompt(
                  "Chceš WOPRAWDŹE serwer na 'offline' stajić?",
                  "Zapodaj prošu 'offline'",
                  [
                    {
                      text: "Ně",
                      style: "destructive",
                    },
                    {
                      text: "Haj",
                      style: "default",
                      onPress: (text) => {
                        if (text === "offline") {
                          set(ref(db, "status"), "offline").finally(() =>
                            Alert.alert(
                              "Serwer je so wuspěšnje na 'offline' sadźił."
                            )
                          );
                        } else Alert.alert("Wopak!");
                      },
                    },
                  ]
                );
              },
            },
          ]
        );
        break;
      case "pause":
        Alert.alert(
          "Chceš serwer na 'pause' stajić?",
          "Chceš woprawdźe serwer hasnyć? Po tym nichtó wjac přistup na serwer nima.",
          [
            {
              text: "Ně",
              style: "destructive",
            },
            {
              text: "Haj",
              style: "default",
              onPress: () => {
                Alert.prompt(
                  "Kak dółho budźe serwer hasnjeny?",
                  "Zapodaj čas, kak dółho ma serwer hasnjeny być. Prošu mysli na to, zo ma so serwer manuelnje zaso na online sadźić!",
                  [
                    {
                      text: "Wottorhać",
                      style: "destructive",
                    },
                    {
                      text: "Dale",
                      style: "default",
                      onPress: (time) => {
                        Alert.prompt(
                          "Chceš WOPRAWDŹE serwer na 'pause' za " +
                            time +
                            " stajić?",
                          "Zapodaj prošu 'pause'.",
                          [
                            {
                              text: "Ně",
                              style: "destructive",
                            },
                            {
                              text: "Haj",
                              style: "default",
                              onPress: (text) => {
                                if (text === "pause") {
                                  set(
                                    ref(db, "status"),
                                    "pause/" + time + "/" + Date.now()
                                  ).finally(() =>
                                    Alert.alert(
                                      "Serwer je so wuspěšnje na 'pause/" +
                                        time +
                                        "/" +
                                        Date.now() +
                                        "' sadźił."
                                    )
                                  );
                                } else Alert.alert("Wopak!");
                              },
                            },
                          ]
                        );
                      },
                    },
                  ]
                );
              },
            },
          ]
        );
        break;
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader
        style={styles.backHeader}
        title="Zastajenja"
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
      >
        {/* Bug Report */}
        <WarnButton
          style={styles.sectionContainer}
          title={"Sy zmylk namakał?"}
          sub={"Přizjeł tutón nam prošu!"}
          press={() => openLink("https://kostrjanc.de/pomoc/formular#bugs")}
        />

        {/* Account */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Konto</Text>

          <Text style={styles.text} onPress={toggleIDHide}>
            Twoja id: (tłóć, zo so id pokaza)
          </Text>
          <Text
            style={[styles.text, { fontFamily: "Barlow_Bold" }]}
            onPress={copyIDToClipboard}
          >
            {userIdText}
          </Text>

          <InteractionButton
            style={styles.button}
            title={"Chceš so z twojeho konta wotzjewić?"}
            press={logoutAccount}
          />
          <InteractionButton
            style={styles.button}
            title={"Chceš twój konto wotstronić?"}
            press={deleteAccount}
          />
          <InteractionButton
            style={styles.button}
            title={"Kontowe informacije sej pósłać dać?"}
            press={getAccountData}
          />
        </View>

        {/* Verify */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Werifikacija</Text>

          <Text style={styles.text}>
            Zo móžeš twój konto werifikować, dyrbiš slědowace kriterie spjelnić:
          </Text>
          <View style={styles.slimSectionContainer}>
            <Text style={styles.subtext}>&#8226; staroba wot 18 lět</Text>
            <Text style={styles.subtext}>
              &#8226; maš wosebity poćah ke kostrjanc abo spejliš wosebity
              status w towaršnosći
            </Text>
            <Text style={styles.subtext}>
              &#8226; wužiješ kostrjanc regularnje a wobkedźbuješ regule za
              wužiwanje
            </Text>
            <Text style={styles.subtext}>
              &#8226; dźeržiš so na moralne normy a akceptuješ prawa a regule w
              a zwonka kostrjanc
            </Text>
            <Text style={styles.subtext}>
              &#8226; akceptuješ w a zwonka kostrjanc kóždeho sobučłowjeka
            </Text>
          </View>
          <Text style={styles.text}>
            Jeli trěbne dypki spjeliš, požadaj so jednorje přez...
          </Text>
          <LinkButton
            style={styles.button}
            title={"...online formular"}
            link="http://kostrjanc.de/pomoc/formular#werifikacija"
          />
        </View>

        {/* Help */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Pomocne linki</Text>

          <LinkButton
            style={styles.button}
            title={"Wopytaj tola raz kostrjanc.de, našu stronu w interneće!"}
            link="https://kostrjanc.de"
          />
          <LinkButton
            style={styles.button}
            title={
              "Maš prašenja?\nPotom wopytaj kostrjanc.de a woprašej so nas!"
            }
            link="https://kostrjanc.de/pomoc/"
          />
          <LinkButton
            style={styles.button}
            title={"Sy zmylk namakał, potom přizjeł so prošu pola nas!"}
            link="https://kostrjanc.de/pomoc/formular#bugs"
          />
          <LinkButton
            style={styles.button}
            title={"Chceš na kostrjanc wabić?\nPřizjeł so pod linkom!"}
            link="https://kostrjanc.de/business"
          />
          <LinkButton
            style={styles.button}
            title={"Sy admin abo moderator?\nPotom wužiwaj dashboard we syći!"}
            link="https://dashboard.kostrjanc.de/"
          />
        </View>

        {/* Impressum */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Impresum</Text>
          <Text style={styles.text}>Podaća po §5 TMG</Text>

          <View style={styles.slimSectionContainer}>
            <Text style={styles.subtext}>
              Cyril Mark {"\n"}
              Łusč 1e {"\n"}
              02699 Bóšicy {"\n\n"}
              Korla Baier {"\n"}
              Srjedźny puć 12 {"\n"}
              01920 Pančicy Kukow
            </Text>
          </View>

          {/* Ideja a přesadźenje */}
          <View style={styles.slimSectionContainer}>
            <Text style={styles.text}>Ideja a přesadźenje:</Text>
            <Text style={styles.subtext}>
              Mark, Cyril; {"\n"}
              Baier, Korla
            </Text>
          </View>

          {/* Kontakt */}
          <View style={styles.slimSectionContainer}>
            <Text style={styles.text}>Kontakt:</Text>
            <Text style={styles.subtext}>
              Telefon: +49 179 4361854 {"\n"}
              E-Mail: info@kostrjanc.de {"\n"}
              Internet: kostrjanc.de
            </Text>
          </View>

          {/* Rukowanja za wobsah */}
          <View style={styles.slimSectionContainer}>
            <Text style={styles.text}>Rukowanja za wobsah:</Text>
            <Text style={styles.subtext}>
              Zamołwity za wobsah po § 6 MDStV: ___
            </Text>
            <Text style={[styles.subtext, { textAlign: "justify" }]}>
              Najebać swědomiteje wobsahoweje kontrole njerukujemy za wobsahi
              eksternych linkow. Wužiwarjo maja móžnosć postować bjez filtrowym
              systemom. Pola njedodźerženjow prawow našich regulow so přidawki
              wostronja a wužiwar přewza połnu winu. Naša platforma přewza
              funkciju komunikacije mjez serbskim ludom. Za tute su wuwzaćnje
              poskićerjo abo wobhospodarjo sami zamołwići. Platforma ma so ryzy
              serbsce wužiwać. Wužiwarjo so njechłostaja, při wužiwanju druhich
              rěčow. Prosymy tohodla, na serbšćinu dźiwać. Wšitke wot
              wobhospodarjow tutych stronow wudźěłane wobsahi a dźěła (teksty a
              wobrazy) podleža němskemu awtorskemu prawu. Za rozmnoženje,
              wobdźěłanje, rozšěrjenje a kóždežkuli wužiwanje zwonka hranicow
              awtorskeho prawa je trěbna pisomna dowolnosć awtora. Downloady a
              kopije tajkich stronow su jeničce za priwatne, njekomercionelne
              wužiwanje dowolene. Dalokož so wobsahi na tutych stronach njejsu
              wot wobhospodarja wudźěłali, maja so awtorske prawa třećich
              wobkedźbować. Wobsahi třećich maja so jako tajke woznamjenić.
            </Text>
          </View>

          {/* Škit datow */}
          <View style={styles.slimSectionContainer}>
            <Text style={styles.text}>Škit datow:</Text>
            <Text style={[styles.subtext, { textAlign: "justify" }]}>
              Wužiwanje wot kostrjanc je ryzy dobrowólnje. Daty, kiž so
              zapodaja, njejsu za třěćeho widźomnje a njejsu komercijelny srědk.
              Skedźbnjamy na to, zo móže přenjesenje datow w interneće (n. př.
              při komunikaciji z mejlku) wěstotne dźěry měć. Dospołny škit datow
              před zapřimnjenjom třećich njeje móžny. Wužiwanju w ramiku
              impresumoweje winowatosće wozjewjenych kontaktowych datow přez
              třećich k připósłaću nic wuraznje požadaneho wabjenja a
              informaciskich materialijow so z tym wuraznje znapřećiwja.
              Wobhospodarjo stronow wobchowaja sej w padźe nježadaneho
              připósłaća wabjenskich informacijow, n. př. z pomocu spam-mejlkow,
              prawo na prawniske kročele. Wšitke daty, kiž su so wot wužiwarja
              na kostrjanc zapodali, dadźa so kóždy čas w zastajenjach
              eksportować a začitać dać.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.sectionContainer, styles.footerContainer]}>
          <Text style={styles.footerText}>
            wersija {require("../../app.json").expo.version}
          </Text>
          <Text style={styles.footerText}>
            Produced by Mark, Cyril; Baier, Korla
          </Text>
          <Text style={styles.footerText}>© 2022 most rights reserved</Text>
        </View>

        <MainSplitLine />

        {/* ADMIN ONLY */}
        {userIsAdmin ? (
          <View style={styles.adminContainer}>
            <Text style={styles.text}>
              Adminowy wobłuk, jenož w nuzy wužiwać!
            </Text>
            <Text style={styles.text}>Serwerowy status zastajić:</Text>
            <View style={styles.adminServerContainer}>
              <Pressable
                style={styles.adminServerBtn}
                onPress={() => ADMIN_setServerStatus("offline")}
              >
                <Text style={styles.adminServerBtnText}>Offline</Text>
              </Pressable>
              <Pressable
                style={styles.adminServerBtn}
                onPress={() => ADMIN_setServerStatus("pause")}
              >
                <Text style={styles.adminServerBtnText}>Pause</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

export const LinkButton = (props) => {
  return (
    <View style={props.style}>
      <Pressable
        style={styles_link.linkContainer}
        onPress={() => openLink(props.link)}
      >
        <Text
          numberOfLines={props.lineAmt ? props.lineAmt : 0}
          ellipsizeMode="tail"
          style={styles_link.linkTitle}
        >
          {props.title}
        </Text>

        {/* Btn */}
        <Pressable
          style={styles_link.linkBtn}
          onPress={() => openLink(props.link)}
        >
          <View style={styles_link.linkBtnBG}>
            <SVG_Return style={styles_link.linkBtnIcon} fill={"#000000"} />
          </View>
        </Pressable>
      </Pressable>
    </View>
  );
};

export const CallButton = (props) => {
  return (
    <View style={props.style}>
      <Pressable
        style={styles_link.linkContainer}
        onPress={() => openLink(props.link)}
      >
        <Text style={styles_link.linkTitle}>{props.title}</Text>

        {/* Btn */}
        <Pressable
          style={styles_link.linkBtn}
          onPress={() => openLink(props.link)}
        >
          <View style={styles_link.linkBtnBG}>
            <SVG_Telefon
              style={[
                styles_link.linkBtnIcon,
                { transform: [{ rotate: "0deg" }] },
              ]}
              fill={"#000000"}
            />
          </View>
        </Pressable>
      </Pressable>
    </View>
  );
};

const openLink = (link) => {
  Alert.alert("Link wočinić?", "Chceš so na eksternu stronu dale wodźić dać?", [
    {
      text: "Ně",
      style: "destructive",
    },
    {
      text: "Haj",
      style: "default",
      onPress: () => {
        openURL(link);
      },
    },
  ]);
};

const InteractionButton = (props) => {
  return (
    <View style={props.style}>
      <Pressable style={styles_link.linkContainer} onPress={props.press}>
        <Text style={styles_link.linkTitle}>{props.title}</Text>

        {/* Btn */}
        <Pressable style={styles_link.linkBtn} onPress={props.press}>
          <View style={styles_link.linkBtnBG}>
            <SVG_Return style={styles_link.linkBtnIcon} fill={"#000000"} />
          </View>
        </Pressable>
      </Pressable>
    </View>
  );
};

const WarnButton = (props) => {
  return (
    <View style={props.style}>
      <Pressable style={styles_warn.warnContainer} onPress={props.press}>
        {/* Marker */}
        <View style={styles_warn.markerContainer}>
          <View style={styles_warn.marker} />
        </View>

        {/* Text */}
        <View style={styles_warn.warnTextContainer}>
          <Text style={styles_warn.warnTitle}>{props.title}</Text>
          <Text style={styles_warn.warnSub}>{props.sub}</Text>
        </View>

        {/* Btn */}
        <Pressable
          style={styles_warn.warnBtn}
          onPress={() => openLink(props.press)}
        >
          <View style={styles_warn.warnBtnBG}>
            <SVG_Return style={styles_warn.warnBtnIcon} fill={"#000000"} />
          </View>
        </Pressable>
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
  slimSectionContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 5,
  },

  title: {
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#B06E6A",
    marginVertical: 5,
  },
  text: {
    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
    marginVertical: 5,
  },
  subtext: {
    fontFamily: "Barlow_Regular",
    fontSize: 15,
    color: "#5884B0",
    marginVertical: 2,
  },

  button: {
    width: "100%",
    marginVertical: 2,
  },

  footerContainer: {
    alignItems: "flex-end",
  },
  footerText: {
    color: "#5884B0",
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
  },

  adminContainer: {
    width: "100%",
    paddingVertical: 5,
    marginVertical: 10,
  },
  adminServerContainer: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  adminServerBtn: {
    minWidth: 150,
    borderRadius: 15,
    padding: 10,

    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#5884B0",
    margin: 5,
  },
  adminServerBtnText: {
    color: "#000000",
    fontFamily: "Barlow_Regular",
    fontSize: 20,
  },
});

const styles_link = StyleSheet.create({
  linkContainer: {
    width: "100%",

    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#143C63",

    padding: 10,
    justifyContent: "center",

    zIndex: 3,

    flexDirection: "row",
    alignItems: "center",
  },

  linkBtn: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  linkBtnBG: {
    width: "100%",
    aspectRatio: 1,
    paddingHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,

    backgroundColor: "#5884B0",
  },
  linkBtnIcon: {
    width: "100%",
    aspectRatio: 1,
    transform: [{ rotate: "180deg" }],
  },

  linkTitle: {
    flex: 0.9,
    fontFamily: "Barlow_Regular",
    fontSize: 20,
    color: "#5884B0",
  },
});

const styles_warn = StyleSheet.create({
  warnContainer: {
    width: "100%",

    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#B06E6A",

    padding: 10,
    justifyContent: "center",

    zIndex: 3,

    flexDirection: "row",
    alignItems: "center",
  },

  markerContainer: {
    position: "relative",
    flex: 0.1,
    height: 50,
    alignItems: "center",
  },
  marker: {
    width: 1,
    height: "100%",
    backgroundColor: "#B06E6A",
  },

  warnBtn: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  warnBtnBG: {
    width: "100%",
    aspectRatio: 1,
    paddingHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,

    backgroundColor: "#B06E6A",
  },
  warnBtnIcon: {
    width: "100%",
    aspectRatio: 1,
    transform: [{ rotate: "180deg" }],
  },

  warnTextContainer: {
    height: "100%",
    flex: 0.8,
    flexDirection: "column",
  },
  warnTitle: {
    flex: 0.6,
    fontFamily: "Barlow_Bold",
    fontSize: 25,
    color: "#B06E6A",
  },
  warnSub: {
    marginVertical: 10,
    flex: 0.4,
    fontFamily: "RobotoMono_Thin",
    fontSize: 15,
    color: "#B06E6A",
  },
});
