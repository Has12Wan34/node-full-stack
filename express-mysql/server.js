var express = require('express');
var cors = require('cors');
var app = express();

const userRouter = require('./routes/user');
const travelRouter = require('./routes/travel');
const productRouter = require('./routes/product');

app.use(cors())
app.use(express.json())
app.use('/api/user', userRouter);
app.use('/api/travel', travelRouter);
app.use('/api/product', productRouter);

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 80')
})