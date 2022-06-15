"use strict";

//Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    //Init module configuration options
    var applicationModuleName = "webPreRegistrationApp";
    var applicationModuleVendorDependencies = [
        "ngSanitize",
        "LocalStorageModule",
        "tmh.dynamicLocale",
        "ui.router",
        "ui.bootstrap",
        "ui.mask",
        "nya.bootstrap.select",
        "ui.bootstrap",
        "ui.bootstrap.tpls"
    ];

    //Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        //Create angular module
        if (dependencies)
            angular.module(moduleName, dependencies);
        else
            angular.module(moduleName, []);

        //Add the module to the AngularJS configuration file
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    }

    return {
        applicationModuleName: applicationModuleName,
        applicationModileVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();