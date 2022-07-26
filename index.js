const express = require('express');
const expressSession = require('express-session');

const log = require('./logs');
require('dotenv').config();

const port = process.env.PORT || 3000;

const logDir = process.env.LOG_DIR || 'logs';
const secret = process.env.SESSION_SECRET || 'secret';
const logingFormat = process.env.LOGING_FORMAT || 'dev';

if (!process.env.LOG_DIR) {
    process.env.LOG_DIR = logDir;
}
const app = express();

app.enable('trust proxy');

app.use(expressSession({ secret: secret, resave: false, saveUninitialized: true }));
app.use(log.loging(logingFormat, logDir));
app.use('/static', express.static('games'));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));
app.use('/game/', require('./routes/game'));

app.set('view engine', 'ejs');


app.listen(port, () => console.log(`Server is listining on http://localhost:${port}`));
