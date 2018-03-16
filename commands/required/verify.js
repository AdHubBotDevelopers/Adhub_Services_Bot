const { Command } = require('discord.js-commando');
const openDB = require('json-file-db');

module.exports = class VerifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'verify',
      group: 'required',
      memberName: 'verify',
      description: 'Allows Global Moderators to verify that they are, in fact, global moderators',
      examples: ['verify'],
      guildOnly: true
    });
  }

  hasPermission(message) {
    var modList = openDB('DB/ModList.json');
    modList.get({user: parseInt(message.author.id)}, function(err, data) {
      if(data.length != 0) {
        return true;
      } else {
        return message.say(`No, ${message.author.username} is *not* a global moderator. Don't trust them!`);
      }
    })
  }
  run(message) {
    message.reply(`Yes! ${message.author.username} is, in fact, a global moderator.`)
  }
}
