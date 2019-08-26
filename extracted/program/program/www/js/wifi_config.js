// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var dataView = null;
var wifiEncrypTypeList = ["NONE", "WEP", "TKIP", "AES", "TKIPAES", "UNKNOW", "CCMPTKIP", "CCMP"];
var wifiAuthModeList = [ "OPEN", "SHARED", "WEPAUTO", "WPA", "WPAPSK", "WPANONE", "WPA2", "WPA2PSK", "WPA1WPA2",
        "WPA1PSKWPA2PSK", "UNKNOW" ];
var connectedWifiId = "";// 已连接的WIFI ID(指BSSID);

// 加载语言文件
loadlanguageFile(top.language);
var headInfoList = [
        {
            fieldId : "BSSID",
            hidden : true
        },
        {
            fieldId : "SSID"
        },
        {
            fieldId : "Channel"
        },
        {
            fieldId : "arpMAC"
        },
        {
            fieldId : "AuthName"
        },
        {
            fieldId : "EncrypType",
            hidden : true
        },
        {
            fieldId : "AuthMode",
            hidden : true
        },
        {
            fieldId : "Signal"
        },
        {
            fieldId : "option",
            fieldType : "option",
            option : "<a href='#' rowNum=rowNum onclick='connectWifi($(this).attr(\"rowNum\"));this.blur()'>"
                    + $.lang.pub["toConnect"] + "</a>"
        } ];

// 降序
function desc(x, y) {
    var flag = -1;

    if (Number(x["Signal"]) < Number(y["Signal"])) {
        flag = 1;
    }
    return flag;
}

// 获取参数
function getData() {
    var dataList = [];
    if ($("#wifiOpen").is(":checked")) {
        var tmpMap = {};
        if (!LAPI_GetCfgData(CMD_TYPE.WIFI_SCANNING_INFO, tmpMap)) {
            disableAll();
            return;
        }
        var scanNum = tmpMap["ScanNum"];
        for ( var i = 0; i < scanNum; i++) {
            var map = {};
            for ( var j = 0, len = headInfoList.length; j < len; j++) {
                var field = headInfoList[j]["fieldId"];
                if (undefined != tmpMap[field + i]) {
                    map[field] = tmpMap[field + i];
                } else {// 处理自定义数据
                    var v = "";
                    if ("SafeType" == field) {
                        v = tmpMap["AuthMode" + i] + "," + tmpMap["EncrypType" + i];
                    }
                    map[field] = v;
                }
            }

            dataList.push(map);
        }
    }

    // 按信号强弱排序
    dataList.sort(desc);
    return dataList;
}

function submitF() {
    var flag = false;
    var pcParam = sdkGetValueString("frmSetup", dataMap);
    var retcode = top.sdk_viewer.ViewerAxSetConfig(channelId, CMD_TYPE.WIFI_CFG, pcParam);
    if (ResultCode.RESULT_CODE_SUCCEED == retcode) {// 刷新内存数据
        formToCfg("frmSetup", dataMap);
        $("#SSIDText").text($("#SSID").val());
        $("WifiLinkStatus").html($.lang.pub["connecting"]);
        flag = true;
    } else {
        $("#SSIDText").text("");
        $("WifiLinkStatus").html($.lang.pub["unConnect"]);
    }
    return flag;
}

// 连接Wifi   没有复制该函数
function connectWifi(rowNum) {
    var wifiInfo = dataView.getData(rowNum);
    cfgToForm(wifiInfo, "frmSetup");
    if (WIFI_ENCRYPT_TYPE.NONE != $("#EncrypType").val()) {
        openWin($.lang.pub["connectTo"] + $("#SSID").val(), "wifi_info.htm?type=connect", 350, 150, false);
    } else {
        $("#Key").val("");
        submitF();
    }
}

// 更新WiFi连接状态
function updateWiFiLinkInfo() {
    var $SSIDText = $("#SSIDText");
    var $WifiLinkStatus = $("#WifiLinkStatus");
    if (!$("#wifiOpen").is(":checked")) {
        $SSIDText.text("");
        $WifiLinkStatus.text($.lang.pub["unConnect"]);
        return;
    }
    var tmpMap = {};
    if (!getCfgData(channelId, CMD_TYPE.WIFI_LINK_STATUS, tmpMap)) {
        disableAll();
        return;
    }
    var status = (WiFiLinkStatus.DISCONNECT == tmpMap["WifiLinkStatus"]) ? $.lang.pub["unConnect"]
            : $.lang.pub["connectTo"];
    var ipAddress = ("" == tmpMap["IpAddress"]) ? "0.0.0.0" : tmpMap["IpAddress"];
    var netMask = ("" == tmpMap["NetMask"]) ? "0.0.0.0" : tmpMap["NetMask"];
    var gateWay = ("" == tmpMap["GateWay"]) ? "0.0.0.0" : tmpMap["GateWay"];
    $SSIDText.text(tmpMap["SSID"]);
    $WifiLinkStatus.text(status);
    $("#IpAddress").text(ipAddress);
    $("#NetMask").text(netMask);
    $("#GateWay").text(gateWay);
    $("#BSSID").val(tmpMap["BSSID"]);
    updateWiFiListLinkStatus();
    setTimeout("updateWiFiLinkInfo()", 5000);
}

