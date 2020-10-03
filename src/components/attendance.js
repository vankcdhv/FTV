import React, {Component} from 'react';
import {View, Text, StatusBar, ActivityIndicator, FlatList} from 'react-native';
import {checkSession} from '../common/utils';
import * as Const from '../common/const';
import * as Utils from '../common/utils';
import * as Style from '../style/common';
import * as Request from '../common/request';
import AsyncStorage from '@react-native-community/async-storage';

export default class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTerm: [],
      listCourse: [],
      reports: [],
      isLoadingTerm: true,
      isLoadingCourse: false,
      isLoadingReport: false,
      selectedTerm: '',
      selectedCourse: '',
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

  getReportOfCourse(course) {
    this.setState({isLoadingReport: true});
    this.getData('cookie')
      .then((cookie) => {
        cookie = 'ASP.NET_SessionId=' + cookie;
        let headers = new Headers({
          cookie: cookie,
        });
        let uri =
          'https://test-fap-api.herokuapp.com/fap/attendance/0/' + course;
        Request.Get(uri, headers)
          .then((reports) => {
            reports = reports.report;
            for (let i = 0; i < reports.length; i++) {
              reports[i]['isShowMore'] = false;
            }
            this.setState({reports: reports, isLoadingReport: false});
          })
          .catch((reason) => {
            console.log(reason);
            if (reason.code === 'TIME_OUT') {
              this.props.navigation.navigate('HomeStack');
            }
          });
      })
      .catch((reason) => {
        console.log('Attendance screen - get cookie', reason);
      });
  }

  getListCourseOfTerm(term) {
    this.setState({isLoadingCourse: true});
    this.getData('cookie')
      .then((cookie) => {
        cookie = 'ASP.NET_SessionId=' + cookie;
        let headers = new Headers({
          cookie: cookie,
        });
        let uri =
          'https://test-fap-api.herokuapp.com/fap/attendance/' + term.code;
        Request.Get(uri, headers)
          .then((listCourse) => {
            listCourse = listCourse.listCourse.slice(1, listCourse.length);
            this.setState({
              listCourse: listCourse,
              selectedCourse: listCourse[0].course,
              isLoadingCourse: false,
            });
            this.getReportOfCourse(listCourse[0].course);
          })
          .catch((reason) => {
            console.log(reason);
            if (reason.code === 'TIME_OUT') {
              this.props.navigation.navigate('HomeStack');
            }
          });
      })
      .catch((reason) => {
        console.log('Attendance screen - get cookie', reason);
      });
  }

  getListTerm() {
    this.setState({isLoadingTerm: true});
    this.getData('cookie')
      .then((cookie) => {
        cookie = 'ASP.NET_SessionId=' + cookie;
        let headers = new Headers({
          cookie: cookie,
        });
        let uri = 'https://test-fap-api.herokuapp.com/fap/attendance';
        Request.Get(uri, headers)
          .then((listTerm) => {
            listTerm = listTerm.listTerm;
            listTerm = listTerm.slice(1, listTerm.length);
            this.setState({
              listTerm: listTerm,
              isLoadingTerm: false,
              selectedTerm: listTerm[listTerm.length - 1].name,
            });
            this.getListCourseOfTerm(listTerm[listTerm.length - 1]);
          })
          .catch((reason) => {
            console.log(reason);
            if (reason.code === 'TIME_OUT') {
              this.props.navigation.navigate('HomeStack');
            }
          });
      })
      .catch((reason) => {
        console.log('Attendance screen - get cookie', reason);
      });
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        listTerm: [],
        listCourse: [],
        reports: [],
        isLoadingTerm: true,
        isLoadingCourse: false,
        isLoadingReport: false,
        selectedTerm: '',
        selectedCourse: '',
      });
      checkSession()
        .then((response) => {
          this.getListTerm();
        })
        .catch((reason) => {
          if (
            reason.code &&
            (reason.code === 'TIME_OUT' || reason.code === 'NOT_FOUND')
          ) {
            this.props.navigation.navigate('Login');
          }
        });
    });
  }

  onPressSelectTerm(term) {
    this.setState({selectedTerm: term.name, listCourse: [], reports: []});
    this.getListCourseOfTerm(term);
  }
  onPressSelectCourse(course) {
    this.setState({selectedCourse: course, reports: []});
    this.getReportOfCourse(course);
  }

  onPressOnSlot(slot) {
    let {reports} = this.state;
    for (let i = 0; i < reports.length; i++) {
      if (reports[i].no === slot.no) {
        reports[i].isShowMore = !reports[i].isShowMore;
      }
    }
    this.setState({reports: reports});
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  render() {
    const {
      listTerm,
      listCourse,
      reports,
      isLoadingTerm,
      isLoadingCourse,
      isLoadingReport,
      selectedTerm,
    } = this.state;
    return (
      <View style={Style.common.container}>
        <StatusBar hidden={false} backgroundColor="orange" />
        <View style={Style.common.header}>
          <Text style={Style.common.labelTitle}>BÁO CÁO ĐIỂM DANH</Text>
          {isLoadingTerm ? (
            <View style={{height: 50}}></View>
          ) : (
            <View>
              <Text style={Style.common.labelTitle}>{selectedTerm}</Text>
            </View>
          )}
        </View>
        <View style={Style.calendar.boundSelectDay}>
          {isLoadingTerm ? (
            <View
              style={{
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : (
            <FlatList
              horizontal={true}
              data={listTerm}
              keyExtractor={({code}, index) => index}
              initialScrollIndex={listTerm.length - 1}
              renderItem={({item}) => (
                <Text
                  onPress={() => this.onPressSelectTerm(item)}
                  style={[
                    Style.calendar.dayInWeek,
                    this.state.selectedTerm === item.name
                      ? Style.calendar.selectedDay
                      : Style.calendar.notSelectedDay,
                  ]}>
                  {item.name}
                </Text>
              )}
            />
          )}
        </View>
        <View
          style={[
            Style.calendar.flexRow,
            {
              height: 550,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 15,
              marginTop: 15,
            },
          ]}>
          <View style={{width: 110}}>
            {isLoadingCourse ? (
              <ActivityIndicator size="large" color="green" />
            ) : (
              <View>
                {listCourse.length && listCourse.length == 0 ? (
                  <View />
                ) : (
                  <FlatList
                    data={listCourse}
                    keyExtractor={({course}, index) => course}
                    renderItem={({item}) => (
                      <Text
                        onPress={() => this.onPressSelectCourse(item.course)}
                        style={[
                          this.state.selectedCourse === item.course
                            ? Style.calendar.selectedDay
                            : Style.calendar.notSelectedDay,
                          {padding: 20},
                        ]}>
                        {item.code}
                      </Text>
                    )}
                  />
                )}
              </View>
            )}
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: 'green',
              marginLeft: 5,
            }}>
            {isLoadingReport ? (
              <ActivityIndicator size="large" color="green" />
            ) : (
              <View>
                {reports.length && reports.length == 0 ? (
                  <View />
                ) : (
                  <FlatList
                    data={reports}
                    keyExtractor={({no}, index) => no + ''}
                    renderItem={({item}) => (
                      <View style={{padding: 10}}>
                        <View style={Style.calendar.flexRow}>
                          <Text onPress={() => this.onPressOnSlot(item)}>
                            {item.date + ' - '}
                          </Text>
                          <Text
                            onPress={() => this.onPressOnSlot(item)}
                            style={
                              item.status === 'Present'
                                ? Style.calendar.attended
                                : Style.calendar.absent
                            }>
                            {item.status}
                          </Text>
                        </View>
                        {item.isShowMore ? (
                          <View>
                            <Text
                              onPress={() => this.onPressOnSlot(item)}
                              style={{padding: 10}}>
                              {'No: ' + item.no}
                            </Text>
                            <Text
                              onPress={() => this.onPressOnSlot(item)}
                              style={{padding: 10}}>
                              {'Slot: ' + item.slot}
                            </Text>
                            <Text
                              onPress={() => this.onPressOnSlot(item)}
                              style={{padding: 10}}>
                              {'Giáo viên: ' + item.lecturer}
                            </Text>
                          </View>
                        ) : (
                          <View />
                        )}
                      </View>
                    )}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
