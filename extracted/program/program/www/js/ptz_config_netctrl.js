// JavaScript Document
GlobalInvoke(window);

var channelId = 0;
var dataMap = {};
var validator = null;
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    "Enable":["Enable"],
    "Port":["Port"],
    "PtzAddressCode":["Addr"]
};

function submitF() {
    var flag;
    if (!validator.form()) {
        return;
    }
    LAPI_FormToCfg("frmSetup",jsonMap,dataMap,mappingMap);
    if(isObjectEquals(jsonMap,jsonMap_bak)) {
         top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.NetCtrlPTZ,jsonMap);
    if(flag) {
        flag = LAPI_SetCfgData(LAPI_URL.LAPI_PTZCfg,jsonMap);
        if(flag){
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

function initPage() {
}

function initValidator() {
    $("#Port").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1025, 65535));
    $("#PtzAddressCode").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 255));
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success: function(label) {
        },
        rules: {
            Port: {
                integer: true,
                required: true,
                range:[1025, 65535]
            },
            PtzAddressCode : {
                integer : true,
                required : true,
                range : [ 0, 255 ]
            }
        }
    });
     validator.init();
}

function initEvent() {
}

//获取参数
function initData() {
    jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.NetCtrlPTZ,jsonMap) ||
            !LAPI_GetCfgData(LAPI_URL.LAPI_PTZCfg,jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup",jsonMap,dataMap,mappingMap);
}

$(document).ready(function() {
    parent.selectItem("PTZConfigNetctrlTab");//菜单选中
    beforeDataLoad();
    initPage();
    initLang();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});