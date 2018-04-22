const Command = require("../classes/Command");

class Kick extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "kick",
                description: "Kicks the specified user.",
                usage: "<user> <reason>"
            },
            conf: {
                userPerms: ["KICK_MEMBERS"],
                botPerms: ["EMBED_LINKS", "KICK_MEMBERS"],
                dms: false
            }
        });
    }

    async run(message, args, settings) {
        const user = await super.verifyUser(args.shift(), message);
        if (!user) return message.channel.error("Please specify a valid user ID, name, tag, or mention.");
        if (!args[0]) return message.channel.error("Please specify a reason for this kick.");

        const member = await message.guild.members.fetch(user.id);

        if (message.guild.owner.id !== message.author.id) {
            if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.channel.error("Your permissions are too low to do ban this user.");
            if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.channel.error("My permissions are too low to ban this user.");
        }

        const modlog = message.guild.channels.get(settings.modlog);
        if (!modlog) return message.channel.error(`No moderation logs channel set. Type \`${settings.prefix}settings edit modlog #channel\` to set moderation logs up.`);

        const embed = modlog.buildEmbed()
            .setColor(0xFF8000)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL({ format: "png", size: 128 }))
            .setDescription(`**Target:** ${user.tag} (${user.id})\n**Action:** Kick\n**Reason:** ${args.join(" ")}`)
            .setTimestamp();

        await message.guild.createModLog("kick", user.id, message.author.id, args.join(" "), embed);
        
        await member.kick(`(${message.author.tag}) ${args.join(" ")}`);

        message.channel.respond(`**${user.tag}** has been kicked.`);
    }
}

module.exports = Kick;
