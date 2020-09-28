import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {checkSession} from '../common/utils';

export default class Mark extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    checkSession().catch((reason) => {
      if (
        reason.code &&
        (reason.code === 'TIME_OUT' || reason.code === 'NOT_FOUND')
      ) {
        this.props.navigation.navigate('Login');
      }
    });
  }
  render() {
    return (
      <View>
        <Text>Mark screen</Text>
      </View>
    );
  }
}
