'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    time_limit: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};