import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const bachelorMessageText = `A degree for an above average builder. Builders with a Bachelor's Degree can recognize significant flaws and have a good understanding of metas.

> To earn this degree, complete a short answer quiz.

**Rules**
- For a Bachelor's degree you are not allowed to give or receive help from anyother builder, asking in chat for answers will invalidate the attempt at this degree, and increase the cooldown between resubmits.`;

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