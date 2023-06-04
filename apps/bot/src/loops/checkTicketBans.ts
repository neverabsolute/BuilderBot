import { prisma } from "bot-prisma";
import { TICKETBAN_ROLE_ID, GUILD_ID } from "../configs.js";
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

async function runTicketBanLoop(client: Client) {
	scheduleMinute(async () => {
		const ticketBans = await prisma.ticketBan.findMany({
			where: {
				expiresAt: {
					lte: currentMinute
				},
				active: true
			}
		});

		for (const ticketBan of ticketBans) {
			const guild = await client.guilds.fetch(GUILD_ID);
			const member = await guild.members.fetch(String(ticketBan.userId));

			if (!member) {
				continue;
			}

			const ticketBanRole = guild.roles.cache.get(TICKETBAN_ROLE_ID);

			if (!ticketBanRole) {
				throw new Error("Ticket ban role not found");
			}

			await member.roles.remove(ticketBanRole).catch(() => {});
			await prisma.ticketBan.update({
				where: {
					id: ticketBan.id
				},
				data: {
					active: false
				}
			});
		}
	});
}

export async function initializeTicketBanLoop(client: Client) {
	await runTicketBanLoop(client);
	console.log("Initialized ticket ban loop");
}
