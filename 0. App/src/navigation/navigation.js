import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CalendarStack from './CalendarStack';
import HomeStack from './HomeStack';
import MarkStack from './MarkStack';
import AttendanceStack from './AttendanceStack';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: 'red',
        activeBackgroundColor: 'white',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          title: 'Thời khóa biểu',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Mark"
        component={MarkStack}
        options={{
          title: 'Bảng điểm',
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="grade" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceStack}
        options={{
          title: 'Điểm danh',
          tabBarIcon: ({color, size}) => (
            <Octicons name="checklist" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
