// JavaScript Document
/* 通行证 */
GlobalInvoke(window);
var channelId = 0;
var TaskNum = 1;
var dataMap = {};
var maxDigitalZoom_dataMap={};
var maxDigitalZoom_jsonMap={};
var maxDigitalZoom_mappingMap={
    MaxDigitalZoom:["MaxDigitalZoom"]
};
var jsonMap_timeReboot = {};
var jsonMap_timeReboot_bak = {};
var mappingMap_timeReboot = {
    TaskEnable1:["TaskInfo", 0,"Enable"],
    Frequency1:["TaskInfo", 0,"Frequency"],
    StartTime1:["TaskInfo", 0,"TimeSection","Begin"]
};
var ManualFocusMap = {};

var IQDebugMap = {};         //收集图像调试信息
var IQDebug_jsonMap = {};
var IQDebug_mappingMap = {
    IQDebugEnable: ["Enabled"]
};
var lensType_jsonMap = {};  //镜头类型

var jsonMapDDR = {};
var dataMap_DDR = {}
var dataMapDDR_bak = {};
var mappingMap_DDR = {
    FrequencyCfg: ["Frequency"]
};
var timer;
//选择文件
function chooseFileText(id) {
    var obj = $("#" + id),
        fileName = obj.val();
    if("FileName" == id) {
        $("#filenameTxt").val(fileName);
        $("#ImportBtn").attr("disabled",false);
    } else if("updateFileName" == id) {
        $("#uploadFile").val(fileName);
        $("#update").attr("disabled",false);
    }
}

function importCfg() {
    var fileNames,
        pathNameNode,
        fileNameTxt = $("#filenameTxt").val(),
        configNode = fileNameTxt.lastIndexOf("config"),
        configName = fileNameTxt.slice(configNode),
        changedFileName = fileNameTxt.replace(configName,"config");
    if(checkNavigator("firefox")){
        fileNames = changedFileName;
    }else{
        pathNameNode =changedFileName.lastIndexOf("\\");
        fileNames = changedFileName.slice(pathNameNode+1);
    }
    if (confirm($.lang.tip["tipCfmImportCfg"])) {
        LAPI_UploadFile(LAPI_URL.ConfigurationInfo + fileNames, "FileName", importCfg_callback);
    }
}

function importCfg_callback(flag) {
    if (flag) {
        top.banner.PageBlockType = BlockType.REBOOT;
        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
        top.banner.video.isSleepReplay = true;
        msg = $.lang.tip["tipCfgUpSucceededInfo"];
    } else {
        msg = $.lang.tip["tipImportCfgFailure"];
    }
    showResult("importStatusDiv", flag, msg);
}

/************************************** 升级业务 start ********************************************/
// 软件升级（通知软件准备升级）
function StartUpdate(f) {
    var pcFile = document.frmSetup.uploadFile.value;
    var type;
    var fileName,
        fileNameNode;

    if ("" == pcFile)
        return;
    if (!confirm($.lang.tip["tipCfmUpdateSoft"])) {
        return false;
    } 
       
    //判断是否是定制包升级或补丁升级
    if (pcFile.lastIndexOf("customize.cst") > -1 || pcFile.lastIndexOf(".patch") > -1) {
        if(checkNavigator("firefox")){
            fileName = pcFile;
        }else{
            fileNameNode = pcFile.lastIndexOf("\\");
            fileName = pcFile.slice(fileNameNode+1);
        }
        LAPI_UploadFile(LAPI_URL.CustomizeUpdate+"?Name="+fileName+"&UserName="+top.loginUserName, "updateFileName", customUpdateCallback);
    }else{
        //判断是否勾选Uboot升级，如果是调用uboot升级接口。否则调用老接口。
        if ($("#updateWithUboot").attr("checked") == true) {
            type = 2;
        } else {
            type = 3;
        }
        top.banner.updateTime = top.banner.setTimeout(function(){
            clearTimeout(timer);
            showResult("updateStatusDiv", false, $.lang.tip["tipSysUpdateTimeout"]);
            top.banner.updateBlock(true, $.lang.tip["tipSysUpdateTimeout"]);
        }, 300000);
        if(!LAPI_SetCfgData(LAPI_URL.Upgrade,{"UpgradeType":type,"FilePath":""}, false, callback_codeTime)){
            showResult("updateStatusDiv",false, $.lang.tip["tipSysUpdateFailure"]);
        }
    }
}

