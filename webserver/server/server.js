const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));  
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",     // ADD PASSWORD IF YOUR XAMPP HAS ONE
    database: "movies" // MUST match your DB name
});

db.connect(err => {
    if (err) {
        console.log("MySQL Connection Error:", err);
    } else {
        console.log("MySQL connected!");
    }
});

// GET all movies
app.get("/movies", (req, res) => {
    db.query("SELECT * FROM movies", (err, result) => {
        if (err) return res.json(err);
        res.json(result);
    });
});

// POST new movie
app.post("/movies", (req, res) => {
    const { title, rating, image } = req.body;

    const sql = "INSERT INTO movies_detail (name, rating, image) VALUES (?, ?, ?)";
    db.query(sql, [title, rating, image], (err, result) => {
        if (err) return res.json(err);

        res.json({
            id: result.insertId,
            title,
            rating,
            image
        });
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
