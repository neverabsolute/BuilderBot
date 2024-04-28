import { GuildMember } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { FOOTPRINTS_CHANNEL } from "../../../configs.js";

@Discord()
export class HandleMessageCreate {
	@On()
	async messageCreate([message]: ArgsOf<"messageCreate">) {
		if (message.author.bot) return;

		if (message.channelId == FOOTPRINTS_CHANNEL) {
			const discordian = message.member;

			if (!discordian || !(discordian instanceof GuildMember)) {
				return;
			}

			if (
				discordian.permissions.has("ManageGuild") ||
				discordian.permissions.has("Administrator") ||
				discordian.permissions.has("ManageMessages")
			) {
				return;
			}

			if (!message.attachments.size && !message.embeds.length) {
				await message.delete().catch(() => {});
			}
		}

		const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
		let match;

		while ((match = markdownLinkRegex.exec(message.content)) !== null) {
			const linkText = match[1];
			const actualLink = match[2];

			const url = new URL(actualLink);

			if (url.hostname.includes(linkText)) {
				return;
			}

			if (url.hostname === "cdn.discordapp.com") {
				return;
			}

			const discordian = message.member;

			if (!discordian || !(discordian instanceof GuildMember)) {
				return;
			}

			if (
				discordian.permissions.has("ManageGuild") ||
				discordian.permissions.has("Administrator") ||
				discordian.permissions.has("ManageMessages")
			) {
				return;
			}

			await message.delete().catch(() => {});

			await discordian
				.timeout(5 * 60 * 1000, "Attempting to mask a link as another link")
				.catch(() => {});

			break;
		}
	}
}
