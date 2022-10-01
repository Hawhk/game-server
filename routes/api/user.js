const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const { authJwt, logginStatus } = require("../../middleware");

const createToken = (id) => {
    return jwt.sign({ id }, authJwt.JWT_SECRET, { expiresIn: "1d" });
};

// login user
router.post("/login", logginStatus.notLoggedIn, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email.toLowerCase(), password);
        const token = createToken(user.id);
        req.session.user = { email: user.email, token };
        res.json({ email: user.email, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.log("error when logging in: " + err.message);
    }
});

// signup user
router.post("/signup", logginStatus.notLoggedIn, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.signup(email.toLowerCase(), password);
        const token = createToken(user.id);
        req.session.user = { email: user.email, token };
        res.status(201).json({ email: user.email, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.log("error when trying to register a new user" + err.message);
    }
});

// logout user
router.post("/logout", logginStatus.loggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json({ message: "You have been logged out" });
        }
    });
});

module.exports = router;
