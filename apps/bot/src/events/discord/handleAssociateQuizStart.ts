import {
	CommandInteraction,
	GuildMember,
	EmbedBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	ActionRowBuilder,
	StringSelectMenuOptionBuilder
} from "discord.js";

import { ButtonComponent, Discord } from "discordx";

import { prisma } from "bot-prisma";
import { upsertUser } from "../../common/util.js";

const alphabet = new Map([
	[0, "A"],
	[1, "B"],
	[2, "C"],
	[3, "D"],
	[4, "E"],
	[5, "F"],
	[6, "G"],
	[7, "H"],
	[8, "I"],
	[9, "J"],
	[10, "K"],
	[11, "L"],
	[12, "M"],
	[13, "N"],
	[14, "O"],
	[15, "P"],
	[16, "Q"],
	[17, "R"],
	[18, "S"],
	[19, "T"],
	[20, "U"],
	[21, "V"],
	[22, "W"],
	[23, "X"],
	[24, "Y"],
	[25, "Z"]
]);

@Discord()
export class HandleAssociateQuizStart {
	@ButtonComponent({ id: "start-associates-quiz" })
	async handleStart(interaction: CommandInteraction) {
		await interaction.deferReply();
		const member = interaction.member;

		if (!member || !(member instanceof GuildMember)) {
			console.error("Member not found");
			return;
		}

		const discordUser = await upsertUser(member);
		const numDaysAgo = await prisma.associatesConfiguration
			.findFirst({})
			.then(config => config?.retryDelayDays ?? 5);
		const associatesResponses = await prisma.associatesResponses.findMany({
			where: {
				userId: discordUser.id
			}
		});

		if (
			associatesResponses.some(response => {
				const daysAgo = new Date();
				daysAgo.setDate(daysAgo.getDate() - numDaysAgo);
				return response.createdAt > daysAgo;
			})
		) {
			const timeTillRetry = new Date();
			timeTillRetry.setDate(timeTillRetry.getDate() + numDaysAgo);
			await interaction.reply({
				content: `You have already taken the quiz within the last ${numDaysAgo} days. You can take it again <t:${Math.floor(
					timeTillRetry.getTime() / 1000
				)}:R>`,
				ephemeral: true
			});
			await interaction.channel?.send({
				// eslint-disable-next-line no-irregular-whitespace
				content: `This channel will be deleted in 60 seconds.||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||<@${interaction.user.id}>`
			});
			setTimeout(() => {
				interaction.channel?.delete();
			}, 60000);
			return;
		}

		const quiz = await prisma.associatesQuiz.findFirst({});

		if (!quiz) {
			await interaction.followUp({
				content:
					"Looks like something went wrong, please reach out to a Professor for assistance.",
				ephemeral: true
			});
			return;
		}

		let questions = await prisma.associatesQuestions.findMany({
			where: {
				quiz: {
					id: quiz.id
				}
			},
			include: {
				choices: true
			}
		});

		questions = questions.sort(() => Math.random() - 0.5).slice(0, 5);

		for (const question of questions) {
			question.choices = question.choices.sort(() => Math.random() - 0.5);

			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId(`question-${question.id}`)
				.setPlaceholder(
					question.type === "MULTIPLE_CHOICE"
						? "Select all correct answers"
						: "Select the correct answer"
				)
				.setMinValues(1)
				.setMaxValues(
					question.type === "MULTIPLE_CHOICE" ? question.choices.length : 1
				);

			for (const choice of question.choices) {
				selectMenu.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(alphabet.get(question.choices.indexOf(choice)) || "")
						.setValue(String(choice.id))
				);
			}

			const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				selectMenu
			);

			const embed = new EmbedBuilder()
				.setTitle(question.question)
				.setDescription(
					question.choices
						.map((choice, index) => `${alphabet.get(index)}: ${choice.choice}`)
						.join("\n")
				)
				.setColor("Green");

			await interaction.followUp({
				embeds: [embed],
				components: [row]
			});
		}
	}
}
