const { escapeMarkdown } = require("discord.js");

async function guildMemberAdd(member, client) {
    const guild = member.guild;
    const { joinlog } = await guild.fetchSettings();

    const channel = guild.channels.get(joinlog);
    if (!channel || channel.type !== "text") return;

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][member.user.createdAt.getMonth()];
    const fullDate = `${month} ${member.user.createdAt.getDate().toString().length === 1 ? `0${member.user.createdAt.getDate()}` : member.user.createdAt.getDate()}, ${member.user.createdAt.getFullYear()}`;

    const embed = channel.buildEmbed()
        .setColor(client.options.color)
        .setAuthor(escapeMarkdown(`${member.user.tag} (${member.id})`), member.user.avatarURL({ format: "png", size: 128 }))
        .setTitle("Member Joined")
        .addField("» Account Created", fullDate, true)
        .addField("» Username", escapeMarkdown(member.user.username), true)
        .addField("» Discriminator", member.user.discriminator, true)
        .addField("» ID", member.id, true)
        .addField("» Bot?", member.user.bot ? "Yes." : "No.", true)
        .addField("» Status", { dnd: "Do not disturb", online: "Online", invisible: "Offline", idle: "Idle" }[member.presence.status], true)
        .setFooter("Joined")
        .setTimestamp();

    channel.send(embed);
}

module.exports = guildMemberAdd;
