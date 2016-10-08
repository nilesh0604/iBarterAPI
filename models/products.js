var restful = require('node-restful');
var mongoose = restful.mongoose;


var productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [String],
    tags: [String],
    createdOn: { type: Date, default: Date.now },
	modifiedOn: { type: Date, default: Date.now },
    itemLocation: String,
    category: String,
    addedByUserId: Number
});

var Product = module.exports = restful.model('Product', productSchema);

module.exports.getProducts = function (callback, limit){
	Product.find(callback).limit(limit);
};

module.exports.getProductById = function (id, callback){
	Product.findById(id, callback);
};

module.exports.addProduct = function (product, callback){
	Product.create(product, callback);
};

module.exports.updateProduct = function (product, options, callback){
	var query = {_id: product._id};
	var update = {
		name: product.name,
		description: product.description,
		price: product.price,
		tags: product.tags,
		itemLocation: product.itemLocation,
		category: product.category,
		modifiedOn: Date.now()
	};
	Product.findOneAndUpdate(query, update, options, callback);
};

module.exports.removeProduct = function (id, callback){
	var query = {_id: id};
	Product.remove(query, callback);
};
