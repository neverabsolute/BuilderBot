import {
	CommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType,
	Role
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "role", description: "Role commands" })
@SlashGroup("role")
export class AddRolePersist {
	@Slash({
		name: "persist-remove",
		description: "Remove a role from the persisted list"
	})
	async removeRolePersist(
		@SlashOption({
			name: "role",
			description: "Role to un-persist",
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

        if (!role_.persists) {
            const embed = new EmbedBuilder()
                .setTitle("Role already persisted")
                .setColor("Red")
                .setDescription(
                    "The role you specified is not persisted. Please try again."
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
                persists: false
            }
        });

        const embed = new EmbedBuilder()
            .setTitle("Role de-persisted")
            .setColor("Green")
            .setDescription(
                "The role you specified has been de-persisted and will no longer be re-added to members if they leave and re-join."
            );
        await interaction.editReply({
            embeds: [embed]
        });
	}
}
