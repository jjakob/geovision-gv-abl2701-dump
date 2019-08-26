GlobalInvoke(window);
var pageType = getparastr("pageType");
var dataMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    HttpPort:["HttpPort"],
    HttpsPort:["HttpsPort"],
    RtspPort:["RtspPort"]
};
var repeat_jsonMap={};
var repeat_jsonMap_bak={};
var repeat_dataMap={};
var repeat_mappingMap={
    HttpPort:["port"],
    HttpsPort:["port"],
    RtspPort:["port"]
};
function needRebootOrNot() {
    if (jsonMap["RtspPort"] == jsonMap_bak["RtspPort"]) {
        return false;
    }
    return true;
}

// 下发校验，端口不能两两相同
function validatePortNotSame(value) {
    var portArr = [],
        flag = 0;
    
    portArr.push($("#RtspPort").val());
    portArr.push($("#HttpsPort").val());
    portArr.push($("#HttpPort").val());
    for (var i = 0; i < portArr.length; i++) {
        if (value == portArr[i]) {
            flag++;
        }
    }
    if (flag > 1) {
        return false;
    }
    return true;
}

//下发效验，端口不能使用一些固定端口：23，81，82，85，3260，49152
function validPortNotInBlackList(value){
    var blackList = [23,81,82,85,3260,49152];
    for (var i = 0;i < blackList.length;i++){
        if (value == blackList[i]) {
           return false ;
        }            
    }
    return true;
}

function checkPortConflict(value){
    if(LAPI_SetCfgData(LAPI_URL.CheckPort, {"Port" : Number(value)}, false)) {
        return true;
    }
    return false;
}

function initPage() {
    if (top.banner.isSupportHttps) {
        $("#HttpsDiv").removeClass("hidden");
    }
}

function submitF() {
    var flag;
    if (!validator.form()) return;
    LAPI_FormToCfg("frmSetup",jsonMap,dataMap,mappingMap);
    if (isObjectEquals(jsonMap,jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }    
    if (needRebootOrNot()) {
        if (confirm($.lang.tip["tipModifyPortReboot"])) {
            flag = LAPI_SetCfgData(LAPI_URL.Port_Cfg, jsonMap);
            if(flag) {
                jsonMap_bak = objectClone(jsonMap);
                // 遮盖界面
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.PageBlockType = BlockType.REBOOT;
                top.banner.video.isSleepReplay = true;
                top.showedFlag = false;
            }
        }
    } else {
        flag = LAPI_SetCfgData(LAPI_URL.Port_Cfg, jsonMap);
        if(flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}
function initData(){
    dataMap = {};
    jsonMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.Port_Cfg,jsonMap))
        return ;
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
}

//jquery验证框架
function initValidator() {
    $("#HttpsPort").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
    $("#HttpPort").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
    $("#RtspPort").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
    $.validator.addMethod("portNotSame", function(value) {
        return validatePortNotSame(value);
    }, $.lang.tip["tipPortExist"]);
    $.validator.addMethod("portNotInBlack", function(value) {
        return validPortNotInBlackList(value);
    }, $.lang.tip["tipPortConflict"]);  
    $.validator.addMethod("checkPortConflict", function(value) {
        return checkPortConflict(value);
    }, $.lang.tip["tipPortConflict"]);      
    validator = $("#frmSetup").validate( {
    focusInvalid : false,
    errorElement : "span",
    errorPlacement : function(error, element) {
        showJqueryErr(error, element, "div");
    },
    success : function(label) {
    },
    rules : {
        HttpsPort : {
            integer : true,
            required : true,
            range : [ 1, 65535 ], 
            portNotSame : "",
            portNotInBlack: "",
            checkPortConflict:""
        },
        HttpPort : {
            integer : true,
            required : true,
            range : [ 1, 65535 ], 
            portNotSame : "",
            portNotInBlack: "",
            checkPortConflict:""
        },
        RtspPort : {
            integer : true,
            required : true,
            range : [ 1, 65535 ], 
            portNotSame : "",
            portNotInBlack: "",
            checkPortConflict:""
        }
    }
});
    validator.init();
}

$(document).ready(function() {
        parent.selectItem("portCfgTab");//菜单选中
        beforeDataLoad();
        // 初始化语言标签
        initPage();
        initLang();
        initValidator();
        initData();
        afterDataLoad();
});