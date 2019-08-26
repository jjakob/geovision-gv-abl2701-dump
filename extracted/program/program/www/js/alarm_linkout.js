$package("linkOutIframe");
// 加载语言文件
loadlanguageFile(top.language);
var validator = null;
var g_player = top.sdk_viewer; // 界面播放控件 */
var linkOutType = {
    LinkOutSwitch : 1,
    LinkOutCapture : 1,
    LinkOutPreset : 1,
    LinkOutw : 1,
    LinkOutEmail : 1
};// 告警联动类型
var linkOutMap = {};        // 告警联动数据（原始）
var linkOutInfo = {
    LinkOutPreset : 0,
    LinkOutCapture : 0,
    LinkOutUSBStor :0,
    LinkOutFTP : 0,
    LinkOutEmail : 0
};// 告警联动数据（界面）
var linkOutInfo_bak = {};


function setLinkOutValueToMap() {
    var num = 0;
    linkOutMap["AlarmActCfg"] = [];
    for ( var n in linkOutInfo) {
        if (!$("#" + n).is(":checked"))
            continue;
        var actInfo = {};
        var actCmd = -1;
        var alarmParam = -1;
        var actId = $("#" + n).attr("actId");
        num++;
        if (n.indexOf("Preset") > -1) {
            actCmd = AlarmActCommand.PRESET;
            alarmParam = $("#PresetNum").val();
        } else if (n.indexOf("Switch") > -1) {
            actCmd = AlarmActCommand.OUTSWITCH;
            alarmParam = n.replace("LinkOutSwitch", "");
        } else if (n.indexOf("Capture") > -1) {
            actCmd = AlarmActCommand.CAPTURE;
        } else if (n.indexOf("FTP") > -1) {
            actCmd = AlarmActCommand.CAPTURE2FTP;
        } else if (n.indexOf("Email") > -1) {
            actCmd = AlarmActCommand.CAPTURE2EMAIL;
        }else if (n.indexOf("USBStor") > -1) {
            actCmd = AlarmActCommand.START_USBSTOR;
        }
        if (-1 != actCmd) {
            actInfo["ActCmd"] = actCmd;
            if (undefined == actId) {
                actId = actCmd;
            }
            actInfo["ActID"] = actId;
        }
        if (-1 != alarmParam) {
            actInfo["AlarmParam"] = alarmParam;
        }

        linkOutMap["AlarmActCfg"].push(actInfo);
    }
    linkOutMap["ActNum"] = num;
}

/**
 * 生成预置位列表
 * 
 * @type Form
 */
function makePresetList() {
    if (!top.banner.isSupportPTZ) return;
    var f = document.frmSetup;
    var videoIframe = top.banner.frames["video"];
    var optionHtml = videoIframe.$("#position").html();
    var $PresetNum = $("#PresetNum");
    $PresetNum.empty();
    $PresetNum.append(optionHtml);
    $("#PresetNum option:first").remove();
    if (0 == f.PresetNum.length) {
        f.LinkOutPreset.disabled = true;
    }
}

/**
 * 初始化联动到预置位功能
 */
function initPreset(f) {
    if ((true == f.LinkOutPreset.checked) && (0 == f.PresetNum.length)) {
        f.LinkOutPreset.checked = false;
    }
    f.PresetNum.disabled = !(f.LinkOutPreset.checked);
}

// 比较参数是否发生变化
linkOutIframe.IsChanged = function() {
    if($("#LinkOutPreset").is(":checked")){
        linkOutInfo["PresetNum"] = $("#PresetNum").val();
    }
    LAPI_FormToCfg("frmSetup", linkOutInfo);
    return !isObjectEquals(linkOutInfo, linkOutInfo_bak);
}

// 参数下发
linkOutIframe.submitF = function(url) {
    var flag;

    setLinkOutValueToMap();
    flag = LAPI_SetCfgData(url, linkOutMap, false);
    if (flag) {
        if (LAPI_URL.HighTemperatureDetectLink == url) {// 若是高温告警还需下发低温告警
            flag = LAPI_SetCfgData(LAPI_URL.LowTemperatureDetectLink, linkOutMap, false);
        }
        if (flag) {
            linkOutInfo_bak = objectClone(linkOutInfo);
        }
    }
    top.banner.showMsg(flag);
    return flag;
}

