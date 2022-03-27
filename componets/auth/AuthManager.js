import React from 'react'

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AuthLanding from './AuthLanding';
import AuthUserRegister from './AuthUserRegister';

const Stack = createStackNavigator();

export default function AuthManager() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator initialRouteName="AuthLanding" screenOptions={{
          headerShown: false
        }} >            
        <Stack.Screen name="AuthLanding" component={AuthLanding} options={{ animationEnabled: true, gestureEnabled: true, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name="AuthUserRegister" component={AuthUserRegister} options={{ animationEnabled: true, gestureEnabled: true, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#5884B0",
    },
});