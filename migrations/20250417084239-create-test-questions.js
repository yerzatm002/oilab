'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TestQuestions', {
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
      question_text: Sequelize.TEXT,
      option_a: Sequelize.STRING,
      option_b: Sequelize.STRING,
      option_c: Sequelize.STRING,
      option_d: Sequelize.STRING,
      correct_answer: Sequelize.STRING,
      difficulty: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('TestQuestions');
  }
};
