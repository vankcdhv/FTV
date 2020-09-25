import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import App from '../../App';
import LoginScreen from '../components/login';
import Home from '../components/home';

const Stack = createStackNavigator();
const Route = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login', headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Home', headerShown: false}}
        />
        <Stack.Screen name="App" component={App} options={{title: 'App'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;
