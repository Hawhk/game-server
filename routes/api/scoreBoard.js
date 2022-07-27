const express  = require('express');
const router = express.Router();

router.get('', async (req, res) => {
    res.send('Welcome to the Scoreboard API');
});

module.exports=router;