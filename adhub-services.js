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

client.on('message', message => {

  if (message.content.split(' ')[0] === prefix + 'vote') {
    if(message.guild.id == mainId)
    {
      times.get({id: parseInt(message.author.id)}, function(err, data) {
        var time;
        var good = false;
        if(data.length != 0)
        {
          time = new Date(data[0].lastTime);

        }
        else{
          time = new Date();
          good = true;
          //wwww("Here");
        }
        //wwww(time.getMilliseconds());

      if(daysBetween(new Date(), time) || good)
      {
        if(fs.existsSync("Guild-Owners/" + message.mentions.members.first().id + ".txt"))
        {
          fs.readFile("Guild-Owners/" + message.mentions.members.first().id + ".txt", function(err,data){
            if(!err)
            {

              const guil = client.guilds.find(val => val.id == data);

              var temp;
              var obj;
              times.put({id: parseInt(message.author.id), lastTime: time.getTime()}, function(err) {});

              db.get({id: parseInt(message.author.id), server:guil.id}, function(err, data){
                try{
              //wwww(JSON.stringify(data));
                  temp = parseInt(JSON.stringify(data[0]).split(':')[3].split('}')[0]);
                  //wwww(JSON.stringify(data[0]).split(':')[3].split('}')[0]);
                }catch(ex)
                {
                  temp = 0;
                }
                db.put({id: parseInt(message.author.id), server: guil.id, value: temp + 1}, function(err){

                });
                ////wwww("Data is " + data[0].data);


              });

              var ser = openDB('Votes/server.json');
              ser.get({id: parseInt(guil.id)}, function(err, data){
                var temp;
                if(data.length != 0)
                  temp = data[0].votes;
                else
                  temp = 0;
                ser.put({id: parseInt(guil.id), votes: temp+1}, function(err)
                {
                  leaderBoard();
                });

              });

               message.reply(" successfully voted!");
              var commands = openDB('Client-Server/commands.json');
              commands.get({id: parseInt(guil.id)}, function (err, data){
                var dat;
                try {
                const channel = guil.channels.find(val => val.id == data[0].channel.id);
                channel.send(message.author + " voted!");

                console.log(data);
                if(data == undefined || data[0] == undefined || data[0].command == undefined)
                  dat = [];
                else
                  dat = data[0].command.split('\n');
                for(var i = 0; i<dat.length; i++) channel.send(dat[i]);
                }catch(ex) {}
              });

                          //if(guil.)


            }
          });
        }else{
          message.reply(" there is no server on AdHub owned by " + message.mentions.members.first());
        }
      }else{
        message.reply(" you already voted on " + time)
      }
    });
    }


  }else{
    if(message.content.split(' ')[0] == prefix + 'addCommand')
    {
      if(message.content.length == 12)
        return message.reply(" please enter a command");
      var commands = openDB('Client-Server/commands.json');
      commands.get({id: parseInt(message.guild.id)}, function (err, data){
        var prev;
        if(data.length < 1 || data == undefined || data[0].command == undefined)
          prev = "";
        else
          prev = data[0].command;
          commands.put({id: parseInt(message.guild.id), command: prev + "\n" + message.content.substring(10)},
                function (err) {});
          message.reply(" your command has been added");
      });

    }
    if(message.content.split(' ')[0] == prefix + 'config')
    {
      var commands = openDB('Client-Server/commands.json');
      var all = message.content.split(' ');
      //var perms = new Discord.Permissions(message.member, )
      if(message.guild.ownerID != message.author.id)
        return message.reply(" you do not have permissions to use this command only the owner can use this command.");
      if(all < 3)
        return message.channel.send("Bad formating, /config <channel name> <using role>");
      try {
        commands.put({id: parseInt(message.guild.id), channel: message.mentions.channels.first(),
        role: message.mentions.roles.first()}, function(err) {});
      }catch(err)
      {
        return message.channel.send("Bad formating, /config <channel name> <using role>");
      }
      message.reply(" settings were configured successfully");
    }
    if(message.content == prefix + 'ping')
    {
      return message.channel.send("pong!");
    }
    if(message.content == prefix + 'help')
    {

      message.channel.send("The help for the AdHub Voting Bot:\n/config <channel name> <using role> - Configures the bot for your server. (Admin Command)\n" +
      "/addCommand command - adds the command which will be triggered on a player voting for this server\n");
    }
    if(message.content.startsWith(prefix + 'ban'))
    {
      if(!message.member.roles.some(r=>["DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
      {
        message.channel.send("You do not have permissions to ban");
      }else
      {
        message.guild.ban(message.mentions.members.first());
      }
    }
    if(message.content.startsWith(prefix + 'mute'))
    {
      if(!message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
      {
        message.channel.send("You do not have permissions to mute");
      }else
      {
        var role = message.guild.roles.find(val => val.name == "Adhub-Mute");
        message.guild.members.find(val => val.id == message.author.id).addRole(role);
      }
    }
    if(message.content.startsWith(prefix + 'unban'))
    {
      if(!message.member.roles.some(r=>["DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
      {
        message.channel.send("You do not have permissions to unban");
      }else
      {
        message.guild.unban(message.mentions.members.first());
      }
    }
    if(message.content.startsWith(prefix + 'unmute'))
    {
      if(!message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )
      {
        message.channel.send("You do not have permissions to unmute");
      }else
      {
        var role = message.guild.roles.find(val => val.name == "Adhub-Mute");
        message.guild.members.find(val => val.id == message.author.id).removeRole(role);
      }
    }
    //if(message.content.substr() == '')
  }




});

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
