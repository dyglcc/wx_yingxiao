'use strict';

var express = require('express');
var weixin = require('weixin-api');
var path = require('path');
var fs = require('fs');

var router = express.Router();

router.get('/index', function(req, res, next){
  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/index.tmpl'
  var data = fs.readFileSync(filtpath, 'utf-8');
  res.render('view',{
    code: req.query.code,
    tmpl: data
  });
});


router.get('/form', function(req, res, next){

  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/content.tmpl'
  var data = fs.readFileSync(filtpath, 'utf-8');

  res.render('content',{
    code : req.query.code,
    tmpl: data,
    csrfToken: req.csrfToken()
  });
});


router.get('/tmpl/index', function(req, res){
  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/index.tmpl'
  var data = fs.readFileSync(filtpath, 'utf-8');
  res.json({
    content: data
  });
});

router.get('/tmpl/content', function(req, res){
  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/content.tmpl'
  var data = fs.readFileSync(filtpath, 'utf-8');
  res.json({
    content: data
  });
});

router.post('/tmpl/index', function(req, res){
  var html = req.body.content;
  html = html.replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/index.tmpl'
  fs.writeFileSync(filtpath,html,'utf-8');
  res.json({
    status: 'ok'
  });
});

router.post('/tmpl/content',function(req, res){
    var html = req.body.content;
    html = html.replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
    var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/content.tmpl'
    fs.writeFileSync(filtpath,html,'utf-8');
    res.json({
      status: 'ok'
    });
});

router.post('/tmpl/reset_index', function(req,res){
    var filtbackpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/index_back.tmpl';
    var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/index.tmpl';
    var data = fs.readFileSync(filtbackpath, 'utf-8');
    fs.writeFileSync(filtpath,data,'utf-8');
    res.json({
      content: data
    });
});

router.post('/tmpl/reset_content',function(req, res){
  var filtbackpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/content_back.tmpl';
  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/content.tmpl';
  var data = fs.readFileSync(filtbackpath, 'utf-8');
  fs.writeFileSync(filtpath,data,'utf-8');
  res.json({
    content: data
  });
});



module.exports = router;
