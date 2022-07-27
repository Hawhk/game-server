const bcrypt = require('bcrypt')
const validator = require('validator');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
        static async login(email, password) {
            if (!email || !password) {
                throw Error('All fields must be filled');
            }
        
            const user = await this.findOne({where: { email }});
            if (!user) {
                throw Error('Incorrect email');
            }
        
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                throw Error('Incorrect password');
            }
        
            return user;
        }

        static async signup(email, password) {
            if (!email || !password) {
                throw Error('All fields must be filled');
            }
            if (!validator.isEmail(email)) {
                throw Error('Email not valid');
            }
            if (!validator.isStrongPassword(password)) {
                throw Error('Password not strong enough');
            }
        
            const exists = await this.findOne({where: { email }});
        
            if (exists) {
                throw Error('Email already in use');
            }
        
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
        
            const user = await this.create({ email, password: hash });
        
            return user;
        }
    
        // static associate(models) {
            // define association here
            // User.belongsTo(models.Game, {
            //     foreignKey: "game_id",
            //     onDelete: "CASCADE"
            // });
        // }
    }
    User.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
    //   username: {
    //     type: DataTypes.STRING(50),
    //     allowNull: false,
    //     unique: true
    //   },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      underscore: true,
      timestamps: false,
    });
    return User;
};