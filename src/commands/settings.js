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
                userPerms: ["MANAGE_SERVER"],
                dms: false
            }
        });
    }

    async run(message, args, settings) {
        // Run this.view if args[0] is view
        if (args[0] === "view") this.view(message, args, settings);
        // Run this.edit if args[0] is edit
        else if (args[0] === "edit") this.edit(message, args, settings);
        // run this.reset if args[0] is reset
        else if (args[0] === "reset") this.reset(message, args, settings);
        // run this.list if args[0] is list
        else if (args[0] === "list") this.list(message);
        // Tell the user the correct command usage if none of the above statements were true
        else return message.channel.error(`Command usage: \`${settings.prefix + this.name} ${this.usage}\`.`);
    }

    async view(message, args, settings) {
        // Setting types
        const types = {
            joinlog: "channel",
            modlog: "channel",
            prefix: "word"
        };

        if (args[1]) {
            // Fetch setting from second argument
            const setting = settings[args[1]];
            // Fetch setting type
            const type = types[args[1]];

            // Validate the setting
            if (!setting || !type) return message.channel.error("This setting is either unset or invalid.");

            // Create empty output variable
            let output;

            // If type is channel, get the channel name
            if (type === "channel") output = message.guild.channels.get(setting) || null;
            else output = setting;

            // Validate the output
            if (output === null) return message.channel.error("This setting is unset.");
            
            // Respond with the output's value
            return message.channel.respond(`The current value for setting __${escapeMarkdown(args[1])}__ is **${escapeMarkdown(output.toString())}**`, { showCheck: false });
        }

        // Create an empty array for the result
        const result = [];

        // Run through all object keys in settings
        for (const setting in settings) { // eslint-disable-line
            // Fetch the value of the setting
            const value = settings[setting];
            // Fetch the type of the setting
            const type = types[setting];

            // Check if a type was found
            if (type) {
                // Create empty output variable
                let output;
                
                // If type is channel, get the channel name
                if (type === "channel") output = message.guild.channels.get(value) || null;
                else output = value;

                // If output is valid, push the output to result
                if (output !== null && output !== undefined) result.push({ setting, value: output });
            }
        }

        // Send all of the information stored in result
        return message.channel.respond(`**__List of server settings:__**\n${result.map(({ setting, value }) => `__${escapeMarkdown(setting)}__ is set to **${escapeMarkdown(value.toString())}**`).join("\n")}`, { showCheck: false });
    }

    async edit(message, args, settings) {
        // Setting types
        const types = {
            joinlog: "channel",
            modlog: "channel",
            prefix: "word"
        };

        // Fetch the setting to edit
        const setting = args[1];
        // Make sure the user specified a setting
        if (!setting) return message.channel.error("Please specify a setting to edit.");
        // Fetch the setting type (also used to validate the setting)
        const type = types[setting];
        // Check if setting is invalid
        if (!type) return message.channel.error("Invalid setting.");
        // Fetch the new value for the setting
        const value = args.slice(2).join(" ");
        // Make sure a value was found
        if (!value) return message.channel.error("Please provide a value for the new setting.");

        // Create an empty output variable
        let out;

        if (type === "channel") {
            // Fetch the channel
            const result = message.guild.channels.find(channel => channel.type === "text" && channel.name.toLowerCase() === value) || message.mentions.channels.first() || message.guild.channels.get(value);
            // Validate fetched channel
            if (!result) return message.channel.error("No channel found.");

            // Set output to the channel's ID
            out = result.id;
        } else if (type === "word") out = value.split(" ")[0];

        // Create a new settings object
        const update = { ...settings, [setting]: out };
        // Update guild settings
        await this.client.guildSettings.update(update).run();

        // Say that settings were updated
        return message.channel.respond(`Successfully updated server settings.`);
    }

    async reset(message, args, settings) {
        // If no arguments were specified...
        if (!args[1]) {
            // Delete all guild settings under the guild's ID
            await this.client.guildSettings.get(message.guild.id).delete();
            // Say that settings were reset
            message.channel.respond(`Successfully reset ${message.guild.name}'s server settings.`);
        } else if (settings[args[1]]) {
            // Create a new settings object with a deleted property
            const update = { ...settings, [args[1]]: null };
            // Update the server settings
            await this.client.guildSettings.update(update).run();

            // Say that the setting was reset
            message.channel.respond(`Successfully reset the ${args[1]} setting.`);
        } else message.channel.error("Invalid setting.");
    }

    async list(message) {
        // List settings
        return message.channel.respond(`**__Valid setting names and types:__**\n**modlog** __(channel)__ The channel to send moderation logs.\n**joinlog** __(channel)__ The channel to send user joins and leaves.\n**prefix** __(word)__ The prefix used by the bot.`, { showCheck: false });
    }
}

module.exports = Settings;
