"use strict";

angular
    .module("print")
    .controller("PrintController", [
        "$scope",
        "$rootScope",
        "$state",
        "$stateParams",
        "$timeout",
        "LocalizationService",
        "PrintService",
        "DataModel",
        function ($scope, $rootScope, $state, $stateParams, $timeout, LocalizationService, PrintService, DataModel) {
            $scope.printReceipt = function () {
                PrintService.printReceipt($rootScope.organizationGuid, $scope.receiptInfo.serviceCenterId, $scope.receiptInfo.orderGuid,$rootScope.hostName)
                .then(function (receipt) {
                    $("#printFrame").remove();

                    var iframe = document.createElement("iframe");
                    iframe.frameBorder = 0;
                    iframe.width = "0px";
                    iframe.height = "0px";
                    iframe.id = "printFrame";

                    document.body.appendChild(iframe);
                    document.getElementById("printFrame").contentWindow.document.write(receipt);

                    var frm = document.getElementById("printFrame").contentWindow;
                    frm.focus();
                    frm.print();
                    $timeout(function () {
                        $scope.home();
                    }, 5000);
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

                $scope.receiptInfo = {
                    serviceCenterId: $stateParams.serviceCenterId,
                    orderGuid: $stateParams.orderGuid,
                    receiptNum: $stateParams.receiptNum,
                    serviceName: $stateParams.serviceName,
                    registrationTime: new Date ($stateParams.registrationTime)
                };

                DataModel.getProfile().then(function (profileModel) {
                    $scope.receiptInfo.userName = [profileModel.lastName, profileModel.firstName, profileModel.patronymic]
                        .filter(function (val) {
                            return val;
                        }).join(" ");

                    $scope.receiptInfo.userEmail = profileModel.email;
                });
            }

            initController();
        }
    ]);