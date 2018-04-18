const { Structures } = require("discord.js");

Structures.extend("TextChannel", (Structure) => {
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