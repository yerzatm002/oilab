module.exports = (sequelize, DataTypes) => {
    const TaskTopic = sequelize.define("TaskTopic", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    });
  
    TaskTopic.associate = (models) => {
      TaskTopic.hasMany(models.ProgrammingTask, { foreignKey: "topicId" });
      TaskTopic.hasMany(models.TestQuestion, { foreignKey: "topicId" });
    };
  
    return TaskTopic;
  };
  