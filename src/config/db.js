const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Подключение к БД PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('✅ База данных подключена'))
    .catch(err => console.error('❌ Ошибка подключения к БД:', err));

module.exports = sequelize;
