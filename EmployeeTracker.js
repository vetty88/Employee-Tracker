/*jshint esversion: 8 */

// Dependencies
const chalk = require('chalk');
const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');
const clear = require('console-clear');
const promisemysql = require("promise-mysql");

// MySQL DB Connection Information (remember to change this with your specific credentials)
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "EmployeeTrackerdb"
});

// Initiate MySQL Connection.
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    startApp();
});

//-----start the Employee Tracker
const departmentsArray = [];
const employeeArray = [];
const roleArray = [];

// Function to query database and gather all departments and add them to the departmentsArray.
getDepartments = () => {
    connection.query("SELECT * FROM departmentTable", function(err, result) {
        if (err) throw err;
        result.forEach(departmentTable => {
            if (!departmentsArray.includes(departmentTable.departmentId)) {
                departmentsArray.push({
                    departmentName: departmentTable.departmentName,
                    departmentId: departmentTable.departmentId
                });
            }
        });
    });
};

getEmployees = () => {
    connection.query("SELECT * FROM employeeTable", function(err, result) {
        if (err) throw err;
        result.forEach(employeeTable => {
            if (!employeeArray.includes(employeeTable.employeeId)) {
                employeeArray.push({
                    name: employeeTable.firstName + " " + employeeTable.lastName,
                    employeeId: employeeTable.employeeId,
                    role: employeeTable.roleId,
                    managerId: employeeTable.managerId
                });
            }
        });
    });
};

getRoles = () => {
    connection.query("SELECT * FROM roleTable", function(err, result) {
        if (err) throw err;
        result.forEach(roleTable => {
            if (!roleArray.includes(roleTable.roleId)) {
                roleArray.push(roleTable.title);
            }
        });
    });
};

getDepartments();
getEmployees();
getRoles();

function startApp() {
    clear();
    renderImage();
    menuPrompt();
}

// render image
function renderImage() {
    console.log("Ｅ Ｍ Ｐ Ｌ Ｏ Ｙ Ｅ Ｅ      －  －  －  Ｔ Ｒ Ａ Ｃ Ｋ Ｅ Ｒ");
}

//render table data and menu prompt
function renderScreen(tableTitle, tableData) {
    clear();
    renderImage();
    //log table title to console in inverse colors
    console.log(chalk.inverse.bold(tableTitle));
    //log table to console
    console.table(tableData);
    //menu prompt
    menuPrompt();
}

//initial prompt - which type of query?
function menuPrompt() {
    inquirer
        .prompt({
            type: "list",
            name: "promptChoice",
            message: "Make a selection:",
            choices: ["View All Employees", "View Roles", "View Departments", "Add Employee", "Add Departments", "Remove Employee", "Remove Role", "Remove Department", "Update Employee Role", chalk.red("Exit Program")]
        })
        .then(answer => {
            switch (answer.promptChoice) {
                case "View All Employees":
                    queryEmployeesAll();
                    break;

                case "View Roles":
                    queryRolesOnly();
                    break;

                case "View Departments":
                    queryDepartments();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                // case "Add Roles":
                //     addRole();
                //     break;

                case "Add Departments":
                    addDepartment();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "Remove Department":
                    removeDepartment();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                // case "Update Employee Manager":
                //     updateEmployeeManager();
                //     break;

                case "\u001b[31mExit Program\u001b[39m":
                    clear();
                    process.exit();
            }
        });
}


//query/view all employees
function queryEmployeesAll() {
    const query = `
    SELECT employeeId, firstName, lastName, roleId, title, managerId, manager
    FROM employeeTable AS eTable
    `;

    connection.query(query, (err, res) => {
        if (err) throw err;
        //build table data array from query result
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({
                "ID": res[i].employeeId,
                "First Name": res[i].firstName,
                "Last Name": res[i].lastName,
                "Role ID": res[i].roleId,
                "Title": res[i].title,
                "Manager ID": res[i].managerId,
                "Manager": res[i].manager,
            });
        }
        //render screen
        renderScreen("All Employees", tableData);
    });
}


// Query the Roles only and display them for viewing
function queryRolesOnly() {
    const query = `SELECT roleId, title FROM roleTable;`;
    //build table data array from query result
    connection.query(query, (err, res) => {
        if (err) throw err;
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({
                "ID": res[i].roleId,
                "Roles": res[i].title
            });
        }
        // Show the Roles
        renderScreen("All Roles", tableData);
    });
}


