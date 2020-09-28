import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import {checkSession} from '../common/utils';
import {Get} from '../common/request';

export default class Home extends Component {
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

  keepSession() {
    let headers = new Headers({
      cookie: 'ASP.NET_SessionId=' + this.props.route.params.cookie,
    });
    Get('https://test-fap-api.herokuapp.com/fap/keep', headers)
      .then((result) => {
        this.setState({keepSession: true});
      })
      .catch((reason) => {
        console.log(reason);
        this.setState({keepSession: false});
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
        <View>
          <Button
            title="Keep"
            onPress={() => {
              this.keepSession();
            }}
          />
        </View>
      </View>
    );
  }
}
