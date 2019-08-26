// JavaScript Document
GlobalInvoke(window);

var channelId = 0;
var validator = null;
var statusMap = {};
var statusMap_bak = {};
//加载语言文件
loadlanguageFile(top.language);
//将实时状态值替换为文字
function changeStatusText() {
    var textMap = {
        "RegisterStatus": [$.lang.pub["regFail"], $.lang.pub["regSucceed"]]
        };
    var key = "";
    for (key in textMap) {
        if("undefined" == typeof(statusMap[key])) continue;
        statusMap[key] = textMap[key][statusMap[key]];
    }
}
       //获取状态信息
function getStatusInfo() {
    var $Domain = $("#Domain");
    if(!LAPI_GetCfgData(LAPI_URL.CloudCfg,statusMap)){
        disableAll();
        return;
    }
    $Domain.attr("href", "http://"+statusMap["Domain"]);

    if ("" == statusMap["UserName"]){
        $("#userNameDiv").addClass("hidden");
    } else {
        $("#userNameDiv").removeClass("hidden");
    }

    if(1== statusMap["Enabled"]){
        $("#p2pOpen").attr("checked",true);
    }else{
        $("#p2pClose").attr("checked",true);
    }

    showDDNSBtn();
    changeStatusText();
    setLabelValue(statusMap);

    if ("" != statusMap["RedirectServer"] && statusMap["Domain"] != statusMap["RedirectServer"]) {
        $Domain.attr("href", "http://"+statusMap["RedirectServer"]);
        $Domain.html(statusMap["RedirectServer"]);
    }

    if ("" != statusMap["ActiveCode"]) {
        $("#qrcodeDiv").removeClass("hidden");
        $("#registID").html(statusMap["ActiveCode"]);
    } else {
        var StatuMaps = {};
        if(!LAPI_GetCfgData(LAPI_URL.LAPI_DeviceBasicInfo,StatuMaps)){
            disableAll();
            return;
        }
        $("#registID").text(StatuMaps["SerialNumber"] + statusMap["RandomCode"]);
    }
}


function logoutDDNS() {
    if(!LAPI_SetCfgData(LAPI_URL.Unregistration,"")) {
        disableAll();
        return;
    }
    statusMap["RegisterStatus"] = 0;
    showDDNSBtn();
}

function showDDNSBtn() {
    if (1 == statusMap["RegisterStatus"]) {
        $("#registState").text($.lang.pub["regSucceed"]);
        $("#DDNSLogout").removeClass("hidden");
    } else {
        $("#registState").text($.lang.pub["regFail"]);
        $("#DDNSLogout").addClass("hidden");
    }
}


function submitF() {
    var enableFlag = ($("#p2pOpen").is(":checked"))? 1 : 0;
    if (enableFlag == statusMap["Enabled"]) return;
    if(!LAPI_SetCfgData(LAPI_URL.CloudCfg,{"Enabled": enableFlag}))return;
    setTimeout("getStatusInfo()", 1000);
}

function initPage() {
    changDisplayName();
}

function initValidator() {

}

function initEvent() {
    $("#DDNSLogout").bind("click",logoutDDNS);
}
//改变文字
function changDisplayName(){
    if (parent.isUN) { // 宇视
        $("#myServerName").text($.lang.pub["myCloudName"]);
        parent.$("#P2PConfigTab").text($.lang.pub["myCloudName"]);
        parent.$("#P2PConfigLink").text($.lang.pub["myCloudName"]);
    }
}

//获取参数
function initData() {
    var urlStr = "";

    //获取参数失败或是服务器模式
    getStatusInfo();

    // 生成二维码
    if ("" != statusMap["ActiveCode"]) {
        if (parent.isUN) {
            urlStr = "http://mycloud.uniview.com/qrcode.html?";
            if (1 == parent.versionType) {    // 海外版
                urlStr = "http://en.mycloud.uniview.com/qrcode.html?";
            }
        }
        $('#qrcodeCanvas').qrcode({
            width: 100,
            height: 100,
            render: typeof G_vmlCanvasManager != 'undefined' ? 'table' : 'canvas',//决定是以canvas画图还是以table画图
            correctLevel: 0,//QRErrorCorrectLevel.M//容错率
            text: urlStr + statusMap["ActiveCode"]
        });
    }
}

$(document).ready(function() {
    parent.selectItem("P2PConfigTab");//菜单选中
    beforeDataLoad();
    initPage();
    initLang();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});