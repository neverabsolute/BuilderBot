import {
	CommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType,
	GuildMember
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "degree", description: "Degree commands" })
@SlashGroup("degree")
export class ShowDegrees {
	@Slash({
		name: "show",
		description: "Show a person's degrees"
	})
	async showDegrees(
		@SlashOption({
			name: "user",
			description: "User to show degrees for",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		user: GuildMember,
		interaction: CommandInteraction
	) {
		await interaction.deferReply();

		if (!interaction.guild) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("This command can only be used in a server")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		const degreeChanges = await prisma.degreeChanges.findMany({
			where: {
				toId: BigInt(user.id)
			},
			orderBy: {
				createdAt: "desc"
			},
			take: 10
		});

		const embed = new EmbedBuilder()
			.setTitle(`${user.user.username}'s degrees`)
			.setColor("Blurple");

		if (degreeChanges.length === 0) {
			embed.setDescription("No degrees found");
		}

		for (const change of degreeChanges) {
			embed.addFields(
				{
					name: "Degree",
					value: `\`${change.degree}\``,
					inline: true
				},
				{
					name: `${change.action === "ADD" ? "Added" : "Removed"} by`,
					value: `<@${change.fromId}>`,
					inline: true
				},
				{
					name: "Date",
					value: change.createdAt.toDateString(),
					inline: true
				}
			);
		}

        await interaction.editReply({
            embeds: [embed]
        });
	}
}
