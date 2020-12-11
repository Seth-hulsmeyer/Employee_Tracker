//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
var figlet = require("figlet");

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
      } else if (answer.menu === "View All Employees") {
      }
    });
};

const employeesDisplay = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
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
    //ask role, manager
  ]);
  connection.query("INSERT INTO employee SET ?", employee, (err, res) => {
    if (err) throw err;
  });
};

const removeEmployee = () => {};

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
