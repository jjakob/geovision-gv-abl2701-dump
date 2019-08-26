// JavaScript Document
GlobalInvoke(window);
var validator = null;
var bChgIPSuccess = true;
var g_ajaxReq = null;
var timerId = null;
var netIfaceNum = top.banner.ElectPortNum;
var dataMap = {};
var ipv6Map = {};
var channelId = 0;
var TimeId = 0;     // 定时器id
var needValid = 1;  // 是否需要校验
var pageType = getparastr("pageType");
var jsonMapInterface = {};
var jsonMapInterface_bak = {};
var mappingMapInterface = {
    IPGetType: ["IPv4","IPGetType"],
    UserName: ["IPv4","PPPoE","UserName"],
    Password:["IPv4","PPPoE","Password"],
    MTULen: ["MTU"],
    WorkMode: ["WorkMode"],
    v6Mode: ["IPv6","IpGetType"]
};
var mappingMapIPv4 = {
    IpAddress:["Address"],
    IpNetmask:["Netmask"],
    IpGateway:["Gateway"]
}

var mappingMapIPv6 = {
    Ipv6Address:["Address"],
    PrefixLenth:["PrefixLenth"],
    Ipv6Gateway:["Gateway"]
}
var IPAddrDataView;

var currentIPtab = -1;

var headInfoList = [
    {
        fieldId: "ipAddrId",
        hidden: true
    },
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "Destination",
        fieldType: "text",
        eventMap: {
            "onchange": netContent_change
        }
    },
    {
        fieldId: "Netmask",
        fieldType: "text",
        eventMap: {
            "onchange": netContent_change
        }
    },
    {
        fieldId: "option",
        fieldType: "option",
        option: "<a href='#' class='icon black-del' rowNum=rowNum onclick='delIPAddr($(this).attr(\"rowNum\"));' title='"
        + $.lang.pub["del"] + "'></a>"
    }
];

//修改网络掩码地址
function netContent_change() {
    var event = getEvent(),
        oSrc = event.srcElement ? event.srcElement : event.target,
        id = oSrc.id,
        $id = $("#" + id),
        index = $("#" + id + "_TD").attr("rowNum"),
        key = id.replace(index, "");

    //校验网络掩码与网络目标是否正确
    if(key == "Netmask") {
        if(!checkSubnetMask($id.val())) {
            alert($.lang.tip["tipGenmask"]);
            $id.val(IPAddrDataView.getData(index)[key]);
            return;
        }
    }
    if(key == "Destination") {
        if(!checkIP1To223($id.val())) {
            alert($.lang.tip["tipDestination"]);
            $id.val(IPAddrDataView.getData(index)[key]);
            return;
        }
    }
    IPAddrDataView.getData(index)[key] = $id.val();
}

//IP地址tab点击事件
function ipAddrTab_click() {
    var id = $(this).attr("data-divID");
    if (-1 != currentIPtab) {
        if((!$("#IpAddress").valid() || !$("#IpNetmask").valid() || !$("#IpGateway").valid()) && needValid) return;
        // 保存IP信息
        LAPI_FormToCfg("frmSetup", jsonMapInterface["IPv4"]["Addresses"][currentIPtab], dataMap, mappingMapIPv4);
    }

    //选中样式变化
    $("#" + id).removeClass("hidden");
    $(".tab_selected").removeClass("tab_selected");
    $(this).addClass("tab_selected");

    // 显示新tab对应的值
    currentIPtab = $(this).attr("data-ipAddr");
    LAPI_CfgToForm("frmSetup", jsonMapInterface["IPv4"]["Addresses"][currentIPtab], dataMap, mappingMapIPv4);
    needValid = 1;
}


var i;
// 密码是否被修改
var isChangedPwd = false; // 标志位，密码是否被修改
var PasswordDefaultValue = "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"; // 密码初始显示值，内容无意义

