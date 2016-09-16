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


   .controller('ArticlesCtrl', function($scope, $http, $timeout, Cart){

    $scope.cart = Cart;
    $scope.myNumber = 5;
    $scope.sortType     = 'bestoffer'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchFish   = '';     // set the default search/filter term

    $scope.generateChartData = function() {
        $timeout(function() {
            $scope.chrtData = [];
            for(var i=0; i<$scope.filtered.length; i++) {
                $scope.chrtData.push([$scope.filtered[i].leadtime, $scope.filtered[i].price, i]);
            }

            $scope.highcharts = $('#container').highcharts({
                chart: {borderWidth: 2, borderColor: '#bbb', type: 'scatter'},
                legend: {enabled: false},
                title: {text: ''},
                xAxis: {
                    opposite:true,
                    gridLineWidth: 1,
                    title: {enabled: true,text: 'Lead time (weeks)'},
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                    decimals: true
                },
                yAxis: {
                    reversed: true,
                    title: {text: 'Price per Item'},
                    decimals: true
                },
                tooltip: {
                  crosshairs: [true, true]
                },

                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 4,
                            states: {
                                hover: {
                                    radius: 10,
                                    enabled: true,
                                    lineColor: '#ff96b2'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: true
                                }
                            }
                        },
                        tooltip: {
                          headerFormat: '<b>{series.name}</b><br>',
                          pointFormat: '$ {point.y} price per item, <br>Lead time {point.x} weeks<br><i class="fa fa-cart-plus fa-lg"></i>'
                        }
                    }
                },
                series: [{
                    name: 'Your offer',
                    color: '#ff96b2',
                    borderColor: '#ff96b2',
                    data: $scope.chrtData
                }]
            });
        });
    }

    $http.get('C1005C0G1H102FT000F.json').then(function(articlesResponse) {
        $scope.articles = articlesResponse.data;
        $scope.generateChartData();
    });

    $scope.$watchGroup(['qty.qty','search.packaging','search.source', 'datePicker', 'search.mindurability'], function(val) {
        if (val) {
            $scope.generateChartData();
        }
    });
      $('#decrement').hide();
        var limitStep = 10;
        $scope.limit = limitStep;
        $scope.incrementLimit = function() {
            $scope.limit = 100000;
            $('#decrement').show();
            $('#increment').hide();
            $scope.generateChartData();
        };
        $scope.decrementLimit = function() {
            $scope.limit = 10;
            $('#decrement').hide();
            $('#increment').show();
            $timeout(function() {
                $scope.generateChartData();
            });
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
  });

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
