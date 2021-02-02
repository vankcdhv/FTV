const sql = require('mssql');
const dbcontext = require('./src/api/database/dbcontext');
const config = {
    server: 'DESKTOP-1EG1KM5',
    port: 1433,
    user: 'sa',
    password: '123',
    database: 'fapdb',
    options: {
        "encrypt": true,
        "enableArithAbort": true
    }
}
const myObject = {
    course: 'HCM201',
    code: '1111',
    class: 'se1304',
    name: 'Tư tưởng Hồ Chí Minh',
    start: '20/12/2020'
}
const newObject = {
    course: 'HCM201_C',
    code: '1111_C',
    class: 'se1304',
    name: 'Tư tưởng Hồ Chí Minh',
    start: '20/12/2020'
}


const params = [
    {
        key: 'code',
        value: '1111'
    },
    {
        key: 'class',
        value: 'se1304'
    }
]


dbcontext.insert('INSERT INTO Course', newObject, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
})
dbcontext.update('UPDATE Course', myObject, params, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
})
