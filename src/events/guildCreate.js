const { escapeMarkdown, WebhookClient } = require("discord.js");

function guildCreate(guild, client) {
    const webhook = new WebhookClient("437675212033622026", "G8x9sd9MJzYZ1Y-_o07tZLzQ7Aco5GaQM9_14vyv1Nm_acUq_cni2UYSTslBdvpg3JKf", { disableEveryone: true });
    webhook.send(`${client.user.username} joined **${escapeMarkdown(guild.name)}** owned by **${escapeMarkdown(guild.owner.user.tag)}** with **${guild.memberCount}** members.`);
}

module.exports = guildCreate;
