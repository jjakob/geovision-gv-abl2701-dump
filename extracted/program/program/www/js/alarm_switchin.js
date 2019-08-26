// JavaScript Document
GlobalInvoke(window);
var validator = null;
var switchInMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    SwitchID: ["ID"],
    SwitchNameDesc: ["Name"],
    RunMode: ["RunMode"],
    IsEnable: ["Enable"]
};
var alarmType = AlarmType.INPUT_SWITCH; // 告警类型
var planType = PlanType.INPUT_SWITCH; // 布防计划类型
var pageType = getparastr("pageType");
var LAPI_URL_SWITCHIN = LAPI_URL.InputSwitch;
var LAPI_URL_LINK = LAPI_URL.InputSwitchLink;
var LAPI_URL_PLAN = "/LAPI/V1.0/Channel/0/Plan/WeekPlan/InputSwitch";

function submitF() {
    if (!validator.form()) return;
    channelId = $("#SwitchInId").val();
    LAPI_FormToCfg("frmSetup",jsonMap,switchInMap,mappingMap);
    
    var switchInChanged =  !isObjectEquals(jsonMap,jsonMap_bak);
    var linkoutChanged = linkOutIframe.IsChanged();
    var planChanged = Plan.IsChanged();
    if (!switchInChanged && !linkoutChanged && !planChanged) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }
    if (planChanged) {
        LAPI_URL_PLAN = "/LAPI/V1.0/Channel/"+channelId+"/Plan/WeekPlan/InputSwitch";
        Plan.submitF(LAPI_URL_PLAN);
    }
    if (linkoutChanged) {
        LAPI_URL_LINK = "/LAPI/V1.0/Channel/"+channelId+"/IO/InputSwitchLink";
        linkOutIframe.submitF(LAPI_URL_LINK);
    }
    if (switchInChanged) {
        LAPI_URL_SWITCHIN = "/LAPI/V1.0/Channel/"+channelId+"/IO/InputSwitch";
        
        if(LAPI_SetCfgData(LAPI_URL_SWITCHIN, jsonMap)) {
             jsonMap_bak = objectClone(jsonMap);        
        }
    }
}

function initPage() {
    $("#EquipmentType").val(top.banner.titleDeviceType);
    if (1 == pageType) {
        $("#linkOutIFrame").addClass("hidden");
        $("#planDiv").addClass("hidden");
        $("#switchInTR").addClass("hidden");
    }
    initSwitchIn();
}

function init(f) {
    jsonMap = {};
    switchInMap = {};
    channelId = $("#SwitchInId").val();
    LAPI_URL_SWITCHIN = "/LAPI/V1.0/Channel/"+channelId+"/IO/InputSwitch";
    LAPI_URL_LINK = "/LAPI/V1.0/Channel/"+channelId+"/IO/InputSwitchLink";
    LAPI_URL_PLAN = "/LAPI/V1.0/Channel/"+channelId+"/Plan/WeekPlan/InputSwitch";
    if (!LAPI_GetCfgData(LAPI_URL_SWITCHIN, jsonMap)) {
        disableAll();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        return;
    }
    jsonMap_bak = objectClone(jsonMap);        
    LAPI_CfgToForm("frmSetup",jsonMap,switchInMap,mappingMap);
    if (!linkOutIframe.initData(LAPI_URL_LINK)) {
        disableAll();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
    }
    Plan.init(LAPI_URL_PLAN);
    showSwitchNameDesc(f);
}

// 更新开关量名称的悬浮信息
function showSwitchNameDesc(f) {
    $("#SwitchNameDescTitle").attr("tooltipText", f.SwitchNameDesc.value);
}

// 初始化开关量输入
function initSwitchIn() {
    for (var i = 0, len = top.banner.switchInArr.length; i < len; i++) {
        var v = parseInt(top.banner.switchInArr[i]);
        $("#SwitchInId").append("<option value='" + v + "'>" + $.lang.pub["switchInName" + (v + 1)] + "</option>");
    }
}

function initValidator() {
    $("#SwitchNameDesc").attr("tip", $.lang.tip["tipName"]);
    $("#SwitchID").attr("tip", $.lang.tip["tipSwitchID"]);
    $.validator.addMethod("validStrNoNull", function(value) {
        return validStrNoNull(value);
    }, $.lang.validate["valRequired"]);
    $.validator.addMethod("checkCommonNamePwd", function(value) {
        return checkCommonNamePwd(value);
    }, $.lang.tip["tipCharFmtErr"]);
    validator = $("#frmSetup").validate({
        debug: false,
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success : function(label) {
        },
        rules: {
            SwitchNameDesc: {
                maxlength: 20,
                validStrNoNull: ""
            },
            SwitchID: {
                maxlength: 20,
                checkCommonNamePwd: ""
            }
        },
        submitHandler: submitF
    });
    $("td").tooltip({
        left: 20
    });
}

$(document).ready(function() {
    if (1 == pageType) {
        parent.selectItem("switchInBasicTab"); // 选中菜单
    } else {
        parent.selectItem("switchInAlarmTab"); // 选中菜单
    }
    loadHtml("linkOutIFrame", "alarm_linkout.htm");
    beforeDataLoad();
    initPage();
    // 初始化语言标签
    initLang();
    initValidator();
    document.onkeydown = shieldEsc;
    init(document.frmSetup);
    afterDataLoad();
});