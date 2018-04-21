const Command = require("../classes/Command");
const { escapeMarkdown } = require("discord.js");

class Settings extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "settings",
                description: "Edits server settings.",
                usage: "<edit|view|reset|list> [setting] [value]"
            },
            conf: {
                aliases: ["set"],
                userPerms: ["MANAGE_SERVER"]
            }
        });
    }

    async run(message, args, settings) {
        if (args[0] === "view") this.view(message, args, settings);   
        else if (args[0] === "edit") this.edit(message, args, settings);
        else if (args[0] === "reset") this.reset(message, args, settings);
        else if (args[0] === "list") this.list(message);
        else return message.channel.error(`Command usage: \`${settings.prefix + this.name} ${this.usage}\`.`);
    }

    async view(message, args, settings) {
        const types = {
            joinlog: "channel",
            modlog: "channel",
            prefix: "word"
        };

        if (args[1]) {
            const setting = settings[args[1]];
            const type = types[args[1]];

            if (!setting || !type) return message.channel.error("This setting is either unset or invalid.");

            let output;

            if (type === "channel") output = (message.guild.channels.get(setting) || { name: null }).name;
            else if (type === "word") output = setting;

            if (output === null) return message.channel.error(`The ${type} this setting was pointing to was deleted.`);

            return message.channel.respond(`The current value for setting __${escapeMarkdown(args[1])}__ is **${escapeMarkdown(output)}*`, { showCheck: false });
        }

        const result = [];

        for (const setting in settings) { //eslint-disable-line
            const value = settings[setting];
            const type = types[setting];

            if (type) {
                let output;
                
                if (type === "channel") output = (message.guild.channels.get(value) || { name: null }).name;
                else if (type === "word") output = value;

                if (output !== null && output !== undefined) result.push({ setting, value: output });
            }
        }

        return message.channel.respond(`**__List of server settings:__**\n${result.map(({ setting, value }) => `__${escapeMarkdown(setting)}__ is set to **${escapeMarkdown(value)}**`).join("\n")}`, { showCheck: false });
    }

    async edit(message, args, settings) {
        const types = {
            joinlog: "channel",
            modlog: "channel",
            prefix: "word"
        };

        const setting = args[1];
        if (!setting) return message.channel.error("Please specify a setting to edit.");
        const type = types[setting];
        if (!type) return message.channel.error("Invalid setting.");
        const value = args[2];
        if (!value) return message.channel.error("Please provide a value for the new setting.");

        let out;

        if (type === "channel") {
            const result = message.guild.channels.find(channel => channel.type === "text" && channel.name.toLowerCase() === value) || message.mentions.channels.first() || message.guild.channels.get(value);
            if (!result) return message.channel.error("No channel found.");

            out = result.id;
        } else if (type === "word") out = value;

        const update = { ...settings, [setting]: out };
        await this.client.guildSettings.update(update).run();

        return message.channel.respond(`Successfully updated server settings.`);
    }

    async reset(message, args, settings) {
        if (!args[1]) {
            await this.client.guildSettings.get(message.guild.id).delete();
            message.channel.respond(`Successfully reset ${message.guild.name}'s server settings.`);
        } else if (settings[args[1]]) {
            const update = { ...settings, [args[1]]: null };
            await this.client.guildSettings.update(update).run();

            message.channel.respond(`Successfully reset the ${args[1]} setting.`);
        } else message.channel.error("Invalid setting.");
    }

    async list(message) {
        return message.channel.respond(`**__Valid setting names and types:__**\n**modlog** __(channel)__ The channel to send moderation logs.\n**joinlog** __(channel)__ The channel to send user joins and leaves.\n**prefix** __(word)__ The prefix used by the bot.`, { showCheck: false });
    }
}

module.exports = Settings;
