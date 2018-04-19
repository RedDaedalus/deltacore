const { Structures } = require("discord.js");

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
    }

    return Guild;
});
