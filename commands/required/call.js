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
                    type: 'string',
                    default: 'I need help!'
                }
            ]
        });
    }

    run(message, { reason }) {
        if (message.guild.available) {
            const guild = this.client.guilds.get('421363587601137667');
            const channel = guild.channels.get('423829429706424340')
            console.log('Fetching invites');
            var inviteChannel = message.guild.systemChannel;
            if (inviteChannel == null) {
                message.say('Could not find the invite channel!');
                return;
            }
            var invite = inviteChannel.createInvite({
                maxUses: 1,
                reason: 'Someone called for a moderator!'
            }).then(invite => 
        
            channel.send(`${message.author} needs help in ${message.guild.name} with invite https://discord.gg/`+ invite.code + ` and reason ${reason}`));
        } else {
            message.say(`Could not find the guild! Please manually call for a global moderator in our Capital, http://discord.gg/zXWytCd`);
        }
    }
}