// 更新列表中的连接状态   没有复制该函数
function updateWiFiListLinkStatus() {
    var flag = 0;

    $("#dataview_tbody").find("tr").each(function() {
        var rowNum = $(this).attr("rowNum");
        var wifiId = dataView.getData(rowNum, "BSSID");

        // 更新老的连接的状态
            if (connectedWifiId == wifiId) {
                $("#option" + rowNum).html(
                        "<a href='#' rowNum=" + rowNum
                                + " onclick='connectWifi($(this).attr(\"rowNum\"));this.blur()'>"
                                + $.lang.pub["connectWifi"] + "</a>");
                flag++;
            }

            // 更新新的连接的状态
        var $BSSID = $("#BSSID");
        if ($BSSID.val() == wifiId) {
                $("#option" + rowNum).html($.lang.pub["connected"]);
                connectedWifiId = $BSSID.val();
                flag++;
            }

            if (2 == flag)
                return false;
        });
}

// 使能/不使能刷新和手动添加按钮
function EnableBtn() {
    if ($("#wifiOpen").is(":checked")) {
        $("#fresh").attr("disabled", false);
        $("#add").attr("disabled", false);
    } else {
        $("#fresh").attr("disabled", "disabled");
        $("#add").attr("disabled", "disabled");
    }
}

function init() {

    // 获取配置信息
    if (!getCfgData(channelId, CMD_TYPE.WIFI_CFG, dataMap)) {
        disableAll();
        return;
    }
    cfgToForm(dataMap, "frmSetup");
    EnableBtn();

    // 若wifi启用则获取并显示当前连接状态
    if (1 == dataMap["Enable"]) {
        updateWiFiLinkInfo();
    }

    // 设置wifi列表的dataView
    dataView = new DataView("dataview_tbody", getData, headInfoList);
    dataView.setTrEvnet( {
        ondblclick : function(obj) {
            var obj = obj.srcElement;
            for (; "TR" != obj.tagName;) {
                obj = obj.parentNode;
            }
            connectWifi($(obj).attr("rowNum"));
        }
    });
    dataView.setFields( {
        NetworkType : function(data) {
            if (WIFI_NETWORK_TYPE.INFRA == data)
                data = "Infrastructure";
            if (WIFI_NETWORK_TYPE.ADHOC == data)
                data = "AdHoc";
            return data;
        },
        SafeType : function(data) {
            var arr = data.split(",");
            data = wifiAuthModeList[arr[0]];
            if (2 == arr.length) {
                data += "/" + wifiEncrypTypeList[arr[1]];
            }
            data = ("OPEN/NONE" == data) ? $.lang.pub["openWifi"] : data;
            return data;
        },
        Signal : function(data) {
            if (0 == data) {
                data = "<div title='" + data + "' class='signal_0 icon'></div>";
            } else if (data > 0 && data < 21) {
                data = "<div title='" + data + "' class='signal_1 icon'></div>";
            } else if (data > 20 && data < 41) {
                data = "<div title='" + data + "' class='signal_2 icon'></div>";
            } else if (data > 40 && data < 61) {
                data = "<div title='" + data + "' class='signal_3 icon'></div>";
            } else if (data > 60 && data < 81) {
                data = "<div title='" + data + "' class='signal_4 icon'></div>";
            } else if (data > 80 && data < 101) {
                data = "<div title='" + data + "' class='signal_5 icon'></div>";
            }
            return data;
        }
    });
    dataView.createDataView();
}

$(document).ready(function() {
    parent.selectItem("wifiTab");// 菜单选中
        beforeDataLoad();

        // 初始化语言标签
        initLang();
        $("input[name='Enable']").bind("click", function() {
            var tmpMap = {
                Enable : 0
            };
            if (setCfgData(channelId, CMD_TYPE.WIFI_CFG, "frmSetup", tmpMap)) {
                EnableBtn();
                dataView.refresh();
                updateWiFiLinkInfo();
            } else {
                if($("#wifiOpen").is(":checked")){
                    $("#wifiClose").attr("checked", true);
                }else{
                    $("#wifiOpen").attr("checked", true);
                }
            }
        });

        $("#fresh").bind("click", function() {
            dataView.refresh();
            updateWiFiListLinkStatus();
        });
        $("#add").bind("click", function() {
            openWin($.lang.pub["add"] + " Wi-Fi", "wifi_info.htm?type=add", 350, 200, false);
        });
        init();
        updateWiFiLinkInfo();
        afterDataLoad();
    });