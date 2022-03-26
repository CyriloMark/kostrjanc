import React, { useState, useEffect, useRef } from 'react'

import { View, StyleSheet, Text, Pressable, Modal, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import AppHeader from '../statics/AppHeader';

export default function AuthPage() {

    const loginScrollViewRef = useRef();
    const registerScrollViewRef = useRef();

    const [loginScreenVisibility, setLoginScreenVisibility] = useState(false);
    const [registerScreenVisibility, setRegisterScreenVisibility] = useState(false);

    const [account, setAccount,] = useState({ email: "", password: "" });

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, account.email, account.password)
            .then((userCredential) => {
                console.log(userCredential.user.email);
            })
            .catch((error) => {
                console.log(error.code);
            }
        );
    }

    return (

        <SafeAreaView style={ styles.container }>

                {/* Login */}
            <Modal presentationStyle={ Platform.OS === 'ios' ? 'formSheet' : 'overFullScreen' } transparent={ Platform.OS === 'android' } onRequestClose={ () => setLoginScreenVisibility(false) } animationType="slide" statusBarTranslucent visible={loginScreenVisibility} >
                <KeyboardAvoidingView behavior='padding' enabled style={ Platform.OS === 'ios' ? styles.modalScreenContainerIOS : styles.modalScreenContainerAndroid }>
                
                        {/* DragHandle */}
                    <Pressable style={ styles.modalDragHandleContainer } onPress={ () => setLoginScreenVisibility(false) } >
                        <Pressable style={ styles.modalDragHandle } onPress={ () => setLoginScreenVisibility(false) } />
                    </Pressable>
                    
                    <View style={ styles.modalBodyContainer }>
                        <ScrollView ref={loginScrollViewRef} style={ styles.modalScrollViewContainer } scrollEnabled={true} bounces={false} >
                            
                                {/* Email */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } keyboardType="email-address" autoCapitalize='none' maxLength={64}
                                    placeholder="E-Mail" autoComplete={ false } textContentType="emailAddress" keyboardAppearance='dark'
                                    multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"}
                                    onChangeText={ (value) => setAccount({ email: value, password: account.password }) }
                                />
                            </View>

                                {/* Password */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } autoCapitalize='none' maxLength={64}
                                    placeholder="Hesło" autoComplete={ false } textContentType="password" keyboardAppearance='dark'
                                    multiline={ false } blurOnSubmit={ true } secureTextEntry editable={ true } placeholderTextColor={"#5884B0"}
                                    onChangeText={ (value) => setAccount({ email: account.email, password: value }) }
                                />
                            </View>

                                {/* Submit */}
                            <View style={ styles.modalSubmitBtnContainer }>
                                <Pressable style={ styles.modalSubmitBtn } onPress={ login } >
                                    <Text style={ styles.modalSubmitBtnText }>Zalogować</Text>
                                </Pressable>
                            </View>

                        </ScrollView>
                    </View>

                </KeyboardAvoidingView>
            </Modal>

            <Modal presentationStyle={ Platform.OS === 'ios' ? 'formSheet' : 'overFullScreen' } transparent={ Platform.OS === 'android' } onRequestClose={ () => setRegisterScreenVisibility(false) } animationType="slide" statusBarTranslucent visible={registerScreenVisibility} >
                <KeyboardAvoidingView behavior='padding' enabled style={ Platform.OS === 'ios' ? styles.modalScreenContainerIOS : styles.modalScreenContainerAndroid } >
                
                        {/* DragHandle */}
                    <Pressable style={ styles.modalDragHandleContainer } onPress={ () => setRegisterScreenVisibility(false) } >
                        <Pressable style={ styles.modalDragHandle } onPress={ () => setRegisterScreenVisibility(false) } />
                    </Pressable>

                    <View style={ styles.modalBodyContainer }>
                        <ScrollView ref={registerScrollViewRef} style={ styles.modalScrollViewContainer } scrollEnabled={true} bounces={false} >

                                {/* Email */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } keyboardType="default" autoCapitalize='none' maxLength={32}
                                    placeholder="Mjeno" autoComplete={ false } textContentType="name" keyboardAppearance='dark'
                                    multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"}
                                />
                            </View>

                                {/* Email */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } keyboardType="email-address" autoCapitalize='none' maxLength={64}
                                    placeholder="E-Mail" autoComplete={ false } textContentType="emailAddress" keyboardAppearance='dark'
                                    multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"}
                                />
                            </View>

                                {/* Password */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } autoCapitalize='none' maxLength={128}
                                    placeholder="Hesło" autoComplete={ false } textContentType="password" keyboardAppearance='dark'
                                    multiline={ false } blurOnSubmit={ true } secureTextEntry editable={ true } placeholderTextColor={"#5884B0"}
                                />
                            </View>

                                {/* Confirm password */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } autoCapitalize='none' maxLength={128}
                                    placeholder="Hesło wospjetować" autoComplete={ false } textContentType="password" keyboardAppearance='dark'
                                    multiline={ false } blurOnSubmit={ true } secureTextEntry editable={ true } placeholderTextColor={"#5884B0"}
                                />
                            </View>

                                {/* Submit */}
                            <View style={ styles.modalSubmitBtnContainer }>
                                <View style={ styles.modalSubmitBtn }>
                                    <Text style={ styles.modalSubmitBtnText }>Registrować</Text>
                                </View>
                            </View>

                        </ScrollView>
                    </View>

                </KeyboardAvoidingView>
            </Modal>

            <AppHeader style={ styles.header } />

                {/* Body */}
            <View style={ styles.bodyContainer }>

                    {/* Title */}
                <View style={ styles.titleContainer }>
                    <Text style={ styles.titleText }>Zaloguj so</Text>
                </View>

                    {/* Buttons */}
                <View style={ styles.btnsContainer }>
                    <Pressable style={ styles.btnContainer } onPress={ () => setLoginScreenVisibility(true) }>
                        <Text style={ styles.btnText } >Zalogować</Text>
                    </Pressable>
                    <Pressable style={ styles.btnContainer } onPress={ () => setRegisterScreenVisibility(true) } >
                        <Text style={ styles.btnText } >Registrować</Text>
                    </Pressable>
                </View>

            </View>

                {/* Footer */}
            <View style={ styles.footerContainer }>
                <Text style={ styles.footerText }>© 2022 most rights reserved Produced by Mark, Cyril; Baier, Korla</Text>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#5884B0",
        alignItems: "center",
        padding: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10
    },

    header: {
        width: "100%",
        height: "10%",
    },

    bodyContainer: {
        width: "100%",
        flex: 1,
        backgroundColor: "#5884B0",
        flexDirection: "column",
        alignItems: "center"
    },

    titleContainer: {
        flex: .3,
        justifyContent: "center",
        alignItems: "center",
    },
    titleText: {
        fontFamily: "Inconsolata_Black",
        color: "#143C63",
        fontSize: 50,
    },


    btnsContainer: {
        flex: .7,
        width: "100%",
        flexDirection: "column",
        alignItems: "center"
    },
    btnContainer: {
        flex: .2,
        width: "80%",
        backgroundColor: "#143C63",
        borderRadius: 15,
        marginBottom: "10%",

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    btnText: {
        color: "#5884B0",
        fontFamily: "Inconsolata_Black",
        fontSize: 25
    },

    footerContainer: {
        position: "absolute",
        width: "100%",
        bottom: "5%",
        alignItems: "center"
    },
    footerText: {
        color: "#143C63",
        fontFamily: "Inconsolata_Light",
        fontSize: 10
    },

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
        flex: .05,
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

    modalBodyContainer: {
        width: "100%",
        flex: .9,
        paddingHorizontal: 10
    },
    modalScrollViewContainer: {
        width: "100%",
        paddingVertical: "10%",
    },

    modalInputContainer: {
        width: "100%",
        marginVertical: "2%",
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

    modalSubmitBtnContainer: {
        width: "100%",
        marginVertical: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalSubmitBtn: {
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
    },
    modalSubmitBtnText: {
        color: "rgba(0, 0, 0, .5)",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    }
});
