import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../components/login';
import LogoutScreen from '../components/logout';
import HomeScreen from '../components/home';

const Stack = createStackNavigator();
const CalendarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Trang chủ', headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Đăng nhập',
          headerShown: false,
        }}
        initialParams={{before: 'Home'}}
      />
      <Stack.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: 'Đăng xuất',
          headerShown: false,
        }}
        initialParams={{before: 'Home'}}
      />
    </Stack.Navigator>
  );
};

export default CalendarStack;
