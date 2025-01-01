import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const doctorateMessageText = `A degree for a builder who has reached perfection. Proven by impressing deans and doctorate professors through a rigorous voting system.
- There is three achievable doctorates:
**Theory**
Pushing the limits of base building: logical/conceptual building that is flawless in theory (ic, pancake, etc)
Example: https://www.youtube.com/watch?v=7kKLpBW__tY
**Competitive**
Pushing the building meta for the competitive scene, near perfection in progression and defense
Example: https://www.youtube.com/watch?v=DMc4P0RFaQI
**Fundamental**
General building that shows excellence in fundamentals: a well-rounded base with efficient use of resources.
Example: https://www.youtube.com/watch?v=ntB-vGO6C-U
> To earn this degree, submit your best base via a Sanctuary or Rusticated code and a YouTube link of a tour
**Rules**
- You are not allowed to receive feedback from anyone who has a doctorate degree, or is an expert builder.
- The base must be your own, copying other builders is not allowed.
- Breaking these rules will invalidate any attempts at this degree, and increase the cooldown between resubmits.`;

@Discord()
export class DoctoratesInfo {
	@SimpleCommand({
		name: "doctorates",
		description: "Send doctorates modal in current channel"
	})
	async doctorates(command: SimpleCommandMessage) {
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
			.setTitle("`🎓` doctorate Builder")
			.setDescription(doctorateMessageText)
			.setColor("#4e598c");

		await channel.send({
			embeds: [embed]
		});
	}
}