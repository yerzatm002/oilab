module.exports = (sequelize, DataTypes) => {
    const TestQuestion = sequelize.define("TestQuestion", {
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_text: DataTypes.TEXT,
      option_a: DataTypes.STRING,
      option_b: DataTypes.STRING,
      option_c: DataTypes.STRING,
      option_d: DataTypes.STRING,
      correct_answer: DataTypes.ENUM("A", "B", "C", "D"),
      difficulty: DataTypes.ENUM("beginner", "intermediate", "advanced"),
    });
  
    TestQuestion.associate = (models) => {
      TestQuestion.belongsTo(models.TaskTopic, { foreignKey: "topicId" });
      TestQuestion.hasMany(models.UserTestAnswer, { foreignKey: "questionId" });
    };
  
    return TestQuestion;
  };
  