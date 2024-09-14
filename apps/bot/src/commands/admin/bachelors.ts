import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const bachelorMessageText = `A degree for an above average builder. Builders with a Bachelor's Degree separate themselves from the rest of the pack through knowledge about the current metas in rust building.
To earn this degree, complete a short answer quiz.

> **Reward:** Bachelor's Degree role and a special in-game color on <#778130373656707082> build servers.`;

@Discord()
export class BachelorsInfo {
	@SimpleCommand({
		name: "bachelors",
		description: "Send bachelor modal in current channel"
	})
	async bachelors(command: SimpleCommandMessage) {
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
			.setTitle("`🎓` Bachelors's Degree")
			.setDescription(bachelorMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}