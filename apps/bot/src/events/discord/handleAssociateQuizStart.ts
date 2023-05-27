import { CommandInteraction, GuildMember } from "discord.js";

import { ButtonComponent, Discord } from "discordx";

import { prisma } from "bot-prisma";
import { upsertUser } from "../../common/util.js";

@Discord()
export class HandleAssociateQuizStart {
	@ButtonComponent({ id: "start-associates-quiz" })
	async handleStart(interaction: CommandInteraction) {
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
			return;
		}

		await interaction.reply({
			content: "Starting quiz...",
			ephemeral: true
		});

        
	}
}
