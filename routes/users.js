var express = require('express');
var router = express.Router();
var models = require('../models');
var uuid = require('node-uuid');

router.get('/', function(req, res, next) {
  models.Sessions.findOne({ cookieIDStr: req.cookies.cookieIDStr }, function (error, currentSessionDoc) {
    models.Users.findOne({ _id: currentSessionDoc.userId }, function (error, userDoc) {
      res.json({ user: userDoc });
    });
  });
});

router.post('/', function (req, res, next) {
  // create new user
  var user = new models.Users({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  });

  // create a cookie
  var cookieIDStr = uuid.v4();
  res.cookie('cookieIDStr', cookieIDStr);

  // create new session
  var session = new models.Sessions({
    cookieIDStr: cookieIDStr,
    userId: user._id
  });

  // save user and session to db
  user.save(function (err1) {
    if (err1 !== undefined) {
      console.log('user save err', err1);
    }
    session.save(function (err2) {
      res.redirect(303, '/');
      // return true;
    });
  });
});

router.put('/', function(req, res, next) {
  models.Sessions.findOne({ cookieIDStr: req.cookies.cookieIDStr }, function (error, currentSessionDoc) {
    models.Users.findOne({ _id: currentSessionDoc.userId }, function (error, currentUserDoc) {
      var data = {};
      if (req.body.password !== '') {
        data.password = req.body.password;
      }  else {
        data.password = currentUserDoc.password;
      }
      if (req.body.email !== '') {
        data.email = req.body.email;
      } else {
        data.email = currentUserDoc.email;
      }
      if (req.body.phoneNumber !== '') {
        data.phoneNumber = req.body.phoneNumber;
      } else {
        data.phoneNumber = currentUserDoc.phoneNumber;
      }

      models.Users.findOneAndUpdate(
        { _id: currentSessionDoc.userId },
        data,
        function (error, userDoc) {
          res.json({ user: userDoc });
        }
      );
    });
  });
});

module.exports = router;
