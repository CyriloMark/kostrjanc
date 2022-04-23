import React, { useState, useRef } from 'react'

import { View, StyleSheet, Platform, KeyboardAvoidingView, Modal, Pressable, ScrollView, TextInput, Text} from 'react-native';

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
            reason: reportData.reason
        }).finally(() => {
            props.close()
        })
        .catch((error) => console.log("error", error.code))
    }

    return (
        <Modal presentationStyle={ Platform.OS === 'ios' ? 'formSheet' : 'overFullScreen' } transparent={ Platform.OS === 'android' } onRequestClose={ props.close } animationType="slide" statusBarTranslucent visible={props.visible} >
            <KeyboardAvoidingView behavior='padding' enabled style={ Platform.OS === 'ios' ? styles.modalScreenContainerIOS : styles.modalScreenContainerAndroid }>

                    {/* DragHandle */}
                <Pressable style={ styles.modalDragHandleContainer } onPress={ props.close } >
                    <Pressable style={ styles.modalDragHandle } onPress={ props.close } />
                </Pressable>

                <ScrollView ref={reportScroll} style={ styles.modalScrollViewContainer } scrollEnabled={true} bounces={false} >

                    <Text style={styles.title}>Přizjewjenje za {props.type === 0 ? "post" : "ewent"} z id: {props.id}</Text>

                        {/* Reason */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput style={ styles.modalInput } keyboardType="default" autoCapitalize='sentences' maxLength={128}
                            placeholder="Přićina za přizjewjenje" autoComplete={ false } textContentType="none" keyboardAppearance='dark' value={reportData.reason}
                            multiline={ true } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setReportData({...reportData, reason: value}) }
                            />
                    </View>

                    {
                        reporting ? <Text style={styles.hint}>Sy hižo problem přizjewił!</Text> : null
                    }

                        {/* Submit */}
                    <Pressable style={ styles.modalSubmitBtn } onPress={ report } >
                        <Text style={ styles.modalSubmitBtnText }>Wotpósłać</Text>
                    </Pressable>

                </ScrollView>

            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalScreenContainerIOS: {
        width: "100%",
        flex: 1,
        backgroundColor: "#5884B0",
    },
    modalScreenContainerAndroid: {
        width: "100%",
        height: "90%",
        top: "10%",
        backgroundColor: "#5884B0",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,

        elevation: 10
    },
    modalDragHandleContainer: {
        height: "5%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    modalDragHandle: {
        flex: .2,
        width: "40%",
        borderRadius: 25,
        backgroundColor: "#143C63"
    },

    modalScrollViewContainer: {
        width: "100%",
        paddingVertical: 25,
    },

    hint: {
        width: "80%",
        marginTop: 25,
        alignSelf: "center",
        textAlign: "center",

        color: "#143C63",
        fontFamily: "Inconsolata_Black",
        fontSize: 15,
    },

    title: {
        width: "80%",
        marginVertical: 10,
        alignSelf: "center",
        textAlign: "center",

        color: "#143C63",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },

    modalInputContainer: {
        width: "100%",
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    modalInput: {
        width: "80%",
        color: "#5884B0",

        padding: 25,

        fontFamily: "Inconsolata_Regular",
        fontSize: 25,

        backgroundColor: "#143C63",
        borderRadius: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },

    modalSubmitBtn: {
        marginVertical: 25,
        width: "80%",

        backgroundColor: "#B06E6A",
        borderRadius: 15,

        padding: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,

        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    modalSubmitBtnText: {
        color: "rgba(0, 0, 0, .5)",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },

});
