"use strict";

angular
    .module("profile")
    .service("ProfileModel", [
        "$q",
        "DataModel",
        function ($q, DataModel) {
            var profileSchema = {
                "firstName": "",
                "lastName": "",
                "patronymic": "",
                "legalPersonName": "",
                "phone": "",
                "email": "",
                "quantity": "",
                "documentNum": ""
            };

            return {
                getProfile: function () {
                    var deferred = $q.defer();

                    DataModel.getProfile().then(function (profileModel) {
                        if (profileModel)
                            deferred.resolve(angular.fromJson(profileModel));
                        else
                            deferred.resolve(profileSchema);
                    });

                    return deferred.promise;
                },
                saveProfile: function (profile) {
                    return DataModel.saveProfile(profile);
                },
                deleteProfile: function() {
                    return DataModel.deleteProfile();
                }
            };
        }
    ]);