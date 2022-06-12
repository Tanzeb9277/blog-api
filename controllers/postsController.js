const Posts = require('../models/posts');
const { body, check, validationResult} = require('express-validator');
const async = require('async');
const Authors = require('../models/authors');
const Comments = require('../models/comments')



exports.posts_list = function(req, res, next) {

  Posts.find()
    .sort({date : -1})
    .populate('author','first_name last_name -_id ')
    .exec(function (err, list_posts) {
      if (err) { return next(err); }
      //Successful, so render
      res.json({ posts_list: list_posts });
    });

};

exports.post_get = function(req, res, next) {

  async.parallel({
    current_post: function(callback) {
      Posts.findById(req.params.postid)
      .populate('author','first_name last_name -_id ')
      .exec(callback)
    },
    comments_list: function(callback) {
      Comments.find({ 'post': req.params.postid })
      .sort({date : -1})
      .exec(callback)
    },
}, function(err, results) {
    if (err) { return next(err); } // Error in API usage.
    if (results.current_post==null) { // No results.
        var err = new Error('Post not found');
        err.status = 404;
        return res.status(404).json({ errors: err });
    }
    // Successful, so render.
    res.json({ post: results.current_post, comments: results.comments_list});
});

};



exports.posts_create_post = [
  

    // Validate and sanitize fields.
    body('author', 'author must not be empty').isString(),
    body('title', 'Message must not be empty.').isString(),
    body('text', 'Message must not be empty.').isString(),
    body('imgUrl', 'Image url must not be empty').isString(),


    // Process request after validation and sanitization.
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            return res.status(400).json({ errors: errors.array()  });
        }else{
            const posts = new Posts({
                author: req.body.author,
                title: req.body.title,
                date: new Date(),
                text: req.body.text,
                imgUrl: req.body.imgUrl,
              }).save((err, newPost) => {
                if (err) { 
                  return next(err);
                }
                async.parallel({
                  post_author: function(callback) {
                    Authors.findById(newPost.author)
                    .exec(callback)
                  },
                  comments_list: function(callback) {
                    Comments.find({ 'post': req.params.id },'title summary')
                    .exec(callback)
                  },
              }, function(err, results) {
                  if (err) { return next(err); } // Error in API usage.
                  if (results.post_author==null) { // No results.
                      var err = new Error('Author not found');
                      err.status = 404;
                      return res.status(404).json({ errors: err });
                  }
                  // Successful, so render.
                  res.json({postAuthor: results.post_author, post: newPost, comments: results.comments_list});
              });
              });

        }
        
    }
];

