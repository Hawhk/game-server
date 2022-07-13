const express = require('express');
const expressSession = require('express-session');

const index = require('./routes/index');
const game = require('./routes/game');
const api = require('./routes/api');

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.enable('trust proxy');

app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use('/static', express.static('games'));

app.use('/', index);
app.use('/game/', game);
app.use('/api', api);

app.set('view engine', 'ejs');

app.listen(port, () => console.log(`Server is listining on http://localhost:${port}`));
