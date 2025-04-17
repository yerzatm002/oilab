module.exports = (sequelize, DataTypes) => {
    const UserProgrammingSubmission = sequelize.define("UserProgrammingSubmission", {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      submitted_code: DataTypes.TEXT,
      result: DataTypes.STRING,
      score: DataTypes.INTEGER,
    });
  
    UserProgrammingSubmission.associate = (models) => {
      UserProgrammingSubmission.belongsTo(models.User, { foreignKey: "userId" });
      UserProgrammingSubmission.belongsTo(models.ProgrammingTask, { foreignKey: "taskId" });
    };
  
    return UserProgrammingSubmission;
  };
  