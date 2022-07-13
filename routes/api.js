const express  = require('express');
const mongoUtil = require('../mongoUtil');

const router = express.Router();

const counters = mongoUtil.getDb().collection('counters');

router.get('/visitors', async (req, res) => {
    res.json(await counters.find().toArray());
});

module.exports=router;


