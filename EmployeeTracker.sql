DROP DATABASE IF EXISTS employeetrackerdb;
CREATE DATABASE employeetrackerdb;

USE employeetrackerdb;

CREATE TABLE employeeTable (
    employeeId  INT AUTO_INCREMENT ,
    firstName VARCHAR(30) NOT NULL, 
    lastName VARCHAR(30) NOT NULL,
    roleId INT,
    title VARCHAR(30),
    managerId INT,
    manager VARCHAR(30), 
    PRIMARY KEY (employeeId)
);

CREATE TABLE roleTable (
    roleId INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL (10,2) NOT NULL, 
    departmentId INT,
    departmentName VARCHAR(30),
    PRIMARY KEY (roleId)
);

CREATE TABLE departmentTable (
    departmentId INT AUTO_INCREMENT ,
    departmentName VARCHAR(30)  NOT NULL,
    PRIMARY KEY (departmentId)
    );