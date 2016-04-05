/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';

//
User.find({})
  .then(() => {
    User.create({
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123'
    },{
      provider: 'local',
      role : 'user',
      name : 'test User',
      email: 'test@test.com',
      password: 'test'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