linkOutIframe.initPage = function() {
    var len = top.banner.switchOutArr.length;
    if (0 != len) {
        var $switchOutTR = $("#switchOutTR");
        $switchOutTR.removeClass("hidden");
        for ( var i = 0; i < len; i++) {
            var v = parseInt(top.banner.switchOutArr[i]);
            var html = "<input name='LinkOutSwitch" + v + "' id='LinkOutSwitch" + v + "' type='checkbox' value='1'/>"
                    + "\n" + "<label for='LinkOutSwitch" + v + "'><lang name='switchOutName" + (v + 1)
                    + "'></lang></label>";
            $switchOutTR.append(html);
        }
    }

    if (top.banner.isSupportPTZ) {
        $("#presetTR").removeClass("hidden");
    }
    top.banner.updateSwitchOutFn(document);
    
    if (top.banner.isSupportBasicFTP && 
            (AlarmType.MOVE_DETECT == alarmType || AlarmType.AUDIO_DETECT  == alarmType|| AlarmType.INPUT_SWITCH  == alarmType || AlarmType.MASK_DETECT  == alarmType)) {
        $("#ftpTR").removeClass("hidden");
    }
    
    if (top.banner.isSupportEmail && 
            (AlarmType.MOVE_DETECT == alarmType || AlarmType.AUDIO_DETECT  == alarmType || AlarmType.MASK_DETECT  == alarmType
            || AlarmType.INPUT_SWITCH == alarmType)) {
        $("#emailTR").removeClass("hidden");
    }
    
    if (top.banner.isSupportStorage && (AlarmType.HIGH_TEMPERATURE != alarmType)){
        $("#storTR").removeClass("hidden");
    }
    
    if (0 == $("#linkOutIFrame li:visible").length) {
        $("#linkOutIFrame").addClass("hidden");
    }
}

linkOutIframe.initData = function(url) {
    var f = document.frmSetup;
    linkOutMap = {};
    linkOutInfo = {
        LinkOutPreset : 0,
        LinkOutCapture : 0,
        LinkOutUSBStor :0,
        LinkOutFTP : 0,
        LinkOutEmail : 0
    };
    var linkOutSwitchNum = linkOutType["LinkOutSwitch"];
    for ( var i = 0; i < linkOutSwitchNum; i++) {
        linkOutInfo["LinkOutSwitch" + i] = 0;
    }

    if (!LAPI_GetCfgData(url, linkOutMap)) {
        disableAll();
        return false;
    }
    var num = linkOutMap["ActNum"];
    var linkOutList = linkOutMap["AlarmActCfg"];
    for ( var i = 0; i < num; i++) {
        var actInfo = linkOutList[i];
        var value = actInfo["AlarmParam"];
        var actId =actInfo["ActID"];
        switch (Number(actInfo["ActCmd"])) {
            case AlarmActCommand.PRESET:// 预置位
                linkOutInfo["LinkOutPreset"] = 1;
                linkOutInfo["PresetNum"] = value;
                $("#LinkOutPreset").attr("actId", actId);
                break;
            case AlarmActCommand.OUTSWITCH:// 开关量输出
                linkOutInfo["LinkOutSwitch" + value] = 1;
                $("#LinkOutSwitch" + value).attr("actId", actId);
                break;
            case AlarmActCommand.CAPTURE:// 抓拍
                linkOutInfo["LinkOutCapture"] = 1;
                $("#LinkOutCapture").attr("actId", actId);
                break;
            case AlarmActCommand.CAPTURE2FTP:// FTP
                linkOutInfo["LinkOutFTP"] = 1;
                $("#LinkOutFTP").attr("actId", actId);
                break;
            case AlarmActCommand.CAPTURE2EMAIL:// EMAIL
                linkOutInfo["LinkOutEmail"] = 1;
                $("#LinkOutEmail").attr("actId", actId);
                break;
            case AlarmActCommand.START_USBSTOR: //存储
                linkOutInfo["LinkOutUSBStor"] = 1;
                $("#LinkOutUSBStor").attr("actId", actId);
                break;
            default:
                break;
        }
    }
    linkOutInfo_bak = objectClone(linkOutInfo);
    makePresetList();
    cfgToForm(linkOutInfo, "frmSetup");
    setComboxTitle('PresetNum');
    initPreset(f);
    return true;
}

$(document).ready(function() {
    linkOutIframe.initPage();
});