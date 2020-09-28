import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../components/login';
import AttendanceScreen from '../components/attendance';

const Stack = createStackNavigator();
const CalendarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{title: 'Điểm danh', headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Đăng nhập',
          headerShown: false,
        }}
        initialParams={{before: 'Attendance'}}
      />
    </Stack.Navigator>
  );
};

export default CalendarStack;
