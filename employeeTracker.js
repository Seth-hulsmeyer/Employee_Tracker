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
        //rawlist from roles table?
        type: "list",
        name: "roles",
        message: "What is the employee's role?",
        choices: [
          "Sales Lead",
          "Sales Person",
          "Lead Engineer",
          "Software Engineer",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
        ],
      },
      {
        type: "rawlist",
        name: "manager",
        //How to add none as an option? Need to display all employees
        choices() {
          const managerArray = []; //empty array we push the name of managers.
          res.forEach(({ first_name }) => {
            managerArray.push(first_name);
          });
          return managerArray;
        },
        message: "Who is the employee's manager?",
      },
    ])
    .then(({ first_name, last_name, roles, manager }) => {
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
