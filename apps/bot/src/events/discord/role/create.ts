import { prisma } from "bot-prisma";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class HandleRoleCreate {
	@On()
	async roleCreate([role]: ArgsOf<"roleCreate">) {
		await prisma.roles.create({
            data: {
                id: BigInt(role.id),
                name: role.name
            }
        }).catch(() => {});

        console.log(`Created role ${role.name} (${role.id})`);
	}
}
