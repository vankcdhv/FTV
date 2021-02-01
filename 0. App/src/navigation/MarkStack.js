import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../components/login';
import MarkScreen from '../components/mark';

const Stack = createStackNavigator();
const CalendarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mark"
        component={MarkScreen}
        options={{title: 'Bảng điểm', headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Đăng nhập',
          headerShown: false,
        }}
        initialParams={{before: 'Mark'}}
      />
    </Stack.Navigator>
  );
};

export default CalendarStack;
