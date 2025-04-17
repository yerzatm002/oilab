const { Sequelize } = require("sequelize");
const config = require("../config/config.json")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 👉 Импортируем базовые модели
db.User = require("./user")(sequelize, Sequelize);
db.Task = require("./task")(sequelize, Sequelize);
db.TaskProgress = require("./taskprogress")(sequelize, Sequelize);
db.Achievement = require("./achievement")(sequelize, Sequelize);
db.Competition = require("./competition")(sequelize, Sequelize);
db.Message = require("./message")(sequelize, Sequelize);
db.UserAchievements = require("./userachievements")(sequelize, Sequelize);

// 👉 Импортируем новые модели
db.TaskTopic = require("./taskTopic")(sequelize, Sequelize);
db.ProgrammingTask = require("./programmingTask")(sequelize, Sequelize);
db.TestQuestion = require("./TestQuestion")(sequelize, Sequelize);
db.UserProgrammingSubmission = require("./UserProgrammingSubmission")(sequelize, Sequelize);
db.UserTestAnswer = require("./UserTestAnswer")(sequelize, Sequelize);

// 🔗 Настройка связей
db.User.hasMany(db.TaskProgress, { foreignKey: "userId", onDelete: "CASCADE" });
db.User.hasMany(db.Achievement, { foreignKey: "userId", onDelete: "CASCADE" });
db.User.hasMany(db.Message, { foreignKey: "senderId", onDelete: "CASCADE" });
db.User.hasMany(db.UserProgrammingSubmission, { foreignKey: "userId" });
db.User.hasMany(db.UserTestAnswer, { foreignKey: "userId" });

db.User.belongsToMany(db.Competition, {
  through: "UserCompetitions",
  foreignKey: "userId",
});
db.Competition.belongsToMany(db.User, {
  through: "UserCompetitions",
  foreignKey: "competitionId",
});

db.Task.hasMany(db.TaskProgress, { foreignKey: "taskId", onDelete: "CASCADE" });
db.TaskProgress.belongsTo(db.User, { foreignKey: "userId" });
db.TaskProgress.belongsTo(db.Task, { foreignKey: "taskId" });

db.Achievement.belongsTo(db.User, { foreignKey: "userId" });
db.Message.belongsTo(db.User, { foreignKey: "senderId" });
db.Message.belongsTo(db.User, { foreignKey: "receiverId" });

// 🔗 Связи новых моделей
db.TaskTopic.hasMany(db.ProgrammingTask, { foreignKey: "topicId" });
db.TaskTopic.hasMany(db.TestQuestion, { foreignKey: "topicId" });

db.ProgrammingTask.belongsTo(db.TaskTopic, { foreignKey: "topicId" });
db.ProgrammingTask.hasMany(db.UserProgrammingSubmission, { foreignKey: "taskId" });

db.UserProgrammingSubmission.belongsTo(db.User, { foreignKey: "userId" });
db.UserProgrammingSubmission.belongsTo(db.ProgrammingTask, { foreignKey: "taskId" });

db.TestQuestion.belongsTo(db.TaskTopic, { foreignKey: "topicId" });
db.TestQuestion.hasMany(db.UserTestAnswer, { foreignKey: "questionId" });

db.UserTestAnswer.belongsTo(db.User, { foreignKey: "userId" });
db.UserTestAnswer.belongsTo(db.TestQuestion, { foreignKey: "questionId" });

module.exports = db;
