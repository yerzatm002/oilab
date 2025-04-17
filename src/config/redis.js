const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redis.on('connect', () => console.log('✅ Redis подключен'));
redis.on('error', err => console.error('❌ Ошибка Redis:', err));

module.exports = redis;
