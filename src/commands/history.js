const Command = require("../classes/Command");
const { escapeMarkdown } = require("discord.js");

class History extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "history",
                description: "Shows a user's moderation history.",
                usage: "<user>"
            },
            conf: {
                userPerms: ["KICK_MEMBERS"],
                dms: false
            }
        });
    }

    async run(message) {
        // Fetch the user
        const user = await super.verifyUser(message.content, message);
        // Check if the user was found
        if (!user) return message.channel.error("Please specify a valid user.");

        // Fetch the user's history
        const history = await this.client.modLogs.filter({ guild_id: message.guild.id, target: user.id });
        
        // Check if there was no history
        if (history.length === 0) return message.channel.error("This user has a clean record.");
        
        const months = ["January", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // Show the user's moderation history
        message.channel.send(`**__Moderation history for user ${escapeMarkdown(user.tag)}:__**\n\n${history.sort((a, b) => a.received - b.received).map(entry => `Recieved **${entry.action}** for **${entry.reason}** on ${months[entry.received.getMonth() - 1]} ${entry.received.getDate()}, ${entry.received.getFullYear()} (Case ID **${entry.case_id}**)`).join("\n")}`);
    }
}

module.exports = History;
