USE employeetrackerdb; 

INSERT INTO employee 
    (employeeId,
    firstName, 
    lastName, 
    roleId,
    title,
    managerId, 
    manager) 
    
VALUES      
    (1, "yvette", 
    "waller", 
    2, "software engineer", 
    2, "travis hammond"),

    (2, "travis", 
    "hammond", 
    6, "lead engineer",
    0, "NULL"),

    (3, "rohan", 
    "hood", 
    5, "salesperson", 
    4, "lex hammond"),

    (4, "lex", 
    "hammond", 
    1, "sales lead",
    0, "NULL");

INSERT INTO role 
    (roleId, 
    title, 
    salary,
    departmentId,
    departmentName) 

VALUES      
    (1, "sales lead", 
        80000, 
        1, "sales"), 
    (2, "software engineer", 
        100000, 
        2, "engineering"), 
    (3, "lawyer", 
        120000, 
        3, "legal"), 
    (4, "accountant", 
        80000, 
        4, "finance"), 
    (5, "salesperson", 
        40000, 
        1, "sales"), 
    (6, "lead engineer", 
        120000, 
        2, "engineering"), 
    (7, "legal team lead", 
        200000, 
        3, "legal"); 

INSERT INTO department 
    (departmentId,
    departmentName)
VALUES      (1, "sales"), 
            (2, "engineering"), 
            (3, "legal"), 
            (4, "finance"), 
            (5, "marketing"); 
