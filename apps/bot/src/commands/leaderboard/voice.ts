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
export class VoiceLeaderboard {
	@Slash({
		name: "voice",
		description: "Get the leaderboard for voice chat"
	})
	async voiceLeaderboard(
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

		const voiceCalls = await prisma.voiceCalls.findMany({
			where: {
				createdAt: {
					gte
				}
			},
			select: {
				user: true,
				duration: true
			}
		});

		const userDurations = new Map<bigint, number>();
		for (const voiceCall of voiceCalls) {
			const duration = userDurations.get(voiceCall.user.id) || 0;
			userDurations.set(voiceCall.user.id, duration + voiceCall.duration);
		}

		const sorted = Array.from(userDurations.entries()).sort(
			(a, b) => b[1] - a[1]
		);

		const embed = new EmbedBuilder()
			.setTitle("Voice Leaderboard")
			.setDescription(`Leaderboard for the past ${period}`)
			.setColor("Blue");

		for (let i = 0; i < Math.min(sorted.length, 10); i++) {
			const [userId, duration] = sorted[i];
			embed.addFields({
				name: `#${i + 1}`,
				value: `<@${userId}>: ${duration} ${
					duration === 1 ? "second" : "seconds"
				}`
			});
		}

		await interaction.editReply({ embeds: [embed] });
	}
}
