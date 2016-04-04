'use strict';

var express = require('express');

var router = express.Router();

router.get('/index', function(req, res, next){

  res.render('view');
});


router.get('/form', function(req, res, next){

  res.render('content');
});

module.exports = router;
