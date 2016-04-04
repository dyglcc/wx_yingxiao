'use strict';

import mongoose from 'mongoose';

var ThingSchema = new mongoose.Schema({
  scode: String, // scode
  name: String,   //姓名
  phone: String,  // 电话
  province: String , //省
  city: String, //市
  district: String , // 城区
  street: String, //街道
  create_at: { type: Date, default: Date.now } //创建时间
});

export default mongoose.model('Thing', ThingSchema);
