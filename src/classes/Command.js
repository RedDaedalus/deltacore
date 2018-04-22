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
                value: props.conf.dms === undefined ? true : props.conf.dms
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

    // CREDITS
    // Mostly adapted from Misaki's Command.verifyUser function
    // https://github.com/NotAWeebDev/Misaki/blob/master/structures/Command.js#L55
    async verifyUser(unresolved, message) {
        try {
            const match = /(?:<@!?)?(\d{17,20})>?/ig.exec(unresolved);
            if (match) return this.client.users.fetch(match[1]);
            
            if (message && message.guild && /#\d{4}/g.test(unresolved)) return message.guild.members.find(m => m.user.tag === unresolved);
            
            const member = message && message.guild ? message.guild.members.find(m => m.user.username === unresolved || m.displayName === unresolved) : null;
            return member ? member.user : null;
        } catch (e) {
            return null;
        }
    }
}

module.exports = Command;
