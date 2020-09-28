import AsyncStorage from '@react-native-community/async-storage';
import {Get} from './request';

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
const checkSession = () => {
  return new Promise((resolve, reject) => {
    getCookie().then((result) => {
      if (result) {
        console.log(result);
        let headers = new Headers({
          cookie: 'ASP.NET_SessionId=' + result,
        });
        Get('https://test-fap-api.herokuapp.com/fap/keep', headers)
          .then((result) => {
            resolve(result);
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

export {checkSession};
