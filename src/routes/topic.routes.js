const express = require("express");
const router = express.Router();
const { TaskTopic, ProgrammingTask, TestQuestion } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


router.get("/", async (req, res) => {
  try {
    const topics = await TaskTopic.findAll();
    res.json(topics);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Сервер қатесі", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id, {
      include: [ProgrammingTask, TestQuestion],
    });
    if (!topic) return res.status(404).json({ message: "Тақырып табылмады" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Сервер қатесі", error });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const topic = await Topic.create({ title, description });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: "Қосу қатесі", error });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const topic = await TaskTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тақырып табылмады" });

    await topic.update(req.body);
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Жаңарту қатесі", error });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const topic = await TaskTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тақырып табылмады" });

    await topic.destroy();
    res.json({ message: "Тақырып жойылды" });
  } catch (error) {
    res.status(500).json({ message: "Жою қатесі", error });
  }
});

module.exports = router;
