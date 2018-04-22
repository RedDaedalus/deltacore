const Command = require("../classes/Command");

class Warn extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "warn",
                description: "Warns the specified user.",
                usage: "<user> <reason>"
            },
            conf: {
                userPerms: ["KICK_MEMBERS"],
                botPerms: ["EMBED_LINKS"],
                dms: false
            }
        });
    }

    async run(message, args, settings) {
        const user = await super.verifyUser(args.shift(), message);
        if (!user) return message.channel.error("Please specify a valid user ID, name, tag, or mention.");
        if (!args[0]) return message.channel.error("Please specify a reason for this warn.");

        const modlog = message.guild.channels.get(settings.modlog);
        if (!modlog) return message.channel.error(`No moderation logs channel set. Type \`${settings.prefix}settings edit modlog #channel\` to set moderation logs up.`);

        const embed = modlog.buildEmbed()
            .setColor(0xFFFF00)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL({ format: "png", size: 128 }))
            .setDescription(`**Target:** ${user.tag} (${user.id})\n**Action:** Warn\n**Reason:** ${args.join(" ")}`)
            .setTimestamp();

        await message.guild.createModLog("warn", user.id, message.author.id, args.join(" "), embed);

        message.channel.respond(`**${user.tag}** has been warned.`);
    }
}

module.exports = Warn;
