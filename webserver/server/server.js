const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

// FIXED LINES
app.use(express.static(path.join(__dirname, "public"))); // use, not user
app.use(cors());
app.use(express.json()); // json() must be called as a function

const port = 5000;

const data_base = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "students"
});

app.listen(port, () => {
    console.log("listening");
});
