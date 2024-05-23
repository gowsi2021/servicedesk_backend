import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//const mysql = require('mysql2');
import mysql from 'mysql2';
//const { Console } = require('console');
import Console from 'console';

// Create a connection to the MySQL server
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gowsi@123',
});

// Connect to the MySQL server
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }

    console.log('Connected to MySQL');

    // Create a new database
    const databaseName = 'servicedesk';
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;

    connection.query(createDatabaseQuery, (queryError) => {
        if (queryError) {
            console.error('Error creating database:', queryError);
        } else {
            connection.query('USE servicedesk');
            console.log(`Database ${databaseName} created successfully`);

            const createTableQuery = 'CREATE TABLE IF NOT EXISTS customers (id int auto_increment PRIMARY KEY,username VARCHAR(30) NOT NULL,email VARCHAR(30) NOT NULL, password VARCHAR(12) NOT NULL,companyname varchar(30) NOT NULL,phonenumber varchar(12) NOT NULL,project VARCHAR(30),access VARCHAR(20));'

            connection.query(createTableQuery, (queryError) => {

                console.log('Table created successfully');
                console.log(queryError);

            })

        }


    });

});

app.get('/', (req, res) => {
    console.log("Server is running");
});

app.post('/sign', (req, res) => {
    console.log("Signup");
    console.log(req.body);
    connection.query('USE servicedesk');
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const companyname = req.body.companyName;
    const phonenumber = req.body.phoneNumber;
    const project = 'loree';
    const access = 'yes';
    console.log("Company Name: ", companyname);

    if (username && password) {
        console.log(username, email, password, companyname, phonenumber, project, access);
        // Perform an INSERT INTO query

        const insertQuery = `INSERT INTO customers(username, email, password, companyname, phonenumber, project, access) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [username, email, password, companyname, phonenumber, project, access];

        connection.query(insertQuery, values, (queryError) => {
            if (queryError) {
                console.log("Query error", queryError);
                res.send("0");
            }
            else {
                res.send("1");
                console.log('Inserted successfully');
            }



        })

    }
})

app.post('/login', async function (request, response) {
    console.log('login');
    console.log(request.body);
    connection.query('USE servicedesk');
    // Capture the input fields
    let email = request.body.email;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (email && password) {
        console.log("Checking username and password");
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM customers WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                console.log("Login success");
                response.send("1");
            } else {
                response.send("0");
                console.log("Incorrect username or password");
            }
            response.end();
        });
    } else {
        response.end();
    }
})





// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});