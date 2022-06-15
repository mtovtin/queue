"use strict";

angular
    .module("print")
    .config([
        "$stateProvider",
        function($stateProvider) {
            $stateProvider
                .state("print", {
                    url: "/print/:organizationName/:organizationGuid/:serviceCenterId/:orderGuid/:serviceName/:receiptNum/:registrationTime",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/print.html";
                    },
                    controller: "PrintController"
                });
        }
    ]);