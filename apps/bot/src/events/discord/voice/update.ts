import { GuildMember } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { prisma } from "bot-prisma";

@Discord()
export class HandleVoiceStateUpdate {
	@On()
	async voiceStateUpdate([oldState, newState]: ArgsOf<"voiceStateUpdate">) {
		if (oldState.channelId === newState.channelId) return;
		if (!newState.member || !(newState.member instanceof GuildMember)) return;

		if (newState.channelId && !oldState.channelId) {
			// User joined a voice channel
			console.log(
				`User ${newState.member.id} joined voice channel ${newState.channelId}`
			);
			await prisma.voiceCalls.create({
				data: {
					user: {
						connect: {
							id: BigInt(newState.member.id)
						}
					},
					channel: {
						connect: {
							id: BigInt(newState.channelId)
						}
					}
				}
			});
		} else if (!newState.channelId && oldState.channelId) {
			// User left a voice channel
			console.log(
				`User ${newState.member.id} left voice channel ${oldState.channelId}`
			);
			const voiceCall = await prisma.voiceCalls.findFirst({
				where: {
					userId: BigInt(newState.member.id),
					channelId: BigInt(oldState.channelId)
				},
				orderBy: {
					createdAt: "desc"
				}
			});

			if (voiceCall) {
				await prisma.voiceCalls.update({
					where: {
						id: voiceCall.id
					},
					data: {
						duration:
							voiceCall.duration +
							Math.floor((Date.now() - voiceCall.createdAt.getTime()) / 1000)
					}
				});
			}
		} else if (newState.channelId && oldState.channelId) {
			// User switched voice channels
			console.log(
				`User ${newState.member.id} switched voice channels from ${oldState.channelId} to ${newState.channelId}`
			);
			const voiceCall = await prisma.voiceCalls.findFirst({
				where: {
					userId: BigInt(newState.member.id),
					channelId: BigInt(oldState.channelId)
				},
				orderBy: {
					createdAt: "desc"
				}
			});

			if (voiceCall) {
				await prisma.voiceCalls.update({
					where: {
						id: voiceCall.id
					},
					data: {
						duration:
							voiceCall.duration +
							Math.floor((Date.now() - voiceCall.createdAt.getTime()) / 1000)
					}
				});
			}

			await prisma.voiceCalls.create({
				data: {
					user: {
						connect: {
							id: BigInt(newState.member.id)
						}
					},
					channel: {
						connect: {
							id: BigInt(newState.channelId)
						}
					}
				}
			});
		}
	}
}
