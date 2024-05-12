import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { upsertRoles, upsertUser } from "../../../common/util.js";

@Discord()
export class HandleMemberUpdate {
	@On()
	async guildMemberUpdate([, member]: ArgsOf<"guildMemberUpdate">) {
		if (!member.guild.available || member?.user?.bot) return;
		const user = await upsertUser(member);
		const roles = await upsertRoles(member);

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				roles: {
					set: roles
				}
			}
		});
	}
}