function initPwdChanged(f) {
    if (!isChangedPwd) {
        f.Password.value = "";
        isChangedPwd = true;
    }
}

function initIPTypeOption() {
    var str = "";
    var list = top.banner.netIPTypeArr;
    for (var i = 0; i < list.length; i++) {
        var value = Number(list[i]);
        switch (value) {
            case 0:
                str += "<option value='0' lang='staticIP'></option>";
                break;
            case 1:
                str += "<option value='1'> PPPoE </option>";
                break;
            case 2:
                str += "<option value='2'> DHCP </option>";
                break;
            default:
                break;
        }
    }
    $("#IPGetType").append(str);
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

function checkIPUnequalGW() {
    var ip1 = $("#IpAddress").val();
    var ip2 = $("#IpGateway").val();
    return ip1 != ip2;

}

function submitF() {
    var flag;
    if (!validator.form())return;
    var f = document.frmSetup;
    LAPI_FormToCfg("frmSetup", jsonMapInterface, dataMap, mappingMapInterface);

    LAPI_FormToCfg("frmSetup", jsonMapInterface["IPv4"]["Addresses"][currentIPtab], dataMap, mappingMapIPv4);
    LAPI_FormToCfg("frmSetup", jsonMapInterface["IPv6"]["Addresses"][0], dataMap, mappingMapIPv6);

    if ($("#doubleIsolationOpen").is(":checked")) {
        var ip1 = jsonMapInterface["IPv4"]["Addresses"][0]["Address"];
        var ip2 = jsonMapInterface["IPv4"]["Addresses"][1]["Address"];
        var arr1 = ip1.split(".");
        var arr2 = ip2.split(".");
        if (arr1[0] == arr2[0] && arr1[1] == arr2[1] && arr1[2] == arr2[2]) {
            top.banner.showMsg(false);
            return;
        }
    }
    var isChangedInterface = !isObjectEquals(jsonMapInterface, jsonMapInterface_bak);

    if (!isChangedInterface  && !isChangedPwd ) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }
    var isChangedIPv6 = !isObjectEquals(jsonMapInterface["IPv6"]["Addresses"][0],jsonMapInterface_bak["IPv6"]["Addresses"][0]);
    if(isChangedIPv6) {
        if ($("#Ipv6Address").val() == "") {
            alert($.lang.tip["tipIPv6AddressAndGateway"]);
            return;
        }
    }

    if (isChangedInterface && !confirm($.lang.tip["tipCfmChangeNetWork"])) return;

    if (isChangedPwd) {
        dataMap["Password"] = $("#Password").val();
    }

    // 如果网关地址为空，规范为0.0.0.0
    if (0 == f.IpGateway.value.length) {
        f.IpGateway.value = "0.0.0.0";
    }
    if (isChangedInterface || isChangedPwd) {
        // 遮盖界面、启动定时器、屏蔽提示消息
        top.banner.updateBlock(true);
        TimeId = setTimeout(function () {
            top.banner.updateBlock(false);
            top.banner.showMsg(true);
            disableAll();
        }, 5000);

        if (isChangedPwd) {
            jsonMapInterface["IPv4"]["PPPoE"]["Password"] = dataMap["Password"];
        }
        flag = LAPI_SetCfgData(LAPI_URL.NetworkInterfaces, jsonMapInterface,false);
        if (flag) {
            jsonMapInterface_bak = objectClone(jsonMapInterface);
        }
    }
}

function onNetworkCfgResult(resultCode) {
    /* 去除遮盖、停止定时器、恢复提示消息 */
    clearTimeout(TimeId);
    top.showedFlag = true;
    top.banner.updateBlock(false);

    var errorMsg = "";
    var result = parseInt(resultCode);

    switch (result) {
        case ResultCode.RESULT_CODE_IP_CONFLICT:
            errorMsg = $.lang.tip["tipChgIpConflict"];
            break;
        case ResultCode.RESULT_CODE_NOT_SUPPORT:
            errorMsg = $.lang.tip["tipChgIpUnsupport"];
            break;
        case ResultCode.RESULT_CODE_INVALID_PARAM:
            errorMsg = $.lang.tip["tipChgIpInvalidParm"];
            break;
           case ResultCode.RESULT_CODE_UNPPPPOE_CONFLICT:
            errorMsg = $.lang.tip["tipUnpPppoeConfict"];
            break;
        default:
            errorMsg = $.lang.tip["tipChgIpFailure"];
            break;
    }

    eventAlert(errorMsg);
}

