import * as fs from "fs-extra";
import * as path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export async function createApp(name: string, useAI = false) {
  try {
    // ✅ 1. Validate name
    if (!/^[a-z0-9-]+$/.test(name)) {
      console.log(
        chalk.red("❌ Invalid name. Use lowercase letters, numbers, hyphens only.")
      );
      return;
    }

    let description = "My Rocket.Chat App";
    let author = "Ali";
    let commands: string[] = [];

    // ✅ 2. AI MODE (SAFE + FALLBACK)
    if (useAI) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        const model = genAI.getGenerativeModel({
          model: "models/gemini-2.5-flash",
        });

        const prompt = `
You are a developer assistant.

Generate JSON for a Rocket.Chat app.

App name: ${name}

Return ONLY valid JSON:
{
  "description": "...",
  "commands": ["command1", "command2"]
}
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // ✅ Clean markdown if AI wraps output
        text = text.replace(/```json|```/g, "").trim();

        const parsed = JSON.parse(text);

        description = parsed.description || description;
        commands = parsed.commands || [];
      } catch (err) {
        console.log(chalk.yellow("⚠️ AI failed, falling back to manual input"));
      }
    }

    // ✅ 3. FALLBACK (manual input if AI fails or disabled)
    if (!useAI || description === "My Rocket.Chat App") {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "description",
          message: "Enter app description:",
          default: description,
        },
        {
          type: "input",
          name: "author",
          message: "Enter author name:",
          default: author,
        },
      ]);

      description = answers.description;
      author = answers.author;
    }

    const folder = path.join(process.cwd(), name);

    if (fs.existsSync(folder)) {
      console.log(chalk.red("❌ Folder already exists"));
      return;
    }

    const spinner = ora("Creating app...").start();

    // ✅ 4. File operations
    await fs.mkdir(folder);

    const templatePath = path.resolve(__dirname, "../templates");
    await fs.copy(templatePath, folder);

    // ✅ 5. Replace values
    const manifestPath = path.join(folder, "manifest.json");

    let manifest = await fs.readFile(manifestPath, "utf-8");

    const replacements: Record<string, string> = {
      "my-app": name,
      "My App": name,
      "Generated App": description,
      "Ali": author,
    };

    for (const key in replacements) {
      const regex = new RegExp(key, "g");
      manifest = manifest.replace(regex, replacements[key]);
    }

    await fs.writeFile(manifestPath, manifest);

    // ✅ 6. Generate command files
    if (commands.length > 0) {
      const commandsDir = path.join(folder, "commands");
      await fs.mkdir(commandsDir);

      for (const cmd of commands) {
        const className = cmd
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("");

        const fileContent = `
export class ${className}Command {
  execute() {
    console.log("${cmd} executed");
  }
}
`;

        await fs.writeFile(
          path.join(commandsDir, `${cmd}.ts`),
          fileContent
        );
      }
    }

    spinner.succeed(
      chalk.green(`✅ App '${name}' created successfully!`)
    );
  } catch (error) {
    console.error(chalk.red("❌ Error creating app:"), error);
  }
}