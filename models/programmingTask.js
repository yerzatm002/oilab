module.exports = (sequelize, DataTypes) => {
    const ProgrammingTask = sequelize.define("ProgrammingTask", {
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      example_input: DataTypes.TEXT,
      example_output: DataTypes.TEXT,
      solution_code: DataTypes.TEXT,
      difficulty: DataTypes.ENUM("beginner", "intermediate", "advanced"),
    });
  
    ProgrammingTask.associate = (models) => {
      ProgrammingTask.belongsTo(models.TaskTopic, { foreignKey: "topicId" });
      ProgrammingTask.hasMany(models.UserProgrammingSubmission, { foreignKey: "taskId" });
    };
  
    return ProgrammingTask;
  };
  