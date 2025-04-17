'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProgrammingSubmissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: { model: 'ProgrammingTasks', key: 'id' },
        onDelete: 'CASCADE'
      },
      submitted_code: Sequelize.TEXT,
      result: Sequelize.STRING,
      score: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('UserProgrammingSubmissions');
  }
};
