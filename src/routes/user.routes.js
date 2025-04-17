const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { User } = require("../../models");
const { ProgrammingTask, TaskTopic, TestQuestion, UserProgrammingSubmission, UserTestAnswer } = require("../../models");
const authMiddleware = require("../middleware/auth.middleware");


const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// 🔹 Получить профиль пользователя
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ["id", "name", "email", "avatar", "level", "experience_points"]
        });

        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Обновить профиль пользователя
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        await user.save();

        return res.json({ message: "Профиль обновлен", user });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Загрузить аватар
router.post("/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        user.avatar = `/uploads/${req.file.filename}`;
        await user.save();

        return res.json({ message: "Аватар загружен", avatar: user.avatar });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Сброс пароля
router.post("/password/reset", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        return res.json({ message: "Пароль сброшен" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Обновление настроек пользователя
router.post("/settings", authMiddleware, async (req, res) => {
    try {
        const { settings } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        user.settings = settings; // Допустим, у нас есть JSON-поле `settings`
        await user.save();

        return res.json({ message: "Настройки обновлены", settings: user.settings });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// GET /api/admin/users
router.get("/admin/users", authMiddleware, async (req, res) => {
    try {
        console.log(req.user)
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Тек қол жеткізу рұқсаты жоқ" });
      }
  
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "level", "experience_points", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
  
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Сервер қатесі", error });
    }
  });


// GET /api/admin/stats
router.get("/admin/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Тек қол жеткізу рұқсаты жоқ" });
    }

    const [
      totalUsers,
      totalTasks,
      totalTopics,
      totalTests,
      totalCodeSubmissions,
      totalTestAnswers,
    ] = await Promise.all([
      User.count(),
      ProgrammingTask.count(),
      TaskTopic.count(),
      TestQuestion.count(),
      UserProgrammingSubmission.count(),
      UserTestAnswer.count(),
    ]);

    return res.json({
      users: totalUsers,
      tasks: totalTasks,
      topics: totalTopics,
      testQuestions: totalTests,
      codeSubmissions: totalCodeSubmissions,
      testAnswers: totalTestAnswers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Статистика қатесі", error });
  }
});

  

module.exports = router;
