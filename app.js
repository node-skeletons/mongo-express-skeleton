var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('mongoose').Promise = global.Promise;

var User = require('./models/user');

var app = express();

//Connect Mongoose to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test');

// Define the port to run on
app.set('port', 3000);

//This is how you serve a static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//If you want to serve single file, you have do it like this.
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/pages/login.html'));
});

app.post('/login', function (req, res) {
    var data = req.body;
    User.findOne({email: data.email}, function (err, user) {
        if (err) return res.json({message: 'Login failed.'});
        if (user.password !== data.password) return res.json({message: 'Login failed.'});
        res.json({message: 'Login success. Welcome ' + user.name});
    });
});

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/pages/signup.html'));
});

app.post('/signup', function (req, res) {
    var data = req.body;
    //now the password is not encrypted. You have to encrypt.
    var newUser = new User({
        name: data.name,
        email: data.email,
        password: data.password
    });
    newUser.save().then(function () {
        res.json({message: 'Account created! Please Sign in.'});
    }).catch(function (error) {
        res.json({message: 'Oops! Something went wrong.'});
    });

});

// Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Server running on port ' + port);
});
