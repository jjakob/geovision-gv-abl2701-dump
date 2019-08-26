// JavaScript Document
GlobalInvoke(window);
var dataMap = {};
var channelId = 0;
var tempDataMap = {};// temporary data
var contentList = [ "1:rushLight", "1048576:rushLight2", "2:pinline", "32768:pinline_doubleYellow",
        "65536:pinline_yellow", "131072:pinline_stop", "4:offside", "8:wallop", "64:converse", "128:overspeed",
        "16777216:overspeed_10", "262144:overspeed_20", "33554432:overspeed_30", "67108864:overspeed_40",
        "16384:overspeed_50", "134217728:overspeed_60", "268435456:overspeed_70", "536870912:overspeed_80",
        "1073741824:overspeed_90", "524288:overspeed_100", "16:illicitlyTurnLeft", "32:illicitlyTurnRight",
        "4096:illicitlyStraight", "1024:accommodationRoad", "2048:illicitlyPark", "512:stopGreenLight", "8192:backCar",
        "256:trunRound","3:remotePlate","5:noFastenSeatBelts","6:driveTelPhone", "9:illicitlyblackList",
        "129:over20percentminspeed","130:under20percentminspeed"];
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    PassCapture:["EnableCaptureVehicle"],
    PeccancyCapture:["EnableCapturePeccancy"],
    PassMins:["VehicleFreeTimeInterval"],
    PeccancyMins:["PeccancyFreeTimeInterval"],
    Peccancy:["PeccancyType"]
};

function submitF()
{
    var flag;
    if(("0" == $("#PassCaptureDays").val() && "0" == $("#PassCaptureHours").val() && "0" == $("#PassCaptureMins").val())
       || ("0" == $("#PeccancyCaptureDays").val() && "0" == $("#PeccancyCaptureHours").val() && "0" == $("#PeccancyCaptureMins").val())) {
        top.banner.showMsg(true, $.lang.tip["tipNoneCaptureInvalid"], 0);
       return;
    }
    var PassMins = parseInt($("#PassCaptureDays").val())*24*60 + parseInt($("#PassCaptureHours").val())*60 + parseInt($("#PassCaptureMins").val());
    $("#PassMins").val(PassMins);
    var PeccancyMins = parseInt($("#PeccancyCaptureDays").val())*24*60 + parseInt($("#PeccancyCaptureHours").val())*60 + parseInt($("#PeccancyCaptureMins").val());
    $("#PeccancyMins").val(PeccancyMins);
    for(var i = 0; i < contentList.length; i++) {
        var arr = contentList[i].split(":");
        if($.lang.pub[arr[1]] == $("#PeccancyType").val()) {
            $("#Peccancy").val(arr[0]);
            break;
        }
    }
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
    if(isObjectEquals(jsonMap,jsonMap_bak)) {
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.TimerCapture, jsonMap);
    if (flag) {
        jsonMap_bak = objectClone(jsonMap);
    }
}

function initPage() {
    var strday = "",
        strhour = "",
        strmin = "",
        strpeccancy = "",
        days = 0,
        hours = 0,
        mins = 0;
    for (days = 0; days < 31; days++) {
        strday += "<option value=" + days + ">" + days + "</option>";
    }
    for(hours = 0; hours < 24; hours++) {
        strhour += "<option value=" + hours + ">" + hours + "</option>";
    }
    for(mins = 0; mins < 60; mins++) {
        strmin += "<option value=" + mins + ">" + mins + "</option>";
    }
    $("#PassCaptureDays").append(strday);
    $("#PeccancyCaptureDays").append(strday);
    $("#PassCaptureHours").append(strhour);
    $("#PeccancyCaptureHours").append(strhour);
    $("#PassCaptureMins").append(strmin);
    $("#PeccancyCaptureMins").append(strmin);
    
    if (!LAPI_GetCfgData(LAPI_URL.PECCANCY_CAPTURE_CFG, tempDataMap)) {
        disableAll();
        return false;
    }
    for(var i = 0; i < contentList.length; i++) {
        var arr = contentList[i].split(":");
        for(var j = 0; j < tempDataMap["Nums"]; j++) {
            if(arr[0] == tempDataMap["ViolationInfo"][j]["Type"] && "1" == tempDataMap["ViolationInfo"][j]["Enable"]) {
                strpeccancy += "<option>" + $.lang.pub[arr[1]] + "</option>";
            }
        }
    }
    $("#PeccancyType").append(strpeccancy);
    if("" != strpeccancy) {
        $("#peccancycapturefieldset").removeClass("hidden");
    }
}

function initEvent() {
    
}

function manualcapture() {
    var JsonMap_ManualCapture = {};
    for(var i = 0; i < contentList.length; i++) {
        var arr = contentList[i].split(":");
        if($.lang.pub[arr[1]] == $("#PeccancyType").val()) {
            JsonMap_ManualCapture["PeccancyType"] = parseInt(arr[0]);
            LAPI_SetCfgData(LAPI_URL.ManualCapturePeccancy, JsonMap_ManualCapture);
            break;
        }
    }
}

function initData() {
    jsonMap = {};
    dataMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.TimerCapture,jsonMap))
        return ;
    jsonMap_bak = objectClone(jsonMap);
    changeMapToMapByMapping(jsonMap, mappingMap, dataMap, 0);
    dataMap["PassCaptureDays"] = parseInt(dataMap["PassMins"]/(24*60));
    dataMap["PassCaptureHours"] = parseInt((dataMap["PassMins"] - dataMap["PassCaptureDays"]*24*60)/60);
    dataMap["PassCaptureMins"] = parseInt(dataMap["PassMins"] - dataMap["PassCaptureDays"]*24*60 - dataMap["PassCaptureHours"]*60);
    dataMap["PeccancyCaptureDays"] = parseInt(dataMap["PeccancyMins"]/(24*60));
    dataMap["PeccancyCaptureHours"] = parseInt((dataMap["PeccancyMins"] - dataMap["PeccancyCaptureDays"]*24*60)/60);
    dataMap["PeccancyCaptureMins"] = parseInt(dataMap["PeccancyMins"] - dataMap["PeccancyCaptureDays"]*24*60 - dataMap["PeccancyCaptureHours"]*60);
    cfgToForm(dataMap, "frmSetup");
    for(var i = 0; i < contentList.length; i++) {
        var arr = contentList[i].split(":");
        if(arr[0] == dataMap["Peccancy"]) {
            $("#PeccancyType").val($.lang.pub[arr[1]]);
            break;
        }
    }
}

$(document).ready(function(){
    parent.selectItem("noneCaptureTab");// 菜单选中
    beforeDataLoad();
    // 初始化语言标签
    initPage();
    initLang();
    initEvent();
    initData();
    afterDataLoad();
});