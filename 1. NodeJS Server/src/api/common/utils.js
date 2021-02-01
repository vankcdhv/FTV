const moment = require('moment');
module.exports = {
    getDateByDayOfWeek: (day) => {

        let currentDate = new Date();
        let currentDay = currentDate.getDay() === 0 ? 8 : currentDate.getDay() + 1;
        var dateOffset = (24 * 60 * 60 * 1000) * (currentDay - day);
        var myDate = new Date();
        myDate.setTime(myDate.getTime() - dateOffset);
        return myDate;
    },

    appendObject: (obj1, obj2) => {
        Object.keys(obj2).forEach(element => {
            obj1[element] = obj2[element];
        });
        return obj1;
    },

    appendList: (list1, list2) => {
        for (let i = 0; i < list2.length; i++) {
            list1.push(list2[i]);
        }
    },

    stringToDate: (str, format) => {
        var parts = str.split("/");
        var dt = new Date(parseInt(parts[2], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10));
        return dt;
    }
}