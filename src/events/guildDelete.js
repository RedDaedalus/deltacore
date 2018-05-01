const { escapeMarkdown, WebhookClient } = require("discord.js");

function guildDelete(guild, client) {
    const webhook = new WebhookClient("437676623936880683", "ociFE4wSf0zmQqujTm7ou4NDrGP4z-LNDcDM7ZL17R6uEX8WG36EEmiExHB7eQYPCqLT", { disableEveryone: true });
    webhook.send(`${client.user.username} left **${escapeMarkdown(guild.name)}** owned by **${escapeMarkdown(guild.owner.user.tag)}** with **${guild.memberCount}** members.`);
}

module.exports = guildDelete;
