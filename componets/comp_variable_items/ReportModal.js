import React, { useState, useRef } from 'react'

import { View, StyleSheet, Platform, KeyboardAvoidingView, Pressable, ScrollView, TextInput, Text} from 'react-native';

import Modal from './Modal';

import { getDatabase, set, ref } from 'firebase/database';

let reporting = false;
export default function ReportModal(props) {

    const reportScroll = useRef();

    const [reportData, setReportData] = useState({
        reason: "",
        id: props.id,
    });

    const report = () => {
        if (reporting) return;
        reporting = true;

        const db = getDatabase();
        set(ref(db, "reports/" + Date.now()), {
            id: reportData.id,
            reason: reportData.reason,
            type: props.type
        }).finally(() => {
            reporting = false;
            props.close();
        })
        .catch((error) => console.log("error", error.code))
    }

    return (
        <Modal onRequestClose={ props.close } visible={props.visible} content={
            <View style={{ width: "100%" }}>   
                <Text style={styles.title}>Přizjewjenje za {props.type === 0 ? "post" : props.type === 1 ? "ewent" : "wužiwarja" } z id: {props.id}</Text>

                <View style={ styles.modalInputContainer }>
                    <TextInput
                        style={ styles.modalInput } placeholder="Přićina za přizjewjenje" maxLength={128}
                        multiline placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                        keyboardType="default" keyboardAppearance='dark' value={reportData.reason}
                        autoCapitalize='sentences' autoComplete={ false } textContentType="none" 
                        editable onChangeText={ (value) => setReportData({...reportData, reason: value}) }
                        />
                </View>

                {
                    reporting ? <Text style={styles.hint}>Sy hižo problem přizjewił!</Text> : null
                }

                <Pressable style={ styles.modalSubmitBtn } onPress={ report } >
                    <Text style={ styles.modalSubmitBtnText }>Wotpósłać</Text>
                </Pressable>
            </View>
        } />
    )
}

const styles = StyleSheet.create({
    hint: {
        width: "100%",
        marginBottom: 10,
        alignSelf: "center",
        textAlign: "center",

        color: "#143C63",
        fontFamily: "Barlow_Regular",
        fontSize: 20,
    },

    title: {
        width: "100%",
        alignSelf: "center",
        textAlign: "center",

        color: "#5884B0",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },

    modalInputContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalInput: {
        width: "100%",
        paddingHorizontal: 25 ,
        paddingVertical: 10,
        marginVertical: 10,

        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",

        textAlignVertical: "center",

        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",
    },

    modalSubmitBtn: {
        width: "60%",

        backgroundColor: "#B06E6A",
        borderRadius: 15,

        paddingHorizontal: 25,
        paddingVertical: 25,
        marginBottom: 10,

        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    modalSubmitBtnText: {
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#000000",
    },

});
