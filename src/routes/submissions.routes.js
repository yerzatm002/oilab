const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { UserProgrammingSubmission, User, ProgrammingTask } = require("../../models");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { taskId, submitted_code, result, score } = req.body;

    const submission = await UserProgrammingSubmission.create({
      userId: req.user.id,
      taskId,
      submitted_code,
      result,
      score,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    console.log(req.params.userId)
    if (req.user.id != req.params.userId) {
      return res.status(403).json({ message: "Рұқсат жоқ" });
    }

    const submissions = await UserProgrammingSubmission.findAll({
      where: { userId: req.params.userId },
      include: [ProgrammingTask],
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.get("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const submissions = await UserProgrammingSubmission.findAll({
      where: {
        taskId: req.params.taskId,
      },
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const allSubmissions = await UserProgrammingSubmission.findAll({
      include: [User, ProgrammingTask],
    });
    res.json(allSubmissions);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.get("/admin/task/:taskId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const submissions = await UserProgrammingSubmission.findAll({
      where: { taskId: req.params.taskId },
      include: [User],
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

module.exports = router;
