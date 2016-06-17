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

class MainController {

  constructor() {
  }

}

angular.module('weixinOApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
