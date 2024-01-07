import { EmbedBuilder } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const rulesMessageText = `1. Leave your ego at the door.

2. Be respectful to staff members and other users.

3. Slurs/hate speech will not be tolerated. 

4. Sending any harmful material such as viruses or IP grabbers is an immediate and permanent ban.

5. No doxxing/revealing personal information about others.

6. No graphic or NSFW content.

7. No spamming or trolling, do not bypass automod filters.

8. Keep chats relevant to their category/channel.

9. If posting someone else's build, credit when applicable.

10. Follow Discord's [terms of service](https://discord.com/terms).

> If you have any questions or would like to appeal a ban or restriction, please use <#1137557514221789224>`;

const rulesMessageFooter =
	"Rules may be modified or enforced at staff discretion. Please do not try to argue about decisions made by staff.";

@Discord()
export class Rules {
	@SimpleCommand({
		name: "rules",
		description: "Send rules modal in current channel"
	})
	async rules(command: SimpleCommandMessage) {
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

		const rulesEmbed = new EmbedBuilder()
			.setTitle("`📜` Rules")
			.setDescription(rulesMessageText)
			.setColor("#4e598c");

		rulesEmbed.setFooter({ text: rulesMessageFooter });

		await channel.send({
			embeds: [rulesEmbed]
		});
	}
}