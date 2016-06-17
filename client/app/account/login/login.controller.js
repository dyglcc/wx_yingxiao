'use strict';

// nouse code 
class Project {  
  constructor(name) {
    this.name = name;
  }

  start() {
    return "Project " + this.name + " starting";
  }
}
class LoginController {
  constructor(Auth, $state) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('weixinOApp')
  .controller('LoginController', LoginController);
