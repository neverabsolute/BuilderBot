import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const phdMessageText = `Awarded to a builder that has invented/refined a new building concept with a practical proven use case.
> To earn this degree, submit your concept in a ticket with an explanation, screenshots, and if applicable: a code or video.`;

@Discord()
export class phdsInfo {
	@SimpleCommand({
		name: "phds",
		description: "Send phds modal in current channel"
	})
	async phds(command: SimpleCommandMessage) {
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
			.setTitle("`🎓` PhD")
			.setDescription(phdMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}