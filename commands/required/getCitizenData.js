const { Command } = require('discord.js-commando');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
var TOKEN_PATH = TOKEN_DIR + '\\sheets.googleapis.com-parvasian-services.json';


module.exports = class CitizenDataCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'getcitizendata',
      group: 'required',
      memberName: 'getcitizendata',
      description: 'Used by Moderators to get citizen data',
      examples: ['getcitizendata <USER>'],
      args: [
        {
          key: 'user',
          prompt: 'Please mention the user to get data for',
          type: 'user'
        }
      ]
    });
  }

  run(message, { user }) {
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if(err) {
        console.log('Error reading client secret file:' + err);
        return;
      }
      authorize(JSON.parse(content), authToken =>
      {
        returnCitizens(authToken, message, citizenList =>
        {
          for(var i = 0; i < citizenList.length; i++) {
            if(citizenList[i] == user.username + '#' + user.discriminator) {
              var data = citizenList[i];
              message.say('Data is: ' + data);
              console.log('Found them1');
              return;
            } else {
              console.log('Not them!');
            }
          }
        });
      })
    });

  }



}

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oath2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  //Checks for previously stored tokens
  fs.readFile(TOKEN_PATH, function(err, token) {
    if(err) {
      getNewToken(oath2Client, callback);
    } else {
      oath2Client.credentials = JSON.parse(token);
      callback(oath2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log(`Authorize this application by visiting the following URL: ${authUrl}`);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if(err) {
        console.log(`Error while trying to retrieve access token: ${err}`);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log(`Token stored to: ${TOKEN_PATH}`);
}

function listCitizens(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1Cec6aByI2NOcmVBAikHw1L9ZJj-kRT10lVieERkChEk',
    range: 'Citizens!A6:E'
  }, function(err, response) {
    if (err) {
      console.log('The API Returned an Error');
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data Found');
    } else {
      console.log('Name, Rank');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        console.log('%s, %s', row[0], row[4]);
      }
    }
  });

}

function returnCitizens(auth, message, callback) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1Cec6aByI2NOcmVBAikHw1L9ZJj-kRT10lVieERkChEk',
    range: 'Citizens!A6:E'
  },function(err, response) {
    if (err) {
      console.log('The API Returned an Error' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No Data Found');
      message.say('There was no data found in the spreadsheet. Please contact the High Court');
    } else {
      callback(rows);
    }
  })
}
