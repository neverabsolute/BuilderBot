import { dirname as dir, importx } from "@discordx/importer";
import { prisma } from "bot-prisma";
import { GuildMember, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import "reflect-metadata";
import { saveMessage, upsertUser } from "./common/util.js";
import { BOT_TOKEN, GUILD_ID } from "./configs.js";
import { initializeLoops } from "./loops/main.js";

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

	for (const guild of bot.guilds.cache.values()) {
		if (!guild.available || !(guild.id === GUILD_ID)) continue;
		const roles = await guild.roles.fetch();
		const roleIds = roles.map(role => role.id);
		const roles_ = await prisma.roles.findMany({
			where: {
				id: {
					in: roleIds.map(id => BigInt(id))
				}
			}
		});

		const rolesToCreate = roleIds.filter(
			id => !roles_.find(role => role.id === BigInt(id))
		);
		const rolesToDelete = roles_.filter(
			role => !roleIds.find(id => role.id === BigInt(id))
		);

		console.log(
			`Creating ${rolesToCreate.length} roles and deleting ${rolesToDelete.length} roles.`
		);

		for (const roleId of rolesToCreate) {
			await prisma.roles.create({
				data: {
					id: BigInt(roleId),
					name: roles.get(roleId)!.name
				}
			});
		}

		for (const role of rolesToDelete) {
			await prisma.roles.delete({
				where: {
					id: role.id
				}
			});
		}

		console.log(
			`Created ${rolesToCreate.length} roles and deleted ${rolesToDelete.length} roles.`
		);
	}

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
await initializeLoops(bot);
