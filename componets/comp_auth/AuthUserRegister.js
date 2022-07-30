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
            <ScrollView style={ styles.contentContainer } contentContainerStyle={ styles.contentInnerContainer } showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} bounces >

                    {/* Intro */}
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.subText }>Witaj pola kostrjanc,</Text>
                    <Text style={ styles.titleText }>{registerData.name}!</Text>
                    <Text style={ styles.subText }>Zo bychu druhzy wědźeli, štó ty sy, směš swětej powědać, što tebje wučini!</Text>
                </View>

                    {/* Gender */}
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.subText }>Ja sym...</Text>

                    <View style={ styles.genderContainer }>
                        <Text style={ styles.genderText } >hólc</Text>

                        <Switch style={ styles.switch } value={userData.gender === 0 ? false : true}
                            thumbColor={"#B06E6A"} ios_backgroundColor={"#000000"}
                            onValueChange={ (value) => 
                                setUserData({
                                    ...userData,
                                    gender: value ? 1 : 0
                                })
                            } trackColor={{
                                false: "#000000",
                                true: "#000000"
                            }}/>

                        <Text style={ styles.genderText }>holca</Text>
                    </View>
                </View>

                    {/* Age */}
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.subText }>...a sym...</Text>
                
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

                    <Text style={ styles.subText }>...lět star{userData.gender == 0 ? "y" : "a"}.</Text>
                </View>

                    {/* Image */}
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.subText }>Ja mam tohorunja wosebite mjezwočo. Tutón wobraz je jedyn z najwosebitych.</Text>

                    <Pressable style={ styles.imgOutlineContainer } onPress={openImagePickerAsync} >
                        <View style={ styles.imgContainer } >
                            {
                                pbImageUri !== null ?
                                    <Image source={{ uri: pbImageUri }} style={ styles.img } resizeMode="cover" /> :
                                    <View style={[ styles.img, styles.imgBorder ]}>
                                        <SVG_Post style={ styles.imageHintIcon } fill="#143C63" /> 
                                        <Text style={ styles.imageHintText }>Tłoć, zo wobrazy přepytać móžeš</Text>
                                    </View>
                            }
                        </View>
                    </Pressable>
                </View>

                    {/* Bio */}
                <View style={ styles.sectionContainer }>
                    <Text style={ styles.subText }>Na kóncu bych hišće chcył rjec, zo...</Text>

                    <View style={ styles.inputContainer }>
                        <TextInput
                            style={ styles.input } placeholder="Wopisaj tebje..." maxLength={512}
                            multiline placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                            keyboardType="default" keyboardAppearance='dark' value={userData.description}
                            autoCapitalize='sentences' textContentType="none"
                            onChangeText={ (value) => setUserData({
                                ...userData,
                                description: value,
                            }) } />
                    </View>
                </View>

                    {/* Submit */}
                <Pressable style={ styles.submitBtnContainer } onPress={register}>
                    <Text style={ styles.submitBtn }>Składować a registrować</Text>
                </Pressable>

            </ScrollView>
        </View>
    )
}

export const SelectableBtn = (props) => {
    return (
        <View style={props.style}>
            <Pressable style={[stylesSB.container, { borderColor: !props.selected ? "#143C63" : "#B06E6A" }]} onPress={props.onPress}>

                <View style={ stylesSB.textContainer }>
                    <Text style={[ stylesSB.title, { color: !props.selected ? "#5884B0" : "#B06E6A" } ]}>{props.title}</Text>
                </View>
                <View style={ stylesSB.textContainer }>
                    <Text style={[ stylesSB.subTitle, { color: !props.selected ? "#5884B0" : "#B06E6A" } ]}>{props.subTitle}</Text>
                </View>
            </Pressable>
        </View>
    )
}

const stylesSB = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        flex: 1,

        alignItems: "center"
    },
    
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
    },
    title: {
        textAlign: "center",

        fontFamily: "Barlow_Regular",
        fontSize: 15,
        textAlign: "center",
    },
    subTitle: {
        flex: 1,
        textAlign: "center",

        fontFamily: "Barlow_Regular",
        fontSize: 20,
        textAlign: "center",
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
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
        marginVertical: -5
    },

    sectionContainer: {
        width: "100%",
        marginVertical: 10
    },

    subText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
        marginVertical: 10,
        textAlign: "center"
    },
    titleText: {
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#B06E6A",
        marginVertical: 5,
        textAlign: "center"
    },

    inputContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
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

    genderContainer: {
        width: "80%",
        alignSelf: "center",
        flexDirection: "row",
        marginTop: 10,
    },
    switch: {
        flex: .2,
    },
    genderText: {
        flex: .4,
        textAlign: "center",

        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
    },

    ageGroupListContainer: {
        width: "80%",
        flexDirection: "row",
        alignSelf: "center",
        padding: 0,
        margin: 0,
    },
    ageBtn: {
        flex: 1,
        margin: 5,
    },

    imgOutlineContainer: {
        width: "80%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        
        borderRadius: 500,
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
        borderRadius: 15
    },
    img: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",

        justifyContent: "center",
        alignItems: "center"
    },
    imgBorder: {
        borderRadius: 500,
        borderWidth: 5,
        borderStyle: 'dashed',
        borderColor: "#B06E6A"
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

    submitBtnContainer: {
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
    submitBtn: {
        fontFamily: "Barlow_Bold",
        fontSize: 25,
        color: "#000000",
    },

})