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
	}
}
