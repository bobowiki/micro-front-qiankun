// middlewares/errorHandle.js
module.exports = async (ctx, next) => {
  try {
    await next(); // 执行后续中间件或路由
  } catch (err) {
    console.log("🚀 row: 5 - col: 12 err -> ", err);
    let status = 500;
    let message = "服务器内部错误";

    // Sequelize 错误处理
    if (err.name === "SequelizeUniqueConstraintError") {
      status = 200;
      message = `字段已存在: ${Object.keys(err.fields).join(", ")}`;
    } else if (err.name === "SequelizeValidationError") {
      status = 200;
      message = err.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    } else if (err.status) {
      // Koa 自带错误状态
      status = err.status;
      message = err.message;
    }

    ctx.status = status;
    ctx.body = { success: false, message };
  }
};
