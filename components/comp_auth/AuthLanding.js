import React, { useState, useEffect, useRef } from 'react'

import { View, StyleSheet, Text, Pressable, Modal as M, ScrollView, TextInput, KeyboardAvoidingView, Image } from 'react-native';

import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

import Modal from '../comp_variable_items/Modal';

import AppHeader from '../comp_static_items/AppHeader';

export const getErrorMsg = (error) => {
    let msg = "";
    switch (error) {
        case "auth/already-initialized":
            msg = "Sy hižo přizjewjeny! Startuj aplikaciju znowa!";
            break;
        case "auth/credential-already-in-use":
            msg = "Twoje daty so hižo za druhi konto wužija!";
            break;
        case "auth/email-already-in-use":
            msg = "Twoja email so hižo za druhi konto wužija!";
            break;
        case "auth/internal-error":
            msg = "Zmylk wot serwera!";
            break;
        case "auth/invalid-user-token":
            msg = "Wužiwarja njedawa!";
            break;
        case "auth/invalid-email":
            msg = "Zapodata email njeeksistuje!";
            break;
        case "auth/wrong-password":
            msg = "Twoje zapodate daty so wopak!";
            break;
        case "auth/unverified-email":
            msg = "Twoja email njeje hišće werifikowana!";
            break;
        case "auth/user-not-found":
            msg = "Zapodateho wužiwarja njedawa!";
            break;
        case "auth/user-disabled":
            msg = "Zapodaty wužiwar nima přistup na kostrjanc!";
            break;
        case "auth/already-initialized":
            msg = "Aplikacija je hižo aktiwna. Startuj aplikaciju znowa!";
            break;
        case "auth/missing-email":
            msg = "Zapodaj jednu email!";
            break;
        default:
            break;
    }
    return msg;
}

