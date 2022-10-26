import React from "react";

import { StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import Landing from "./Landing";
import Search from "./Search";
import Add from "./Add";
import Profile from "./UserProfile";
import PostView from "../comp_variable_screens/PostView";
import EventView from "../comp_variable_screens/EventView";
import ProfileView from "../comp_variable_screens/ProfileView";
import Settings from "../comp_static_screens/Settings";

import PostCreate from "../comp_variable_screens/PostCreate";
import EventCreate from "../comp_variable_screens/EventCreate";

const Stack = createStackNavigator();

export default function ViewportManager() {
  const gestureOptions = {
    animationEnabled: Platform.OS === "ios" ? true : false,
    gestureEnabled: Platform.OS === "ios" ? true : false,
    cardStyleInterpolator:
      Platform.OS === "ios"
        ? CardStyleInterpolators.forHorizontalIOS
        : CardStyleInterpolators.forBottomSheetAndroid,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName="Recent"
        screenOptions={{
          headerShown: false,
          presentation: "card",
        }}
      >
        <Stack.Screen
          name="Recent"
          component={Landing}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          }}
        />
        <Stack.Screen
          name="Add"
          component={Add}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          }}
        />

        <Stack.Screen
          name="PostView"
          component={PostView}
          options={gestureOptions}
        />
        <Stack.Screen
          name="EventView"
          component={EventView}
          options={gestureOptions}
        />
        <Stack.Screen
          name="ProfileView"
          component={ProfileView}
          options={gestureOptions}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={gestureOptions}
        />

        <Stack.Screen
          name="PostCreate"
          component={PostCreate}
          options={gestureOptions}
        />
        <Stack.Screen
          name="EventCreate"
          component={EventCreate}
          options={gestureOptions}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#143C63",
  },
});
