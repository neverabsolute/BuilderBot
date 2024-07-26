import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { saveMessage, upsertUser } from "../../../common/util.js";
import { prisma } from "bot-prisma";

@Discord()
export class HandleReactionAdd {
	@On()
	async messageReactionAdd([reaction, user]: ArgsOf<"messageReactionAdd">) {
		const user_ = await upsertUser(user);

		await saveMessage(reaction.message);

		await prisma.reaction.create({
			data: {
				messageId: BigInt(reaction.message.id),
				userId: user_.id,
				emoji: reaction.emoji.name ?? "unknown reaction"
			}
		});
	}
}
