import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const masterMessageText = `A degree for an advanced builder. These builders are very strong fundamentally, and can create solid bases
> To earn this degree, submit your best base via a Sanctuary or Rusticated code and optionally a YouTube link of a tour.

**Rules**
- You are allowed to receive feedback from other Bachelor degree and under builders. However, you can not receive any solutions.
- The base must be your own, copying other builders is not allowed.
- Breaking these rules will invalidate any attempts at this degree, and increase the cooldown between resubmits.

*You can find the criteria for Master's [here](<https://docs.google.com/document/d/1PQn2MLCoLu0ZRvAenMfkeoRWUOnmrdmLub0Koz_r2pI>)*`;

@Discord()
export class MastersInfo {
	@SimpleCommand({
		name: "masters",
		description: "Send masters modal in current channel"
	})
	async masters(command: SimpleCommandMessage) {
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
			.setTitle("`🎓` Master's Degree")
			.setDescription(masterMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}