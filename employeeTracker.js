//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
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
    .then((answer) => {
      if (answer.menu === "View All Employees") {
        employeesDisplay();
      } else if (answer.menu === "Add an Employee") {
        addEmployee();
      } else if (answer.menu === "Remove an Employee") {
        removeEmployee();
      } else if (answer.menu === "Update Employee Role") {
        updateRole();
      } else if (answer.menu === "Update Employee Manager") {
        updateManager();
      } else if (answer.menu === "Exit") {
        //close menu and save to db
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
  inquirer.prompt([
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
      type: "list",
      name: "roles",
      message: "What is the employee's role?",
      choices: [],
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: [],
    },
  ]);
  connection.query("INSERT INTO employee SET ?", employee, (err, res) => {
    if (err) throw err;
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
