import {StyleSheet} from 'react-native';
import * as Utils from '../common/utils';
import * as Const from '../common/const';

export const common = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f5'},
  header: {
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: Utils.scale(20, Const.Vertical),
    backgroundColor: 'orange',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  labelTitle: {
    fontSize: Utils.scale(40, Const.Horizontal),
    color: 'white',
    fontFamily: 'OpenSansCondensed-Light',
  },
});
export const calendar = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f5'},
  header: {
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: Utils.scale(20, Const.Vertical),
    backgroundColor: 'orange',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  labelTitle: {
    fontSize: Utils.scale(40, Const.Horizontal),
    color: 'white',
    fontFamily: 'OpenSansCondensed-Light',
  },
  nowDate: {
    fontSize: Utils.scale(60, Const.Horizontal),
    color: 'white',
    fontFamily: 'OpenSansCondensed-Light',
  },
  nowDay: {
    fontSize: Utils.scale(30, Const.Horizontal),
    color: 'white',
    fontFamily: 'OpenSansCondensed-Light',
    marginBottom: 5,
    marginTop: 'auto',
  },
  boundNowMonthYear: {
    alignItems: 'center',
    marginLeft: Utils.scale(10, Const.Horizontal),
    borderLeftColor: 'white',
    borderLeftWidth: 1,
    paddingLeft: Utils.scale(10, Const.Horizontal),
  },
  nowYear: {
    fontSize: Utils.scale(30, Const.Horizontal),
    color: 'white',
    fontFamily: 'OpenSansCondensed-Light',
    marginTop: 'auto',
    marginBottom: Utils.scale(5, Const.Vertical),
  },
  nowMonth: {
    fontSize: Utils.scale(60, Const.Horizontal),
    color: 'white',
    fontFamily: 'OpenSansCondensed-Light',
  },
  boundSelectDay: {
    backgroundColor: 'white',
    marginTop: Utils.scale(10, Const.Vertical),
    borderRadius: 15,
  },
  greenCircle: {
    borderRadius: 100,
    width: Utils.scale(14, Const.Horizontal),
    height: Utils.scale(14, Const.Horizontal),
    marginHorizontal: Utils.scale(5, Const.Horizontal),
    marginTop: Utils.scale(3, Const.Vertical),
    backgroundColor: '#00ff00',
  },
  listBound: {
    flex: 1,
    paddingHorizontal: Utils.scale(60, Const.horizontal),
    paddingVertical: Utils.scale(60, Const.Vertical),
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: Utils.scale(15, Const.Vertical),
  },
  dayInWeek: {
    paddingHorizontal: Utils.scale(25, Const.horizontal),
    paddingVertical: Utils.scale(25, Const.Vertical),
  },
  selectedDay: {
    color: 'green',
    fontWeight: 'bold',
  },
  notSelectedDay: {
    color: 'black',
  },
  attended: {
    color: 'green',
  },
  absent: {
    color: 'red',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: 'green',
    paddingLeft: Utils.scale(20, Const.Horizontal),
  },
});

export const mark = StyleSheet.create({});
export const attendance = StyleSheet.create({});
export const home = StyleSheet.create({});
