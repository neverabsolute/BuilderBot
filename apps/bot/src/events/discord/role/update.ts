import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class HandleRoleUpdate {
	@On()
	async roleUpdate([, newRole]: ArgsOf<"roleUpdate">) {
		await prisma.roles.update({
            where: {
                id: BigInt(newRole.id)
            },
            data: {
                name: newRole.name
            }
        }).catch(() => {});

        console.log(`Updated role ${newRole.name} (${newRole.id})`);
	}
}
