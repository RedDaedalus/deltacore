const Command = require("../classes/Command");
const { escapeMarkdown } = require("discord.js");

class Help extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "help",
                description: "Displays a list of commands.",
                usage: "[command]"
            },
            conf: { }
        });
    }

    async run(message, args, { prefix }) {
        if (args[0]) {
            const command = this.client.command(args[0]);
            if (!command || (command.ownerOnly && !this.client.options.owners.includes(message.author.id))) return message.channel.error(`Unknown command. Type \`${prefix}help\` to see the full list of commands.`);

            return message.channel.respond(`**__Command information: ${command.name}__**\n__Command:__ \`${prefix + command.name} ${command.usage}\`\n__Description:__ \`${command.description}\`\n__Required user permissions:__ \`${command.userPerms.length ? command.userPerms.join(", ") : "None."}\`\n__Required bot permissions:__ \`${command.botPerms.length ? command.botPerms.join(", ") : "None."}\``, { showCheck: false });
        }

        const commands = this.client.commands.filter(command => !command.ownerOnly);
        message.channel.respond(`**__Command list:__**\n\n${commands.map(command => `**${escapeMarkdown(prefix)}${command.name} ${command.usage}** ${command.description}`).join("\n")}`, { showCheck: false });
    }
}

module.exports = Help;
