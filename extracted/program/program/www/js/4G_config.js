// JavaScript Document
GlobalInvoke(window);
//加载语言文件
loadlanguageFile(top.language);
var jsonMap = {};
var jsonMap_bak = {};
var statusMap = {};
var cardCfgMap = {};
var spNameList = [$.lang.pub["none"], $.lang.pub["netMobile"], $.lang.pub["netTelecom"], $.lang.pub["netUnicom"]];
var roamNameList = [$.lang.pub["no"], $.lang.pub["yes"]];
var netOnlineList = [$.lang.pub["initialization"],$.lang.pub["connected"], $.lang.pub["unConnect"],$.lang.pub["connecting"]];
var cardModeList = [$.lang.pub["card_main"], $.lang.pub["card_bak"]];

// 切换卡类型
function changeCardMode() {
    var cardMode = $("#CardMode").val();

    if (0 == cardMode) {
        cardCfgMap = jsonMap["Main"];
    } else {
        cardCfgMap = jsonMap["Bak"];
    }
    LAPI_CfgToForm("frmSetup", cardCfgMap);
}

// 获取4G状态
function get4GStatus() {
    statusMap = {};
    if (LAPI_GetCfgData(LAPI_URL.Net4GStatus, statusMap)) {
        statusMap["SP"] = spNameList[statusMap["SP"]];
        statusMap["Roam"] = roamNameList[statusMap["Roam"]];
        statusMap["NetStatus"] = netOnlineList[statusMap["NetStatus"]];
        statusMap["CardSlot"] = cardModeList[statusMap["CardSlot"]];

        setLabelValue(statusMap);
    }

    setTimeout(get4GStatus, 5000);
}

function submitF() {
    var flag;
    LAPI_FormToCfg("frmSetup", jsonMap);
    LAPI_FormToCfg("frmSetup", cardCfgMap);
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.Net4G, jsonMap);
    if (flag) {
        jsonMap_bak = objectClone(jsonMap);
    }
}

// jQuery验证初始化
function initValidator() {
    
}

function initPage() {
    
}

function initData() {
    if (!LAPI_GetCfgData(LAPI_URL.Net4G, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap);
    changeCardMode();
    get4GStatus();
}

function initEvent() {
    $("#CardMode").bind("click", changeCardMode);
}

$(document).ready(function() {
    parent.selectItem("4GCfgTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});