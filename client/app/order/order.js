'use strict';

angular.module('weixinOApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('order', {
        url: '/order',
        authenticate: true,
        template: '<order></order>'
      });
  });
