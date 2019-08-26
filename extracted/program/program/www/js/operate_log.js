// JavaScript Document
var channelId = 0;
GlobalInvoke(window);
var validator =null;
var OperateLogOnceNum = 10;//每页有10条
var OperateLogType={
        IMOS_MW_OPERATE_LOG_OP : 1000,
        IMOS_MW_OPERATE_LOG_ALM : 2000
};
var OperateLogSubType = {
    OPERATE_LOG: 1000,
    OPERATE_LOG_LOGIN: 1001,
    OPERATE_LOG_REBOOT: 1002,
    OPERATE_LOG_DEFAULT: 1003,
    OPERATE_LOG_NETWORK: 1004,
    OPERATE_LOG_PORT: 1005,
    OPERATE_LOG_DNS: 1006,
    OPERATE_LOG_UNP: 1007,
    OPERATE_LOG_MANAGEMENT: 1008,
    OPERATE_LOG_NTP: 1009,
    OPERATE_LOG_HTTP: 1010,
    OPERATE_LOG_BM: 1011,
    ALM_LOG: 2000,
    ALM_LOG_TEM_HIGH: 2001,
    ALM_LOG_TEM_LOW: 2002,
    ALM_LOG_TEM_CLEAR: 2003,
    ALM_LOG_MOTION_DETECTION: 2004,
    ALM_LOG_MOTION_CLEAR: 2005,
    ALM_LOG_TAMPER_DETECTION: 2006,
    ALM_LOG_TAMPER_CLEAR: 2007,
    ALM_LOG_INPUT_DETECTION: 2008,
    ALM_LOG_INPUT_CLEAR: 2009,
    ALM_LOG_AUDIO_DETECTION: 2010,
    ALM_LOG_AUDIO_CLEAR: 2011
};
var jsonMap_OperateLogOnceNum = {
    Limit: 10,
    Offset: 0
};
var jsonMap = {};
var days,time;
var headInfoList = [
        {
            fieldId : "rowNum",
            fieldType: "RowNum"
        },
        {
            fieldId : "MainType"
        },
        {
            fieldId : "Day"
        },
        {
            fieldId : "Time"
        },
        {
            fieldId : "UserName"
        },
        {
            fieldId : "UserIP"
        },        
        {
            fieldId : "SubType"
        } ];

