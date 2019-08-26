// JavaScript Document
GlobalInvoke(window);

var channelId = 0;
var jsonMap = {};
var jsonMap_bak = {};
var MaxVerAngle = [];

var mappingMap_PTZAbsPosition = {
    Latitude:["StatusParam","PTZAbsPostion","Latitude"],
    Longitude:["StatusParam","PTZAbsPostion","Longitude"],
    MoveSpeed:["StatusParam","PTZAbsPostion","MoveSpeed"]
};
var mappingMap_PTZAbsZoom ={
    PtzZoomNum : ["StatusParam","PTZAbsZoom","PTZZoomNum"],
    PtzZoomSpeed:["StatusParam","PTZAbsZoom","PTZZoomSpeed"]
};

function submitF() {
    var flag;

    if(isObjectEquals(jsonMap,jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }

    flag = LAPI_SetCfgData(LAPI_URL.LAPI_PTZAngleLimit,jsonMap);
    if (flag) {
        jsonMap_bak = objectClone(jsonMap);
    }

}

function initPage() {
    resetVideoSize(StreamType.LIVE, "recordManager_div_activeX");
    initVideo("recordManager_div_activeX", StreamType.LIVE, RunMode.CONFIG, null, top.banner.isSupportPTZ);
}


function enableLimit(){
    if( 0 == jsonMap["Enable"]){
        document.getElementById("startEA").innerText=$.lang.pub["StopPTZLimit"];
        jsonMap["Enable"] = 1;
        $("#submit_btn").attr("disabled",true);
    }else{
        document.getElementById("startEA").innerText=$.lang.pub["StartPTZLimit"];
        jsonMap["Enable"] = 0;
        $("#submit_btn").attr("disabled",false);
    }
    LAPI_SetCfgData(LAPI_URL.LAPI_PTZAngleLimitSwitch,jsonMap);
}

function initEvent() {
    $("#startEA").click(function() {
        enableLimit(this);

    });

    $("div[name='delete']").click(function() {
        clearPtzAbsPosByLimitId(this.id)
    });

    $("div[name='move']").click(function() {
        gotoPtzAbsPosByLimitId(this.id)
    });

    $("img[name='pin']").click(function() {
        getPtzAbsPosByLimitId(this.id);
    });
}
function release(){
    parent.hiddenVideo();

}
//��ȡ����
function initData() {
    jsonMap = {};
    MaxVerAngle = [];

    for(var i = 0;i < top.banner.MaxVerAngle.length; i++){
        MaxVerAngle[i] = top.banner.MaxVerAngle[i]*100;
    }
    if (!LAPI_GetCfgData(LAPI_URL.LAPI_PTZAngleLimitSwitch,jsonMap) ||
        !LAPI_GetCfgData(LAPI_URL.LAPI_PTZAngleLimit,jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);

    if( 0 == jsonMap["Enable"]){
        document.getElementById("startEA").innerText=$.lang.pub["StartPTZLimit"];
        $("#submit_btn").attr("disabled",false);
    }else{
        document.getElementById("startEA").innerText=$.lang.pub["StopPTZLimit"];
        $("#submit_btn").attr("disabled",true);
    }
    updateLimitPosBtnStatus();
}

 //������λ��ť״̬
function updateLimitPosBtnStatus(preStr) {
    var strPrefixList = [];

    if ("undefined" == typeof (preStr)) {
        strPrefixList = strPrefixList.concat("Left", "Right", "Up", "Down");
    } else {
        strPrefixList.push(preStr);
    }

    for (i = 0, len = strPrefixList.length; i < len; i++) {
        strPrefix = strPrefixList[i];
        if("Up" == strPrefix ){
            if(jsonMap[strPrefix] != parseInt(MaxVerAngle[0])){
                $("#" + strPrefix + "Move").removeClass("call-preset-disable").addClass("call-preset-enable");
                $("#" + strPrefix + "Delete").removeClass("del-disable").addClass("del-enable");
            }else{
                $("#" + strPrefix + "Move").removeClass("call-preset-enable").addClass("call-preset-disable");
                $("#" + strPrefix + "Delete").removeClass("del-enable").addClass("del-disable");}
        }
        if("Down" == strPrefix ){
            if(jsonMap[strPrefix] != parseInt(MaxVerAngle[1])){
                $("#" + strPrefix + "Move").removeClass("call-preset-disable").addClass("call-preset-enable");
                $("#" + strPrefix + "Delete").removeClass("del-disable").addClass("del-enable");
            }else{
                $("#" + strPrefix + "Move").removeClass("call-preset-enable").addClass("call-preset-disable");
                $("#" + strPrefix + "Delete").removeClass("del-enable").addClass("del-disable");}
        }
        if("Left" == strPrefix ){
            if(jsonMap[strPrefix] != parseInt(MaxVerAngle[2])){
                $("#" + strPrefix + "Move").removeClass("call-preset-disable").addClass("call-preset-enable");
                $("#" + strPrefix + "Delete").removeClass("del-disable").addClass("del-enable");
            }else{
                $("#" + strPrefix + "Move").removeClass("call-preset-enable").addClass("call-preset-disable");
                $("#" + strPrefix + "Delete").removeClass("del-enable").addClass("del-disable");}
        }
        if("Right" == strPrefix ){
            if(jsonMap[strPrefix] != parseInt(MaxVerAngle[3])){
                $("#" + strPrefix + "Move").removeClass("call-preset-disable").addClass("call-preset-enable");
                $("#" + strPrefix + "Delete").removeClass("del-disable").addClass("del-enable");
            }else{
                $("#" + strPrefix + "Move").removeClass("call-preset-enable").addClass("call-preset-disable");
                $("#" + strPrefix + "Delete").removeClass("del-enable").addClass("del-disable");}
        }
    }
}

// ��ȡ��̨λ�ã���γ�Ⱥͱ��ʣ�
function getPtzAbsPos(absPosMap) {

    var flag,
        jsonMap_PTZAbsPosition = {},
        jsonMap_PTZAbsZoom = {};

    if (!LAPI_GetCfgData(LAPI_URL.PTZAbsPosition,jsonMap_PTZAbsPosition) ||
        !LAPI_GetCfgData(LAPI_URL.PTZAbsZoom,jsonMap_PTZAbsZoom)) {

        top.banner.showMsg(false, $.lang.tip["tipGetPtzPosErr"]);

        flag = false;

    }

    else {
        changeMapToMapByMapping(jsonMap_PTZAbsPosition,mappingMap_PTZAbsPosition,absPosMap,0);
        changeMapToMapByMapping(jsonMap_PTZAbsZoom,mappingMap_PTZAbsZoom,absPosMap,0);
        flag = true;
    }
    return flag;

}

// ������λID��ȡ��Ӧ����̨λ��
function getPtzAbsPosByLimitId(id) {
    var tmpMap = {},
        strPrefix = id.replace("Pin", "");

    if (!getPtzAbsPos(tmpMap))
        return;

    if("Up" == strPrefix || "Down" == strPrefix ){
        jsonMap[strPrefix]= tmpMap["Latitude"] * 100;
    }else{
        jsonMap[strPrefix]= tmpMap["Longitude"] * 100;
    }

    updateLimitPosBtnStatus(strPrefix);
}

// ������λID����̨ת����Ӧ��λ��
function gotoPtzAbsPosByLimitId(id) {
    var strPrefix = id.replace("Move", ""),
        longitude,
        latitude,
        zoomNum,
        tmpMap = {};
    if (!getPtzAbsPos(tmpMap))
        return;

    var station = (jsonMap[strPrefix]);
    if ($("#" + id).hasClass("preset_disable"))
        return;
    if ("Up" == strPrefix || "Down" == strPrefix) {
        longitude = Math.round(tmpMap["Longitude"] * 100);
        LAPI_SetCfgData(LAPI_URL.PTZAbsoluteMove, {"PTZCmd": "32769", "Para1": longitude, "Para2": station});
    } else {
        latitude = Math.round(tmpMap["Latitude"] * 100);
        LAPI_SetCfgData(LAPI_URL.PTZAbsoluteMove, {"PTZCmd": "32769", "Para1": station, "Para2": latitude});
    }
    zoomNum = Math.round(tmpMap["PtzZoomNum"] * 100);
    LAPI_SetCfgData(LAPI_URL.PTZAbsoluteMove, {"PTZCmd": "32770", "Para1": zoomNum});
}

// ������λID�����λ��Ϣ
function clearPtzAbsPosByLimitId(id) {
    var strPrefix = id.replace("Delete", "");

    if ($("#" + id).hasClass("remove_disable"))
        return;

    if("Up" == strPrefix ){
        jsonMap[strPrefix] = parseInt(MaxVerAngle[0]);
    }
    if("Down" == strPrefix ){
        jsonMap[strPrefix] = parseInt(MaxVerAngle[1]);
    }
    if("Left" == strPrefix ){
        jsonMap[strPrefix] = parseInt(MaxVerAngle[2]);
    }
    if("Right" == strPrefix ){
        jsonMap[strPrefix] = parseInt(MaxVerAngle[3]);
    }
    updateLimitPosBtnStatus(strPrefix);
}
$(document).ready(function() {
    parent.selectItem("PTZLimitTab");//�˵�ѡ��
    beforeDataLoad();
    initPage();
    initLang();
    initEvent();
    initData();
    afterDataLoad();
});/**
 * Created by w02927 on 2015/12/14.
 */
