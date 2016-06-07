var express = require('express');
var router = express.Router();
var models = require('../models');
var uuid = require('node-uuid');

/* GET sessions page. */
router.get('/', function(req, res, next) {
  res.render('empty');
});

router.post('/', function (req, res, next) {
  // authenticate user
  models.Users.findOne({ username: req.body.username }, function (error, currentUserDoc) {
    if (currentUserDoc.password === req.body.password) {
      var cookieIDStr = uuid.v4();
      var session = new models.Sessions({
        cookieIDStr: cookieIDStr,
        userId: currentUserDoc._id
      });
      // save session to db
      res.cookie('cookieIDStr', cookieIDStr);
      session.save(function (err) {
          res.redirect(303, '/');
          // return true;
      });
    } else if (currentUserDoc === undefined){
      console.log('That user is not in our database. Please create an account!');
    } else if (currentUserDoc.password !== req.body.password) {
      console.log('The password entered was incorrect. Please try again.');
    }
  });
});

module.exports = router;
