const Command = require("../classes/Command");

class Ban extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "ban",
                description: "Bans the specified user.",
                usage: "<user> <reason>"
            },
            conf: {
                userPerms: ["BAN_MEMBERS"],
                botPerms: ["EMBED_LINKS", "BAN_MEMBERS"],
                dms: false
            }
        });
    }

    async run(message, args, settings) {
        const user = await super.verifyUser(args.shift(), message);
        if (!user) return message.channel.error("Please specify a valid user ID, name, tag, or mention.");
        if (!args[0]) return message.channel.error("Please specify a reason for this ban.");

        const modlog = message.guild.channels.get(settings.modlog);
        if (!modlog) return message.channel.error(`No moderation logs channel set. Type \`${settings.prefix}settings edit modlog #channel\` to set moderation logs up.`);

        const embed = modlog.buildEmbed()
            .setColor(0xFF0000)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL({ format: "png", size: 128 }))
            .setDescription(`**Target:** ${user.tag} (${user.id})\n**Action:** Ban\n**Reason:** ${args.join(" ")}`)
            .setTimestamp();

        await message.guild.createModLog("ban", user.id, message.author.id, args.join(" "), embed);
        
        const member = await message.guild.members.fetch(user);
        await member.ban(`(${message.author.tag}) ${args.join(" ")}`);

        message.channel.respond(`**${user.tag}** has been banned.`);
    }
}

module.exports = Ban;
