import { Command } from "commander";
import { createApp } from "./generator";

const program = new Command();

program
  .argument("<name>")
  .option("--ai", "Use AI to generate app")
  .action((name, options) => {
    createApp(name, options.ai);
  });

program.parse();