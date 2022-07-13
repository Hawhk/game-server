const express = require('express');
const expressSession = require('express-session');
const expressVisitorCounter = require('express-visitor-counter');

const mongoUtil = require('./mongoUtil');
const index = require('./routes/index');
const game = require('./routes/game');
let api;

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.enable('trust proxy');

app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use('/static', express.static('games'));

mongoUtil.connectToServer(err => { 
    if (err) console.error(err);
    api = require('./routes/api');
    app.use('/api', api);

    const counters =  mongoUtil.getDb().collection('counters')
    counters.deleteMany();
    
    app.use(expressVisitorCounter({ collection: counters }));
    app.use('/', index);
    app.use('/game/', game);
});

app.set('view engine', 'ejs');


app.listen(port, () => console.log(`Server is listining on http://localhost:${port}`));
