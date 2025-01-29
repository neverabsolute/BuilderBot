import { prisma } from "bot-prisma";
import {
	ApplicationCommandOptionType,
	CommandInteraction,
	GuildMember
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { upsertMember } from "../../common/util.js";
import { CHAIN_ROLE_ID } from "../../configs.js";

@Discord()
@SlashGroup({ name: "chain", description: "Chain commands" })
@SlashGroup("chain")
export class Give {
	@Slash({
		name: "give",
		description: "Chain a user"
	})
	async whois(
		@SlashOption({
			name: "user",
			description: "User to chain",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		member: GuildMember,
		@SlashOption({
			name: "reason",
			description: "Reason for chain",
			type: ApplicationCommandOptionType.String,
			required: true
		})
		reason: string,
		@SlashOption({
			name: "duration",
			description:
				"Duration of chain in days, set to any number below 1 to make it permanent",
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
			await interaction.editReply("Cannot chain a bot.");
			return;
		}

		const user = await upsertMember(member);
		const chainRole = interaction.guild.roles.cache.get(CHAIN_ROLE_ID);
		const banExpiresAt = new Date();

		if (duration >= 1) {
			banExpiresAt.setDate(banExpiresAt.getDate() + duration);
		} else {
			banExpiresAt.setFullYear(9999);
		}

		const existingChain = await prisma.chain.findFirst({
			where: {
				userId: user.id,
				active: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});

		if (existingChain && existingChain.expiresAt > new Date()) {
			await interaction.editReply(
				`This user is already ticket banned until <t:${Math.floor(
					existingChain.expiresAt.getTime() / 1000
				)}:f>`
			);
			return;
		}

		if (!chainRole) {
			await interaction.editReply(
				"Cannot continue! Chain role not found."
			);
			return;
		}

		await prisma.chain.create({
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

		await member.roles.add(chainRole).catch(() => {
			interaction.editReply(
				"Failed to add chain role to user. Please check the bot's permissions."
			);
			return;
		});

		await interaction.editReply(
			`Chained ${member.user.tag} for ${duration} days.`
		);
	}
}
