const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { TestQuestion } = require("../../models");

// 🔹 GET: Получить все тесты по теме (студент)
router.get("/topic/:topicId", authMiddleware, async (req, res) => {
  try {
    const questions = await TestQuestion.findAll({
      where: { topicId: req.params.topicId },
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

// 🔸 POST: Добавить вопрос (админ)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const question = await TestQuestion.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

// 🔸 PUT: Обновить вопрос (админ)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await TestQuestion.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Сұрақ жаңартылды", updated });
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

// 🔸 DELETE: Удалить вопрос (админ)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await TestQuestion.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Сұрақ өшірілді" });
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

module.exports = router;
