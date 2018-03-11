const { Command } = require('discord.js-commando');
const openDB = require('json-file-db');

module.exports = class GlobalBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'globalban',
      group: 'required',
      memberName: 'globalban',
      description: 'Globally bans a member from all Parvasian Protectorates',
      examples: ['globalban <ID> <REASON>'],
      args: [
        {
          key: 'victim',
          prompt: 'Please enter the ID of the person you wish to ban',
          type: 'user'
        },
        {
          key: 'reason',
          prompt: 'Please enter a reason',
          type: 'string'
        }
      ]
    })
  }
  hasPermission(message) {
    var modList = openDB('DB/ModList.json');
  modList.get({id: parseInt(message.author.id)}, function(err, data) {
      if(data.length != 0) {
        return true;
        console.log(`${message.author} is a global mod!`)
      } else {
        return 'Only Parvasian Global Moderators can use this command' ;
        //return this.client.isOwner(message.author.id);
      }
    });
  }
  run(message, { victim, reason }) {
    var banList = openDB('DB/GlobalBanList.json');
    banList.put({user: victim, reason: reason}, function(err) {
      if (err != null) {
        console.log(err);
      } else {
        message.say(`Successfully globally banned ${victim.username}`);
        console.log(`Successfully globally banned ${victim.username}`);
      }
    })
  }
    }