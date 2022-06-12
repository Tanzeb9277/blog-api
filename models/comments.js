const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const CommentsScheme = new Schema(
    {   post: {type: Schema.Types.ObjectId, ref: 'Posts', required: true},
        date: {type: Date, required: true},
        text: {type: String, required: true },

    },{
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

CommentsScheme
.virtual('date_formatted')
.get(function () {

  const month = this.date.getMonth()
  const year = this.date.getFullYear();
  const date = this.date.getDate();
  return months[month] + " "+ date + ", " + year;
});


module.exports = mongoose.model('Comments', CommentsScheme);