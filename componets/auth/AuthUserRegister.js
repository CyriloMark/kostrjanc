import React, { useState } from 'react'

import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView, Platform, Keyboard, Switch, TextInput, Pressable, Image } from "react-native";

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import * as Storage from "firebase/storage";

import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import SVG_Post from '../../assets/svg/Post';

export const ageOptions = [
    {
        id: 0,
        ageGroup: "sekudnarny schodźeń I.",
        ages: "13-15",
    },
    {
        id: 1,
        ageGroup: "sekudnarny schodźeń II.",
        ages: "16-18",
    },
    {
        id: 2,
        ageGroup: "student",
        ages: "19-23",
    },
    {
        id: 3,
        ageGroup: "młody dźěłaćer",
        ages: "24-30",
    },
    {
        id: 4,
        ageGroup: "staršej",
        ages: "31-65",
    },
    {
        id: 5,
        ageGroup: "senior",
        ages: "66+",
    },
];

const userUploadMetadata = {
    contentType: 'image/jpeg',
};  

const arraySplitter = (data , coloums) => {

    let splitter = Math.floor(data.length / coloums) + ((data.length % coloums) === 0 ? 0 : 1);
    let newData = [];
    
    for (let i = 0; i < splitter; i++) {

        let currentObject = [];
        for (let j = i * coloums; j < coloums + i * coloums; j++) {
            if (j < data.length)
                currentObject.push(data[j]);
        }
        newData.push(currentObject);
    }
    return(newData);
}

export default function AuthUserRegister({ navigation, route }) {

    const savePasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    
    const [userData, setUserData] = useState({
        gender: 0,
        description: "",
        ageGroup: 0,
        pbUri: 'https://picsum.photos/500/500'
    });
    const [pbImageUri, setPbImageUri] = useState(null);

    const {registerData} = route.params;

    const openImagePickerAsync = async () => {
        let permissionResult = await requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) return;
        
        let pickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: .5,
            aspect: [1, 1],
            allowsMultipleSelection: false,
        });
        if (pickerResult.cancelled) return;

        const croppedPicker = await manipulateAsync(
            pickerResult.uri,
            [{
                resize: {
                    width: 256,
                    height: 256
                }
            }],
            {
                compress: .5,
                format: SaveFormat.JPEG
            }
        )

        setUserData({
            ...userData,
            pbUri: croppedPicker.uri
        });
        setPbImageUri(pickerResult.uri);
    }

    const register = async () => {
        
        if (registerData.password !== registerData.confirmPassword) return;
        if (!registerData.password.match(savePasswordRegex)) return;

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError('Network request failed!'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', userData.pbUri, true);
            xhr.send(null); 
        });
        
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, registerData.email, registerData.password)
            .then((userCredential) => {

                sendEmailVerification(auth.currentUser)
                    .then((result) => console.log("email sent"))
                    .catch((error) => console.log(error.code))
                    
                uploadBytes(Storage.ref(getStorage(), 'profile_pics/' + userCredential.user.uid), blob, userUploadMetadata)
                    .then((snapshot) => {
                        getDownloadURL(Storage.ref(getStorage(), 'profile_pics/' + userCredential.user.uid))
                            .then((url) => {
                                set(ref(getDatabase(), 'users/' + userCredential.user.uid), {
                                    name: registerData.name,
                                    description: userData.description,
                                    ageGroup: userData.ageGroup,
                                    gender: userData.gender,
                                    pbUri: url,
                                    follower: [],
                                    following: [],
                                    isMod: false,
                                    isBanned: false,
                                    isAdmin: false
                                });
                            })
                            .catch((error) => console.log(error.code))
                    })
                    .catch((error) => {
                        console.log(error.code);
                    });
            })
            .catch((error) => {
                console.log(error.code);
            })
    }

    return (
        <View style={ styles.container } >
            <KeyboardAvoidingView behavior='height' enabled={ Platform.OS != 'ios' } style={{ height: "100%" }}>

                <ScrollView style={{ width: "100%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }}
                        keyboardDismissMode='on-drag' bounces={true}>
                    
                        {/* Title */}
                    <View style={ styles.titleContainer }>
                        <Text style={ styles.subText }>Witaj pola kostrjanc,</Text>
                        <Text style={ styles.titleText }>{registerData.name}!</Text>
                        <Text style={ styles.subText }>Zo bychu druhzy wědźeli, štó ty sy, směš swětej powědać, što tebje wučini!</Text>
                    </View>

                    <Text style={ styles.singleText }>Ja sym...</Text>

                        {/* Gender */}
                    <View style={[ styles.inputContainer, styles.genderContainer ]}>
                        <Text style={ styles.genderText } >hólc</Text>
                        <Switch style={ styles.switch } value={userData.gender === 0 ? false : true}
                            thumbColor={"#B06E6A"} ios_backgroundColor={"#143C63"}
                            onValueChange={ (value) => 
                                setUserData({
                                    ...userData,
                                    gender: value ? 1 : 0
                                })
                            } trackColor={{
                                false: "#143C63",
                                true: "#143C63"
                            }}/>
                        <Text style={ styles.genderText } >holca</Text>
                    </View>

                    <Text style={ styles.singleText }>...a sym...</Text>

                    <View style={ styles.inputContainer }>
                        { arraySplitter(ageOptions, 2).map((list, listKey) => 
                        <View key={listKey} style={ styles.ageGroupListContainer }>
                            { list.map((ageGroup, ageGroupKey) => 
                                <SelectableBtn key={ageGroupKey} selected={userData.ageGroup === ageGroup.id} title={ageGroup.ageGroup}
                                    subTitle={ageGroup.ages} style={ styles.ageBtn } onPress={ () => {
                                        setUserData({
                                            ...userData,
                                            ageGroup: ageGroup.id
                                        });
                                    }} />
                            ) }
                        </View>
                    ) }
                    </View>

                    <Text style={ styles.singleText }>...lět stary. Ja mam tohorunja wosebite mjezwočo. Tutón wobraz je jedyn z najwosebitych...</Text>

                    <Pressable onPress={openImagePickerAsync} style={ styles.inputContainer }>
                        {pbImageUri !== null ?
                            <Image source={{ uri: pbImageUri }} style={ styles.pbImage } resizeMode="cover" /> :

                            <View style={ styles.pbImagePlaceholder } >
                                <SVG_Post style={ styles.pbImageIcon } fill="#5884B0" />
                                <Text style={ styles.pbImageHint }>Tłoć, zo wobrazy přepytać móžeš</Text>
                            </View>
                        }
                    </Pressable>

                    <Text style={ styles.singleText }>... Na kóncu bych hišće chcył rjec, zo...</Text>

                        {/* Bio */}
                    <View style={ styles.inputContainer }>
                        <TextInput style={ styles.input } keyboardType="default" autoCapitalize='sentences' maxLength={512}
                            placeholder="Wopisaj tebje..." autoComplete={ false } keyboardAppearance='dark' value={userData.description}
                            multiline blurOnSubmit={ true } numberOfLines={5} editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setUserData({
                                ...userData,
                                description: value,
                            }) }
                            
                        />
                    </View>

                        {/* Submit */}
                    <View style={ styles.submitBtnContainer }>
                        <Pressable style={ styles.submitBtn } onPress={register}>
                            <Text style={ styles.submitBtnText }>Składować a registrować</Text>
                        </Pressable>
                    </View>

                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    )
}

