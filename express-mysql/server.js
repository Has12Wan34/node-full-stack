var express = require('express');
var cors = require('cors');
const axios = require('axios');
var app = express();

const userRouter = require('./routes/user');
const travelRouter = require('./routes/travel');
const productRouter = require('./routes/product');
const messageRouter = require('./routes/message');
const verifyToken = require('./middleware/authMiddleware');
const { body } = require('express-validator');

app.use(cors())
app.use(express.json())
app.use('/api/user', verifyToken, userRouter);
app.use('/api/travel', travelRouter);
app.use('/api/product', productRouter);
app.use('/api/message', messageRouter);

const handleEvents = async (events) => {
  try {
    const body = {
      type: events.message.type,
      text: events.message.text,
      groupId: events.source.groupId,
      userId: events.source.userId
    }
    axios.post('http://localhost:5000/api/message/message', body);
  }
  catch (error) {
    console.error(error);
  }
}

app.post("/webhook", async (req, res) => { 
  try {
    const events = req.body.events;
    return events.length > 0 ? await events.map((item) => handleEvents(item)) : res.status(200).send('ok')
  }
  catch (error) {
    console.error(error);
  }
});

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 80')
})