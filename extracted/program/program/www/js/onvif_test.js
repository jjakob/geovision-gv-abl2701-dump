// JavaScript Document
GlobalInvoke(window);
//加载语言文件
loadlanguageFile(top.language);
var dataMap = {};
var dataMap_bak = {};
var jsonMap = {};
var mappingMap = {
    OnvifEnable : ["OnvifEnabled"],
    AuthEnable : ["AuthenticationEnabled"],
    DiscoveryEnbalbe : ["DetectionEnbalbed"],
    OnvifTestEnable : ["OnvifTestEnabled"]
};
var channelId = 0;
var pageType = getparastr("pageType");

function submitF() {
    var isChange,
        flag;
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
    isChange = isObjectEquals(dataMap,dataMap_bak);
    if (isChange) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.OnvifDebug, jsonMap);
    if(flag){
        dataMap_bak = objectClone(dataMap);
    }

}

// jQuery验证初始化
function initValidator() {
    
}

function initPage() {
    
}

function initData() {
    jsonMap = {};
    dataMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.OnvifDebug, jsonMap)) {
        disableAll();
        return;
    }
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
    dataMap_bak = objectClone(dataMap);
}

function initEvent() {
    
}

$(document).ready(function() {
    if (1 == pageType) {
        parent.selectItem("Com_onvifTestTab")// 选中菜单
    }else {
        parent.selectItem("onvifTestTab");// 选中菜单
    }
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});