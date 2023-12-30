export const BOT_TOKEN = process.env.BUILDER_BOT_TOKEN!;
if (!BOT_TOKEN) {
	throw new Error("BOT_TOKEN is not set");
}

export const TICKETBAN_ROLE_ID = process.env.TICKETBAN_ROLE_ID!;
if (!TICKETBAN_ROLE_ID) {
	throw new Error("TICKETBAN_ROLE_ID is not set");
}

export const GUILD_ID = process.env.GUILD_ID!;
if (!GUILD_ID) {
	throw new Error("GUILD_ID is not set");
}

export const DEGREE_MAP = new Map([
	["BACHELORS", "923071974081691688"],
	["MASTERS", "802287690502111232"]
]);