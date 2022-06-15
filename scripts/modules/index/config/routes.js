"use strict";

angular
    .module("index")
    .config(["$stateProvider",
        function($stateProvider) {
            $stateProvider
                .state("index", {
                    url: "/home/:organizationName/:organizationGuid",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/home.html";
                    },
                    controller: "HomeController"
                });
        }
    ]);