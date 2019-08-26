// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var jsonMap = {
    FontSize: [{
        ResolutionLevel: ["ResolutionLevel"],
        FontSizeXlarge: ["SuperLarge"],
        FontSizeLarge: ["Large"],
        FontSizeMiddle: ["Middle"],
        FontSizeSmall: ["Small"]
    }, {}],
    InvertOSDFont: [{
        InverseOSDEnable: ["Enabled"]
    }, {}]
};
var DefaultMap = {};
var Default_jsonMap = {};
var dataMap_bak = {};

function resetData() {
    DefaultMap = {};
    Default_jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.DefaultOSDFontSize, Default_jsonMap)) {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }
    mappingFuc(Default_jsonMap, jsonMap["FontSize"][0], DefaultMap, 0);
    cfgToForm(DefaultMap, "frmSetup"); // 更新界面
}

function initInverseOSDTable() {
    var str = "";
    for (var i = 0; i < 5; i++) {
        var value = Number(dataMap["ResolutionLevel" + i]);
        str += "<tr>" +
            "<td>" + $.lang.pub["resolution_" + value] + "</td>" +
            "<td><input type='text' id='FontSizeXlarge" + i + "' maxlength='3' style='width:80px'></td>" +
            "<td><input type='text' id='FontSizeLarge" + i + "' maxlength='3' style='width:80px'></td>" +
            "<td><input type='text' id='FontSizeMiddle" + i + "' maxlength='3' style='width:80px'></td>" +
            "<td><input type='text' id='FontSizeSmall" + i + "' maxlength='3' style='width:80px'></td>" +
            "</tr>";
    }
    $("#osdTable").append(str);
}

function initPage() {
}

function initValidator() {

}

function initEvent() { // 为界面元素绑定处理函数
    $("input[name = 'InverseOSDEnable']").bind("click", function () {
        submitF(LAPI_URL.InvertOSDFont, jsonMap["InvertOSDFont"][1], dataMap, jsonMap["InvertOSDFont"][0]);
    });
    $("#submitOSD").bind("click", function () {
        submitF(LAPI_URL.CustomOSDFontSize, jsonMap["FontSize"][1], dataMap, jsonMap["FontSize"][0]);
    });
}

//将获取的jsonMap数据映射到dataMap中
function mappingFuc(jsonMap, mappingMap, dataMap, type) {
    var temp,
        len = 5,     //样式表有5行
        i,
        n;
    if (0 == type) {
        temp = jsonMap["DemoOSDFontSizeCfg"];
        for (i = 0; i < len; i++) {
            for (n in mappingMap) {
                dataMap[n + i] = temp[i][mappingMap[n]];
            }
        }
    } else {
        temp = [{}, {}, {}, {}, {}];
        for (i = 0; i < len; i++) {
            for (n in mappingMap) {
                temp[i][mappingMap[n]] = dataMap[n + i];
            }
        }
        jsonMap["DemoOSDFontSizeCfg"] = temp;
    }
}
function LAPI_initData(url, jsonMap, TempMap, mappingMap) {
    jsonMap = {};
    if (!LAPI_GetCfgData(url, jsonMap)) {
        disableAll();
        return;
    }
    if (LAPI_URL.CustomOSDFontSize == url) {
        mappingFuc(jsonMap, mappingMap, TempMap, 0);
        initInverseOSDTable();
        cfgToForm(TempMap, "frmSetup");
    } else {
        LAPI_CfgToForm("frmSetup", jsonMap, TempMap, mappingMap);
    }
}
function submitF(url, jsonMap, tempMap, mappingMap) {
    if (LAPI_URL.CustomOSDFontSize == url) {
        formToCfg("frmSetup", tempMap);
        mappingFuc(jsonMap, mappingMap, tempMap, 1);
    } else {
        LAPI_FormToCfg("frmSetup", jsonMap, tempMap, mappingMap);
    }
    var isFanChanged = !isObjectEquals(dataMap, dataMap_bak);

    if (!isFanChanged) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
    } else {
        flag = LAPI_SetCfgData(url, jsonMap);
        if (flag) {
            dataMap_bak = objectClone(dataMap);
        } else {
            return;
        }
    }
    //数据界面不做处理，软件判断数据合理性，所以要刷新界面
    if (LAPI_URL.CustomOSDFontSize == url) {
        if (!LAPI_GetCfgData(url, jsonMap)) {
            disableAll();
            return;
        }
        mappingFuc(jsonMap, mappingMap, tempMap, 0);
        cfgToForm(tempMap, "frmSetup");
    }

}
function initData() { // 页面参数初始化
    dataMap = {};
    LAPI_initData(LAPI_URL.CustomOSDFontSize, jsonMap["FontSize"][1], dataMap, jsonMap["FontSize"][0]);
    LAPI_initData(LAPI_URL.InvertOSDFont, jsonMap["InvertOSDFont"][1], dataMap, jsonMap["InvertOSDFont"][0]);
    dataMap_bak = objectClone(dataMap);
}

$(document).ready(function () {
    parent.selectItem("demoOsdTab");// 菜单选中
    beforeDataLoad();// 公共方法，对按钮、页面风格做处理
    initPage();
    initLang();// 公共方法，加载语言
    initEvent();// 为界面元素绑定时间处理函数
    initValidator();// jquery验证方法初始化
    initData();// 页面参数初始化
    afterDataLoad();// 公共方法
});