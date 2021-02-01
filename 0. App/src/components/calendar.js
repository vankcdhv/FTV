import React, { Component } from 'react';
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Get } from '../common/request';
import { checkSession } from '../common/utils';
import AsyncStorage from '@react-native-community/async-storage';
import * as Const from '../common/const';
import * as Utils from '../common/utils';
import * as Style from '../style/style';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    Utils.scale(10, 'C');
    this.state = {
      data: [],
      timetable: [],
      isLoading: true,
      selectedDay: '2',
    };
  }

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

  processData(data) {
    let timetable = [];
    for (let i = 0; i < 6; i++) {
      let listSlot = [];
      for (let j = 0; j < data.length; j++) {
        let slot = data[j][i];
        slot['isShow'] = false;
        listSlot.push(slot);
      }
      timetable.push(listSlot);
    }
    let day = new Date().getDay();
    day = day === 0 ? 7 : day;
    day++;
    this.setState({
      timetable: timetable,
      data: timetable[day - 2],
      isLoading: false,
      selectedDay: day === 8 ? 'CN' : day + '',
    });
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ isLoading: true });
      checkSession()
        .then((response) => {
          this.getData('cookie')
            .then((result) => {
              cookie = 'ASP.NET_SessionId=' + result;
              let headers = {
                'host':'test-fap-api.herokuapp.com',
                'cookie': cookie,
              };

              Get('https://test-fap-api.herokuapp.com/fap/timetable', headers)
                .then((data) => {
                  this.processData(data);
                })
                .catch((reason) => {
                  console.log(reason);
                  if (reason.code === 'TIME_OUT') {
                    this.props.navigation.navigate('Home');
                  }
                });
            })
            .catch((reason) => {
              console.log('Calendar screen - get cookie', reason);
            });
        })
        .catch((reason) => {
          if (
            reason.code &&
            (reason.code === 'TIME_OUT' || reason.code === 'NOT_FOUND')
          ) {
            this.props.navigation.navigate('Home');
          }
        });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onPressDayInWeek(day) {
    this.setState({ isLoading: true });
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
  onPressSlot(item) {
    let listSlot = this.state.data;
    for (let i = 0; i < listSlot.length; i++) {
      if (listSlot[i].time === item.time) {
        listSlot[i].isShow = !listSlot[i].isShow;
      }
    }
    this.setState({ data: listSlot });
  }
  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={Style.common.container}>
        <StatusBar hidden={false} backgroundColor="orange" />
        <View style={Style.common.header}>
          <Text style={Style.common.labelTitle}>THỜI KHÓA BIỂU</Text>
          <View style={Style.common.flexRow}>
            <View style={{ alignItems: 'center' }}>
              <Text style={Style.calendar.nowDate}>{new Date().getDate()}</Text>
              <Text style={Style.calendar.nowDay}>
                {Const.CalendarConst[new Date().getDay()]}
              </Text>
            </View>
            <View style={Style.calendar.boundNowMonthYear}>
              <Text style={Style.calendar.nowMonth}>
                {new Date().getMonth()}
              </Text>
              <Text style={Style.calendar.nowYear}>
                {new Date().getFullYear()}
              </Text>
            </View>
          </View>
        </View>
        <View style={Style.calendar.boundSelectDay}>
          <FlatList
            horizontal={true}
            data={[
              { key: '2', value: 'Mon' },
              { key: '3', value: 'Tue' },
              { key: '4', value: 'Wed' },
              { key: '5', value: 'Thu' },
              { key: '6', value: 'Fri' },
              { key: '7', value: 'Sat' },
              { key: 'CN', value: 'Sun' },
            ]}
            initialScrollIndex={this.state.selectedDay - 2}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Text
                  style={[
                    Style.calendar.dayInWeek,
                    this.state.selectedDay === item.key
                      ? Style.common.selectedDay
                      : Style.common.notSelectedDay,
                  ]}
                  onPress={() => this.onPressDayInWeek(item.key)}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={Style.calendar.listBound}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
              <FlatList
                data={data}
                keyExtractor={({ slot }, index) => slot}
                renderItem={({ item }) => {
                  if (item.course) {
                    return (
                      <View style={Style.common.flexRow}>
                        <View style={Style.common.flexRow}>
                          <Text onPress={() => this.onPressSlot(item)}>
                            {item.time}
                          </Text>
                          <View style={Style.calendar.greenCircle} />
                        </View>
                        <View style={Style.calendar.borderLeft}>
                          <Text
                            style={{
                              marginBottom: Utils.scale(15, Const.Vertical),
                            }}>
                            {item.course}
                          </Text>
                          {item.isShow ? (
                            <View
                              style={{
                                paddingLeft: Utils.scale(20, Const.Horizontal),
                              }}>
                              <Text
                                style={{
                                  marginBottom: Utils.scale(15, Const.Vertical),
                                }}>
                                {item.room}
                              </Text>
                              <Text
                                style={[
                                  item.status === 'attended'
                                    ? Style.common.attended
                                    : item.status === 'absent'
                                      ? Style.common.absent
                                      : Style.common.future,
                                  {
                                    marginBottom: Utils.scale(20, Const.Vertical),
                                  },
                                ]}>
                                {item.status}
                              </Text>
                            </View>
                          ) : (
                              <View />
                            )}
                        </View>
                      </View>
                    );
                  }
                }}
              />
            )}
        </View>
      </View>
    );
  }
}
