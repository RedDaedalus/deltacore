const { escapeMarkdown } = require("discord.js");

async function message(message, client) {
    // Verify that the message was sent in a valid guild, the bot has permissions to send messages, and not by a bot
    if (message.author.bot || (message.guild && !message.guild.available) || (message.guild && !message.guild.me.permissions.has("SEND_MESSAGES"))) return;

    // Fetch server settings or default settings
    const settings = message.guild ? await message.guild.fetchSettings() : client.options.defaultSettings;
    
    // Check if the message content is a bot mention
    if (new RegExp(`^<@(?:!?${client.user.id})>$`, "ig").test(message.content)) return message.channel.respond(`This server's prefix is \`${escapeMarkdown(settings.prefix)}\`.`);

    // Verify that the message starts with the prefix
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // Get command arguments
    const args = message.content.split(/\s+/g);
    // Get command name
    const cmd = args.shift().slice(settings.prefix.length);
    // Get command object
    const command = client.command(cmd);

    // Verify command
    if (!command) return;
    
    // Check channel
    if (message.channel.type !== "text" && !command.allowDMs) return message.channel.error("This command is not available through direct message.");

    // Check if owner only
    if (command.ownerOnly && !client.options.owners.includes(message.author.id)) return;

    // Check user permissions
    if (command.userPerms.find(permission => !message.member.permissions.has(permission))) return message.channel.error("Insufficient permissions!");
    // Check bot permissions
    if (command.botPerms.find(permission => !message.guild.me.permissions.has(permission))) return message.channel.error("I lack the permissions to perform this action.");

    // Execute the command
    command.run(message, args, settings);
}

module.exports = message;
