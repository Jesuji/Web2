import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import RestaurantDetailScreen from './screens/RestaurantDetailScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">

      <Stack.Screen name='SignUp' component={SignUpScreen} options={{headerShown: false}}/>
      <Stack.Screen name='SignIn' component={SignInScreen} options={{headerShown: false}}/>

      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{
          title: '음식점 상세 정보',
          headerBackTitle: '뒤로가기',
          presentation: 'modal'
          }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;