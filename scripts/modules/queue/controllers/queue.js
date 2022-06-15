"use strict";

angular
    .module("queue")
    .controller("QueueController", [
        "$scope",
        "$rootScope",
        "$state",
        "$filter",
        "$uibModal",
        "LocalizationService",
        "QueueService",
        "ProfileModel",
        "DataModel",
        function ($scope, $rootScope, $state, $filter, $uibModal, LocalizationService, QueueService, ProfileModel, DataModel) {
            $scope.slideItemsCount = 8;
            $scope.serviceCenter = {};
            $scope.service = {};
            $scope.groupIdsHistoryStack = [];
            $scope.hostNumber = 0;
            $scope.documentNum;
            DataModel.getOrgGuids().then(function (orgGuids) {
                $scope.orgGuids = orgGuids;
                $scope.getServiceCenters();//initialise service centers after orgGuids have got
            }); //["0b6a3e72-8604-4eb6-bd11-4c7f0a126b62", "fd3c44f6-5865-4728-8d95-bdcdecfba809", "9f52d952-4b0e-4f26-9baf-ebdf227ee8ae"];
            $scope.dateTime = {
                date: undefined,
                time: undefined
            };

            $scope.getServiceCenters = function (organizationGuid, showStartPage) {
                if ($scope.serviceCenters===undefined)
                    $scope.serviceCenters = []; //need to itialise as empty array for pushing there values
                var iterator = 0;
                if ($scope.serviceCenters.length <= 0) {
                    angular.forEach($scope.orgGuids, function(orgGuid) {
                        iterator += 1; //for get number of http url in api-config

                        QueueService.getServiceCenters( /*organizationGuid*/orgGuid, iterator).then(function(serviceCenters) {
                            angular.forEach(serviceCenters, function(value) {
                                $scope.serviceCenters.push(value);

                            });

                            //$scope.serviceCenters.push(serviceCenters);
                        });

                    });
                } else {
                    $scope.changeState("queueAdd.serviceCenters");
                }

            };

            $scope.selectServiceCenter = function(serviceCenter) {
                $scope.serviceCenter = serviceCenter;
                $rootScope.organizationGuid = serviceCenter.orgGuid;
                $state.params.organizationGuid = serviceCenter.orgGuid;
                $scope.getGroupsAndServices(serviceCenter.id, 0, false, serviceCenter.numberOfSrvCenter);
                $scope.hostNumber = serviceCenter.numberOfSrvCenter;
                //$scope.getServices($rootScope.organizationGuid, serviceCenter.id, serviceCenter.numberOfSrvCenter);
            };

            

            $scope.getGroupsAndServices = function (serviceCenterId, groupId, isHistoryBack, num, showPrevPage) {
                DataModel.getProfile().then(function (profile) {
                    if (profile.documentNum) {
                        var profileModel = {
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            patronymic: profile.patronymic,
                            legalPersonName: profile.legalPersonName,
                            phone: profile.phone,
                            email: profile.email,
                            documentNum: ""
                        };
                        DataModel.deleteProfile();
                        DataModel.saveProfile(profileModel);
                    } 
                });
                var organizationGuid = $rootScope.organizationGuid;
                $scope.groupId = groupId || 0;
                if (showPrevPage===undefined) {
                    if (isHistoryBack) {
                        $scope.groupIdsHistoryStack.splice(-1, 1);
                        $scope.groupId = $scope.groupIdsHistoryStack[$scope.groupIdsHistoryStack.length - 1];

                        if ($scope.groupId == undefined) {
                            $scope.getServiceCenters(organizationGuid, true);
                            return;
                        }
                    } else
                        $scope.groupIdsHistoryStack.push($scope.groupId);

                    QueueService.getGroups(organizationGuid, serviceCenterId, $scope.groupId, num).then(function(groups) {
                        QueueService.getServices(organizationGuid, serviceCenterId, $scope.groupId, num).then(function(services) {
                            $scope.joinGroupsAndServices(groups, services, num);
                            $scope.changeState("queueAdd.servicesAndGroups");
                        });
                    });
                } else {
                    $scope.changeState("queueAdd.servicesAndGroups");
                }
            };
            $scope.joinGroupsAndServices = function(groups, services,num) {
                $scope.slides = [];
                $scope.joinedGroupsAndServices = [];

                angular.forEach(groups, function(group) {
                    if (group.IsActive) {
                        $scope.joinedGroupsAndServices.push({
                            description: group.Description,
                            groupId: group.GroupId,
                            parentGroupId: group.ParentGourpId,
                            isGroup: true,
                            hostNumber:num
                        });
                    }
                });

                angular.forEach(services, function(service) {
                    if (service.IsActive && service !== undefined) {
                        $scope.joinedGroupsAndServices.push({
                            id: service.ServiceId,
                            description: service.Description.replace(/<[^>]*>/g, ""), //delete html tags,
                            groupId: service.GroupId,
                            isGroup: false,
                            hostNumber: num
                        });
                    }
                });

                for (var i = 0; i < $scope.joinedGroupsAndServices.length; i += $scope.slideItemsCount) {
                    $scope.slides.push({
                        id: i,
                        items: $scope.joinedGroupsAndServices.slice(i, i + $scope.slideItemsCount)
                    });
                };
            };

            $scope.getServices = function (organizationGuid, serviceCenterId, num, service) {
                if (service === undefined) {
                    $rootScope.hostName = QueueService.getHostName(num);
                    QueueService.getServices(organizationGuid, serviceCenterId, num).then(function(services) {
                        $scope.services = services;
                        $scope.services.selectedOption = services[0];
                        if ($scope.serviceIdsForDocument.indexOf(service.id) !== -1)
                            $scope.changeState("queueAdd.documentNumInput");
                        else
                            $scope.changeState("queueAdd.services");
                    });
                } else {
                    $scope.services = [{
                        id: service.id,
                        name: service.description.replace(/<[^>]*>/g, "") //delete html tags
                    }];
                    $rootScope.hostName = QueueService.getHostName(num);
                    if ($scope.isDocumentInputService(service.id))
                        $scope.changeState("queueAdd.documentNumInput");
                    else {
                        $scope.changeState("queueAdd.services");
                        $scope.services.selectedOption = $scope.services[0];
                        $scope.getDateTimes($rootScope.organizationGuid, $scope.serviceCenter.id, service.id);
                    }
                    
                }
            }

            $scope.selectService = function (service,num) {
                $scope.getServices(null,null,num,service);
            };

            $scope.isDocumentInputService = function (id) {
                var found = false;
                var services = DataModel.documentinputServices;
                for (var i = 0; i < services.length; i++) {
                    if ($rootScope.organizationGuid == services[i].organizationGuid && $scope.serviceCenter.id == services[i].serviceCenterId && id == services[i].serviceId) {
                        found = true;
                        break;
                    }
                }
                return found;
            }

//            $scope.$watch("services.selectedOption", function (selectedService) {
//                if ($scope.services && $scope.services.selectedOption)
//                    $scope.getDateTimes($rootScope.organizationGuid, $scope.serviceCenter.id, selectedService.id);
//            });

            $scope.getDateTimes = function (organizationGuid, serviceCenterId, serviceId) {
                $scope.dateTimes = undefined;

                QueueService.getAvailableDateTimes(organizationGuid, serviceCenterId, serviceId).then(function (dateTimes) {
                    $scope.dateTimes = dateTimes;
                    $scope.dateTimes.selectedOption = dateTimes[0];
                });
            }

            $scope.addDocumentNum = function (document) {
                DataModel.getProfile().then(function (profile) {
                    var profileModel = {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        patronymic: profile.patronymic,
                        legalPersonName: profile.legalPersonName,
                        phone: profile.phone,
                        email: profile.email,
                        documentNum: "3010" + document
                    };
                    
                    DataModel.deleteProfile();
                    DataModel.saveProfile(profileModel);
                });
                
                $scope.changeState("queueAdd.services");
                $scope.services.selectedOption = $scope.services[0];
                $scope.getDateTimes($rootScope.organizationGuid, $scope.serviceCenter.id, $scope.services.selectedOption.id);                
            }

            $scope.$watch("dateTimes.selectedOption", function (selectedDate) {
                if ($scope.dateTimes && $scope.dateTimes.selectedOption) {
                    $scope.times = selectedDate.times;
                    $scope.times.selectedOption = selectedDate.times[0];
                }
            });

            $scope.register = function () {
                function prepDateTime(date, time) {
                    return $filter("date")(date, "yyyy-MM-dd") + " " + $filter("date")(time, "HH:mm", "-0000");
                }

                function validateModel(model) {
                    for (var property in model) {
                        if (model.hasOwnProperty(property) && model[property] == undefined) {
                            return false;
                        }
                    }
                    return true;
                }

                var model = {
                    organizationGuid: $rootScope.organizationGuid,
                    serviceCenterId: $scope.serviceCenter.id,
                    serviceId: $scope.services.selectedOption.id,
                    dateTime: prepDateTime($scope.dateTimes.selectedOption.date, $scope.times.selectedOption.time)
                };

                if (validateModel(model))
                    QueueService.register(model).then(function (qu) {
                        $rootScope.serviceInfo = qu;
                        if (qu.Message) {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: '/scripts/webpreregistration/templates/modal.html',
                                controller: 'ModalInstanceCtrl',
                                size: "sm",
                                resolve: {
                                    message: function () {
                                        return LocalizationService.getMessage("queue.registerError");
                                        //return qu.Message;
                                    }
                                }
                            });
                            return;
                        }
                        
                        $state.go("print", {
                            organizationName: $state.params.organizationName,
                            organizationGuid: $rootScope.organizationGuid,
                            serviceCenterId: model.serviceCenterId,
                            orderGuid: qu.CustOrderGuid,
                            serviceName: $scope.services.selectedOption.name,
                            receiptNum: qu.CustReceiptNum,
                            registrationTime: model.dateTime
                        });
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
                $state.transitionTo("queueAdd.serviceCenters", {
                    organizationName: $state.params.organizationName,
                    organizationGuid: $rootScope.organizationGuid
                });
                //$scope.getServiceCenters($rootScope.organizationGuid);
            }
            initController();
        }
    ]);

angular
    .module("queue")
    .controller("ModalInstanceCtrl", [
        "$scope",
        "$uibModalInstance",
        "message",
        function ($scope, $uibModalInstance, message) {
            $scope.message = message;

            $scope.ok = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        } ]);