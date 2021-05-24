var mysql      = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'MySpace_64',
  database : 'employee_db'
});
 
connection.connect();
 
connection.query('SELECT * FROM employee_db.employee', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
});