const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

let config;
try {
    config = JSON.parse(fs.readFileSync('config.json'));
} catch (err) {
    console.error("No config file was found!", err);
    process.exit(11);
}
let sequelize;

const LOGGING = config.logging ? console.log : false; 

if (config.dialect !== 'sqlite') {
    sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.host,
        dialect: config.dialect,
        logging: LOGGING,
        define: {
            timestamps: false
        },
        define: {
            timestamps: false
        }
    });
} else {
    sequelize = new Sequelize({
        dialect: config.dialect,
        storage: config.storage,
        logging: LOGGING,
        define: {
            timestamps: false
        }
    });
}

sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database', err);
    process.exit(1);
});


const basename = path.basename(__filename);
const db = {};

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(async (file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;