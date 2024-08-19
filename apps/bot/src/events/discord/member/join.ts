import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { DEGREES } from "../../../configs.js";

@Discord()
export class HandleMemberJoin {
	@On()
	async guildMemberAdd([member]: ArgsOf<"guildMemberAdd">) {
		if (!member.guild.available || member?.user?.bot) return;

		const user = await prisma.user.findUnique({
			where: {
				id: BigInt(member.id)
			},
			include: {
				roles: true
			}
		});

		if (!user) {
			const enthusiastRole = member.guild.roles.cache.get(
				DEGREES.enthusiast.id
			);

			if (enthusiastRole) {
				await member.roles
					.add(enthusiastRole, "Assigning enthusiast role to new user")
					.catch(() => {});
			}

			return;
		}

		const userRoles = user.roles.map(role => role.id);
		const roles = userRoles
			.map(role => member.guild.roles.cache.get(String(role)))
			.filter(role => role);
		const rolesToAdd = [];

		for (const role of roles) {
			if (!role || member.roles.cache.has(role.id)) continue;
			rolesToAdd.push(role);
		}

		if (rolesToAdd.length > 0) {
			await new Promise(resolve => setTimeout(resolve, 10000));
			await member.roles
				.add(rolesToAdd, "Restoring member roles")
				.catch(() => {});
		}
	}
}
