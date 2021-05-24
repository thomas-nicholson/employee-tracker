const mysql = require('mysql');
const inquirer = require('inquirer');


var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'MySpace_64',
  database : 'employee_db'
});
 
connection.connect();
 /*
connection.query('SELECT * FROM employee_db.employee', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
});*/

function viewDepartments() {
    
}

function viewRoles() {

}

function viewEmployees() {

}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployeeRole() {

}

function init () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Would you like to add an engineer or an intern to your team? or finish building your team?',
            choices: [
                "View Departments",
                "View Roles",
                "View Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role"
            ],
            name: 'initialChoice',
        },
    ])
    .then((answer) => {
        switch(answer.initialChoice) {
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            default:
              // code block
          }
    })
    .catch(error => {
        console.log(error);   
    });
}

init();