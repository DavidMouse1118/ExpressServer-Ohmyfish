// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Operationlog Schema.
var Operationlog = new Schema({
    username: {type: String, required: true},
    Phone: {type: Number, required: true},
    created_at: {type: Date, default: Date.now},
    finished_at: {type: Date, default: Date.now},
    vesselName: {type: String, required: true},
    vesselDetails: {type: String, required: true},
    dealorInfo: {type: String},
    vesseloperator:{type: String, required: true},
    fishName: {type: String, required: true},
    fishTotalWeight: {type: Number, required: true},
    fishCount: {type: Number, required: true},
    fishAppxWeight: {type: String, required: true},
    fishAppxLength: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    userId: {type: String, required: true}
});

// Sets the created_at parameter equal to the current time
Operationlog.pre('save', function(next){
    now = new Date();
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

Operationlog.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere.
module.exports = mongoose.model('Operationlog', Operationlog);
