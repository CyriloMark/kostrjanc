import React, { useEffect, useRef, useState } from 'react'

import { StyleSheet, ScrollView, Text } from 'react-native';

import Modal from './Modal';

import UserHeader from '../comp_static_items/UserHeader';
import { getAuth } from 'firebase/auth';

export default function UserListModal(props) {

    const mainScroll = useRef();

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        setUserList(props.userList);
    })

    return (
        <Modal onRequestClose={ props.close } visible={props.visible} content={        
            <ScrollView ref={mainScroll} style={ styles.modalScrollViewContainer } scrollEnabled={true} bounces
                showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' >

                <Text style={styles.title}>{props.title}</Text>
                {
                    userList.map((user, key) =>
                        <UserHeader key={key} user={user} style={styles.card} userID={getAuth().currentUser.uid} />
                    )
                }
            </ScrollView>
        } />
    )
}

const styles = StyleSheet.create({
    modalScrollViewContainer: {
        width: "100%",
    },

    title: {
        width: "100%",
        marginBottom: 10,
        alignSelf: "center",
        textAlign: "center",

        color: "#5884B0",
        fontFamily: "Barlow_Bold",
        fontSize: 25,
    },

    card: {
        width: "100%",
        position: "relative",
        marginBottom: 10,
        alignSelf: "center",
    },
});
