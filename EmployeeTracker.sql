DROP DATABASE IF EXISTS employeetrackerdb;
CREATE DATABASE employeetrackerdb;
USE employeetrackerdb;

CREATE TABLE department 
    (departmentId int NOT NULL,
    departmentName VARCHAR(30) NOT NULL,
    PRIMARY KEY (departmentId)
    );
    
CREATE TABLE role 
    (roleId INT NOT NULL, 
    title VARCHAR(30)NOT NULL, 
    salary DECIMAL (10,2) NOT NULL, 
    departmentId INT,
    PRIMARY KEY(roleId), 
    FOREIGN KEY (departmentId) REFERENCES department(departmentId)
    );
    
CREATE TABLE employee 
    (employeeId INT NOT NULL, 
    firstName VARCHAR(30) NOT NULL, 
    lastName VARCHAR(30) NOT NULL, 
    roleId INT,
    managerId INT,
    departmentId INT,
    PRIMARY KEY(employeeId),
    FOREIGN KEY (roleId) REFERENCES role(roleId),
    FOREIGN KEY (departmentId) REFERENCES department(departmentId)
    );