function customUpdateCallback(flag){
    if (flag) {
        top.banner.PageBlockType = BlockType.CUSTOM_UPDATE;
        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
        top.banner.video.isSleepReplay = true;
        msg = $.lang.tip["tipCustomUpdateSucceed"];
    } else {
        msg = $.lang.tip["tipCustomUpdateFail"];
    }
    showResult("updateStatusDiv", flag, msg);
}

// 软件升级（根据软件返回的延迟升级时间，启定时器发送升级包）
function callback_codeTime(errorCode, map) {
    if(errorCode == ResultCode.RESULT_CODE_SUCCEED) {
        // 遮盖界面
        top.banner.updateBlock(true, $.lang.tip["tipSysUpdating"]);
        top.banner.PageBlockType = BlockType.UPDATE;
        top.banner.video.isSleepReplay = true;
        top.showedFlag = false;
        top.banner.updateMsg = false;
        top.banner.updateStatus = false;
        setTimeout("waitUpdate()", 10000);
    }
}
function waitUpdate(){
    var tmp = {};
    LAPI_GetCfgData(LAPI_URL.UpdateStatus,tmp,"",false);
    if(tmp["UpdateStatus"] == UpdateResult.WAIT_RECEIVE_DATA){
        LAPI_UploadFile(LAPI_URL.UploadFirmware, "updateFileName", queryUpdateStatus);
    }else{
         timer = setTimeout("waitUpdate()", 10000);
    }
}

// 软件升级（升级状态查询）
function queryUpdateStatus(){
    var jsonMapUpdateStatus = {},
        status;
    LAPI_GetCfgData(LAPI_URL.UpdateStatus,jsonMapUpdateStatus,"",false);
    status = jsonMapUpdateStatus["UpdateStatus"];
    top.banner.showUpdateResult(status);

    if (UpdateResult.INPROCESS == parseInt(status) || (1001 <= parseInt(status) && parseInt(status)<=1100) || UpdateResult.FILEFINISH == parseInt(status)){ //正在升级或文件传输
        setTimeout("queryUpdateStatus()", 3000);
    }
}
/************************************** 升级业务 end ********************************************/

function showResult(id, bool, msg) {
    if (bool) {
        $("#" + id + " a").removeClass("fail").addClass("success");
    } else {
        $("#" + id + " a").removeClass("success").addClass("fail");
    }
    $("#" + id + " span").text(msg);
    $("#" + id + " a").removeClass("hide");
    $("#" + id).removeClass("hide");
}

// 确认重启信息
function makeSureReboot() {
    var ulErrorCode, flag, msg,jsonMap_Reboot = {};

    if (confirm($.lang.tip["tipCfmReboot"])) {
        flag = LAPI_SetCfgData(LAPI_URL.LAPI_Reboot,jsonMap_Reboot,false);

        if (flag) {
            $("#rebootStatusDiv").addClass("hide");
            top.banner.PageBlockType = BlockType.REBOOT;
            top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
            top.banner.video.isSleepReplay = true;
        } else {
            showResult("rebootStatusDiv", false, $.lang.tip["tipRebootFailure"]);
        }
    }
}


//查询云升级状态
function queryUpdateCloudStatus(){
    var jsonMapUpdateStatus = {},
        status;
    LAPI_GetCfgData(LAPI_URL.UpdateStatus,jsonMapUpdateStatus);
    status = jsonMapUpdateStatus["UpdateStatus"];
    top.banner.showUpdateCloudResult(status);

    if ((UpdateCloudResult.INPROCESS == parseInt(status)) || (1001 <= parseInt(status) && parseInt(status) <= 1100) || (UpdateCloudResult.FILEFINISH == parseInt(status)) || (UpdateCloudResult.WAIT_RECEIVE_DATA == parseInt(status))) { //正在升级或文件传输
        setTimeout("queryUpdateCloudStatus()", 3000);
    }
}

