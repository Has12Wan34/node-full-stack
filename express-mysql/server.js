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

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/api/travels', cors(), function (req, res, next) {
    const { skip, limit } = req.query;
    let query = 'SELECT * FROM attractions';
    if (skip && limit) {
        query += ` LIMIT ${parseInt(skip)}, ${parseInt(limit)}`;
    }
    connection.query(query,
        function(err, results, fields) {
            res.json(results);
        }
    );
});

app.get('/api/travels/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
      return res.status(400).json({ message: 'กรุณาระบุชื่อที่ต้องการค้นหา' });
  }
  connection.query('SELECT * FROM attractions WHERE name LIKE ?', [`%${name}%`], (err, rows) => {
      if (err) {
          console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล:', err);
          res.status(500).json({ message: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล' });
          return;
      }
      res.json(rows);
  });
});

app.get('/api/travel/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `attractions` WHERE `id` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
});

app.post('/api/travel', function (req, res, next) {
  connection.query(
    'INSERT INTO `attractions`(`name`, `detail`, `coverimage`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?)',
    [req.body.name, req.body.detail, req.body.coverimage, req.body.latitude, req.body.longitude],
    function(err, results) {
      res.json(results);
    }
  );
});

app.put('/api/travel/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'UPDATE `attractions` SET `name`= ?, `detail`= ?, `coverimage`= ?, `latitude`= ?, `longitude`= ? WHERE id = ?',
    [req.body.name, req.body.detail, req.body.coverimage, req.body.latitude, req.body.longitude, id],
    function(err, results) {
      res.json(results);
    }
  );
});

app.delete('/api/travel/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'DELETE FROM `attractions` WHERE id = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 80')
})