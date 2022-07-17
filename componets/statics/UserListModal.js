import React, { useEffect, useRef, useState } from 'react'

import { StyleSheet, Platform, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import UserHeader from '../statics/UserHeader';
import { getAuth } from 'firebase/auth';

export default function UserListModal(props) {

    const mainScroll = useRef();

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        setUserList(props.userList);
    })

    return (
        <Modal presentationStyle={ Platform.OS === 'ios' ? 'formSheet' : 'overFullScreen' } transparent={ Platform.OS === 'android' } onRequestClose={ props.close } animationType="slide" statusBarTranslucent visible={props.visible} >
            <KeyboardAvoidingView behavior='padding' enabled style={ Platform.OS === 'ios' ? styles.modalScreenContainerIOS : styles.modalScreenContainerAndroid }>

                    {/* DragHandle */}
                <Pressable style={ styles.modalDragHandleContainer } onPress={ props.close } >
                    <Pressable style={ styles.modalDragHandle } onPress={ props.close } />
                </Pressable>

                <View style={ styles.modalBodyContainer }>
                    <ScrollView ref={mainScroll} style={ styles.modalScrollViewContainer } scrollEnabled={true} bounces={true}
                        showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' >

                        <Text style={styles.title}>{props.title}</Text>

                        {
                            userList.map((user, key) =>
                                <UserHeader key={key} user={user} style={styles.card} userID={getAuth().currentUser.uid} />
                            )
                        }

                    </ScrollView>
                </View>

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

    modalBodyContainer: {
        width: "100%",
        flex: .95,
        paddingHorizontal: 10
    },
    modalScrollViewContainer: {
        width: "100%",
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

    card: {
        width: "90%",
        position: "relative",
        marginTop: 10,
        alignSelf: "center",
    
        elevation: 10,
    },
});
