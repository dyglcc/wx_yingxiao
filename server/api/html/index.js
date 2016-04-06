'use strict';

var express = require('express');
var weixin = require('weixin-api');
var path = require('path');
var fs = require('fs');
var http = require("http");
var https = require("https");
var jsSHA = require('jssha');
var querystring = require('querystring');

var router = express.Router();

router.get('/index', function(req, res, next){
  var filtpath = path.normalize(__dirname + '/../../..') + '/server/config/tmpl/index.tmpl';
  var data = fs.readFileSync(filtpath, 'utf-8');

    var appid = 'wxb92b5a3bc3812a01';
    var appsecret = '4c3d9b88212581bc014cd57eba0eb493';
    var fullurl = req.protocol + '://' + req.get('host') + req.originalUrl;
    getToken(appid,appsecret,function(resp){
      getTicket(fullurl, appid, res, resp,function(tokens){
        tokens.appid = appid;
          res.render('view',{
            code: req.query.code,
            tmpl: data,
            tokens: tokens
          });
      });
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

  return  res.json({
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

var curToken = {};

var getToken = function(appid,appsecret,callback){
  var curTime = parseInt(new Date().getTime()/1000);
  if(curToken.time && curTime - curToken.time < 7000){
    console.log('toekn cache:',curTime,curTime - curToken.time < 7000);
    return callback(curToken.resp);
  }
  https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appid +'&secret=' + appsecret, function(_res) {
    var str = '';
    _res.on('data', function(data){
      str += data;
    });
    _res.on('end', function(){
      console.log('return access_token:  ' + str);
      try{
        var resp = JSON.parse(str);
      }catch(e){
            return errorRender(res, '解析access_token返回的JSON数据错误', str);
      }
      curToken.time = parseInt(new Date().getTime()/1000);
      curToken.resp = resp;
      return callback(resp);
    });
  })
}

var getTicket = function (url,appid, res, accessData,callback) {
		https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessData.access_token +'&type=jsapi', function(_res){
			var str = '', resp;
			_res.on('data', function(data){
				str += data;
			});
			_res.on('end', function(){
				console.log('return ticket:  ' + str);
				try{
					resp = JSON.parse(str);
				}catch(e){
			        return errorRender(res, '解析远程JSON数据错误', str);
				}

				var appid = appid;
				var ts = createTimeStamp();
				var nonceStr = createNonceStr();
				var ticket = resp.ticket;
				var signature = calcSignature(ticket, nonceStr, ts, url);

				return callback({
          nonceStr: nonceStr
					,timestamp: ts
					,appid: appid
					,signature: signature
					,url: url
				});

			});
		});
	};


var errorRender = function (res, info, data) {
  if(data){
    console.log(data);
  }
  res.set({
    "Access-Control-Allow-Origin": "*"
    ,"Access-Control-Allow-Methods": "POST,GET"
    ,"Access-Control-Allow-Credentials": "true"
  });
  responseWithJson(res, {errmsg: 'error', message: info, data: data});
};

var responseWithJson = function (res, data) {
	// 允许跨域异步获取
	res.set({
		"Access-Control-Allow-Origin": "*"
		,"Access-Control-Allow-Methods": "POST,GET"
		,"Access-Control-Allow-Credentials": "true"
	});
	res.json(data);
};

var createTimeStamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

// 随机字符串产生函数
var createNonceStr = function() {
  return Math.random().toString(36).substr(2, 15);
};

var calcSignature = function (ticket, noncestr, ts, url) {
  var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
  var shaObj = new jsSHA(str, 'TEXT');
  return shaObj.getHash('SHA-1', 'HEX');
}


module.exports = router;
