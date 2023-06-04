import {
	CommandInteraction,
	GuildMember,
	ApplicationCommandOptionType
} from "discord.js";
import { Discord, Slash, SlashOption, SlashGroup } from "discordx";
import { prisma } from "bot-prisma";
import { upsertUser } from "../../common/util.js";

@Discord()
@SlashGroup({ name: "ticketban", description: "Ticket ban commands" })
@SlashGroup("ticketban")
export class Remove {
	@Slash({
		name: "remove",
		description: "Remove a user's active ticket ban"
	})
	async whois(
		@SlashOption({
			name: "user",
			description: "User to remove the ticket ban from",
			type: ApplicationCommandOptionType.User,
			required: true
		})
		member: GuildMember,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true });

		const user = await upsertUser(member);
		const ticketBans = await prisma.ticketBan.findMany({
			where: {
				userId: user.id
			}
		});

		if (ticketBans.length === 0) {
			await interaction.editReply("This user has no ticket bans.");
			return;
		}

		for (const ticketBan of ticketBans) {
            await prisma.ticketBan.update({
                where: {
                    id: ticketBan.id
                },
                data: {
                    active: false,
                    expiresAt: new Date(),
                    removedBy: BigInt(interaction.user.id)
                }
            });
        }

		await interaction.editReply({ content: "Ticket bans removed. The roles will be updated shortly." });
	}
}
