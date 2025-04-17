const express = require("express");
const { TaskProgress, User, Task } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// 🔹 Получить прогресс ученика
router.get("/:user_id", authMiddleware, async (req, res) => {
    try {
        const progress = await TaskProgress.findAll({
            where: { userId: req.params.user_id },
            include: [{ model: Task, attributes: ["title", "difficulty"] }]
        });

        if (!progress.length) return res.status(404).json({ message: "Прогресс не найден" });

        return res.json(progress);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Обновить прогресс ученика
router.post("/update", authMiddleware, async (req, res) => {
    try {
        const { taskId, score, status } = req.body;
        const userId = req.user.id;

        let progress = await TaskProgress.findOne({ where: { userId, taskId } });

        if (progress) {
            progress.score = score || progress.score;
            progress.status = status || progress.status;
            progress.completedAt = status === "completed" ? new Date() : null;
            await progress.save();
        } else {
            progress = await TaskProgress.create({ userId, taskId, score, status });
        }

        return res.json({ message: "Прогресс обновлен", progress });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить таблицу лидеров
router.get("/leaderboard", authMiddleware, async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ["id", "name", "level", "experience_points"],
            order: [["experience_points", "DESC"]],
            limit: 10
        });

        return res.json(leaderboard);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 История завершенных заданий
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const history = await TaskProgress.findAll({
            where: { userId: req.user.id, status: "completed" },
            include: [{ model: Task, attributes: ["title", "difficulty"] }],
            order: [["completedAt", "DESC"]]
        });

        return res.json(history);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
