"use strict";

angular
    .module("core")
    .directive("loadingLayer", [
        "$rootScope",
        function ($rootScope) {
            return {
                controller: ["$scope", "$element", "$attrs", "$transclude", function ($scope, $element, $attrs, $transclude) {
                    $scope.isShow = false;
                    $rootScope.$on("loading.show", function (event, data) {
                        $scope.isShow = true;
                    });

                    $rootScope.$on("loading.hide", function(event, mass) {
                        $scope.isShow = false;
                    });
                }],
                restrict: "E",
                template: "<div class=\"loading-layer\" ng-show=\"isShow\"><img src=\"/content/loaders/loader.gif\"/></div>",
                replace: true
            };
        }
    ]);