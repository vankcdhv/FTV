'use strict';
const mysql = require('mysql');
const mysql_config = require('../../../config/mysql');
const DBContext = require('./dbcontext-fix');
const config = mysql_config.config;
const pool = mysql.createPool(config);

const test = {
  query: (query, params, callback) => {
    DBContext.getInstance().connection.query(query, params, (err, rows) => {
      if (!err) {
        callback(null, rows);
      } else {
        if (err.code = 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code == 'PROTOCOL_CONNECTION_LOST') {

        }
        callback(err, null);
      }
    });
  }
}

const db = {
  query: (query, params, callback) => {
    sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    pool.getConnection((err, connection) => {
      if (err) {
        (async (err) => {
          if (err.code == 'ER_USER_LIMIT_REACHED') {
            await sleep(1000);
            db.query(query, params, callback);
          } else
            callback(err, null);
        })(err);
      } else {
        connection.query(query, params, (err, rows) => {
          connection.release();
          (async (err, rows) => {
            if (!err) {
              callback(null, rows);
            } else {
              callback(err, null);
            }
          })(err, rows);
        })
      }
    });
  }
}
module.exports = test