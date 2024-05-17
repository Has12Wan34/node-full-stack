const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const verifyToken = require('../middleware/authMiddleware');

var host = 'localhost';
if(process.env.NODE_ENV === 'production'){
  host = 'mysql-1'
}

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'user',
  password: 'password',
  database: 'db'
});

router.get('/travels', verifyToken, function (req, res, next) {
    const { skip, limit } = req.query;
    let query = 'SELECT * FROM attractions';
    if (skip && limit) {
        query += ` ORDER BY id DESC LIMIT ${parseInt(skip)}, ${parseInt(limit)}`;
    }
    connection.query(query,
        function(err, results, fields) {
            res.json(results);
        }
    );
});

router.get('/travels/search', function (req, res) {
  const { name } = req.query;
  let query = 'SELECT * FROM attractions';
  if (name) {
      query += ` WHERE name LIKE '%${name}%'`;
  }else{
    query += ' ORDER BY id DESC LIMIT 0, 5';
  }
  connection.query(query, (err, rows) => {
      if (err) {
          console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล:', err);
          res.status(500).json({ message: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล' });
          return;
      }
      res.json(rows);
  });
});

router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `attractions` WHERE `id` = ?',
    [id],
    function(err, results) {
      res.json(results[0]);
    }
  );
});

router.post('/travel', function (req, res, next) {
  connection.query(
    'INSERT INTO `attractions`(`name`, `detail`, `coverimage`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?)',
    [req.body.name, req.body.detail, req.body.coverimage, req.body.latitude, req.body.longitude],
    function(err, results) {
      connection.query(
        'SELECT * FROM `attractions` WHERE id = LAST_INSERT_ID()',
        function(err, results) {
          res.json(results[0]); // ส่งกลับข้อมูลที่ถูกเพิ่มล่าสุดเป็น Object อันเดียว
        }
      );
    }
  );
});

router.put('/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'UPDATE `attractions` SET `name`= ?, `detail`= ?, `coverimage`= ?, `latitude`= ?, `longitude`= ? WHERE id = ?',
    [req.body.name, req.body.detail, req.body.coverimage, req.body.latitude, req.body.longitude, id],
    function(err, results) {
      connection.query(
        'SELECT * FROM `attractions` WHERE `id` = ?',
        [id],
        function(err, results) {
          res.json(results[0]);
        }
      );
    }
  );
});

router.delete('/travel/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'DELETE FROM `attractions` WHERE id = ?',
    [id],
    function(err, results) {
      let query = 'SELECT * FROM attractions';
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