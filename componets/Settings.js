import React, { useState } from 'react'

import { Alert, View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';

import BackHeader from './statics/BackHeader';

import { getAuth, signOut, deleteUser } from 'firebase/auth'
import { getDatabase, set, ref, child, get } from 'firebase/database';
import { getStorage, ref as storageRef , deleteObject } from "firebase/storage";

import { setString } from 'expo-clipboard';

import { openURL } from 'expo-linking'

import SVG_Return from '../assets/svg/Return';
import SVG_Telefon from '../assets/svg/Telefon';

export default function Settings({ navigation }) {

    const [userID, setUserID] = useState(getAuth().currentUser.uid);

    const copyIDToClipboard = () => {
        setString(userID);
        Alert.alert("Twoja id je so kopěrowała!", "id: " + userID, [
            {
                text: "Ok",
                style: "default",
            }
        ]);
    }

    const logoutAccount = () => {
        Alert.alert("Wotzjewić?", "Chceš ty so woprawdźe z twojeho konta wotzjewić?", [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    signOut(getAuth())
                        .catch(() => console.log("error logout", error.code))
                }
            }
        ]);
    }

    const deleteAccount = () => {
        Alert.alert("Konto wotstronić?", "Chceš ty woprawdźe twój konto wotstronić?", [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    Alert.alert("Sy sej woprawdźe wěsty, twój konto je za přeco fuk!", "", [
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

                                        if (snapshot.hasChild('follower')) {
                                            const followerList = data['follower'];
                                            for (let i = 0; i < followerList.length; i++) {
                                                get(child(ref(db), "users/" + followerList[i]))
                                                    .then((snapshotFollower) => {
                                                        const followerData = snapshotFollower.val();
                                                        let a = followerData['following'];
                                                        a.splice(a.indexOf(userID), 1);
                                                        set(ref(db, "users/" + followerList[i]), {
                                                            ...followerData,
                                                            following: a
                                                        })
                                                    })
                                            }
                                        }

                                        if (snapshot.hasChild('following')) {
                                            const followingList = data['following'];
                                            for (let i = 0; i < followingList.length; i++) {
                                                get(child(ref(db), "users/" + followingList[i]))
                                                    .then((snapshotFollowing) => {
                                                        const followingData = snapshotFollowing.val();
                                                        let a = followingData['follower'];
                                                        a.splice(a.indexOf(userID), 1);
                                                        set(ref(db, "users/" + followingList[i]), {
                                                            ...followingData,
                                                            follower: a
                                                        })
                                                    })
                                            }
                                        }

                                        if (snapshot.hasChild('posts')) {
                                            const postsList = data['posts'];
                                            for (let i = 0; i < postsList.length; i++) {
                                                set(ref(db, "posts/" + postsList[i]), null);
                                                deleteObject(storageRef(storage, "posts_pics/" + postsList[i]));
                                            }
                                        }
                                        if (snapshot.hasChild('events')) {
                                            const eventsList = data['events'];
                                            for (let i = 0; i < eventsList.length; i++) {
                                                set(ref(db, "events/" + eventsList[i]), null);
                                            }
                                        }

                                        deleteObject(storageRef(storage, "profile_pics/" + userID));

                                    })
                                    .finally(() => {
                                        set(ref(db, "users/" + userID), null)
                                            .finally(() => {
                                                deleteUser(getAuth().currentUser);
                                            })
                                    });
                            }
                        }
                    ])
                }
            }
        ]);
    }

    const getAccountData = () => {
    }

    return (
        <View style={ styles.container }>

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title="Zastajenja" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "hidden" }} contentContainerStyle={{ width: "100%", paddingBottom: "10%", }}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >

                <WarnButton style={ styles.linkButton } title={"Sy zmylk namakał?"} sub={"Přizjeł tutón nam prošu!"} />

                    {/* AUTH - Title */}
                <Text style={ styles.title }>Konto</Text>
                <Text style={ styles.text }>Twoja id: <Text onPress={ copyIDToClipboard } style={{ fontFamily: "Inconsolata_Black" }}>{userID}</Text></Text>

                <InteractionButton style={ styles.linkButton } title={"Chceš so z twojeho konta wotzjewić?"} press={ logoutAccount } />
                <InteractionButton style={ styles.linkButton } title={"Chceš twój konto wotstronić?"} press={ deleteAccount } />
                <InteractionButton style={ styles.linkButton } title={"Kontowe informacije sej pósłać dać?"} press={ getAccountData } />

                    {/* VERIFY - Title */}
                <Text style={ styles.title }>Werifikacija</Text>

                <Text style={ styles.text }>Zo móžeš twój konto werifikować, dyrbiš slědowace kriterie spjelnić:</Text>
                <Text style={[ styles.text, { fontSize: 15 } ]}>
                    &#8226;staroba wot 18 lět{"\n"}
                    &#8226;maš wosebity poćah ke kostrjanc abo spejliš wosebity status w towaršnosći{"\n"}
                    &#8226;wužiješ kostrjanc regularnje a wobkedźbuješ regule za wužiwanje{"\n"}
                    &#8226;dźeržiš so na moralne normy a akceptuješ prawa a regule w a zwonka kostrjanc{"\n"}
                    &#8226;akceptuješ w a zwonka kostrjanc kóždeho sobučłowjeka
                </Text>
                <Text style={ styles.text }>Jeli trěbne dypki spjeliš, požadaj so jednorje přez...</Text>
                <LinkButton style={ styles.linkButton } title={"...online formular"} link="http://verify.kostrjanc.de/" />
                <CallButton style={ styles.linkButton } title={"...abo ty zazłoniš direktnje"} link={"tel://01794361854"} />

                    {/* LINKS - Title */}
                <Text style={ styles.title }>Pomocne linki</Text>

                <LinkButton style={ styles.linkButton } title={"Wopytaj tola raz kostrjanc.de, našu stronu w interneće!"} link="https://kostrjanc.de" />
                <LinkButton style={ styles.linkButton } title={"Maš prašenja?\nPotom wopytaj kostrjanc.de a woprašej so nas!"} link="https://kostrjanc.de/pomoc/index.html?return=index" />
                <LinkButton style={ styles.linkButton } title={"Sy zmylk namakał, potom přizjeł so prošu pola nas!"} link="https://kostrjanc.de/pomoc/bugs.html?return=index" />
                <LinkButton style={ styles.linkButton } title={"Chceš na kostrjanc wabić?\nPřizjeł so pod linkom!"} link="https://kostrjanc.de/pomoc/wabenje.html?return=index" />
                <LinkButton style={ styles.linkButton } title={"Sy admin abo moderator?\nPotom wužiwaj dashboard we syći!"} link="https://dashboard.kostrjanc.de/" />


                <View style={ styles.impressumContainer }>
                        {/* IMPRESUM - Title */}
                    <Text style={ styles.title }>Impresum</Text>

                    <Text style={[ styles.text, { fontFamily: "Inconsolata_Black" } ]}>Podaća po §5 TMG</Text>
                    <Text style={ styles.text }>
                        Cyril Mark {"\n"}
                        Łusč 1e {"\n"}
                        02699 Bóšicy {"\n"}{"\n"}
                        Korla Baier {"\n"}
                        Srjedźny puć 12 {"\n"}
                        01920 Pančicy Kukow 
                        </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Ideja a přesadźenje: {"\n"}</Text>
                        Mark, Cyril; {"\n"}
                        Baier, Korla
                    </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Kontakt: {"\n"}</Text>
                        Telefon: +49 179 4361854 {"\n"}
                        E-Mail: info@kostrjanc.de
                        Internet: kostrjanc.de
                    </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Rukowanja za wobsah: {"\n"}</Text>
                        <Text style={{ fontSize: 15 }}>
                            "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
                            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                            Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
                            fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
                            Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                            Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen."</Text>
                    </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Rukowanja za linki: {"\n"}</Text>
                        <Text style={{ fontSize: 15 }}>
                            "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
                            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
                            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen."
                        </Text>
                    </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Škit datow: {"\n"}</Text>
                        <Text style={{ fontSize: 15 }}>
                            "Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich.
                            Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden,
                            erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
                            Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann.
                            Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung
                            von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen.
                            Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen,
                            etwa durch Spam-Mails, vor."
                        </Text>
                    </Text>
                    {/* <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Google Analytics: {"\n"}</Text>
                        <Text style={{ fontSize: 15 }}>
                            "Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. ('Google'). Google Analytics verwendet sog. 'Cookies',
                            Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht.
                            Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer IP-Adresse) wird an einen
                            Server von Google in den USA übertragen und dort gespeichert. Google wird diese Informationen benutzen,
                            um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten für die Websitebetreiber zusammenzustellen
                            und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen.
                            Auch wird Google diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte
                            diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen.
                            Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin,
                            dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können.
                            Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google
                            in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden."
                        </Text>
                    </Text> */}
                    

                </View>

                <View style={ styles.footerContainer } >
                    <Text style={ styles.footerText }>wersija {require('../app.json').expo.version}</Text>
                    <Text style={ styles.footerText }>Produced by Mark, Cyril; Baier, Korla</Text>
                    <Text style={ styles.footerText }>© 2022 most rights reserved</Text>
                </View>


            </ScrollView>

        </View>
    )
}

