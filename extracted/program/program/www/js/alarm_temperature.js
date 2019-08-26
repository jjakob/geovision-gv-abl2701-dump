GlobalInvoke(window);
var validator = null;
var channelId = 0;
var temperatureMap = {};
var alarmType = AlarmType.HIGH_TEMPERATURE;  // 告警类型
var pageType = getparastr("pageType");
            
function submitF() {
    var tempChanged = IsChanged("frmSetup", temperatureMap);
    var linkoutChanged = false;
    
    if(!validator.form()) return;
    
    if ($("#linkOutIFrame").is(":visible")) {
        linkoutChanged = linkOutIframe.IsChanged();
        
        if (!tempChanged && !linkoutChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
            return;
        }
        
        if (linkoutChanged) {
            linkOutIframe.submitF(LAPI_URL.HighTemperatureDetectLink);
        }
    } else {
        if (!tempChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
            return;
        }
      }
    if (tempChanged) {
        setCfgData(channelId, CMD_TYPE.ALARM_TEMPERATURE_CFG, "frmSetup", temperatureMap);
    }
}

function initData() {
    document.onkeydown = shieldEsc;
    temperatureMap = {};
     
    if(!getCfgData(channelId, CMD_TYPE.ALARM_TEMPERATURE_CFG, temperatureMap)) {
        disableAll();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        return;
    }
    cfgToForm(temperatureMap, "frmSetup");
    
    if ($("#linkOutIFrame").is(":visible")) {
        linkOutIframe.initData(LAPI_URL.HighTemperatureDetectLink);
    }
}

/**
 * 比较高低温值之间的关系是否合法(差值不能小于3)
 * 
 * @return
 */
function validBetweenHighAndLow() {
    var highValue = $("#HighTemp").val();
    var lowValue = $("#LowTemp").val();
    
    return (3 <= (highValue - lowValue));

}

function initPage() {
    if (1 == pageType) {
        $("#linkoutTR").addClass("hidden");
    }
}

function initValidator() {
    $("#HighTemp").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 50, 100));
    $("#LowTemp").attr("tip", $.validator.format($.lang.tip["tipIntRange"], -100, 49));

    $.validator.addMethod("validBetweenHighAndLow", function(value) {
        return validBetweenHighAndLow(value);
    }, $.lang.tip["tipTemperMinusInvalid"]);
    
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
                showJqueryErr(error, element, "div");
            },
        success: function(label) {
        },
        rules: {
            HighTemp: {
                integer: true,
                required: true,
                range: [50, 100],
                validBetweenHighAndLow: ""
            },
            LowTemp: {
                integer: true,
                required: true,
                range: [-100, 49],
                validBetweenHighAndLow: ""
            }
        },
        submitHandler: submitF
    });
}

$(document).ready(function() {
    if (1 == pageType) {
        parent.selectItem("temperatureBasicTab");  // 选中菜单
    } else {
        parent.selectItem("temperatureAlarmTab");  // 选中菜单
    }
    loadHtml("linkOutIFrame", "alarm_linkout.htm");
    beforeDataLoad();
    initPage();
    initLang();
    initValidator();
    initData();
    afterDataLoad();
});