
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

//Initialize the dataObject module
dataObject.setPool(poolNum);

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/signin', function(req, res){
	res.render('signin');
});

app.get('/create', function(req, res){
	res.render('create');
});


app.get('/index',routes.index);

app.get('/about', function(req, res){
	res.render('about');
});

/*app.get('/index', function(req, res){
	fs.readFile("./public/index.html",function(error,data){
		if(error)
		{
			res.writeHead(404,{"Content-type":"text/plain"});
			res.end("Sorry !! page is unavailable");
		}
		else
		{	
			res.writeHead(200,{"Content-type":"text/html"});
			res.end(data);
		}

	})
		
});*/


app.post('/register', function (req, res) {
	if(!req.body.hasOwnProperty('firstname'))
	{
	
		return res.send('Error : FirstName cannot be empty');
	}
	else if(!req.body.hasOwnProperty('lastname'))
	{
		return res.send('Error : LastName cannot be empty');
	}
	else if(!req.body.hasOwnProperty('location'))
	{
		return res.send('Error : Location cannot be empty');
	}
	else if(!req.body.hasOwnProperty('email'))
	{
		return res.send('Error : Email cannot be empty');
	}
	else if(!req.body.hasOwnProperty('password'))
	{
		return res.send('Error : Password cannot be empty');
	}
	else
	{
		
			var date = new Date();
			var description=null;
			var type=null;
			var orgName=null;
			var ratings=null;
			var price=null;
			
			console.log("date is:"+date.toString());
			objectControl.createUser(req.param('firstname'),req.param('lastname'),req.param('location'),req.param('email'),req.param('password'),(date.toString()),description,
					type,orgName,ratings,price);
			 res.render('display', { title: 'Registeration Successful !! ' ,message: 'SignUp Successful.Please Login to Continue'});		
		
	}

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

app.get('/review', function(req, res){
	res.render('review');
});

app.get('/viewReview', function(req, res){
	
		objectControl.viewReview(function(err,results){
			if(err)
			{
				res.render('display',{ title:
					'Error ' ,message: 'You have not reviewed any thing !'});
			}
			else
			{
				var i;
				res.writeHead(200,{"Content-type":"text/html"});
				res.write("<b> Search results </b> <br/><br/><br/>");
				for(i=0;i<results.length;i++)
				{
					res.write(results[i].firstname+":"+"<br/> Name of the place:"+ results[i].orgName+"<br/> Type:"+ results[i].type+"<br/> Location:"+ 
							results[i].location+"<br/> Description:"+ results[i].description+"<br/> Rating:"+results[i].ratings+"     Price:"+results[i].price +"<br/><br/>");
					
				}
				res.write("<ul><br/><br/><li><a href="+"'"+"/main"+"'"+"><b> Return to main page</b></a></li></ul>");
				res.end();
			}
		},logEmail);
	
});

app.get('/readReview', function(req, res){
	res.render('readReview');
});

app.get('/searchBasedLocation', function(req, res){
	res.render('searchBasedLocation');
});

app.get('/searchBasedType', function(req, res){
	res.render('searchBasedType');
});

app.get('/deleteReview', function(req, res){
	res.render('deleteReview');
});

app.get('/updateReview', function(req, res){
	res.render('updateReview');
});

app.get('/main', function(req, res){
	
	if(logEmail!=null)
		{
			res.render('main',{ title:
				'Yelp Home !! ' ,message: "Welcome"});
		}
	else
		{
			res.render('index');
		}
});

app.post('/writeReview', function(req, res){
	if(!req.body.hasOwnProperty('firstname'))
	{
		console.log('first name id is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Please enter your first name'});
	}
	else if(!req.body.hasOwnProperty('lastname'))
	{
		console.log('last name is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Please enter your last name'});
	}
	else if(!req.body.hasOwnProperty('type'))
	{
		console.log('Type is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Please select a type'});
	}
	else if(!req.body.hasOwnProperty('orgName'))
	{
		console.log('Organization name is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Organization name is missing'});
	}
	else if(!req.body.hasOwnProperty('description'))
	{
		console.log('Review description is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Review section was empty'});
	}
	else if(!req.body.hasOwnProperty('value1'))
	{
		console.log('Type is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Price rating was missing'});
	}
	else
	{
		var sel = req.param('type');
	    var ratings = req.param('value1');
	    var rprice = req.param('price');
	    
	    objectControl.updateReview(logEmail,req.param('location'),sel,req.param('orgName'),req.param('description'),ratings,rprice);
		res.render('display', { title: ' Review Successful !! ' ,message: 'Review was succesfully entered'});		
		

	}
});

