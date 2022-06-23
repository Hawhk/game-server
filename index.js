const express = require('express');
const mysql = require('mysql')
const fs = require('fs');

const app = express();

const CONFIG = JSON.parse(fs.readFileSync('config.json'));

const connection = mysql.createConnection({
    host: CONFIG.host,
    user: CONFIG.user,
    password: CONFIG.password,
    database: CONFIG.database
});

connection.connect();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    connection.query('SELECT id, name FROM game', (err, rows) => {
        console.log("rows:", rows);
        if (err) throw err;
        if (!rows) {
            console.log("here");
            rows = [];
        }
        res.render('index', { games: rows });
    });
});

app.get('/game/:id', (req, res) => {
    connection.query('SELECT * FROM game WHERE id = ?', [req.params.id], (err, rows) => {
        console.log(rows);
        if (err) throw err;
        if (!rows) {
            console.log("here");
        }

        res.render('game', { game: rows[0], scripts: [] });
    })
});

app.listen(3000, () => console.log('Server is listining on http://localhost:3000.'));