let reseted = false;
export default function AuthLanding({ navigation }) {

    const savePasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    const loginScrollViewRef = useRef();

    const [errorText, setErrorText] = useState("");

    const [loginScreenVisibility, setLoginScreenVisibility] = useState(false);
    const [registerScreenVisibility, setRegisterScreenVisibility] = useState(false);
    const [resetScreenVisibility, setResetScreenVisibility] = useState(false);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [resetEmail, setResetEmail] = useState("");

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then((userCredential) => {
                console.log(userCredential.user.email);
            })
            .catch((error) => {
                setErrorText(getErrorMsg(error.code))
                console.log(error.code);
            }
        );
    }

    const register = () => {
        if (registerData.password !== registerData.confirmPassword) {
            setErrorText("Twoje hesła njeju identiske!")
            return;
        }
        if (!registerData.password.match(savePasswordRegex)){
            setErrorText("Twoje hesło je pře słabe!")
            return;
        }

        setRegisterScreenVisibility(false);
        navigation.navigate('AuthUserRegister', {registerData: registerData});
    }

    const reset = () => {
        if (reseted) {
            setErrorText("Sy hižo raz hesło wróčo sadźił!")
            return;
        }
        reseted = true;
        const auth = getAuth();
        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                setErrorText("Email je so wotpósława!")
            })
            .catch(error => {
                setErrorText(getErrorMsg(error.code))
                console.log("error auth reset", error.code)
            })
    }

    return (
        <View style={ styles.container }>

                {/* Login */}
            <Modal onRequestClose={ () => setLoginScreenVisibility(false) } visible={loginScreenVisibility} content={
                <ScrollView ref={loginScrollViewRef} style={{width: "100%"}} scrollEnabled bounces >

                    <Text style={styles.modalTitle}>Zaloguj so</Text>

                        {/* Email */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="E-Mail" maxLength={64}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="email-address" keyboardAppearance='dark' value={loginData.email}
                            autoCapitalize='none' autoComplete="email" textContentType="emailAddress"
                            editable onChangeText={ (value) => setLoginData({
                                ...loginData,
                                email: value
                            }) } />
                    </View>
                    
                        {/* Password */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="Hesło" maxLength={64}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="default" keyboardAppearance='dark' value={loginData.password}
                            autoCapitalize='none' autoComplete="password" textContentType="password" secureTextEntry
                            editable onChangeText={ (value) => setLoginData({
                                ...loginData,
                                password: value
                            }) } />
                    </View>

                        {/* Submit */}
                    <Pressable style={ styles.modalSubmitBtn } onPress={ login } >
                        <Text style={ styles.modalSubmitBtnText }>Zalogować</Text>
                    </Pressable>

                        {/* Error */}
                    <Text style={ styles.errorText }>{errorText}</Text>

                </ScrollView>
            } />

                {/* Register */}
            <Modal onRequestClose={ () => setRegisterScreenVisibility(false) } visible={registerScreenVisibility} content={
                <ScrollView ref={loginScrollViewRef} style={{width: "100%"}} scrollEnabled bounces >

                    <Text style={styles.modalTitle}>Registruj so</Text>

                        {/* Name */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="Mjeno" maxLength={32}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="default" keyboardAppearance='dark' value={registerData.name}
                            autoCapitalize='none' autoComplete="username" textContentType="username"
                            editable onChangeText={ (value) => setRegisterData({
                                ...registerData,
                                name: value,
                            }) } />
                    </View>

                        {/* Email */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="E-Mail" maxLength={64}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="email-address" keyboardAppearance='dark' value={registerData.email}
                            autoCapitalize='none' autoComplete="email" textContentType="emailAddress"
                            editable onChangeText={ (value) => setRegisterData({
                                ...registerData,
                                email: value,
                            }) } />
                    </View>
                    
                        {/* Password */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="Hesło" maxLength={64}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="default" keyboardAppearance='dark' value={registerData.password}
                            autoCapitalize='none' autoComplete="password" textContentType="password" secureTextEntry
                            editable onChangeText={ (value) => setRegisterData({
                                ...registerData,
                                password: value,
                            }) } />
                    </View>

                        {/* Confirm Password */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="Hesło wopodstatnić" maxLength={64}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="default" keyboardAppearance='dark' value={registerData.confirmPassword}
                            autoCapitalize='none' autoComplete="password" textContentType="password" secureTextEntry
                            editable onChangeText={ (value) => setRegisterData({
                                ...registerData,
                                confirmPassword: value,
                            }) } />
                    </View>

                    <Text style={ styles.warnText }>Kedźbuj, zo wšitke daty prawje zapodaš, hewak maš wjac dźěła!</Text>

                        {/* Submit */}
                    <Pressable style={ styles.modalSubmitBtn } onPress={ register } >
                        <Text style={ styles.modalSubmitBtnText }>Registrować</Text>
                    </Pressable>

                        {/* Error */}
                    <Text style={ styles.errorText }>{errorText}</Text>

                </ScrollView>
            } />

                {/* Reset */}
            <Modal onRequestClose={ () => setResetScreenVisibility(false) } visible={resetScreenVisibility} content={
                <ScrollView ref={loginScrollViewRef} style={{width: "100%"}} scrollEnabled bounces >

                    <Text style={styles.modalTitle}>Email za změnjenje hesła pósłać</Text>

                        {/* Email */}
                    <View style={ styles.modalInputContainer }>
                        <TextInput
                            style={ styles.modalInput } placeholder="E-Mail" maxLength={64}
                            multiline={ false } numberOfLines={1} placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="email-address" keyboardAppearance='dark' value={loginData.email}
                            autoCapitalize='none' autoComplete="email" textContentType="emailAddress"
                            editable onChangeText={ (value) => setResetEmail(value) } />
                    </View>

                        {/* Submit */}
                    <Pressable style={ styles.modalSubmitBtn } onPress={ reset } >
                        <Text style={ styles.modalSubmitBtnText }>Hesło změnić</Text>
                    </Pressable>

                        {/* Error */}
                    <Text style={ styles.errorText }>{errorText}</Text>

                </ScrollView>
            } />

            <AppHeader style={styles.header} />

            <ScrollView style={ styles.contentContainer } contentContainerStyle={[ styles.contentInnerContainer, { marginVertical: -5 } ]} showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} bounces={false}>

                    {/* Logo */}
                <View style={ styles.iconContainer }>
                    <Image source={require('../../assets/app-system-icons/icon.png')} style={ styles.icon } resizeMode="contain" />
                </View>

                    {/* Title */}
                <View style={ styles.titleContainer }>
                    <Text style={ styles.titleText }>Zaloguj so, abo wutwor nowy konto na kostrjanc</Text>
                </View>

                    {/* Buttons */}
                <View style={ styles.buttonsContainer }>

                    <Pressable style={ styles.buttonContainer } onPress={ () => setLoginScreenVisibility(true) }>
                        <Text style={ styles.buttonText } >Zalogować</Text>
                    </Pressable>
                    
                    <Pressable style={ styles.buttonContainer } onPress={ () => setRegisterScreenVisibility(true) } >
                        <Text style={ styles.buttonText } >Registrować</Text>
                    </Pressable>

                    <Pressable style={ styles.buttonContainer } onPress={ () => setResetScreenVisibility(true) } >
                        <Text style={ styles.buttonText } >Hesło zabył</Text>
                    </Pressable>

                </View>


            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
    },

    contentContainer: {
        flex: .8,
        width: "100%",
        paddingVertical: 5,
        borderRadius: 25,
    },
    contentInnerContainer: {
        paddingHorizontal: 10,
        backgroundColor: "#000",
        flex: 1,

        justifyContent: "center",
        alignItems: "center"
    },
    
    header: {
        flex: .08,
        width: "100%",
    
        alignSelf: "center",
    
        zIndex: 99
    },

    iconContainer: {
        width: "40%",
        aspectRatio: 1,
        marginVertical: 25,
    
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: "100%",
        height: "100%"
    },

    titleContainer: {
        width: "80%",
    },
    titleText: {
        fontFamily: "Barlow_Bold",
        color: "#5884B0",
        fontSize: 25,
        textAlign: "center"
    },

    buttonsContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        marginVertical: 25
    },
    buttonContainer: {
        width: "100%",

        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#143C63",

        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5
    },
    buttonText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
    },

    modalTitle: {
        width: "100%",
        alignSelf: "center",
        textAlign: "center",

        color: "#5884B0",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        marginBottom: 15
    },
    modalInputContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    modalInput: {
        width: "100%",
        paddingHorizontal: 25 ,
        paddingVertical: 10,

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
        marginTop: 25,

        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    modalSubmitBtnText: {
        fontFamily: "Barlow_Bold",
        fontSize: 20,
        color: "#000000",
    },
    warnText: {
        color: "#143C63",
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        textAlign: "center",
    },
    errorText: {
        color: "#B06E6A",
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        textAlign: "center",
        marginVertical: 25,
        width: "80%",
        alignSelf: "center"
    }
});

const styles2 = StyleSheet.create({
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

        fontFamily: "Barlow_Regular",
        fontSize: 25,

        backgroundColor: "#143C63",
        borderRadius: 15,
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

        alignItems: "center",
        justifyContent: "center",
    },
    modalSubmitBtnText: {
        color: "rgba(0, 0, 0, .5)",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },

    warnText: {
        width: "80%",
        alignSelf: "center",
        textAlign: "center",

        marginVertical: "2%",
        
        fontFamily: "RobotoMono_Thin",
        fontSize: 15,
        color: "#143C63",
    }
});
