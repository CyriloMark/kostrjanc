import React from 'react'

import { View, StyleSheet, Pressable } from 'react-native';

import SVG_Recent from '../../assets/svg/Recent';
import SVG_Share from '../../assets/svg/Share';
import SVG_Warn from '../../assets/svg/Warn';
import SVG_Ban from '../../assets/svg/Ban'


export default function ViewInteractionsBar(props) {
    return (
        <View style={ props.style }>
            <View style={ styles.container } >

                    {/* Comment */}
                {
                    props.comment ?
                        <Pressable style={ styles.iconContainer } onPress={ props.onComment } >
                            <View style={ styles.iconBG }>
                                <SVG_Recent style={ styles.itemIcon } fill="#143C63" />
                            </View>
                        </Pressable> : null
                }

                    {/* Share */}
                {
                    props.share ?
                        <Pressable style={ styles.iconContainer } onPress={ props.onShare } >
                            <View style={ styles.iconBG }>
                                <SVG_Share style={ styles.itemIcon } fill="#143C63" />
                            </View>
                        </Pressable> : null
                }

                    {/* Report */}
                {
                    props.report ?
                        <Pressable style={ styles.iconContainer } onPress={ props.onReport } >
                            <View style={ styles.iconBG }>
                                <SVG_Warn style={ styles.itemIcon } fill="#143C63" />
                            </View>
                        </Pressable> : null
                }

                    {/* Admin Ban */}
                {
                    props.userIsAdmin && props.ban ?
                        <Pressable style={ styles.iconContainer } onPress={ props.onBan } >
                            <View style={ styles.iconBG }>
                                <SVG_Ban style={ styles.itemIcon } fill="#143C63" />
                            </View>
                        </Pressable> : null
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingVertical: 5,
        
        flexDirection: "row",
    },

    iconContainer: {
        flex: .1,
        height: "100%",
        marginHorizontal: 10,

        alignItems: "center",
        justifyContent: "center"
    },
    iconBG: {
        aspectRatio: 1,
        height: "100%",

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        padding: 10,

        backgroundColor: "#5884B0"
    },
    icon: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 50,
    }


});