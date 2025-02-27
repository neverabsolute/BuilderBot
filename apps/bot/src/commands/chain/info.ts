import {
	CommandInteraction,
	EmbedBuilder,
	GuildMember,
	ApplicationCommandOptionType
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";
import { upsertMember } from "../../common/util.js";

@Discord()
@SlashGroup({ name: "chain", description: "Chain commands" })
@SlashGroup("chain")
export class Info {
	@Slash({
		name: "info",
		description: "Get information about a user's chain(s)"
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

		const user = await upsertMember(member);
		const chains = await prisma.chain.findMany({
			where: {
				userId: user.id
			},
			orderBy: {
				updatedAt: "desc"
			},
			take: 10
		});

		if (chains.length === 0) {
			const message = await interaction.editReply(
				"This user has no chains."
			);
			setTimeout(() => {
				message.delete();
			}, 5000);
			return;
		}

		const embeds = [];

		for (const chain of chains) {
			const embed = new EmbedBuilder()
				.setTitle(`Chain #${chain.id}`)
				.setColor("Red");
			embed.addFields(
				{
					name: "Reason",
					value: chain.reason
				},
				{
					name: "Active?",
					value: chain.active ? "Yes" : "No"
				},
				{
					name: "Expires at",
					value: `<t:${Math.floor(chain.expiresAt.getTime() / 1000)}:f>`
				},
				{
					name: "Given by",
					value: `<@${chain.givenBy}>`
				}
			);
			if (chain.removedBy) {
				embed.addFields({
					name: "Removed by",
					value: `<@${chain.removedBy}>`
				});
			}
			embeds.push(embed.toJSON());
		}

		await interaction.editReply({
			embeds
		});
	}
}
