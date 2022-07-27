const express  = require('express');
const router = express.Router();
const { Game } = require('../models');

const notLoggedIn = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    Game.findAll().then(games => {
        res.render('index', { games, user: req.session.user });
    }).catch(err => {
        console.log(err);
    });
});

router.get('/login', notLoggedIn, async (req, res) => {
    res.render('login', { user: req.session.user });
});

router.post('/login', notLoggedIn, (req, res) => {
    res.redirect('/login');
});

router.get('/signup', notLoggedIn, async (req, res) => {
    res.render('signup', { user: req.session.user });
});

router.post('/signup', notLoggedIn, (req, res) => {
    res.redirect('/signup');
});

module.exports=router;