import { GuildMember } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { FOOTPRINTS_CHANNEL } from "../../../configs.js";

@Discord()
export class HandleMessageUpdate {
	@On()
	async messageUpdate([message]: ArgsOf<"messageCreate">) {
		if (message.channelId !== FOOTPRINTS_CHANNEL) {
			return;
		}

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

		await message.delete().catch(() => {});
	}
}
