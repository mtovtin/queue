"use strict";

angular
    .module("queue")
    .service("QueueService", [
        "$http",
        "$q",
        "apiConfig",
        "LocalizationService",
        "DataModel",
        function ($http, $q, apiConfig, LocalizationService, DataModel) {
            var host = apiConfig.host,
                preRegistrationUrl = apiConfig.preRegistrationUrl,
                serviceCentersUrl = apiConfig.serviceCentersUrl,
                servicesUrl = apiConfig.servicesUrlByCenterId,
                dateTimesUrl = apiConfig.dateTimesUrl,
                groupsUrl = apiConfig.groupsUrl,
                welcomePointUrl = apiConfig.welcomePointUrl,
                registerUrl = apiConfig.registerUrl,
                checkAvaiblePreRegForTodayUrl = apiConfig.checkPossibilityPreRegForTodayUrl,
                avaiableTimesUrl = apiConfig.avaiableTimesUrl,
                avaiableToday = apiConfig.avaiableToday,
                hostForCheckPossibilityForPreRegForToday = apiConfig.hostForCheckPossibilityForPreRegForToday;

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

            function serviceCentersModelMapping(data, organizationGuid, num) {
                var serviceCenters = [];
                angular.forEach(data, function (serviceCenter) {
                    try {
                        this.push({
                            id: serviceCenter.ServiceCenterId,
                            name: serviceCenter.ServiceCenterName,
                            orgGuid: organizationGuid,
                            numberOfSrvCenter: num
                        });
                    } catch (err) {

                        console.log(err);

                    }

                }, serviceCenters);

                return serviceCenters;
            }

            function servicesModelMapping(data) {
                var services = [];
                angular.forEach(data, function (service) {
                    this.push({
                        id: service.ServiceId,
                        name: service.Description.replace(/<[^>]*>/g, "") //delete html tags
                    });
                }, services);

                return services;
            }

            function parseDuration(t) {
                var hr = parseInt(t.match(/(\d{1,2})H/)[1]) * 60 * 60 * 1000;
                var mn = t.match(/(\d{1,2})M/) && t.match(/(\d{1,2})M/)[1];

                if (mn)
                    hr += mn * 60 * 1000;

                return hr;
            }

            function dateTimesModelMapping(data) {
                var dates = [];
                var dateId = 0;

                angular.forEach(data, function (date) {
                    if (date.IsAllow && date.CountJobsAllow > 0) {
                        var timeId = 0;
                        var times = [];

                        date.Times.forEach(function (time) {
                            if (time.IsAllow && time.CountJobsAllow > 0) {
                                var obj = {
                                    id: timeId++,
                                    time: parseDuration(time.StartTime)
                                }
                                times.push(obj);
                            }
                        });

                        if (times.length) {
                            this.push({
                                id: dateId++,
                                date: new Date(parseInt(date.DatePart.match(/\((.+)\)/)[1])),
                                times: times
                            });
                        }
                    }
                }, dates);

                return dates;
            }

            function validateQueueModel(model) {
                for (var property in model) {
                    if (model.hasOwnProperty(property) && model[property] == undefined) {
                        return false;
                    }
                }

                return true;
            }

            return {
                getServiceCenters: function (organizationGuid, num) {
                    var deferred = $q.defer();
                    var data = {
                        organizationGuid: organizationGuid
                    };
                    if (num == undefined || num == null || num == 0) {
                        num = 1;
                    }
                    var returnedHost = { host: " ", hostPreReg: "" };
                    var selectedSrvCenter = [];
                    returnedHost = apiConfig.hostForServiceCenters(num);
                    var necessarySrvCenters = returnedHost.srvCenterIds;
                    hostForCheckPossibilityForPreRegForToday = returnedHost.hostPreReg;

                    $http.jsonp([returnedHost.host, preRegistrationUrl, serviceCentersUrl].join("/").parseUrl(data))
                        .success(function (serviceCentersList) {
                            var srvCenterArr = serviceCentersModelMapping(serviceCentersList, organizationGuid, num);
                            if (necessarySrvCenters.length > 0 && necessarySrvCenters != undefined && necessarySrvCenters != null) {
                                for (let index = 0; index < returnedHost.srvCenterIds.length; index++) {
                                    selectedSrvCenter = selectedSrvCenter.concat(srvCenterArr.filter(srv => srv.id == necessarySrvCenters[index]));
                                };
                                deferred.resolve(selectedSrvCenter);
                            } else {
                                deferred.resolve(srvCenterArr);
                            }
                        })
                        .error(function (rejection) {
                            deferred.reject(rejection);
                        });

                    return deferred.promise;
                },
                getGroups: function (organizationGuid, serviceCenterId, parentGroupId, num) {
                    var deferred = $q.defer();
                    var data = {
                        organizationGuid: organizationGuid,
                        serviceCenterId: serviceCenterId,
                        parentGroupId: parentGroupId,
                        languageId: LocalizationService.getCurrentLanguage().id
                    };
                    if (num == undefined || num == null || num == 0) {
                        num = 1;
                    }

                    var returnedHost = { host: " ", hostPreReg: "" };

                    returnedHost = apiConfig.hostForServiceCenters(num);
                    host = returnedHost.host;

                    hostForCheckPossibilityForPreRegForToday = returnedHost.hostPreReg;

                    $http.jsonp([host, welcomePointUrl, groupsUrl].join("/").parseUrl(data))
                        .success(function (groups) {
                            deferred.resolve(groups);
                        })
                        .error(function (rejection) {
                            deferred.reject(rejection);
                        });

                    return deferred.promise;
                },
                getServices: function (organizationGuid, serviceCenterId, groupId, num) {
                    var deferred = $q.defer();
                    if (num == undefined || num == null || num == 0) {
                        num = 1;
                    }

                    var returnedHost = { host: " ", hostPreReg: "" };

                    returnedHost = apiConfig.hostForServiceCenters(num);
                    host = returnedHost.host;

                    hostForCheckPossibilityForPreRegForToday = returnedHost.hostPreReg;

                    var data = {
                        organizationGuid: organizationGuid,
                        serviceCenterId: serviceCenterId,
                        groupId: groupId,
                        languageId: LocalizationService.getCurrentLanguage().id
                    };
                    var urlString = [host, welcomePointUrl, servicesUrl].join("/").parseUrl(data);
                    $http.jsonp(urlString)
                        .success(function (servicesList) {
                            deferred.resolve(servicesList); //servicesModelMapping(servicesList));
                        })
                        .error(function (rejection) {
                            deferred.reject(rejection);
                        });

                    return deferred.promise;
                },
                getHostName: function (num) {
                    try {
                        var host = apiConfig.hostForServiceCenters(num);
                        return host;
                    } catch (ex) {
                        return ex;
                    }
                },
                getAvailableDateTimes: function (organizationGuid, serviceCenterId, serviceId) {
                    var deferred = $q.defer();

                    var data = {
                        organizationGuid: organizationGuid,
                        serviceCenterId: serviceCenterId,
                        serviceId: serviceId,
                        dateStart: "",
                        dateEnd: new Date()
                    };
                    var avaiblePreRegForTodayData = {
                        orgKey: organizationGuid,
                        serviceCenterId: serviceCenterId
                    };
                    var sDate = null, eDate = null;
                    //var hostForCheck = "http://192.168.0.2:8091";
                    // console.log([hostForCheck, checkAvaiblePreRegForTodayUrl, avaiableToday].join("").parseUrl(avaiblePreRegForTodayData));
                    // host = host.substring(0,host.indexOf(":8084"))+":8094";
                    $http.jsonp([hostForCheckPossibilityForPreRegForToday, checkAvaiblePreRegForTodayUrl, avaiableToday].join("").parseUrl(avaiblePreRegForTodayData))
                        .success(function (request) {
                            if ((request.error == undefined || request.error == null) && request.error != true) {
                                var dateStartParse = request.currentDay.match(/\((.+)\)/);
                                var dateStopParse = request.lastDateTime.match(/\((.+)\)/);

                                if (dateStartParse != null) {
                                    data.dateStart = new Date(parseInt(dataStartParse[1]))
                                } else {
                                    data.dateStart = new Date(request.currentDay);
                                }
                                if (dateStopParse != null) {
                                    data.dateEnd = new Date(parseInt(dateStopParse[1]));
                                } else {
                                    data.dateEnd = new Date(request.lastDateTime);
                                }

                                sDate = data.dateStart;
                                data.dateStart = (data.dateStart.getMonth() + 1) + '-' + data.dateStart.getDate() + '-' + data.dateStart.getFullYear();

                                eDate = data.dateEnd;
                                data.dateEnd = (data.dateEnd.getMonth() + 1) + '-' + data.dateEnd.getDate() + '-' + data.dateEnd.getFullYear();

                                $http.jsonp([host, preRegistrationUrl, avaiableTimesUrl].join("/").parseUrl(data))
                                    .success(function (dateTimesList) {
                                        if ((dateTimesList.Message != null || dateTimesList.Message != undefined) && dateTimesList.Message.length > 0) {

                                            data.dateStart = sDate.getDate() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getFullYear();

                                            data.dateEnd = eDate.getDate() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getFullYear();

                                            $http.jsonp([host, preRegistrationUrl, avaiableTimesUrl].join("/").parseUrl(data))
                                                .success(function (dateTimesList) {
                                                    deferred.resolve(dateTimesModelMapping(dateTimesList));
                                                }).error(function (rejection) {
                                                    deferred.reject(rejection);
                                                });
                                        } else {
                                            deferred.resolve(dateTimesModelMapping(dateTimesList));
                                        }
                                    })
                                    .error(function (rejection) {
                                        deferred.reject(rejection);
                                    });
                            }
                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });



                    // host = host.substring(0, host.indexOf(":8094")) + ":8084";
                    return deferred.promise;
                },
                register: function (queue) {
                    var deferred = $q.defer();

                    DataModel.getProfile().then(function (profileModel) {
                        queue.name = [profileModel.lastName, profileModel.firstName, profileModel.patronymic]
                            .filter(function (val) {
                                return val;
                            }).join(" ");
                        queue.phone = profileModel.phone;
                        queue.languageId = LocalizationService.getCurrentLanguage().id;

                        if (profileModel.email) queue.email = profileModel.email;
                        if (profileModel.legalPersonName) queue.legalPersonName = profileModel.legalPersonName;
                        if (profileModel.documentNum) queue.documentNum = profileModel.documentNum;

                        if (validateQueueModel(queue)) {
                            $http.jsonp([host, preRegistrationUrl, registerUrl].join("/").parseUrl(queue))
                                .success(function (res) {
                                    deferred.resolve(res);
                                })
                                .error(function (rejection) {
                                    deferred.reject(rejection);
                                });
                        }
                    });

                    return deferred.promise;
                }
            };
        }
    ]);
