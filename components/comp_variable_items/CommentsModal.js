import { useEffect, useRef, useState, useCallback } from 'react'

import { View, StyleSheet, Pressable, ScrollView, Text, TextInput } from 'react-native';

import { getAuth } from 'firebase/auth';
import { get, getDatabase, child, ref, set } from 'firebase/database';

import Modal from './Modal';

import SVG_Return from '../../assets/svg/Return';

const placeholder = [
    {
        content: "",
        creator: "",
        created: 0
    }
]

export default function CommentsModal(props) {

    const mainScroll = useRef();

    const [commentsList, setCommentsList] = useState(placeholder);
    const [input, setInput] = useState("");

    useEffect(() => {
        setCommentsList(props.commentsList);
    });

    const publish = () => {
        if (input.length === 0) return;

        const inp = input;
        setInput("");
        console.log(commentsList);
        let a = commentsList;
        a.unshift({
            creator: getAuth().currentUser.uid,
            created: Date.now(),
            content: inp
        })
        setCommentsList(a);

        const db = getDatabase();
        get(child(ref(db), props.type === 0 ? "posts/" : "events/" + props.id))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    set(ref(db, props.type === 0 ? "posts/" : "events/" + props.id), {
                        ...data,
                        comments: commentsList
                    })
                        .catch((error) => console.log("error new comm", error.code))
                }
            })
            .catch((error) => console.log("error getPosts or Events CommentsModal", error.code))
    }

    return (
        <Modal onRequestClose={ props.close } visible={props.visible} content={        
            <ScrollView ref={mainScroll} style={{ width: "100%" }} scrollEnabled bounces
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' >

                <Text style={ styles.title}>Komentary na {props.type === 0 ? "post" : "ewent"} "{props.title}"</Text>

                <View style={ styles.inputContainer }>
                    <TextInput 
                        style={styles.input} placeholder="Zapodaj twoje měnjenje..." maxLength={128}
                        multiline placeholderTextColor={"#5884B0"} selectionColor={"#5884B0"}
                        keyboardAppearance='dark' keyboardType='default' value={input} 
                        autoCapitalize='sentences' autoComplete={ false } textContentType="none"
                        editable onChangeText={ (value) => setInput(value) } />

                    <Pressable style={ styles.backBtn } onPress={ publish } >
                        <View style={ styles.backBtnBG }>
                            <SVG_Return style={ styles.backBtnIcon } fill={"#000000"} />
                        </View>
                    </Pressable>

                </View>

                {
                    commentsList.length === 0 ?
                        <Text style={ styles.hint }>
                            Być přeni kiž komentuje!
                        </Text> :
                        commentsList.map((comment, key) => 
                            <Comment key={key} comment={comment} style={styles.commentItem} />
                    )
                }
            </ScrollView>
        } />
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
                <View style={ styles_comment.textBox }>
                    <Text style={styles_comment.text}>{props.comment.content}</Text>
                </View>
                
            </View>
        </View>
    )
}

const styles_comment = StyleSheet.create({
    container: {
        width: "100%",
    },
    userText: {
        fontFamily: "Barlow_Regular",
        fontSize: 15,
        marginBottom: 2,
        color: "#5884B0",
    },

    textBox: {
        padding: 10,

        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",
    },
    text: {
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",
    }
});

const styles = StyleSheet.create({
    title: {
        width: "100%",
        marginBottom: 10,
        alignSelf: "center",
        textAlign: "center",

        color: "#5884B0",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },

    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: .85,
        paddingHorizontal: 25,
        paddingVertical: 10,
        
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        color: "#5884B0",

        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#143C63",
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

    backBtn: {
        padding: 10,
        flex: .15,
        alignItems: "center",
    },
    backBtnBG: {
        aspectRatio: 1,
        width: "100%",
        paddingVertical: 10,

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,

        backgroundColor: "#5884B0"
    },
    backBtnIcon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,
        transform: [{ rotate: "180deg" }]
    },

    commentItem: {
        marginVertical: 5,
    },

    hint: {
        width: "100%",
        fontFamily: "Barlow_Regular",
        fontSize: 20,
        marginVertical: 10
    }
});
