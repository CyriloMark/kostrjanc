import React from 'react'

import { StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AuthLanding from './AuthLanding';
import AuthUserRegister from './AuthUserRegister';

const Stack = createStackNavigator();

export default function AuthManager() {

  const gestureOptions = {
    animationEnabled: Platform.OS === 'ios' ? true : false,
    gestureEnabled: Platform.OS === 'ios' ? true : false,
    cardStyleInterpolator: Platform.OS === 'ios' ? CardStyleInterpolators.forHorizontalIOS : CardStyleInterpolators.forBottomSheetAndroid
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator initialRouteName="AuthLanding" screenOptions={{
          headerShown: false
        }} >            
        <Stack.Screen name="AuthLanding" component={AuthLanding} options={{ gestureOptions }} />
        <Stack.Screen name="AuthUserRegister" component={AuthUserRegister} options={{ gestureOptions }} />
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