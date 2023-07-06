import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class HandleRoleDelete {
	@On()
	async roleDelete([role]: ArgsOf<"roleDelete">) {
		await prisma.roles
			.delete({
				where: {
					id: BigInt(role.id)
				}
			})
			.catch(() => {});

		console.log(`Deleted role ${role.name} (${role.id})`);
	}
}
