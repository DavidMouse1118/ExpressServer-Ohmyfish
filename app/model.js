// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
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
    fishTotalWeight: {type: String, required: true},
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

// Indexes this schema in 2dsphere format (critical for running proximity searches)
Operationlog.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports = mongoose.model('Operationlog', Operationlog);
