import * as fs from "fs-extra";
import * as path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

export async function createApp(name: string) {
  // Step 1: Ask questions
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "Enter app description:",
      default: "My Rocket.Chat App",
    },
    {
      type: "input",
      name: "author",
      message: "Enter author name:",
      default: "Ali",
    },
  ]);

  const folder = path.join(process.cwd(), name);

  if (fs.existsSync(folder)) {
    console.log(chalk.red("❌ Folder already exists"));
    return;
  }

  const spinner = ora("Creating app...").start();

  // Step 2: Create folder
  fs.mkdirSync(folder);

  // Step 3: Copy templates
  const templatePath = path.resolve(__dirname, "../templates");
  fs.copySync(templatePath, folder);

  // Step 4: Modify manifest.json
  const manifestPath = path.join(folder, "manifest.json");

  let manifest = fs.readFileSync(manifestPath, "utf-8");

  manifest = manifest
    .replace(/my-app/g, name)
    .replace(/My App/g, name)
    .replace(/Generated App/g, answers.description)
    .replace(/Ali/g, answers.author);

  fs.writeFileSync(manifestPath, manifest);

  spinner.succeed(chalk.green("✅ App created successfully!"));
}