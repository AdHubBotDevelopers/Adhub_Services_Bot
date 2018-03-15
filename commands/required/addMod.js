const { Command } = require('discord.js-commando');
const openDB = require('json-file-db');

module.exports = class AddModCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addmod',
      group: 'required',
      memberName: 'addmod',
      description: 'Makes the selected person a Moderator',
      examples: ['addmod <USER>', 'addmod @Dr. Everett Mann#2318'],
      args: [
        {
          key: 'luckyDuck',
          prompt: 'Please mention the user to be made a moderator',
          type: 'user'
        }
      ],
      ownerOnly: true
    });
  }

  run(message, { luckyDuck }) {
    var modList = openDB('DB/ModList.json');
    modList.put({user: luckyDuck.id}, function(err) {
      if (err != null) {
        console.log(err);
      } else {
        console.log(`Successfully made ${luckyDuck.id} a global moderator!`);
        message.say(`Successfully made ${luckyDuck.id} a global moderator!`);
      }
    })
  }
}