//检测及云升级
function checkAndCloudUpdate(){
    if ($.lang.pub["cloudUpdate"] == $("input[name = 'cloudUpdateBtn']").val()){
        CloudUpdate();
    }else if($.lang.pub["Detection"] == $("input[name = 'cloudUpdateBtn']").val()) {
        detectVersion();
    }
}

//云升级
function CloudUpdate() {
    var  flag;

    if (confirm($.lang.tip["tipCfmUpdateCloud"])) {
        flag = LAPI_SetCfgData(LAPI_URL.Upgrade,{"UpgradeType":1,"FilePath":""},false);

        if (flag) {
            // 遮盖界面
            top.banner.updateBlock(true, $.lang.tip["tipSysUpdating"]);
            top.banner.PageBlockType = BlockType.UPDATE;
            top.banner.video.isSleepReplay = true;
            top.showedFlag = false;
            top.banner.updateStatus = false;
            setTimeout(function(){
                queryUpdateCloudStatus();
            },20000);
        } else {
            showResult("cloudUpdateStatus", false, $.lang.tip["tipSysUpdateFailure"]);
        }
    }
}

function detectVersionCallback(result,map){
    if (result == ResultCode.RESULT_CODE_SUCCEED){
        if(undefined == map["HasNewVersion"] || 0 == parseInt(map["HasNewVersion"])){
            $("#cloudUpdateStatus span").text($.lang.pub["noCheckNewVersion"]);
        }else if(1 == parseInt(map["HasNewVersion"])){
            $("#cloudUpdateStatus span").text($.lang.pub["checkNewVersion"]);
            $("input[name = 'cloudUpdateBtn']").val($.lang.pub["cloudUpdate"]);
        }
        $("#cloudUpdateStatus a").addClass("hide");
        $("#cloudUpdateStatus").removeClass("hide");
    }else {
        top.banner.showMsg(false);
    }
    top.banner.updateBlock(false);
}

//检查云上最新版本
function detectVersion(){
    //检查云上最新版本
    var updateVersion = {};
    top.banner.updateBlock(true,$.lang.pub["checkingNewVersion"]);
    LAPI_GetCfgData(LAPI_URL.UpgradeInfo, updateVersion,"",true,detectVersionCallback, {async: true});
}

// 确认重置云台
function makeSureResetPtz() {
    if (confirm($.lang.tip["tipResetPtz"])) {
        var ulErrorCode =LAPI_SetCfgData(LAPI_URL.LAPI_PTZReset);
        if (ulErrorCode) {
            top.banner.showMsg(true);
        } else {
            top.banner.showMsg(false);
        }
    }
}

//配置导出回调
function cfgExportCallback(result,map){
    if(result == ResultCode.RESULT_CODE_SUCCEED){
        window.location.href = map["URL"]+"?t=" + new Date().getTime();
    }else {
        showResult("exportStatusDiv", false, $.lang.tip["tipExportCfgFailure"]);
    }
    top.banner.updateBlock(false);
}

// 配置导出
function CfgExport() {
    top.banner.updateBlock(true, $.lang.tip["tipExportCfgInformation"]);
    LAPI_GetCfgData(LAPI_URL.ConfigurationInfoURL,{},"",true,cfgExportCallback,{async: true});
}

// 确认恢复默认配置信息
function makeSureRestore() {
    var flag, msg, v, jsonMap_Reset = {"Mode": 0};
    
    if (confirm($.lang.tip["tipCfmRestoreCfg"])) {
        v = $("#restoreStatusInput").is(":checked")? 1: 0;
        jsonMap_Reset["Mode"] = v;
        
        flag = LAPI_SetCfgData(LAPI_URL.LAPI_FactoryReset,jsonMap_Reset,false);
        msg = (flag) ? $.lang.tip["tipCfgRestoreSucceedInfo"] : $.lang.tip["tipRestoreFailure"];
        if (flag) {
            // 遮盖界面
            top.banner.PageBlockType = BlockType.RELOGIN;
            top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
        }

        showResult("restoreStatusDiv", flag, msg);
    }
}

