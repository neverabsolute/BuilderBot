import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class HandleChannelUpdate {
	@On()
	async channelUpdate([, newChannel]: ArgsOf<"channelUpdate">) {
		if (newChannel.isDMBased()) return;
		if (!newChannel.guild || !newChannel.isTextBased()) return;

		await prisma.channel.upsert({
			where: {
				id: BigInt(newChannel.id)
			},
			update: {
				name: newChannel.name
			},
			create: {
				id: BigInt(newChannel.id),
				name: newChannel.name,
				guildId: BigInt(newChannel.guild.id)
			}
		});

        console.log(`Updated channel ${newChannel.id}`);
	}
}
