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
export class Remove {
	@Slash({
		name: "remove",
		description: "Remove a user's active chain"
	})
	async whois(
		@SlashOption({
			name: "user",
			description: "User to remove the chain from",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		member: GuildMember,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		const user = await upsertMember(member);
		const chains = await prisma.chain.findMany({
			where: {
				userId: user.id,
				active: true
			}
		});

		if (chains.length === 0) {
			await interaction.editReply("This user has no active chains.");
			return;
		}

		for (const chain of chains) {
			await prisma.chain.update({
				where: {
					id: chain.id
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

					const chainRole = interaction.guild?.roles.cache.get(
						`${CHAIN_ROLE_ID}`
					);

					if (!chainRole) {
						throw new Error("Chain role not found");
					}

					await member.roles.remove(chainRole).catch(() => {});
				});
		}

		await interaction.editReply({
			content: "Any active chains have been removed."
		});
	}
}
