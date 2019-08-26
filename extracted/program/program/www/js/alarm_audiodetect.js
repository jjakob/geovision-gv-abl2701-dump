// JavaScript Document
GlobalInvoke(window);
var validator = null;
var channelId = 0;
var jsonMap = {};
var jsonMap_bak = {};
var audioDetectMap = {};
var alarmType = AlarmType.AUDIO_DETECT; // 告警类型
var planType = PlanType.AUDIO_DETECT; // 布防计划类型
var bSpecifiedByInput = false; // 是否由输入框改变值
var getActivityTimeId = 0; // 获取数据定时器id
var activityList = [];// 存放运动量的数据(一次获取的数据)
var activityIndex = 0;
var isDraw = true; // 是否画声音告警量

function enableAudioDetect() {
    var bool = $("#audioDetectOpen").is(":checked");
    $("#DetectType").attr("disabled", !bool);
    $("#DiffValue").attr("disabled", !bool);
    $("#Threshold").attr("disabled", !bool);
    if (!bool) {
        clearTimeId(getActivityTimeId);
        $("#alarmView").children().css( {
            height : "0px",
            marginTop : "400px"
        });// 清空运动量的图
    } else {
        // 获取运动量，1s获取1次
        getActivityTimeId = setInterval(function() {
            var tmpMap = {};
            if(!LAPI_GetCfgData(LAPI_URL.AudioVolume,tmpMap)){
                disableAll();
                return;
            }
                activityList.splice(0, activityList.length);// 清空数组
                for ( var i = 0; i < tmpMap["Nums"]; i++) {
                    var map = {};
                    var activity = tmpMap["Volumes"][i]["Volume"];
                    var alarmOn = tmpMap["Volumes"][i]["IsAbnormal"];
                    map["Volume"] = (undefined == activity) ? 0 : activity;
                    map["AlarmOn"] = (undefined == alarmOn) ? 0 : alarmOn;
                    activityList.push(map);
                }

                // 画图
                for (activityIndex = 0; activityIndex < tmpMap["Nums"]; activityIndex++) {
                    drawAudioActivity();
                }
            }, 1000);
    }
}

// 画声音动态图
function drawAudioActivity() {
    if (!isDraw)
        return;
    var activity = parseInt(activityList[activityIndex]["Volume"]);
    var alarmOn = activityList[activityIndex]["AlarmOn"];
    var color = (1 == alarmOn) ? "red" : "gray";
    var activityHtml = "<div class='activity' style='height: " + activity + "px;margin-top: " + (400 - activity)
            + "px;background-color: " + color + "'></div>";
    var $alarmView = $("#alarmView");
    if (212 == $alarmView.children().length) {
        $alarmView.find(":first-child").remove();
    }
    $alarmView.append(activityHtml);
}

function clearTimeId(timeId) {
    if (timeId) {
        clearInterval(timeId);
        if (timeId == getActivityTimeId) {
            getActivityTimeId = 0;
        }
    }
}

function DetectType_change() {
    if (3 == $("#DetectType").val()) {// 门限
        $("#diffValueDL").addClass("hidden");
        $("#DiffValue").val(audioDetectMap["DiffValue"]);
        $("#thresholdDL").removeClass("hidden");
    } else {
        $("#diffValueDL").removeClass("hidden");
        $("#thresholdDL").addClass("hidden");
        $("#Threshold").val(audioDetectMap["Threshold"]);
    }
    validator.init();
}

function stopStart_click() {
    isDraw = !isDraw;
    var name = (isDraw) ? $.lang.pub["stop"] : $.lang.pub["start"];
    $("#stopStart").text(name);
}

// ----------------------------------标尺拖动事件
// START-------------------------------------------
var moveY = 0;
var moveTop = 0;
var moveable = false;
var docMouseMoveEvent = document.onmousemove;
var docMouseUpEvent = document.onmouseup;
var docMouseSelectEvent = document.onselectstart;

