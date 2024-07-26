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
@SlashGroup({ name: "attempts", description: "Quiz attempt commands" })
@SlashGroup("attempts")
export class AssociatesCooldown {
	@Slash({
		name: "skip-cooldown",
		description: "Reset the cooldown for the associates quiz"
	})
	async associatesCooldown(
		@SlashOption({
			name: "user",
			description: "User to reset for",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		member: GuildMember,
		interaction: CommandInteraction
	) {
		await interaction.deferReply();

		const config = await prisma.associatesConfiguration.findFirst({});
		const numDaysAgo = config?.retryDelayDays || 7;

		const discordUser = await upsertMember(member);

		const responses = await prisma.associatesResponses.findMany({
			where: {
				userId: discordUser.id,
				createdAt: {
					gte: new Date(Date.now() - numDaysAgo * 24 * 60 * 60 * 1000)
				},
                finished: true,
                cdSkipped: false
			}
		});

		if (responses.length === 0) {
			const message = await interaction.editReply(
				"This user has no recent associates attempts."
			);
			setTimeout(() => {
				message.delete();
			}, 5000);
			return;
		}

		for (const response of responses) {
			await prisma.associatesResponses.update({
				where: {
					id: response.id
				},
				data: {
					cdSkipped: true,
					cdSkippedBy: {
						connect: {
							id: BigInt(interaction.user.id)
						}
					}
				}
			});
		}

		const embed = new EmbedBuilder()
			.setTitle("Cooldown reset")
			.setDescription(
				`The cooldown for ${member.user.username} has been reset.`
			)
			.setColor("Green")
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed]
		});
	}
}
