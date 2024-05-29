import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors()); // Enable CORS
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a connection to the MySQL server
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aj2607',
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
            connection.query('USE servicedesk', (err) => {
                if (err) {
                    console.error('Error using database:', err);
                    return;
                }
                console.log(`Database ${databaseName} selected successfully`);

                const createTableQuery = `CREATE TABLE IF NOT EXISTS customers (
                    id int auto_increment PRIMARY KEY,
                    username VARCHAR(30) NOT NULL,
                    email VARCHAR(30) NOT NULL,
                    password VARCHAR(12) NOT NULL,
                    companyname VARCHAR(30) NOT NULL,
                    phonenumber VARCHAR(12) NOT NULL,
                    project VARCHAR(30),
                    access VARCHAR(20)
                )`;

                connection.query(createTableQuery, (queryError) => {
                    if (queryError) {
                        console.error('Error creating table:', queryError);
                    } else {
                        console.log('Table created successfully');
                    }
                });
            });
        }
    });
});

app.get('/', (req, res) => {
    console.log("Server is running");
    res.send("Server is running");
});

app.post('/sign', (req, res) => {
    console.log("Signup request received");
    console.log(req.body);

    const { username, email, password, companyname, phonenumber } = req.body;
    const project = 'loree';
    const access = 'yes';

    console.log("Company Name: ", companyname);

    if (username && password) {
        console.log(username, email, password, companyname, phonenumber, project, access);

        // Check if email already exists in the database
        connection.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Error checking email:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            if (results.length > 0) {
                // Email already exists, return error response to client
                res.status(400).json({ error: 'Email already in use' });
                return;
            }

            // Perform an INSERT INTO query
            const insertQuery = `INSERT INTO customers(username, email, password, companyname, phonenumber, project, access) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [username, email, password, companyname, phonenumber, project, access];

            connection.query(insertQuery, values, (queryError) => {
                if (queryError) {
                    console.error("Query error:", queryError);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(201).json({ message: 'Inserted successfully' });
                    console.log('Inserted successfully');
                }
            });
        });
    } else {
        res.status(400).json({ error: 'Invalid input: Username and password required' });
        console.log("Invalid input: Username and password required");
    }
});

app.post('/login', async (req, res) => {
    console.log('Login request received');
    console.log(req.body);

    const { email, password } = req.body;

    if (email && password) {
        console.log("Checking username and password");

        connection.query('SELECT * FROM customers WHERE email = ? AND password = ?', [email, password], (error, results) => {
            if (error) {
                console.error('Error checking login:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            if (results.length > 0) {
                console.log("Login success");
                console.log(Response.data);
                res.status(200).json({ message: 'Login successful' });
            } else {
                console.log("Incorrect email or password");
                res.status(401).json({ error: 'Incorrect email or password' });
            }
        });
    } else {
        res.status(400).json({ error: 'Email and password required' });
        console.log("Email and password required");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
