import { EmbedBuilder } from "discord.js";

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
- <@&802287742426939412> - Legendary builders that have created meta breaking, revolutionary building concepts
- <@&636796048580542494> - The best builders that consistently make perfect bases
- <@&1193321534996107365> - Advanced builders that have demonstrated their skill to professors with a unique, advanced, and near-perfect base
- <@&1193303225990926460> - Above average builders that are up to date on building metas and can consistently recognize errors
- <@&1193303199394832516> - Builders that have an understanding of basic building fundamentals
> Check out <#801507663292530688> to apply

\`⚪\` **Other Roles**
- <@&1108091898930941962> - Retired community members that contributed highly to Building Bulletin
- <@&1116831297017479249> - Deans that have retired from management
- <@&802602838353117234> - YouTubers/Streamers
- <@&802287690502111232> - Users that earned their Masters Degree before 2024
- <@&717856756012941344> - Pros at farming help and berries
- <@&636795992070422528> - The inner circle of Building Bulletin, awarded  to users by <@&722201585534500925> that have actively been involved in the community
- <@&684667221578219550> - Awarded by <@&1035647983871590410> to skilled Electricians
- <@&1193313811025907803> - For users that participate in Building Bulletin challenges
> Roles with the \`🏆\` icons are awarded from winning a base challenge
> Roles with the \`🔔\` emoji are notification roles and will be pinged for certain events`;

const boostMessageText = `\`🚀\` **Boost Perks**
- Hoisted role in the user list
- Booster role icon
- Access to exclusive #builderboys channel`;

@Discord()
export class Info {
	@SimpleCommand({
		name: "info",
		description: "Send info modal in current channel"
	})
	async info(command: SimpleCommandMessage) {
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