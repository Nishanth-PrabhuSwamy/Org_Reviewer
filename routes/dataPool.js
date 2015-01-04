/**
 * New node file
 */
//Connection pooling module. Uses a simple queue for maintaining a pool of connections.
var mysql = require('mysql');
var connectionPool = [];
var count=0;

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

function setPool(numOfConn)
{
	count=numOfConn;
	for (var i = 0; i < numOfConn; i++)
	{
		connectionPool[i]=(connect());
	}
}

function getConnection()
{
	if((connectionPool.length >=1 ) && (count>=0 ))
	{
		count--;
		return connectionPool[count];
		
	}
}

function returnConnection(connection)
{
	
	count++;
	connectionPool[count]=connectionPool[connection];
	
}

exports.setPool = setPool;
exports.getConnection = getConnection;
exports.returnConnection = returnConnection;
