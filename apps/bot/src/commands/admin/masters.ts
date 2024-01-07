import { EmbedBuilder } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const masterMessageText = `A degree for an advanced builder. These builders are top of their class and can build unique bases with practically no error.
To earn this degree, submit your best base via a Sanctuary or Rusticated code and optionally a YouTube link of a tour.

> **Reward:** Master's Degree role, access to exclusive text channels, access to a private build server, and a special in-game color on <#778130373656707082> build servers.`;

@Discord()
export class MastersInfo {
	@SimpleCommand({
		name: "masters",
		description: "Send masters modal in current channel"
	})
	async masters(command: SimpleCommandMessage) {
		const channel = command.message.channel;
		const member = command.message.member;

		if (!member) {
			return;
		}

		if (
			!member.permissions.has("ManageGuild") &&
			!member.permissions.has("Administrator")
		) {
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("`🎓` Master's Degree")
			.setDescription(masterMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}