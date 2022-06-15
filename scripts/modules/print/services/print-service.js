"use strict";

angular
    .module("print")
    .service("PrintService", [
        "$http",
        "$q",
        "apiConfig",
        function ($http, $q, apiConfig) {
            var host = globalHost,//if two or more srv centers
                preRegistrationUrl = apiConfig.preRegistrationUrl,
                receiptUrl = apiConfig.receiptUrl;

            String.prototype.parseUrl = function (model) {
                var url = this;
                for (var property in model) {
                    if (model.hasOwnProperty(property)) {
                        url = url.replace(":" + property, model[property]);
                    }
                }
                url = url.replace(/&\w+=:\w+/gi, "");

                return url;
            }

            return {
                printReceipt: function (organizationGuid, serviceCenterId, orderGuid, hostName) {
                    var deferred = $q.defer();
                    var data = {
                        organizationGuid: organizationGuid,
                        serviceCenterId: serviceCenterId,
                        orderGuid: orderGuid
                    };
                    host = hostName.host;//globalHost;
                    $http.jsonp([host, preRegistrationUrl, receiptUrl].join("/").parseUrl(data))
                        .success(function (receipt) {
                            deferred.resolve(receipt);
                        })
                        .error(function (rejection) {
                            deferred.reject(rejection);
                        });

                    return deferred.promise;
                }
            }
        }
    ]);