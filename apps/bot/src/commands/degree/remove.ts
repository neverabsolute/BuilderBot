import {
	CommandInteraction,
	EmbedBuilder,
	ApplicationCommandOptionType,
	GuildMember,
	AutocompleteInteraction
} from "discord.js";
import { DEGREE_MAP } from "../../configs.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";

interface Autocomplete {
	value: string;
	name: string;
}

async function filterForDegrees(value: string) {
	const autocomplete: Autocomplete[] = [];

	for (const [name, id] of DEGREE_MAP) {
		if (name.toLowerCase().includes(value.toLowerCase())) {
			autocomplete.push({ name, value: id });
		}
	}

	return autocomplete;
}

@Discord()
@SlashGroup({ name: "degree", description: "Degree commands" })
@SlashGroup("degree")
export class RemoveDegree {
	@Slash({
		name: "remove",
		description: "Remove a degree from a person"
	})
	async removeDegree(
		@SlashOption({
			name: "user",
			description: "User to remove degree from",
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
			description: "Degree to remove",
			type: ApplicationCommandOptionType.String,
			required: true
		})
		degree: string,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("This command can only be used in a server")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		const role = interaction.guild.roles.cache.get(degree);

		if (!role) {
			const embed = new EmbedBuilder()
				.setTitle("Error")
				.setDescription("Invalid degree")
				.setColor("Red");

			return await interaction.editReply({
				embeds: [embed]
			});
		}

		if (!user.roles.cache.has(role.id)) {
			const embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`${user.user.tag} does not have ${role.name}`)
                .setColor("Red");

            return await interaction.editReply({
                embeds: [embed]
            });
		}

        await user.roles.remove(role).catch(async () => {
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Failed to remove degree")
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
				action: "REMOVE",
				degree: "923071974081691688" === role.id ? "BACHELORS" : "MASTERS"
			}
		});

		const embed = new EmbedBuilder()
			.setTitle("Success")
			.setDescription(`Removed ${role.name} from ${user.user.tag}`)
			.setColor("Green");

		await interaction.editReply({
			embeds: [embed]
		});
	}
}
