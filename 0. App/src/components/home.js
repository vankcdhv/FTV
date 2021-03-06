import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { checkSession } from '../common/utils';
import { Get } from '../common/request';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies';
import { WebView } from 'react-native-webview';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  clearAppData = async function () {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing app data.');
    }
  };

  storeData = async (key, value) => {
    try {
      if (value) {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.removeItem(key);
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      checkSession().catch((reason) => {
        if (
          reason.code &&
          (reason.code === 'TIME_OUT' || reason.code === 'NOT_FOUND')
        ) {
          this.props.navigation.navigate('Login');
        }
      });
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  keepSession() {
    this.getData('cookie').then((result) => {
      let headers = ({
        
        'cookie': 'ASP.NET_SessionId=' + result,
      });
      Get(Const.Domain + '/fap/keep', headers)
        .then((data) => {
          this.setState({ keepSession: true });
        })
        .catch((reason) => {
          console.log(reason);
          this.setState({ keepSession: false });
          if (
            reason.code &&
            (reason.code === 'TIME_OUT' || reason.code === 'NOT_FOUND')
          ) {
            this.logout();
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    });
  }

  logout() {
    CookieManager.clearAll().then((res) => {
      this.clearAppData().then((response) => {
        this.props.navigation.navigate('Login');
      });
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: 'https://daihoc.fpt.edu.vn/',
          }}
          userAgent={
            'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36'
          }
        />
      </View>
    );
  }
}
