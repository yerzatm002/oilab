'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProgrammingTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topicId: {
        type: Sequelize.INTEGER,
        references: { model: 'TaskTopics', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      example_input: Sequelize.TEXT,
      example_output: Sequelize.TEXT,
      solution_code: Sequelize.TEXT,
      difficulty: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ProgrammingTasks');
  }
};
