var restful = require('node-restful');
var mongoose = restful.mongoose;


var productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [String],
    tags: [String],
    createdOn: { type: Date, default: Date.now },
    itemLocation: String,
    categoryId: Number,
    addedByUserId: Number
});

module.exports = restful.model('products', productSchema);
