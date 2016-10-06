var express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser');


mongoose.connect('mongodb://ibarteruser:ibarterpass@ds161175.mlab.com:61175/ibarter_db');


var openshiftConf = {};

openshiftConf.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
openshiftConf.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if (typeof openshiftConf.ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    openshiftConf.ipaddress = "127.0.0.1";
};

var app =  express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', require('./routes/api'));


app.listen(openshiftConf.port, openshiftConf.ipaddress, function() {
    console.log('%s: Node server server started on %s:%d ...',
    Date(Date.now()), openshiftConf.ipaddress, openshiftConf.port);
});
