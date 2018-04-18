const Command = require("../classes/Command");

class Ping extends Command {
    constructor(client) {
        super(client, {
            help: {
                "name": "ping",
                "description": "Responds with the bot's ping.",
                "usage": ""
            },
            conf: { }
        });
    }

    async run(message, args) {
        const ping = await message.channel.send("🏓 | Pinging...");
        ping.edit(`🏓 | Pong! Took ${ping.createdTimestamp - message.createdTimestamp}ms.`);
    }
}

module.exports = Ping;
