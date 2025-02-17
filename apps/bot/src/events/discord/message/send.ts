import { GuildMember } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { FOOTPRINTS_CHANNEL } from "../../../configs.js";
import { prisma } from "bot-prisma";
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

		if (!(message.author.id === "1278775823704391823")) return;

		const hasLinkInMessage = message.content.match(/(https?:\/\/[^\s]+)/g);

		if (!hasLinkInMessage) return;

		const messages = await prisma.message.findMany({
			where: {
				userId: BigInt(message.author.id),
				createdAt: {
					gte: new Date(Date.now() - 1000 * 60 * 60)
				}
			}
		});

		const linkCount = messages.filter((m) => m.content.match(/(https?:\/\/[^\s]+)/g)).length;
		if (linkCount > 3) {
			await message.delete().catch(() => {});
		}
	}
}
