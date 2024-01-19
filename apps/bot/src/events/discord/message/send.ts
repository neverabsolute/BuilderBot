import { GuildMember } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { FOOTPRINTS_CHANNEL } from "../../../configs.js";

@Discord()
export class HandleMessageCreate {
	@On()
	async messageCreate([message]: ArgsOf<"messageCreate">) {
		if (message.channelId == FOOTPRINTS_CHANNEL) {
			if (message.author.bot) return;

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

			await discordian
				.ban({
					reason: "Sending masked markdown links"
				})
				.catch(() => {});

			break;
		}
	}
}
