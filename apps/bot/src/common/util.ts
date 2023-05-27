import { prisma } from "bot-prisma";
import { GuildMember, Message } from "discord.js";

export async function upsertUser(member: GuildMember) {
	return await prisma.user.upsert({
		where: {
			id: BigInt(member.user.id)
		},
		update: {
			username: member.user.username,
			discriminator: Number(member.user.discriminator),
			nickname: member?.nickname,
			joinedServerAt: member.joinedAt
		},
		create: {
			id: BigInt(member.user.id),
			username: member.user.username,
			discriminator: Number(member.user.discriminator),
			nickname: member?.nickname,
			joinedServerAt: member.joinedAt
		}
	});
}

export async function saveMessage(message: Message) {
	await prisma.message.create({
		data: {
			id: BigInt(message.id),
			content: message.content,
			createdAt: message.createdAt,
			channelId: BigInt(message.channelId),
			guildId: BigInt(message.guildId ?? "0"),
			author: {
				connect: {
					id: BigInt(message.author.id)
				}
			}
		}
	});
}
