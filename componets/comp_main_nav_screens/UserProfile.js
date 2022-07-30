import React, { useState, useEffect, useCallback, useRef } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl, Modal, Pressable, Image, KeyboardAvoidingView, Platform, Keyboard, TextInput, Switch } from "react-native";

import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth } from 'firebase/auth';
import * as Storage from "firebase/storage";

import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaTypeOptions } from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import { ageOptions, SelectableBtn } from '../comp_auth/AuthUserRegister';

import Navbar from '../comp_static_items/Navbar';
import PostPreview from '../comp_variable_items/PostPreview';
import EditButton from '../comp_static_items/EditButton';
import UserListModal from '../comp_variable_items/UserListModal';

import SVG_Post from '../../assets/svg/Post';
import SVG_Admin from '../../assets/svg/Admin';
import SVG_Moderator from '../../assets/svg/Moderator';

const LOCAL_USER_Placeholder = {
    name: "",
    description: "",
    ageGroup: 0,
    gender: 0,
    pbUri: "https://www.colorhexa.com/587db0.png",
    posts: [],
    events: [],
    follower: [],
    following: [],
    isAdmin: false,
    isMod: false,
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

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

const userUploadMetadata = {
    contentType: 'image/jpeg',
};  

let pbChanged = false;

export default function UserProfile({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadUser();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const editScrollRef = useRef();
    const [pbImageUri, setPbImageUri] = useState(null);
    
    const [LOCAL_USER, setLOCAL_USER] = useState(LOCAL_USER_Placeholder);;
    const [postEventList, setPostEventList] = useState([]);

    const [editScreenVisible, setEditScreenVisible] = useState(false);

    const [editDataInput, setEditDataInput] = useState(LOCAL_USER_Placeholder);

    const [followerVisible, setFollowerVisible] = useState(false);
    const [followingVisible, setFollowingVisible] = useState(false);
    const [followerUserList, setFollowerUserList] = useState([]);
    const [followingUserList, setFollowingUserList] = useState([]);

    const loadUser = () => {

        const db = getDatabase();
        let postEventDatas = [];

        get(child(ref(db), "users/" + getAuth().currentUser.uid))
            .then((snapshot) => {
                const data = snapshot.val();

                let userData = {
                    ...data,
                    follower: snapshot.hasChild('follower') ? data['follower'] : [],
                    following: snapshot.hasChild('following') ? data['following'] : []
                };

                getFollowerUserList(snapshot.hasChild('follower') ? data['follower'] : []);
                getFollowingUserList(snapshot.hasChild('following') ? data['following'] : []);

                setLOCAL_USER(userData);

                const hasPosts = snapshot.hasChild('posts');
                const hasEvents = snapshot.hasChild('events');

                if (hasPosts) {
                    for(let i = 0; i < userData.posts.length; i++) {
                        get(child(ref(db), "posts/" + userData.posts[i]))
                            .then((post) => {
                                const postData = post.val();      
                                if (!postData.isBanned) postEventDatas.push(postData);
                                if (i === userData.posts.length - 1 && !hasEvents) sortArrayByDate(postEventDatas);
                            })
                            .catch((error) => console.log("error posts", error.code));
                    }
                }

                if (hasEvents) {
                    for(let i = 0; i < userData.events.length; i++) {
                        get(child(ref(db), "events/" + userData.events[i]))
                            .then((event) => {
                                const eventData = event.val();
                                if (!eventData.isBanned) postEventDatas.push(eventData);
                                if (i === userData.events.length - 1) sortArrayByDate(postEventDatas);
                            })
                            .catch((error) => console.log("error events", error.code));
                    }
                }

            })
            .catch((error) => console.log("error user", error.code))
    }

    const getPostsAndEvents = (hasPosts, hasEvents) => {
        
        console.log(hasPosts, hasEvents);

        const db = getDatabase();
        let postEventDatas = [];
        
        if (hasPosts) {
            get(child(ref(db), "users/" + getAuth().currentUser.uid + "/posts"))
                .then(snap => {
                    if (snap.exists()) {
                        const posts = snap.val();

                        setLOCAL_USER({
                            ...LOCAL_USER,
                            posts: posts
                        })

                        for(let i = 0; i < posts.length; i++) {
                            get(child(ref(db), "posts/" + posts[i]))
                                .then((post) => {
                                    const postData = post.val();
            
                                    postEventDatas.push(postData);
                                    if (i === posts.length - 1 && !hasEvents) sortArrayByDate(postEventDatas);
                                })
                                .catch((error) => console.log("error posts", error.code));
                        }

                    }
                })
                .catch(e => console.log("error", e.code))
        }

        if (hasEvents) {
            get(child(ref(db), "users/" + getAuth().currentUser.uid + "/events"))
                .then(snap => {
                    if (snap.exists()) {
                        const events = snap.val();

                        setLOCAL_USER({
                            ...LOCAL_USER,
                            events: events
                        })

                        for(let i = 0; i < events.length; i++) {
                            get(child(ref(db), "events/" + events[i]))
                                .then((event) => {
                                    const eventData = event.val();
            
                                    postEventDatas.push(eventData);
                                    if (i === events.length - 1) sortArrayByDate(postEventDatas);
                                })
                                .catch((error) => console.log("error events", error.code));
                        }

                    }
                })
                .catch(e => console.log("error", e.code))
        }
    }
        
    useEffect(() => {
        if (LOCAL_USER === LOCAL_USER_Placeholder) loadUser();
    }, []);


    const sortArrayByDate = (data) => {
        
        let dates = data;
        
        for(let i = data.length - 1; i >= 0; i--) {
            for (let j = 1; j <= i; j++) {
                if (dates[j - 1].created > dates[j].created) {
                    let temp = dates[j - 1];
                    dates[j - 1] = dates[j];
                    dates[j] = temp;
                }
            }
        }
        dates.reverse();

        setPostEventList(dates);
    }

    const overrideUserData = async () => {

        if (pbChanged) {

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    resolve(xhr.response);
                };
                xhr.onerror = function() {
                    reject(new TypeError('Network request failed!'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', pbImageUri, true);
                xhr.send(null); 
            });

            Storage.deleteObject(Storage.ref(Storage.getStorage(), 'profile_pics/' + getAuth().currentUser.uid))
                .then(() => {

                    Storage.uploadBytes(Storage.ref(Storage.getStorage(), 'profile_pics/' + getAuth().currentUser.uid), blob, userUploadMetadata)
                        .then((snapshot) => {
                            Storage.getDownloadURL(Storage.ref(Storage.getStorage(), 'profile_pics/' + getAuth().currentUser.uid))
                                .then((url) => {
                                    set(ref(getDatabase(), 'users/' + getAuth().currentUser.uid), {
                                        ...LOCAL_USER,
                                        isBanned: false,
                                        name: editDataInput.name,
                                        description: editDataInput.description,
                                        ageGroup: editDataInput.ageGroup,
                                        gender: editDataInput.gender,
                                        pbUri: url
                                    });
                                })
                                .catch((error) => console.log("error download", error.code))
                        })
                        .catch((error) => console.log("error upload", error.code))

                })
                .catch((error) => console.log("error delete", error.code));
        } else {
            set(ref(getDatabase(), 'users/' + getAuth().currentUser.uid), {
                ...LOCAL_USER,
                isBanned: false,
                name: editDataInput.name,
                description: editDataInput.description,
                ageGroup: editDataInput.ageGroup,
                gender: editDataInput.gender,
            });
        }

        setEditScreenVisible(false);
    }

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

        pbChanged = true;
        setPbImageUri(croppedPicker.uri);
    }

    const getFollowerUserList = (users) => {
        const db = ref(getDatabase());

        let list = [];
        for(let i = 0; i < users.length; i++) {
            get(child(db, "users/" + users[i]))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const a = snapshot.val();
                        
                        if (snapshot.hasChild("isBanned")) {
                            if (!a['isBanned']) {
                                list.push({
                                    name: a['name'],
                                    pbUri: a['pbUri']
                                });
                            }
                        } else {
                            list.push({
                                name: a['name'],
                                pbUri: a['pbUri']
                            });
                        }
                    }
                })
                .catch((error) => console.log("error get", error.code))
                .finally(() => {
                    if (i === users.length - 1) setFollowerUserList(list);
                })
        }
    }

    const getFollowingUserList = (users) => {
        const db = ref(getDatabase());

        let list = [];
        for(let i = 0; i < users.length; i++) {
            get(child(db, "users/" + users[i]))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const a = snapshot.val();
                        
                        if (snapshot.hasChild("isBanned")) {
                            if (!a['isBanned']) {
                                list.push({
                                    name: a['name'],
                                    pbUri: a['pbUri']
                                });
                            }
                        } else {
                            list.push({
                                name: a['name'],
                                pbUri: a['pbUri']
                            });
                        }
                    }
                })
                .catch((error) => console.log("error get", error.code))
                .finally(() => {
                    if (i === users.length - 1) setFollowingUserList(list);
                })
        }
    }
    
    return (
        <View style={ styles.container } >

                {/* Follower */}
            <UserListModal close={ () => setFollowerVisible(false) } visible={followerVisible} title={"Tute ludźo ći sćěhuja"} userList={followerUserList} />
                {/* Following */}
            <UserListModal close={ () => setFollowingVisible(false) } visible={followingVisible} title={"Tutym ludźom ty sćěhuješ"} userList={followingUserList} />

            <Modal presentationStyle={ Platform.OS === 'ios' ? 'formSheet' : 'overFullScreen' } transparent={ Platform.OS === 'android' }
                onRequestClose={ () => setEditScreenVisible(false) } animationType="slide" statusBarTranslucent visible={editScreenVisible} >
                <KeyboardAvoidingView behavior='padding' enabled style={ Platform.OS === 'ios' ? styles.modalScreenContainerIOS : styles.modalScreenContainerAndroid }>
                
                        {/* DragHandle */}
                    <Pressable style={ styles.modalDragHandleContainer } onPress={ () => setEditScreenVisible(false) } >
                        <Pressable style={ styles.modalDragHandle } onPress={ () => setEditScreenVisible(false) } />
                    </Pressable>
                    
                    <View style={ styles.modalBodyContainer }>
                        <ScrollView ref={editScrollRef} style={ styles.modalScrollViewContainer } scrollEnabled={true}
                            showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onScrollBeginDrag={ () => { if (Platform.OS === 'ios') Keyboard.dismiss }}
                            keyboardDismissMode='on-drag' bounces={true} >

                                {/* Name */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } keyboardType="default" autoCapitalize='words' maxLength={32}
                                    placeholder="Mjeno" autoComplete={ false } textContentType="name" keyboardAppearance='dark' value={editDataInput.name}
                                    multiline={ false } blurOnSubmit={ true } editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                                    onChangeText={ (value) => setEditDataInput({
                                        ...editDataInput,
                                        name: value
                                    }) }
                                />
                            </View>

                            <Pressable onPress={openImagePickerAsync} style={ styles.inputContainer }>
                                {pbImageUri !== null ?
                                    <Image source={{ uri: pbImageUri }} style={ styles.pbImage } resizeMode="cover" /> :

                                    <View style={ styles.pbImagePlaceholder } >
                                        <SVG_Post style={ styles.pbImageIcon } fill="#5884B0" />
                                        <Text style={ styles.pbImageHint }>Tłoć, zo wobrazy přepytać móžeš</Text>
                                    </View>
                                }
                            </Pressable>

                            <View style={[ styles.inputContainer, { flexDirection: "row" } ]}>
                                <Text style={ styles.genderText } >hólc</Text>
                                <Switch style={ styles.switch }
                                    thumbColor={"#B06E6A"} ios_backgroundColor={"#143C63"} value={editDataInput.gender === 0 ? false : true}
                                    onValueChange={ (value) => 
                                        setEditDataInput({
                                            ...editDataInput,
                                            gender: !value ? 0 : 1
                                        }) } trackColor={{
                                        false: "#143C63",
                                        true: "#143C63"
                                    }}/>
                                <Text style={ styles.genderText } >holca</Text>
                            </View>

                            <View style={ styles.inputContainer }>
                                { arraySplitter(ageOptions, 2).map((list, listKey) => 
                                <View key={listKey} style={ styles.ageGroupListContainer }>
                                    { list.map((ageGroup, ageGroupKey) => 
                                        <SelectableBtn key={ageGroupKey} selected={editDataInput.ageGroup === ageGroup.id} title={ageGroup.ageGroup}
                                            subTitle={ageGroup.ages} style={ styles.ageBtn } onPress={ () => {
                                                setEditDataInput({
                                                    ...editDataInput,
                                                    ageGroup: ageGroup.id
                                                });
                                            }} />
                                    ) }
                                </View>
                            ) }
                            </View>

                                 {/* Bio */}
                            <View style={ styles.modalInputContainer }>
                                <TextInput style={ styles.modalInput } keyboardType="default" autoCapitalize='sentences' maxLength={512}
                                    placeholder="Wopisaj tebje..." autoComplete={ false } keyboardAppearance='dark' value={editDataInput.description}
                                    multiline blurOnSubmit={ true } numberOfLines={5} editable={ true } placeholderTextColor={"#5884B0"} selectionColor={"#B06E6A"}
                                    onChangeText={ (value) => setEditDataInput({
                                        ...editDataInput,
                                        description: value,
                                    }) }
                                    
                                />
                            </View>

                                {/* Submit */}
                            <Pressable style={ styles.modalSubmitBtn } onPress={ overrideUserData } >
                                <Text style={ styles.modalSubmitBtnText }>Změnić</Text>
                            </Pressable>

                        </ScrollView>
                    </View>

                </KeyboardAvoidingView>
            </Modal>

            <ScrollView style={ styles.contentContainer } contentContainerStyle={ styles.contentInnerContainer } showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false} bounces refreshControl={
                <RefreshControl
                    style={{ marginTop: -5 }}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#000000"
                    title=''
                    colors={["#000000"]}
                />
            }>

                    {/* Profile Header */}
                <View style={ styles.profileHeader }>

                        {/* Icon */}
                    <View style={ styles.profileHeaderPBContainer } >
                        <Image source={{ uri: LOCAL_USER.pbUri }} style={ styles.profileHeaderIcon } resizeMode="cover" />
                    </View>

                    <Text style={ styles.profileHeaderText }>
                        {LOCAL_USER.name}
                    </Text>

                        {/* Profile Bio */}
                    <Text style={ styles.profileBioText }>
                        {LOCAL_USER.description}
                    </Text>

                    <View style={ styles.profileAwardContainer }>
                        {
                            LOCAL_USER.isMod ?
                                <SVG_Moderator style={styles.awardIcon} fill={"#B06E6A"} /> : null
                        }
                        {
                            LOCAL_USER.isAdmin ?
                                <SVG_Admin style={styles.awardIcon} fill={"#B06E6A"} /> : null
                        }
                    </View>

                </View>

                    {/* Follow-Lists */}
                <View style={ styles.profileFollowListsContainer }>
                        {/* Follower */}
                    <Pressable style={ styles.profileFollowContainer  } onPress={ () => { setFollowerVisible(true); } }>
                        <Text style={ styles.profileFollowText }>
                            <Text style={{fontFamily: "Barlow_Bold"}}>{followerUserList.length }</Text> wužiwarjo ći sćěhuja</Text>
                    </Pressable>
                        {/* Following */}
                    <Pressable style={ styles.profileFollowContainer } onPress={ () => { setFollowingVisible(true); } }>
                        <Text style={ styles.profileFollowText }>Ty sćehuješ <Text style={{fontFamily: "Barlow_Bold"}}>{followingUserList .length }</Text> wužiwarnjam</Text>
                    </Pressable>
                </View>

                    {/* Post List */}
                <View style={ styles.postContainer }>
                    { arraySplitter(postEventList, 2).map((list, listKey) => 
                        <View key={listKey} style={ styles.postItemListContainer }>
                            { list.map((item, itemKey) => 
                                <PostPreview postShowText={false} key={itemKey} item={item} style={ styles.postPreview }
                                    press={ () => {
                                        item.type === 0 ?
                                            navigation.push('PostView', { postID: item.id }) :
                                            navigation.push('EventView', { eventID: item.id })
                                    } } />
                            ) }
                        </View>
                    ) }
                </View>

                <EditButton style={ styles.editBtn } onPress={ () => {
                    pbChanged = false;
                    setPbImageUri(LOCAL_USER.pbUri);
                    setEditDataInput(LOCAL_USER);
                    setEditScreenVisible(true)
                } } />

            </ScrollView>

            <Navbar style={ styles.navbar } active={3}
                onPressRecent={ () => { navigation.navigate("Recent") }}
                onPressSearch={ () => { navigation.navigate("Search") }}
                onPressAdd={ () => { navigation.navigate("Add") }}
                onPressProfile={ () => { navigation.navigate("Profile") }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#143C63",
    },

    navbar: {
        height: "6%",
        width: "80%",
        alignSelf: "center",
        zIndex: 99,
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
        minHeight: "100%"
    },

    profileHeader: {
        width: "100%",
        alignItems: "center",
        padding: 10,
    },
    profileHeaderPBContainer: {
        aspectRatio: 1,
        width: "60%",
        borderRadius: 100,
        backgroundColor: "#000000"
    },
    profileHeaderIcon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50
    },
    profileHeaderText: {
        width: "80%",
        marginVertical: 25,
        fontFamily: "Barlow_Bold",
        textAlign: "center",
        fontSize: 50,
        color: "#5884B0",
    },

    profileBioText: {
        fontFamily: "Barlow_Regular",
        fontSize: 25,
        color: "#5884B0",
        marginBottom: 25
    },
    profileAwardContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
    },
    awardIcon: {
        width: "50%",
        aspectRatio: 1,
        marginHorizontal: 10,
        alignSelf: "center",
    },


    profileFollowListsContainer: {
        width: "100%",
        alignItems: "center",
        marginVertical: 10
    },
    profileFollowContainer: {
        width: "100%",
        flex: 1,
        
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",

        position: "relative",
        marginVertical: 2,

        paddingHorizontal: 25,
        paddingVertical: 10,
        justifyContent: "center",
    },
    profileFollowText: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
    },


    postContainer: {
        width: "100%",

        position: "relative",
        marginVertical: 10,
    },
    postItemListContainer: {
        width: "100%",
        flexDirection: "row",
    },
    postPreview: {
        flex: 1,
        aspectRatio: .9,
        margin: 5
    },

    editBtn: {
        width: "80%",
        marginVertical: 25,
        alignSelf: "center"
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

        fontFamily: "Barlow_Regular",
        fontSize: 25,

        backgroundColor: "#143C63",
        borderRadius: 15,
    },

    modalSubmitBtn: {
        width: "80%",
        alignSelf: "center",
        marginVertical: 25,

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

    inputContainer: {
        width: "80%",
        marginVertical: 10,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        
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
        
        fontFamily: "Barlow_Regular",
        fontSize: 15,
        color: "#5884B0",
        textAlign: "center",
    },

    switch: {
        flex: .2,
        marginHorizontal: 10,
    },
    genderText: {
        flex: .4,
        textAlign: "center",

        fontFamily: "Barlow_Bold",
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

})