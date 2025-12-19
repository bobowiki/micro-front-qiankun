require('dotenv').config(); // 读取 .env 文件

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'micro_front_db',
  },
};

module.exports = config;