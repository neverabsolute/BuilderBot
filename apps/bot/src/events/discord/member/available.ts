import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { upsertUser } from "../../../common/util.js";
import { GuildMember } from "discord.js";

@Discord()
export class HandleMemberAvailable {
	@On()
	async guildMemberAvailable([member]: ArgsOf<"guildMemberAvailable">) {
		if (
			!member.guild.available ||
			!(member instanceof GuildMember) ||
			member?.user?.bot
		)
			return;
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
