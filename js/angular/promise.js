/**
 * Created by xuxin on 15-3-29.
 */
// $q 是内置服务，所以可以直接使用
ngApp.factory('UserInfo', ['$http', '$q', function ($http, $q) {
  return {
    query : function() {
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      $http({method: 'GET', url: 'scripts/mine.json'}).
        success(function(data, status, headers, config) {
          deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
        }).
        error(function(data, status, headers, config) {
          deferred.reject(data);   // 声明执行失败，即服务器返回错误
        });
      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    } // end query
  };
}]);

angular.module('ngApp')
  .controller('MainCtrl', ['$scope', 'UserInfo', function ($scope, UserInfo) { // 引用我们定义的UserInfo服务
    var promise = UserInfo.query(); // 同步调用，获得承诺接口
    promise.then(function(data) {  // 调用承诺API获取数据 .resolve
      $scope.user = data;
    }, function(data) {  // 处理错误 .reject
      $scope.user = {error: '用户不存在！'};
    });
  }]);