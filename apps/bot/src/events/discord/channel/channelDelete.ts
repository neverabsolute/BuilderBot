import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class HandleChannelDelete {
	@On()
	async channelDelete([channel]: ArgsOf<"channelDelete">) {
		const openResponsesForChannel = await prisma.associatesResponses.findMany({
			where: {
				channelId: BigInt(channel.id),
				finished: false
			}
		});

		for (const response of openResponsesForChannel) {
			await prisma.associatesResponses.update({
				where: { id: response.id },
				data: {
					finished: true
				}
			});
		}
	}
}
