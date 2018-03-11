const Commando = require('discord.js-commando');
var openDB = require('json-file-db');
var db = openDB('Votes/voters.json');
var times = openDB('../../Votes/VoterTimes.json');
const path = require('path');
const sqlite = require('sqlite');
const client = new Commando.CommandoClient({
  owner: ['118455061222260736', '396676498892914688', '285529770668851200', '396528169978560512'],
  commandPrefix: '\\',
  disableEveryone: true
})
var fs = require('fs');

client.registry
.registerGroups([
  ['required', 'Commands necessary for operation'],
  ['misc', 'Commands that are not necessary, but useful']
])
.registerDefaults()
.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

const config = require("./config.json");
// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;
const prefix = config.prefix;
const mainId = config.mainId;


var mainGuild;
var mainChannel;
var commandUse = [];
client.on('ready', () => {
  mainGuild = client.guilds.find(val => val.id == mainId);
  mainChannel = mainGuild.channels.find(val => val.name == "leaderboard");
  client.user.setActivity('with code!');
  console.log('Reporting for duty!');
});

client.on('guildMemberAdd', member => {
  var banList = openDB('DB/GlobalBanList.json');
  banList.get({user: member.username}, function(err, data) {
    if (data.length != 0) {
      member.kick(`Globally banned from the Sovereignty of Parvus.`);
    }
  })
})

var coolDownArr = [];
client.on('guildCreate', guild => {

  fs.writeFile("Guild-Owners/" + guild.ownerId + ".txt", guild.id, function(err) {
      if(err) {
          return; //wwww(err);
      }

      //wwww("The file was saved!");
  });

});

client.on('guildMemberRemove', member => {
    var ser = openDB('Votes/server.json');
    ser.get({id: parseInt(member.guild.id)}, function(err, data){
    var temp;
    if(data.length != 0)
      temp = data[0].votes;
    else
      temp = 0;
    db.get({id: parseInt(member.id), server:member.guild.id}, function(err, data){
      var temp1;
      try{
        temp1 = parseInt(JSON.stringify(data[0]).split(':')[3].split('}')[0]);
      }catch(ex)
      {
        temp1 = 0;
      }
      ser.put({id: parseInt(member.guild.id), votes: temp1-temp}, function(err){});
    });

  });

});


function leaderBoard()
{
  fs.readFile("Votes/server.json", function (err, data)
  {
    var jsonObj = JSON.parse(data);
    jsonObj.sort(GetSortOrder('votes'));
    //wwww(jsonObj);
    var servers = "";
    var done = false;

    var adjust = jsonObj.length < 5 ? jsonObj.length -1 : 4;
    //wwww(adjust);
    client.guilds.find(val => val.id == jsonObj[adjust].id).fetchInvites().then(invites => {
      servers += invites.array().length > 0 ?"\n" + (adjust+1) + ". " + invites.array()[0] : "\n" +(adjust+1) + ". Server does not have an invite link";
      if(adjust - 1 > -1)
      {
        adjust--;
        client.guilds.find(val => val.id == jsonObj[adjust].id).fetchInvites().then(invites => {
          servers += invites.array().length > 0 ? "\n" +(adjust+1) + ". " + invites.array()[0] : "\n" +(adjust+1) + ". Server does not have an invite link";
          if(adjust - 1 > -1)
          {
             adjust--;
            client.guilds.find(val => val.id == jsonObj[adjust].id).fetchInvites().then(invites => {
              servers += invites.array().length > 0 ? "\n" +(adjust+1) + ". " + invites.array()[0] :"\n" + (adjust+1) + ". Server does not have an invite link";
              if(adjust - 1 > -1)
              {
                adjust--;
                client.guilds.find(val => val.id == jsonObj[adjust].id).fetchInvites().then(invites => {
                  servers += invites.array().length > 0 ? "\n" + (adjust+1) + ". " + invites.array()[0] :"\n" + (adjust+1) + ". Server does not have an invite link";
                  if(adjust - 1 > -1)
                  {
                    adjust--;
                    //wwww(adjust);
                    client.guilds.find(val => val.id == jsonObj[adjust].id).fetchInvites().then(invites => {
                      servers += invites.array().length > 0 ? "\n" + (adjust+1) + ". " + invites.array()[0] : "\n" + (adjust + 1) + ". Server does not have an invite link";
                        endOf(servers , jsonObj);
                    });
                  }else endOf(servers , jsonObj);
                });
              }else endOf(servers , jsonObj);
            });
          }else endOf(servers , jsonObj);
        });
      }else endOf(servers , jsonObj);
    });

  });
}

