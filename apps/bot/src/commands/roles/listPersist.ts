import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "roles", description: "Role commands" })
@SlashGroup("roles")
export class ListRolePersist {
	@Slash({
		name: "persist-list",
		description: "List roles that persist"
	})
	async listRolePersist(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const roles = await prisma.roles.findMany({
			where: {
				persists: true
			}
		});

		if (roles.length === 0) {
			const embed = new EmbedBuilder()
				.setTitle("No persisted roles")
				.setColor("Red")
				.setDescription(
					"There are no roles that persist. Please add one then try again."
				);
			await interaction.editReply({
				embeds: [embed]
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("Persisted roles")
			.setColor("Green")
			.setDescription(roles.map(role => `<@&${role.id}>`).join("\n"));
		await interaction.editReply({
			embeds: [embed]
		});
	}
}
