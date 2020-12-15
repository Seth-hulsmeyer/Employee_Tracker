//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
const figlet = require("figlet");

//mySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  //   port: 7000,
  user: "root",
  password: "W!ndows2015",
  database: "trackerDB",
});

//main menu function asks user
const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add an Employee",
          "Remove an Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
      },
    ])
    .then(({ menu }) => {
      switch (menu) {
        case "View All Employees":
          return employeesDisplay();
        case "Add an Employee":
          return addEmployee();
        case "Remove an Employee":
          return removeEmployee();
        case "Update Employee Role":
          return updateRole();
        case "Update Employee Manager":
          return updateManager();
        case "Exit":
          connection.end();
      }
    });
};

//displays table of current employees
const employeesDisplay = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const addEmployee = () => {
  //hitting database for employee data
  let employeeList = ["None"];
  connection.query(
    "SELECT first_name, last_name FROM employee",
    (err, data) => {
      if (err) throw err;
      console.log(data);
      employeeList.push(data);
      console.log(employeeList);
    }
  );

  //hitting database for role data
  const rolesList = [];
  connection.query("SELECT title FROM roles", (err, data) => {
    if (err) throw err;
    rolesList.push(data);
    console.log(rolesList);
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "rawlist",
        name: "roles",
        message: "What is the employee's role?",
        choices: rolesList,
      },
      {
        type: "rawlist",
        name: "manager",
        choices: employeeList,
        message: "Who is the employee's manager?",
      },
    ])
    .then(({ first_name, last_name, roles, manager }) => {
      connection.query("SELECT * FROM roles WHERE ?", (err, data) => {});
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name,
          last_name,
          roles,
          manager,
        },
        (err) => {
          if (err) throw err;
          console.log(`${first_name} has been added to your employee list!`);
          mainMenu();
        }
      );
    });
};

//look at activity 9 in mySQL activities
const removeEmployee = () => {};

const updateRole = () => {};

const updateManager = () => {};

connection.connect((err) => {
  if (err) throw err;
  figlet("Employee Tracker", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    mainMenu();
  });
});
