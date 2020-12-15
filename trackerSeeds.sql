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
    manager_id INT,
);

INSERT INTO department(dept_name) VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles(title, salary, department_id) VALUES("Sales Lead", 40000.00, 1), ('Salesperson', 27000.00, 1), ("Lead Engineer", 75000.00, 2), ("Software Engineer", 50000.00, 2), ("Accountant", 45000.00, 3), ("Legal Team Lead", 100000.00, 4), ("Lawyer", 80000.00, 4); 

INSERT INTO employee(first_name, last_name,)

