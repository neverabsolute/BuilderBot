import { EmbedBuilder, PartialGroupDMChannel } from "discord.js";

import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const roleMessageText = `\`👔\` **Staff Roles**
- <@&636075781017305099> - Owners
- <@&722201585534500925> - Server Management
- <@&1191885045347127506> - Chat Moderators
- <@&1035647983871590410> - Pro Electricians and <#636789990981894159> Moderators
- <@&950891174250561536> - Degree System Management
- <@&864203594853253211> - Degree Ticket Workers
- <@&1166041937502011572> - Professors in Training

\`🎓\` **Degrees**
- <@&802287742426939412> - The best builders that have invented/refined a new building concept that has a proven usecase
- <@&1317054953201733662> - The best builders that have pushed the limits of base building
- <@&1317054857349435412> - The best builders that push the building meta for the competitive scene
- <@&1317054554239406141> - The best builders that have shown excellence in building fundamentals
- <@&1193321534996107365> - Advanced builders that have demonstrated their fundamental skills to professors with a solid base
> Check out <#1193368252009676850> to apply

\`⚪\` **Other Roles**
- <@&1108091898930941962> - Retired community members that contributed highly to Building Bulletin
- <@&636796048580542494> - Builders that have proven their building expertise, awarded by <@&722201585534500925>
- <@&1116831297017479249> - Deans that have retired from management
- <@&802602838353117234> - YouTubers/Streamers
- <@&802287690502111232> - Users that earned their Masters Degree before 2024
- <@&717856756012941344> - Pros at farming hemp and berries
- <@&636795992070422528> - The inner circle of Building Bulletin, awarded by <@&722201585534500925> to users that have actively been involved in the community
- <@&684667221578219550> - Awarded by <@&1035647983871590410> to skilled electricians
- <@&1193313811025907803> - For users that participate in Building Bulletin challenges
> Roles with the \`🏆\` icons are awarded from winning a base challenge
> Roles with the \`🔔\` emoji are notification roles and will be pinged for certain events`;

const boostMessageText = `\`🚀\` **Boost Perks**
- Hoisted role in the user list
- Booster role icon
- Can change nickname
- Access to the Building Bulletin private build server`;

@Discord()
export class Info {
	@SimpleCommand({
		name: "info",
		description: "Send info modal in current channel"
	})
	async info(command: SimpleCommandMessage) {
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

		const infoEmbed = new EmbedBuilder()
			.setDescription(roleMessageText)
			.setColor("#4e598c");
        
        const boostEmbed = new EmbedBuilder()
            .setDescription(boostMessageText)
            .setColor("#4e598c");

		await channel.send({
			embeds: [infoEmbed, boostEmbed]
		});
	}
}