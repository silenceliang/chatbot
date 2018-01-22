
var httpserver = require("http");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
//var nodejieba = require("nodejieba");
//var chineseConv = require('chinese-conv');
var youtubeAuth = require('./public/js/youtubeModule');
var app = express();

var movie_request = false;
var alarm_request = false;
var memo_request = false;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// send movie info
exports.getMovieData = function(response, result){
    console.log(result);
    response.send({'movie': result});
    response.end();
};


app.get('/', function(request,response){
    response.sendFile(path.join(__dirname+'/public/html/chatbot.html'));
});

app.post('/movie_request', function(request,response){
    movie_request = request.body.movie_request;

});

app.post('/alarm_request', function(request,response){
    alarm_request = request.body.alarm_request;
    response.send('get alarm');
    response.end();
});

app.post('/memo_request', function(request,response){
    memo_request = request.body.memo_request;
    response.send('get memo');
    response.end();
});


app.post('/submit', function(request,response){
    var sentence = request.body.chat;
    // convert to simpled Chinese 
    //var sentence2sc = chineseConv.sify(sentence);
    //  delete quotation
    sentence = sentence.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""); 
    // delete two-side empty space 
    //var result = nodejieba.cut(sentence2sc.trim());
   // convert to trandition Chinese
    //for(i=0;i<result.length;i++){
    //    result[i] = chineseConv.tify(result[i]);
    //}
	
    //result.push(sentence.trim());
    //result = result.filter(function(element, index, arr){
    //    return arr.indexOf(element) === index;
    //});
    console.log('收到數據===>', sentence);  // original sentence
    
    if(movie_request)
    {
        movie_request = false;
        youtubeAuth.search(response, sentence);
    }

    // else if(alarm_request)
    // {
    //     alarm_request = false;
    //     console.log('傳送數據===>', '打開你的clock囉');  // original sentence
    //     response.send({'memo': '打開你的clock囉'});
    //     response.end();
    // }

    // else if(memo_request)
    // {
    //     memo_request = false;
    //     console.log('傳送數據===>', '打開你的memo囉');  // original sentence
    //     response.send({'memo': '打開你的memo囉'});
    //     response.end();
    // }

    else
    {
        console.log('傳送數據===>', sentence);  // original sentence
        response.send({'sentence':sentence});  // after cut , it's array 
        response.end();
    }
});

Array.prototype.contains = function ( needle ) {
    for (i in this) 
    {
        if (this[i] == needle) return true;
    }
    return false;
 }

app.listen(8081);
console.log('start server 8081...');

