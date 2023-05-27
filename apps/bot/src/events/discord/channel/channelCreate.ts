import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";

@Discord()
export class HandleChannelCreate {
	@On()
	async channelCreate([channel]: ArgsOf<"channelCreate">) {
		if (!channel.guild || !channel.isTextBased() || !channel.parentId) return;

		const associatesCategoryId = await prisma.associatesConfiguration
			.findFirst({})
			.then(config => config?.categoryId);
		if (!associatesCategoryId) return;
		if (BigInt(channel.parentId) !== associatesCategoryId) return;

		const retryDelayDays = await prisma.associatesConfiguration
			.findFirst({})
			.then(config => config?.retryDelayDays ?? 7);

		const embed = new EmbedBuilder()
			.setTitle("Building Bulletin Associates Degree Quiz")
			.setDescription(
				`This quiz is designed to test your knowledge of building in Rust.\n\nIt is a multiple choice quiz with 5 questions.\n\nYou will be given a score at the end of the quiz.\n\nA perfect score is required to pass.\n\nIf you do not get a perfect score, you can retry in ${retryDelayDays} days.`
			)
			.setColor("Green");

		await channel.send({
			embeds: [embed],
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: "Start!",
							style: ButtonStyle.Success,
							customId: "start-associates-quiz"
						}
					]
				}
			]
		});
	}
}