//query/view all departments
function queryDepartments() {
    const query = `SELECT departmentName FROM departmentTable;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract department names to array
        const departments = [];
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].departmentName);
        }
        // Show the Roles
        renderScreen("All Departments", departments);
    });
}


function queryDepartmentsCallBack(callback) {
    const query = `SELECT departmentName FROM departmentTable;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract department names to array
        const departments = [];
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].departmentName);
        }
        //prompt for department selection
        callback(departments);
    });
}

// Query the departments without employees
function queryDepartmentsOnly() {
    const query = `SELECT departmentId, departmentName FROM departmentTable;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract department names to array
        const tableData = [];
        for (let i = 0; i < res.length; i++) {
            tableData.push({
                "ID": res[i].departmentId,
                "Departments": res[i].departmentName
            });
        }
        // Show the departments
        renderScreen(`All Departments`, tableData);
    });
}

//-----add / remove / update functions

//add employee
addEmployee = () => {
    inquirer
        .prompt([{
                type: "input",
                message: "Please enter the employee's first name.",
                name: "employeeFirstName"
            },
            {
                type: "input",
                message: "Please enter the employee's last name.",
                name: "employeeLastName"
            },
            {
                type: "list",
                message: "Please select the employee's role.",
                name: "employeeRole",
                choices: roleArray
            },
            {
                type: "list",
                message: "Please select the employee's manager.",
                name: "employeeManager",
                choices: employeeArray
            }
        ])
        .then(function({
            employeeFirstName,
            employeeLastName,
            employeeRole,
            employeeManager
        }) {
            // Due to the way inquirer handles response objects, setting new variables to translate employeeRole and
            // employeeManager into their corresponding IDs.
            let roleId;
            let managerId;
            connection.query("SELECT * FROM roleTable", function(err, res) {
                if (err) throw err;
                res.forEach(roleTable => {
                    if (roleTable.title === employeeRole) {
                        roleId = roleTable.roleId;
                    }
                });
                connection.query("SELECT * FROM employeeTable", function(err, res) {
                    if (err) throw err;
                    res.forEach(employeeTable => {
                        if (
                            employeeTable.firstName + " " + employeeTable.lastName ===
                            employeeManager
                        ) {
                            managerId = employeeTable.employeeId;
                        }
                    });
                    connection.query(
                        "INSERT INTO employeeTable (firstName, lastName, roleId, title, managerId, manager) VALUES (?, ?, ?, ?, ?, ?);",
                        [employeeFirstName, employeeLastName, roleId, employeeRole, managerId, employeeManager],
                        function(err, res) {
                            if (err) throw err;
                            console.log(
                                `${employeeFirstName} was added.`);
                            //show updated employee table
                            setTimeout(queryEmployeesAll, 2500);
                        }
                    );
                });
            });
        });
};

// function addRole() {

//     getDepartments();
//     getRoles();
    
//     inquirer
//         .prompt([{
//                 name: "title",
//                 type: "input",
//                 message: "Enter new role title:",
//                 validate: async function confirmStringInput(input) {
//                     if (input.trim() != "" && input.trim().length <= 30) {
//                         return true;
//                     }
//                     return "Invalid input. Please limit your input to 30 characters or less.";
//                 },
//             },
//             {
//                 name: "salary",
//                 type: "input",
//                 message: "Enter role salary:",
//                 validate: (input) => {
//                     if (!input.match(/^[0-9]+$/)) {
//                         return "Please enter a number".yellow;
//                     }
//                     return true;
//                 }
//             },
//             {
//                 type: "list",
//                 name: "roleDept",
//                 message: "Select department:",
//                 choices: departmentsArray
                
//             },
//         ])
//         .then((answer) => {

//             let deptID = departmentsArray.find((obj) => obj.name === answer.title).id;
//             connection.query("INSERT INTO roleTable (title, salary, departmentId) VALUES (?, ?, ?, ?)",
//             [answer.title, answer.salary, deptID, answer.roleDept], (err, res) => {
//                 if (err) throw err; 
//                 console.log(
//                     `${answer.title} was added to the ${answer.roleDept} department.`);
//                     queryRolesOnly();
//             });
           
//         });
    
// } 
               

function addDepartment() {

    inquirer
        .prompt([{
            name: "departmentName",
            type: "input",
            message: "Enter new Department Name:",
            validate: async function confirmStringInput(input) {
                if (input.trim() != "" && input.trim().length <= 30) {
                    return true;
                }
                return "Invalid input. Please limit your input to 30 characters or less.";
            },
        }, ])
        .then((answer) => {
            const query = `INSERT INTO departmentTable (departmentName) VALUES (?);`;
            connection.query(query, [answer.departmentName], (err, res) => {
                if (err) throw err;
                console.log("  New Department added successfully!");
                queryDepartmentsCallBack(function(departments) {
                    renderScreen("departments", departments);
                });
            });

        });
}


// Remove an employee from the database
function removeEmployee() {
    const query = `
    SELECT employeeTable.employeeId, concat(employeeTable.firstName, " ", employeeTable.lastName) AS employeeFullName
    FROM employeeTable ;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract employee names and ids
        let employees = [];
        let employeesNames = [];
        for (let i = 0; i < res.length; i++) {
            employees.push({
                employeeId: res[i].employeeId,
                fullName: res[i].employeeFullName
            });
            employeesNames.push(res[i].employeeFullName);
        }
        //prompt for employee to remove
        inquirer
            .prompt({
                type: "list",
                name: "employeePromptChoice",
                message: "Select employee to delete:",
                choices: employeesNames
            })
            .then(answer => {
                //get id of chosen employee
                const chosenEmployee = answer.employeePromptChoice;
                let chosenEmployeeId;
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].fullName === chosenEmployee) {
                        chosenEmployeeId = employees[i].employeeId;
                        break;
                    }
                }
                const query = "DELETE FROM employeeTable WHERE ?";
                connection.query(query, {
                    employeeId: chosenEmployeeId
                }, (err, res) => {
                    if (err) throw err;
                    console.log("Employee Removed");
                    //show updated employee table
                    setTimeout(queryEmployeesAll, 500);
                });
            });
    });
}

