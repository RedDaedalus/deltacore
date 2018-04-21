const Command = require("../classes/Command");

// CREDITS
// Code mainly based off of evie.selfbot (https://github.com/eslachance/evie.selfbot/blob/master/commands/purge.js)

class Clear extends Command {
    constructor(client) {
        super(client, {
            help: {
                name: "clear",
                description: "Clears a large amount of messages at once",
                usage: "[user] <amount>"
            },
            conf: {
                aliases: ["prune", "purge"],
                userPerms: ["MANAGE_MESSAGES"],
                botPerms: ["MANAGE_MESSAGES"],
                dms: false
            }
        });
    }

    async run(message, args) {
        // Fetch the target user
        const user = (message.mentions.users.first() || this.client.users.get(args[0]));
        // Fetch the amount
        const amount = user ? parseInt(args[1], 10) : parseInt(args[0], 10);

        // Verify that the amount is within 2 and 100
        if (!amount || amount < 2 || amount > 100) return message.channel.error("Please specify an amount of messages to delete between 2 and 100.");

        // Delete the user's message to reduce the amount of messages in need of clearing
        await message.delete();

        // Fetch the latest 100 messages
        let messages = await message.channel.messages.fetch({ limit: 100 });
        // Turn mesages into an array
        messages = messages.array();

        // If user was specified, remove all messages that weren't sent by the specified user
        if (user) messages = messages.filter(m => m.author.id === user.id);
        messages.slice(0, amount + 1);

        // Bulk delete the messages
        message.channel.bulkDelete(messages, true).then(deleted => {
            // Check that messages were deleted
            if (deleted.size === 0) return message.channel.error("No messages found to delete. This may be because some messages were too old to prune.");
            // Specify how many messages were deleted.
            message.channel.respond(`Successfully delted ${deleted.size} message${deleted.size === 1 ? "" : "s"}.`).then(m => m.delete({ timeout: 10000 }));
        }).catch(() => message.channel.error("An unknown error occured."));
    }
}

module.exports = Clear;
