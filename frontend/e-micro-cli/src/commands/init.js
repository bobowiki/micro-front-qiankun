import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";
// 当前文件路径
const __filename = fileURLToPath(import.meta.url);
// 当前目录路径
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');

export async function init(projectName) {
  try {
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "请输入项目名称:",
          validate: (input) => (input ? true : "项目名称不能为空"),
        },
      ]);
      projectName = answers.projectName;
    }
    // 拼上当前执行的路径 process.cwd() 拼上项目名称
    const targetDir = path.resolve(process.cwd(), projectName);
    // 检查路径
    if (fs.existsSync(targetDir)) {
      console.log(
        chalk.red(`目录 ${targetDir} 已存在，请选择一个不同的项目名称。`)
      );
      return;
    }
    const { template } = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "请选择项目模板:",
        choices: [
          {
            name: "React + rsbuild 微前端模板",
            value: "react-rsbuild-micro",
          },
        ],
      },
    ]);
    const templateDir = path.resolve(pkgRoot, "template", template);
    const pkgPath = path.join(templateDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName; // 修改为用户输入的项目名
      await fs.writeJson(pkgPath, pkg, { spaces: 2 }); // 保留缩进
    }
    // loading 动画
    const spinner = ora("正在初始化项目...").start();
    fs.mkdirSync(targetDir);
    // 复制模板文件到目标目录
    await fs.copy(templateDir, targetDir);
    spinner.succeed("项目初始化完成！");
    // 颜色输出下一步操作
    console.log(chalk.blue("下一步"));
    console.log(chalk.blue(`  cd ${projectName}`));
    console.log(chalk.blue("  pnpm install"));
    console.log(chalk.blue("  e-micro dev"));
  } catch (error) {
    console.error(chalk.red(`初始化项目失败: ${error.message}`));
  }
}
