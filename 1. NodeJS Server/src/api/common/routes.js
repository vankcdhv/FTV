'use strict';
module.exports = function (app) {
  let fapCtrl = require('../fap/controller');
  let markReportCtrl = require('../mark/controller');
  let timeTableCtrl = require('../timetable/controller');
  let chatbotCtrl = require('../chatbot/controller');
  let profileCtrl = require('../profile/controller');
  let attendanceCtrl = require('../attandance/controller');
  let loginCtrl = require('../login/controller');

  //Use to test
  app.route('/test')
    .get(loginCtrl.getPuppeteer);

  //Keep heroku don't sleep
  app.route('/heroku')
    .get(fapCtrl.keepHeroku)
  app.route('/')
    .get(fapCtrl.get);
  //Add an session to list keep online
  app.route('/fap/keep')
    .get(fapCtrl.keep);
  //remove an session from list keep online
  app.route('/fap/unkeep')
    .get(fapCtrl.unKeep);
  //Get mark
  app.route('/fap/markreport')
    .get(markReportCtrl.getListTerm);
  app.route('/fap/markreport/:term')
    .get(markReportCtrl.getListCourse);
  app.route('/fap/markreport/:term/:course')
    .get(markReportCtrl.getCourse);

  //Get attendance
  app.route('/fap/attendance')
    .get(attendanceCtrl.getListTerm);
  app.route('/fap/attendance/:term')
    .get(attendanceCtrl.getListCourse);
  app.route('/fap/attendance/:term/:course')
    .get(attendanceCtrl.getAttendanceReport);

  //get timetable
  app.route('/fap/timetable')
    .get(timeTableCtrl.get);
  //Facebook chat bot
  app.route('/webhook')
    .get(chatbotCtrl.get)
    .post(chatbotCtrl.post);
  //Get profile
  app.route('/fap/profile')
    .get(profileCtrl.get);
};