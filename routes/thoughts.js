var express = require('express');
var models = require('../models');
var router = express.Router();

/* GET thoughts data. */
router.get('/:id', function (req, res, next) {
  models.Thoughts.findOne({ id: req.params.id }, function (error, thoughtDoc) {
    res.json({ thought: thoughtDoc });
  });
});

router.get('/', function (req, res, next) {
  models.Sessions.findOne({ cookieIDStr: req.cookies.cookieIDStr }, function (error, sessionDoc) {
    models.Thoughts.find({ userId: sessionDoc.userId }, function (error, thoughtDocs) {
      res.json({ thoughts: thoughtDocs });
    });
  })
});

router.post('/', function (req, res, next) {
  var thoughtDoc = new models.Thoughts({
    content: req.body.content,
  });

  models.Sessions.findOne({ cookieIDStr: req.cookies.cookieIDStr }, function (error, currentSessionDoc) {
    thoughtDoc.userId = currentSessionDoc.userId;
    thoughtDoc.save(function (err) {
      res.json({ thought: thoughtDoc });
    });
  });
});

module.exports = router;
