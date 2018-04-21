const Command = require("../classes/Command");
const { version } = require("discord.js");
const ms = require("pretty-ms");

class Stats extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "stats",
                description: "Shows stats about the bot."
            },
            conf: { }
        });
    }

    async run(message) {
        const uptime = ms(this.client.uptime, { verbose: true, secDecimalDigits: 0 });

        const embed = message.channel.buildEmbed()
            .setColor(this.client.options.color)
            .setAuthor("DeltaCore Stats", this.client.user.avatarURL({ format: "png", size: 256 }))
            .addField("» Memory Usage", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), true)
            .addField("» Library", `discord.js V${version}`, true)
            .addField("» Servers", this.client.guilds.size, true)
            .addField("» Channels", this.client.channels.size, true)
            .addField("» Users", this.client.guilds.reduce((out, guild) => out += guild.memberCount, 0), true) //eslint-disable-line
            .addField("» Emojis", this.client.emojis.size, true)
            .addField("» Node.js Version", process.version, true)
            .addField("» Uptime", uptime, true)
            .addField("» Client ID", this.client.user.id, true)
            .setFooter(`DeltaCore by Daedalus#1111`)
            .setTimestamp();

        embed.channel.send(embed);
    }
}

module.exports = Stats;