function getData() {
    var currentPage = Number($("#currentPage").val());
    var dataList = [];
    var top = GetTopWindow();

    jsonMap = {};
    jsonMap_OperateLogOnceNum["Offset"] = (currentPage - 1) * 10;
    if (!LAPI_CreateCfgData(LAPI_URL.Logs, jsonMap_OperateLogOnceNum,false,logCallBack)) {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }

    for (var index = 0; index < jsonMap["Nums"]; index++) {
        var map = {};
        for (var i = 0, len = headInfoList.length; i < len; i++) {
            var field = headInfoList[i]["fieldId"];
            if (undefined != jsonMap["Logs"][index][field] && field != "Day" ) {
                if (field == "Time") {
                    getLocalTime(jsonMap["Logs"][index]["Time"]);
                    map[field] = time;
                }  else {
                    map[field] = jsonMap["Logs"][index][field];
                }
            }else if (field == "Day") {
                getLocalTime(jsonMap["Logs"][index]["Time"]);
                map[field] = days;
            }
        }
        dataList.push(map);
    }

    var totalPage = parseInt(jsonMap["Total"] / jsonMap_OperateLogOnceNum["Limit"]) + 1;
    $("#totalPage").text(totalPage);
    return dataList;
}
function logCallBack(retCode,retData){
    if(retCode == ResultCode.RESULT_CODE_SUCCEED){
        jsonMap = retData.Data;
    }
}
function getLocalTime(utcTime) {
    var LocalTime = new Date(parseInt(utcTime) * 1000),
        year = LocalTime.getFullYear(),
        month = LocalTime.getMonth() + 1,
        day = LocalTime.getDate(),
        hour = LocalTime.getHours(),
        minute = LocalTime.getMinutes(),
        seconds = LocalTime.getSeconds();
    month = (month < 10) ? "0" + month : month;
    day = (day < 10) ? "0" + day : day;
    hour = (hour < 10) ? "0" + hour : hour;
    minute = ( minute < 10) ? "0" + minute : minute;
    seconds = ( seconds < 10) ? "0" + seconds : seconds;
    days = year + "-" + month + "-" + day;
    time = hour + ":" + minute + ":" + seconds;
}
function init() {
    dataView = new DataView("dataview_tbody", getData, headInfoList);
    dataView.setFields( {
        MainType : function(data) {
            if (OperateLogType.IMOS_MW_OPERATE_LOG_OP == data)
                data = $.lang.pub["logTypeOP"];
            if (OperateLogType.IMOS_MW_OPERATE_LOG_ALM == data)
                data = $.lang.pub["logTypeALM"];            
            return data;
        },
        SubType: function (data) {
            switch (data) {
                case OperateLogSubType.OPERATE_LOG:
                    data = $.lang.pub["logTypeOP"];
                    break;
                case OperateLogSubType.OPERATE_LOG_LOGIN:
                    data = $.lang.pub["login"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_REBOOT:
                    data = $.lang.pub["operateLogReboot"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_DEFAULT:
                    data = $.lang.pub["restoreLaser"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_NETWORK:
                    data = $.lang.pub["operateLogNetwork"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_PORT:
                    data = $.lang.pub["operateLogPort"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_DNS:
                    data = $.lang.pub["operateLogDNS"];
                    break;
                case   OperateLogSubType.OPERATE_LOG_UNP:
                    data = $.lang.pub["operateLogUNP"];
                    break;
                case   OperateLogSubType.OPERATE_LOG_MANAGEMENT:
                    data = $.lang.pub["operateLogManagement"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_NTP:
                    data = $.lang.pub["operateLogNTP"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_HTTP:
                    data = $.lang.pub["operateLogHTTP"];
                    break;
                case  OperateLogSubType.OPERATE_LOG_BM:
                    data = $.lang.pub["operateLogBM"];
                    break;
                case  OperateLogSubType.ALM_LOG:
                    data = $.lang.pub["logTypeALM"];
                    break;
                case  OperateLogSubType.ALM_LOG_TEM_HIGH:
                    data = $.lang.pub["almLogHighTem"];
                    break;
                case  OperateLogSubType.ALM_LOG_TEM_LOW:
                    data = $.lang.pub["almLogLowTem"];
                    break;
                case OperateLogSubType.ALM_LOG_TEM_CLEAR:
                    data = $.lang.pub["almLogTemClear"];
                    break;
                case OperateLogSubType.ALM_LOG_MOTION_DETECTION:
                    data = $.lang.pub["almLogMotionDet"];
                    break;
                case  OperateLogSubType.ALM_LOG_MOTION_CLEAR:
                    data = $.lang.pub["almLogMotionClear"];
                    break;
                case  OperateLogSubType.ALM_LOG_TAMPER_DETECTION:
                    data = $.lang.pub["almLogTamperDet"];
                    break;
                case OperateLogSubType.ALM_LOG_TAMPER_CLEAR:
                    data = $.lang.pub["almLogTamperClear"];
                    break;
                case  OperateLogSubType.ALM_LOG_INPUT_DETECTION:
                    data = $.lang.pub["almLogInputDet"];
                    break;
                case   OperateLogSubType.ALM_LOG_INPUT_CLEAR:
                    data = $.lang.pub["almLogInputClear"];
                    break;
                case   OperateLogSubType.ALM_LOG_AUDIO_DETECTION:
                    data = $.lang.pub["almLogAudioDet"];
                    break;
                case  OperateLogSubType.ALM_LOG_AUDIO_CLEAR:
                    data = $.lang.pub["almLogAudioClear"];
                    break;
                default:
                    data = $.lang.pub["other"];
                    break;
            }
            return data;
        }

    });
    dataView.createDataView();
}
    
function  getNextPage() {
    var $currentPage = $("#currentPage");
    var currentPage = Number($currentPage.val());
    var totalPage = Number($("#totalPage").text());
    if ( currentPage >= totalPage ) return;
    $currentPage.val(currentPage+1);
    dataView.refresh();
}

function getPrePage() {
    var $currentPage = $("#currentPage");
    var currentPage = Number($currentPage.val());
    if (currentPage <= 1  ) return;
    $currentPage.val(currentPage-1);
    dataView.refresh();    
}

function  initEvent() {
    $("#prePage").bind("click",function(){
            getPrePage();
    });
    $("#nextPage").bind("click",function(){
        getNextPage();
    });
    $("#currentPage").change(function(){
        if ( 1 == isCurrPageValid()){
            dataView.refresh();       
        }
    });
}

function isCurrPageValid() {
    var currentPage = Number($("#currentPage").val());
    var totalPage = Number($("#totalPage").text());
    
    if ((currentPage > totalPage) || (currentPage < 1)) {
        return 0;
    }
    return 1;
}

function initValidator() {      // jquery验证方法初始化
    $("#currentPage").attr("tip", $.lang.tip["tipPagerCurrPageErr"]);
    $.validator.addMethod("validCurrentPage", function(value) {
        return isCurrPageValid();
    },$.lang.tip["tipPagerCurrPageErr"]);
    
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            currentPage: {
                integer: true,
                required: true,
                validCurrentPage: ""
            }           
        }
    });
    validator.init();
}
            

$(document).ready(function(){
    parent.selectItem("operateLogTab");//菜单选中
    beforeDataLoad();                
    //初始化语言标签
    initLang();
    initEvent();
    initValidator();
    init(); 
    afterDataLoad();
});
