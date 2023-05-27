import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";

@Discord()
export class HandleChannelCreate {
	@On()
	async channelCreate([channel]: ArgsOf<"channelCreate">) {
		if (!channel.guild || !channel.isTextBased()) return;

		// const associatesCategoryId = await prisma.associatesConfiguration.findFirst({}).then(config => config?.category);
		// if (channel.parentId !== associatesCategoryId) return;

		const embed = new EmbedBuilder()
			.setTitle("Building Bulletin Associates Degree Quiz")
			.setDescription(
				"This quiz is designed to test your knowledge of building in Rust. It is a multiple choice quiz with 10 questions. You will be given a score at the end of the quiz. A perfect score is required to pass. If you do not get a perfect score, you can retry in 5 days."
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
