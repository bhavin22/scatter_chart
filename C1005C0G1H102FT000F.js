'use strict';
angular.module('C1005C0G1H102FT000F', ['nvd3ChartDirectives'])


angular.module('C1005C0G1H102FT000F', ['ngAnimate'])
  .factory('Cart', function() {
    var items = [];
    return {
      getItems: function() {
        return items;
      },
      addArticle: function(article) {
        // items.splice(article);
        items.push(article);
      },
      removeArticle: function(article) {
        items.splice(article);
      },
      sum: function() {
        return items.reduce(function(total, article) {
          return total + (article.price * article.moq)
        }, 0);
      }
    };
  })


  .controller('ArticlesCtrl', function($scope, $http, Cart){


    $scope.cart = Cart;
    $scope.myNumber = 5;
    $scope.sortType     = 'bestoffer'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchFish   = '';     // set the default search/filter term
    $http.get('C1005C0G1H102FT000F.json').then(function(articlesResponse) {
        $scope.articles = articlesResponse.data;
    });
        $scope.$watch('qty.qty', function(val) {
        if (val) {
            console.log(val);
            angular.forEach($scope.articles,function(item,index){ item["qtyOrdered"] = val; ;
            })
        }
      });
      $('#decrement').hide();
        var limitStep = 10;
        $scope.limit = limitStep;
        $scope.incrementLimit = function() {
            $scope.limit = 100000;
            $('#decrement').show();
            $('#increment').hide();
        };
        $scope.decrementLimit = function() {
            $scope.limit = 10;
            $('#decrement').hide();
            $('#increment').show();
        };


    var num = 0.0;
    $scope.qty = new Quantity(50);
    $scope.num = num;
    $scope.qtyFilter = function (article) {
        var qnty = parseFloat(article.qtyAvailable);
        var min = parseFloat($scope.qty.qty);
        if (!qnty) {
          return false;
        }
        if(min && qnty < min) {
          return false;
        }
        return true;
    },

    $scope.dateFilter = function (article) {
        var dte = parseFloat(article.date);
        var max = parseFloat($scope.datePicker);
        console.log($scope.datePicker)
        console.log(article.date)
        if (!dte) {
          return false;
        }
        if(dte > max) {
          return false;
        }
        return true;
    }
  })
  .controller('CartCtrl', function($scope, Cart){
    $scope.cart = Cart;
  })

function Quantity(numOfPcs) {
    var qty = numOfPcs;

    this.__defineGetter__("qty", function () {
        return qty;
    });

    this.__defineSetter__("qty", function (val) {
        val = parseInt(val);
        qty = val;
    });
}
angular.module('C1005C0G1H102FT000F').directive('mypopover', function ($compile,$templateCache) {

var getTemplate = function (contentType) {
    var template = '';
    switch (contentType) {
        case 'user':
            template = $templateCache.get("templateId.html");
            break;
    }
    return template;
}
return {
    restrict: "A",
    link: function (scope, element, attrs) {
        var popOverContent;

        popOverContent = getTemplate("user");

        popOverContent = $compile("<div>" + popOverContent+"</div>")(scope);

        var options = {
            content: popOverContent,
            placement: "right",
            html: true,
            date: scope.date,
            trigger: 'focus'

        };
        $(element).popover(options);
    }
};
});
