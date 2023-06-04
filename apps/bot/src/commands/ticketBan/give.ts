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
export class Give {
	@Slash({
		name: "give",
		description: "Ticket ban a user"
	})
	async whois(
		@SlashOption({
			name: "user",
			description: "User to ticket ban",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		member: GuildMember,
		@SlashOption({
			name: "reason",
			description: "Reason for ticket ban",
			type: ApplicationCommandOptionType.String,
			required: true
		})
		reason: string,
		@SlashOption({
			name: "duration",
			description:
				"Duration of ticket ban in days, set to any number below 1 to make it permanent",
			type: ApplicationCommandOptionType.Integer,
			required: true
		})
		duration: number,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			await interaction.editReply("This command can only be used in a guild.");
			return;
		}

		if (member.user.bot) {
			await interaction.editReply("Cannot ticket ban a bot.");
			return;
		}

		const user = await upsertUser(member);
		const ticketBanRole = interaction.guild.roles.cache.get(TICKETBAN_ROLE_ID);
		const banExpiresAt = new Date();

		if (duration >= 1) {
			banExpiresAt.setDate(banExpiresAt.getDate() + duration);
		} else {
			banExpiresAt.setFullYear(9999);
		}

		const existingTicketBan = await prisma.ticketBan.findFirst({
			where: {
				userId: user.id
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		if (existingTicketBan && existingTicketBan.expiresAt > new Date()) {
			await interaction.editReply(
				`This user is already ticket banned until <t:${Math.floor(
					existingTicketBan.expiresAt.getTime() / 1000
				)}:f>`
			);
			return;
		}

		if (!ticketBanRole) {
			await interaction.editReply(
				"Cannot continue! Ticket ban role not found."
			);
			return;
		}

		await prisma.ticketBan.create({
			data: {
				user: {
					connect: {
						id: user.id
					}
				},
				reason: reason,
				expiresAt: banExpiresAt,
				givenBy: BigInt(interaction.user.id)
			}
		});

		await member.roles.add(ticketBanRole).catch(() => {
			interaction.editReply(
				"Failed to add ticket ban role to user. Please check the bot's permissions."
			);
			return;
		});

		await interaction.editReply(
			`Ticket banned ${member.user.tag} for ${duration} days.`
		);
	}
}
