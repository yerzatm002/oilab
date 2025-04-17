const express = require("express");
const { Competition, User, CompetitionSubmission } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// 🔹 Получить список соревнований
router.get("/", authMiddleware, async (req, res) => {
    try {
        const competitions = await Competition.findAll();
        return res.json(competitions);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Создать соревнование (только администратор)
router.post("/create", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, startTime, endTime } = req.body;

        const competition = await Competition.create({
            title,
            description,
            startTime,
            endTime
        });

        return res.status(201).json({ message: "Соревнование создано", competition });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Зарегистрироваться на соревнование
router.post("/join", authMiddleware, async (req, res) => {
    try {
        const { competitionId } = req.body;
        const userId = req.user.id;

        const competition = await Competition.findByPk(competitionId);
        if (!competition) return res.status(404).json({ message: "Соревнование не найдено" });

        await competition.addUser(userId);
        return res.json({ message: "Вы успешно зарегистрировались на соревнование" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить детали соревнования
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const competition = await Competition.findByPk(req.params.id, {
            include: [{ model: User, attributes: ["id", "name"] }]
        });

        if (!competition) return res.status(404).json({ message: "Соревнование не найдено" });

        return res.json(competition);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Отправить решение
router.post("/submit", authMiddleware, async (req, res) => {
    try {
        const { competitionId, solution, score } = req.body;
        const userId = req.user.id;

        const competition = await Competition.findByPk(competitionId);
        if (!competition) return res.status(404).json({ message: "Соревнование не найдено" });

        await CompetitionSubmission.create({
            competitionId,
            userId,
            solution,
            score
        });

        return res.json({ message: "Решение отправлено" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить рейтинг участников
router.get("/leaderboard", authMiddleware, async (req, res) => {
    try {
        const leaderboard = await CompetitionSubmission.findAll({
            attributes: ["userId", "competitionId", "score"],
            include: [{ model: User, attributes: ["id", "name"] }],
            order: [["score", "DESC"]]
        });

        return res.json(leaderboard);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
