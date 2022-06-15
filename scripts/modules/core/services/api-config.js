"use strict";
var globalHost = "";
angular
    .module("core")
    .factory("apiConfig", function () {
        var serviceName = "QueueService.svc";
        var preRegistrationSegment = "json_pre_reg_https";
        var welcomePointSegment = "json_wellcome_point_https";
        var checkPossibilityPreRegForCurrentDay = "/WebPreRegistration/GetServiceCenterInfo?";
        var callBack = "&callback=JSON_CALLBACK";
        var httpUrlForCheckPossibilityPreRegForToday;
        var apiPortForCheckPossibilityPreRegForToday;// port for web part, need to getting possibility for today preReg

        var httpUrl;
        var apiPort;
        var httpUrlAdmSite;
        var srvCenterIds;

        function gethostForServiceCentersOrChangeHttpUrl(num) {
            num = (num != undefined) || (num != null) || (num != 0) ? num : 1;
            switch (num) {
                case 1:
                    apiPort = 443;
                    apiPortForCheckPossibilityPreRegForToday = 443;
                    httpUrl = "https://elreg.rada-uzhgorod.gov.ua";
                    httpUrlAdmSite = "https://el.rada-uzhgorod.gov.ua";
                    globalHost = [httpUrl, apiPort].join(":");
                    srvCenterIds = [1,2,15];
                    var returnedHost = {
                        host: [httpUrl, apiPort].join(":"),
                        hostPreReg: [httpUrlAdmSite, apiPortForCheckPossibilityPreRegForToday].join(":"),
                        srvCenterIds: srvCenterIds
                    };
                    return returnedHost;
                default:
                    apiPort = 8084;
                    httpUrl = "https://elreg.rada-uzhgorod.gov.ua";
                    httpUrlAdmSite = "https://el.rada-uzhgorod.gov.ua";
                    apiPortForCheckPossibilityPreRegForToday = 443;
                    globalHost = [httpUrl, apiPort].join(":");
                    srvCenterIds = [1,2,15];
                    var returnedHost = {
                        host: [httpUrl, apiPort].join(":"),
                        hostPreReg: [httpUrlAdmSite, apiPortForCheckPossibilityPreRegForToday].join(":"),
                        srvCenterIds: srvCenterIds
                    };
                    return returnedHost;

            }
        }
        return {
            hostForServiceCenters: function (num) {
                return gethostForServiceCentersOrChangeHttpUrl(num);
            },

            host: [httpUrl, apiPort].join(":"),
            //hostForCheckPossibilityForPreRegForToday: [httpUrlAdmSite, apiPortForCheckPossibilityPreRegForToday].join(":"), 
            hostForCheckPossibilityForPreRegForToday: httpUrlAdmSite,
            preRegistrationUrl: [serviceName, preRegistrationSegment].join("/"),
            welcomePointUrl: [serviceName, welcomePointSegment].join("/"),
            checkPossibilityPreRegForTodayUrl: checkPossibilityPreRegForCurrentDay,
            serviceCentersUrl: "getServiceCenterList?organisationGuid={:organizationGuid}" + callBack,
            servicesUrl: "getServiceList?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&langId=:languageId" + callBack,
            servicesUrlByCenterId: "getServicesByCenterId?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&groupId=:groupId&languageId=:languageId&preliminary=1" + callBack,
            groupsUrl: "getGroupsByCenterId?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&parentGroupId=:parentGroupId&languageId=:languageId&preliminary=1" + callBack,
            dateTimesUrl: "getDayListEx?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&serviceId=:serviceId" + callBack,
            avaiableTimesUrl: "GetDayIntervalListEx?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&serviceId=:serviceId&dateStart=:dateStart&dateEnd=:dateEnd" + callBack,
            registerUrl: "regCustomerEx?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&serviceId=:serviceId"
                + "&date=:dateTime&regTypeId=13&name=:name&phone=:phone&email=:email&customerInfo=:legalPersonName&langId=:languageId&documentNum=:documentNum" + callBack,
            receiptUrl: "getReceipt?organisationGuid={:organizationGuid}&serviceCenterId=:serviceCenterId&orderGuid={:orderGuid}" + callBack,
            avaiableToday: "orgKey={:orgKey}&srvCenterId=:serviceCenterId" + callBack
        }
    });