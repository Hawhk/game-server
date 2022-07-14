const express  = require('express');

const log = require('../logs');
const mongoUtil = require('../mongoUtil');

const router = express.Router();

const counters = mongoUtil.getDb().collection('counters');

router.get('/visitors', async (req, res) => {
    res.json(await counters.find().toArray());
});

const PATH = process.env.LOG_DIR + '/';
const FILE_ENDING = '.log';

function filterAndRespond(res, req, logs) {
    let filteredLogs = logs;
    if (req.query.filter) {
        filteredLogs = log.filter(logs, req.query.filter, req.query.exclude);
    }

    res.json(filteredLogs);
}

router.get('/logs', async (req, res) => {
    let logRows;
    if (req.query.month) {
        const fileName = PATH + log.getYearMonth(req.query) + FILE_ENDING;
        logRows = log.getLog(fileName);
    } else if (req.query.year && !req.query.month) {
        logRows = log.getLogsForYear(req.query.year)
    } else {
        const fileName = PATH + log.getYearMonth() + FILE_ENDING;
        logRows = log.getLog(fileName);
    }

    filterAndRespond(res, req, logRows);
});

router.get('/logs/:keyToFilter/:value', (req, res) => {
    let logRows;
    const keyToFilter = req.params.keyToFilter;
    const value = req.params.value;
    if (req.query.month) {
        const fileName = PATH + log.getYearMonth(req.query) + FILE_ENDING;
        logRows = log.getLog(fileName);
    } else if (req.query.year && !req.query.month) {
        logRows = log.getLogsForYear(req.query.year);
    } else {
        const fileName = PATH + log.getYearMonth() + FILE_ENDING;
        logRows = log.getLog(fileName);
    }

    switch (req.query.comp.toLowerCase()) {
        case 'neq':
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase() !== value.toLowerCase()
            );
            break;
        case 'gt':
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase() > value.toLowerCase()
            );
            break;
        case 'ge':
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase() >= value.toLowerCase()
            );
            break;
        case 'lt':
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase() < value.toLowerCase()
            );
            break;
        case 'le':
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase() <= value.toLowerCase()
            );
            break;
        case 'nic':
            logRows = logRows.filter(
                log => !log[keyToFilter].toLowerCase().includes(value.toLowerCase())
            );  
            break;
        case 'ic':
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase().includes(value.toLowerCase())
            ); 
            break;
        case 'eq':
        default:
            logRows = logRows.filter(
                log => log[keyToFilter].toLowerCase() === value.toLowerCase()
            );
            break;
    }

    filterAndRespond(res, req, logRows);
});

router.get('/logs/ips', async (req, res) => {
    let logRows;
    if (req.query.month) {
        const fileName = PATH + log.getYearMonth(req.query) + FILE_ENDING;
        logRows = log.getLog(fileName);
    } else if (req.query.year && !req.query.month) {
        logRows = log.getLogsForYear(req.query.year);
    } else {
        const fileName = PATH + log.getYearMonth() + FILE_ENDING;
        logRows = log.getLog(fileName);
    }
    const keys = ['status', 'method'];
    let ips = {};
    logRows.forEach(log => {
        ips[log.ip] ? ips[log.ip].count++ : ips[log.ip] = {count: 1, days: 0};

        keys.forEach(key => {
            if (!ips[log.ip][key]){
                ips[log.ip][key] = {};
            }
            let logKey = log[key]
            if (!ips[log.ip][key][logKey]){
                ips[log.ip][key][logKey] = 0;
            }
            ips[log.ip][key][logKey]++;
        });
        if (!ips[log.ip]["date"]){
            ips[log.ip]["date"] = {};
        }

        let date = new Date(log["date"].split(":")[0]);
        let dateKey = date.getFullYear() + (date.getMonth() + 1) + date.getDate();

        if (!ips[log.ip]["date"][dateKey]){
            ips[log.ip]["date"][dateKey] = 0;
            ips[log.ip].days++;
        }
        ips[log.ip]["date"][dateKey]++;
    });
    Object.keys(ips).forEach(ip => {
        delete ips[ip]["date"];
    });
    res.json(ips);
});

module.exports=router;