function selectIPMode(f) {
    validator.init();
    needValid = 0;
    if (2 == $("#IPGetType").val()) {// DHCP
        $("#IPSet").addClass("hidden");
        $("#MaskSet").addClass("hidden");
        $("#GWSet").addClass("hidden");
        $("#UserNameSet").addClass("hidden");
        $("#UserPwdSet").addClass("hidden");
        $("#doubleIsolationEnableDiv").addClass("hidden");
        $("#Tab_bar").addClass("hidden");
        $("#IPAddrDiv").addClass("hidden");
    }
    else {
        var isPPPoE = (1 == $("#IPGetType").val());
        var isRealStatic = (0 == dataMap["IPGetType"]);

        // 更新隐藏显示选项
        if (isPPPoE) {
            $("#IPSet").addClass("hidden");
            $("#MaskSet").addClass("hidden");
            $("#GWSet").addClass("hidden");
            $("#UserNameSet").removeClass("hidden");
            $("#UserPwdSet").removeClass("hidden");
            $("#doubleIsolationEnableDiv").addClass("hidden");
            $("#Tab_bar").addClass("hidden");
            $("#IPAddrDiv").addClass("hidden");
        } else {
            if(1 != netIfaceNum) {
                $("#doubleIsolationEnableDiv").removeClass("hidden");
            }
            $("#IPSet").removeClass("hidden");
            $("#MaskSet").removeClass("hidden");
            $("#GWSet").removeClass("hidden");
            $("#UserNameSet").addClass("hidden");
            $("#UserPwdSet").addClass("hidden");
            if ($("#doubleIsolationOpen").is(":checked")) {
                $("#Tab_bar").removeClass("hidden");
                $("#DefineLU").removeClass("hidden");
                $("#IPAddrDiv").addClass("tab_content");
                $("#IPAddrDiv").addClass("section_padding");
            }
            $("#IPAddrDiv").removeClass("hidden");
        }
    }
    $(".tab_selected").trigger("click");
}

function initPage() {
    initIPTypeOption();
}

function initEvent() {
    var IPV4map = {
        "Address":"0.0.0.0",
        "Netmask":"0.0.0.0",
        "Gateway":"0.0.0.0"
    }
    $("button.sectionTab").bind("click", ipAddrTab_click);
    $("input[name='doubleIsolationEnable']").bind("click", function () {
        if ($("#doubleIsolationOpen").is(":checked")) {
            jsonMapInterface["IPv4"]["AddressNums"] = 2;
            jsonMapInterface["IPv4"]["Addresses"][1] = IPV4map;
            $("#Tab_bar").removeClass("hidden");
            $("#IPAddrDiv").addClass("tab_content");
            $("#IPAddrDiv").addClass("section_padding");
        } else {
            $("#Tab_bar").addClass("hidden");
            $("#IPAddrDiv").removeClass("tab_content");
            $("#IPAddrDiv").removeClass("section_padding");
            if (0 != currentIPtab) {
                currentIPtab = -1;
                $(".sectionTab").first().trigger("click");
            }
            jsonMapInterface["IPv4"]["AddressNums"] = 1;
            jsonMapInterface["IPv4"]["Addresses"].splice(1,1);
        }
    });
    $("#IpGateway").change(function () {
        if ("" == $("#IpGateway").val()) {
            $("#IpGateway").val("0.0.0.0");
        }
    });
}

