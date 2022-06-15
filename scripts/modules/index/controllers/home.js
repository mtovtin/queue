"use strict";

angular
    .module("index")
    .controller("HomeController", [
        "$scope",
        "$rootScope",
        "$state",
        "LocalizationService",
        function ($scope, $rootScope, $state, LocalizationService) {
            $scope.profile = function () {
                $state.go("profile", {
                    organizationName: $state.params.organizationName,
                    organizationGuid: $rootScope.organizationGuid
                });
            }

            function initController() {
                $rootScope.organizationGuid = $state.params.organizationGuid;
            }
            initController();
        }
    ]);