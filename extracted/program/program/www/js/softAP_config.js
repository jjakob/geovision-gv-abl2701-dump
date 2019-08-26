// JavaScript Document
GlobalInvoke(window);
//加载语言文件
loadlanguageFile(top.language);
var timeout;
var dataMap = {};
var jsonMap_ScanInfo = {};
var jsonMap_Configuration = {};
var jsonMap_Configuration_bak = {};
var mappingMap_Configuration = {
    "wifiModeType" : ["Mode"],
    "SSIDname" : ["NormalCfg","SSID"],
    "password" : ["NormalCfg","Key"],
    "EncryptionMode" : ["NormalCfg","EncryptType"],
    "SafeType" : ["NormalCfg","AuthMode"],
    "SSID" : ["SoftAPCfg","SSID"],
    "Key" : ["SoftAPCfg","Key"],
    "Channel" : ["SoftAPCfg","Channel"],
    "IpGateway" : ["SoftAPCfg","Gateway"]
};
var validator = null;
var dataView = null;
var wifiEncrypTypeList = [$.lang.pub["none"], "WEP", "CCMP","TKIP","CCMP-TKIP"];//加密方式
var wifiAuthModeList = ["OPEN", "SHARED", "WPA-PSK WPA2-PSK"];//认证模式
var headInfoList = [
    {
        fieldId : "SSID"
    },
    {
        fieldId : "Channel"
    },
    {
        fieldId : "BSSID"
    },
    {
        fieldId : "AuthMode"
    },
    {
        fieldId : "EncryptType"
    },
    {
        fieldId : "RSSOnPCT"
    },
    {
       fieldId : "RSSOnNum"
    }
];

// 降序
function desc(x, y) {
    var flag = -1;

    if (Number(x["RSSOnPCT"]) < Number(y["RSSOnPCT"])) {
        flag = 1;
    }
    return flag;
}

