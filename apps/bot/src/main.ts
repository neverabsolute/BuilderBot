import { dirname as dir, importx } from "@discordx/importer";
import { GuildMember, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import "reflect-metadata";
import { saveMessage, upsertUser } from "./common/util.js";
import { BOT_TOKEN } from "./configs.js";

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
	bot.user?.setActivity(".gg/buildingbulletin");

	console.log("Bot started");
});

bot.on("interactionCreate", async interaction => {
	if (interaction.member instanceof GuildMember) {
		await upsertUser(interaction.member);
	}

	bot.executeInteraction(interaction);
});

bot.on("messageCreate", async message => {
	if (message.author.bot) return;
	if (message.member) {
		await upsertUser(message.member);
		await saveMessage(message);
	}
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
