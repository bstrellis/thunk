var express = require('express');
var models = require('../models');
var router = express.Router();

/* GET thoughts data. */
router.get('/', function (req, res, next) {
  models.Images.count().exec(function(err, count){
    var random = Math.floor(Math.random() * count);

    models.Images.findOne().skip(random).exec(
      function (err, imageDoc) {
        res.json({ image: imageDoc });
    });
  });
});

module.exports = router;
