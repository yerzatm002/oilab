"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserAchievements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Должно совпадать с именем таблицы пользователей
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      achievementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Achievements", // Должно совпадать с именем таблицы достижений
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      date_earned: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserAchievements");
  }
};
