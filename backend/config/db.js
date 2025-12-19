const { Sequelize } = require('sequelize');
const config = require('./config');

// Sequelize 连接 PostgreSQL
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host, // 如果在 Docker 网络里用服务名则是 'postgres'
  port: config.db.port,
  dialect: 'postgres',
  // logging: console.log, // 可选，打印 SQL
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;