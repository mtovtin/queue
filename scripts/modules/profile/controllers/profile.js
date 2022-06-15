"use strict";

angular
    .module("profile")
    .controller("ProfileController", [
        "$scope",
        "$rootScope",
        "$state",
        "LocalizationService",
        "ProfileModel",
        function ($scope, $rootScope, $state, LocalizationService, ProfileModel) {
            $scope.home = function () {
                $scope.changeState("index");
            }

            $scope.queueAdd = function (form, profile) {
                if (form.$valid)
                    profile.phone = "38" + profile.phone;
                    ProfileModel.saveProfile(profile).then(function () {
                        $scope.changeState("queueAdd");
                    });
            }

            $scope.changeState = function (stateName) {
                $state.go(stateName, {
                    organizationName: $state.params.organizationName,
                    organizationGuid: $rootScope.organizationGuid
                });
            }

            function initController() {
                $rootScope.organizationGuid = $state.params.organizationGuid;
                $scope.emailPattern = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "i");
                ProfileModel.deleteProfile();
            }

            initController();
        }
    ]);