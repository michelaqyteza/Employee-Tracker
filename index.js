const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'qytezam11',
  database: 'employee_db',
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: 'options',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View Departments',
        'View Roles',
        'View Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.options) {
        case 'View Departments':
          viewDepts();
          break;

        case 'View Roles':
          viewRoles();
          break;

        case 'View Employees':
          viewEmployees();
          break;

        case 'Add Department':
          addDepartment();
          break;

        case 'Add Role':
          addRole();
          break;

        case 'Add Employee':
          addEmployee();
          break;


        case 'Update Employee Role':
          updateEmployee();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invaild action: ${answer.action}`);
          break;
      }
    });
};

const viewDepts = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    // console.log(res)
    console.table(res);
    runSearch();
  });
};

const viewRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    // console.log(res)
    console.table(res);
    runSearch();
  });
};

const viewEmployees = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    // console.log(res)
    console.table(res);
    runSearch();
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: "newDep",
      message: "What is the new department that you would like to add?"
    }
  ]).then(({ newDep }) => {
    let queryString = `
          INSERT INTO departments (name)
          VALUES (?)`

    connection.query(queryString, [newDep], (err, data) => {
      if (err) throw err;
      console.log('New Department was added successfully!');
      runSearch()
    })
  })
}


const addRole = () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'What is the new role id number?',
      },
      {
        name: 'title',
        type: 'input',
        message: 'What is the new role title?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the new role salary?',
      },
      {
        name: 'deptID',
        type: 'input',
        message: 'What is the department ID?',
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO roles SET ?',
        {
          id: answer.id,
          title: answer.title,
          salary: answer.salary,
          department_id: answer.deptID,
        },
        (err) => {
          if (err) throw err;
          console.log('New role was added successfully!');
          runSearch();
        }
      );
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'What is the new employees id number?',
      },
      {
        name: 'firstName',
        type: 'input',
        message: 'What is the new employees first name?',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the new employees last name?',
      },
      {
        name: 'roleID',
        type: 'input',
        message: 'What is the role ID for the new employee?',
      },
      {
        name: 'managerID',
        type: 'input',
        message: 'What is the manager ID associated?',
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO employees SET ?',
        {
          id: answer.id,
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleID,
          manager_id: answer.managerID,
        },
        (err) => {
          if (err) throw err;
          console.log('Your new employee was added!');
          runSearch();
        }
      );
    });
};

const updateEmployee = () => {
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    let all = [];
    for (let i = 0; i < res.length; i++) {
      all.push(res[i].first_name);
    }
    inquirer
      .prompt([
        {
          name: "select",
          type: "list",
          message: "Which employee would you like to update?",
          choices: all,
        },
        {
          name: "roleID",
          type: "input",
          message: "Please enter the new Role ID for this employee.",
        },
      ])
      .then((answer) => {
        if (err) throw err;
        connection.query('UPDATE employees SET ? WHERE ?',
          [
            {
              role_id: answer.roleID,
            },
            {
              first_name: answer.select,
            },
          ],
          (err, res) => {
            if (err) throw err;
            viewEmployees();
          })
      })
  });
};