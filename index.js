const express = require("express");
const session = require("express-session");

const log = require("./logs");
require("dotenv").config();

const port = process.env.PORT || 3000;

const logDir = process.env.LOG_DIR || "logs";
const secret = process.env.SESSION_SECRET || "secret";
const logingFormat = process.env.LOGING_FORMAT || "dev";

if (!process.env.LOG_DIR) {
    process.env.LOG_DIR = logDir;
}
const app = express();

app.enable("trust proxy");

app.use(express.json());
app.use(
    session({
        name: "game-server-session",
        secret: secret,
        resave: false,
        saveUninitialized: false,
    })
);
// loging
app.use(log.loging(logingFormat, logDir));
// static files
app.use("/gamestatic", express.static("games"));
app.use("/static", express.static("static"));
// routes
app.use("/", require("./routes"));
app.use((req, res) => {
    res.send(req.url);
});

app.set("view engine", "ejs");

app.listen(port, () =>
    console.log(`Server is listining on http://localhost:${port}`)
);
