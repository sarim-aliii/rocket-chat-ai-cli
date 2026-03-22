#!/usr/bin/env node

import { Command } from "commander";
import { createApp } from "./generator";

const program = new Command();

program
  .argument("<name>")
  .action((name) => {
    createApp(name);
  });

program.parse();