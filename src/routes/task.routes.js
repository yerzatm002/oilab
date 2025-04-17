const express = require("express");
const { Task } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// 🔹 Получить список всех задач
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.findAll();
        return res.json(tasks);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Получить задачу по ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) return res.status(404).json({ message: "Задача не найдена" });

        return res.json(task);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Добавить новую задачу (только администратор)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, type, difficulty, tags, time_limit } = req.body;

        const task = await Task.create({
            title,
            description,
            type,
            difficulty,
            tags,
            time_limit
        });

        return res.status(201).json({ message: "Задача создана", task });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Обновить задачу (только администратор)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, type, difficulty, tags, time_limit } = req.body;

        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Задача не найдена" });

        task.title = title || task.title;
        task.description = description || task.description;
        task.type = type || task.type;
        task.difficulty = difficulty || task.difficulty;
        task.tags = tags || task.tags;
        task.time_limit = time_limit || task.time_limit;

        await task.save();

        return res.json({ message: "Задача обновлена", task });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Удалить задачу (только администратор)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Задача не найдена" });

        await task.destroy();

        return res.json({ message: "Задача удалена" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

module.exports = router;
