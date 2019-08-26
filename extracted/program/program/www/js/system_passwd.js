// JavaScript Document
GlobalInvoke(window);
var channelId = 0;

// 加载语言文件
loadlanguageFile(top.language);
var pageType = getparastr("pageType");
var dataMap = {};
var userMap = {};
var UserDataView = null;
var jsonMap = {};
var headInfoList = [
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId : "Name"
    },
    {
        fieldId : "Level"
    }];

function editUserInfo(type) {
    var title = (0 == type)? $.lang.pub["add"] : $.lang.pub["modify"];
    
    if (1 == type) {
        if (-1 == UserDataView.currectRow) {
            top.banner.showMsg(true, $.lang.tip["tipEditUser"], 0);
            return;
        }
        userMap = jsonMap["Users"][UserDataView.currectRow];
    } else {
        if (32 == jsonMap["Users"].length) return;
        userMap = {};
    }
    openWin(title, "userinfo_edit.htm?type=" + type, 500, 300, false,  "40", "40", true);
}

function delUser() {
    var DeleteMap = {},
        index;

    if (-1 == UserDataView.currectRow) {
        top.banner.showMsg(true, $.lang.tip["tipSelectDelData"], 0);
        return;
    }
    
    if (0 == UserDataView.currectRow) {
        top.banner.showMsg(true, $.lang.tip["tipDelUserErr"], 0);
        return;
    }
    
    if(!confirm($.lang.tip["tipConfirmDel"]))return;
    index = UserDataView.getData(UserDataView.currectRow, "ID");
    if(LAPI_DelCfgData(LAPI_URL.Users_Cfg + "/Users/" + index, DeleteMap)) {
        UserDataView.refresh();
    }

}

function getData() {
    jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.Users_Cfg, jsonMap)) {
        disableAll();
        return;
    }
    return jsonMap["Users"];
}

function initData() {

    UserDataView = new DataView("dataview_tbody", getData, headInfoList);
    UserDataView.setFields( {
        Level : function(data) {
            var text = "";
            if (0 == data) {
                text = $.lang.pub["admin"];
            } else if (1 == data) {
                text = $.lang.pub["operator"];
            } else if (2 == data) {
                text = $.lang.pub["commonUser"];
            } else if (3 == data) {
                text = $.lang.pub["anonymousUser"];
            } else if (4 == data) {
                text = $.lang.pub["extendedUser"];
            }
            return text;
        }
    });
    UserDataView.createDataView();
}

function initEvent() {
    $("#add").bind("click", function(){editUserInfo(0);});
    $("#modify").bind("click", function(){editUserInfo(1);});
    $("#del").bind("click", delUser);
}

$(document).ready(function() {
    if (1 == pageType) {
        parent.selectItem("Com_userCfgTab");
    } else {
        parent.selectItem("userCfgTab");
    }
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initEvent();
    initData();
    afterDataLoad();
});