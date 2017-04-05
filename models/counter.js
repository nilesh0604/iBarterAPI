var restful = require('node-restful');
var mongoose = restful.mongoose;
var NumberInt = require('mongoose-int32');


var counterSchema = new mongoose.Schema({
    _id: String,
    sequence_value: Number
});

var Counters = module.exports = restful.model('counters', counterSchema);

/*function getNextSequenceValue(sequenceName) {
    var sequenceDocument = db.counters.findAndModify({
        query: { _id: sequenceName },
        update: { $inc: { sequence_value: 1 } },
        new: true
    });
    return sequenceDocument.sequence_value;
}*/

/*module.exports.getNextSequenceValue = function(sequenceName) {
    var sequenceDocument = Counters.findOneAndUpdate({_id: sequenceName}, {"$inc" : {sequence_value : new NumberInt(1)}}, {new: true});
    return sequenceDocument.sequence_value;
};*/

module.exports.getNextSequenceValue = function(sequenceName) {
    var query = { _id: sequenceName };
    var update = {"$inc" : {sequence_value : 1}};
    var options = {new: true};
    return Counters.find(query, function(err, data){
      return data
    });
};