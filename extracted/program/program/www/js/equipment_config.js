//JavaScript Document
GlobalInvoke(window);
loadlanguageFile(top.language);
var dataMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    PtzBrushMode: ["ControlMode"],
    PtzBrushSwitch: ["EnableMapTo"]
};

function submitF() {
    LAPI_FormToCfg("frmSetup", jsonMap,dataMap,mappingMap);

    var isChanged = !isObjectEquals(jsonMap,jsonMap_bak);
    if (!isChanged) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }else {
        if(!LAPI_SetCfgData(LAPI_URL.WiperInfo, jsonMap)) return;
        jsonMap_bak = objectClone(jsonMap);
    }
}

// jQuery验证初始化
function initValidator() {
    
}

function initPage() {
    if (top.banner.isSupportRainbrush) {
        $("#PtzBrushField").removeClass("hidden");        
    }
    parseCapOptions("PtzBrushMode", top.banner.rainbrushModeList, "mode");
}

function initData() {
    //支持频率设置
    if (top.banner.isSupportRainbrush) {
        jsonMap = {};
        if(!LAPI_GetCfgData(LAPI_URL.WiperInfo,jsonMap)){
            disableAll();
            return;
        }

    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap,dataMap,mappingMap);
    if(0 == $("#PtzBrushMode").val()){
        $("#PtzBrush").addClass("hidden");
    }else{
        $("#PtzBrush").removeClass("hidden");
    }
}

function initEvent() {
    $("#PtzBrushMode").change(function(){
        if(0 == $("#PtzBrushMode").val()){
            $("#PtzBrush").addClass("hidden");
        }else{
            $("#PtzBrush").removeClass("hidden");
        }
        submitF();
    });
    $("#PtzBrushSwitch").change(function() {
        submitF();
    });
}

$(document).ready(function() {
    parent.selectItem("equipmentConfigTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});