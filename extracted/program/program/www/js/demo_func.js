// JavaScript Document
GlobalInvoke(window);
var dataMap = {};
var channelId = 0;
var subChannelId = 0;
//jsonMap = {mappingMap,jsonData}
var jsonMap = {
    daemobDetectionEnable: [{
        daemobDetectionEnable: ["Enabled"]
    }, {}],
    FanEnable: [{
        Enable: ["Enable"]
    }, {}],
    EnginnerAcceptance: [{
        Mode: ["Mode"],
        MinBiteRate: ["MinBiteRate"]
    }, {}],
    SyncTimeHour: [{
        ClientSyncTimeHour: ["Hour"]
    }, {}],
    ZoomLimitSwitch1: [{
        ZoomLimitSwitch_widecut: ["Wide", "CutNum"],
        ZoomLimitSwitch_telecut: ["Tele", "CutNum"]
    }, {}],
    SecureAccess: [{
        SecureAccess: ["Enable"]
    }, {}],
    NetDetect: [{
        NetworkDetectEnable: ["Enabled"],
        NetworkReboot: ["Reset"]
    }, {}],
    PayloadType: [{
        PayloadType: ["PayloadType"]
    }, {}],
    ZoomLimitSwitchEnable: [{
        ZoomLimitSwitch: ["Enabled"]
    }, {}],
    GBTCPStreamCfg: [{
        HasRTPHead: ["IsRTPCarried"],
        ConnectMode: ["ConnectionMode"]
    },{}],
    StreamSendModeCfg: [{
        SendMode:["Mode"]
    },{}],
    LowDelayCfg: [{
        EnableLowDelay: ["Enabled"]
    },{}],
    ProfileMode: [{
        ProfileMode: ["Mode"]
    },{}],
    EnhanceMode: [{
        EnhanceMode: ["Enabled"]
    },{}],
    AudioAGC: [{
        AGCModeEnable: ["Enabled"]
    },{}],
    SpecialLensTypeCfg: [{
        SpecialLensType: ["Type"]
    },{}],
    SansuoCheckCfg: [{
        ImgCustomParam: ["Enabled"]
    },{}],
    ViewModeCfg: [{
        ViewMode: ["Mode"]
    },{}],
    ClearFogCfg: [{
        DefogMode:["Mode"]
    },{}],
    Defog: [{
        defogStatus: ["StatusParam","DefogStatus"]
    },{}],
    PhotoStorage: [{
        StoreType: ["StorageMode"]
    },{}],
    authenticationMode: [{authenticationMode: ["Mode"]}, {}],
    PTZCapReportLimit: [{PTZCapReportLimitEnable: ["Enable"]},{}],
    SnapPicID: [{
        SnapPicID: ["ID"]
    }, {}],
    similarLpFilter: [{
        SmilarLPFilterEnable: ["Enable"]
    }, {}],
    IVALPRCheck: [{
        IVALPCheck: ["Enabled"]
    }, {}],
    OutPtzEx: [{
        OutPtzEnable: ["Enabled"]
    },{}]
};
var demoMap = {};
var demoMap_bak = {};
var tempMap = {};

function submitF(cmd, str) {
    var bool = true;
    var pcParam = ("undefined" == typeof str) ? "" : str;

    if (!IsChanged("frmSetup", dataMap)) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        bool = false;
    } else {
        if (!setCfgData(channelId, cmd, "frmSetup", dataMap, pcParam)) {
            cfgToForm(dataMap, "frmSetup");
            bool = false;
        }
    }
    return bool;
}

function LAPI_initData(url, jsonMap, TempMap, mappingMap) {
    if (!LAPI_GetCfgData(url, jsonMap)) {
        disableAll();
        return;
    }
    LAPI_CfgToForm("frmSetup", jsonMap, TempMap, mappingMap);
}

function LAPI_submitF(url, jsonMap, tempMap, mappingMap) {
    LAPI_FormToCfg("frmSetup", jsonMap, tempMap, mappingMap);
    var isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

    if (!isFanChanged) {
        top.banner.showMsg(true,$.lang.tip["tipAnyChangeInfo"],0);
    } else {
        flag = LAPI_SetCfgData(url, jsonMap);
        if (flag) {
            demoMap_bak = objectClone(demoMap);
            if(LAPI_URL.ClearFog == url){
                getClearFogStatus();
            }
        }
    }
}


