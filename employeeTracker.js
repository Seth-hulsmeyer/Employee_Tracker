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

//main menu of all options given to user
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
          "View Roles",
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
        case "View Roles":
          return viewRoles();
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
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, title, salary, dept_name, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN roles ON e.role_id = (roles.id) LEFT JOIN department ON roles.department_id = (department.id) ORDER by e.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
};

//adds employee to employee table
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

//adds role to roles table
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

//adds department to department table
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

//allows user to view all employees in a chosen department
const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    const deptList = data.map((departArr) => {
      return {
        name: departArr.dept_name,
        id: departArr.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "dept_name",
          message: "Please choose a department to view.",
          choices: deptList,
        },
      ])
      .then((answer) => {
        const query =
          "SELECT employee.id, first_name, last_name, title, dept_name FROM employee LEFT JOIN roles ON employee.role_id = (roles.id) LEFT JOIN department ON roles.department_id = (department.id) WHERE ? ORDER by employee.id";
        connection.query(query, { dept_name: answer.dept_name }, (err, res) => {
          if (err) throw err;
          console.table(res);
          mainMenu();
        });
      });
  });
};

//displays all roles
const viewRoles = () => {
  connection.query(
    "SELECT roles.id, title, salary, dept_name FROM roles LEFT JOIN department ON roles.department_id = (department.id)",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );
};

//updates an employees role and asks to change manager
const updateRole = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    (err, res) => {
      if (err) throw err;
      const empArray = res.map((empList) => {
        return {
          name: empList.first_name + " " + empList.last_name,
          value: empList.id,
        };
      });
      connection.query("SELECT id, title FROM roles", (error, response) => {
        if (error) throw error;
        const newRolesArray = response.map((roleList) => {
          return {
            name: roleList.title,
            value: roleList.id,
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "id",
              message: "What employee's role would you like to change?",
              choices: empArray,
            },
            {
              type: "list",
              name: "role_id",
              message: "Select a New role for this employee",
              choices: newRolesArray,
            },
          ])
          // return roles to choose from.
          .then(({ id, role_id }) =>
            connection.query(
              "UPDATE employee SET role_id = ? WHERE id = ?",
              [role_id, id],
              (err) => {
                if (err) throw err;
                console.log(`Employee's role has been updated!`);
                mainMenu();
              }
            )
          );
      });
    }
  );
};

//removes an employee from employee table
const removeEmployee = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    (err, res) => {
      if (err) throw err;
      const empArray = res.map((empList) => {
        return {
          name: empList.first_name + " " + empList.last_name,
          value: empList.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "id",
            message: "Which Employee would you like to remove?",
            choices: empArray,
          },
        ])
        .then(({ id }) => {
          connection.query("DELETE FROM employee WHERE id = ?", [id], (err) => {
            if (err) throw err;
            console.log(`Employee has been removed from the table.`);
            mainMenu();
          });
        });
    }
  );
};

//connection listener
connection.connect((err) => {
  if (err) throw err;
  //title display
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
