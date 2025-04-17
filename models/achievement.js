'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Achievement.init({
    userId: DataTypes.UUID,
    achievement_name: DataTypes.STRING,
    points: DataTypes.INTEGER,
    date_earned: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Achievement',
  });
  return Achievement;
};