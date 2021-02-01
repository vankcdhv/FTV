'use strict';
const mysql = require('mysql');
const mysql_config = require('../../../config/mysql');

const config = mysql_config.config;

const pool = mysql.createPool(config);
const DBContext = (() => {
  const getConnection = (callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        (async (err) => {
          if (err.code == 'ER_USER_LIMIT_REACHED') {
            await sleep(1000);
            console.log('Max connection');
            getConnection(callback);
          } else {
            callback(err, null);
          }
        })(err);
      } else {
        callback(null, connection);
      }
    })
  }

  function dBContext() {
    getConnection((err, connection) => {
      if (err) {
        console.log(err);
      } else {
        this.connection = connection;
        console.log('Get connection complete');
      }
    })
  }

  var instance;

  var _static = {
    getInstance: function (reset = false) {

      if (instance === undefined || instance === null || reset) {
        instance = new dBContext();
      }
      return instance;
    }
  }
  return _static;
})();
module.exports = DBContext;