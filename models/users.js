var restful = require('node-restful');
var mongoose = restful.mongoose;
/*var Counters = require('../models/counter');
var NumberInt = require('mongoose-int32');*/


var userSchema = new mongoose.Schema({
    uid: Number,
    first_name: String,
    last_name: String,
    email: String,
    mobile: String,
    avatar: String,
    username: String,
    password: String,
    admin: String
});


var User = module.exports = restful.model('tripin_users', userSchema);

module.exports.authenticate = function(user, callback) {
    User.findOne({ username: user.username }, callback);
};

module.exports.getUsers = function(callback, limit) {
    User.find(callback).limit(limit);
};

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.addUser = function(user, callback) {
    User.create(user, callback);
};

module.exports.updateUser = function(user, options, callback) {
    var query = { _id: user._id };
    var update = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile
    };
    User.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteUser = function(id, callback) {
    var query = { _id: id };
    User.remove(query, callback);
};

