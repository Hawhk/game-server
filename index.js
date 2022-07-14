const express = require('express');
const expressSession = require('express-session');
const expressVisitorCounter = require('express-visitor-counter');

const mongoUtil = require('./mongoUtil');
const loging = require('./logs');

require('dotenv').config();

const port = process.env.PORT || 3000;
const logingFormat = process.env.LOGING_FORMAT || 'dev';
const logDir = process.env.LOG_DIR || 'logs';

const app = express();

app.enable('trust proxy');

app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(loging(logingFormat, logDir));
app.use('/static', express.static('games'));

mongoUtil.connectToServer(err => { 
    if (err) console.error(err);
    app.use('/api', require('./routes/api'));

    const counters =  mongoUtil.getDb().collection('counters')

    app.use(expressVisitorCounter({ collection: counters }));
    app.use('/', require('./routes/index'));
    app.use('/game/', require('./routes/game'));
});

app.set('view engine', 'ejs');


app.listen(port, () => console.log(`Server is listining on http://localhost:${port}`));
