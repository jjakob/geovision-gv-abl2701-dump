// JavaScript Document
GlobalInvoke(window);
var channelId = 0;

// 加载语言文件
loadlanguageFile(top.language);
var dataMap = {};
var LuMap = {};
var LuDataView = null;
var jsonMap = {};
var jsonMap_bak = {};
var routeNum = top.banner.routeMaxNum;//配置路由的最大个数
var headInfoList = [
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "Destination"
    },
    {
        fieldId: "Netmask"
    },
    {
        fieldId: "Gateway"
    }
];

function editLuInfo(type) {
    var title = (0 == type)? $.lang.pub["add"] : $.lang.pub["modify"];

    if (1 == type) {
        if (-1 == LuDataView.currectRow) {
            top.banner.showMsg(true, $.lang.tip["tipEditLu"], 0);
            return;
        }
        LuMap = jsonMap["RouteInfos"][LuDataView.currectRow];
    } else {
        if (routeNum == jsonMap["Nums"]) {
            top.banner.showMsg(false, $.lang.tip["tipMaxRouteNums"]);
            return;
        }
        LuMap = {};
    }
    openWin(title, "Luinfo_edit.htm?type=" + type, 400, 210, false,  "450", "150", true);
}

function delLu() {
    var DeleteMap = {},
        index;

    if (-1 == LuDataView.currectRow) {
        top.banner.showMsg(true, $.lang.tip["tipSelectDelLuData"], 0);
        return;
    }
    if(!confirm($.lang.tip["tipConfirmDel"]))return;
    index = LuDataView.getData(LuDataView.currectRow, "ID");
    if(LAPI_DelCfgData(LAPI_URL.Routes + "/RouteInfos/"+index, DeleteMap)) {
        LuDataView.refresh();
    }

}

function getData() {
    jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.Routes, jsonMap)) {
        disableAll();
        return;
    }
    return jsonMap["RouteInfos"];
}

function initDataView() {

    LuDataView = new DataView("dataview_tbody", getData, headInfoList);
    LuDataView.createDataView();
}

function initEvent() {
    $("#add").bind("click", function(){editLuInfo(0);});
    $("#modify").bind("click", function(){editLuInfo(1);});
    $("#del").bind("click", delLu);
}

$(document).ready(function() {
    parent.selectItem("customLuTab");//选中菜单
    beforeDataLoad();
    // 加载语言文件
    initLang();
    initEvent();
    initDataView();
    afterDataLoad();
});