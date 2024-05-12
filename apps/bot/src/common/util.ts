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
	await prisma.message.create({
		data: {
			id: BigInt(message.id),
			content: message.content,
			createdAt: message.createdAt,
			channel: {
				connect: {
					id: BigInt(channel.id)
				}
			},
			guildId: BigInt(message.guildId ?? "0"),
			author: {
				connect: {
					id: BigInt(message.author.id)
				}
			}
		}
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
