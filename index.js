const { Game, Script } = require("./models");
const express = require('express');
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();


app.set('view engine', 'ejs');
app.use('/static', express.static('games'));

app.get('/', (req, res) => {
    Game.findAll().then(games => {
        res.render('index', { games: games });
    }).catch(err => {
        console.log(err);
    });
});

app.get('/game/:id', (req, res) => {
    Game.findByPk(req.params.id, { include: [{ model: Script, order: ['nr', 'ASC'] }]} ).then(game => {
        res.render('game', { game: game.dataValues});
    }).catch(err => {
        console.log(err);
    });
});

app.listen(port, () => console.log(`Server is listining on http://localhost:${port}`));