// jQuery验证初始化
function initValidator() {
    $("#CustomDeviceModel").attr("tip", $.lang.tip["tipUserName"]);
    $("#FramePeriodDebugInterval").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 3600));
    $("#PayloadType").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 96, 127));
    $("#ZoomLimitSwitch_widecut").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 255));
    $("#ZoomLimitSwitch_telecut").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 255));
     $("#MinBiteRate").attr("tip",$.validator.format($.lang.tip["tipIntRange"], 128, 16384));


    $.validator.addMethod("checkDeviceModel", function (value) {
        return checkUserName(value);
    }, $.lang.tip["tipNameInvalidChar"]);

    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function (error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function (label) {
        },
        rules: {
            FramePeriodDebugInterval: {
                integer: true,
                required: true,
                range: [1, 3600]
            },
            PayloadType: {
                integer: true,
                required: true,
                range: [96, 127]
            },
            ZoomLimitSwitch_widecut: {
                integer: true,
                required: true,
                range: [0, 255]
            },

            CustomDeviceModel: {
                checkDeviceModel: ""
            },
            ZoomLimitSwitch_telecut: {
                integer: true,
                required: true,
                range: [0, 255]
            },
            MinBiteRate : {
                integer : true,
                required : true,
                range : [ 128, 16384]
            }
        }
    });
    validator.init();
}

function getClearFogStatus() {
    var status = ("TRUE" == showClearFogType) ? $.lang.pub["irClearFog"] : $.lang.pub["resistanceClearFog"];
    $("#defogType").text(status);

    if (!LAPI_GetCfgData(LAPI_URL.DeFog, jsonMap["Defog"][1])) return;
    LAPI_CfgToForm("frmSetup",jsonMap["Defog"][1], demoMap, jsonMap["Defog"][0]);
    status = (0 == Number(demoMap["defogStatus"])) ? $.lang.pub["sweepFogOff"] : $.lang.pub["sweepFogOn"];
    $("#defogStatus").text(status);
}

function initPage() {
    var i = -24;

    for (; i < 25; i++) {
        $("#ClientSyncTimeHour").append("<option value='" + i + "'>" + i + "</option>");
    }

    if (top.banner.isSupportEhcoCancellation) {
        $("#audioEchoCancellation").removeClass("hidden");
    }


    if (top.banner.isSupportIVA) {
        $("#StoreType").removeClass("hidden");
    }

    if (!top.banner.isSupportIvaPark) {
        $("#FanEnableDiv").removeClass("hidden");
    }
    if(2 == top.banner.ptzType){ //表示外置云台才需要呈现：“外置云台辅助功能”该项
        $("#presetEnableDiv").removeClass("hidden");
    }
}

