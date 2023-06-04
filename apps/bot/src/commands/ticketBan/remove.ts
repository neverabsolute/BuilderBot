import { prisma } from "bot-prisma";
import {
	ApplicationCommandOptionType,
	CommandInteraction,
	GuildMember
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { upsertUser } from "../../common/util.js";
import { TICKETBAN_ROLE_ID } from "../../configs.js";

@Discord()
@SlashGroup({ name: "ticketban", description: "Ticket ban commands" })
@SlashGroup("ticketban")
export class Remove {
	@Slash({
		name: "remove",
		description: "Remove a user's active ticket ban"
	})
	async whois(
		@SlashOption({
			name: "user",
			description: "User to remove the ticket ban from",
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
				userId: user.id,
                active: true
			}
		});

		if (ticketBans.length === 0) {
			await interaction.editReply("This user has no active ticket bans.");
			return;
		}

		for (const ticketBan of ticketBans) {
			await prisma.ticketBan.update({
				where: {
					id: ticketBan.id
				},
				data: {
					active: false,
					removedBy: BigInt(interaction.user.id)
				}
			});

			await interaction.guild?.members
				.fetch(String(user.id))
				.then(async member => {
					if (!member) {
						return;
					}

					const ticketBanRole = interaction.guild?.roles.cache.get(
						`${TICKETBAN_ROLE_ID}`
					);

					if (!ticketBanRole) {
						throw new Error("Ticket ban role not found");
					}

					await member.roles.remove(ticketBanRole).catch(() => {});
				});
		}

		await interaction.editReply({
			content: "Any active ticket bans have been removed."
		});
	}
}
