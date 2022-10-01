
const notLoggedInRedirectHome = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
}

const notLoggedIn = (req, res, next) => {
    if (req.session.user) {
        res.status(400).json({
            message: "You are already logged in",
        });
        console.log(req.session.user + " is already logged in");
    } else {
        next();
    }
}

const loggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        console.log(req.session.user + " is not logged in");
        res.status(400).json({
            message: "You are not logged in",
        });
    }
}

const logginStatus = {
    notLoggedInRedirectHome,
    notLoggedIn,
    loggedIn,
};

module.exports = logginStatus;