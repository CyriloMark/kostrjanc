import React, { useEffect, useRef, useState } from 'react'

import { View, StyleSheet, Platform, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, TextInput} from 'react-native';

import { getAuth } from 'firebase/auth';
import { get, getDatabase, child, ref, set } from 'firebase/database'

import SVG_Return from './../../assets/svg/Return';

const placeholder = [
    {
        content: "Z składa so čehnje!",
        creator: "wPozvkNuAhYNu34JnzW2dkkp95H2",
        created: "293203492"
    }
]

export default function CommentsModal(props) {

    const mainScroll = useRef();

    const [commentsList, setCommentsList] = useState(placeholder);
    const [input, setInput] = useState("");

    useEffect(() => {
        setCommentsList(props.commentsList);
    }, [commentsList === placeholder]);

    const publish = () => {
        if (input.length === 0) return;

        const inp = input;
        setInput("");

        let a = commentsList;
        a.unshift({
            creator: getAuth().currentUser.uid,
            created: Date.now(),
            content: inp
        })
        setCommentsList(a);

        const db = getDatabase();
        if (props.type == 0) {
            get(child(ref(db), "posts/" + props.postID))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        set(ref(db, "posts/" + props.postID), {
                            ...data,
                            comments: commentsList
                        }).catch((error) => console.log("error new comm", error.code))
                    }
                })
                .catch((error) => console.log("error", error.code))
        }
    } 

    return (
        <Modal presentationStyle={ Platform.OS === 'ios' ? 'formSheet' : 'overFullScreen' } transparent={ Platform.OS === 'android' } onRequestClose={ props.close } animationType="slide" statusBarTranslucent visible={props.visible} >
            <KeyboardAvoidingView behavior='padding' enabled style={ Platform.OS === 'ios' ? styles.modalScreenContainerIOS : styles.modalScreenContainerAndroid }>

                    {/* DragHandle */}
                <Pressable style={ styles.modalDragHandleContainer } onPress={ props.close } >
                    <Pressable style={ styles.modalDragHandle } onPress={ props.close } />
                </Pressable>

                <ScrollView ref={mainScroll} style={ styles.modalScrollView } scrollEnabled={true} bounces={true} >

                    <Text style={styles.title}>Komentary na {props.type === 0 ? "post" : "ewent"} "{props.title}"</Text>

                    <View style={[ styles.inputContainer, styles.shadow ]}>
                        <TextInput style={styles.input} placeholder="Zapodaj twoje měnjenje..." placeholderTextColor={"#5884B0"}
                            multiline={true} numberOfLines={1} keyboardAppearance='dark' autoComplete={ false } textContentType="none" textAlignVertical='center'
                            keyboardType='default' autoCapitalize='sentences' maxLength={128} editable
                            selectionColor={"#B06E6A"} value={input} onChangeText={ (value) => setInput(value) } />
                        <Pressable style={styles.submit} onPress={ publish }>
                            <SVG_Return style={ styles.icon } fill={"#143C63"} />
                        </Pressable>
                    </View>

                    {
                        commentsList.map((comment, key) => 
                            <Comment key={key} comment={comment} style={styles.commentItem} />
                        )
                    }

                </ScrollView>

            </KeyboardAvoidingView>
        </Modal>
    )
}

export function Comment(props) {

    const [userName, setUserName] = useState("");

    useEffect(() => {
        getUserData();
    })

    const getUserData = () => {
        const db = ref(getDatabase());
        get(child(db, "users/" + props.comment.creator))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setUserName(data['name']);
                }
            })
    }

    let getTime = () => {
        const date = new Date(props.comment.created);
        return (date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" +
            (date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes()));
    }

    return (
        <View style={props.style}>
            <View style={styles_comment.container}>
                
                    {/* User */}
                <Text style={styles_comment.userText}>{userName} - {getTime()}</Text>

                    {/* Text */}
                <Text style={styles_comment.text}>{props.comment.content}</Text>
                
            </View>
        </View>
    )
}

const styles_comment = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#143C63",
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25
    },
    userText: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 15,
        marginHorizontal: 10,
        marginTop: 10,
        color: "#5884B0",
    },
    text: {
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        marginVertical: 10,
        color: "#5884B0",
    }
});

const styles = StyleSheet.create({
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
        height: "90%",
        backgroundColor: "red",
        overflow: "hidden",
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

    inputContainer: {
        position: "relative",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",

        elevation: 10
    },
    input: {
        flex: .9,
        marginHorizontal: 10,
        backgroundColor: "#143C63",
        borderRadius: 15,
        
        fontFamily: "Inconsolata_Regular",
        fontSize: 25,
        padding: 25,
        color: "#5884B0",
    },
    submit: {
        flex: .1,
        marginRight: 10,
        aspectRatio: 1
    },
    icon: {
        aspectRatio: 1,
        width: "100%",
        transform: [{ rotate: "180deg" }]
    },

    commentItem: {
        margin: 10
    }
});