function init(f) {
    dataMap = {};
    jsonMapInterface = {};
    f.Password.value = PasswordDefaultValue;

    // 更新网口工作模式可选项
    if (top.banner.networkModeArr.length > 0) {
        var Index;
        for (var i = 0; i < top.banner.networkModeArr.length; i++) {
            Index = Number(top.banner.networkModeArr[i]);
            $("#WorkMode").append("<option value='" + Index + "'>" + $.lang.pub["WorkMode" + (Index + 1)] + "</option>");
        }
    } else {
        $("#workModeTR").addClass("hidden");
    }

    //网口类型
    $("#networkType").val(top.banner.networkType);

    if (!LAPI_GetCfgData(LAPI_URL.NetworkInterfaces, jsonMapInterface)) {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }
    if(jsonMapInterface["IPv4"]["AddressNums"] > 1) {
        $("#doubleIsolationOpen").attr("checked", true);
    } else {
        $("#doubleIsolationClose").attr("checked", true);
    }

    jsonMapInterface_bak = objectClone(jsonMapInterface);
    for(var i = 0; i<jsonMapInterface["IPv4"]["AddressNums"]; i++) {
        LAPI_CfgToForm("frmSetup", jsonMapInterface["IPv4"]["Addresses"][i], dataMap, mappingMapIPv4);
    }
    for(var i = 0; i<jsonMapInterface["IPv6"]["AddressNums"]; i++) {
        LAPI_CfgToForm("frmSetup", jsonMapInterface["IPv6"]["Addresses"][i], dataMap, mappingMapIPv6);
    }	
    LAPI_CfgToForm("frmSetup", jsonMapInterface, dataMap, mappingMapInterface);
    selectIPMode(f);
    $(".tab_selected").trigger("click");
}

/**
 * IP地址合法性验证，地址不能是只有0或者::1的情况
 *
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function ipv6limitOnlyZero(ipStr){
    var ipv6,
        i;

    if("" == ipStr){
        return true;
    }else{
        ipv6 = ipStr.split(":");
        for (i = 0; i < ipv6.length; i++) {
            if (i == ipv6.length - 1) {
                if ("1" == ipv6[i]) {
                    return false;
                }
            }
            if (0 !== Number(ipv6[i])) {
                return true;
            }
        }
    }
    return false;
}

/**
 * IP地址合法性验证，首段地址不能是ff**,fe8*,fe9*,fea*,feb*
 *
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function isIPv6SpecialLimit(ipStr){
    var ipv6,
        first;

    ipv6 = ipStr.split(":");
    first = (ipv6[0]).toLowerCase();
    return (!("f" == first.charAt(0) && "f" == first.charAt(1)) && !("f" == first.charAt(0) && "e" == first.charAt(1) && ("8" == first.charAt(2) || "9" == first.charAt(2) || "b" == first.charAt(2) || "a" == first.charAt(2))));
}

/**
 * IP地址合法性验证，符合ipv6规则并且可以为空
 *
 * @param ipStr
 *            ip地址
 * @return boolean
 */
function isIPv6OrEmpty(ipStr){
    if ("" == ipStr){
        return true;
    }else{
        return isIPv6Address(ipStr);
    }
}