export const LinkButton = (props) => {

    const openLink = (link) => {
        openURL(link);
    }

    return (
        <View style={ props.style }>
            <Pressable style={ styles_link.linkContainer } onPress={ () => openLink(props.link) } >
                <Text style={ styles_link.titleText }>{props.title}</Text>
                <Pressable style={ styles_link.linkBtn } onPress={ () => openLink(props.link) } >
                    <SVG_Return style={ [styles_link.linkBtnIcon, { transform: [{ rotate: "180deg" }] } ]} fill={"#5884B0"} />
                </Pressable>
            </Pressable>
        </View>
    )
}

export const CallButton = (props) => {

    const openLink = (link) => {
        openURL(link);
    }

    return (
        <View style={ props.style }>
            <Pressable style={ styles_link.linkContainer } onPress={ () => openLink(props.link) } >
                <Text style={ styles_link.titleText }>{props.title}</Text>
                <Pressable style={ styles_link.linkBtn } onPress={ () => openLink(props.link) } >
                    <SVG_Telefon style={ styles_link.linkBtnIcon } fill={"#5884B0"} />
                </Pressable>
            </Pressable>
        </View>
    )
}

const InteractionButton = (props) => {

    return (
        <View style={ props.style }>
            <Pressable style={ styles_link.linkContainer } onPress={ props.press } >
                <Text style={ styles_link.titleText }>{props.title}</Text>
                <Pressable style={ styles_link.linkBtn } onPress={ () => openLink(props.press) } >
                    <SVG_Return style={ [styles_link.linkBtnIcon, { transform: [{ rotate: "180deg" }] } ]} fill={"#5884B0"} />
                </Pressable>
            </Pressable>
        </View>
    )
}

