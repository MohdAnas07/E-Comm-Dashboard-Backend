const express = require('express')
const mongoose = require('mongoose')
const app = express();
require('./db/config')
const User = require('./db/User');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    let user = new User(req.body);
    let result = await user.save()
    res.send(result);
})


// app.get('/', async (req, res) => {
//     let data = await User.find();
//     res.send(data);
// })

app.listen(5000);