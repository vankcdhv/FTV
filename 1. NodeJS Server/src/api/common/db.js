'use strict';
const mysql = require('mysql');
const mysql_config = require('../../../config/mysql');
const {
  response
} = require('express');

const config = mysql_config.config;

const pool = mysql.createPool(config);
const db = {
  query: (query, params, callback) => {
    pool.query(query, params, (err, response) => {
      if (err) {
        callback(err, null);
        console.log(query, err);
      } else {
        callback(null, response);
      }
    })
  }
}
module.exports = db