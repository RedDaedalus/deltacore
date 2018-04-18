const { Structures, MessageEmbed } = require("discord.js");

Structures.extend("TextChannel", (Structure) => {
    class TextChannel extends Structure {
        error(content, options = {}) {
            return this.send(`❌ | ${content}`, options);
        }

        respond(content, options = { check: true }) {
            return this.send((options.check ? "✅ | " : "") + content, options);
        }

        buildEmbed() {
            return Object.defineProperty(new MessageEmbed(), "channel", { value: this });
        }
    }

    return TextChannel;
});

Structures.extend("DMChannel", (Structure) => {
    class TextChannel extends Structure {
        error(content, options = {}) {
            return this.send(`❌ | ${content}`, options);
        }

        respond(content, options = { check: true }) {
            return this.send(options.check ? "✅ | " : "" + content);
        }
    }

    return TextChannel;
});