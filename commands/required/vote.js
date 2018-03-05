const { Command } = require('discord.js-commando');

const config = require('../../config.json');
const mainId = config.mainId;

module.exports = class VoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      group: 'required',
      memberName: 'vote',
      description: 'Upvotes a server on the leaderboard',
      examples: ['/vote']
    })
  }

  run(message) {
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
  }
}
