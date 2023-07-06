import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { upsertUser } from "../../../common/util.js";

@Discord()
export class HandleMemberUpdate {
	@On()
	async guildMemberUpdate([, member]: ArgsOf<"guildMemberUpdate">) {
		if (!member.guild.available || member?.user?.bot) return;
		const user = await upsertUser(member);
		const userRoles = member.roles.cache.map(role => ({
			id: BigInt(role.id)
		}));

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				roles: {
					set: userRoles
				}
			}
		});
	}
}
