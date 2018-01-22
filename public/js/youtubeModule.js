
var mainJS = require('../../main');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';
var global_response ;

// Load client secrets from a local file.

module.exports = {
    search : function(response, speech){
      global_response = response;
      var x = fs.readFileSync('public/js/client_secret.json', 'utf-8');   
      // Authorize a client with the loaded credentials, then call the YouTube API.
      //authorize(JSON.parse(content), getChannel);
      authorize(JSON.parse(x), {'params': {'maxResults': '2','part': 'snippet','q': speech,'type': 'video'}}, searchListByKeyword);
      }
    };


function processFile(content) {
  console.log(content);

}

function authorize(credentials, requestData, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
    // Check if we have previously stored a token.
    var x = fs.readFileSync(TOKEN_PATH, 'utf-8');

        //getNewToken(oauth2Client, requestData, callback);
    oauth2Client.credentials = JSON.parse(x);
    callback(oauth2Client, requestData);
}

function getNewToken(oauth2Client, requestData, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client, requestData);
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
    console.log('Token stored to ' + TOKEN_PATH);
}
              
function removeEmptyParameters(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

function searchListByKeyword(auth, requestData) {
    ans ='';
    var service = google.youtube('v3');
    var parameters = removeEmptyParameters(requestData['params']);
    parameters['auth'] = auth;
    service.search.list(parameters, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      for(i=0;i<response['items'].length;i++){
        //console.log('etag : ' + response['items'][i]['etag'])     
        url =  'https://www.youtube.com/watch?v=' + response['items'][i]['id']['videoId']                  
        //console.log('url : ' + url)                
        //console.log('publishedAt : ' + response['items'][i]['snippet']['publishedAt'])        
        //console.log('title : ' + response['items'][i]['snippet']['title'])
        //console.log('description : ' + response['items'][i]['snippet']['description'])
        //console.log('channelTitle : ' + response['items'][i]['snippet']['channelTitle'])
        ans +=  '<h4>'+  response['items'][i]['snippet']['title']+ '</h4>' + 'url : ' +'<a href='+url+'>'+ url +'</a>'+ '<br>' +
          response['items'][i]['snippet']['publishedAt']  + '<br>' + response['items'][i]['snippet']['description'] + '<br>' + 'channelTitle : ' + response['items'][i]['snippet']['channelTitle']+'<br>' ;
        ans += '------------------------------------------------------------------<br>';
      }
      // TT
      //mainJS.getMovieData(global_response, ans);   
      mainJS.getMovieData(global_response, ans);
    });
  }
