var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// set up a mongoose model
var UserSchema = new Schema({
  name: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    }
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// // method to compare a given password with the database hash
// UserSchema.methods.comparePassword = function(password) {
//     var user = this;
//     return bcrypt.compareSync(password, user.password);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);
