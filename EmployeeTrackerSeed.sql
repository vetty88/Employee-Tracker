USE employeetrackerdb; 

INSERT INTO employee 
    (employeeId,
    firstName, 
    lastName, 
    roleId, 
    managerId) 
    
VALUES      
    (1, "yvette", 
    "waller", 
    2, 
    2),

    (2, "travis", 
    "hammond", 
    6,
    0),

    (3, "rohan", 
    "hood", 
    5, 
    4),

    (4, "lex", 
    "hammond", 
    1,
    0);

INSERT INTO role 
    (roleId, 
    title, 
    salary,
    departmentId) 

VALUES      
    (1, "sales lead", 
        80000, 
        1), 
    (2, "software engineer", 
        100000, 
        2), 
    (3, "lawyer", 
        120000, 
        3), 
    (4, "accountant", 
        80000, 
        4), 
    (5, "salesperson", 
        40000, 
        1), 
    (6, "lead engineer", 
        120000, 
        2), 
    (7, "legal team lead", 
        200000, 
        3); 

INSERT INTO department 
    (departmentId,
    departmentName)
VALUES      (1, "sales"), 
            (2, "engineering"), 
            (3, "legal"), 
            (4, "finance"), 
            (5, "marketing"); 

 