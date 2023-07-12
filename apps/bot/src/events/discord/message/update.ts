import { EmbedBuilder, GuildMember, Message } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { AUTOMOD_CHANNEL_ID } from "../../../configs.js";

@Discord()
export class HandleMessageUpdate {
	@On()
	async messageUpdate([oldMessage, newMessage]: ArgsOf<"messageUpdate">) {
		if (!(oldMessage instanceof Message) || !(newMessage instanceof Message))
			return;

		if (oldMessage.author.bot || newMessage.author.bot) return;

		const discordian = newMessage.member;

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

		const regex = /(https?:\/\/[^\s]+)/g;
		const oldUrls = (oldMessage.content.match(regex) || []).map(
			url => new URL(url).href
		);
		const newUrls = (newMessage.content.match(regex) || []).map(
			url => new URL(url).href
		);

		if (
			!newUrls.every(val => oldUrls.includes(val)) ||
			oldUrls.length !== newUrls.length
		) {
			await newMessage.delete().catch(() => null);
			const channel = await newMessage.guild?.channels.fetch(
				AUTOMOD_CHANNEL_ID
			);
			if (channel && channel.isTextBased()) {
				const embed = new EmbedBuilder()
					.setTitle("Automod")
					.setDescription(
						`Message from ${newMessage.author} was deleted for having a link then being edited to have a different link.`
					)
					.setColor("Red")
					.addFields(
						{ name: "Old Message", value: oldMessage.content },
						{ name: "New Message", value: newMessage.content },
						{ name: "Channel", value: newMessage.channel.toString() },
						{
							name: "Originally Posted At",
							value: oldMessage.createdAt.toUTCString()
						},
						{
							name: "Edited At",
							value: newMessage.editedAt?.toUTCString() ?? "Never"
						}
					);

				await channel.send({ embeds: [embed] }).catch(() => null);
			}
		}
	}
}
