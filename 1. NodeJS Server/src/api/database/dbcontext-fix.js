'use strict';

const mssql = require('mssql');
const config = {
  server: '139.180.214.58',
  port: 1433,
  user: 'sa',
  password: '@Codera3k48',
  database: 'fapdb',
  options: {
    "encrypt": true,
    "enableArithAbort": true
  }
}



const DBContext = (() => {

  function dBContext() {
    this.query = (querySTR, params, callback) => {
      mssql.connect(config, (error) => {
        if (error) {
          console.log(error);
          callback(error, null);
        } else {
          let query = querySTR;
          let sqlRequest = new mssql.Request();
          if (params && params.length > 0) {
            for (let i = 0; i < params.length; i++) {
              let item = params[i];
              sqlRequest.input('param' + i, item);
              query = query.replace('?', '@param' + i)
            }
          }
          console.log(query);
          sqlRequest.query(query, (err, res) => {
            if (err) {
              callback(err, null);
              console.log(err)
            } else {
              console.table(res.recordset);
              callback(null, res.recordset);
            }
            //mssql.close();
          });
        }
      });
    }
    this.insert = (querySTR, entity, callback) => {
      mssql.connect(config, (error) => {

        if (error) {
          callback(error, null);
        } else {

          let sqlRequest = new mssql.Request();
          let cols = [];
          let inputs = [];
          for (let k in entity) {
            sqlRequest.input(k, entity[k]);
            cols.push(k);
            inputs.push('@' + k);
          }
          let query = querySTR + ' (' + cols.toString() + ') values (' + inputs.toString() + ')';
          console.log(query);
          sqlRequest.query(query, (err, res) => {
            if (err) {
              callback(err, null)
            }
            else {
              callback(null, res.rowsAffected);
            }
            //mssql.close();
          });
        }
      });
    }
    this.update = (querySTR, entity, params, callback) => {
      mssql.connect(config, (error) => {

        if (error) {
          callback(error, null);
        } else {
          let sqlRequest = new mssql.Request();
          let cols = [];
          let values = [];
          let paramList = [];
          let inputs = [];
          for (let k in entity) {
            sqlRequest.input(k, entity[k]);
            cols.push(k);
            values.push('@' + k);
          }
          for (let i = 0; i < params.length; i++) {
            let item = params[i];
            sqlRequest.input('param' + item.key, item.value);
            paramList.push(item.key);
            inputs.push('@param' + item.key);
          }
          let query = querySTR + ' SET ';
          for (let i = 0; i < cols.length; i++) {
            if (i < cols.length - 1) {
              query = query + cols[i] + ' = ' + values[i] + ', ';
            } else {
              query = query + cols[i] + ' = ' + values[i];
            }
          }
          if (params && params.length > 0) {
            query = query + ' WHERE ';
            for (let i = 0; i < paramList.length; i++) {
              if (i < paramList.length - 1) {
                query = query + paramList[i] + ' = ' + inputs[i] + ' AND ';
              } else {
                query = query + paramList[i] + ' = ' + inputs[i];
              }
            }
          }
          console.log(query);
          sqlRequest.query(query, (err, res) => {
            if (err) {
              callback(err, null)
            }
            else {
              callback(null, res.rowsAffected);
            }
            //mssql.close();
          });
        }
      });
    }
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