import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { upsertUser } from "../../common/util.js";
import { prisma } from "bot-prisma";

@Discord()
@SlashGroup({ name: "roles", description: "Role commands" })
@SlashGroup("roles")
export class HydrateRoles {
	@Slash({
		name: "hydrate",
		description:
			"Hydrate the roles table (this will be very slow, do not use unless jackson tells you to)"
	})
	async hydrateRoles(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const roles = await interaction.guild!.roles.fetch();
		const roleIds = roles.map(role => role.id);
		const roles_ = await prisma.roles.findMany({});

		const rolesToCreate = roleIds.filter(
			id => !roles_.find(role => role.id === BigInt(id))
		);
		const rolesToDelete = roles_.filter(
			role => !roleIds.includes(String(role.id))
		);

		const embed = new EmbedBuilder()
			.setTitle("Hydrating database")
			.setColor("Green")
			.setDescription(
				`Updating ${rolesToCreate.length + rolesToDelete.length} roles: ❔
Updating user to role mappings: ❔`
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
				`Updating ${rolesToCreate.length + rolesToDelete.length} roles: ✅
Updating user to role mappings: ❔`
			);
		await interaction.editReply({
			embeds: [embed2]
		});

		for (const member of (await interaction.guild!.members.fetch()).values()) {
			const user = await upsertUser(member);
			const userRoles = member.roles.cache.map(role => ({
				id: BigInt(role.id)
			}));

			for (const role of userRoles) {
				if (
					!(await prisma.roles.findFirst({
						where: {
							id: role.id
						}
					}))
				) {
					await prisma.roles.create({
						data: {
							id: role.id,
							name: roles.get(String(role.id))!.name
						}
					});
				}
			}

			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					roles: {
						set: userRoles
					}
				}
			});
		}

		const embed3 = new EmbedBuilder()
			.setTitle("Hydrating database")
			.setColor("Green")
			.setDescription(
				`Updating ${rolesToCreate.length + rolesToDelete.length} roles: ✅
Updating user to role mappings: ✅`
			);

		await interaction.editReply({
			embeds: [embed3]
		});
	}
}
