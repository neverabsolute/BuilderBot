import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "role", description: "Role commands" })
@SlashGroup("role")
export class HydrateRoles {
	@Slash({
		name: "hydrate",
		description:
			"Hydrate the roles table (this will be very slow, use with caution)"
	})
	async hydrateRoles(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const roles = await interaction.guild!.roles.fetch();
		const roleIds = roles.map(role => role.id);
		const roles_ = await prisma.roles.findMany({
			where: {
				id: {
					in: roleIds.map(id => BigInt(id))
				}
			}
		});

		const rolesToCreate = roleIds.filter(
			id => !roles_.find(role => role.id === BigInt(id))
		);
		const rolesToDelete = roles_.filter(
            role => !roleIds.find(id => role.id === BigInt(id))
        );

		const embed = new EmbedBuilder()
			.setTitle("Hydrating database")
			.setColor("Green")
			.setDescription(
				`Creating ${rolesToCreate.length} roles and deleting ${rolesToDelete.length} roles.`
			);
		await interaction.editReply({
			embeds: [embed]
		});

		for (const roleId of rolesToCreate) {
			await prisma.roles.create({
				data: {
					id: BigInt(roleId),
					name: roles.get(roleId)!.name
				}
			});
		}

		for (const role of rolesToDelete) {
			await prisma.roles.delete({
				where: {
					id: role.id
				}
			});
		}

		const embed2 = new EmbedBuilder()
			.setTitle("Hydrating database")
			.setColor("Green")
			.setDescription(
				`Created ${rolesToCreate.length} roles and deleted ${rolesToDelete.length} roles.`
			);
		await interaction.editReply({
			embeds: [embed2]
		});
	}
}
