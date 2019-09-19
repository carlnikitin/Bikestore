var router = require('express').Router();
var mongoose = require('mongoose');
var Bike = mongoose.model('Bike');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload bike objects on routes with ':bike'
router.param('bike', function(req, res, next, slug) {
  Bike.findOne({ slug: slug})
    .populate('author')
    .then(function (bike) {
      if (!bike) { return res.sendStatus(404); }

      req.bike = bike;

      return next();
    }).catch(next);
});

router.param('comment', function(req, res, next, id) {
  Comment.findById(id).then(function(comment){
    if(!comment) { return res.sendStatus(404); }

    req.comment = comment;

    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  if( typeof req.query.tag !== 'undefined' ){
    query.tagList = {"$in" : [req.query.tag]};
  }

  Promise.all([
    req.query.author ? User.findOne({username: req.query.author}) : null,
    req.query.favorited ? User.findOne({username: req.query.favorited}) : null
  ]).then(function(results){
    var author = results[0];
    var favoriter = results[1];

    if(author){
      query.author = author._id;
    }

    if(favoriter){
      query._id = {$in: favoriter.favorites};
    } else if(req.query.favorited){
      query._id = {$in: []};
    }

    return Promise.all([
      Bike.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('author')
        .exec(),
      Bike.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results){
      var bikes = results[0];
      var bikesCount = results[1];
      var user = results[2];

      return res.json({
        bikes: bikes.map(function(bike){
          return bike.toJSONFor(user);
        }),
        bikesCount: bikesCount
      });
    });
  }).catch(next);
});

router.get('/feed', auth.required, function(req, res, next) {
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    Promise.all([
      Bike.find({ author: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(),
      Bike.count({ author: {$in: user.following}})
    ]).then(function(results){
      var bikes = results[0];
      var bikesCount = results[1];

      return res.json({
        bikes: bikes.map(function(bike){
          return bike.toJSONFor(user);
        }),
        bikesCount: bikesCount
      });
    }).catch(next);
  });
});

router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var bike = new Bike(req.body.bike);

    bike.author = user;

    return bike.save().then(function(){
      console.log(bike.author);
      return res.json({bike: bike.toJSONFor(user)});
    });
  }).catch(next);
});

// return a bike
router.get('/:bike', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.bike.populate('author').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({bike: req.bike.toJSONFor(user)});
  }).catch(next);
});

// update bike
router.put('/:bike', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.bike.author._id.toString() === req.payload.id.toString()){
      if(typeof req.body.bike.title !== 'undefined'){
        req.bike.title = req.body.bike.title;
      }

      if(typeof req.body.bike.description !== 'undefined'){
        req.bike.description = req.body.bike.description;
      }

      if(typeof req.body.bike.body !== 'undefined'){
        req.bike.body = req.body.bike.body;
      }

      if(typeof req.body.bike.tagList !== 'undefined'){
        req.bike.tagList = req.body.bike.tagList
      }

      req.bike.save().then(function(bike){
        return res.json({bike: bike.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete bike
router.delete('/:bike', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.bike.author._id.toString() === req.payload.id.toString()){
      return req.bike.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// Favorite an bike
router.post('/:bike/favorite', auth.required, function(req, res, next) {
  var bikeId = req.bike._id;

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    return user.favorite(bikeId).then(function(){
      return req.bike.updateFavoriteCount().then(function(bike){
        return res.json({bike: bike.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// Unfavorite an bike
router.delete('/:bike/favorite', auth.required, function(req, res, next) {
  var bikeId = req.bike._id;

  User.findById(req.payload.id).then(function (user){
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(bikeId).then(function(){
      return req.bike.updateFavoriteCount().then(function(bike){
        return res.json({bike: bike.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// return an bike's comments
router.get('/:bike/comments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.bike.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(bike) {
      return res.json({comments: req.bike.comments.map(function(comment){
        return comment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

// create a new comment
router.post('/:bike/comments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    var comment = new Comment(req.body.comment);
    comment.bike = req.bike;
    comment.author = user;

    return comment.save().then(function(){
      req.bike.comments.push(comment);

      return req.bike.save().then(function(bike) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});

router.delete('/:bike/comments/:comment', auth.required, function(req, res, next) {
  if(req.comment.author.toString() === req.payload.id.toString()){
    req.bike.comments.remove(req.comment._id);
    req.bike.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
