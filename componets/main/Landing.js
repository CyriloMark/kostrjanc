import React, { useCallback } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";

import AppHeader from '../statics/AppHeader';
import EventCard from '../statics/EventCard';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Landing() {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={ styles.container } >

      <View style={{ flex: .1 }}>
        <AppHeader style={ styles.header } />
      </View>

        <ScrollView contentContainerStyle={{ flex: .9 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
          } >

          <Text>Landing</Text>
          <EventCard style={ styles.eventCardAlert } title="Witaj" bio="sy tež tu?" />

        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#5884B0",
      padding: 10
  },
  header: {
    flex: 1,
    width: "100%",

    zIndex: 99,

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
    elevation: 5,
  },
  eventCardAlert: {
    width: "90%",
    position: "relative",
    marginTop: "5%",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: .34,
    shadowRadius: 6.27,
    elevation: 5,
},
});
