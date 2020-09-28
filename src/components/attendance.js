import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {checkSession} from '../common/utils';
export default class Attendance extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('focus attendance screen');
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
      <View>
        <Text>Attendance screen</Text>
      </View>
    );
  }
}
