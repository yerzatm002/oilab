const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { UserTestAnswer, TestQuestion } = require("../../models");

// 🔹 POST /test-answers – Отправить ответы на тест
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body; // массив [{ questionId, user_answer }]
    const userId = req.user.id;

    const results = [];

    for (const ans of answers) {
      const question = await TestQuestion.findByPk(ans.questionId);

      const isCorrect = question.correct_answer === ans.user_answer;

      const saved = await UserTestAnswer.create({
        userId,
        questionId: ans.questionId,
        user_answer: ans.user_answer,
        is_correct: isCorrect,
      });

      results.push(saved);
    }

    res.status(201).json({ message: "Жауаптар сақталды", results });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Қате", error });
  }
});

// 🔹 GET /test-answers/user/:userId – Получить результаты ученика
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const answers = await UserTestAnswer.findAll({
      where: { userId: req.params.userId },
    });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

// 🔸 GET /test-answers – Все результаты всех пользователей
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const allAnswers = await UserTestAnswer.findAll();
    res.json(allAnswers);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

// 🔸 GET /test-answers/user/:userId – Ответы по ученику (для админа)
router.get("/admin/:userId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const answers = await UserTestAnswer.findAll({
      where: { userId: req.params.userId },
    });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

module.exports = router;
