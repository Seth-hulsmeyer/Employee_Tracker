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
          "Add a New Role",
          "Add a New Department",
          "View Departments",
          "Update Employee Role",
          "Remove an Employee",
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
        case "Add a New Role":
          return addRole();
        case "Add a New Department":
          return addDepartment();
        case "View Departments":
          return viewDepartments();
        case "Update Employee Role":
          return updateRole();
        case "Remove an Employee":
          return removeEmployee();
        case "Exit":
          connection.end();
      }
    });
};

//displays table of current employees
const employeesDisplay = () => {
  //create left join? HOW TO GET MANAGERS TO POPULATE
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name FROM department RIGHT JOIN roles ON department.id = roles.department_id RIGHT JOIN employee ON roles.id = employee.role_id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
};

const addEmployee = () => {
  //hitting database for role data
  connection.query("SELECT id, title FROM roles", (err, data) => {
    if (err) throw err;
    const rolesList = data.map((empRoles) => {
      return {
        name: empRoles.title,
        value: empRoles.id,
      };
    });

    //hitting database for employee data
    let employeeList = [];
    connection.query(
      "SELECT id, first_name, last_name FROM employee",
      (err, datum) => {
        if (err) throw err;
        // employeeList = [...datum];
        employeeList = datum.map((empManagers) => {
          return {
            name: empManagers.first_name + " " + empManagers.last_name,
            value: empManagers.id,
          };
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
              type: "list",
              name: "role_id",
              message: "What is the employee's role?",
              choices: rolesList,
            },
            {
              type: "list",
              name: "manager_id",
              choices: [...employeeList, "None"],
              message: "Who is the employee's manager?",
            },
          ])
          .then(({ first_name, last_name, role_id, manager_id }) => {
            manager_id === "None"
              ? (manager_id = 0)
              : (manager_id = manager_id);
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name,
                last_name,
                role_id,
                manager_id,
              },
              (err) => {
                if (err) throw err;
                console.log(
                  `${first_name} has been added to your employee list!`
                );
                mainMenu();
              }
            );
          });
      }
    );
  });
};

const addRole = () => {
  connection.query("SELECT id, dept_name FROM department", (err, response) => {
    if (err) throw err;
    const deptArray = response.map((deptList) => {
      return {
        name: deptList.dept_name,
        value: deptList.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What role would you like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this position?",
        },
        {
          type: "list",
          name: "department_id",
          message: "What department would you like to assign this role to?",
          choices: deptArray,
        },
      ])
      .then(({ title, salary, department_id }) =>
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title,
            salary,
            department_id,
          },
          (err) => {
            if (err) throw err;
            console.log(`${title} has been added to your roles!`);
            mainMenu();
          }
        )
      );
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept_name",
        message: "What is the new department you would like to add?",
      },
    ])
    .then(({ dept_name }) =>
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name,
        },
        (err) => {
          if (err) throw err;
          console.log(`${dept_name} has been added to your departments!`);
          mainMenu();
        }
      )
    );
};

const viewDepartments = () => {};

//look at activity 9 in mySQL activities
const updateRole = () => {};

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
