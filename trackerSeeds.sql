DROP DATABASE IF EXISTS trackerDB;

CREATE DATABASE trackerDB;

USE trackerDB;

-- department table --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

-- role table --
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL, 
    FOREIGN KEY(department_id) REFERENCES department(id)
);

-- employee table --
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY(role_id) REFERENCES roles(id),
    manager_id INT
);

INSERT INTO department(dept_name) VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles(title, salary, department_id) VALUES("Sales Lead", 40000.00, 1), ('Salesperson', 27000.00, 1), ("Lead Engineer", 75000.00, 2), ("Software Engineer", 50000.00, 2), ("Accountant", 45000.00, 3), ("Legal Team Lead", 100000.00, 4), ("Lawyer", 80000.00, 4); 

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, null);

USE trackerDB;
SELECT * FROM employee;
SELECT * FROM roles;
SELECT * FROM department;

SELECT e.id, e.first_name, e.last_name, title, salary, dept_name, CONCAT(m.first_name, ' ', m.last_name)
AS "Manager" FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id
LEFT JOIN roles ON e.role_id = (roles.id)
LEFT JOIN department ON roles.department_id = (department.id)
ORDER by e.id;

USE trackerDB;
SELECT * FROM roles LEFT JOIN department ON roles.department_id = (department.id)


SELECT employee.id, first_name, last_name, title, dept_name FROM employee 
LEFT JOIN roles ON employee.role_id = (roles.id) 
LEFT JOIN department ON roles.department_id = (department.id) WHERE dept_name = 'Sales' ORDER by employee.id;
