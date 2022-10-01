const express  = require('express');
const { logginStatus } = require('../../middleware');
const router = express.Router();

router.get('/login', logginStatus.notLoggedInRedirectHome, async (req, res) => {
    res.render('login', { user: req.session.user });
});

router.post('/login', logginStatus.notLoggedInRedirectHome, (req, res) => {
    res.redirect('/login');
});

router.get('/signup', logginStatus.notLoggedInRedirectHome, async (req, res) => {
    res.render('signup', { user: req.session.user });
});

router.post('/signup', logginStatus.notLoggedInRedirectHome, (req, res) => {
    res.redirect('/signup');
});

module.exports = router;