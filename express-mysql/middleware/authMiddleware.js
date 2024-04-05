const jwt = require('jsonwebtoken');
const secret = 'full-stack-2024';
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'p@ssw0rd',
    database: 'travel'
  });

function verifyToken(req, res, next) {
    let token = req.header('Authorization');

    if(!token)
     return res.status(401).json({ error: 'Access denied' });

    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.email = decoded.email; 
        next();
    } catch (error) {
        res.status(401).json({ error: token });
    }
 };

module.exports = verifyToken;