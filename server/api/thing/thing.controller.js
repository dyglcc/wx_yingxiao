/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Thing from './thing.model';
var nodeExcel = require('excel-export');
var path = require('path');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Things
export function index(req, res) {
  return Thing.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  return Thing.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function findByCode(req, res){
  var curPage = req.query.page;
  var role = req.query.role;
  var uid = req.params.id;

  var search = {};
  if(role  != 'admin')
    search = {scode: uid};

  Thing.count(search,function(err,count){
    if(err) return handleError(res);
    var num = parseInt(count / 100);
    var total = count % 100 == 0 ? num : num + 1;
    var index = 100 * (curPage - 1);
    if(index < 0)
      index = 0;


      Thing.find(search,null,{ sort:{ _id:-1 }, skip:index, limit:100 },function(err,data){
        if(err) return handleError(res);
        return res.json({count:count,total:total, orders: data});
      });
  });

}

// Creates a new Thing in the DB
export function create(req, res) {
  var order = {
    name: req.body['entry[field_1]'],
    phone : req.body['entry[field_2]'],
    province: req.body['entry[field_3][province]'],
    city: req.body['entry[field_3][city]'],
    district: req.body['entry[field_3][district]'],
    street: req.body['entry[field_3][street]'],
    scode: req.query.code
  };

  return Thing.create(order)
    .then(function(){
      res.render('success');
    })
    .catch(handleError(res));
}



// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Thing.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  return Thing.remove({scode:req.params.id},function(){
    res.json({status:'ok'});
  });
}


export function excel(req, res){
    var serach = {scode: req.params.id};
    var role = req.query.role;
    if(role == 'admin')
        serach = {};
    var conf ={};
    conf.stylesXmlFile = path.normalize(__dirname + '/../../..') + '/server/data/styles.xml';
    conf.name = "mysheet";
    conf.cols = [{
        caption:'姓名',
        type:'string'
    },{
      caption:'手机号',
      type:'string'
    },{
      caption:'省',
      type:'string'
    },{
      caption:'区',
      type:'string'
    },{
      caption:'县',
      type:'string'
    },{
      caption:'详细地址',
      type:'string'
    },{
      caption:'提交时间',
      type:'string'
    }];

    conf.rows = [];
    Thing.find(serach,null,{ sort:{ _id:-1 } },function(err,data){
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        conf.rows.push([item.name,item.phone,item.province,item.city,item.district,item.street,item.create_at]);
      }
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        return res.end(result, 'binary');
    });
};
