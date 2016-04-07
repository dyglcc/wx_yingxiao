'use strict';
(function(){

class OrderComponent {

    constructor($http,$location,Auth,User,$state) {
      var self = this;
      this.$http = $http;
      this.$location = $location;
      this.Auth = Auth;
      this.User = User;
      this.$state = $state;
      this.awesomeThings = [];
      this.user = {};
      this.curPage = 0;
      this.aa = User.query();
      this.indexaa = {};
      this.initstats = 2000;

      for (var i = 0; i < this.aa.length; i++) {
        var item = this.aa[i];
        this.indexaa[item.scode] = item;
      }
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

    $onInit(users) {
      var self = this;
      this.Auth.getCurrentUser(function(response){
          self.user = response;
          self.$http.get('/api/order/u/' + self.user._id ,{ params:{page: self.curPage , role: self.user.role }}).then(response => {
            self.awesomeThings = response.data.orders;
            self.count = response.data.count;
          });
      });

      this.domain = this.$location.protocol() + '://' + this.$location.host();


    }

    getUserName(id){
      for (var key in this.users) {
        var item = this.users[key];
        if(item._id == id)
          return item;
      }
    }

    clearAll(){
      var self = this;
      var user = this.user;
      var scode = user._id;
      var url = '/api/order/' + scode + '?role=' + user.role;
      this.$http.delete(url).then(function(){
          self.$state.reload();
      });
    }

    change(){
      this.$http.get('/api/order/u/' + this.user._id ,{ params:{page: this.curPage , role: this.user.role }}).then(response => {
        this.awesomeThings = response.data.orders;
        this.count = response.data.count;
      });
    }

}

angular.module('weixinOApp')
  .component('order', {
    templateUrl: 'app/order/order.html',
    controller: OrderComponent
  });

})();