app.post('/searchRating', function(req, res){
	
	if(!req.body.hasOwnProperty('rating'))
	{
		console.log('Price rating is Missing');
		res.render('display',{ title:
			'Error !! ' ,message: 'Please enter price rating'});
	}
	
	else
	{
		objectControl.searchWithPrice(function(err,results){
			if(err)
			{
				res.render('display',{ title:
					'Error ' ,message: 'No search results found'});
			}
			else
			{
				var i;
				res.writeHead(200,{"Content-type":"text/html"});
				res.write("<b> Search results </b> <br/><br/><br/>");
				for(i=0;i<results.length;i++)
				{
					res.write(results[i].firstname+":"+"<br/> Name of the place:"+ results[i].orgName+"<br/> Type:"+ results[i].type+"<br/> Location:"+ 
							results[i].location+"<br/> Description:"+ results[i].description+"<br/> Rating:"+results[i].ratings+"     Price:"+results[i].price +"<br/><br/>");
					
				}
				res.write("<ul><br/><br/><li><a href="+"'"+"/main"+"'"+"><b> Return to main page</b></a></li></ul>");
				res.end();
			}
		},req.param('rating'));
	}
});

app.post('/searchLocation', function(req, res){
	console.log(req.param('location'));

	if(!req.body.hasOwnProperty('location'))
	{
		console.log('Location is Missing');
		res.render('display',{ title:
			'Error !! ' ,message: 'Please enter location'});
	}
	
	else
	{
		console.log(req.param('location'));
		objectControl.searchWithLocation(function(err,results){
			if(err)
			{
				res.render('display',{ title:
					'Error ' ,message: 'No search results found'});
			}
			else
			{
				var i;
				res.writeHead(200,{"Content-type":"text/html"});
				res.write("<b> Search results </b> <br/><br/><br/>");
				for(i=0;i<results.length;i++)
				{
					res.write(results[i].firstname+":"+"<br/> Name of the place:"+ results[i].orgName+"<br/> Type:"+ results[i].type+"<br/> Location:"+ 
							results[i].location+"<br/> Description:"+ results[i].description+"<br/> Rating:"+results[i].ratings+"     Price:"+results[i].price +"<br/><br/>");
					
				}
				res.write("<ul><br/><br/><li><a href="+"'"+"/main"+"'"+"><b> Return to main page</b></a></li></ul>");
				res.end();
			}
		},req.param('location'));
	}
});

app.post('/searchType', function(req, res){
	if(!req.body.hasOwnProperty('type'))
	{
		console.log('Selection type is Missing');
		res.render('display',{ title:
			'Error !! ' ,message: 'Please enter a valid selection type'});
	}
	
	else
	{
		console.log(req.param('type'));
		objectControl.searchWithType(function(err,results){
			if(err)
			{
				res.render('display',{ title:
					'Error ' ,message: 'No search results found'});
			}
			else
			{
				var i;
				res.writeHead(200,{"Content-type":"text/html"});
				res.write("<b> Search results </b> <br/><br/><br/>");
				for(i=0;i<results.length;i++)
				{
					res.write(results[i].firstname+":"+"<br/> Name of the place:"+ results[i].orgName+"<br/> Type:"+ results[i].type+"<br/> Location:"+ 
							results[i].location+"<br/> Description:"+ results[i].description+"<br/> Rating:"+results[i].ratings+"     Price:"+results[i].price +"<br/><br/>");
					
				}
				res.write("<ul><br/><br/><li><a href="+"'"+"/main"+"'"+"><b> Return to main page</b></a></li></ul>");
				res.end();
			}
		},req.param('type'));
	}
});

app.post('/updateOrgReview', function(req, res){
  if(!req.body.hasOwnProperty('type'))
	{
		console.log('Type is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Please select a type'});
	}
	else if(!req.body.hasOwnProperty('orgName'))
	{
		console.log('Organization name is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Organization name is missing'});
	}
	else if(!req.body.hasOwnProperty('description'))
	{
		console.log('Review description is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Review section was empty'});
	}
	else if(!req.body.hasOwnProperty('value1'))
	{
		console.log('Type is Missing');
		res.render('display',{ title:
			'Error ' ,message: 'Price rating was missing'});
	}
	else
	{
		var sel = req.param('type');
	    var ratings = req.param('value1');
	    var rprice = req.param('price');
	    
	    objectControl.updateOrgReview(logEmail,sel,req.param('orgName'),req.param('description'),ratings,rprice);
		res.render('display', { title: ' Review updated !! ' ,message: 'Review was succesfully updated'});		
		

	}
});

app.get('/logout', function(req,res){
	logEmail=null;
	res.render('display', { title: ' Logged out ' ,message: 'Successfully logged out '});
});

app.post('/delete', function(req, res){
	objectControl.deleteOldReview(logEmail);
	res.render('display', { title: 'Delete page ' ,message: 'Deleted previous review'});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