//导出诊断信息回调
function exportLogCallback(result,map){
    if(result == ResultCode.RESULT_CODE_SUCCEED){
        window.location.href = map["URL"]+"?t=" + new Date().getTime();
    }else {
        showResult("downloadStatusDiv", false, $.lang.tip["tipLogExportFail"]);
    }
    top.banner.updateBlock(false);
    top.banner.exportLog = false;
}

//导出诊断信息
function ExportLog() {
    top.banner.exportLog = true;
    top.banner.updateBlock(true, $.lang.tip["tipExportCfgInfo"]);
    LAPI_GetCfgData(LAPI_URL.LAPI_DiagnosisInfo,{},"",true,exportLogCallback,{async: true});
}

function timeTaskEnable() {
    var bool = $("#TaskEnable1").is(":checked");

    // 灰显/不灰显 相关项
    $("#Frequency1").attr("disabled", !bool);
    $("#StartTime1").attr("disabled", !bool);
}

function init(f) {
    if(top.banner.isOldPlugin && !top.banner.isMac){
        if (!top.banner.video.initPlayWnd()) {
            disableAll();
            return;
        }
        var resultList = getSDKParam(top.sdk_viewer.ViewerAxGetLocalCfg20());
        if (ResultCode.RESULT_CODE_SUCCEED == resultList[0]) {
            var localDataMap = {};
            sdkAddCfg(localDataMap, resultList[1]);
            cfgToForm(localDataMap, "frmSetup");


        }
    }
    $("#btnOutput").attr("disabled",false);
    $("#ExportBtn").attr("disabled",false);
    // 支持球机安装高度
    if (top.banner.isSupportIntallHeight) {
        $("#deviceInstallInfo").removeClass("hidden");
        $("#deviceInstallUL").removeClass("hidden");
        if(LAPI_GetCfgData(LAPI_URL.LAPI_Installation,dataMap)) {
            document.frmSetup.submitFBtn.disabled = false;
        }
    }
    
    // 支持ABF镜头
    if (top.banner.isSupportLensType) {
        $("#deviceInstallInfo").removeClass("hidden");
        $("#lensUL").removeClass("hidden");
        if(LAPI_GetCfgData(LAPI_URL.LAPI_LensType,lensType_jsonMap)){
            dataMap["LensType"] = lensType_jsonMap["Type"];
            document.frmSetup.submitFLens.disabled = false;
        }
    }
    
    //支持电源输出配置
    if (top.banner.isSupportDCOut) {
        $("#dcOutInfo").removeClass("hidden");
        if(!LAPI_GetCfgData( LAPI_URL.LAPI_DCOut,dataMap)) {
            $("input[name='Enable']").attr("disabled", true);
        }
    }

    // 支持重置云台操作
    if (top.banner.isSupportEnablePTReset) {
        $("#ptzReset").removeClass("hidden");
    }

    // 支持最小对焦距离
    if (top.banner.focusMinDistanceArr.length > 0) {
        var optionsHtml = "",
            v,
            i,
            len,
            $ManualFocusMinDistance = $("#ManualFocusMinDistance");

        for (i = 0, len = top.banner.focusMinDistanceArr.length; i < len; i++) {
            v = top.banner.focusMinDistanceArr[i];
            optionsHtml += "<option value='" + v + "'>" + v / 10 + "</option>";
        }
        $ManualFocusMinDistance.html(optionsHtml);

        $("#notice_p").text($.lang.pub["sysMaintenanceNoticeInfo"]);
        $("#ManualFocusMinDistanceUl").removeClass("hidden");
        $("#FocusFields").removeClass("hidden");
        if (!LAPI_GetCfgData(LAPI_URL.FocusCfg + "Video", ManualFocusMap)){
            $ManualFocusMinDistance.attr("disabled", true);
            $("#submitF_focus").attr("disabled", true);
        }
        LAPI_CfgToForm("frmSetup",ManualFocusMap);
    }
    //支持最大数字变倍配置
    if (top.banner.maxDigitalZoomArr.length > 0) {
        var optionsHtml = "", v;

        for ( var i = 0, len = top.banner.maxDigitalZoomArr.length; i < len; i++) {
            v = top.banner.maxDigitalZoomArr[i];
            optionsHtml += "<option value='" + v + "'>" + v + "</option>";
        }
        var $MaxDigitalZoom = $("#MaxDigitalZoom");
        $MaxDigitalZoom.html(optionsHtml);
        $("#MaxDigitalZoomUl").removeClass("hidden");
        $("#FocusFields").removeClass("hidden");
        if (!LAPI_GetCfgData(LAPI_URL.DigitalZoom, maxDigitalZoom_jsonMap)) {
            $MaxDigitalZoom.attr("disabled", true);
            $("#submitF_zoom").attr("disabled", true);
        }
        LAPI_CfgToForm("frmSetup",maxDigitalZoom_jsonMap,maxDigitalZoom_dataMap,maxDigitalZoom_mappingMap);
    }
    //支持DDR频率
    if (top.banner.isSupportDDR) {
        if (!LAPI_GetCfgData(LAPI_URL.DDRFrequency, jsonMapDDR)) {
            disableAll();
            return false;
        }
        LAPI_CfgToForm("frmSetup",jsonMapDDR,dataMap_DDR,mappingMap_DDR);
        dataMapDDR_bak = objectClone(dataMap_DDR);
    }

    if (top.banner.isSupportAutoReboot) {
        $("#AutoRebootUL").removeClass("hidden");

        if(!LAPI_GetCfgData(LAPI_URL.LAPI_TimingTask, jsonMap_timeReboot)) {
            $("#TaskEnable1").attr("disabled", true);
            $("#Frequency1").attr("disabled", true);
            $("#StartTime1").attr("disabled", true);
            $("#timeTaskBtn").attr("disabled", true);
        }
        jsonMap_timeReboot_bak = objectClone(jsonMap_timeReboot);
        LAPI_CfgToForm("frmSetup", jsonMap_timeReboot, dataMap, mappingMap_timeReboot);
    }
    //uboot升级暂不开放
   /* if (!top.banner.isSupportCapture) {
        $("#updateWithUboot").parent().removeClass("hidden");
    }*/

    cfgToForm(dataMap, "frmSetup");
    //收集图像调试信息
    LAPI_GetCfgData(LAPI_URL.LAPI_DebugSwitch,IQDebug_jsonMap);
    LAPI_CfgToForm("frmSetup",IQDebug_jsonMap,IQDebugMap,IQDebug_mappingMap);

    timeTaskEnable();
}
function initFile() {
    $("input#FileName[type='file']").attr("accept", ".tgz");
    $("input#updateFileName[type='file']").attr("accept", ".zip,.cst,.patch");
}

