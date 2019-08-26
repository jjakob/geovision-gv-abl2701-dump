// JavaScript Document
GlobalInvoke(window);
var validator = null;
var channelId = 0;
var coverDetectMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var alarmType = AlarmType.MASK_DETECT;// 告警类型
var planType = PlanType.TAMPER_DETECT;// 计划类型
var mappingMap = {
    Enable1: ["Enable"],
    Sensitivity1: ["Sensitivity"],
    Duration1: ["Duration"]
};
//滑动条参数列表（map<k,map<k,v>>
var slidersMap = {
        Sensitivity1 : {
        sliderId : "SensitivitySld",
        barId : "SensitivityBar",
        minValue : 1,
        maxValue : 100,
        sld : null
    }
};
/**
 * 初始化滑动条
 * 
 * @param f
 * @return
 */
function initSlider() {
    for ( var textId in slidersMap) {
        var sldMap = slidersMap[textId];
        var sld = new Slider(sldMap.sliderId, sldMap.barId, {
            onMove : function() {
                if (!bSpecifiedByInput) {
                    $("#" + this.textId).val(Math.round(this.GetValue()));
                }
            },
            onDragStop : function() {
                var obj = $("#" + this.textId)[0];
                obj.focus();
                obj.blur();
            }
        });
        sld.textId = textId;
        sld.MinValue = sldMap.minValue;
        sld.MaxValue = sldMap.maxValue;
        sldMap["sld"] = sld;
    }
}

/**
 * 滑动条赋值
 * 
 * @return
 */

function setSliderValue() {
    for ( var n in slidersMap) {
        var sld = slidersMap[n]["sld"];
        var v = isNaN(coverDetectMap["Sensitivity1"]) ? 1 : Number(coverDetectMap["Sensitivity1"]);
        bSpecifiedByInput = true;
        sld.SetValue(v);
        bSpecifiedByInput = false;
    }
}

/**
 * 滑动条输入框onchange事件（验证下发）
 * 
 * @param obj
 * @return
 */

function onSliderChanged(obj) {
    var sldMap = slidersMap[obj.id];
    if(!validator.check(obj))return;
    bSpecifiedByInput = true;
    sldMap["sld"].SetValue(obj.value);
    bSpecifiedByInput = false;
}

function submitF() {
    var flag;
    if (!validator.form())
        return;
    
    LAPI_FormToCfg("frmSetup", jsonMap, coverDetectMap, mappingMap);
    
    var isChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    var linkoutChanged = linkOutIframe.IsChanged();
    var planChanged = Plan.IsChanged();

    if (!isChanged && !linkoutChanged && !planChanged) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }
    if (planChanged) {
        Plan.submitF(LAPI_URL.WeekPlan + "TamperDetect");
    }
    if (linkoutChanged) {
        linkOutIframe.submitF(LAPI_URL.TamperDetectLink);
    }
    if (isChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.TamperDetect, jsonMap);
        if (flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

function initPage() {
    if (LoginType.VM_LOGIN == parent.loginType) {
        $("#linkOutIFrame").addClass("hidden");
        $("#planDiv").addClass("hidden");
        $("#submitBtn").remove();
        $("input[name='Enable1']").bind("click", submitF);
        $("#Sensitivity1").change(submitF);
        $("#Duration1").change(submitF);
    }
    initSlider();
}

function initValidator() {
    $("#Sensitivity1").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 100));
    $("#Duration1").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));

    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success : function(label) {
        },
        rules : {
                Sensitivity1 : {
                integer : true,
                required : true,
                range : [ 1, 100 ]
            },
            Duration1 : {
                integer : true,
                required : true,
                range : [ 0, 10 ]
            }
        }
    });
    validator.init();
}

function init() {
    coverDetectMap = {};
    jsonMap = {};
    
    if (!LAPI_GetCfgData(LAPI_URL.TamperDetect, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, coverDetectMap, mappingMap);
    setSliderValue();
    if (!linkOutIframe.initData(LAPI_URL.TamperDetectLink)) {
        disableAll();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
    }
    Plan.init(LAPI_URL.WeekPlan + "TamperDetect");
}

$(document).ready(function() {
    parent.selectItem("tamperDetectAlarmTab");// 选中菜单
    loadHtml("linkOutIFrame", "alarm_linkout.htm");
    beforeDataLoad();
    initPage();
    // 初始化语言标签
    initLang();
    initValidator();
    document.onkeydown = shieldEsc;
    init();
    afterDataLoad();
});