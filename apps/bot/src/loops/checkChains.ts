import { prisma } from "bot-prisma";
import { CHAIN_ROLE_ID, GUILD_ID } from "../configs.js";
import type { Client } from "discord.js";

let currentMinute = new Date();
currentMinute.setSeconds(0, 0);

function scheduleMinute(callback: (client: Client) => void) {
	const nextMinute = new Date(currentMinute.getTime());
	nextMinute.setMinutes(currentMinute.getMinutes() + 1);

	const timeout = nextMinute.getTime() - Date.now();

	setTimeout((client: Client) => {
		currentMinute = nextMinute;
		scheduleMinute(callback);
		callback(client);
	}, timeout);
}

async function runChainLoop(client: Client) {
	scheduleMinute(async () => {
		const chains = await prisma.chain.findMany({
			where: {
				expiresAt: {
					lte: currentMinute
				},
				active: true
			}
		});

		for (const chain of chains) {
			const guild = await client.guilds.fetch(GUILD_ID);
			const member = await guild.members.fetch(String(chain.userId)).catch(() => null);

			if (!member) {
				continue;
			}

			const chainRole = guild.roles.cache.get(CHAIN_ROLE_ID);

			if (!chainRole) {
				throw new Error("Chain role not found");
			}

			await member.roles.remove(chainRole).catch(() => {});
			await prisma.chain.update({
				where: {
					id: chain.id
				},
				data: {
					active: false
				}
			});
		}
	});
}

export async function initializeChainLoop(client: Client) {
	await runChainLoop(client);
	console.log("Initialized chain loop");
}
