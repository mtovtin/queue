"use strict";

angular
    .module("profile")
    .config([
        "$stateProvider",
        function($stateProvider) {
            $stateProvider
                .state("profile", {
                    url: "/profile/:organizationName/:organizationGuid",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/profile.html";
                    },
                    controller: "ProfileController"
                });
        }
    ]);
    