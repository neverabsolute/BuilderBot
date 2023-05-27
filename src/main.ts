import { dirname as dir, importx } from "@discordx/importer";
import { GuildMember, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { dirname } from "path";
import "reflect-metadata";
import { fileURLToPath } from "url";
import { BOT_TOKEN } from "./configs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const bot = new Client({
	// To only use global commands (use @Guild for specific guild command), comment this line
	// botGuilds: process.env.PRODUCTION
	// 	? undefined
	// 	: [client => client.guilds.cache.map(guild => guild.id)],

	// Discord intents
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent
	],

	// Debug logs are disabled in silent mode
	silent: false
});

bot.once("ready", async () => {
	await bot.guilds.fetch();

	await bot.initApplicationCommands();

	console.log("Bot started");
	bot.user?.setActivity("no offenced but...");
});

bot.on("interactionCreate", async interaction => {
	// if (interaction.member instanceof GuildMember) {
	// 	await upsertUser(interaction.member);
	// }

	bot.executeInteraction(interaction);
});

bot.on("messageCreate", async message => {
	if (message.author.bot) return;
	// if (message.member) {
	// 	await upsertUser(message.member);
	// 	await saveMessage(message);
	// }
	await bot.executeCommand(message);
});

bot.on("unhandledRejection", (reason: Error, promise: Promise<unknown>) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

bot.on("uncaughtException", (error: Error) => {
	console.error("Uncaught Exception at:", error);
});

async function run() {
	await importx(
		dir(import.meta.url) + "/{events/discord,commands}/**/*.{ts,js}"
	);

	await bot.login(BOT_TOKEN);
}

run();
