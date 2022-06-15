"use strict";

angular
    .module("core")
    .config([
        "$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise(function ($injector, $location) {
                $urlRouterProvider.otherwise($location.path());
                $injector.invoke([
                    "$state", function ($state) {
                        $state.go("index");
                    }
                ]);
            });
        }
    ])
    .config([
        "$httpProvider", function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common["X-Requested-With"];
        }
    ])
    .config([
        "localStorageServiceProvider", function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix("webPreRegistrationApp")
                .setStorageType("sessionStorage")
                .setNotify(true, true);
        }
    ])
    .config([
        "nyaBsConfigProvider", function (nyaBsConfigProvider) {
            nyaBsConfigProvider.useLocale("uk");
            nyaBsConfigProvider.setLocalizedText("uk", {
                noSearchResultTpl: "Пошук не дав результатів"
            });
        }
    ]);
   