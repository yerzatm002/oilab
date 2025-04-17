const express = require("express");
const { Achievement, User, UserAchievements } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// 🔹 Получить достижения ученика
router.get("/:user_id", authMiddleware, async (req, res) => {
    try {
        // Проверяем, существует ли пользователь в UserAchievements
        const userAchievements = await UserAchievements.findAll({
            where: { userId: req.params.user_id },
            attributes: ["achievementId"], 
        });

        if (userAchievements.length === 0) {
            return res.json({ message: "Жетістіктер жоқ", achievements: [] });
        }

        // Извлекаем ID достижений
        const achievementIds = userAchievements.map((ua) => ua.achievementId);

        // Проверяем, существуют ли ачивменты с этими ID
        const achievements = await Achievement.findAll({
            where: { id: achievementIds },
        });

        return res.json({ achievements });
    } catch (error) {
        console.error("Ошибка загрузки достижений:", error);
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});


// 🔹 Добавить достижение (только администратор)
router.post("/add", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { achievement_name, points } = req.body;

        const achievement = await Achievement.create({ achievement_name, points });

        return res.status(201).json({ message: "Достижение добавлено", achievement });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить список всех достижений
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const achievements = await Achievement.findAll();
        return res.json(achievements);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Назначить достижение пользователю (только администратор)
router.post("/assign", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { userId, achievementId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        const achievement = await Achievement.findByPk(achievementId);
        if (!achievement) return res.status(404).json({ message: "Достижение не найдено" });

        await UserAchievements.create({ userId, achievementId });

        return res.json({ message: "Достижение назначено пользователю" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
