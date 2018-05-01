const { escapeMarkdown } = require("discord.js");

async function guildMemberRemove(member, client) {
    const guild = member.guild;
    const { joinlog } = await guild.fetchSettings();

    const channel = guild.channels.get(joinlog);
    if (!channel || channel.type !== "text") return;

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][member.user.createdAt.getMonth()];
    const fullDate = `${month} ${member.user.createdAt.getDate().toString().length === 1 ? `0${member.user.createdAt.getDate()}` : member.user.createdAt.getDate()}, ${member.user.createdAt.getFullYear()}`;

    const embed = channel.buildEmbed()
        .setColor(client.options.color)
        .setAuthor(escapeMarkdown(`${member.user.tag} (${member.id})`), member.user.avatarURL({ format: "png", size: 128 }))
        .setTitle("Member Left")
        .addField("» Tag", member.user.tag, true)
        .addField("» ID", member.id, true)
        .addField("» Nickname", member.displayName !== member.user.username ? escapeMarkdown(member.displayName) : "*No nickname set.*", true)
        .addField("» Bot?", member.user.bot ? "Yes." : "No.", true)
        .addField("» Status", { dnd: "Do not disturb", online: "Online", invisible: "Offline", idle: "Idle" }[member.presence.status], true)
        .addField("» Roles", member.roles.filter(role => role.id !== guild.id).map(role => escapeMarkdown(role.name)).join(", "), true)
        .setFooter("Joined")
        .setTimestamp(member.joinedAt);

    channel.send(embed);
}

module.exports = guildMemberRemove;
