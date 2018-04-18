const Client = require("./src/classes/Client");
const config = require("./config");

// Extenders
require("./src/extenders/Guild");
require("./src/extenders/TextChannel");

const client = new Client({ token: config.credentials.token, ...config });

client.loadCommands(config.dirs.commands);
client.loadEvents(config.dirs.events);