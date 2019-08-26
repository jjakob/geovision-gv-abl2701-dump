// JavaScript Document
GlobalInvoke(window);
//加载语言文件
var jsonMap_PTZCfg = {};
var jsonMap_PTZCfg_bak = {};
var mappingMap_PTZCfg = {
    DemoPtzMaxSpeedText : ["MaxSpeed"],
    DemoPtzMinSpeedText :["MinSpeed"],
    PtzHorLockForce :["HorLockForce"],
    PtzVerLockForce :["VerLockForce"],
    PtzMaxAngleText :["MaxVerAng"],
    PtzStartMode : ["AccelMode"]
};
var ptzCfg_Map = {};
var channelId = 0;

function validPtzSpeed() {
    return Number($("#DemoPtzMaxSpeedText").val()) > Number($("#DemoPtzMinSpeedText").val());
}
function submitF() {
    LAPI_FormToCfg("frmSetup", jsonMap_PTZCfg, ptzCfg_Map, mappingMap_PTZCfg);
    jsonMap_PTZCfg["MaxSpeed"] = (jsonMap_PTZCfg["MaxSpeed"] * 100);
    jsonMap_PTZCfg["MinSpeed"] = (jsonMap_PTZCfg["MinSpeed"] * 100);
    jsonMap_PTZCfg["MaxVerAng"] = (jsonMap_PTZCfg["MaxVerAng"] * 100);
    var isChange = !isObjectEquals(jsonMap_PTZCfg,jsonMap_PTZCfg_bak);

    if (!isChange || !validator.form()) {
        return;
    }
    if (!confirm($.lang.tip["tipDemoPtzNeedReboot"])) {
        return;
    }
    if(LAPI_SetCfgData(LAPI_URL.DemoPTZCfg, jsonMap_PTZCfg)){
        jsonMap_PTZCfg_bak = objectClone(jsonMap_PTZCfg);
        $("#rebootStatusDiv").addClass("hidden");
        top.banner.PageBlockType = BlockType.REBOOT;
        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
        top.banner.video.isSleepReplay = true;
    }
}

// jQuery验证初始化
function initValidator() {
    var MaxSpeed = top.banner.demoPtzMaxSpeed,
        MinSpeed = top.banner.demoPtzMinSpeed,
        MaxLockForce = top.banner.demoPtzMaxLockForce,
        MinLockForce = top.banner.demoPtzMinLockForce,
        MinVerAngle = top.banner.demoPtzMinVerAngle;
        MaxVerAngle = top.banner.demoPtzMaxVerAngle;
    
    $("#DemoPtzMaxSpeedText").attr("tip", $.validator.format($.lang.tip["tipRealRange"], MinSpeed, MaxSpeed));
    $("#DemoPtzMinSpeedText").attr("tip", $.validator.format($.lang.tip["tipRealRange"], MinSpeed, MaxSpeed));
    $("#PtzHorLockForce").attr("tip", $.validator.format($.lang.tip["tipIntRange"], MinLockForce, MaxLockForce));
    $("#PtzVerLockForce").attr("tip", $.validator.format($.lang.tip["tipIntRange"], MinLockForce, MaxLockForce));
    $("#PtzMaxAngleText").attr("tip", $.validator.format($.lang.tip["tipRealRange"], MinVerAngle, MaxVerAngle));
    $.validator.addMethod("validPtzSpeed", function(value) {
        return validPtzSpeed(value);
    }, $.lang.tip["tipPtzSpeedErr"]);
    
    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success : function(label) {
        },
        rules : {
            DemoPtzMaxSpeedText : {
                required : true,
                range : [MinSpeed, MaxSpeed],
                validPtzSpeed: ""
            },
            DemoPtzMinSpeedText : {
                required : true,
                range : [MinSpeed, MaxSpeed],
                validPtzSpeed: ""
            },
            PtzHorLockForce : {
                integer : true,
                required : true,
                range : [MinLockForce, MaxLockForce]
            },
            PtzVerLockForce : {
                integer : true,
                required : true,
                range : [MinLockForce, MaxLockForce]
            },
            PtzMaxAngleText : {
                required : true,
                range : [MinVerAngle, MaxVerAngle]
            }
        }
    });
    validator.init();
}

function initPage() {
    
}

function initData() {
    if (!LAPI_GetCfgData(LAPI_URL.DemoPTZCfg, jsonMap_PTZCfg)) {
        disableAll();
        return;
    }
    jsonMap_PTZCfg_bak = objectClone(jsonMap_PTZCfg);
    jsonMap_PTZCfg["MaxSpeed"] = (jsonMap_PTZCfg["MaxSpeed"] / 100).toFixed(2);
    jsonMap_PTZCfg["MinSpeed"] = (jsonMap_PTZCfg["MinSpeed"] / 100).toFixed(2);
    jsonMap_PTZCfg["MaxVerAng"] = (jsonMap_PTZCfg["MaxVerAng"] / 100).toFixed(2);
    LAPI_CfgToForm("frmSetup", jsonMap_PTZCfg, ptzCfg_Map,  mappingMap_PTZCfg);
}

function initEvent() {
    $("#PtzResetCfg").bind("click", function(){
        if (!confirm($.lang.tip["tipDemoPtzNeedReboot"])) {
            return;
        }
        var flag = submitCtrolCmd(0x1801, 0, 0);
        top.banner.showMsg(flag);
        if (flag) {
            $("#rebootStatusDiv").addClass("hidden");
            top.banner.PageBlockType = BlockType.REBOOT;
            top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
            top.banner.video.isSleepReplay = true;
        }
    });
    $("#PtzResetPos").bind("click", function(){
        var flag = submitCtrolCmd(0x1801, 1, 0);
        top.banner.showMsg(flag);
    });
}

$(document).ready(function() {
    parent.selectItem("demoPtzTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});