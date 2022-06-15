"use strict";

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModileVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(["$locationProvider",
        function($locationProvider) {
            $locationProvider.hashPrefix("!");
        }]);

//Then define th init function for starting up the application
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === "#_=_")
            window.location.hash = "#!";

        angular
            .bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
    });