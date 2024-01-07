import { EmbedBuilder } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const phdMessageText = `A degree for legendary builders that have single-handedly changed the meta by creating a revolutionary new building concept.
To earn this degree, submit your concept.

> **Reward:** PhD role, access to exclusive text channels, access to a private build server, and a special in-game color on <#778130373656707082> build servers.`;

@Discord()
export class phdsInfo {
	@SimpleCommand({
		name: "phds",
		description: "Send phds modal in current channel"
	})
	async phds(command: SimpleCommandMessage) {
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
			.setTitle("`🎓` PhD")
			.setDescription(phdMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}