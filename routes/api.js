const express  = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const expressVisitorCounter = require('express-visitor-counter');

(async () => {
    const dbConnection = await MongoClient.connect('mongodb://localhost/visitors', { useUnifiedTopology: true });
    const counters = dbConnection.db().collection('counters');
    await counters.deleteMany();

    router.use(expressVisitorCounter({ collection: counters }));

    router.get('/visitors', async (req, res) => {
        res.json(await counters.find().toArray());
    });
})();

module.exports=router;