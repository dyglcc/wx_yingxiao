'use strict';
(function(){

class EditorComponent {
  constructor($http,$timeout) {
    var self = this;
    this.$http = $http;
    this.$timeout = $timeout;

    $http.get('/html/tmpl/index').then(function(data){
      self.indexHtml = data.data.content;
    });

    $http.get('/html/tmpl/content').then(function(data){
      self.contentHtml = data.data.content;
    });
  }


  saveIndexTmpl(){
    var html = this.indexHtml;
    var codeHtml = html.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    this.$http.post('/html/tmpl/index',{content:codeHtml}).then(function(data){
        // console.log(html);
    });
  }

  saveContentTmpl(){
    var html = this.contentHtml;
    var codeHtml = html.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    this.$http.post('/html/tmpl/content',{content:codeHtml}).then(function(data){

    });

  }

  resetIndexTmpl(){
    var self = this;
    this.$http.post('/html/tmpl/reset_index').then(function(data){
      self.indexHtml = data.data.content;
    });
  }

  resetContentTmpl(){
      var self = this;
      this.$http.post('/html/tmpl/reset_content').then(function(data){
        self.contentHtml = data.data.content;
      });
  }

}

angular.module('weixinOApp')
  .component('editor', {
    templateUrl: 'app/editor/editor.html',
    controller: EditorComponent
  });

})();
