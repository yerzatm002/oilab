const express = require("express");
const { Message, User } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// 🔹 Отправить сообщение пользователю
router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !message) {
            return res.status(400).json({ message: "Необходимо указать получателя и текст сообщения" });
        }

        const newMessage = await Message.create({ senderId, receiverId, message });

        return res.status(201).json({ message: "Сообщение отправлено", newMessage });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить все сообщения пользователя
router.get("/:user_id", authMiddleware, async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                receiverId: req.params.user_id
            },
            include: [
                { model: User, as: "sender", attributes: ["id", "name"] }
            ],
            order: [["timestamp", "DESC"]]
        });

        if (!messages.length) return res.status(404).json({ message: "Сообщения не найдены" });

        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить историю переписки между пользователями
router.get("/conversation/:receiver_id", authMiddleware, async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.receiver_id;

        const messages = await Message.findAll({
            where: {
                senderId,
                receiverId
            },
            include: [
                { model: User, as: "receiver", attributes: ["id", "name"] }
            ],
            order: [["timestamp", "ASC"]]
        });

        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
