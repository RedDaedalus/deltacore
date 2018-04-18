class Command {
    constructor(client, props) {
        // Check if name was provided
        if (!props.help.name) throw new Error("No name provided");
        
        // Define properties
        Object.defineProperties(this, {
            client: {
                value: client
            },
            name: {
                value: props.help.name
            },
            description: {
                value: props.help.description || "No description provided."
            },
            usage: {
                value: props.help.usage || ""
            },
            userPerms: {
                value: props.conf.userPerms || []
            },
            botPerms: {
                value: props.conf.botPerms || []
            },
            allowDMs: {
                value: props.conf.dms || true
            },
            cooldown: {
                value: props.conf.cooldown || 1000
            },
            aliases: {
                value: props.conf.aliases || []
            },
            ulisted: {
                value: props.conf.unlisted === undefined ? false : props.conf.unlisted
            },
            ownerOnly: {
                value: props.conf.ownerOnly === undefined ? false : props.conf.ownerOnly
            },
            cooldowns: {
                value: new Set()
            }
        }); 
    }
}

module.exports = Command;
