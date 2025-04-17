'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TaskProgresses", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE"
    });

    await queryInterface.addColumn("TaskProgresses", "taskId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks",
        key: "id"
      },
      onDelete: "CASCADE"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("TaskProgresses", "userId");
    await queryInterface.removeColumn("TaskProgresses", "taskId");
  }
};
