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
		await interaction.deferReply();

		const user = await upsertUser(member);
		const ticketBans = await prisma.ticketBan.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				updatedAt: "desc"
			},
			take: 10
		});

		if (ticketBans.length === 0) {
			const message = await interaction.editReply(
				"This user has no ticket bans."
			);
			setTimeout(() => {
				message.delete();
			}, 5000);
			return;
		}

		const embeds = [];

		for (const ticketBan of ticketBans) {
			const embed = new EmbedBuilder()
				.setTitle(`Ticket ban #${ticketBan.id}`)
				.setColor("Red");
			embed.addFields(
				{
					name: "Reason",
					value: ticketBan.reason
				},
				{
					name: "Active?",
					value: ticketBan.active ? "Yes" : "No"
				},
				{
					name: "Expires at",
					value: `<t:${Math.floor(ticketBan.expiresAt.getTime() / 1000)}:f>`
				},
				{
					name: "Given by",
					value: `<@${ticketBan.givenBy}>`
				}
			);
			if (ticketBan.removedBy) {
				embed.addFields({
					name: "Removed by",
					value: `<@${ticketBan.removedBy}>`
				});
			}
			embeds.push(embed.toJSON());
		}

		await interaction.editReply({
			embeds
		});
	}
}
