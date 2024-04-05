const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'full-stack-2024';
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var host = 'localhost';
if(process.env.NODE_ENV === 'production'){
  host = 'mysql-server'
}

const connection = mysql.createConnection({
    host,
    user: 'root',
    password: 'p@ssw0rd',
    database: 'travel'
  });


router.post('/register', function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
        'INSERT INTO `user`(`email`, `password`, `fname`, `lname`) VALUES (?, ?, ?, ?)',
        [req.body.email, hash, req.body.fname, req.body.lname],
        function(err, results) {
            res.json({err});
        }
        );
    });
});
  
router.post('/login', function (req, res, next) {
    connection.query(
        'SELECT * FROM `user` WHERE `email` = ?',
        [req.body.email],
        function(err, user) {
        if(user.length > 0){
            bcrypt.compare(req.body.password, user[0].password, function(err, isLogin) {
            if(isLogin){
                var token = jwt.sign({ email: user[0].email }, secret, { expiresIn: '1h' });
                user[0].token = token;
                res.json({ status: 200, message: 'success', user: user[0] });
            }
            });
        }else{
            res.json({});
        }
        }
    );
});

module.exports = router;