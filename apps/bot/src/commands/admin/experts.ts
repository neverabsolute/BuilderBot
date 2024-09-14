import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const expertMessageText = `A degree for a the best builders in the scene. These builders are top of their class and can build unique bases with practically no error.
To earn this degree, submit your best bases.

> **Reward:** Expert Builder role, access to exclusive text channels, and access to a private build server.`;

@Discord()
export class ExpertsInfo {
	@SimpleCommand({
		name: "experts",
		description: "Send experts modal in current channel"
	})
	async experts(command: SimpleCommandMessage) {
		const channel = command.message.channel;

		if (channel instanceof PartialGroupDMChannel) {
			return;
		}
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
			.setTitle("`🎓` Expert Builder")
			.setDescription(expertMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}