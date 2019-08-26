// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
//var jsonMapRoute = parent.jsonMap;
var dataMap = parent.LuMap;
var dataMap_bak = {};
var validator = null;
var flag = false;
var nums = 0;
var type = getparastr("type");
function initData() {
    document.onkeydown = shieldEsc;
    dataMap_bak = objectClone(dataMap);
    LAPI_CfgToForm("frmSetup", dataMap);
}

function checkIsNotEqual(type) {
    nums = parent.jsonMap["Nums"];
    var flag1 = [];
    var flag2 = [];
    var flag3 = false;
    var isArrayDesold = [];
    var isArrayNetold = [];
    var isArrayGateold = [];
    var isArrayDes = dataMap["Destination"].split(".");
    var isArrayNet = dataMap["Netmask"].split(".");
    var isArrayGate = dataMap["Gateway"].split(".");
    for(var i = 0; i < nums; i++) {
        if((1 == type) && (i == parent.LuDataView.currectRow)) continue;
            isArrayDesold = parent.jsonMap["RouteInfos"][i]["Destination"].split(".");
            isArrayNetold = parent.jsonMap["RouteInfos"][i]["Netmask"].split(".");
            isArrayGateold = parent.jsonMap["RouteInfos"][i]["Gateway"].split(".");
            for(var j = 0; j < isArrayDes.length; j++) {
                flag1.push(isArrayDes[j] & isArrayNet[j]);
                flag2.push(isArrayDesold[j] & isArrayNetold[j]);
            }
            flag3 = (flag1[0] == flag2[0]) && (flag1[1] == flag2[1]) && (flag1[2] == flag2[2]) && (flag1[3] == flag2[3]
                && isArrayGate[0] == isArrayGateold[0] && isArrayGate[1] == isArrayGateold[1] && isArrayGate[2] == isArrayGateold[2]
                && isArrayGate[3] == isArrayGateold[3]);
            flag1 = [];
            flag2 = [];
            if(flag3) {
                 top.banner.showMsg(false, $.lang.tip["tipRouteExist"]);
                 break;
            }
        }
        if(!flag3) {
            if(type == 0) {
                flag = LAPI_CreateCfgData(LAPI_URL.Routes + "/RouteInfos", dataMap);
            } else {
                flag = LAPI_SetCfgData(LAPI_URL.Routes + "/RouteInfos/"+dataMap["ID"], dataMap);
            }
            top.banner.showMsg(flag);
        }
    return flag;
}

function submitWinData() {
    if (!validator.form())return;
    if(type == 0) {//0表示添加
        dataMap["ID"] = -1;
        dataMap["Enabled"] = 1;
        dataMap["InterfaceID"] = 1;
        dataMap["Metric"] = 0;
        dataMap["Destination"] = $("#Destination").val();
        dataMap["Netmask"] = $("#Netmask").val();
        dataMap["Gateway"] = $("#Gateway").val();
        checkIsNotEqual(0);
    } else {//1表示编辑
        var isChangedLu = !isObjectEquals(dataMap, dataMap_bak);
        if(!isChangedLu) {
            top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
            return;
        }
        checkIsNotEqual(1);
    }
    if(flag) {
        if(parent.LuDataView)
        {
            parent.LuDataView.refresh();
        }
        parent.closeWin();
    }
}

function initPage() {
}

/**
 * 子网掩码合法性验证，前面全1，后面全0，且不允许全0或全1
 *
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function checkSubnetMask(ipStr) {
    if (!isIPAddress(ipStr)) // 基本验证
    {
        return false;
    }

    var ipArray = ipStr.split(".");
    var ip1 = parseInt(ipArray[0]);
    var ip2 = parseInt(ipArray[1]);
    var ip3 = parseInt(ipArray[2]);
    var ip4 = parseInt(ipArray[3]);

    var ipBinaryStr = format10To2(ip1) + format10To2(ip2) + format10To2(ip3) + format10To2(ip4);
    if (-1 < ipBinaryStr.indexOf("01")) {
        return false;
    }
    if (0 == (ip1 + ip2 + ip3 + ip4)) // 全0
    {
        return false;
    }
    return 1020 != (ip1 + ip2 + ip3 + ip4); // 全1
}

function checkIPPartInfoLast(ipStr) {
    if (!isIPAddress(ipStr)) {
        return false;
    } // 基本验证
    var ipArray = ipStr.split(".");
    var ip4 = ipArray[3];
    if (0 != ip4) {
        return false;
    } // 第四段范围必须为0
    return  0 == ip4;
}

function changeTxt(id) {
    dataMap[id] = $("#" + id).val();
}

function initEvent() {
    $("#Destination").bind("blur", function() {changeTxt("Destination")});
    $("#Netmask").bind("blur", function() {changeTxt("Netmask")});
    $("#Gateway").bind("blur", function() {changeTxt("Gateway")});
}

function initValidator() {
    $("#Destination").attr("tip", $.lang.tip["tipIPPartInfo"]);
    $("#Netmask").attr("tip", $.lang.tip["tipSubnetMaskInfo"]);
    $("#Gateway").attr("tip", $.lang.tip["tipGateway"]);
    $.validator.addMethod("isIPAddress", function (value) {
        return isIPAddress(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223", function (value) {
        return checkIP1To223(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("checkSubnetMask", function (value) {
        return checkSubnetMask(value);
    }, $.lang.tip["tipSubnetMaskErr"]);
    $.validator.addMethod("checkIPPartInfoLast", function (value) {
        return checkIPPartInfoLast(value);
    }, $.lang.tip["tipIPPartLastErr"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function (error, element) {
            showJqueryErr(error, element, "span");
        },
        success: function (label) {
        },
        rules: {
            Destination: {
                required: true,
                isIPAddress: "",
                checkIP1To223: "",
                checkIPPartInfoLast : ""
            },
            Netmask: {
                required: true,
                isIPAddress : "",
                checkSubnetMask : ""
            },
            Gateway: {
                required: true,
                isIPAddress: "",
                checkIP1To223: ""
            }
         }
    });
    validator.init();
}

$(document).ready(function() {
    beforeDataLoad();
    initPage();
    initLang();
    initEvent();
    initData();
    initValidator();
    afterDataLoad();
});