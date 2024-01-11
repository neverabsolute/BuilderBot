import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import {
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	AttachmentBuilder
} from "discord.js";
import { BACH_CATEGORY_ID, BACH_QUESTIONS } from "../../../configs.js";

@Discord()
export class HandleChannelCreate {
	@On()
	async channelCreate([channel]: ArgsOf<"channelCreate">) {
		if (!channel.guild || !channel.isTextBased() || !channel.parentId) return;

		if (channel.parentId === BACH_CATEGORY_ID) {
			const bachEmbed = new EmbedBuilder()
				.setTitle("Building Bulletin Bachelors Degree Quiz")
				.setDescription(BACH_QUESTIONS.replace(/\\n/g, "\n"))
				.setColor("Green");

			const bachAttachment = new AttachmentBuilder(
				"https://i.imgur.com/LETehZQ.jpeg"
			);

			await new Promise(resolve => setTimeout(resolve, 5000));

			await channel.send({
				embeds: [bachEmbed]
			}).catch(() => {});

			await channel.send({
				files: [bachAttachment]
			}).catch(() => {});
		}

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
				`This quiz is designed to test your knowledge of building in Rust.\n\t- It is a multiple choice quiz with 5 questions.\n- You will be given a score at the end of the quiz.\n- A perfect score is required to pass.\n- If you do not get a perfect score, you can retry in ${retryDelayDays} days.\n\n**Once you click the start button you will have 10 minutes to complete the quiz.**`
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
