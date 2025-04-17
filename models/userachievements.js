"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserAchievements extends Model {
    static associate(models) {
      UserAchievements.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      UserAchievements.belongsTo(models.Achievement, { foreignKey: "achievementId", as: "achievement" });
    }
  }

  UserAchievements.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      achievementId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date_earned: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: "UserAchievements",
      timestamps: true
    }
  );

  return UserAchievements;
};