export const SelectableBtn = (props) => {
    return (
        <View style={props.style}>
            <Pressable style={[stylesSB.container, { backgroundColor: !props.selected ? "#143C63" : "#B06E6A" }]} onPress={props.onPress}>
                <Text style={[ stylesSB.title, { color: !props.selected ? "#5884B0" : "#143C63" } ]}>{props.title}</Text>
                <Text style={[ stylesSB.subTitle, { color: !props.selected ? "#5884B0" : "#143C63" } ]}>{props.subTitle}</Text>
            </Pressable>
        </View>
    )
}

const stylesSB = StyleSheet.create({
    container: {
        borderRadius: 15,
        width: "100%",
        padding: 10,

        alignItems: "center"
    },
    title: {
        textAlign: "center",

        fontFamily: "Inconsolata_Black",
        fontSize: 15,
        textAlign: "center",

        marginVertical: 10
    },
    subTitle: {
        textAlign: "center",

        fontFamily: "Inconsolata_Light",
        fontSize: 25,
        textAlign: "center",

        marginVertical: 10
    }
});

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
    },

    titleContainer: {
        width: "100%",
        marginVertical: 25,
    },
    subText: {
        fontFamily: "Inconsolata_Light",
        fontSize: 25,
        color: "#143C63",
        textAlign: "center",
    },
    titleText: {
        fontFamily: "Inconsolata_Black",
        fontSize: 50,
        color: "#143C63",
        marginVertical: 25,

        textAlign: "center",
    },
    singleText: {
        fontFamily: "Inconsolata_Light",
        fontSize: 25,
        color: "#143C63",
        textAlign: "center",

        marginVertical: 10
    },

    inputContainer: {
        width: "80%",
        marginVertical: "2%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "100%",
        color: "#5884B0",

        padding: 25,
        textAlign: "left",

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

    genderContainer: {
        flexDirection: "row",
    },
    switch: {
        flex: .2,
        marginHorizontal: 10,
    },
    genderText: {
        flex: .4,
        textAlign: "center",

        fontFamily: "Inconsolata_Black",
        fontSize: 25,
        color: "#143C63"
    },

    ageGroupListContainer: {
        width: "100%",
        flexDirection: "row",
        padding: 0,
        margin: 0,
    },
    ageGroupPreview: {
        flex: 1,
        aspectRatio: .9,
        margin: "2%",
    },
    ageBtn: {
        flex: 1,
        margin: 10,
    },

    pbImage: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 500
    },
    pbImagePlaceholder: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 500,
        backgroundColor: "#143C63",

        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    pbImageIcon: {
        width: "50%",
        height: "50%"
    },
    pbImageHint: {
        width: "60%",
        alignSelf: "center",
        
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        color: "#5884B0",
        textAlign: "center",
    },
    
    submitBtnContainer: {
        width: "100%",
        marginVertical: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitBtn: {
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
    submitBtnText: {
        color: "rgba(0, 0, 0, .5)",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },
})