function initData() {
    httpMap = {};
    $("#CustomDeviceModel").val(top.banner.titleDeviceType);
    demoMap = {};
    dataMap = {};
    LAPI_initData("/LAPI/V1.0/Channel/0/Demo/Daemon", jsonMap["daemobDetectionEnable"][1], demoMap, jsonMap["daemobDetectionEnable"][0]);
    LAPI_initData(LAPI_URL.Fan, jsonMap["FanEnable"][1], demoMap, jsonMap["FanEnable"][0]);

    LAPI_initData(LAPI_URL.AcceptanceMode, jsonMap["EnginnerAcceptance"][1], demoMap, jsonMap["EnginnerAcceptance"][0]);

    // http鉴权
    LAPI_initData(LAPI_URL.HttpAuth, jsonMap["authenticationMode"][1], demoMap, jsonMap["authenticationMode"][0]);

    //支持profile模式
    LAPI_initData(LAPI_URL.ProfileMode, jsonMap["ProfileMode"][1], demoMap, jsonMap["ProfileMode"][0]);

    // 支持低延时
    if (top.banner.isSupportLowDelay) {
        $("#lowDelayDiv").removeClass("hidden");
        if (!LAPI_GetCfgData(LAPI_URL.LowDelay, jsonMap["LowDelayCfg"][1])) {
            $("input[name='EnableLowDelay']").attr("disabled", true);
        }else {
            LAPI_CfgToForm("frmSetup", jsonMap["LowDelayCfg"][1], demoMap, jsonMap["LowDelayCfg"][0]);
        }
    }

    // 支持Sensor视角模式
    if (top.banner.isSupportViewMode) {
        $("#viewModeDiv").removeClass("hidden");
        $("#viewModeInfoDiv").removeClass("hidden");
        if(!LAPI_GetCfgData(LAPI_URL.ViewMode, jsonMap["ViewModeCfg"][1])){
            $("input[name='ViewMode']").attr("disabled", true);
        }else{
            LAPI_CfgToForm("frmSetup",jsonMap["ViewModeCfg"][1], demoMap, jsonMap["ViewModeCfg"][0]);
        }
    }

    // 支持码流发送模式
    if (top.banner.isSupportSendMode) {
        $("#sendMode").removeClass("hidden");
        if (!LAPI_GetCfgData(LAPI_URL.StreamSendMode, jsonMap["StreamSendModeCfg"][1])) {
            $("input[name='SendMode']").attr("disabled", true);
        }else {
            LAPI_CfgToForm("frmSetup", jsonMap["StreamSendModeCfg"][1], demoMap, jsonMap["StreamSendModeCfg"][0]);
        }
    }

    // 支持机芯低时延模式
    if (top.banner.isSupportHCMLowDelay && top.banner.isOldPlugin && !top.banner.isMac) {
        $("#HCMLowDelayDiv").removeClass("hidden");
        if (!getCfgData(channelId, CMD_TYPE.HCM_LOW_DELAY_CFG, dataMap)) {
            $("input[name='EnableHCMLowDelay']").attr("disabled", true);
        }
    }
    
    // 支持焦段限制开关
    if (top.banner.isSupportZoomLimitSwitch) {
        $("#ZoomLimitSwitchDiv").removeClass("hidden");
        $("#ZoomLimitSwitchDiv_telecut").removeClass("hidden");
        $("#ZoomLimitSwitchDiv_widecut").removeClass("hidden");

        if (!LAPI_GetCfgData(LAPI_URL.DemoZoomLimitSwitch, jsonMap["ZoomLimitSwitchEnable"][1])) {
            $("input[name='ZoomLimitSwitch']").attr("disabled", true);
        } else {
            LAPI_CfgToForm("frmSetup", jsonMap["ZoomLimitSwitchEnable"][1], demoMap, jsonMap["ZoomLimitSwitchEnable"][0]);
        }

        LAPI_initData(LAPI_URL.ZoomLimitSwitch, jsonMap["ZoomLimitSwitch1"][1], demoMap, jsonMap["ZoomLimitSwitch1"][0]);
    }
    //支持除雾
    if (top.banner.isSupportClearFog) {
        $("#sweepDeFog_fd").removeClass("hidden");
        LAPI_initData(LAPI_URL.ClearFog, jsonMap["ClearFogCfg"][1], demoMap, jsonMap["ClearFogCfg"][0]);
        getClearFogStatus();
    }

    //支持车牌一致性校验
    if (top.banner.isSupportIVALPCheck && IVAMode.ILLEGAL == top.banner.IVAType) {
        getIVAState();
        $("#IVALPCheckDiv").removeClass("hidden");
        if (!LAPI_GetCfgData(LAPI_URL.IVA_LP_CHECK_CFG, jsonMap["IVALPRCheck"][1])) {
            $("input[name='IVALPCheck']").attr("disabled", true);
            return;
        }
        if (top.ivaEnable) {
            $("input[name='IVALPCheck']").attr("disabled", true);
        }
        LAPI_CfgToForm("frmSetup", jsonMap["IVALPRCheck"][1], demoMap, jsonMap["IVALPRCheck"][0]);
    }

    // 支持违法时间来源配置
    if (top.banner.isSupportIVADebug && IVAMode.ILLEGAL == top.banner.IVAType) {
        $("#IVADebugDiv").removeClass("hidden");
        if(!LAPI_GetCfgData(LAPI_URL.IVA_DEBUG_CFG, jsonMap["SnapPicID"][1])) {
            $("#SnapPicID").attr("disabled", true);
            return ;
        }
        LAPI_CfgToForm("frmSetup", jsonMap["SnapPicID"][1], demoMap, jsonMap["SnapPicID"][0]);
    }

    // 支持电机镜头初始化
    if (top.banner.isSupportResetMotorLens) {
        $("#ResetMotorFocusZoom").removeClass("hidden");
    }

    if ("undefined" == typeof top.ImgCustomParam) {
        if (!LAPI_GetCfgData(LAPI_URL.SansuoCheckCfg, jsonMap["SansuoCheckCfg"][1])) {
            $("input[name='ImgCustomParam']").attr("disabled", true);
        } else {
            LAPI_CfgToForm("frmSetup",jsonMap["SansuoCheckCfg"][1], demoMap, jsonMap["SansuoCheckCfg"][0]);
            top.ImgCustomParam = Number(demoMap["ImgCustomParam"]);
        }
    } else {
        demoMap["ImgCustomParam"] = top.ImgCustomParam;
    }

    // 时差校正
    if (!LAPI_GetCfgData(LAPI_URL.ReviseTime, jsonMap["SyncTimeHour"][1])) {
        $("#ClientSyncTimeHour").attr("disabled", true);
    } else {
        LAPI_CfgToForm("frmSetup", jsonMap["SyncTimeHour"][1], demoMap, jsonMap["SyncTimeHour"][0]);
    }

    if (top.banner.isSupportEhcoCancellation && top.banner.isOldPlugin && !top.banner.isMac) {
        if (!getCfgData(channelId, CMD_TYPE.AUDIO_ECHO_CANCELLATION, dataMap)) {
            disableAll();
            return;
        }
    }

    LAPI_initData(LAPI_URL.NetDetect, jsonMap["NetDetect"][1], demoMap, jsonMap["NetDetect"][0]);

    if (top.banner.isSupportSpecialLens) {
        $("#SpecialLensTypeDiv").removeClass("hidden");
        LAPI_initData(LAPI_URL.SpecialLensType, jsonMap["SpecialLensTypeCfg"][1], demoMap, jsonMap["SpecialLensTypeCfg"][0]);
    }

    /*if ((top.banner.ptzType == 1) && (top.banner.isSupportPTZ) && !top.banner.isRefactor) {
        $("#ImageReverseEnableDiv").removeClass("hidden");
        //图像采集翻转
        if (!getCfgData(channelId, CMD_TYPE.IMAGE_REVERSE_ENABLE_CFG, dataMap)) {
            disableAll();
            return;
        }
    }*/

    /*if (!top.banner.isRefactor) {
        $("#FramePeriodDebugEnableDiv").removeClass("hidden");
        if (!getCfgData(channelId, CMD_TYPE.KEYFRAME_PERIOD, dataMap)) {
            disableAll();
            return;
        }
    }*/

    if (IVAMode.ILLEGAL == top.banner.IVAType){
        $("#SmilarLPFilterEnableDiv").removeClass("hidden");
        if (!LAPI_GetCfgData(LAPI_URL.IVA_SIMILAR_LP_FILTER_CFG, jsonMap["similarLpFilter"][1])) {
            disableAll();
            return;
        }
        LAPI_CfgToForm("frmSetup", jsonMap["similarLpFilter"][1], demoMap, jsonMap["similarLpFilter"][0]);
    }

    //音频AGC开关
    if (top.banner.isSupportAudio) {
        $("#AGCModeEnableDiv").removeClass("hidden");
        LAPI_initData(LAPI_URL.AudioAGC, jsonMap["AudioAGC"][1], demoMap, jsonMap["AudioAGC"][0]);
    }

    //安全接入开关
    if (top.banner.isSupportSecureAccess) {
        $("#SecureAccessDiv").removeClass("hidden");
        LAPI_initData(LAPI_URL.SecureAccess, jsonMap["SecureAccess"][1], demoMap, jsonMap["SecureAccess"][0]);
    }

    //H264 PayloadType值配置
    $("#PayloadTypeDiv").removeClass("hidden");
    LAPI_initData(LAPI_URL.H264PayloadType, jsonMap["PayloadType"][1], demoMap, jsonMap["PayloadType"][0]);  
    LAPI_initData(LAPI_URL.GBTCPStream, jsonMap["GBTCPStreamCfg"][1], demoMap, jsonMap["GBTCPStreamCfg"][0]);
    // PTZ能力上报限制开关
    LAPI_initData(LAPI_URL.PTZCapReportLimit, jsonMap["PTZCapReportLimit"][1], demoMap, jsonMap["PTZCapReportLimit"][0]);

    //照片直存方式

    if (top.banner.isSupportIVA) {
        LAPI_initData(LAPI_URL.PhotoStorage, jsonMap["PhotoStorage"][1],demoMap,jsonMap["PhotoStorage"][0] );
    }

    if(!$("#presetEnableDiv").hasClass("hidden")){
        LAPI_initData(LAPI_URL.ExPtzSpecFunc, jsonMap["OutPtzEx"][1], demoMap, jsonMap["OutPtzEx"][0]);
    }

    /*var retcode = top.sdk_viewer.ViewerAxGetDbMsgProCfg20(channelId, subChannelId);
    var resultList = getSDKParam(retcode);
    if (ResultCode.RESULT_CODE_SUCCEED != resultList[0]) {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return false;
    }
    sdkAddCfg(dataMap, resultList[1]);*/

    demoMap["EnhanceMode"] = top.banner.enhanceMode;

    cfgToForm(demoMap,"frmSetup");
    cfgToForm(dataMap, "frmSetup");
    demoMap_bak = objectClone(demoMap);
}

