'use strict';

angular.module('weixinOApp.auth', [
  'weixinOApp.constants',
  'weixinOApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