const WarnButton = (props) => {

    return (
        <View style={ props.style }>
            <Pressable style={ styles_warn.warnContainer } onPress={ props.press } >
                <View style={ styles_warn.warnTextContainer }>
                    <Text style={ styles_warn.warnTitleText }>{props.title}</Text>
                    <Text style={ styles_warn.warnSubText }>{props.sub}</Text>
                </View>
                <Pressable style={ styles_warn.warnBtn } onPress={ () => openLink(props.press) } >
                    <SVG_Return style={ [styles_warn.warnBtnIcon, { transform: [{ rotate: "180deg" }] } ]} fill={"#143C63"} />
                </Pressable>
            </Pressable>
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
        elevation: 10
    },

    backHeader: {
        position: "absolute",
        width: "100%",
        height: "10%",
        top: 10,

        alignSelf: "center",

        zIndex: 99
    },

    title: {
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        color: "#B06E6A",
        marginVertical: 10
    },
    text: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        color: "#143C63",
        marginVertical: 10,
    },

    linkButton: {
        width: "100%",
        marginVertical: 10
    },

    impressumContainer: {
        width: "100%",
    },

    footerContainer: {
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 25,
        alignItems: "flex-end"
    },
    footerText: {
        color: "#143C63",
        fontFamily: "Inconsolata_Light",
        fontSize: 15
    },
});


const styles_link = StyleSheet.create({
    linkContainer: {
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 25,
        
        borderRadius: 25,
        backgroundColor: "#143C63",
        flexDirection: "row",
        alignItems: "center"
    },
    linkBtn: {
        flex: .1,
        alignItems: "center",
        justifyContent: "center",
    },
    linkBtnIcon: {
        width: "100%",
        aspectRatio: 1,
        
    },
    titleText: {
        flex: .9,
        color: "#5884B0",
        textAlign: "left",
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
    },
});

const styles_warn = StyleSheet.create({
    warnContainer: {
        width: "100%",
        padding: 25,
        
        borderRadius: 15,
        backgroundColor: "#B06E6A",
        flexDirection: "row",
        alignItems: "center"
    },
    warnBtn: {
        flex: .1,
        alignItems: "center",
        justifyContent: "center",
    },
    warnBtnIcon: {
        width: "100%",
        aspectRatio: 1,
        
    },
    warnTextContainer: {
        flex: .9,
    },
    warnTitleText: {
        color: "#143C63",
        textAlign: "left",
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        marginBottom: 10
    },
    warnSubText: {
        color: "#143C63",
        textAlign: "left",
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
    }
});