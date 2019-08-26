// JavaScript Document
GlobalInvoke(window);
var dataMap = {};
var jsonMap={};
var validator = null;
var mappingMap={};

function mappingMapFn() {
    var i;
    mappingMap = {};
    for (i = 0; i < jsonMap["Nums"]; i++) {
        mappingMap["streamId" + i] = ["Params", i, "StreamID"];
        mappingMap["IPAddr" + i] = ["Params", i, "Address"];
        mappingMap["Port" + i] = ["Params", i, "Port"];
    }
}
function submitF() {
    var flag;
    if (!validator.form()) return;
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.RTSPMulticastAddr, jsonMap);
    if(flag){
        jsonMap_bak = objectClone(jsonMap);
    }
}

function initPage() {
}

function checkMulAddr(ipStr){
    if ("0.0.0.0" == ipStr) {
        return 1;
    }
    if (!isIPAddress(ipStr)) // 基本验证
    {
        return 0;
    }

    var ipArray = ipStr.split(".");
    var ip1 = ipArray[0];
    if (224 > ip1 || 239 < ip1) // 第一段范围
    {
        return 0;
    }

    return 1;
}

function initValidator() {
    var i,
        len = 6;
    for (i = 0; i < len; i++) {
        $("#Port" + i).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 65535));
    }
    var $ipAddre = $(".ipAddre");
    $ipAddre.attr("tip", $.lang.tip["tipMulticastIPRange"]);
    $.validator.addMethod("checkMul", function(value) {
        return checkMulAddr(value);
    }, $.lang.tip["tipMulticastIPRange"]);
    $ipAddre.addClass("{checkMul:\"\"}");
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules : {
            Port0 : {
                integer : true,
                required : true,
                range : [0, 65535]
            },
            Port1 : {
                integer : true,
                required : true,
                range : [0, 65535]
            },
            Port2 : {
                integer : true,
                required : true,
                range : [0, 65535]
            },
            Port3 : {
                integer : true,
                required : true,
                range : [0, 65535]
            },
            Port4 : {
                integer : true,
                required : true,
                range : [0, 65535]
            },
            Port5 : {
                integer : true,
                required : true,
                range : [0, 65535]
            }
        }
    });
    validator.init();
}

function initEvent() {
}

function changeDisplayText(){
    if(jsonMap["Nums"] != 6){
        $("#streamId0").text($.lang.pub["mainVideoStream"]);
        $("#streamId1").text($.lang.pub["roleVideoStream"]);
        $("#streamId2").text($.lang.pub["thirdVideoStream"]);
    } else {
        $("#streamId0").text($.lang.pub["channelID1"]);
        $("#streamId1").text($.lang.pub["channelID2"]);
        $("#streamId2").text($.lang.pub["channelID3"]);
        $("#streamId3").text($.lang.pub["channelID4"]);
        $("#streamId4").text($.lang.pub["channelID5"]);
        $("#streamId5").text($.lang.pub["channelID6"]);
    }
    for(var i = 0; i < jsonMap["Nums"]; i++){
        $("#streamId"+i).parent().parent().removeClass("hidden");
    }
    if(top.banner.isSupportCapture && !top.banner.illegalConfigTabVisible && !(IVAMode.ILLEGAL == top.banner.IVAType)) {
        for(var i = 1; i < jsonMap["Nums"]; i++) {
            $("#streamId"+i).parent().parent().addClass("hidden");
        }
    }
}

//获取参数
function initData() {
    if (!LAPI_GetCfgData(LAPI_URL.RTSPMulticastAddr, jsonMap)) {
        disableAll();
        return;
    }
    mappingMapFn();
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
    jsonMap_bak = objectClone(jsonMap);
    changeDisplayText();
}

$(document).ready(function() {
    parent.selectItem("multicastTab");//菜单选中
    beforeDataLoad();
    initPage();
    initLang();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});