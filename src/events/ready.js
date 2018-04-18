function ready(client) {
    client.log("login", "Login finished.", "green");

    client.user.setActivity(`for _help | ${client.guilds.size} servers`, { type: "watcihng" });
}

module.exports = ready;
