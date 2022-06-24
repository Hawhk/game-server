const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Game extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
        Game.hasMany(models.Script, {
          foreignKey: "game_id",
        })
      }
    }
    Game.init({
      id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'Game',
      tableName: 'game',
      underscore: true,
      timestamps: false,
    });
    return Game;
};