import { Prisma, prisma } from "bot-prisma";
import {
	CommandInteraction,
	GuildMember
} from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { upsertUser } from "../../common/util.js";

@Discord()
export class HandleAssociateQuizStart {
	@ButtonComponent({ id: "submit-associates-quiz" })
	async handleStart(interaction: CommandInteraction) {
		await interaction.deferReply();
		const member = interaction.member;

		if (!member || !(member instanceof GuildMember)) {
			console.error("Member not found");
			return;
		}

		const discordUser = await upsertUser(member);
		const response = await prisma.associatesResponses.findMany({
			where: {
				userId: discordUser.id,
				channelId: BigInt(interaction.channelId),
				finished: false
			}
		});

		if (!response || response.length > 1) {
			await interaction.followUp({
				content:
					"Looks like something went wrong, please reach out to a Professor for assistance.\nErrorCode: ERR-WRONG-NUMBER-RESPONSES-TO-GRADE",
				ephemeral: true
			});
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
					"Looks like something went wrong, please reach out to a Professor for assistance.\nErrorCode: ERR-NOTHING-TO-GRADE-AGAINST",
				ephemeral: true
			});
			return;
		}

		const userAnswer = response[0].answerDict as Prisma.JsonArray;

		let score = 0;
		const maxScore = questions
			.filter(question => userAnswer[question.id] !== undefined)
			.map(question => question.choices.find(choice => choice.correct)?.id)
			.filter(Boolean).length;
		for (const question of questions) {
			const correctAnswer = question.choices.find(choice => choice.correct)?.id;
			if (!correctAnswer) {
				await interaction.followUp({
					content:
						"Looks like something went wrong, please reach out to a Professor for assistance.\nErrorCode: ERR-NO-CORRECT-ANSWER",
					ephemeral: true
				});
				return;
			}
			const userAnswerForQuestion = userAnswer[question.id];

			if (question.type === "SINGLE_CHOICE") {
				if (correctAnswer === userAnswerForQuestion) {
					score++;
				}
			} else if (question.type === "MULTIPLE_CHOICE") {
				if (Array.isArray(userAnswerForQuestion)) {
					if (userAnswerForQuestion.includes(correctAnswer)) {
						score++;
					}
				}
			}
		}

		if (score === maxScore) {
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
				content: `Unfortunately you did not pass the quiz. You scored a ${score} out of ${maxScore}. You can retry in ${config.retryDelayDays} days.`,
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
				id: response[0].id
			},
			data: {
				finished: true,
				score: score
			}
		});
	}
}
