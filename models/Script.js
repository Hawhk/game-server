const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Script extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
        Script.belongsTo(models.Game, {
            foreignKey: "game_id",
            onDelete: "CASCADE"
        });
      }
    }
    Script.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      game_id: DataTypes.STRING,
      path: DataTypes.STRING,
      nr: DataTypes.INTEGER
    }, {
      sequelize,
      modelName: 'Script',
      tableName: 'script',
      underscore: true,
      timestamps: false,
    });
    return Script;
};