"use strict";
const cheerio = require("cheerio");
const timeTable = require("../database/timetabledb");
const utils = require("../common/utils");
const timetabledb = require("../database/timetabledb");
const Const = require("../common/const");

class Logic {
  constructor(body) {
    this._body = body;
    //$ = cheerio.load(body);
  }

  getListSlot(slotName, index, html) {
    let list = [];
    let dayInWeek = 2;
    for (let i = index; i < Math.min(html.length, index + 7); i++) {
      let date = utils.getDateByDayOfWeek(dayInWeek);
      let str = $(html[i]).text() === "-" ? null : $(html[i]).text();
      let slot = {
        slot: slotName.slice(5, 6),
        dayInWeek: dayInWeek,
        date: date.getDate() + "/" + (date.getMonth() + 1),
        course: str ? str.split(" at ")[0].split("-")[0].trim() : null,
        status: str ? str.split("(")[1].slice(0, -1) : null,
        room: str ? str.split(" at ")[1].trim().split("(")[0].trim() : null,
      };
      slot["time"] = Const.timeSlot[slot.slot];
    //   console.log(dayInWeek, slot);
      dayInWeek++;
      list.push(slot);
    }
    return list;
  }

  getTimeTable(studentID) {
    let timeTable = [];
    let list = $(this._body).find("td");
    for (let i = 0; i < list.length; i++) {
      let str = $(list[i]).text();
      if (str.startsWith("Slot ")) {
        let slotList = this.getListSlot(str, i + 1, list);
        timeTable.push(slotList);
      }
    }
    for (let i = 0; i < timeTable.length; i++) {
      for (let j = 0; j < timeTable[i].length; j++) {
        let item = timeTable[i][j];
        item["studentid"] = studentID;
        timetabledb.addTimeTable(item)
          .then((res) => {})
          .catch((reason) => console.log(reason));
      }
    }
    return timeTable;
  }
}

module.exports = Logic;