$(document).ready(function () {
    if (1 == pageType) {
        parent.selectItem("Com_TCPIPTab");// 菜单选中
    } else {
        parent.selectItem("TCPIPTab");// 菜单选中
    }
    beforeDataLoad();
    // 初始化语言标签
    initPage();
    initLang();

    $("#MTULen").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 576, 1500));
    $.validator.addMethod("checkCommonNamePwd", function (value) {
        return checkCommonNamePwd(value);
    }, $.lang.tip["tipCharFmtErr"]);

    $("#IpAddress").attr("tip", $.lang.tip["tipIPInfo"]);
    $("#IpNetmask").attr("tip", $.lang.tip["tipSubnetMaskInfo"]);
    $("#IpGateway").attr("tip", $.lang.tip["tipGatewayInfo"]);
    $("#UserName").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#Password").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#PrefixLenth").attr("tip",$.validator.format($.lang.tip["tipIntRange"],3,127));
    $("#Ipv6Address").attr("tip",$.lang.tip["tipIPInfo"]);
    $("#Ipv6Gateway").attr("tip",$.lang.tip["tipGatewayInfo"]);
    
    $.validator.addMethod("isIPAddress", function (value) {
        return isIPAddress(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223", function (value) {
        return checkIP1To223(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("checkIPUnequalGW", function (value) {
        return checkIPUnequalGW();
    }, $.lang.tip["tipIPAndGWNotEqual"]);
    $.validator.addMethod("checkSubnetMask", function (value) {
        return checkSubnetMask(value);
    }, $.lang.tip["tipSubnetMaskErr"]);
    $.validator.addMethod("checkIPAddrOrEmpty", function (value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function (value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("isIPv6OrEmpty", function(value) {
        return isIPv6OrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("isIPv6SpecialLimit", function(value) {
        return isIPv6SpecialLimit(value);
    }, $.lang.tip["tipIPv6Limit"]);
    $.validator.addMethod("ipv6limitOnlyZero", function(value) {
        return ipv6limitOnlyZero(value);
    }, $.lang.tip["tipIPv6Limit"]);

    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function (error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function (label) {
        },
        rules: {
            PrefixLenth: {
                integer: true,
                required: true,
                range:[3,127]
            },
            Ipv6Address: {
                isIPv6OrEmpty:"",
                isIPv6SpecialLimit:"",
                ipv6limitOnlyZero:"",
                CheckIPv6AddressAndGatewayEqual:"#Ipv6Address,#Ipv6Gateway",
                relationTo:[{id:"#Ipv6Gateway", method: "CheckIPv6AddressAndGatewayEqual"}]
            },
            Ipv6Gateway: {
                isIPv6OrEmpty:"",
                isIPv6SpecialLimit:"",
                ipv6limitOnlyZero:"",
                CheckIPv6AddressAndGatewayEqual:"#Ipv6Address,#Ipv6Gateway",
                relationTo:[{id:"#Ipv6Address", method: "CheckIPv6AddressAndGatewayEqual"}]
            },
            MTULen: {
                integer: true,
                required: true,
                range: [576, 1500]
            },
            IpAddress: {
                required: true,
                isIPAddress: "",
                checkIP1To223: "",
                checkIPUnequalGW: "",
                userDefinedCheckIPAndMask: "#IpNetmask",
                userDefinedCheckIPAndMaskSameNet: "#IpAddress,#IpNetmask,#IpGateway",
                relationTo: [{id: "#IpGateway", method: "userDefinedCheckIPAndMaskSameNet"}]
            },
            IpNetmask: {
                required: true,
                isIPAddress: "",
                checkSubnetMask: "",
                relationTo: [{id: "#IpAddress", method: "userDefinedCheckIPAndMask"},
                    {id: "#IpGateway", method: "userDefinedCheckIPAndMask"},
                    {id: "#IpGateway", method: "userDefinedCheckIPAndMaskSameNet"},
                    {id: "#IpAddress", method: "userDefinedCheckIPAndMaskSameNet"}]
            },
            IpGateway: {
                checkIPAddrOrEmpty: "",
                checkIP1To223OrEmpty: "",
                checkIPUnequalGW: "",
                userDefinedCheckIPAndMask: "#IpNetmask",
                userDefinedCheckIPAndMaskSameNet: "#IpAddress,#IpNetmask,#IpGateway",
                relationTo: [{id: "#IpAddress", method: "userDefinedCheckIPAndMaskSameNet"}]
            },
            UserName: {
                checkCommonNamePwd: ""
            },
            Password: {
                checkCommonNamePwd: ""
            }
        }
    });
    initEvent();
    init(document.frmSetup);
    afterDataLoad();
});