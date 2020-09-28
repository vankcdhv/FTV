import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CalendarStack from '../navigation/CalendarStack';
import MarkStack from '../navigation/MarkStack';
import AttendanceStack from '../navigation/AttendanceStack';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Calendar"
        tabBarOptions={{
          activeTintColor: 'red',
          activeBackgroundColor: 'white',
        }}>
        <Tab.Screen
          name="Calendar"
          component={CalendarStack}
          options={{
            title: 'Thời khóa biểu',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="calendar"
                color={color}
                size={size}
              />
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
    </NavigationContainer>
  );
}
