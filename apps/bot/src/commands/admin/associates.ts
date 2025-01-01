import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const associatesMessageText = `A degree for a good builder. Prove your knowledge with building fundamentals. 
> To earn this degree, complete a multiple choice quiz.
**Rules**
- For Associates degree you are not allowed to give or receive help from any other builder, asking in chat for answers will invalidate any attempts at this degree, and increase the cooldown between resubmits.`;

@Discord()
export class AssociatesInfo {
	@SimpleCommand({
		name: "associates",
		description: "Send associates modal in current channel"
	})
	async associates(command: SimpleCommandMessage) {
		const channel = command.message.channel;

		if (channel instanceof PartialGroupDMChannel) {
			return;
		}

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
			.setTitle("`🎓` Associate's Degree")
			.setDescription(associatesMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}
