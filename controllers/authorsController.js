const Authors = require('../models/authors');
const bcrypt = require("bcryptjs");
//const passphrase =  process.env.PASSPHRASE;
//const config = require('../config')
const { body, check, validationResult} = require('express-validator');


exports.authors_create_post = [
  

    // Validate and sanitize fields.
    body('first_name', 'First name must not be empty.').isString(),
    body('last_name', 'Last Name must not be empty.').isString(),
    body('username', 'Username must not be empty').isEmail(),
    body('password', 'Password must not be empty').isString(),
    body('confirm_password', 'Must confirm password').isString(),

    check('password').exists(),
    check(
        'confirm_password',
        'Field must have the same value as the password field',
    )
        .exists()
        .custom((value, { req }) => value === req.body.password),

    // Process request after validation and sanitization.
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            return res.status(400).json({ errors: errors.array()  })

        }else{
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if(err){
                return next(err)
            }
            const author = new Authors({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hashedPassword

              }).save((err, newAuthor) => {
                if (err) { 
                  return next(err);
                }
                Authors.findById(newAuthor.id)
                .exec(function (err, author_object) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.json(author_object)
                });
              });
          });

        }
        
    }
];