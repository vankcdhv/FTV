import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';
class LoginScreen extends Component {
  state = {
    cookies: {},
    webViewUrl: '',
    webRef: {},
  };

  constructor(props) {
    super(props);
  }

  onNavigationStateChange = (webViewState: {url: string}) => {
    const {url} = webViewState;
    // console.log(url);
    if (url.includes('http')) {
      this.setState({webViewUrl: url});
    }
  };

  _checkNeededCookies = () => {
    const {cookies, webViewUrl} = this.state;

    if (webViewUrl === 'http://fap.fpt.edu.vn/Student.aspx') {
      if (cookies['ASP.NET_SessionId']) {
        console.log(cookies['ASP.NET_SessionId'].value);
        this.props.navigation.navigate('Home', {
          cookie: cookies['ASP.NET_SessionId'].value,
        });
      }
    }
  };

  _onMessage = (event) => {
    CookieManager.get('http://fap.fpt.edu.vn/').then((cookies) => {
      this.setState({cookies: cookies});
      this._checkNeededCookies();
    });
  };

  render() {
    const jsCode = 'window.ReactNativeWebView.postMessage(document.cookie)';
    const webRef = {};
    return (
      <View style={{flex: 1}}>
        <WebView
          ref={(webref) => {
            this.webRef = webref;
          }}
          source={{
            uri: 'http://fap.fpt.edu.vn/',
          }}
          userAgent={
            'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36'
          }
          onNavigationStateChange={this.onNavigationStateChange}
          onMessage={this._onMessage}
          injectedJavaScript={jsCode}
          javaScriptEnabled={true}
        />
      </View>
    );
  }
}

export default LoginScreen;
