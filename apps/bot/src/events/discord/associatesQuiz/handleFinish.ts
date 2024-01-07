import { Prisma, prisma } from "bot-prisma";
import { CommandInteraction, GuildMember } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { upsertUser } from "../../../common/util.js";
import { DEGREES } from "../../../configs.js";

const lastButtonClickTimestamps = new Map<string, number>();
const rateLimitMillis = 5000;

@Discord()
export class HandleAssociateQuizStart {
	@ButtonComponent({ id: "submit-associates-quiz" })
	async handleFinish(interaction: CommandInteraction) {
		const lastButtonClick = lastButtonClickTimestamps.get(interaction.user.id);
		const currentTime = Date.now();

		if (lastButtonClick && currentTime - lastButtonClick < rateLimitMillis) {
			// Send a temporary error message or ignore the button event
			await interaction.reply({
				content: "Please wait before attempting to submit again.",
				ephemeral: true
			});
			return;
		}

		// Update the user's timestamp
		lastButtonClickTimestamps.set(interaction.user.id, currentTime);
		await interaction.deferReply();
		const member = interaction.member;

		if (!member || !(member instanceof GuildMember)) {
			console.error("Member not found");
			return;
		}

		const discordUser = await upsertUser(member);
		const response = await prisma.associatesResponses.findFirst({
			where: {
				userId: discordUser.id,
				channelId: BigInt(interaction.channelId),
				finished: false
			}
		});

		if (!response) {
			const message = await interaction.followUp({
				content:
					"Looks like you've already finished the quiz. Please contact a Professor for assistance if you believe this is incorrect."
			});
			setTimeout(() => {
				message.delete().catch(() => {});
			}, 5000);
			return;
		}

		const questions = await prisma.associatesQuestions.findMany({
			include: {
				choices: true
			}
		});

		const quiz = await prisma.associatesQuiz.findFirst({});
		const config = await prisma.associatesConfiguration.findFirst({});

		if (!quiz || !config || !questions || !config.associatesRoleId) {
			await interaction.followUp({
				content:
					"Looks like something went wrong, please reach out to a Professor for assistance.\nErrorCode: ERR-NOTHING-TO-GRADE-AGAINST"
			});
			return;
		}

		const userAnswer = response.answerDict as Prisma.JsonArray;

		if (Object.keys(userAnswer).length < config.numQuestions) {
			const message = await interaction.followUp({
				content:
					"You have not answered all the questions. Please answer all the questions before submitting."
			});
			setTimeout(() => {
				message.delete().catch(() => {});
			}, 5000);
			return;
		}

		let score = 0;

		for (const question of questions) {
			const correctAnswers = question.choices
				.filter(choice => choice.correct)
				.map(choice => choice.id);
			if (correctAnswers.length === 0) {
				await interaction.followUp({
					content:
						"Looks like something went wrong, please reach out to a Professor for assistance.\nErrorCode: ERR-NO-CORRECT-ANSWER",
					ephemeral: true
				});
				return;
			}
			const userAnswerForQuestion = userAnswer[question.id];

			if (question.type === "SINGLE_CHOICE") {
				if (correctAnswers.includes(userAnswerForQuestion as number)) {
					score++;
				}
			} else if (question.type === "MULTIPLE_CHOICE") {
				if (Array.isArray(userAnswerForQuestion)) {
					// Calculate correct and incorrect answers provided by the user
					const correctUserAnswers = userAnswerForQuestion.filter(answer =>
						correctAnswers.includes(answer as number)
					).length;
					const incorrectUserAnswers =
						userAnswerForQuestion.length - correctUserAnswers;

					// Adjust the score
					score += correctUserAnswers - incorrectUserAnswers;
				}
			}
		}

		if (score === response.maxScore) {
			const enthusiastRoleId = DEGREES.enthusiast.id;
			const enthusiastRole = await interaction.guild?.roles.fetch(
				String(enthusiastRoleId)
			);

			if (!enthusiastRole) {
				await interaction.followUp({
					content:
						"Unfortunately the Enthusiast Degree role could not be found. Please contact a Professor for assistance.",
					ephemeral: true
				});
				return;
			}

			await member.roles.remove(enthusiastRole).catch(err => {
				console.error(err);
			});

			await interaction.followUp({
				content:
					"Congratulations! You passed the quiz! The Associate Degree has been awarded to you!",
				ephemeral: true
			});
			const associateRole = await interaction.guild?.roles.fetch(
				String(config.associatesRoleId)
			);
			if (!associateRole) {
				await interaction.followUp({
					content:
						"Unfortunately the Associate Degree role could not be found. Please contact a Professor for assistance.",
					ephemeral: true
				});
				return;
			}
			await member.roles.add(associateRole).catch(err => {
				console.error(err);
				interaction.followUp({
					content:
						"Unfortunately the Associate Degree role could not be added to you. Please contact a Professor for assistance.",
					ephemeral: true
				});
			});
			await interaction.channel?.send({
				// eslint-disable-next-line no-irregular-whitespace
				content: `This channel will be deleted in 60 seconds.||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||<@${interaction.user.id}>`
			});
			setTimeout(() => {
				interaction.channel?.delete().catch(() => {});
			}, 60000);
		} else {
			await interaction.followUp({
				content: `Unfortunately you did not pass the quiz. You scored a ${score} out of ${response.maxScore}. You can retry in ${config.retryDelayDays} days.`,
				ephemeral: true
			});
			await interaction.channel?.send({
				// eslint-disable-next-line no-irregular-whitespace
				content: `This channel will be deleted in 60 seconds.||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||<@${interaction.user.id}>`
			});
			setTimeout(() => {
				interaction.channel?.delete().catch(() => {});
			}, 60000);
		}

		await prisma.associatesResponses.update({
			where: {
				id: response.id
			},
			data: {
				finished: true,
				score: score
			}
		});
	}
}
