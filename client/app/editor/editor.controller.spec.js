'use strict';

describe('Component: EditorComponent', function () {

  // load the controller's module
  beforeEach(module('weixinOApp'));

  var EditorComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    EditorComponent = $componentController('EditorComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
