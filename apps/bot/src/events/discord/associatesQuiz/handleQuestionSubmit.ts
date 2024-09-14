import { Prisma, prisma } from "bot-prisma";
import { StringSelectMenuInteraction } from "discord.js";
import { Discord, SelectMenuComponent } from "discordx";

@Discord()
export class HandleAssociateQuizQuestionSubmit {
	@SelectMenuComponent({ id: "associateQuestion" })
	async handleSubmit(interaction: StringSelectMenuInteraction): Promise<void> {
		await interaction.deferReply({ ephemeral: true });

		if (
			!interaction.guild ||
			!interaction.channel ||
			interaction.channel.isDMBased()
		) {
			await interaction.editReply({
				content: "This command can only be used in a server."
			});
			return;
		}

		const response = await prisma.associatesResponses.findFirst({
			where: {
				userId: BigInt(interaction.user.id),
				channelId: BigInt(interaction.channelId),
				finished: false
			}
		});

		if (!response) {
			await interaction.editReply({
				content:
					"Something went wrong. Please try again or contact a Professor for help.\nErrorCode: ERR-NO-RESPONSE"
			});
			return;
		}

		let multipleChoiceFirstPass = true;

		for (const value of interaction.values) {
			const questionId = Number(value.split("-")[0]);
			const question = await prisma.associatesQuestions.findUnique({
				where: { id: questionId }
			});

			const choiceId = Number(value.split("-")[1]);
			const choice = await prisma.associatesQuestionChoices.findUnique({
				where: { id: choiceId }
			});

			if (!question || !choice) {
				await interaction.editReply({
					content:
						"Something went wrong. Please try again or contact a Professor for help.\nErrorCode: ERR-NO-QUESTION-OR-CHOICE"
				});
				return;
			}

			if (question.type === "SINGLE_CHOICE") {
				const dict = response.answerDict as Prisma.JsonArray;
				dict[questionId] = choiceId;
				await prisma.associatesResponses.update({
					where: { id: response.id },
					data: {
						answerDict: dict
					}
				});
			} else if (question.type === "MULTIPLE_CHOICE") {
				const dict = response.answerDict as Prisma.JsonArray;
				if (multipleChoiceFirstPass) {
					dict[questionId] = [choiceId];
					multipleChoiceFirstPass = false;
				} else {
					(dict[questionId] as number[])?.push(choiceId);
				}
				await prisma.associatesResponses.update({
					where: { id: response.id },
					data: {
						answerDict: dict
					}
				});
			}
		}

		await interaction.editReply({
			content: "Your answer has been recorded."
		});
	}
}
