var mysql      = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  port : 3606,
  user : 'root',
  password : 'MySpace_64',
  database : 'employee_db'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});