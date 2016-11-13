var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    cloudinary = require('cloudinary'),
    multer = require('multer');

Product = require('./models/products');

mongoose.connect('mongodb://ibarteruser:ibarterpass@ds161175.mlab.com:61175/ibarter_db');


var filesUploaded = [];
var app = express();

app.set('port', (process.env.PORT || 5000));


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
        filesUploaded.push(datetimestamp);
    }
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, HEAD, POST, PUT, OPTIONS, TRACE");
    next();
});

//app.use('/api', require('./routes/api'));

app.get('/', function(req, res) {
    res.send('Please use api/products');
})

app.get('/api/products', function(req, res) {
    Product.getProducts(function(err, products) {
        if (err) {
            throw err;
        }
        res.send(products);
    });
});

app.get('/api/products/:_id', function(req, res) {
    Product.getProductById(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

app.post('/api/products', function(req, res) {
    Product.addProduct(req.body, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

app.get('/api/products/:_id', function(req, res) {
    Product.getProductById(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

app.put('/api/products', function(req, res) {
    Product.updateProduct(req.body, {}, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

app.put('/api/updateImages', function(req, res) {
    Product.updateImages(req.body, {}, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

app.delete('/api/products/:_id', function(req, res) {
    Product.removeProduct(req.params._id, function(err, product) {
        if (err) {
            throw err;
        }
        res.send(product);
    });
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

app.post('/api/uploadImages', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err, filesUploaded });
            filesUploaded = [];
            return;
        }
        res.json({ error_code: 0, err_desc: null, filesUploaded });
        filesUploaded = [];
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
