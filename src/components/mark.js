import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {checkSession} from '../common/utils';
import * as Const from '../common/const';
import * as Utils from '../common/utils';
import * as Style from '../style/common';

export default class Mark extends Component {
  constructor(props) {
    super(props);
  }

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
  render() {
    return (
      <View style={Style.common.container}>
        <StatusBar hidden={false} backgroundColor="orange" />
        <View style={Style.common.header}>
          <Text style={Style.common.labelTitle}>BÁO CÁO ĐIỂM</Text>
        </View>
      </View>
    );
  }
}
