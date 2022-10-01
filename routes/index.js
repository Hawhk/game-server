const express  = require('express');
const router = express.Router();
const { Game } = require('../models');

router.get('/', async (req, res) => {
    Game.findAll().then(games => {
        res.render('index', { games, user: req.session.user });
    }).catch(err => {
        console.log(err);
    });
});

router.use('/', require('./auth'));
router.use('/api', require('./api'));
router.use('/game/', require('./game'));

module.exports=router;