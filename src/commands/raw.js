const Command = require("../classes/Command");

class Raw extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "raw",
                description: "Shows server settings in JSON form. Mainly used for debugging.",
                usage: "[guild]"
            },
            conf: {
                ownerOnly: true,
                dms: false
            }
        });
    }

    async run(message, args) {
        // Fetch the guild
        const guild = args[0] ? this.client.guilds.get(args[0]) : message.guild;
        // Make sure that the guild found is available 
        if (!guild || !guild.available) return message.channel.error("The specified guild either does not exist, or is unavailable.");

        // Fetch the guild's server settings
        const settings = await guild.fetchSettings();
        // Send the settings in JSON form   
        message.channel.respond(`Server settings for \`${guild.name}\`:\n\`\`\`json\n${JSON.stringify(settings, null, 2)}\`\`\``);
    }
}

module.exports = Raw;
