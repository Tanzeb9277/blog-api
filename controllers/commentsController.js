const { body, check, validationResult} = require('express-validator');
const async = require('async');
const Comments = require('../models/comments');
const Posts = require('../models/posts');




exports.comments_create_post = [
  

    // Validate and sanitize fields.
    body('text', 'Message must not be empty.').isString(),


    // Process request after validation and sanitization.
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            return res.status(400).json({ errors: errors.array()  });
        }else{
            const comments = new Comments({
                post: req.params.postid,
                date: new Date(),
                text: req.body.text
              }).save((err, newComment) => {
                if (err) { 
                  return next(err);
                }
                async.parallel({
                  current_post: function(callback) {
                    Posts.findById(req.params.postid)
                    .exec(callback)
                  },
                  comments_list: function(callback) {
                    Comments.find({ 'post': req.params.postid },'text date')
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
                  res.redirect(`https://tanzeb9277.github.io/blog-app${results.current_post.url}`)
              });
              });

        }
        
    }
];