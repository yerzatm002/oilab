const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const app = require("./app.js");
const sequelize = require("./config/db.js");

dotenv.config();

// 🔹 Указываем порт
const PORT = process.env.PORT || 5000;

// 🔹 Создаем HTTP сервер
const server = http.createServer(app);

// 🔹 WebSocket-сервер (Socket.io)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 🔹 WebSocket события
io.on("connection", (socket) => {
    console.log(`🔌 Пользователь подключился: ${socket.id}`);

    // 🎯 Слушаем обновления соревнований
    socket.on("competition:update", (data) => {
        console.log(`📢 Обновление соревнования:`, data);

        // 📡 Отправляем всем клиентам обновленные данные
        io.emit("competition:update", data);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Пользователь отключился: ${socket.id}`);
    });
});

io.on("connection", (socket) => {
    console.log(`🔔 Пользователь подключился: ${socket.id}`);

    // 🎯 Слушаем события "send-notification"
    socket.on("send-notification", async (data) => {
        console.log(`📢 Уведомление:`, data);

        // Сохраняем уведомление в БД
        const notification = await Notification.create({
            userId: data.userId,
            message: data.message
        });

        // 📡 Отправляем уведомление пользователю
        io.to(data.userId).emit("receive-notification", {
            id: notification.id,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        });
    });

    socket.on("disconnect", () => {
        console.log(`❌ Пользователь отключился: ${socket.id}`);
    });
});

io.on("connection", (socket) => {
    console.log(`🧠 AI assistant connected: ${socket.id}`);

    socket.on("ai:ask", async (data) => {
        console.log(`🔍 AI request: ${data.prompt}`);

        try {
            // Send request to GPT4All
            const response = await axios.post(GPT4ALL_API_URL, {
                model: "gpt4all",
                messages: [{ role: "user", content: data.prompt }],
                max_tokens: 200
            });

            // Send AI response to client
            socket.emit("ai:response", { response: response.data });

        } catch (error) {
            console.error("AI Error:", error);
            socket.emit("ai:error", { message: "AI request failed" });
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ AI assistant disconnected: ${socket.id}`);
    });
});


// 🔹 Подключение к БД PostgreSQL
sequelize.authenticate()
    .then(() => {
        console.log("✅ База данных подключена");

        // 🔹 В тестовой среде синхронизируем БД
        if (process.env.NODE_ENV === "test") {
            return sequelize.sync({ force: true });
        }
    })
    .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// 🔹 Запуск сервера
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

module.exports = { server, io }; // Экспорт для использования в тестах
