"use strict";

angular
    .module("core")
    .service("DataModel", [
        "$q",
        "localStorageService",
        function ($q, localStorageService) {
            //orgGuid of organistions wich service centers you want to see at preReg page 
            //http://192.168.0.2:8091/webpreregistration/index/GRIS#!/home/GRIS?Request=123445678 example of address string
            var orgGuidsData = ["4c750754-aa83-410c-8a7f-55d71233380a"]; 

            function storageSave(profile) {
                localStorageService.set("profile", angular.toJson(profile));
                return profile;
            }
            (function ($) {
                $.urlParam = function (name) {
                    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
                    if (results == null) {
                        return null;
                    } else {
                        return results[1] || 0;
                    }
                };
            })(jQuery);
            return {
                getProfile: function() {
                    var deferred = $q.defer();
                    var profile = localStorageService.get("profile");
                    deferred.resolve(angular.fromJson(profile));
                    return deferred.promise;
                },
                getProfileFromToken: function () {
                    var deferred = $q.defer();
                    var profile = $.urlParam(); //here need to create new profile 
                    deferred.resolve(angular.fromJson(profile));
                    return deferred.promise;
                },
                getProfileFromCookies: function () {
                    try {
                        var deferred = $q.defer();
                        var profile = localStorageService.get("userProfile");
                        deferred.resolve(angular.fromJson(profile));
                        return deferred.promise;
                    }
                    catch (ex) {
                        console.log(ex);
                        return "error data - no local storage data " + ex;
                    }
                },
                saveProfile: function(profile) {
                    var deferred = $q.defer();
                    deferred.resolve(storageSave(profile));
                    return deferred.promise;
                },
                deleteProfile: function () {
                    var deferred = $q.defer();
                    deferred.resolve(localStorageService.remove("profile"));
                    return deferred.promise;
                },
                getOrgGuids: function () {
                   
                    var deferred = $q.defer();
                    deferred.resolve(angular.fromJson(orgGuidsData));
                    return deferred.promise;
                },
                documentinputServices: [{
                    organizationGuid: "a8c96abb-0ae5-4a60-b187-6492e113667a",
                    serviceCenterId: "1",
                    serviceId: "636"
                }]
            };
        }
    ]);