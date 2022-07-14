const morgan = require('morgan')
const fs = require('fs');

module.exports = (logingFormat, logDir) => { 
    let date = new Date()
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    let logName = logDir + '/' + date.toISOString().split('T')[0] + '.log';
    let logStream = fs.createWriteStream(logName, { flags: 'a' });

    return morgan(logingFormat, { stream:  logStream});
}