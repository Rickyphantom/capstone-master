const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '172.20.10.4', // Ubuntu의 IP
  user: 'test1',
  password: 'test1',
  database: 'my_db',
  port: 3306,
});

module.exports = pool.promise();
