import React from 'react'

import { View, StyleSheet, Pressable } from 'react-native';

import SVG_Recent from '../../assets/svg/Recent';
import SVG_Search from '../../assets/svg/Search';
import SVG_Add from '../../assets/svg/Add';
import SVG_Profile from '../../assets/svg/Profile';

export default function Navbar(props) {
  return (
    <View style={ props.style }>
        <View style={ styles.container } >
          <Pressable style={ styles.navbarItem } onPress={ props.onPressRecent } >
            <SVG_Recent fill={props.active === 0 ? "#B06E6A" : "#5884B0"} />
          </Pressable>
          <Pressable style={ styles.navbarItem } onPress={ props.onPressSearch } >
            <SVG_Search fill={props.active === 1 ? "#B06E6A" : "#5884B0"} />
          </Pressable>
          <Pressable style={ styles.navbarItem } onPress={ props.onPressAdd } >
            <SVG_Add fill={props.active === 2 ? "#B06E6A" : "#5884B0"} />
          </Pressable>
          <Pressable style={ styles.navbarItem } onPress={ props.onPressProfile } >
            <SVG_Profile fill={props.active === 3 ? "#B06E6A" : "#5884B0"} />
          </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#143C63",
    
    flexDirection: "row",
    padding: 10,

    elevation: 10,
  },
  navbarItem: {
    flex: 1,
    paddingHorizontal: "7%",

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});