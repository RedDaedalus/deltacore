const Command = require("../classes/Command");
const r = require("rethinkdbdash")({ db: "deltacore" });

class Reason extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "reason",
                description: "Edits the reason of a moderation action.",
                usage: "<case ID|latest> <new reason>"
            },
            conf: {
                userPerms: ["KICK_MEMBERS"],
                dms: false
            }
        });
    }

    async run(message, args, settings) {
        if (!args[1]) return message.channel.error(`Command usage: \`${settings.prefix + this.name} ${this.usage}\`.`);

        const [target] = args[0] === "latest" ? await this.client.modLogs.filter({ guid_id: message.guild.id }).orderBy({ index: r.desc("case_id") }).limit(1) : await this.client.modLogs.filter({ guild_id: message.guild.id, case_id: parseInt(args[0], 10) });
        if (!target) return message.channel.error("Case not found.");

        const channel = message.guild.channels.get(settings.modlog);
        if (!channel) return message.channel.error("No moderation logs channel set.");

        try {
            const msg = await channel.messages.fetch(target.message_id);
            const embed = msg.embeds[0];
            const data = embed.description.split("\n");
            embed.setDescription(`${data.slice(0, 2).join("\n")}\n**Reason:** ${args.slice(1).join(" ")}`);
            await msg.edit(embed);

            await this.client.modLogs.filter({ guild_id: message.guild.id, case_id: target.case_id }).update({ reason: args.slice(1).join(" ") });

            message.channel.respond(`Reason edited.`);
        } catch (e) {
            console.log(e);
            message.channel.error("Unable to find the moderation log.");
        }
    }
}

module.exports = Reason;
