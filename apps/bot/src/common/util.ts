import { prisma } from "bot-prisma";
import {
	GuildMember,
	Message,
	PartialMessage,
	PartialUser,
	User
} from "discord.js";

export async function upsertMember(member: GuildMember) {
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

export async function upsertUser(user: User | PartialUser) {
	return await prisma.user.upsert({
		where: {
			id: BigInt(user.id)
		},
		update: {
			username: user.username,
			discriminator: Number(user.discriminator)
		},
		create: {
			id: BigInt(user.id),
			username: user.username,
			discriminator: Number(user.discriminator)
		}
	});
}

export async function saveMessage(message: Message | PartialMessage) {
	const channel = message.channel;
	if (!channel || !channel.isTextBased() || channel.isDMBased()) return;
	await prisma.channel.upsert({
		where: {
			id: BigInt(channel.id)
		},
		update: {
			name: channel.name,
			guildId: BigInt(channel.guild.id),
			createdAt: channel.createdAt ?? new Date()
		},
		create: {
			id: BigInt(channel.id),
			name: channel.name,
			createdAt: channel.createdAt ?? new Date(),
			guildId: BigInt(channel.guild.id)
		}
	});
	await prisma.message.upsert({
		where: {
			id: BigInt(message.id)
		},
		create: {
			id: BigInt(message.id),
			content: message.content ?? "",
			createdAt: message.createdAt,
			channel: {
				connect: {
					id: BigInt(channel.id)
				}
			},
			guildId: BigInt(message.guildId ?? "0"),
			author: {
				connect: {
					id: BigInt(message.author?.id ?? "0")
				}
			}
		},
		update: {}
	});
}

export async function upsertRoles(member: GuildMember) {
	const userRoles = member.roles.cache.map(role => ({
		id: BigInt(role.id)
	}));
	for (const role of userRoles) {
		await prisma.roles
			.upsert({
				where: {
					id: role.id
				},
				update: {
					name:
						member.guild.roles.cache.get(role.id.toString())?.name || "Unknown"
				},
				create: {
					id: role.id,
					name:
						member.guild.roles.cache.get(role.id.toString())?.name || "Unknown"
				}
			})
			.catch(() => {});
	}

	await prisma.user.update({
		where: {
			id: BigInt(member.user.id)
		},
		data: {
			roles: {
				set: userRoles
			}
		}
	});

	return userRoles;
}
