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
               /* {
                    key: 'reason',
                    prompt: 'Please enter a reason',
                    type: 'string',
                    default: 'I need help!'
                }*/
            ]
        });
    }

    run(message/*, { reason }*/) {
        const guild = this.client.guilds.find(400734359226810378);
        const channel = guild.channels.find(400769467606368256);
        console.log('Fetching invites');
        message.guild.fetchInvites()
            .then(invites => console.log(`Grabbed ${invites.get(0)} from a Collection with a size of ${invites.size}`))
            .catch(console.error);
        channel.send(`${message.author} needs help in ${message.guild.name} with invite ${invite.get(0)}`);
    }
}