const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// 🔹 Регистрация пользователя
router.post('/register', [
    body('name').notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, email, password } = req.body;

        // Проверяем, есть ли пользователь с таким email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email уже зарегистрирован" });

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const user = await User.create({
            name,
            email,
            password_hash: hashedPassword
        });

        return res.status(201).json({ message: "Пользователь создан", user });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Вход в систему
router.post('/login', [
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').notEmpty().withMessage('Пароль обязателен')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;

        // Проверяем, существует ли пользователь
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

        // Генерируем JWT-токен
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            level: user.level,
            rating: user.rating,
            role: user.role
          };

        return res.json({ message: "Вход выполнен", token, user: userData  });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Ошибка сервера", error });
    }
});

// 🔹 Выход из системы (стираем токен на клиенте)
router.post('/logout', authMiddleware, (req, res) => {
    return res.json({ message: "Выход выполнен" });
});

// 🔹 Обновление JWT-токена
router.post('/refresh', authMiddleware, (req, res) => {
    const newToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token: newToken });
});

module.exports = router;
