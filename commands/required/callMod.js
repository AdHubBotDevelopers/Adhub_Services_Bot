const { Command } = require('discord.js-commando');

module.exports = class CallModCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'call',
            group: 'required',
            memberName: 'call',
            description: 'Calls a Global Moderator',
            examples: ['call <Reason>', 'call THE SNEKS ARE EVERYWHERE'],
            args: [
                {
                    key: 'reason',
                    prompt: 'Please enter a reason',
                    type: 'string'
                }
            ]
        });
    }

    run(message, { reason }) {
        this.client
    }
}