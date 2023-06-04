import {
	CommandInteraction,
	EmbedBuilder,
	GuildMember,
	ApplicationCommandOptionType
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";
import { upsertUser } from "../../common/util.js";

@Discord()
@SlashGroup({ name: "ticketban", description: "Ticket ban commands" })
@SlashGroup("ticketban")
export class Info {
	@Slash({
		name: "info",
		description: "Get information about a user's ticket ban(s)"
	})
	async whois(
		@SlashOption({
			name: "user",
			description: "User to inquire about",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		member: GuildMember,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		const user = await upsertUser(member);
		const ticketBans = await prisma.ticketBan.findMany({
			where: {
				userId: user.id
			}
		});

		if (ticketBans.length === 0) {
			await interaction.editReply("This user has no ticket bans.");
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`${member.user.tag}'s ticket bans`)
			.setColor("Red");

		for (const ticketBan of ticketBans) {
			embed.addFields({
				name: `Ticket ban #${ticketBan.id}`,
				value: `**Reason:** ${
					ticketBan.reason
				}\n**Banned until:** <t:${Math.floor(
					ticketBan.expiresAt.getTime() / 1000
				)}:f>\n**Banned by:** <@${ticketBan.staffId}>`
			});
		}

		await interaction.editReply({ embeds: [embed] });
	}
}
