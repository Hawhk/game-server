const express  = require('express');
const router = express.Router();
const { Game } = require('../models');

router.get('', async (req, res) => {
    Game.findAll().then(games => {
        res.render('index', { games: games });
    }).catch(err => {
        console.log(err);
    });
});

module.exports=router;