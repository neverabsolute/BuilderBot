import type { Client } from "discord.js";
import { initializeTicketBanLoop } from "./checkTicketBans.js";

export async function initializeLoops(client: Client) {
	await initializeTicketBanLoop(client);
}
