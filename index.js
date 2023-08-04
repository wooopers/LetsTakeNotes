const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});

function init() {
  inquirer
    .prompt({
      name: "initialQuestion",
      type: "list",
      message: "What do you want to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "EXIT",
      ],
    })
    .then((answers) => {
      switch (answers.initialQuestion) {
        case "view all departments":
          viewAllDepartments();
          break;
        case "view all roles":
          viewAllRoles();
          break;
        case "view all employees":
          viewAllEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateEmployeeRole();
          break;
        case "EXIT":
          db.end();
          break;
        default:
          break;
      }
    });
}

function viewAllDepartments() {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.table(results);
      init(); // After displaying the result, go back to the main menu
    }
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.table(results);
      init(); // After displaying the result, go back to the main menu
    }
  });
}

function viewAllEmployees() {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.table(results);
      init(); // After displaying the result, go back to the main menu
    }
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO departments (department_name) VALUES (?)",
        [answers.departmentName],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Department added successfully!");
            init(); // After adding the department, go back to the main menu
          }
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM departments", (err, departments) => {
    if (err) {
      console.log(err);
      return;
    }

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for this role:",
        },
        {
          name: "departmentId",
          type: "list",
          message: "Select the department for this role:",
          choices: departments.map((department) => ({
            name: department.department_name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
          [answers.title, answers.salary, answers.departmentId],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Role added successfully!");
              init(); // After adding the role, go back to the main menu
            }
          }
        );
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM roles", (err, roles) => {
    if (err) {
      console.log(err);
      return;
    }

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter the first name of the employee:",
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter the last name of the employee:",
        },
        {
          name: "roleId",
          type: "list",
          message: "Select the role for this employee:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)",
          [answers.firstName, answers.lastName, answers.roleId],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Employee added successfully!");
              init(); // After adding the employee, go back to the main menu
            }
          }
        );
      });
  });
}

function updateEmployeeRole() {
  db.query("SELECT * FROM employees", (err, employees) => {
    if (err) {
      console.log(err);
      return;
    }

    db.query("SELECT * FROM roles", (err, roles) => {
      if (err) {
        console.log(err);
        return;
      }

      inquirer
        .prompt([
          {
            name: "employeeId",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "roleId",
            type: "list",
            message: "Select the new role for this employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          db.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [answers.roleId, answers.employeeId],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Employee role updated successfully!");
                init(); // After updating the employee role, go back to the main menu
              }
            }
          );
        });
    });
  });
}

init();
