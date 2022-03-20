import React, { useCallback } from 'react'

import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";

import AppHeader from '../statics/AppHeader';

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
      <ScrollView contentContainerStyle={{ flex: 1 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        } >

        <AppHeader style={ styles.header } />
        <Text>Landing</Text>

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
    width: "100%",
    height: "10%",
  }
});
