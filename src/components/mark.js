import React, {Component} from 'react';
import {View, Text, StatusBar, ActivityIndicator, FlatList} from 'react-native';
import {checkSession} from '../common/utils';
import * as Const from '../common/const';
import * as Utils from '../common/utils';
import * as Style from '../style/style';
import * as Request from '../common/request';
import AsyncStorage from '@react-native-community/async-storage';

export default class Mark extends Component {
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
          'https://test-fap-api.herokuapp.com/fap/markreport/0/' + course;
        Request.Get(uri, headers)
          .then((reports) => {
            reports = reports.mark;
            for (let i = 0; i < reports.length; i++) {
              reports[i]['isShowMore'] = false;
            }
            this.setState({reports: reports, isLoadingReport: false});
          })
          .catch((reason) => {
            console.log(reason);
            if (reason.code === 'TIME_OUT') {
              this.props.navigation.navigate('Home');
            }
          });
      })
      .catch((reason) => {
        console.log('Mark screen - get cookie', reason);
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
        let uri = 'https://test-fap-api.herokuapp.com/fap/markreport/' + term;
        Request.Get(uri, headers)
          .then((listCourse) => {
            listCourse = listCourse.listCourse;
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
              this.props.navigation.navigate('Home');
            }
          });
      })
      .catch((reason) => {
        console.log('Mark screen - get cookie', reason);
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
        let uri = 'https://test-fap-api.herokuapp.com/fap/markreport';
        Request.Get(uri, headers)
          .then((listTerm) => {
            listTerm = listTerm.listTerm;
            listTerm = listTerm.slice(1, listTerm.length);
            this.setState({
              listTerm: listTerm,
              isLoadingTerm: false,
              selectedTerm: listTerm[listTerm.length - 1],
            });
            this.getListCourseOfTerm(listTerm[listTerm.length - 1]);
          })
          .catch((reason) => {
            console.log(reason);
            if (reason.code === 'TIME_OUT') {
              this.props.navigation.navigate('Home');
            }
          });
      })
      .catch((reason) => {
        console.log('Mark screen - get cookie', reason);
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
            this.props.navigation.navigate('Home');
          }
        });
    });
  }

  onPressSelectTerm(term) {
    this.setState({selectedTerm: term, listCourse: [], reports: []});
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
          <Text style={Style.common.labelTitle}>BÁO CÁO ĐIỂM</Text>
          {isLoadingTerm ? (
            <View style={{height: Utils.scale(50, Const.Vertical)}} />
          ) : (
            <View>
              <Text style={Style.common.labelTitle}>{selectedTerm}</Text>
            </View>
          )}
        </View>
        <View style={Style.calendar.boundSelectDay}>
          {isLoadingTerm ? (
            <View style={Style.attendance.selectTermLoading}>
              <ActivityIndicator size="large" color="orange" />
            </View>
          ) : (
            <FlatList
              horizontal={true}
              data={listTerm}
              keyExtractor={({item}, index) => index + ''}
              initialScrollIndex={listTerm.length - 1}
              renderItem={({item}) => (
                <Text
                  onPress={() => this.onPressSelectTerm(item)}
                  style={[
                    Style.calendar.dayInWeek,
                    this.state.selectedTerm === item
                      ? Style.common.selectedDay
                      : Style.common.notSelectedDay,
                  ]}>
                  {item}
                </Text>
              )}
            />
          )}
        </View>
        <View style={[Style.common.flexRow, Style.attendance.resultBound]}>
          <View style={{width: Utils.scale(110, Const.Horizontal)}}>
            {isLoadingCourse ? (
              <View style={Style.attendance.selectCourseLoading}>
                <ActivityIndicator size="large" color="orange" />
              </View>
            ) : (
              <View>
                {listCourse.length && listCourse.length === 0 ? (
                  <View />
                ) : (
                  <FlatList
                    data={listCourse}
                    keyExtractor={({course}, index) => course + ''}
                    renderItem={({item}) => (
                      <Text
                        onPress={() => this.onPressSelectCourse(item.course)}
                        style={[
                          this.state.selectedCourse === item.course
                            ? Style.common.selectedDay
                            : Style.common.notSelectedDay,
                          {padding: Utils.scale(20, Const.Horizontal)},
                        ]}>
                        {item.id}
                      </Text>
                    )}
                  />
                )}
              </View>
            )}
          </View>
          <View style={Style.attendance.reportsBound}>
            {isLoadingReport ? (
              <View style={Style.attendance.reportsLoading}>
                <ActivityIndicator size="large" color="orange" />
              </View>
            ) : (
              <View>
                {reports.length && reports.length === 0 ? (
                  <View />
                ) : (
                  <FlatList
                    data={reports}
                    keyExtractor={({gradeItem}, index) => gradeItem}
                    renderItem={({item}) => (
                      <View
                        style={{padding: Utils.scale(10, Const.Horizontal)}}>
                        <View style={Style.common.flexRow}>
                          <Text onPress={() => this.onPressOnSlot(item)}>
                            {item.gradeItem + ' - '}
                          </Text>
                          <Text onPress={() => this.onPressOnSlot(item)}>
                            {item.weight + '% : '}
                          </Text>
                          <Text
                            onPress={() => this.onPressOnSlot(item)}
                            style={Style.common.future}>
                            {item.value}
                          </Text>
                        </View>
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
