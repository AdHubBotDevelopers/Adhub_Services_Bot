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
        var members = guild.fetchMembers();
        for(var i = 0; i<members.length; i++) {
           var invites = guild.fetchInvites(parseInt(members[i].id));
           console.log(invites[i].code);
           /*if (invites.length != 0) {
               var invite = invites[i];
               return;
           }*/
        }
        channel.send(`${message.author} needs help in ${message.guild.name} with invite ${invite.get}`);
    }
}