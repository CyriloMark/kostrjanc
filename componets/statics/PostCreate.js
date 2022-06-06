import React, { useState, useEffect } from 'react'

import { Alert, View, KeyboardAvoidingView, ScrollView, StyleSheet, Keyboard, Pressable, Text, Image, TextInput } from 'react-native'

import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions, UIImagePickerPresentationStyle } from 'expo-image-picker';

import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { getDownloadURL, getStorage, uploadBytes, ref as storageRef } from "firebase/storage";

import BackHeader from './BackHeader';

import SVG_Post from '../../assets/svg/Post';

const userUploadMetadata = {
    contentType: 'image/jpeg',
};  

let btnPressed;
export default function PostCreate({ navigation }) {

    const [imageUri, setImageUri] = useState(null);

    const [postData, setPostData] = useState({})

    const openImagePickerAsync = async () => {
        let permissionResult = await requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) return;
        
        let pickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: .5,
            aspect: [9, 10],
            allowsMultipleSelection: false,
            presentationStyle: UIImagePickerPresentationStyle.PageSheet
        });
        if (pickerResult.cancelled) return;

        setImageUri(pickerResult.uri);
    }

    const publish = async () => {
        if (!(imageUri != null && postData.title.toString().length !== 0 && postData.description.toString().length !== 0)) return;
        btnPressed = true;

        const id = Date.now();
        const storage = getStorage();

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError('Network request failed!'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', imageUri, true);
            xhr.send(null); 
        });

        const itemRef = storageRef(storage, "posts_pics/" + id);
        uploadBytes(itemRef, blob, userUploadMetadata)
            .then(() => {

                getDownloadURL(itemRef)
                    .then(url => {

                        set(ref(getDatabase(), 'posts/' + id), {
                            id: id,
                            type: 0,
                            title: postData.title,
                            description: postData.description,
                            created: id,
                            creator: getAuth().currentUser.uid,
                            imgUri: url
                        });

                        get(child(ref(getDatabase()), 'users/' + getAuth().currentUser.uid))
                            .then((userData) => {
                                const data = userData.val();
                                
                                let a;
                                if (userData.hasChild('posts')) a = data['posts'];
                                else a = [];
                                a.push(id);
                                
                                set(ref(getDatabase(), 'users/' + getAuth().currentUser.uid), {
                                    ...data,
                                    posts: a
                                }).finally(() =>

                                    Alert.alert("Post wozjawjeny", 'Waš nowy post "' + postData.title + '" je so wuspěšnje wozjewił.', [
                                        {
                                            text: "Ok",
                                            style: "default",
                                            onPress: navigation.navigate('Recent')
                                        }
                                    ])
                                )
                            })
                            .catch(() => btnPressed = false)

                    })

            })
    }

    return (
        <View style={ styles.container } >
            <KeyboardAvoidingView behavior='height' enabled={ Platform.OS != 'ios' } style={{ height: "100%" }}>

                <BackHeader style={[ styles.shadow, styles.backHeader ]} title="Nowy post wozjawnić" onPress={ () => navigation.goBack() } />

                <ScrollView style={{ width: "100%", marginTop: "25%", overflow: "visible" }} contentContainerStyle={[ styles.shadow, { width: "100%", paddingBottom: "10%", }]}
                        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }}
                        keyboardDismissMode='on-drag' bounces={true}>

                    <Pressable onPress={openImagePickerAsync} style={ styles.imgPickContainer }>
                        {imageUri !== null ?
                            <Image source={{ uri: imageUri }} style={ styles.image } resizeMode="cover" /> :

                            <View style={ styles.imagePlaceholder } >
                                <SVG_Post style={ styles.imageIcon } fill="#5884B0" />
                                <Text style={ styles.imageHint }>Tłoć, zo wobrazy přepytać móžeš</Text>
                            </View>
                        }
                    </Pressable>

                        {/* Name */}
                    <View style={ styles.inputContainer }>
                        <TextInput style={ styles.input } keyboardType="default" autoCapitalize='sentences' maxLength={32}
                            placeholder="Titul" autoComplete={ false } textContentType="name" keyboardAppearance='dark' value={postData.title}
                            multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setPostData({
                                ...postData,
                                title: value
                            }) }
                        />
                    </View>

                        {/* Bio */}
                    <View style={ styles.inputContainer }>
                        <TextInput style={ styles.input } keyboardType="default" autoCapitalize='sentences' maxLength={512}
                            placeholder="Wopisaj twój post..." autoComplete={ false } keyboardAppearance='dark' value={postData.description}
                            multiline blurOnSubmit={ true } numberOfLines={5} editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                            onChangeText={ (value) => setPostData({
                                ...postData,
                                description: value,
                            }) }
                        />
                    </View>

                        {/* Submit */}
                    <Pressable style={ styles.submitBtn } onPress={ publish }>
                        <Text style={ styles.submitBtnText }>Wozjewić</Text>
                    </Pressable>

                </ScrollView>
            </KeyboardAvoidingView>
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
    },

    backHeader: {
        position: "absolute",
        width: "100%",
        height: "10%",
        top: 10,

        alignSelf: "center",

        zIndex: 99
    },

    imgPickContainer: {
        width: "80%",
        marginVertical: 10,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        aspectRatio: .9,
        width: "100%",
        borderRadius: 25
    },
    imagePlaceholder: {
        aspectRatio: .9,
        width: "100%",
        borderRadius: 25,
        backgroundColor: "#143C63",

        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    imageIcon: {
        width: "50%",
        height: "50%"
    },
    imageHint: {
        width: "60%",
        alignSelf: "center",
        
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        color: "#5884B0",
        textAlign: "center",
    },

    inputContainer: {
        width: "100%",
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "80%",
        color: "#5884B0",

        padding: 25,

        fontFamily: "Inconsolata_Regular",
        fontSize: 25,

        backgroundColor: "#143C63",
        borderRadius: 15,
    },

    submitBtn: {
        width: "80%",
        alignSelf: "center",
        marginVertical: 25,

        backgroundColor: "#B06E6A",
        borderRadius: 15,

        padding: 25,

        alignItems: "center",
        justifyContent: "center",
    },
    submitBtnText: {
        color: "rgba(0, 0, 0, .5)",
        fontFamily: "Inconsolata_Black",
        fontSize: 25,
    },
});