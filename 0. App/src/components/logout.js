import React, {Component} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';
class Logout extends Component {
  state = {
    cookies: {},
    webViewUrl: '',
    webRef: {},
  };

  constructor(props) {
    super(props);
  }

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

  onNavigationStateChange = (webViewState: {url: string}) => {
    const {url} = webViewState;
    this.props.navigation.navigate(this.props.route.params.before);
    console.log(url);
    if (url.includes('http')) {
      this.setState({webViewUrl: url});
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <WebView
          source={{
            uri: 'http://fap.fpt.edu.vn/Student.aspx?logout=true',
          }}
          userAgent={
            'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36'
          }
          onNavigationStateChange={this.onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={false}
        />
      </View>
    );
  }
}

export default Logout;
