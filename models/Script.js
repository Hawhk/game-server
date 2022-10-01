const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Script extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Script.belongsTo(models.ScoreBoard, {
                foreignKey: "score_board_id",
                onDelete: "CASCADE",
            });
            Script.belongsTo(models.User, {
                foreignKey: "user_id",
                onDelete: "CASCADE",
            });
        }
    }
    Script.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            score_board_id: DataTypes.UUID,
            user_id: DataTypes.UUID,
            path: DataTypes.STRING,
            type: DataTypes.STRING(64),
            nr: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Script",
            tableName: "script",
            underscore: true,
            timestamps: false,
        }
    );
    return Script;
};
