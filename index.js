const express = require('express')
const mongoose = require('mongoose')
const Jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY || 'e-comm';


const app = express();

require('./db/config')

const User = require('./db/User');
const Product = require('./db/Product');

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    let user = new User(req.body);
    user = await user.save()
    user = user.toObject();
    delete user.password;
    Jwt.sign({ user }, jwtKey, (err, token) => {
        if (err) {
            res.send({ result: 'something went wrong' });
        } else {
            res.send({ user, auth: token });
        }
    })
})

app.post('/login', async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select('-password')
        if (user) {
            Jwt.sign({ user }, jwtKey, (err, token) => {
                if (err) {
                    res.send({ result: 'something went wrong' });
                } else {
                    res.send({ user, auth: token });
                }
            })
        } else {
            res.send({ result: 'No user found' });
        }
    } else {
        res.send({ result: 'No user found' });
    }
})

app.post('/add-product', async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();

    res.send(result)

})

app.get('/products', async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: 'no products found' });
    }
})


app.delete('/product/:id', async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result)
})

app.get('/product/:id', async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id })
    console.log(result);
    if (result) {
        res.send(result);
    } else {
        res.send(result)
    }
})

app.put('/product/:id', async (req, res) => {
    let result = await Product.update(
        { _id: req.params.id },
        { $set: req.body }
    )
    res.send(result);
})

app.get('/search/:key', async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
        ]
    })
    res.send(result)
})


function verifyToken(req, res, callback) {
    let token = req.headers['authorization'];
    token = token.split(' ')[1];
    console.log("token:", token);
    if (token) {
        callback()
    }
    else {
        res.send({ result: "something went wrong" })
    }
};


app.listen(5000);