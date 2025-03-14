import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './contexts/UserContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { TransitionPresets } from '@react-navigation/stack';

import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import RestaurantDetailScreen from './screens/RestaurantDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyReviewScreen from './screens/MyReviewScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <ReviewProvider>
    <UserProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

      <Stack.Screen 
      name='SignUp' 
      component={SignUpScreen}
      options={{
          headerShown: true,
          title: '',
          headerBackTitle: '로그인',
        }
      
      }/>
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
          title: '상세 정보',
          headerBackTitle: '',
          presentation: 'modal'
          }}/>

      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          title: '마이페이지',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name='MyReview'
        component={MyReviewScreen}
        options={{
          title: '내 리뷰',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name='ChatList'
        component={ChatListScreen}
        options={{
          title: '채팅',
          headerBackTitle: '',
          ...TransitionPresets.SlideFromLeftIOS,

        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          headerShown: false,

        }}
      />

      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
    </ReviewProvider>
  );
};



export default App;