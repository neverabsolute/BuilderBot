export const BOT_TOKEN = process.env.BUILDER_BOT_TOKEN!;
if (!BOT_TOKEN) {
	throw new Error("BOT_TOKEN is not set");
}
