const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'MySpace_64',
  database : 'employee_db'
});
 
connection.connect();

function viewDepartments() {
    connection.query('SELECT * FROM department', function (error, results, fields) {
        if (error) throw error;
        console.table(results);
        init();
    });
}

function viewRoles() {
    connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id=department.id', function (error, results, fields) {
        if (error) throw error;
        console.table(results);
        init();
    });
}

function viewEmployees() {
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title, department.name AS department,r.salary, concat(m.first_name,' ', m.last_name) AS manager FROM ((employee AS e LEFT JOIN role AS r ON e.role_id=r.id) INNER JOIN department ON r.department_id=department.id) LEFT JOIN employee AS m ON e.manager_id=m.id ORDER BY e.id ASC;", function (error, results, fields) {
        if (error) throw error;
        console.table(results);
        init();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: "Would you like to call the new department?",
            name: 'departmentName',
        },
    ])
    .then((answer) => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.departmentName}");`, function(error, results, fields) {
            if (error) throw error;
            console.log("New Department:", answer.departmentName, "added");
            init();
        })
    })
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