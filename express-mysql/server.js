var express = require('express')
var cors = require('cors')
var app = express()

// get the client
const mysql = require('mysql2');

var host = 'localhost';
if(process.env.NODE_ENV === 'production'){
  host = 'mysql-server'
}

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'p@ssw0rd',
  database: 'travel'
});

app.get('/products', cors(), function (req, res, next) {
    connection.query(
        'SELECT * FROM attractions',
        function(err, results, fields) {
            res.json(results);
        }
    );
})

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 80')
})