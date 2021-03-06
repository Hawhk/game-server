const express  = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require("../../models");

const jwtSecret = process.env.JWT_SECRET || 'secret';

const createToken = (id) => {
    return jwt.sign({id}, jwtSecret, {expiresIn: "1d"});
}

const notLoggedIn = (req, res, next) => {
    if (req.session.user) {
        res.status(400).json({
            message: "You are already logged in",
        });
    } else {
        next();
    }
}

const loggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(400).json({
            message: "You are not logged in",
        });
    }
}

// login user
router.post('/login', notLoggedIn, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email.toLowerCase(), password);
        const token = createToken(user.id);
        req.session.user = {email: user.email, token};
        res.json({email: user.email, token});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    
});

// signup user
router.post('/signup', notLoggedIn, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.signup(email.toLowerCase(), password);
        const token = createToken(user.id);
        req.session.user = {email: user.email, token};
        res.status(201).json({email: user.email, token});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// logout user
router.post('/logout', loggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json({ message: "You have been logged out" });
        }
    });
});

module.exports={router, loggedIn, notLoggedIn};