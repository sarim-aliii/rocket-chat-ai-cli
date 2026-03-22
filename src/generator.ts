import * as fs from "fs-extra";
import * as path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

export async function createApp(name: string) {
  try {
    // ✅ 1. Validate app name
    if (!/^[a-z0-9-]+$/.test(name)) {
      console.log(
        chalk.red("❌ Invalid name. Use lowercase letters, numbers, hyphens only.")
      );
      return;
    }

    const folder = path.join(process.cwd(), name);

    if (fs.existsSync(folder)) {
      console.log(chalk.red("❌ Folder already exists"));
      return;
    }

    // ✅ 2. Ask user input
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

    const spinner = ora("Creating app...").start();

    // ✅ 3. Create folder
    await fs.mkdir(folder);

    // ✅ 4. Copy templates
    const templatePath = path.resolve(__dirname, "../templates");
    await fs.copy(templatePath, folder);

    // ✅ 5. Replace values (clean way)
    const manifestPath = path.join(folder, "manifest.json");

    let manifest = await fs.readFile(manifestPath, "utf-8");

    const replacements: Record<string, string> = {
      "my-app": name,
      "My App": name,
      "Generated App": answers.description,
      "Ali": answers.author,
    };

    for (const key in replacements) {
      const regex = new RegExp(key, "g");
      manifest = manifest.replace(regex, replacements[key]);
    }

    await fs.writeFile(manifestPath, manifest);

    spinner.succeed(chalk.green(`✅ App '${name}' created successfully!`));
  } catch (error) {
    console.error(chalk.red("❌ Error creating app:"), error);
  }
}