// 拖动事件
function moveThresholdHR() {
    document.onselectstart = function() {
        return false;
    };
    var evt = getEvent();
    moveable = true;
    moveY = evt.clientY;
    moveTop = parseInt($("#thresholdHR").css("marginTop"));
    $("#frontDiv").css("display", "block");

    document.onmousemove = function() {
        var evt = getEvent();
        var leftButton = (document.all) ? (evt.button == 1) : (evt.button == 0);
        if (leftButton == 1 && moveable) {
            var marginTop = moveTop + evt.clientY - moveY;
            marginTop = (0 > marginTop) ? 0 : marginTop;
            marginTop = (400 < marginTop) ? 400 : marginTop;
            $("#thresholdHR").css("marginTop", marginTop);
            var $thresholdHRLabel = $("#thresholdHR_label");
            $thresholdHRLabel.text(400 - marginTop);
            $thresholdHRLabel.css("marginTop", marginTop - 6);
            $("#thresholdHR_staff").css("marginTop", marginTop - 6);
        }
    };
    if (moveable) {
        document.onmouseup = function() {
            document.onmousemove = docMouseMoveEvent;
            document.onmouseup = docMouseUpEvent;
            document.onselectstart = docMouseSelectEvent;
            $("#frontDiv").css("display", "none");
            moveable = false;
            moveY = 0;
            moveTop = 0;
        };
    }
}
// ----------------------------------标尺拖动事件
// END-------------------------------------------

function disablePage() {
    disableAll();
    linkOutIframe.disableAll();
}

function submitF() {
    var flag;
    if (!validator.form())
        return;
    LAPI_FormToCfg("frmSetup", jsonMap, audioDetectMap);
    var audioDetectChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    var linkoutChanged = linkOutIframe.IsChanged();
    var planChanged = Plan.IsChanged();
    if (!audioDetectChanged && !linkoutChanged && !planChanged) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    if (planChanged) {
        Plan.submitF(LAPI_URL.WeekPlan + "AudioDetect");
    }
    if (linkoutChanged) {
        linkOutIframe.submitF(LAPI_URL.AudioDetectLink);
    }
    if (audioDetectChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.AudioDetect, jsonMap);
        if(flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

function initValidator() {
    $("#DiffValue").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 400));
    $("#Threshold").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 400));
    validator = $("#frmSetup").validate( {
        debug : false,
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success : function(label) {
        },
        rules : {
            DiffValue : {
                integer : true,
                required : true,
                range : [ 0, 400 ]
            },
            Threshold : {
                integer : true,
                required : true,
                range : [ 0, 400 ]
            }
        }
    });
    validator.init();
}

function init() {
    jsonMap = {};
    audioDetectMap = {};
    
    if (!LAPI_GetCfgData(LAPI_URL.AudioDetect, jsonMap)) {
        disablePage();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        return;
    }
    LAPI_CfgToForm("frmSetup", jsonMap, audioDetectMap);
    jsonMap_bak = objectClone(jsonMap);
    
    if (!linkOutIframe.initData(LAPI_URL.AudioDetectLink)) {
        disablePage();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
    }
    Plan.init(LAPI_URL.WeekPlan + "AudioDetect");
    enableAudioDetect();
    DetectType_change();
}

$(document).ready(function() {
    parent.selectItem("audioDetectAlarmTab");// 选中菜单
    loadHtml("linkOutIFrame", "alarm_linkout.htm");
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    if (LoginType.VM_LOGIN == parent.loginType) {
        $("#linkOutIFrame").addClass("hidden");
        $("#planDiv").addClass("hidden");
        $("#submitBtn").remove();
        $("input[name='Enable']").bind("click", function() {
            enableAudioDetect();
            submitF();
        });
        $("#DetectType").change(function() {
            DetectType_change();
            submitF();
        });
        $("#Threshold").change(submitF);
        $("#DiffValue").change(submitF);
    } else {
        $("input[name='Enable']").bind("click", enableAudioDetect);
        $("#DetectType").change(DetectType_change);
    }
    $("#thresholdHR").bind("mousedown", moveThresholdHR);
    $("#thresholdHR_staff").bind("mousedown", moveThresholdHR);
    $("#stopStart").bind("click", stopStart_click);

    document.onkeydown = shieldEsc;

    for ( var n = 0; n < 212; n++) {
        var activityHtml = "<div class='activity' style='height: 0;margin-top: 400px;background-color: black'></div>";
        $("#alarmView").append(activityHtml);
    }
    initValidator();
    init();
    afterDataLoad();
});