function submitF() {
    var $IpGateway = $("#IpGateway"),
        v = parseInt($("#wifiModeType").val());

    if (!validator.form()) return;

    if ("" == $IpGateway.val()) {
        $IpGateway.val("0.0.0.0");
    }
    LAPI_FormToCfg("frmSetup", jsonMap_Configuration, dataMap, mappingMap_Configuration);
    if (255 == v) {//若WI-FI模式选择为关闭，则WI-FI模式不变，将WI-FI关闭
        jsonMap_Configuration["Mode"] = jsonMap_Configuration_bak["Mode"];
        jsonMap_Configuration["Enable"] = 0;
    } else {
        jsonMap_Configuration["Enable"] = 1;
    }
    if (isObjectEquals(jsonMap_Configuration, jsonMap_Configuration_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    if (LAPI_SetCfgData(CMD_TYPE.WIFI_CFG, jsonMap_Configuration)) {// 刷新内存数据
        jsonMap_Configuration_bak = objectClone(jsonMap_Configuration);
        $("WifiLinkStatus").html($.lang.pub["connecting"]);
    } else {
        $("#SSIDText").text("");
        $("WifiLinkStatus").html($.lang.pub["unConnect"]);
    }
}

// 更新WiFi连接状态
function updateWiFiLinkInfo() {
    var jsonMap_LinkStatus = {};
    LAPI_GetCfgData(CMD_TYPE.WIFI_LINK_STATUS, jsonMap_LinkStatus, "", false, updateWiFiLinkInfo_callback,{async: true});
}

function updateWiFiLinkInfo_callback(resultCode, jsonMap_LinkStatus) {
    var $SSIDText = $("#WifiName"),
        $WifiLinkStatus = $("#WifiLinkStatus"),
        status,
        statusWifiName,
        ipAddress,
        netMask,
        gateWay;

    if (ResultCode.RESULT_CODE_SUCCEED != resultCode) {
        status = $.lang.pub["unConnect"];
        statusWifiName = $.lang.pub["none"];
        ipAddress = "0.0.0.0";
        netMask = "0.0.0.0";
        gateWay = "0.0.0.0";
    } else {
        status = (WiFiLinkStatus.DISCONNECT == jsonMap_LinkStatus["Connected"]) ? $.lang.pub["unConnect"] : $.lang.pub["connected"];
        statusWifiName = ("" == jsonMap_LinkStatus["SSID"]) ? $.lang.pub["none"] : jsonMap_LinkStatus["SSID"];
        ipAddress = ("" == jsonMap_LinkStatus["Address"]) ? "0.0.0.0" : jsonMap_LinkStatus["Address"];
        netMask = ("" == jsonMap_LinkStatus["Netmask"]) ? "0.0.0.0" : jsonMap_LinkStatus["Netmask"];
        gateWay = ("" == jsonMap_LinkStatus["Gateway"]) ? "0.0.0.0" : jsonMap_LinkStatus["Gateway"];
    }
    // 处理空格
    if ("string" == typeof statusWifiName) {
        statusWifiName = statusWifiName.replace(/\s/g, "&nbsp;")
    }
    $SSIDText.html(statusWifiName);
    $WifiLinkStatus.text(status);
    $("#IpAddress").text(ipAddress);
    $("#NetMask").text(netMask);
    $("#GateWay").text(gateWay);
    timeout = setTimeout("updateWiFiLinkInfo()", 9000);
}

// 获取参数
function getData() {
    var dataList = [];
    jsonMap_ScanInfo = {};
    if (0 == jsonMap_Configuration["Mode"]) {   // normal wifi
        if (!LAPI_GetCfgData(CMD_TYPE.WIFI_SCANNING_INFO, jsonMap_ScanInfo)) {
            return;
        }
        dataList = jsonMap_ScanInfo["ScanInfos"];
        // 按信号强弱排序
        dataList.sort(desc);
    }
    return dataList;
}

function initWifiDataView () {
    // 设置wifi列表的dataView
    dataView = new DataView("dataview_tbody", getData, headInfoList);
    dataView.setFields( {
        EncryptType : function(data) {
            var arr;
            arr = wifiEncrypTypeList[data];
            return arr;
        },
        AuthMode : function(data) {
            var arr;
            arr = wifiAuthModeList[data];
            return arr;
        }
    });
    dataView.createDataView();
}

function initData() {
    // 获取配置信息
    if (!LAPI_GetCfgData(CMD_TYPE.WIFI_CFG, jsonMap_Configuration)) {
        disableAll();
        return;
    }
    jsonMap_Configuration_bak = objectClone(jsonMap_Configuration);
    if (0 == jsonMap_Configuration["Enable"]) {
        jsonMap_Configuration["Mode"] = 255;
    }
    LAPI_CfgToForm("frmSetup", jsonMap_Configuration, dataMap, mappingMap_Configuration);
    if (top.banner.isSupportNormalWiFi) {
        initWifiDataView();
    }
    changeWifiModeType();
}


// jQuery验证初始化
function initValidator() {
    $("#SSID").attr("tip",$.lang.tip["tipDeviceID"]);
    $("#SSIDname").attr("tip",$.lang.tip["tipSSIDName"]);
    $("#IpGateway").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#Key").attr("tip", $.lang.tip["tipCommonName"].replace("%s", "8~32"));
    $("#password").attr("tip", $.lang.tip["tipCommonName"].replace("%s", "0~63"));
    $.validator.addMethod("checkServerID", function(value) {
        return checkServerID(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("checkCommonNamePwd", function(value) {
        return checkCommonNamePwd(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("validStrNoNull", function(value) {
        return validStrNoNull(value);
    }, $.lang.validate["valRequired"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            SSID: {
                required: true,
                maxlength:32,
                checkServerID: ""
            },
            SSIDname:{
                validStrNoNull: "",
                maxlength: 32,
                minlength: 1
            },
            password:{
                maxlength:63,
                minlength:0,
                checkCommonNamePwd:""
            },
            Key: {
                required: true,
                maxlength:32,
                minlength:8,
                checkCommonNamePwd:""
            },
            IpGateway: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            }
        }
    });
    validator.init();
}

function initPage() {
    if(top.banner.isSupportNormalWiFi) {
        $("#wifiModeType").append("<option value='0'>" + $.lang.pub["wifiConfigTitle"] + "</option>");
    } 
    if(top.banner.isSupportSoftAPWiFi) {
        $("#wifiModeType").append("<option value='1'>" + $.lang.pub["softAPTitle"] + "</option>");
    }
    if(top.banner.isSupportSnifferWIFI) {
        $("#wifiModeType").append("<option value='2'>" + $.lang.pub["snifferMode"] + "</option>");
        $(".snifferWifi").removeClass("hidden");
    }
}

function changeWifiModeType() {
    var $wifiModeType = $("#wifiModeType"),
        v = Number($wifiModeType.val()),
        $wifiStatus = $("#wifiStatus"),
        $wifiList = $("#wifiList"),
        $wifiCfg = $("#wifiCfg"),
        $wifiSignal = $("#wifiSignal");

    $wifiStatus.addClass("hidden");
    $wifiList.addClass("hidden");
    $wifiCfg.addClass("hidden");
    $wifiSignal.addClass("hidden");

    clearTimeout(timeout);
    // 恢复到初始状态（会把用户修改的值覆盖掉包括wifi模式本身）
    LAPI_CfgToForm("frmSetup", jsonMap_Configuration_bak, dataMap, mappingMap_Configuration);
    $wifiModeType.val(v);  // 恢复wifi模式设置的值

    if (0 == v) {   // wifi模式
        // 显示界面
        // 相关元素
        $wifiStatus.removeClass("hidden");
        $wifiList.removeClass("hidden");
        $wifiCfg.removeClass("hidden");

        if (0 != jsonMap_Configuration["Mode"] || 1 != jsonMap_Configuration["Enable"]) {   // 设备原先不是wifi模式
            jsonMap_Configuration["Enable"] = 1;
            jsonMap_Configuration["Mode"] = v;
            if (!LAPI_SetCfgData(CMD_TYPE.WIFI_CFG, jsonMap_Configuration, false)) {
                return;
            }
            jsonMap_Configuration_bak = objectClone(jsonMap_Configuration);
            dataView.refresh();
        }

        $("tbody tr").bind("click",indexTrMessage);
        updateWiFiLinkInfo();
    } else if (1 == v){ // 热点模式
        $wifiSignal.removeClass("hidden");
    }
}

function indexTrMessage() {
    var i = $(this).attr("rowNum");
    $("#SSIDname").val(jsonMap_ScanInfo["ScanInfos"][i]["SSID"]);
    $("#EncryptionMode").val(jsonMap_ScanInfo["ScanInfos"][i]["EncryptType"]);
    $("#SafeType").val(jsonMap_ScanInfo["ScanInfos"][i]["AuthMode"]);
}

function initEvent() {
    $("#wifiModeType").change(changeWifiModeType);
    $("#fresh").bind("click", function() {
        dataView.refresh();
        $("tbody tr").bind("click",indexTrMessage);
    });
}

$(document).ready(function() {
    parent.selectItem("softAPCfgTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initData();
    initEvent();
    afterDataLoad();
});