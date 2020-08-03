DROP DATABASE IF EXISTS EmployeeTrackerDB;
CREATE database EmployeeTrackerDB;

USE EmployeeTrackerDB;

CREATE TABLE department (
  id INT AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT,
  title VARCHAR(100) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);
  
CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id  INT NULL,
  manager_id  INT NULL,
  PRIMARY KEY (id)
);
