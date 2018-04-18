const Command = require("../classes/Command");

class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            help: {
                "name": "serverinfo",
                "description": "Shows basic information on the server.",
                "usage": ""
            },
            conf: {
                botPerms: ["EMBED_LINKS"],
                aliases: ["server"]
            }
        });
    }

    async run(message, args) {
        const embed = message.channel.buildEmbed()
            .setColor(this.client.options.color)
            .setAuthor(message.guild.name, message.guild.iconURL({ format: "png", size: 256 }))
            .setTitle("Server Information")
            .addField("» Name", message.guild.name, true)
            .addField("» ID", message.guild.id, true)
            .addField("» Members", message.guild.memberCount, true)
            .addField("» Owner", message.guild.owner.user.tag, true)
            .addField("» Verification Level", message.guild.verificationLevel, true)
            .addField("» Text Channels", message.guild.channels.filter(c => c.type === "text").size, true)
            .addField("» Voice Channels", message.guild.channels.filter(c => c.type === "voice").size, true)
            .addField("» Roles", message.guild.roles.size, true)
            .addField("» Region", message.guild.region, true)
            .setFooter(`DeltaCore by Daedalus#1234`)
            .setTimestamp();

        embed.channel.send(embed);
    }
}

module.exports = ServerInfo;
