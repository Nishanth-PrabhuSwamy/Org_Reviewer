
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var ejs = require('ejs');
var app = express();
var fs=require("fs");
var mysql=require("mysql");
var logEmail;
//Reading the elements of Config.json file
var config=JSON.parse(fs.readFileSync("config.json"));

//read the port number from JSON file
var port_num=config.port;

var dataObject = require('./routes/dataPool');
var objectControl= require('./routes/ControlCenter.js');

//read the number of connections required for ConnectionPooling
var poolNum=config.pool_Number;

//setting the custom favicon
//app.use(express.favicon(__dirname + '/public/image/favicon.ico'));
app.use(express.favicon(path.join(__dirname, 'public','image','images.ico')));

console.log(__dirname);
// all environments
app.set('port', process.env.PORT || port_num);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/signin', function(req, res){
	res.render('signin');
});

app.post('/afterSignIn', function(req, res){
	if(!req.body.hasOwnProperty('email'))
	{
		console.log('Email id is Missing');
		res.render('display',{ title:
			'Unable to signin !! ' ,message: 'Please enter your email id'});
	}
	else if(!req.body.hasOwnProperty('password'))
	{
		console.log('Password is Missing');
		res.render('display',{ title:
			'Unable to signin !! ' ,message: 'Please enter your password'});
	}
	else
	{
		objectControl.validateEmailPassword(function(err,results){
			if(err)
			{
				res.render('display',{ title:
					'Unable to signin !! ' ,message: 'In-correct Username or Password'});
			}
			else
			{
				//res.render('display',{ title:
				//	'Signed-In !! ' ,message: results[0].firstname});
				logEmail=req.param('email');
				console.log(logEmail);
				res.render('main',{ title:
					logEmail ,message:results[0].time});
			}
		},req.param('email'),req.param('password'));
	}
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
