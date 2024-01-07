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

type D = {
	id: string;
	name: string;
	previous: string | null;
};

export const DEGREES: Record<string, D> = {
	associates: {
		id: "1193303199394832516",
		name: "Associates",
		previous: null
	},
	bachelors: {
		id: "1193303225990926460",
		name: "Bachelors",
		previous: "Associates"
	},
	masters: {
		id: "1193321534996107365",
		name: "Masters",
		previous: "Bachelors"
	}
};
