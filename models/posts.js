const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const PostsScheme = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'Authors', required: true},
        title: {type: String, required: true },
        date: {type: Date, required: true},
        text: {type: String, required: true },
        imgUrl: {type: String, required: true},
        published: {type: Boolean, default: true, required: true}

    },{
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

PostsScheme
.virtual('url')
.get(function () {
  return '/posts/' + this._id;
});

PostsScheme
.virtual('delete_url')
.get(function () {
  return '/:authorid/post-delete/' + this._id;
});
PostsScheme
.virtual('publish_url')
.get(function () {
  return '/:authorid/post-publish/' + this._id;
});
PostsScheme
.virtual('unpublish_url')
.get(function () {
  return '/:authorid/post-unpublish/' + this._id;
});

PostsScheme
.virtual('date_formatted')
.get(function () {

  const month = this.date.getMonth()
  const year = this.date.getFullYear();
  const date = this.date.getDate();
  return months[month] + " "+ date + ", " + year;
});



module.exports = mongoose.model('Posts', PostsScheme);