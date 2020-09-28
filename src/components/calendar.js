import React, {Component} from 'react';
import {
  FlatList,
  Text,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Get} from '../common/request';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      timetable: [],
      isLoading: true,
      selectedDay: '2',
    };
  }

  keepSession() {
    fetch('https://test-fap-api.herokuapp.com/fap/keep', {
      method: 'GET',
      headers: new Headers({
        cookie: 'ASP.NET_SessionId=' + this.props.route.params.cookie,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.status && json.status === 'done') {
          this.setState({keepStatus: true});
        } else {
          this.props.navigation.navigate('Login');
        }
      })
      .catch((error) => console.error(error));
  }

  processData(data) {
    let timetable = [];
    for (let i = 0; i < 6; i++) {
      let listSlot = [];
      for (let j = 0; j < data.length; j++) {
        listSlot.push(data[j][i]);
      }
      timetable.push(listSlot);
    }
    this.setState({timetable: timetable});
    this.setState({data: timetable[0]});
    this.setState({isLoading: false});
  }

  componentDidMount() {
    let headers = new Headers({
      cookie: 'ASP.NET_SessionId=' + this.props.route.params.cookie,
    });
    Get('https://test-fap-api.herokuapp.com/fap/timetable', headers)
      .then((result) => {
        this.processData(result);
      })
      .catch((reason) => {
        console.log(reason);
        if (reason.code === 'TIME_OUT') {
          this.props.navigation.navigate('Login');
        }
      });
  }

  onPressDayInWeek(day) {
    this.setState({isLoading: true});
    try {
      let index = parseInt(day, 10);
      index = index ? day : 8;
      this.setState({
        data: this.state.timetable[index - 2],
        isLoading: false,
        selectedDay: day + '',
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {data, isLoading} = this.state;

    return (
      <View style={{flex: 1}}>
        <View>
          <FlatList
            horizontal={true}
            data={[
              {key: '2'},
              {key: '3'},
              {key: '4'},
              {key: '5'},
              {key: '6'},
              {key: '7'},
              {key: 'CN'},
            ]}
            renderItem={({item}) => (
              <TouchableOpacity>
                <Text
                  style={[
                    style.dayInWeek,
                    this.state.selectedDay === item.key
                      ? style.selectedDay
                      : style.notSelectedDay,
                  ]}
                  onPress={() => this.onPressDayInWeek(item.key)}>
                  {item.key}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{flex: 1, padding: 24}}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <FlatList
              data={data}
              keyExtractor={({slot}, index) => slot}
              renderItem={({item}) => {
                if (item.course) {
                  return (
                    <View style={{marginTop: 20}}>
                      <Text>{item.course}</Text>
                      <View style={{paddingLeft: 20}}>
                        <Text>{item.room}</Text>
                        <Text>{item.time}</Text>
                        <Text
                          style={{
                            color: item.status === 'attended' ? 'green' : 'red',
                          }}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  );
                }
              }}
            />
          )}
        </View>
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

const style = StyleSheet.create({
  dayInWeek: {
    padding: 25,
  },
  selectedDay: {
    color: 'green',
  },
  notSelectedDay: {
    color: 'black',
  },
});