// Remove a role from the database
function removeRole() {
    const query = `
    SELECT roletable.roleId, roletable.title
    FROM roletable ;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract role names and ids
        let role = [];
        let roleNames = [];
        for (let i = 0; i < res.length; i++) {
            role.push({
                roleId: res[i].roleId,
                title: res[i].title
            });
            roleNames.push(res[i].title);
        }
        //prompt for employee to remove
        inquirer
            .prompt({
                type: "list",
                name: "rolePromptChoice",
                message: "Select role to delete:",
                choices: roleNames
            })
            .then(answer => {
                //get id of chosen employee
                const chosenRole = answer.rolePromptChoice;
                let chosenRoleId;
                for (let i = 0; i < roleNames.length; i++) {
                    if (role[i].title === chosenRole) {
                        chosenRoleId = role[i].roleId;
                        break;
                    }
                }
                console.log(chosenRoleId);
                const query = "DELETE FROM roleTable WHERE ?";
                connection.query(query, {
                    roleId: chosenRoleId
                }, (err, res) => {
                    if (err) throw err;
                    console.log("Role Removed");
                    //show updated employee table
                    setTimeout(queryRolesOnly, 500);
                });
            });
    });
}

// Remove a department from the database
function removeDepartment() {
    const query = `
    SELECT departmentTable.departmentId, departmentTable.departmentName FROM departmentTable;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract department names to array
        const departments = [];
        const departmentsNames = [];
        for (let i = 0; i < res.length; i++) {
            departments.push({
                departmentId: res[i].departmentId,
                departmentName: res[i].departmentName
            });
            departmentsNames.push(res[i].departmentName);
        }
        //prompt for department to remove
        inquirer
            .prompt({
                type: "list",
                name: "departmentsPromptChoice",
                message: "Select Department to delete",
                choices: departmentsNames
            })
            .then(answer => {
                //get id of chosen department
                const chosenDepartment = answer.departmentsPromptChoice;
                let chosenDepartmentId;
                for (let i = 0; i < departments.length; i++) {
                    if (departments[i].departmentName === chosenDepartment) {
                        chosenDepartmentId = departments[i].departmentId;
                        break;
                    }
                }
                const query = "DELETE FROM departmentTable WHERE ?";
                connection.query(query, {
                    departmentId: chosenDepartmentId
                }, (err, res) => {
                    if (err) throw err;
                    console.log("Department Removed");
                    //show updated Department table
                    setTimeout(queryDepartmentsOnly, 500);

                });
            });
    });
}

