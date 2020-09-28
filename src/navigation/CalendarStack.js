import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../components/login';
import CalendarScreen from '../components/calendar';

const Stack = createStackNavigator();
const CalendarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{title: 'Thời khóa biểu', headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Đăng nhập',
          headerShown: false,
        }}
        initialParams={{before: 'Calendar'}}
      />
    </Stack.Navigator>
  );
};

export default CalendarStack;
