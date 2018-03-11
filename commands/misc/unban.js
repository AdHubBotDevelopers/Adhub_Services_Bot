const { Command } = require('discord.js-commando');

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      group: 'misc',
      memberName: 'unban',
      description: 'Unbans the selected user',
      examples: ['unban <userID> [reason]'],
      clientPermissions: ['UNBAN_MEMBERS'],
      userPermissions: ['UNBAN_MEMBERS'],
      args: [
        {
          key: 'victim',
          prompt: 'Please enter the name of the user to be unbanned',
          type: 'user'
        },
        {
          key: 'reason',
          prompt: 'Please enter a reason',
          type: 'string',
          default: 'Unban'
        }
      ]
    });
  }
  run(message, { victim, reason }) {
    //Collection banCollection = message.guild.fetchBans();

    message.guild.unban(message.guild.fetchBans().find('username', victim), reason);
  }
}
