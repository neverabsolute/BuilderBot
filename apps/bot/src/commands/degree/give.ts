import {
	CommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType,
	GuildMember,
	AutocompleteInteraction
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { Degrees, prisma } from "bot-prisma";
import { filterForDegrees, getDegreeById, getDegreeByName } from "./common.js";
import { upsertMember } from "../../common/util.js";

@Discord()
@SlashGroup({ name: "degree", description: "Degree commands" })
@SlashGroup("degree")
export class GiveDegree {
	@Slash({
		name: "give",
		description: "Add a degree to a person"
	})
	async giveDegree(
		@SlashOption({
			name: "user",
			description: "User to give degree to",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		user: GuildMember,
		@SlashOption({
			autocomplete: async function (interaction: AutocompleteInteraction) {
				const value = interaction.options.getString("degree", true);
				await interaction.respond(await filterForDegrees(value));
			},
			name: "degree",
			description: "Degree to give",
			type: ApplicationCommandOptionType.String,
			required: true
		})
		degree: string,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		await upsertMember(user);

		if (!interaction.guild) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("This command can only be used in a server")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		const degree_ = getDegreeById(degree);

		if (!degree_) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("Could not find the degree")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		const role = interaction.guild.roles.cache.get(degree_.id);

		if (!role) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("Could not find the degree role")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		if (user.roles.cache.has(role.id)) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("User already has this degree")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		if (degree_.previous) {
			const previousDegree = getDegreeByName(degree_.previous);

			if (!previousDegree) {
				const embed = new EmbedBuilder()
					.setTitle("Error")
					.setDescription("Could not find the previous degree")
					.setColor("Red");

				return await interaction.editReply({
					embeds: [embed]
				});
			}

			const previousRole = interaction.guild.roles.cache.get(previousDegree.id);

			if (!previousRole) {
				const embed = new EmbedBuilder()
					.setTitle("Error")
					.setDescription("Could not find the previous degree role")
					.setColor("Red");

				return await interaction.editReply({
					embeds: [embed]
				});
			}

			await user.roles.remove(previousRole).catch(() => {});
		}

		await user.roles.add(role).catch(async () => {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("Failed to add degree to user")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		});

		await prisma.degreeChanges.create({
			data: {
				from: {
					connect: {
						id: BigInt(interaction.user.id)
					}
				},
				to: {
					connect: {
						id: BigInt(user.id)
					}
				},
				action: "ADD",
				degree: degree_.name.toUpperCase() as Degrees
			}
		});

		const embed = new EmbedBuilder()
			.setTitle("Success")
			.setDescription(`Added ${role.name} to ${user.user.tag}`)
			.setColor("Green");

		await interaction.editReply({
			embeds: [embed]
		});
	}
}
