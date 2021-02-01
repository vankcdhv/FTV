import AsyncStorage from '@react-native-community/async-storage';
import {Dimensions} from 'react-native';
import {Get} from './request';
import * as Const from './const';

const getCookie = async () => {
  try {
    const value = await AsyncStorage.getItem('cookie');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

const scale = (unit, direction) => {
  let {width, height} = Dimensions.get('window');
  let result = 0;
  if (direction === Const.Horizontal) {
    result = (unit / Const.dimWidth) * width;
  } else {
    result = (unit / Const.dimHeigth) * height;
  }
  return result;
};

const checkSession = () => {
  return new Promise((resolve, reject) => {
    getCookie().then((result) => {
      if (result) {
        let headers = {
          'host':'test-fap-api.herokuapp.com',
          'cookie': 'ASP.NET_SessionId=' + result,
        };
        Get('https://test-fap-api.herokuapp.com/fap/keep', headers)
          .then((response) => {
            resolve(response);
          })
          .catch((reason) => {
            console.log(reason);
            reject(reason);
          });
      } else {
        reject({
          code: 'NOT_FOUND',
          message: "Don't have any cookie have saved!",
        });
      }
    });
  });
};

export {checkSession, scale};
