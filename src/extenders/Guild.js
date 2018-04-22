const { Structures } = require("discord.js");
const r = require("rethinkdbdash")({ db: "deltacore" });

Structures.extend("Guild", (Structure) => {
    class Guild extends Structure {
        async fetchSettings() {
            // Fetch settings from the guild ID
            const settings = await this.client.guildSettings.get(this.id);
            // Insert settings if missing
            if (!settings) await this.client.guildSettings.insert({ id: this.id, ...this.client.options.defaultSettings });

            // Return the found settings
            return settings || { id: this.id, ...this.client.options.defaultSettings };
        }

        async createModLog(action, target, moderator, reason, embed) {
            // Fetch the latest case
            const [latest] = await this.client.modLogs.filter({ guild_id: embed.channel.guild.id }).orderBy(r.desc("case_id")).limit(1);
            // Get the new case ID
            const caseID = latest ? latest.case_id + 1 : 1;

            embed.setFooter(`Case ID ${caseID}`);
            const message = await embed.channel.send(embed);

            // Insert the case into modlogs
            return this.client.modLogs.insert({ guild_id: this.id, message_id: message.id, case_id: caseID, action, target, moderator, reason, received: new Date() });
        }
    }

    return Guild;
});
