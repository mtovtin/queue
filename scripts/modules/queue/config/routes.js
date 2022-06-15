"use strict";

angular
    .module("queue")
    .config([
        "$stateProvider",
        function ($stateProvider) {
            $stateProvider
                .state("queueAdd", {
                    url: "/queue/:organizationName/:organizationGuid",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/queue.html";
                    },
                    controller: "QueueController"
                })
                .state("queueAdd.serviceCenters", {
                    url: "/serviceCenters",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/serviceCenters.html";
                    }
                })
                 .state("queueAdd.servicesAndGroups", {
                     url: "/servicesAndGroups",
                     templateUrl: function (params) {
                         return "/scripts/webpreregistration/" + params.organizationName + "/templates/servicesAndGroups.html";
                     }
                 })
                .state("queueAdd.services", {
                    url: "/services",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/services.html";
                    }
                })
                .state("queueAdd.documentNumInput", {
                    url: "/documentNumInput",
                    templateUrl: function (params) {
                        return "/scripts/webpreregistration/" + params.organizationName + "/templates/documentNumInput.html";
                    }
                });
        }
    ])
    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("loadingLayerInterceptor");
    }])
    .factory("loadingLayerInterceptor", [
        "$rootScope",
        "apiConfig",
        function ($rootScope, apiConfig) {
            var partsOfHostUrl = apiConfig.host.replace("http://", "").split(".");
            var matchPattern = new RegExp(partsOfHostUrl[0] + "." + partsOfHostUrl[1]);

            return {
                request: function (config) {
                    if (config.url.match(matchPattern))
                        $rootScope.$broadcast("loading.show");

                    return config;
                },
                response: function (response) {
                    if (response.config && response.config.url && response.config.url.match(matchPattern))
                        $rootScope.$broadcast("loading.hide");

                    return response;
                }
            };
        }
    ]);