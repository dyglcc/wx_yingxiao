'use strict';

angular.module('weixinOApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editor', {
        url: '/editor',
        template: '<editor></editor>'
      });
  });
