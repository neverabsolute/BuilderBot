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
        const numDaysAgo = await prisma.associatesConfiguration.findFirst({}).then(config => config?.retryDelayDays);
		const associatesResponses = await prisma.associatesResponses.findMany({
			where: {
				userId: discordUser.id
			}
		});

		if (
			associatesResponses.some(response => {
				const daysAgo = new Date();
				daysAgo.setDate(daysAgo.getDate() - 5);
				return response.createdAt > daysAgo;
			})
		) {
			await interaction.reply({
				content:
					"You have already taken the quiz within the last 5 days. You can take it again in 5 days.",
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
