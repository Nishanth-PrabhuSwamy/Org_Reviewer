/**
 * New node file
 */
//Control center for database actions.
//Depends on the dataPool module to obtain a connection and return after usage.

var mysql=require('mysql');
var dataPool=require('../routes/dataPool');

function connect()
{
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'nishanth',
		port: '3306',
		database: 'yelp'
	});

	connection.connect();

	return connection;
}

function createUser(firstname,lastname,location,email,password,time,description,type,orgName,ratings,price)
{
	var connection = dataPool.getConnection();
	//var connection=connect();

	var query = "INSERT INTO users VALUES('" + firstname + "','" +lastname + "','" + location + "','" + email + "','" + password + "','" + time +"','" + description + "','" + type +
	 "','" + orgName +  "','" + ratings +  "','" + price + "')";
	console.log(query); 
	connection.query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
	//connection.end();
	dataPool.returnConnection(connection);
}

function validateEmailPassword(callback,email,password)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "SELECT * from users where email='" + email +  "'AND password='" + password + "'";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				// Updating the last log in time
				var d=new Date();
				var curTime=d.toString();
				var query = "UPDATE users SET time="+"'"+curTime+"'"+" WHERE email="+"'"+email+"'";
				connection.query(query,function(err){
						if (err) 
					{
						console.log("ERROR: " + err.message);
					}
					else
					{
						console.log("Log in Time updated");
					}

				});

				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});


	//connection.end();
	dataPool.returnConnection(connection);
}

function updateReview(email,location,type,orgName,description,ratings,price)
{
	var connection = dataPool.getConnection();

	var query = " UPDATE users SET description="+"'"+description+"'" + "," +"location =" + "'"+location +"'"+  "," +" type =" + "'"+type+ "'" + "," + " orgName =" + "'"+orgName+ "'"+ "," +" ratings =" + "'"+ratings+ "'"+ "," +" price =" + "'"+price+ "'"+" WHERE email="+ "'"+email+ "'";

	connection.query(query,function(err){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			console.log("Values updated");
		}

	});
	dataPool.returnConnection(connection);
}
function searchWithPrice(callback,rating){
	var connection = dataPool.getConnection();

	var query = "SELECT * from users where price='" +rating+"'";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
	dataPool.returnConnection(connection);
}

function searchWithLocation(callback,location){
	var connection = dataPool.getConnection();
	console.log(location);

	var query = "SELECT * from users where location="+"'"+location+"'"+"AND ratings IS NOT NULl";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
	dataPool.returnConnection(connection);
}


function searchWithType(callback,type){
	var connection = dataPool.getConnection();

	var query = "SELECT * from users where type="+"'"+type+"'"+"AND ratings IS NOT NULl";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
	dataPool.returnConnection(connection);
}

function deleteOldReview(email){

var connection = dataPool.getConnection();

	var query = "UPDATE users SET description =NULL, type=NULL, orgName=NULL, ratings =NULL, price=NULL WHERE email ="+"'"+email+"'";

	connection.query(query,function(err){
		if (err)
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			console.log("Review deleted");
		}

	});
	dataPool.returnConnection(connection);
}

function updateOrgReview(email,type,orgName,description,ratings,price)
{
	var connection = dataPool.getConnection();
	var query = " UPDATE users SET description="+"'"+description+"'" + "," +" type =" + "'"+type+ "'" + "," + " orgName =" + "'"+orgName+ "'"+ "," +" ratings =" + "'"+ratings+ "'"+ "," +" price =" + "'"+price+ "'"+" WHERE email="+ "'"+email+ "'";

	connection.query(query,function(err){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			console.log("Values updated");
		}

	});
	dataPool.returnConnection(connection);
}
function viewReview(callback,email)
{
	var connection = dataPool.getConnection();

	var query = "SELECT * from users where email="+"'"+email+"'"+"AND ratings IS NOT NULl";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
	dataPool.returnConnection(connection);
}

exports.createUser = createUser;
exports.validateEmailPassword = validateEmailPassword;
exports.updateReview = updateReview;
exports.searchWithPrice=searchWithPrice;
exports.searchWithLocation=searchWithLocation;
exports.searchWithType=searchWithType;
exports.deleteOldReview = deleteOldReview;
exports.updateOrgReview = updateOrgReview;
exports.viewReview=viewReview;
