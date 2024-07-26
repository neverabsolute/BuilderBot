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
		name: "messages",
		description: "Get the leaderboard for messages"
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

		const messages = await prisma.message.findMany({
			where: {
				guildId: BigInt(guildId),
				createdAt: {
					gte
				}
			},
			include: {
				author: true
			}
		});

		const leaderboard = new Map<bigint, number>();

		for (const message of messages) {
			const authorId = BigInt(message.author.id);
			const count = leaderboard.get(authorId) ?? 0;
			leaderboard.set(authorId, count + 1);
		}

		const sorted = Array.from(leaderboard.entries()).sort(
			(a, b) => b[1] - a[1]
		);

		const embed = new EmbedBuilder()
			.setTitle("Who types the most?")
			.setDescription(`Leaderboard for the last ${period}`)
			.setColor("Blue");

		for (let i = 0; i < Math.min(sorted.length, 10); i++) {
			const [userId, count] = sorted[i];
			embed.addFields(
				{
					name: `#${i + 1}`,
					value: `<@${userId}>: ${count} messages`
				},
			);
		}

		await interaction.editReply({ embeds: [embed] });
	}
}
