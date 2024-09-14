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
	enthusiast: {
		id: "636796408623792138",
		name: "Enthusiast",
		previous: null
	},
	associates: {
		id: "1193303199394832516",
		name: "Associates",
		previous: "Enthusiast"
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

export const BACH_CATEGORY_ID = "872616925409214495";

export const BACH_QUESTIONS = process.env.BACH_QUESTIONS!;
if (!BACH_QUESTIONS) {
	throw new Error("BACH_QUESTIONS is not set");
}

export const FOOTPRINTS_CHANNEL = "656343259295252481";
