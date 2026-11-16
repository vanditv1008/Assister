import { Telegraf } from "telegraf";
import chalk from "chalk";
import { WELCOME } from "./constants";
import { registerHandlers } from "./handlers";

export async function runTelegramMode() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_OWNER_ID;

  if (!token || !ownerId) {
    console.log(chalk.red("\nError: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_OWNER_ID in .env file.\n"));
    return;
  }

  const bot = new Telegraf(token);
  registerHandlers(bot);

  await bot.telegram.sendMessage(ownerId, WELCOME, { parse_mode: "Markdown" });
  console.log(chalk.green("Sent welcome message to Telegram.\n"));

  bot.launch();
  console.log(chalk.green("Telegram bot is running. Press Ctrl+C to stop.\n"));

  await new Promise<void>((resolve) => {
    const stop = () => {
      bot.stop("SIGINT");
      resolve();
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
}