'use strict';

// no use code 
class Project {  
  constructor(name) {
    this.name = name;
  }

  start() {
    return "Project " + this.name + " starting";
  }
}
//--no use code
(function() {

class AdminController {
  constructor(User, Auth) {
    // Use the User $resource to fetch all users
    this.users = User.query();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

angular.module('weixinOApp.admin')
  .controller('AdminController', AdminController);

})();
