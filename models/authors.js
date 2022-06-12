const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const validator = require('validator');

const AuthorsSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    username: {type:String,
        validate:{
              validator: validator.isEmail,
              message: '{VALUE} is not a valid email',
              isAsync: false
            },
        required: true },
    password: { type: String, required: true },
    confirm_password: { type: String},
  },{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Virtual for author's full name
/*AuthorsSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
const fullname = '';
  if (this.first_name && this.last_name) {
    fullname = this.last_name + ', ' + this.last_name
  }
  if (!this.first_name || !this.last_name) {
    fullname = '';
  }
  return fullname;
});*/


// Virtual for author's URL
AuthorsSchema
.virtual('url')
.get(function () {
  return '/authors/' + this._id;
});

//Export model
module.exports = mongoose.model('Authors', AuthorsSchema);