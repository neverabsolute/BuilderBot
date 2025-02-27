import type { Client } from "discord.js";
import { initializeTicketBanLoop } from "./checkTicketBans.js";
import { initializeChainLoop } from "./checkChains.js";

export async function initializeLoops(client: Client) {
	await initializeTicketBanLoop(client);
	await initializeChainLoop(client);
}
