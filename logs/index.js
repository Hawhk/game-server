const morgan = require("morgan");
const fs = require("fs");
const os = require("os");

function getLog(logName) {
    let log;

    try {
        log = fs.readFileSync(logName, "utf8");
    } catch (err) {
        console.log(err);
        return [];
    }

    log = log.split(os.EOL);
    log.pop();
    log = log.map((line) => {
        let section = line.split(" ");

        let ip = section[0];
        let remoteUser = section[2];
        let date = line.slice(line.indexOf("[") + 1, line.indexOf("]"));
        let methodSection = line
            .slice(
                line.indexOf('"') + 1,
                line.indexOf('"', line.indexOf('"') + 1)
            )
            .split(" ");
        let method = methodSection[0];
        let url = methodSection[1];
        let http = methodSection[2];
        let status = section[8];
        let bytes = section[9];
        let referrer = section[10].replace(/"/g, "");
        let user_agent = line.slice(
            line.lastIndexOf('"', line.lastIndexOf('"') - 1) + 1,
            line.lastIndexOf('"')
        );

        return {
            ip,
            remoteUser,
            date,
            method,
            url,
            http,
            status,
            bytes,
            referrer,
            user_agent,
        };
    });
    return log;
}

function getLogsForYear(year) {
    let logs = [];
    let logDir = process.env.LOG_DIR;
    let files = fs.readdirSync(logDir);
    files.forEach((file) => {
        if (file.includes(year)) {
            logs.push(...getLog(logDir + "/" + file));
        }
    });
    return logs;
}

function filter(logs, filter, exclude = false) {
    let filteredLogs = [];
    filter = filter.split(",");
    if (filter) {
        if (exclude) {
            filteredLogs = logs.map((log) => {
                Object.keys(log).forEach((key) => {
                    if (filter.includes(key)) {
                        delete log[key];
                    }
                });
                return log;
            });
        } else {
            filteredLogs = logs.map((log) => {
                Object.keys(log).forEach((key) => {
                    if (!filter.includes(key)) {
                        delete log[key];
                    }
                });
                return log;
            });
        }
    } else {
        filteredLogs = logs;
    }
    return filteredLogs;
}

function getYearMonth(par) {
    let month;
    let year;
    if (par) {
        month = par.month;
        year = par.year || new Date().getUTCFullYear();
    } else {
        let date = new Date();
        month = date.getUTCMonth() + 1;
        year = date.getUTCFullYear();
    }

    if (month < 10 && String(month).length === 1) {
        month = "0" + month;
    }

    return year + "-" + month;
}

function loging(logingFormat, logDir) {
    let date = getYearMonth();
    let logName = logDir + "/" + date + ".log";
    try {
        if (!fs.existsSync(logName)) {
            console.log("Creating new log file: " + logName);
        } else {
            console.log("Logging to: " + logName);
        }
    } catch (err) {
        console.error(err);
    }
    let logStream = fs.createWriteStream(logName, { flags: "a" });

    return morgan(logingFormat, { stream: logStream });
}

module.exports = {
    getLog: getLog,
    getLogsForYear: getLogsForYear,
    filter: filter,
    getYearMonth: getYearMonth,
    loging: loging,
};
