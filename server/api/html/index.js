'use strict';

var express = require('express');
var weixin = require('weixin-api');

var router = express.Router();

router.get('/index', function(req, res, next){

  res.render('view',{
    code: req.query.code
  });
});


router.get('/form', function(req, res, next){


  res.render('content',{
    code : req.query.code,
    csrfToken: req.csrfToken()
  });
});


module.exports = router;
