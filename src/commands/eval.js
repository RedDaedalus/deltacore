const Command = require("../classes/Command");

const { post } = require("snekfetch");
const { inspect } = require("util");

class Eval extends Command {
    constructor(client) {
        super(client, {
            help: {
                "name": "eval",
                "description": "Evaluates javscript code.",
                "usage": "<code>"
            },
            conf: {
                ownerOnly: true
            }
        });
    }

    async run(message, args) {
        // Resolve the specified code
        const result = new Promise(r => r(eval(message.content.split(" ").slice(1).join(" "))));

        // Wait for result to complete
        result.then(async output => {
            // Turn the output into a string
            const response = inspect(output);

            if (response.length >= 2040) {
                const { body } = await post("https://hastebin.com/documents").send(response);
                message.channel.respond(`https://hastebin.com/${body.key}`);

                return;
            }

            // Create an embed
            const embed = message.channel.buildEmbed()
                .setColor("GREEN")
                .setTitle("Success")
                .setDescription(`\`\`\`js\n${response}\`\`\``)
                .setFooter("DeltaCore by Daedalus#1234")
                .setTimestamp();

            embed.channel.send(embed);
        }).catch(async error => {
            // Turn the output into a string
            const response = inspect(error);

            if (response.length >= 2040) {
                const { body } = await post("https://hastebin.com/documents").send(response);
                message.channel.respond(`https://hastebin.com/${body.key}`);
            }

            // Create an embed
            const embed = message.channel.buildEmbed()
                .setColor("RED")
                .setTitle("Error")
                .setDescription(`\`\`\`js\n${response}\`\`\``)
                .setFooter("DeltaCore by Daedalus#1234")
                .setTimestamp();

            embed.channel.send(embed);
        });
    }
}

module.exports = Eval;
