'use strict';
(function(){

class OrderComponent {
    constructor($http,$location,Auth,User) {
      var self = this;
      this.$http = $http;
      this.$location = $location;
      this.Auth = Auth;
      this.User = User;
      this.awesomeThings = [];
      this.user = {};
      this.curPage = 0;
      // this.users = User.query();
      if(Auth.isAdmin()){
        $http.get('/api/users').then(function(data){
          self.users = data.data;
        });
      }else{
        Auth.getCurrentUser(function(data){
          self.users = [data];
        });
      }

    }

    $onInit() {
      var self = this;
      this.Auth.getCurrentUser(function(response){
          self.user = response;
          self.$http.get('/api/order/u/' + self.user._id ,{ params:{page: self.curPage }}).then(response => {
            self.awesomeThings = response.data.orders;
          });
      });

      this.domain = this.$location.protocol() + '://' + this.$location.host()  + ':' + this.$location.port();


    }

    getUserName(id){
      for (var key in this.users) {
        var item = this.users[key];
        if(item._id == id)
          return item;
      }
    }
}

angular.module('weixinOApp')
  .component('order', {
    templateUrl: 'app/order/order.html',
    controller: OrderComponent
  });

})();
