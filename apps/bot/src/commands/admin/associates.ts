import { EmbedBuilder } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const associatesMessageText = `A degree for a good builder. Prove your knowledge with building fundamentals.
To earn this degree, complete a multiple choice quiz.

> **Reward:** Associate's Degree role.`;

@Discord()
export class AssociatesInfo {
	@SimpleCommand({
		name: "associates",
		description: "Send associates modal in current channel"
	})
	async associates(command: SimpleCommandMessage) {
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
			.setTitle("`🎓` Associate's Degree")
			.setDescription(associatesMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}