function initValidator() {
    $("#Height").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 100, 10000));
    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success : function(label) {
        },
        rules : {
            Height : {
                integer : true,
                required : true,
                range : [ 100, 10000 ]
            }
        }
    });
}

function initEvent() {
    var flag;
    // $("#restoreStatusInput").bind("click", function () {
    //     if ($("#restoreStatusInput").is(":checked")) {
    //         if(!confirm($.lang.tip["tipDelSDData"])){
    //             return false;
    //         };
    //     }
    // });

   $("#ImportBtn").bind("click", function() {
        importCfg();
    });
    $("input[name='Enable']").bind("click", function() {
        LAPI_FormToCfg("frmSetup",dataMap);
        LAPI_SetCfgData(LAPI_URL.LAPI_DCOut,dataMap);
    });
    $("#submitF_focus").bind("click", function() {
        LAPI_FormToCfg("frmSetup",ManualFocusMap);
        if (top.banner.isNOSDevHCM) {
            if (!confirm($.lang.tip["tipConfirmReboot"])) {
                return;
        }
        top.banner.PageBlockType = BlockType.REBOOT;
        }
        if (LAPI_SetCfgData(LAPI_URL.FocusCfg + "Video", ManualFocusMap)) {
            if (top.banner.isNOSDevHCM){
                disableAll();
            }
        }
    });


    $("#submitF_zoom").bind("click", function() {
        LAPI_FormToCfg("frmSetup",maxDigitalZoom_jsonMap,maxDigitalZoom_dataMap,maxDigitalZoom_mappingMap)
        if (LAPI_SetCfgData(LAPI_URL.DigitalZoom, maxDigitalZoom_jsonMap)) {
            return true;
        }
        disableAll();
    });



    $("#TaskEnable1").bind("click", timeTaskEnable);
    $("#timeTaskBtn").bind("click", function() {
        var $StartTime1 = $("#StartTime1");
        if ("" == $StartTime1.val()) {
            $StartTime1.val("00:00:00");
        }
        LAPI_FormToCfg("frmSetup", jsonMap_timeReboot, dataMap, mappingMap_timeReboot);
        var isChanged = !isObjectEquals(jsonMap_timeReboot,jsonMap_timeReboot_bak);
        if(isChanged) {
            flag = LAPI_SetCfgData(LAPI_URL.LAPI_TimingTask,jsonMap_timeReboot);
            if(flag){
                jsonMap_timeReboot_bak = objectClone(jsonMap_timeReboot);
            }
        }

    });
    $("#submitFBtn").bind("click", function() {
        submitF();
    });
    $("#submitFLens").bind("click", function() {
        lensType_jsonMap["Type"] = parseInt($("#LensType").val());
        submitF();
    });
    $("input[class='Wdate']").bind("focus", pickerTime);
    $("#IQDebugEnable").bind("click", function() {
        var v = $("#IQDebugEnable").is(":checked")? 1: 0;
        IQDebugMap["IQDebugEnable"] = v;
        LAPI_FormToCfg("frmSetup",IQDebug_jsonMap,IQDebugMap,IQDebug_mappingMap);
        LAPI_SetCfgData(LAPI_URL.LAPI_DebugSwitch,IQDebug_jsonMap);
    });
    $("input[name='FrequencyCfg']").bind("click", function () {
        LAPI_FormToCfg("frmSetup", jsonMapDDR, dataMap_DDR, mappingMap_DDR);
        if(isObjectEquals(dataMap_DDR,dataMapDDR_bak)){
            parent.status = $.lang.tip["tipAnyChangeInfo"];
        }else {
            if (confirm($.lang.tip["tipFrequencyCfgReboot"])) {
                var flag = LAPI_SetCfgData(LAPI_URL.DDRFrequency, jsonMapDDR);
                if (flag) {
                    dataMapDDR_bak = objectClone(dataMap_DDR);
                    top.banner.PageBlockType = BlockType.REBOOT;
                    top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
                    top.banner.video.isSleepReplay = true;
                }
            } else {
                $("input[name='FrequencyCfg'][value='" + dataMapDDR_bak["FrequencyCfg"] + "']").attr("checked", true);
            }
        }
    });
}

function initPage() {
    if (!top.banner.isSupportCapture && !top.banner.isSupportIvaPark && top.banner.isUN) {
        $("#cloudUpdateDiv").removeClass("hidden");
    }
    //支持DDR频率
    if (top.banner.isSupportDDR) {
        $("#DDRFrequency").removeClass("hidden");
    }
    if(top.banner.isMac){
        $("#sysCfgImport").addClass("hidden")
    }
}

$(document).ready(function() {
    parent.selectItem("systemMaintenanceTab");// 菜单选中

        beforeDataLoad();
        initPage();
        // 初始化语言标签
        initLang();
        initValidator();
        initFile();
        initEvent();
        init(document.frmSetup);
        afterDataLoad();
    });


function submitF() {
    if (!IsChanged("frmSetup", dataMap)) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }
    if(!validator.form())return;
    formToCfg("frmSetup", dataMap);
    if (top.banner.isSupportLensType) {
        LAPI_SetCfgData(LAPI_URL.LAPI_LensType,lensType_jsonMap);
        dataMap["LensType"] = lensType_jsonMap["Type"];
    }
    if (top.banner.isSupportIntallHeight) {
        LAPI_SetCfgData(LAPI_URL.LAPI_Installation,dataMap);
    }
}