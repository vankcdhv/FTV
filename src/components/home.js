import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, View, Button} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      keepStatus: {},
    };
  }

  componentDidMount() {
    fetch('https://test-fap-api.herokuapp.com/fap/markreport/Fall2017', {
      method: 'GET',
      headers: new Headers({
        cookie: 'ASP.NET_SessionId=' + this.props.route.params.cookie,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json.listCourse});
        console.log(this.state.data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
    fetch('https://test-fap-api.herokuapp.com/fap/keep', {
      method: 'GET',
      headers: new Headers({
        cookie: 'ASP.NET_SessionId=' + this.props.route.params.cookie,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        this.setState({keepStatus: json});
      })
      .catch((error) => console.error(error));
  }

  render() {
    const {data, isLoading} = this.state;

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, padding: 24}}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={data}
              keyExtractor={({id}, index) => id}
              renderItem={({item}) => (
                <Text>
                  {item.id}, {item.name}
                </Text>
              )}
            />
          )}
        </View>
        <View style={{flex: 1, padding: 24}}>
              <Text>{this.state.keepStatus}</Text>
        </View>
        <View>
          <Button
            title="Login"
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}
          />
        </View>
      </View>
    );
  }
}
