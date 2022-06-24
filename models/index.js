const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const CONFIG = JSON.parse(fs.readFileSync('config.json'));

const sequelize = new Sequelize(CONFIG.database, CONFIG.user, CONFIG.password, {
    host: CONFIG.host,
    dialect: CONFIG.dialect,
    logging: false
});

const basename = path.basename(__filename);
const db = {};

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
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