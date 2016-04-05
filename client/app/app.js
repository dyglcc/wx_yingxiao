'use strict';

angular.module('weixinOApp', [
  'weixinOApp.auth',
  'weixinOApp.admin',
  'weixinOApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'textAngular'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
