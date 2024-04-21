const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'full-stack-2024';
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const saltRounds = 10;

var host = 'localhost';
if(process.env.NODE_ENV === 'production'){
    host = 'mysql-1'
}

const connection = mysql.createConnection({
    host: 'mysql-1',
    user: 'user',
    password: 'password',
    database: 'db'
  });

router.post('/register', [
    body('email').isEmail().withMessage('Error format email'),
    body('fname').isLength({ min : 3 }),
    body('lname').isLength({ min : 3 }),
    body('password').matches(/^(?=.*[A-Za-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).withMessage('Password must contain at least one letter, one special character, and be at least 6 characters long'),
], 
    function (req, res, next) {
    const { email, password, fname, lname } = req.body;
    connection.query(
        'SELECT * FROM `user` WHERE `email` = ?',
        [email],
        function(err, user) {
            if(user.length > 0){
                res.status((409)).json({ message: 'User with this email already exists' });
            }else{
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.errors.map((v) => {
                        return { 
                            field: v.path,
                            message: v.msg
                        }
                    })});
                }
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    connection.execute(
                    'INSERT INTO `user`(`email`, `password`, `fname`, `lname`) VALUES (?, ?, ?, ?)',
                    [email, hash, fname, lname],
                        function(err, results) {
                            if(!err){
                                res.status((200)).json(req.body);
                            }
                        }
                    );
                });
            }
        }
    );
});
  
router.post('/login', [
    body('email').isEmail().withMessage('Error format email'),
    body('password').matches(/^(?=.*[A-Za-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).withMessage('Password must contain at least one letter, one special character, and be at least 6 characters long')
], 
    function (req, res, next) {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors.map((v) => {
            return { 
                field: v.path,
                message: v.msg
            }
        })});
    }
    connection.query(
        'SELECT * FROM `user` WHERE `email` = ?',
        [email],
        function(err, user) {
            if(user.length > 0){
                bcrypt.compare(password, user[0].password, function(err, isLogin) {
                if(isLogin){
                    var token = jwt.sign({ email: user[0].email }, secret, { expiresIn: '1h' });
                    user[0].token = token;
                    res.json({ status: 200, message: 'success', user: user[0] });
                }else{
                    res.status(500).json({ status: 500, message: 'err user' });
                }
            });
            }else{
                res.status((204)).json({ status: 204, message: 'no user' });
            }
        }
    );
});

router.get('/users', function (req, res, next) {
    const { skip, limit } = req.query;
    let query = 'SELECT * FROM user';
    if (skip && limit) {
        query += ` ORDER BY id DESC LIMIT ${parseInt(skip)}, ${parseInt(limit)}`;
    }
    connection.query(query,
        function(err, results, fields) {
            if(err){
                res.json(err);
            }else{
                res.status(200).json(results.map((v) => {
                    return { 
                        id: v.id,
                        email: v.email,
                        fname: v.fname,
                        lname: v.lname
                    }
                }));
            }
        }
    );
});

router.delete('/users/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
      'DELETE FROM `user` WHERE id = ?',
      [id],
      function(err, results) {
        let query = 'SELECT * FROM user';
        query += ' ORDER BY id DESC LIMIT 0, 5';
        connection.query(query,
          function(err, results, fields) {
              res.json(results);
          }
      );
      }
    );
});

module.exports = router;