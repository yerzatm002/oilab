const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const dotenv = require('dotenv');

// Импорт маршрутов
const authRoutes = require('./routes/auth.routes');
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const progressRoutes = require("./routes/progress.routes");
const competitionRoutes = require("./routes/competition.routes");
const messageRoutes = require("./routes/message.routes");
const achievementRoutes = require("./routes/achievement.routes");
const notificationRoutes = require("./routes/notification.routes");
const aiRoutes = require("./routes/ai.routes");
const topicRoutes = require("./routes/topic.routes");
const programmingTaskRoutes = require("./routes/programmingTasks.routes");
const submissionRoutes = require("./routes/submissions.routes");
const testRoutes = require("./routes/test.routes");
const testAnswerRoutes = require("./routes/testAnswer.routes");




// Настройка окружения
dotenv.config();

// Инициализация Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());

// Ограничение запросов (защита от DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // Макс. 100 запросов с одного IP
});
app.use(limiter);

// Подключение маршрутов
app.use('/api/auth', authRoutes);
app.use("/api/topic", topicRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/programmingtasks", programmingTaskRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-answers", testAnswerRoutes);

module.exports = app;
