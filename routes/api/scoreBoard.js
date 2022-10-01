const express  = require('express');
const router = express.Router();

const { authJwt } = require("../../middleware");

router.get('', async (req, res) => {
    res.send('Welcome to the Scoreboard API');
});

router.get('/{id}', async (req, res) => {

})

module.exports=router;