function initEvent() {
    var flag,
        jsonMap_Reboot,
        isFanChanged;

    $("input[name='daemobDetectionEnable']").bind("click", function () {
        LAPI_submitF("/LAPI/V1.0/Channel/0/Demo/Daemon", jsonMap["daemobDetectionEnable"][1], demoMap, jsonMap["daemobDetectionEnable"][0]);
    });

    $("input[name='Mode']").bind("click", function () {
        LAPI_submitF(LAPI_URL.AcceptanceMode, jsonMap["EnginnerAcceptance"][1], demoMap, jsonMap["EnginnerAcceptance"][0]);
});
    $("#MinBiteRate").change(function(){
        if(!validator.form()) {
            return;
        }
        LAPI_submitF(LAPI_URL.AcceptanceMode, jsonMap["EnginnerAcceptance"][1], demoMap, jsonMap["EnginnerAcceptance"][0]);
});

    $("input[name='EnableLowDelay']").bind("click", function () {
        LAPI_FormToCfg("frmSetup", jsonMap["LowDelayCfg"][1], demoMap, jsonMap["LowDelayCfg"][0]);
        isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isFanChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        } else {
            if (!confirm($.lang.tip["tipChangeLowDelayCfg"])) {
                $("input[name='EnableLowDelay'][value='" + demoMap_bak["EnableLowDelay"] + "']").attr("checked", true);
                return false;
            }
            flag = LAPI_SetCfgData(LAPI_URL.LowDelay,jsonMap["LowDelayCfg"][1]);
            if (flag) {
                demoMap_bak = objectClone(demoMap);
                top.banner.PageBlockType = BlockType.REBOOT;
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.video.isSleepReplay = true;
            }
        }
    });
    $("input[name='ViewMode']").bind("click", function () {
        LAPI_FormToCfg("frmSetup", jsonMap["ViewModeCfg"][1], demoMap, jsonMap["ViewModeCfg"][0]);
        isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isFanChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        } else {
            if (confirm($.lang.tip["tipViewModeReboot"])) {
                flag = LAPI_SetCfgData(LAPI_URL.ViewMode,jsonMap["ViewModeCfg"][1]);
                if (flag) {
                    demoMap_bak = objectClone(demoMap);
                    flag = LAPI_SetCfgData(LAPI_URL.LAPI_Reboot,jsonMap_Reboot,false);
                    if(flag){
                        top.banner.PageBlockType = BlockType.REBOOT;
                        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                        top.banner.video.isSleepReplay = true;
                    }else{
                        showResult("rebootStatusDiv", false, $.lang.tip["tipRebootFailure"]);
                    }
                }
            } else {
                $("input[name='ViewMode'][value='" + demoMap_bak["ViewMode"] + "']").attr("checked", true);
            }
        }
    });
    $("input[name='ImgCustomParam']").bind("click", function () {
        LAPI_FormToCfg("frmSetup",jsonMap["SansuoCheckCfg"][1], demoMap, jsonMap["SansuoCheckCfg"][0]);
        var isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isFanChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        } else {
            flag = LAPI_SetCfgData(LAPI_URL.SansuoCheckCfg,jsonMap["SansuoCheckCfg"][1]);
            if (flag) {
                demoMap_bak = objectClone(demoMap);
                top.ImgCustomParam = demoMap_bak["ImgCustomParam"];
            }
        }
    });
    $("input[name='SendMode']").bind("click", function () {
        LAPI_FormToCfg("frmSetup", jsonMap["StreamSendModeCfg"][1], demoMap, jsonMap["StreamSendModeCfg"][0]);
        var isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isFanChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        } else {
            if (confirm($.lang.tip["tipSendModeReboot"])) {
                flag = LAPI_SetCfgData(LAPI_URL.StreamSendMode, jsonMap["StreamSendModeCfg"][1]);
                if (flag) {
                    demoMap_bak = objectClone(demoMap);
                    flag = LAPI_SetCfgData(LAPI_URL.LAPI_Reboot,jsonMap_Reboot,false);

                    if (flag) {
                        top.banner.PageBlockType = BlockType.REBOOT;
                        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                        top.banner.video.isSleepReplay = true;
                    }else {
                        showResult("rebootStatusDiv", false, $.lang.tip["tipRebootFailure"]);
                    }
                }
            } else {
                $("input[name='SendMode'][value='" + demoMap_bak["SendMode"] + "']").attr("checked", true);
            }
        }
    });
    $("input[name='EnableHCMLowDelay']").bind("click", function () {
        submitF(CMD_TYPE.HCM_LOW_DELAY_CFG);
    });
    $("input[name='StoreType']").bind("click", function () {
     formToCfg("frmSetup",demoMap);
        var isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isFanChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        } else {
            jsonMap["PhotoStorage"][1] = {};
            jsonMap["PhotoStorage"][1]["StorageMode"] = demoMap["StoreType"];
            flag = LAPI_SetCfgData(LAPI_URL.PhotoStorage, jsonMap["PhotoStorage"][1]);
            if (flag) {
                demoMap_bak = objectClone(demoMap);
            }
        }
    });
    $("input[name='ZoomLimitSwitch']").bind("click", function () {
        LAPI_submitF(LAPI_URL.DemoZoomLimitSwitch, jsonMap["ZoomLimitSwitchEnable"][1], demoMap, jsonMap["ZoomLimitSwitchEnable"][0]);
    });
    $("input[name='IVALPCheck']").bind("click", function() {
        LAPI_submitF(LAPI_URL.IVA_LP_CHECK_CFG, jsonMap["IVALPRCheck"][1], demoMap, jsonMap["IVALPRCheck"][0]);
    });
    $("#SnapPicID").change(function() {
        LAPI_submitF(LAPI_URL.IVA_DEBUG_CFG, jsonMap["SnapPicID"][1], demoMap, jsonMap["SnapPicID"][0]);
    });

    $("#ClientSyncTimeHour").change(function () {
        LAPI_submitF(LAPI_URL.ReviseTime, jsonMap["SyncTimeHour"][1], demoMap, jsonMap["SyncTimeHour"][0]);
    });
    $("input[name='AudioEchoCancellation']").bind("click", function () {
        submitF(CMD_TYPE.AUDIO_ECHO_CANCELLATION);
    });
    $("#ResetMotorFocusZoomBtn").bind("click", function () {
        var flag = LAPI_SetCfgData(LAPI_URL.LensMotorReset,"");
        top.banner.showMsg(flag);
    });

    $("input[name='ProfileMode']").bind("click", function () {
        LAPI_FormToCfg("frmSetup", jsonMap["ProfileMode"][1], demoMap, jsonMap["ProfileMode"][0]);
        var isFanChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isFanChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        } else {
            if (!confirm($.lang.tip["tipChangeProfileMode"])) {
                $("input[name='ProfileMode'][value='" + demoMap_bak["ProfileMode"] + "']").attr("checked", true);
                return false;
            }
            flag = LAPI_SetCfgData(LAPI_URL.ProfileMode, jsonMap["ProfileMode"][1]);
            if (flag) {
                demoMap_bak = objectClone(demoMap);
                top.banner.PageBlockType = BlockType.REBOOT;
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.video.isSleepReplay = true;
            }
        }
    });
    $("input[name='DefogMode']").bind("click", function () {
        LAPI_submitF(LAPI_URL.ClearFog,jsonMap["ClearFogCfg"][1], demoMap, jsonMap["ClearFogCfg"][0]);
    });
    $("input[name='EnhanceMode']").bind("click", function () {
        var value = $("input[name='EnhanceMode']:checked").val();
        if (value == demoMap["EnhanceMode"]) return;
        if (confirm($.lang.tip["tipSansuoModeReboot"])) {

            LAPI_FormToCfg("frmSetup", jsonMap["EnhanceMode"][1], demoMap, jsonMap["EnhanceMode"][0]);
            flag = LAPI_SetCfgData(LAPI_URL.EnhanceMode, jsonMap["EnhanceMode"][1]);
            if (flag) {
                demoMap_bak = objectClone(demoMap);
                top.banner.enhanceMode = value;
                if (1 == top.banner.enhanceMode) {
                    top.banner.$("#operateLogLink").removeClass("hidden");
                } else {
                    top.banner.$("#operateLogLink").addClass("hidden");
                }
                top.banner.startPresetID = (0 == value) ? 1 : 0;
                top.banner.PageBlockType = BlockType.REBOOT;
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.video.isSleepReplay = true;
            }
        } else {
            $("input[name='EnhanceMode'][value='" + demoMap_bak["EnhanceMode"] + "']").attr("checked", true);
        }
    });
    $("input[name='NetworkDetectEnable']").bind("click", function () {
        LAPI_submitF(LAPI_URL.NetDetect, jsonMap["NetDetect"][1], demoMap, jsonMap["NetDetect"][0]);
    });

    $("input[name='NetworkReboot']").bind("click", function () {
        LAPI_submitF(LAPI_URL.NetDetect, jsonMap["NetDetect"][1], demoMap, jsonMap["NetDetect"][0]);
    });

    $("#SpecialLensType").change(function () {
        LAPI_submitF(LAPI_URL.SpecialLensType, jsonMap["SpecialLensTypeCfg"][1], demoMap, jsonMap["SpecialLensTypeCfg"][0]);
    });

    $("input[name='ImageReverseEnable']").bind("click", function() {
        if (confirm($.lang.tip["tipImageReverseReboot"])) {
            if (submitF(CMD_TYPE.IMAGE_REVERSE_ENABLE_CFG)) {
                top.banner.PageBlockType = BlockType.REBOOT;
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.video.isSleepReplay = true;
            }
        } else {
            $("input[name='ImageReverseEnable'][value='" + dataMap["ImageReverseEnable"] + "']").attr("checked", true);
        }
    });

    $("#FramePeriodDebugEnable").bind("click", function () {
        if (!validator.form()) {
            $("#FramePeriodDebugEnable").attr("checked", (1 == dataMap["FramePeriodDebugEnable"]));
            return;
        }
        submitF(CMD_TYPE.KEYFRAME_PERIOD);
    });

    $("#FramePeriodDebugInterval").change(function () {
        if (!validator.form()) {
            return;
        }
        submitF(CMD_TYPE.KEYFRAME_PERIOD);
    });

    $("input[name='SmilarLPFilterEnable']").bind("change", function() {
        LAPI_submitF(LAPI_URL.IVA_SIMILAR_LP_FILTER_CFG, jsonMap["similarLpFilter"][1], demoMap, jsonMap["similarLpFilter"][0]);
    });

    $("input[name='AGCModeEnable']").bind("click", function () {
        LAPI_submitF(LAPI_URL.AudioAGC, jsonMap["AudioAGC"][1], demoMap, jsonMap["AudioAGC"][0]);
    });

    $("#PayloadType").change(function () {
        if (!validator.form()) {
            return;
        }
        LAPI_submitF(LAPI_URL.H264PayloadType, jsonMap["PayloadType"][1], demoMap, jsonMap["PayloadType"][0]);
    });

    $("input[name='HasRTPHead']").bind("click", function () {
        LAPI_submitF(LAPI_URL.GBTCPStream, jsonMap["GBTCPStreamCfg"][1], demoMap, jsonMap["GBTCPStreamCfg"][0]);
    });

    $("input[name='ConnectMode']").bind("click", function () {
        LAPI_submitF(LAPI_URL.GBTCPStream, jsonMap["GBTCPStreamCfg"][1], demoMap, jsonMap["GBTCPStreamCfg"][0]);
    });
    $("input[name='Enable']").bind("click", function () {
        LAPI_submitF(LAPI_URL.Fan, jsonMap["FanEnable"][1], demoMap, jsonMap["FanEnable"][0]);
    });
    $("#ZoomLimitSwitch_telecut").change(function () {
        if (!validator.form()) {
            return;
        }
        LAPI_submitF(LAPI_URL.ZoomLimitSwitch, jsonMap["ZoomLimitSwitch1"][1], demoMap, jsonMap["ZoomLimitSwitch1"][0]);
    });
    $("#ZoomLimitSwitch_widecut").change(function () {
        if (!validator.form()) {
            return;
        }
        LAPI_submitF(LAPI_URL.ZoomLimitSwitch, jsonMap["ZoomLimitSwitch1"][1], demoMap, jsonMap["ZoomLimitSwitch1"][0]);
    });

    $("#CustomDeviceEnable").bind("click", function () {
        tempMap = {};
        if (confirm($.lang.tip["tipCustomDeviceReboot"])) {
            tempMap["Enable"] = 0;
            if (LAPI_SetCfgData(LAPI_URL.HideDeviceInfo, tempMap)) {
                top.banner.PageBlockType = BlockType.RELOGIN;
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.video.isSleepReplay = true;
            }
        }
    });

    $("#CustomDeviceModel").change(function () {
        if (!validator.form()) {
            return;
        }
        tempMap = {};
        if (confirm($.lang.tip["tipCustomDeviceReboot"])) {
            tempMap["Enable"] = 1;
            tempMap["CustomDeviceModel"] = $("#CustomDeviceModel").val();
            if (LAPI_SetCfgData(LAPI_URL.HideDeviceInfo, tempMap)) {
                top.banner.PageBlockType = BlockType.RELOGIN;
                top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                top.banner.video.isSleepReplay = true;
            }
        } else {
            $("#CustomDeviceModel").val(top.banner.titleDeviceType);
        }
    });
    $("input[name='SecureAccess']").click(function () {
        LAPI_submitF(LAPI_URL.SecureAccess, jsonMap["SecureAccess"][1], demoMap, jsonMap["SecureAccess"][0]);
    });

    $("#authenticationMode").change(function() {
       LAPI_submitF(LAPI_URL.HttpAuth, jsonMap["authenticationMode"][1], demoMap, jsonMap["authenticationMode"][0]);
        var autMode = Number(demoMap["authenticationMode"]);
        if("https:" == document.location.protocol){
            switch(autMode){
                case 0:
                    autMode = 10;
                    break;
                case 1:
                    autMode = 11;
                    break;
                case 2:
                    autMode = 12;
                    break;
            }
        }
        //切换鉴权方式需重新订阅
        top.sdk_viewer.execFunctionReturnAll("NetSDKUnRegPostEvent");
        top.sdk_viewer.execFunctionReturnAll("NetSDKRegPostAuzEvent",LAPI_URL.Subscription,parent.loginServerIp,Number(parent.httpPort),8,parent.loginUserName,parent.loginUserPwd,autMode);
    });
    $("input[name='PTZCapReportLimitEnable']").bind("click", function(){
        LAPI_FormToCfg("frmSetup", jsonMap["PTZCapReportLimit"][1], demoMap, jsonMap["PTZCapReportLimit"][0]);
        var isChanged = !isObjectEquals(demoMap, demoMap_bak);

        if (!isChanged) {
            top.banner.showMsg(true,$.lang.tip["tipAnyChangeInfo"],0);
        } else {
            if (confirm($.lang.tip["tipPTZCapReportLimitReboot"])) {
                flag = LAPI_SetCfgData(LAPI_URL.PTZCapReportLimit,jsonMap["PTZCapReportLimit"][1]);
                if (flag) {
                    demoMap_bak = objectClone(demoMap);
                    flag = LAPI_SetCfgData(LAPI_URL.LAPI_Reboot,jsonMap_Reboot,false);
                    if(flag){
                        top.banner.PageBlockType = BlockType.REBOOT;
                        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                        top.banner.video.isSleepReplay = true;
                    }else{
                        showResult("rebootStatusDiv", false, $.lang.tip["tipRebootFailure"]);
                    }
                }
            } else {
                $("input[name='PTZCapReportLimitEnable'][value='" + demoMap_bak["PTZCapReportLimitEnable"] + "']").attr("checked", true);
            }
        }
    });

    $("input[name='OutPtzEnable']").bind("click", function () {
        LAPI_submitF(LAPI_URL.ExPtzSpecFunc, jsonMap["OutPtzEx"][1], demoMap, jsonMap["OutPtzEx"][0]);
    });
}

$(document).ready(function () {
    parent.selectItem("demoFuncTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});