module.exports = (sequelize, DataTypes) => {
    const UserTestAnswer = sequelize.define("UserTestAnswer", {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_answer: DataTypes.ENUM("A", "B", "C", "D"),
      is_correct: DataTypes.BOOLEAN,
    });
  
    UserTestAnswer.associate = (models) => {
      UserTestAnswer.belongsTo(models.User, { foreignKey: "userId" });
      UserTestAnswer.belongsTo(models.TestQuestion, { foreignKey: "questionId" });
    };
  
    return UserTestAnswer;
  };
  