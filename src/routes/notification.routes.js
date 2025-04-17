const express = require("express");
const { Notification } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// 🔹 Получить уведомления пользователя
router.get("/:user_id", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.params.user_id },
            order: [["createdAt", "DESC"]]
        });

        return res.json(notifications);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Отметить уведомление как прочитанное
router.post("/read", authMiddleware, async (req, res) => {
    try {
        const { notificationId } = req.body;

        const notification = await Notification.findByPk(notificationId);
        if (!notification) return res.status(404).json({ message: "Уведомление не найдено" });

        notification.isRead = true;
        await notification.save();

        return res.json({ message: "Уведомление отмечено как прочитанное" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
