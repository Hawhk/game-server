const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Score extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Score.belongsTo(models.ScoreBoard, {
                foreignKey: "score_board_id",
                onDelete: "CASCADE",
            });
            Score.belongsTo(models.User, {
                foreignKey: "user_id",
                onDelete: "CASCADE",
            });
        }
    }
    Score.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            score_board_id: DataTypes.UUID,
            user_id: DataTypes.UUID,
            score: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "ScoreBoard",
            tableName: "score_board",
            underscore: true,
            timestamps: true,
        }
    );
    return Score;
};
