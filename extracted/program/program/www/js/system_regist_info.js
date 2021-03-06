// JavaScript Document
GlobalInvoke(window);
//加载语言文件
var dataMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
	NoBrandEnable: ["HideVendor"]
};
var channelId = 0;

function submitF() {
    var flag;
	LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);  
    var isChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    if (!isChanged) {
        return;
    }
    if (isChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.RegistInfo, jsonMap);
        if (flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

// jQuery验证初始化
function initValidator() {
    
}

function initPage() {
    
}

function initData() {
	jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.RegistInfo, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
}

function initEvent() {
   
}

$(document).ready(function() {
    parent.selectItem("registInfoTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});