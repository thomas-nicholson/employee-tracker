const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'MySpace_64',
  multipleStatements: true,
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
        });
    })
}

function addRole() {
    connection.query('SELECT * FROM department', function (error, results, fields) {
        if (error) throw error;
        let simpleResults = Object.values(JSON.parse(JSON.stringify(results)));
        var depChoices = simpleResults.map((item) => { return item.name});
        inquirer.prompt([
            {
                type: 'input',
                message: "What would you like to call the new role?",
                name: 'roleName',
            },
            {
                type: 'number',
                message: "What is the salary of the new role?",
                name: 'roleSalary',
            },
            {
                type: 'list',
                message: 'Which department is the new role in?',
                choices: depChoices,
                name: 'roleDepartment',
            },
        ])
        .then((answer) => {
            if (isNaN(answer.roleSalary)) {
                console.log("Could not add new role: **INVALID SALARY**");
                init()
                return;
            }
            let department = simpleResults.find((item) => {
                return item.name === answer.roleDepartment
            })            
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleName}", ${answer.roleSalary}, "${department.id}");`, function(error, results, fields) {
                if (error) throw error;
                console.log("New Role:", answer.roleName, "added");
                init();
            });
        });
    });
}

function addEmployee() {
    connection.query('SELECT * FROM role; SELECT * FROM employee;', function (error, results, fields) {
        if (error) throw error;
        let simpleRoles = Object.values(JSON.parse(JSON.stringify(results[0])));
        var roleChoices = simpleRoles.map((item) => { return item.title});

        let simpleManagers = Object.values(JSON.parse(JSON.stringify(results[1])));
        var managerChoices = simpleManagers.map((item) => {return item.first_name +" "+ item.last_name});
        managerChoices.push("null");
        inquirer.prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName',
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName',
            },
            {
                type: 'list',
                message: 'What role does this employee have?',
                choices: roleChoices,
                name: 'role',
            },
            {
                type: 'list',
                message: 'Which manager does this employee have?',
                choices: managerChoices,
                name: 'manager',
            },
        ])
        .then((answer) => {
            console.log(answer);
            let role = simpleRoles.find((item) => {
                return item.title === answer.role
            });
            let manager = {};
            if (answer.manager === "null") {
                manager.id = null;
            } else {
                manager = simpleManagers.find((item) => {
                    return (item.first_name +" "+ item.last_name) === answer.manager;
                })
            }
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${role.id}, ${manager.id})`, function(error, results, fields) {
                if (error) throw error;
                console.log("New Employee:", answer.firstName, answer.lastName, "added");
                init();
            });
        });
    });
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee; SELECT * FROM role;', function (error, results, fields) {
        if (error) throw error;
        let simpleEmployees = Object.values(JSON.parse(JSON.stringify(results[0])));
        var employeeChoices = simpleEmployees.map((item) => { return item.first_name +" "+ item.last_name});

        let simpleRoles = Object.values(JSON.parse(JSON.stringify(results[1])));
        var roleChoices = simpleRoles.map((item) => {return item.title});
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employees' role would you like to update?",
                choices: employeeChoices,
                name: 'employee',
            },
            {
                type: 'list',
                message: 'What role would you like to update it to?',
                choices: roleChoices,
                name: 'role',
            }
        ])
        .then((answer) => {
            let employee = simpleEmployees.find((item) => {
                return (item.first_name +" "+ item.last_name) === answer.employee
            });
            let role = simpleRoles.find((item) => {
                return item.title === answer.role
            });
            connection.query(`UPDATE employee set role_id=${role.id} WHERE employee.id=${employee.id}`, function(error, results, fields) {
                if (error) throw error;
                console.log("Employee:", answer.employee, "role updated");
                init();
            });
        });
    });
}

function init () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
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