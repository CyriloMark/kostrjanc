import React from 'react'

import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';

import BackHeader from './statics/BackHeader';

import { openURL } from 'expo-linking'

import SVG_Return from '../assets/svg/Return';

export default function Settings({ navigation }) {

    

    return (
        <View style={ styles.container }>

            <BackHeader style={[ styles.backHeader, styles.shadow ]} title="Zastajenja" onPress={ () => navigation.goBack() } />

            <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "hidden" }} contentContainerStyle={{ width: "100%", paddingBottom: "10%", }}
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >

                    {/* Title */}
                <Text style={ styles.title }>Pomocne linki</Text>

                <LinkButton style={ styles.linkButton } title={"Wopytaj tola raz kostrjanc.de, našu stronu w interneće!"} link="https://kostrjanc.de" />
                <LinkButton style={ styles.linkButton } title={"Maš prašenja?\nPotom wopytaj kostrjanc.de a woprašej so nas!"} link="https://help.kostrjanc.de" />
                <LinkButton style={ styles.linkButton } title={"Sy zmylk namakał, potom přizjeł so prošu pola nas!"} link="https://bugreport.kostrjanc.de" />
                <LinkButton style={ styles.linkButton } title={"Chceš na kostrjanc wabić?\nPřizjeł so pod linkom!"} link="https://buisness.kostrjanc.de" />
                <LinkButton style={ styles.linkButton } title={"Sy admin abo moderator?\nPotom wužiwaj dashboard we syći!"} link="http://dashboard.kostrjanc.de/" />


                <View style={ styles.impressumContainer }>
                        {/* Title */}
                    <Text style={ styles.title }>Impresum</Text>

                    <Text style={[ styles.text, { fontFamily: "Inconsolata_Black" } ]}>Podaća po §5 TMG</Text>
                    <Text style={ styles.text }>
                        Cyril Mark {"\n"}
                        Łusč 1e {"\n"}
                        02699 Bóšicy {"\n"}{"\n"}
                        Korla Baier {"\n"}
                        Musterweg {"\n"}
                        12345 Musterstadt 
                        </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Předsedźerjo: {"\n"}</Text>
                        Mark, Cyril; {"\n"}
                        Baier, Korla
                    </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Kontakt: {"\n"}</Text>
                        Telefon: 110 {"\n"}
                        Fax: hab keins ruf mich an {"\n"}
                        E-Mail: max@muster.de
                    </Text>
                    <Text style={ styles.text }>
                        <Text style={{ fontFamily: "Inconsolata_Black" }}>Dohladowarstwo: {"\n"}</Text>
                        Dohladowarstwo Budyšin
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
                    <Text style={ styles.text }>
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
                    </Text>
                    

                </View>

            </ScrollView>

        </View>
    )
}

const LinkButton = (props) => {

    const openLink = (link) => {
        openURL(link);
    }

    return (
        <View style={ props.style }>
            <Pressable style={ styles_link.linkContainer } onPress={ () => openLink(props.link) } >
                <Text style={ styles_link.titleText }>{props.title}</Text>
                <Pressable style={ styles_link.linkBtn } onPress={ () => openLink(props.link) } >
                    <SVG_Return style={ styles_link.linkBtnIcon } fill={"#5884B0"} />
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
    }
});


const styles_link = {
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
        transform: [{ rotate: "180deg" }]
    },
    titleText: {
        flex: .9,
        color: "#5884B0",
        textAlign: "left",
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
    },
}