function updateEmployeeRole() {
    //sql query for Employees
    const query = `
    SELECT employeeId, concat(employeeTable.firstName, " ", employeeTable.lastName) AS employeeFullName
    FROM employeeTable ;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        //extract employee names and ids to arrays
        let employees = [];
        let employeesNames = [];
        for (let i = 0; i < res.length; i++) {
            employees.push({
                employeeId: res[i].employeeId,
                fullName: res[i].employeeFullName
            });
            employeesNames.push(res[i].employeeFullName);
        }
        //prompt for employee to update
        inquirer
            .prompt({
                type: "list",
                name: "employeePromptChoice",
                message: "Select employee to update:",
                choices: employeesNames
            })
            .then(answer => {
                //get id of chosen employee
                const chosenEmployee = answer.employeePromptChoice;
                let chosenEmployeeId;
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].fullName === chosenEmployee) {
                        chosenEmployeeId = employees[i].employeeId;
                        break;
                    }
                }
                //sql query for roles
                const query = `SELECT roleTable.title, roleTable.roleId FROM roleTable;`;
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    //extract role names and ids to arrays
                    const roles = [];
                    const rolesNames = [];
                    for (let i = 0; i < res.length; i++) {
                        roles.push({
                            roleId: res[i].roleId,
                            title: res[i].title
                        });
                        rolesNames.push(res[i].title);
                    }
                    //prompt for role selection
                    inquirer
                        .prompt({
                            type: "list",
                            name: "rolePromptChoice",
                            message: "Select New Role:",
                            choices: rolesNames
                        })
                        .then(answer => {
                            //get id of chosen role
                            const chosenRole = answer.rolePromptChoice;
                            let chosenRoleId;
                            for (let i = 0; i < roles.length; i++) {
                                if (roles[i].title === chosenRole) {
                                    chosenRoleId = roles[i].roleId;
                                }
                            }
                            //sql query to update role
                            const query = `UPDATE employeetable SET ? WHERE ?`;
                            connection.query(query, [{
                                    roleId: chosenRoleId,
                                    title: chosenRole
                                },
                                {
                                    employeeId: chosenEmployeeId
                                }
                            ], (err, res) => {
                                if (err) throw err;
                                console.log("Employee Role Updated");
                                //show updated employee table
                                setTimeout(queryEmployeesAll, 3000);
                            });
                        });
                });
            });
    });
}


//department prompt
// function promptDepartments(departments) {
//     inquirer
//         .prompt({
//             type: "list",
//             name: "promptChoice",
//             message: "Select Department:",
//             choices: departments
//         })
//         .then(answer => {
//             queryEmployeesByDepartment(answer.promptChoice);
//         });
// }

// //manager prompt
// function promptManagers(managers) {
//     inquirer
//         .prompt({
//             type: "list",
//             name: "promptChoice",
//             message: "Select Manager:",
//             choices: managers
//         })
//         .then(answer => {
//             queryEmployeesByManager(answer.promptChoice);
//         });
// }






// //query all managers
// function queryManagers() {
//     const query = `
//     SELECT DISTINCT concat(manager.firstName, " ", manager.lastName) AS fullName
//     FROM employeeTable
//     LEFT JOIN employeeTable AS manager ON manager.ManagerId = employeeTable.managerId;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         //extract manager names to array
//         const managers = [];
//         for (let i = 0; i < res.length; i++) {
//             managers.push(res[i].fullName);
//         }
//         //prompt for manager selection
//         promptManagers(managers);
//     });
// }

// //query employees by department
// function queryEmployeesByDepartment(department) {

//     const query = `
//     SELECT employeeId, firstName, lastName, roleId, title, managerId, manager
//     FROM employeeTable AS eTable

//     INNER JOIN departmentTable AS deTable on departmentName = departmentName

//     WHERE departmentName = "${department}";`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         //build table data array from query result
//         const tableData = [];
//         for (let i = 0; i < res.length; i++) {
//             tableData.push({
//                 "ID": res[i].employeeId,
//                 "First Name": res[i].firstName,
//                 "Last Name": res[i].lastName,
//                 "Role ID": res[i].roleId,
//                 "Title": res[i].title,
//                 "Manager ID": res[i].managerId,
//                 "Manager": res[i].manager,
//                 "Department ID": res[i].departmentId,
//                 "Department Name": res[i].departmentName,
//             });
//         }
//         //render screen
//         renderScreen(`${department} Department`, tableData);
//     });
// }

// //query employees by manager
// function queryEmployeesByManager(manager) {
//     const query = `
//     SELECT employeeId, firstName, lastName, roleId, title, managerId, manager
//     FROM employeeTable AS eTable

//     WHERE manager = "${manager}";`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         //build table data array from query result
//         const tableData = [];
//         for (let i = 0; i < res.length; i++) {
//             tableData.push({
//                     "ID": res[i].employeeId,
//                     "First Name": res[i].firstName,
//                     "Last Name": res[i].lastName,
//                     "Role ID": res[i].roleId,
//                     "Title": res[i].title,
//                 });
//         }
//         //render screen
//         renderScreen(`Employees managed by ${manager}`, tableData);
//     });
// }


// function updateEmployeeManager() {
//     //sql query for Employees
//     const query = `
//     SELECT employeeId, concat(employeeTable.firstName, " ", employeeTable.lastName) AS employeeFullName
//     FROM employeeTable ;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         //extract employee names and ids to arrays
//         let employees = [];
//         let employeesNames = [];
//         for (let i = 0; i < res.length; i++) {
//             employees.push({
//                 employeeId: res[i].employeeId,
//                 fullName: res[i].employeeFullName
//             });
//             employeesNames.push(res[i].employeeFullName);
//         }
//         //prompt for employee to update
//         inquirer
//             .prompt({
//                 type: "list",
//                 name: "employeePromptChoice",
//                 message: "Select employee to update:",
//                 choices: employeesNames
//             })
//             .then(answer => {
//                 //get id of chosen employee
//                 const chosenEmployee = answer.employeePromptChoice;
//                 let chosenEmployeeId;
//                 for (let i = 0; i < employees.length; i++) {
//                     if (employees[i].fullName === chosenEmployee) {
//                         chosenEmployeeId = employees[i].employeeId;
//                         break;
//                     }
//                 }
//                 //sql query for managers
//                 const query = `
//                 SELECT DISTINCT concat(manager.firstName, " ", manager.lastName) AS fullName, manager.ManagerId
//                 FROM employeeTable
//                 LEFT JOIN employeeTable AS manager ON manager.ManagerId = employeeTable.managerId;`;
//                 connection.query(query, (err, res) => {
//                     if (err) throw err;
//                     //extract manager names and ids to arrays
//                     const managers = [];
//                     const managersNames = [];
//                     for (let i = 0; i < res.length; i++) {
//                         managersNames.push(res[i].fullName);
//                         managers.push({
//                             id: res[i].managerId,
//                             fullName: res[i].fullName
//                         });
//                     }
//                     //prompt for manager selection
//                     inquirer
//                         .prompt({
//                             type: "list",
//                             name: "managerPromptChoice",
//                             message: "Select Manager:",
//                             choices: managersNames
//                         })
//                         .then(answer => {
//                             //get id of chosen manager
//                             const chosenManager = answer.managerPromptChoice;

//                             console.log(chosenManager);
//                             let chosenManagerId;
//                             for (let i = 0; i < managers.length; i++) {
//                                 if (managers[i].fullName === chosenManager) {
//                                     chosenManagerId = managers[i].managerId;
//                                     break;
//                                 }
//                             }
//                             //sql query to update manager
//                             const query2 = `UPDATE employeetable SET ? WHERE ?`;
//                             connection.query(query2, [
//                                 {
//                                   managerId: chosenManagerId, manager: chosenManager
//                                 },
//                                 {
//                                   employeeId: chosenEmployeeId
//                                 }
//                                 ], (err, res) => {
//                                 if (err) throw err;
//                                 console.log(chosenManagerId);
//                                 console.log("Employee Manager Updated");
//                                 //show updated employee table
//                                 setTimeout(queryEmployeesAll, 3000);
//                             });
//                         });
//                 });
//             });
//     });
// }

//  view Total Budget By Department
// function viewTotalBudgetByDepartment() {
//     const query =
//         `select d.name "Department", SUM(r.salary) "BudgetUtilized" 
//     FROM roleTable r
//     JOIN departmentTable d 
//     JOIN employeeTable e 
//     where r.id = e.roleId and r.id = d.id group by r.id;`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         //build table data array from query result
//         const tableData = [];
//         for (let i = 0; i < res.length; i++) {
//             tableData.push({
//                 "Department": res[i].Department,
//                 "Budjet Utilized": res[i].BudgetUtilized
//             });
//         }
//         renderScreen(`Total Budjet per Department`, tableData);
//     });
// }