import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const degreeInfoMessageText = `Introducing Building Degrees from the prestigious Building Bulletin! Test your build skills by creating a ticket below. If you pass the test you will be awarded with a building degree that proves your building plan strength. 

> There are five separate degrees that you can earn, each with their own rewards!`;

@Discord()
export class DegreeInfo {
	@SimpleCommand({
		name: "degreeinfo",
		description: "Send degree info modal in current channel"
	})
	async degreeInfo(command: SimpleCommandMessage) {
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
        .setTitle("`🎓` Building Degrees")
			.setDescription(degreeInfoMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}