import {
	CommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType,
	Role
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "roles", description: "Role commands" })
@SlashGroup("roles")
export class AddRolePersist {
	@Slash({
		name: "persist-add",
		description: "Add a role to the persisted list"
	})
	async addRolePersist(
		@SlashOption({
			name: "role",
			description: "Role to persist",
			type: ApplicationCommandOptionType.Role,
			required: true
		})
		role: Role,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		const role_ = await prisma.roles.findUnique({
			where: {
				id: BigInt(role.id)
			}
		});

		if (!role_) {
			const embed = new EmbedBuilder()
				.setTitle("Role not found")
				.setColor("Red")
				.setDescription(
					"The role you specified was not found in the database. Please try again."
				);
			await interaction.editReply({
				embeds: [embed]
			});
			return;
		}

		if (role_.persists) {
			const embed = new EmbedBuilder()
				.setTitle("Role already persisted")
				.setColor("Red")
				.setDescription(
					"The role you specified is already persisted. Please try again."
				);
			await interaction.editReply({
				embeds: [embed]
			});
			return;
		}

		await prisma.roles.update({
			where: {
				id: BigInt(role_.id)
			},
			data: {
				persists: true
			}
		});

		const embed = new EmbedBuilder()
			.setTitle("Role persisted")
			.setColor("Green")
			.setDescription(
				"The role you specified has been persisted and will be re-added to members if they leave and re-join."
			);
		await interaction.editReply({
			embeds: [embed]
		});
	}
}
