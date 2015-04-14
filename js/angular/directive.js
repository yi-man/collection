/**
 * Created by xuxin on 15-3-29.
 */

  /*
  * <ul>
   <li lk-repeat="name in names">{{name}}</li>
   </ul>
  * 仿ng-repeat
  * */
var app = angular.module('myApp',[]);

app.directive('lkRepeat',function(){
  return {
    transclude: 'element',
    compile: function(element,attar,linker){
      return function($scope,$element,$attr){
        var myLoop = $attr.lkRepeat,
          match = myLoop.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),
          indexString = match[1],
          collectionString = match[2],
          parent = $element.parent(),
          elements = [];

        //每次collection被修改时$watchCllection都会被调用
        $scope.$watchCollection(collectionString,function(collection){
          var i,block,childScope;

          //检查元素是否已经被渲染了
          if(elements.length > 0){
            //如果为真将它们从DOM中移除，并销毁它们的scope
            for(i=0;i<elements.length;i++){
              elements[i].el.remove();
              elements[i].scope.$destory();
            };
            elements = [];
          }

          for(i=0;i<collection.length;i++){
            //对这个collection中每个元素创建一个新scope
            childScope = $scope.$new();
            childScope[indexString] = collection[i];

            linker(childScope,function(clone){

              parent.append(clone);//添加到DOM中
              block = {};
              block.el = clone;
              block.scope = childScope;
              elements.push(block);
            });
          }
        });
      }
    }
  }
});



/*
* directive中controller的使用
* */

var app = angular.module('superApp', []);

app.directive("superhero", function () {
  return {
    restrict: "E",

    controller: function ($scope) {
      $scope.abilities = [];

      this.addStrength = function() {
        $scope.abilities.push("strength");
      };

      this.addSpeed = function() {
        $scope.abilities.push("speed");
      };

      this.addFlight = function() {
        $scope.abilities.push("flight");
      };
    },

    link: function (scope, element) {
      element.addClass("button");
      element.bind("mouseenter", function () {
        console.log(scope.abilities);
      });
    }
  };
}).directive("strength", function() {
  return {
    require: "superhero",
    link: function (scope, element, attrs, superheroCtrl) {
      superheroCtrl.addStrength();
    }
  };
});