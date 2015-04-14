/**
 * Created by xuxin on 15-3-29.
 */

/*
* $parse的使用，将表达式转换为函数
*
*
* <div ng-controller="MyCtrl">
 <input ng-model="expr" type="text" placeholder="Enter an expression" />
 <h2>{{ parsedValue }}</h2>
 </div>

 * */
angular.module("myApp", [])
  .controller('MyCtrl',['$scope', '$parse', function($scope, $parse) {
    $scope.$watch('expr', function(newVal, oldVal, scope) {
      if (newVal !== oldVal) {
        // Let's set up our parseFun with the expression
        var parseFun = $parse(newVal);
        // Get the value of the parsed expression
        $scope.parsedValue = parseFun(scope);
      }
    });
  }]);