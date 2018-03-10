const { Command } = require('discord.js-commando');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      group: 'misc',
      memberName: 'ban',
      description: 'Bans the selected user',
      examples: ['ban <User Mention> [Reason]'],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
        key: 'victim',
        prompt: 'Please mention the person to be banned',
        type: 'user'
      },
      {
        key: 'reason',
        prompt: 'Please enter a reason for the ban',
        type: 'string'
      }
      ]
    });
  }

  run(message, {victim, reason}) {
      message.guild.ban(victim, {reason: reason});
  }
}
