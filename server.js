var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    cloudinary = require('cloudinary'),
    multer = require('multer'),
    jwt = require('jsonwebtoken'),
    Users = require('./models/users'),
    Products = require('./models/products');

mongoose.connect('mongodb://ibarteruser:ibarterpass@ds161175.mlab.com:61175/ibarter_db');

var filesUploaded = [];
var app = express();
var secureRoutes = express.Router();

app.set('port', (process.env.PORT || 5000));

app.set('superSecret', 'iloverobots'); // secret variable


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/secured', secureRoutes);

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




app.get('/', function(req, res) {
    res.send('Please use api/users');
})

app.post('/api/authenticate', function(req, res) {
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

app.post('/api/users', function(req, res) {
    Users.addUser(req.body, function(err, user) {
        if (err) {
            throw err;
        }
        res.send(user);
    });
});


secureRoutes.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, HEAD, POST, PUT, OPTIONS, TRACE");
    next();
})

/*
secureRoutes.use(function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    } else {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log(req.headers['x-access-token']);
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
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
    }
});*/


secureRoutes.get('/users', function(req, res) {
    Users.getUsers(function(err, users) {
        if (err) {
            throw err;
        }
        res.send(users);
    });
});



secureRoutes.get('/users/:_id', function(req, res) {
    Users.getUsersById(req.params._id, function(err, user) {
        if (err) {
            throw err;
        }
        res.send(user);
    });
});

secureRoutes.put('/users', function(req, res) {
    Users.updateUser(req.body, {}, function(err, user) {
        if (err) {
            throw err;
        }
        res.send(user);
    });
});

secureRoutes.delete('/users/:_id', function(req, res) {
    Users.deleteUser(req.params._id, function(err, user) {
        if (err) {
            throw err;
        }
        res.send(user);
    });
});

secureRoutes.get('/latestProducts/:limit', function(req, res) {
    Products.getLatestProducts(req.params.limit, function(err, products) {
        if (err) {
            throw err;
        }
        res.send(products);
    });
});

secureRoutes.get('/testData', function(req, res) {
    var page = parseInt(req.query.page),
        size = parseInt(req.query.size),
        skip = page > 0 ? ((page - 1) * size) : 0;

    Products.testFn(skip, size, function(err, products) {
        if (err) {
            throw err;
        }
        res.send(products);
    });
});

secureRoutes.get('/products', function(req, res) {
    Products.getProducts(function(err, products) {
        if (err) {
            throw err;
        }
        res.send(products);
    });
});

secureRoutes.get('/products/category/:category/:page/:psize', function(req, res) {
    var page = parseInt(req.params.page),
        size = parseInt(req.params.psize),
        skip = page > 0 ? ((page - 1) * size) : 0;
    Products.getProductsByCategory(req.params.category, skip, size, function(err, products) {
        if (err) {
            throw err;
        }
        res.send(products);
    });
});

secureRoutes.get('/products/:_id', function(req, res) {
    Products.getProductById(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

secureRoutes.post('/products', function(req, res) {
    Products.addProduct(req.body, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

secureRoutes.get('/products/:_id', function(req, res) {
    Products.getProductById(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

secureRoutes.put('/products', function(req, res) {
    Products.updateProduct(req.body, {}, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

secureRoutes.put('/updateImages', function(req, res) {
    Products.updateImages(req.body, {}, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

secureRoutes.delete('/products/:_id', function(req, res) {
    Products.removeProduct(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

var upload = multer({ //multer settings
    storage: storage
});

secureRoutes.post('/uploadImages', upload.single('file'), function(req, res) {
    res.send(req.file);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});