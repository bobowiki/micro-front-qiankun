import { Command } from "commander";
import { init } from "./commands/init.js";
import { dev } from "./commands/dev.js";
import { build } from "./commands/build.js";
import pkg from "../package.json";

const program = new Command();

program
  .name("e-micro")
  .description("这是一个由 echo 提供支持的微前端 CLI 工具")
  .version(pkg.version, "-v, --version", "打印对应的版本号");

program
  .command("init [projectName]")
  .description("初始化微前端项目工程")
  .action((projectName) => {
    // 调用 init 命令逻辑
    init(projectName);
  });

program
  .command("dev")
  .description("启动微前端项目开发环境")
  .action(() => {
    // 调用 dev 命令逻辑
    dev();
  });

program
  .command("build")
  .description("构建微前端项目")
  .action(() => {
    // 调用 build 命令逻辑
    build();
  });


if (process.argv.length <= 2) {
  program.outputHelp();
} else {
  program.parse(process.argv);
}
