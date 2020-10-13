import * as React from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Drawer, Avatar, Title, Caption} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies';
import BotNav from './navigation';
import {color} from 'react-native-reanimated';

const clearAppData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log(keys);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing app data.');
  }
};

const logout = (props) => {
  CookieManager.clearAll().then((res) => {
    clearAppData().then((response) => {
      props.navigation.navigate('Home');
    });
  });
};

function CustomDrawerContent(props) {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={{flex: 1}}>
          <View style={{paddingLeft: 20}}>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Avatar.Image
                source={{
                  uri:
                    'https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/117951982_2359197331042793_5621314988985847287_o.jpg?_nc_cat=104&_nc_sid=09cbfe&_nc_ohc=bJDzQ2dx41kAX-wycYi&_nc_ht=scontent.fhph1-1.fna&oh=4e68ac258945060d294dedcf9b5c0d5f&oe=5FAB4660',
                }}
                size={60}
              />
              <View style={{marginLeft: 20}}>
                <Title style={{}}>Lê Thiên Văn</Title>
                <Caption style={{}}>HE130820</Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={{marginTop: 40}}>
            <DrawerItem
              style={{marginTop: 20}}
              label="Home"
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              style={{marginTop: 20}}
              label="Thông tin"
              icon={({color, size}) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              onPress={() => logout(props)}
            />
            <DrawerItem
              style={{marginTop: 20}}
              label="Cài đặt"
              icon={({color, size}) => (
                <Ionicons name="settings-outline" color={color} size={size} />
              )}
              onPress={() => logout(props)}
            />
            <DrawerItem
              style={{marginTop: 20}}
              label="Trợ giúp"
              icon={({color, size}) => (
                <Ionicons name="help-outline" color={color} size={size} />
              )}
              onPress={() => {
                Linking.openURL('fb://page/yourparent');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section
        style={{
          borderTopColor: '#f4f4f4',
          borderTopWidth: 1,
        }}>
        <DrawerItem
          label="Đăng xuất"
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          onPress={() => logout(props)}
        />
      </Drawer.Section>
    </View>
  );
}

const DrawerNav = createDrawerNavigator();

function MyDrawer() {
  return (
    <DrawerNav.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <DrawerNav.Screen
        name="HomeStack"
        component={BotNav}
        options={{drawerLabel: 'Home'}}
      />
    </DrawerNav.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
