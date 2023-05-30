import { prisma } from "bot-prisma";
import {
	ActionRowBuilder,
	ButtonStyle,
	CommandInteraction,
	ComponentType,
	EmbedBuilder,
	GuildMember,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} from "discord.js";
import { ButtonComponent, Discord } from "discordx";
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
				userId: discordUser.id,
				finished: true
			}
		});

		const responsesForChannel = await prisma.associatesResponses.findMany({
			where: {
				channelId: BigInt(interaction.channelId)
			}
		});

		if (responsesForChannel.length > 0) {
			const message = await interaction.editReply({
				content: "A quiz is already in progress in this channel."
			});
			setTimeout(() => {
				message.delete();
			}, 5000);
			return;
		}

		if (
			associatesResponses.some(response => {
				const daysAgo = new Date();
				daysAgo.setDate(daysAgo.getDate() - numDaysAgo);
				return response.createdAt > daysAgo;
			})
		) {
			const timeTillRetry = new Date();
			// set the timeTillRetry to the date of which the last quiz taken + numDaysAgo days
			timeTillRetry.setDate(
				associatesResponses
					.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
					.createdAt.getDate() + numDaysAgo
			);

			await interaction.editReply({
				content: `You have already taken the quiz within the last ${numDaysAgo} days. You can take it again <t:${Math.floor(
					timeTillRetry.getTime() / 1000
				)}:R>`
			});
			await interaction.channel?.send({
				// eslint-disable-next-line no-irregular-whitespace
				content: `This channel will be deleted in 60 seconds.||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||<@${interaction.user.id}>`
			});
			setTimeout(() => {
				interaction.channel?.delete().catch(() => {});
			}, 60000);
			return;
		}

		const quiz = await prisma.associatesQuiz.findFirst({});
		const inProgressResponses = await prisma.associatesResponses.findMany({
			where: {
				userId: discordUser.id,
				finished: false
			}
		});

		if (!quiz) {
			await interaction.followUp({
				content:
					"Looks like something went wrong, please reach out to a Professor for assistance.\nErrorCode: ERR-NO-QUIZ",
				ephemeral: true
			});
			return;
		}

		if (inProgressResponses.length > 0) {
			const message = await interaction.followUp({
				content:
					"You already have a quiz in progress, please finish that one first.",
				ephemeral: true
			});
			setTimeout(() => {
				message.delete();
			}, 5000);
			return;
		}

		const response = await prisma.associatesResponses.create({
			data: {
				user: {
					connect: {
						id: discordUser.id
					}
				},
				channelId: BigInt(interaction.channelId),
				score: 0,
				finished: false
			}
		});

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

		// assert that for each question if it is multiple choice there are at least 2 choices with at least one being correct
		// and if it is single choice there is at least 2 choices with exactly one being correct
		for (const question of questions) {
			if (question.type === "MULTIPLE_CHOICE") {
				const correctChoices = question.choices.filter(
					choice => choice.correct
				);
				if (correctChoices.length < 1) {
					await interaction.followUp({
						content: `Something is wrong. Please contact a Professor for assistance.\nErrorCode: ERR-NO-CORRECT-MCQ-CHOICES`,
						ephemeral: true
					});
					return;
				}
				if (question.choices.length < 2) {
					await interaction.followUp({
						content: `Something is wrong. Please contact a Professor for assistance.\nErrorCode: ERR-LESS-THAN-2-MCQ-CHOICES`,
						ephemeral: true
					});
					return;
				}
			} else if (question.type === "SINGLE_CHOICE") {
				const correctChoices = question.choices.filter(
					choice => choice.correct
				);
				if (correctChoices.length !== 1) {
					await interaction.followUp({
						content: `Something is wrong. Please contact a Professor for assistance.\nErrorCode: ERR-NOT-EXACTLY-1-CORRECT-SCQ-CHOICE`,
						ephemeral: true
					});
					return;
				}
				if (question.choices.length < 2) {
					await interaction.followUp({
						content: `Something is wrong. Please contact a Professor for assistance.\nErrorCode: ERR-LESS-THAN-2-SCQ-CHOICES`,
						ephemeral: true
					});
					return;
				}
			}
		}

		questions = questions.sort(() => Math.random() - 0.5).slice(0, 5);
		const maxScore = questions.reduce(
			(sum, question) =>
				sum + question.choices.filter(choice => choice.correct).length,
			0
		);

		await prisma.associatesResponses.update({
			where: { id: response.id },
			data: {
				maxScore
			}
		});

		for (const question of questions) {
			question.choices = question.choices.sort(() => Math.random() - 0.5);

			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId(`associateQuestion`)
				.setPlaceholder(
					question.type === "MULTIPLE_CHOICE"
						? "Select all that apply"
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
						.setValue(`${question.id}-${choice.id}`)
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

		const embed = new EmbedBuilder()
			.setTitle("Submit!")
			.setDescription(
				`Best of luck <@${interaction.user.id}>!\n\nOnce you have answered all questions, click the button below to submit your answers. There is no going back!`
			)
			.setColor("Green");

		await interaction.channel?.send({
			embeds: [embed],
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: "Submit!",
							style: ButtonStyle.Success,
							customId: "submit-associates-quiz"
						}
					]
				}
			]
		});
	}
}
