const express  = require('express');
const router = express.Router();
const { User, ScoreBoard } = require("../../models");
const { authJwt } = require("../../middleware");

router.get('', async (req, res) => {
    res.send('Welcome to the Scoreboard API');
});

router.get('/all', async (req, res) => {
    ScoreBoard.findAll().then(scoreBoards => {
        res.json(scoreBoards);
    }).catch(err => {
        console.log(err);
    });
})

module.exports=router;