var router = require('express').Router();
var mongoose = require('mongoose');
var Bike = mongoose.model('Bike');

// return a list of tags
router.get('/', function(req, res, next) {
  Bike.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