function endOf(servers, jsonObj)
{

              //wwww("SERVERS: " + servers);
              var temp = "Top 5 Servers \n";
              for(var i = jsonObj.length > 5 ? 4 : jsonObj.length - 1 ; i>=0; i--)
              {
                temp += (i + 1) + ", " + client.guilds.find(val => val.id == jsonObj[i].id).name
                + " " + jsonObj[i].votes;
                if(i != 0) temp += "\n";
              }
              temp += "\n\n" + servers;
              servers = temp;
              //wwww("NOW:: " + servers);
              mainChannel.fetchMessage('395319602676236288')
            .then(message => message.editCode(servers));

}

function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;
        }
        return 0;
    }
}

function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return difference_ms / one_day * 7 >= 7;
}

function timeBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return difference_ms >= 30;
}
client.login(token);

dd(client);




const authors = [];
var warned = [];
var banned = [];
var messagelog = [];

const warnBuffer = 3;
const maxBuffer = 5;
const interval = 1000;
const warningMessage = "Please cease your spamming!";
const banMessage = "did not cease and desist their activities";
const maxDuplicatesWarning = 7;
const maxDuplicatesBan = 10;

function dd(bot)
{
  bot.on('message', msg => {

    if(msg.author.id != bot.user.id){
      var now = Math.floor(Date.now());
      authors.push({
        "time": now,
        "author": msg.author.id
      });
      messagelog.push({
        "message": msg.content,
        "author": msg.author.id
      });

      // Check how many times the same message has been sent.
      var msgMatch = 0;
      for (var i = 0; i < messagelog.length; i++) {
        if (messagelog[i].message == msg.content && (messagelog[i].author == msg.author.id) && (msg.author.id !== bot.user.id)) {
          msgMatch++;
        }
      }
      // Check matched count
      if (msgMatch == maxDuplicatesWarning && !warned.includes(msg.author.id)) {
        warn(msg, msg.author.id);
      }
      if (msgMatch == maxDuplicatesBan && !banned.includes(msg.author.id)) {
        ban(msg, msg.author.id);
      }

      var matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(msg.author.id)) {
              warn(msg, msg.author.id);
          }
          else if (matched == maxBuffer) {
            if (!banned.includes(msg.author.id)) {
              ban(msg, msg.author.id);
            }
          }
        }
         else if (authors[i].time < now - interval) {
           authors.splice(i);
           warned.splice(warned.indexOf(authors[i]));
           banned.splice(warned.indexOf(authors[i]));
         }
         if (messagelog.length >= 200) {
           messagelog.shift();
         }
      }
    }
  });

  function warn(msg, userid) {
    warned.push(msg.author.id);
    msg.channel.send(msg.author + " " + warningMessage);
  }


  function ban(msg, userid) {
    for (var i = 0; i < messagelog.length; i++) {
      if (messagelog[i].author == msg.author.id) {
        messagelog.splice(i);

      }
    }

    banned.push(msg.author.id);

      var role = msg.guild.roles.find(val => val.name == "AdHub-Mute");
      msg.guild.members.find(val => val.id == msg.author.id).addRole(role);
      setTimeout(function()
      {
        msg.guild.members.find(val => val.id == msg.author.id).removeRole(role);
        msg.reply("Mute is up, please do not spam");
      }, 300000);

      msg.reply(" did not cease and desist");
  }
}
