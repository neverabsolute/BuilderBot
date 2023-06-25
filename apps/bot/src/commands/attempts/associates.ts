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
@SlashGroup({ name: "attempts", description: "Quiz attempt commands" })
@SlashGroup("attempts")
export class AssociatesAttempts {
	@Slash({
		name: "associates",
		description: "Get information about a user's associates attempts"
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
		const attempts = await prisma.associatesResponses.findMany({
			where: {
				user: {
					id: user.id
				}
			},
			orderBy: {
				createdAt: "desc"
			},
			take: 10
		});

		if (attempts.length === 0) {
			const message = await interaction.editReply(
				"This user has no associates attempts."
			);
			setTimeout(() => {
				message.delete();
			}, 5000);
			return;
		}

		const embeds = [];

		for (const attempt of attempts) {
			const embed = new EmbedBuilder()
				.setTitle(`Attempt #${attempt.id}`)
				.setColor("Red");
			embed.addFields(
				{
					name: "Started at",
					value: `<t:${Math.floor(attempt.createdAt.getTime() / 1000)}:f>`
				},
				{
					name: "Finished at",
					value: `<t:${Math.floor(attempt.updatedAt.getTime() / 1000)}:f>`
				},
				{
					name: "Score",
					value: `${attempt.score}/${attempt.maxScore}`
				}
			);
			embeds.push(embed.toJSON());
		}

		await interaction.editReply({
			embeds
		});
	}
}
