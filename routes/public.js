var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/login', function (req, res, next) {
  let func = require('../controllers/public/login').post;
  func(req, res, next);
});

router.get('/login', function(req, res, next) {
  let func = require('../controllers/public/login').get;
  func(req, res, next);
})

module.exports = router;
