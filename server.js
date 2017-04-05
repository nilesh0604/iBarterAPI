var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    cloudinary = require('cloudinary'),
    multer = require('multer'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    Users = require('./models/users');

mongoose.connect('mongodb://ibarteruser:ibarterpass@ds161175.mlab.com:61175/ibarter_db');

var filesUploaded = [];
var app = express();

app.set('port', (process.env.PORT || 5000));

app.set('superSecret', 'iloverobots'); // secret variable

app.use(passport.initialize());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

cloudinary.config({
    cloud_name: 'dieb168xm',
    api_key: '516843484312932',
    api_secret: 'PUjVqhgaZfRjWcW5CxoKHRCSphc'
});


var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads',
    allowedFormats: ['jpg'],
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp);
        filesUploaded.push(datetimestamp.toString() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, HEAD, POST, PUT, OPTIONS, TRACE");
    next();
});

//app.use('/api', require('./routes/api'));

var apiRoutes = express.Router();

app.get('/', function(req, res) {
    res.send('Please use api/users');
})

apiRoutes.post('/authenticate', function(req, res) {
    Users.authenticate(req.body, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                user.password = "********";
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    user: user
                });
            }
        }
    });
});


apiRoutes.get('/users', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                Users.getUsers(function(err, users) {
                    if (err) {
                        throw err;
                    }
                    res.send(users);
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

apiRoutes.get('/users/:_id', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                Users.getUsersById(req.params._id, function(err, user) {
                    if (err) {
                        throw err;
                    }
                    res.send(user);
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

apiRoutes.post('/users', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                Users.addUser(req.body, function(err, user) {
                    if (err) {
                        throw err;
                    }
                    res.send(user);
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

apiRoutes.put('/users', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                Users.updateUser(req.body, {}, function(err, user) {
                    if (err) {
                        throw err;
                    }
                    res.send(user);
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

apiRoutes.delete('/users/:_id', function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                Users.deleteUser(req.params._id, function(err, user) {
                    if (err) {
                        throw err;
                    }
                    res.send(user);
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});







var upload = multer({ //multer settings
    storage: storage
});

app.post('/api/uploadImages', upload.single('file'), function(req, res) {
    res.send(req.file);
});

app.use('/api', apiRoutes);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});