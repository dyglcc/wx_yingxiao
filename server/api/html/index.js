'use strict';

var express = require('express');

var router = express.Router();

router.get('/index', function(req, res, next){

  res.render('view');
});


router.get('/form', function(req, res, next){


  res.render('content',{
    code : req.query.code,
    csrfToken: req.csrfToken()
  });
});

module.exports = router;
