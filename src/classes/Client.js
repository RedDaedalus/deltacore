const chalk = require("chalk");
const { Client, Collection } = require("discord.js");
const klaw = require("klaw");
const { parse, sep } = require("path");
const r = require("rethinkdbdash")({ db: "deltacore" });

class CustomClient extends Client {
    constructor(options) {
        // Create discord.js client
        super(options);

        // Initialize
        this.init();

        // Commands collection
        Object.defineProperty(this, "commands", { value: new Collection() });
        // Aliases collection
        Object.defineProperty(this, "aliases", { value: new Collection() });

        // Verify that token is present
        if (!options.token) throw new Error("No token provided");
        // Login
        super.login(options.token);
    }

    async init() {
        // Server settings
        Object.defineProperty(this, "guildSettings", { value: r.table("guild_settings") });

        this.log("finished", "Initialized rethinkdb.", "green");
    }

    log(title, content, color = "white") {
        console.log(title.toUpperCase() + chalk[color](" >> ") + content);
    }

    loadCommand(path, name) {
        try {
            // Require the command
            const props = new (require(path + sep + name))(this);
            // If a command has an init function, run it
            if (props.init) props.init();
            // Add the command to the collection
            this.commands.set(props.name, props);
            
            // Register aliases
            props.aliases.forEach(alias => this.aliases.set(alias, props.name));
        } catch (e) {
            return `Error loading ${name}: ${e}`;
        }
    }

    loadCommands(path) {
        klaw(path).on("data", async item => {
            // Parse file from path
            const file = parse(item.path);
            // Check extension
            if (!file.ext || file.ext !== ".js") return;

            // Load command
            const response = await this.loadCommand(file.dir, file.name);
            // Check for response
            if (response) return this.log("error", response, "red");

            this.log("commands", `Command successfully loaded from ${file.name}.`, "green");
        });
    }

    loadEvents(path) {
        klaw(path).on("data", async item => {
            // Parse file from path
            const file = parse(item.path);
            // Check extension
            if (!file.ext || file.ext !== ".js") return;

            // Fetch event
            const event = require(`../../${path}/${file.name}`);
            // Add event listener
            super.on(file.name, (...args) => event(...args, this));
        });
    }

    command(name) {
        return this.commands.get(name) || this.commands.get(this.aliases.get(name));
    }
}

module.exports = CustomClient;