const Command = require("../classes/Command");

class Unban extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "unban",
                description: "Unbans a user from the server. This requires a user ID.",
                usage: "<user ID> <reason>"
            },
            conf: {
                userPerms: ["BAN_MEMBERS"],
                botPerms: ["BAN_MEMBERS"],
                dms: false
            }
        });
    }

    async run(message, args, settings) {
        const user = await message.guild.members.unban(args[0]).catch(() => message.channel.error("Invalid user ID."));
        message.channel.respond(`Successfully unbanned **${user.tag}**.`);

        const modlog = message.guild.channels.get(settings.modlog);
        if (!modlog) return message.channel.error(`No moderation logs channel set. Type \`${settings.prefix}settings edit modlog #channel\` to set moderation logs up.`);

        const embed = modlog.buildEmbed()
            .setColor(0x4080FF)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL({ format: "png", size: 128 }))
            .setDescription(`**Target:** ${user.tag} (${user.id})\n**Action:** Unban\n**Reason:** ${args.join(" ")}`)
            .setTimestamp();

        await message.guild.createModLog("warn", user.id, message.author.id, args.join(" "), embed); 
    }
}

module.exports = Unban;
