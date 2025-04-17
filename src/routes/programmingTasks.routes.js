const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { ProgrammingTask } = require("../../models");

router.get("/topic/:topicId", authMiddleware, async (req, res) => {
  try {
    const tasks = await ProgrammingTask.findAll({
      where: { topicId: req.params.topicId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await ProgrammingTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Тапсырма табылмады" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const task = await ProgrammingTask.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const task = await ProgrammingTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Тапсырма табылмады" });

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const task = await ProgrammingTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Тапсырма табылмады" });

    await task.destroy();
    res.json({ message: "Тапсырма жойылды" });
  } catch (error) {
    res.status(500).json({ message: "Қате", error });
  }
});

module.exports = router;
