import {
	CommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup, SlashChoice } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "leaderboard", description: "Leaderboard commands" })
@SlashGroup("leaderboard")
export class MessageLeaderboard {
	@Slash({
		name: "reactions",
		description: "Get the leaderboard for reactions"
	})
	async messageLeaderboard(
		@SlashChoice("day")
		@SlashChoice("week")
		@SlashChoice("month")
		@SlashChoice("year")
		@SlashOption({
			name: "period",
			description: "The period to get the leaderboard for",
			type: ApplicationCommandOptionType.String,
			required: true
		})
		period: string,
		interaction: CommandInteraction
	) {
		await interaction.deferReply();

		const guildId = interaction.guildId;

		if (!guildId) {
			await interaction.editReply("This command must be run in a guild.");
			return;
		}

		const gte = new Date();
		gte.setHours(0, 0, 0, 0);

		switch (period) {
			case "day":
				gte.setDate(gte.getDate() - 1);
				break;
			case "week":
				gte.setDate(gte.getDate() - 7);
				break;
			case "month":
				gte.setMonth(gte.getMonth() - 1);
				break;
			case "year":
				gte.setFullYear(gte.getFullYear() - 1);
				break;
			default:
				await interaction.editReply("Invalid period.");
				return;
		}

		const results = await prisma.reaction.groupBy({
			by: ["userId"],
			where: {
				message: {
					guildId: BigInt(guildId)
				},
				createdAt: {
					gte
				}
			},
			_count: {
				userId: true
			},
			orderBy: {
				_count: {
					userId: "desc"
				}
			},
			take: 10
		});

		const embed = new EmbedBuilder()
			.setTitle("Who lurks the most?")
			.setDescription(`Leaderboard for the past ${period}`)
			.setColor("Blue");

		results.forEach((result, index) => {
			embed.addFields({
				name: `#${index + 1}`,
				value: `<@${result.userId}>: ${result._count.userId} reactions`
			});
		});

		const message = await interaction.editReply({ embeds: [embed] });

		setTimeout(() => message.delete().catch(() => {}), 10000);
	}
}
