// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var isReboot = false;
var isFirstConnect = true;
var dataMap = {};
var sdMap = {};
var jsonMap_NAS = {};
var jsonMap_NAS_bak = {};
var mappingMap_NAS = {
    Addr : ["Address", "Addr"],
    Port : ["Address", "Port"],
    Path : ["Path"],
    UserName : ["UserName"],
    Password : ["Password"]
};
var planType = PlanType.STOR; //布防计划类型
var storType = 0; //存储计划类型（0：SD卡，1：NAS）
var streamNameArr = ["mainVideoStream", "roleVideoStream", "thirdVideoStream"];
var jsonMap_sd = {};
var jsonMap_sd_bak = {};
var planName = "SDStorage";
var jsonMap = {};
var mappingMap = {
    StorType :          ["StorageResource", "StorageType"],
    TotalMemory :       ["StorageResource", "MemInfos", 0, "TotalMemory"],
    SpareMemory :       ["StorageResource", "MemInfos", 0, "SpareMemory"],
    RecAllocMem :       ["VideoStorage", "AllocMemory"],
    RecStorMode :       ["VideoStorage", "StorageMode"],
    RecManualStreamID : ["VideoStorage", "ManualStreamID"],
    RecStorPolicy :     ["VideoStorage", "StoragePolicy"],
    PicAllocMem :       ["PhotoStorage", "AllocMemory"],
    PicSpareMemory :    ["PhotoStorage", "SpareMemory"],
    PicCurrentFileNum : ["PhotoStorage", "CurrentFileNumber"],
    PicSpareFileNum :   ["PhotoStorage", "SpareFileNumber"],
    PicStorMode :       ["PhotoStorage", "StorageMode"],
    PicStorPolicy :     ["PhotoStorage", "StoragePolicy"],
    IPCPicAllocMem :    ["IPCPhotoStorage", "AllocMemory"]
};
//SD卡格式化设备重连
if (top.banner.isSupportFishEye) {
    streamNameArr = ["channelID1", "channelID2", "channelID3", "channelID4", "channelID5", "channelID6"];
}
// 加载语言文件
loadlanguageFile(top.language);
var storeInfo = {
    StorPolicy :       null,
    EnableStreamStor : null,
    RecAllocMem :      null
};

// 下发参数
function submitF() {
    var flag,
        storType;

    // 验证
    if (!validator.form()) {
        return;
    }
    if (top.banner.isSupportRecordPlayback) {
        if ((!Plan.IsChanged()) && (!IsChanged("frmSetup", dataMap)))return false;
    } else {
        if (!IsChanged("frmSetup", dataMap))return false;
    }

    if (($("#RecAllocMem").val() != dataMap["RecAllocMem"]) ||
        ($("#IPCPicAllocMem").val() != dataMap["IPCPicAllocMem"])) {
        if (!confirm($.lang.tip["tipChangeUploadSpace"])) {
            return false;
        }
        isReboot = true;
    }
    if (top.banner.isSupportRecordPlayback) {
        //存储计划
        storType = Number($("#StorType").val());
        flag = Plan.submitF(LAPI_URL.WeekPlan+planName);
        if (!flag) {
            top.banner.showMsg(false);
            return false;
        }
    }
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
    if (!top.banner.isSupportCapture || (IVAMode.ILLEGAL == top.banner.IVAType)) {
       if(!LAPI_SetCfgData(LAPI_URL.AlarmStorage,dataMap)) {
           return;
       }
    }
    flag = LAPI_SetCfgData(LAPI_URL.Storage,jsonMap);
    if (!flag) {
        cfgToForm(dataMap, "frmSetup");
    } else if (isReboot) {
        top.banner.PageBlockType = BlockType.REBOOT;
        top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
        isReboot = false;
    }
    return flag;
}

function initStorTypeOption() {
    var list = top.banner.storTypeArr;
    var str = "";
    for (var i = 0; i < list.length; i++) {
        var value = Number(list[i]);
        switch (value) {
            case 0:
                str += "<option value='0' lang='memoryCard'></option>";
                break;
            case 1:
                str += "<option value='1' lang='NAS'></option>";
                break;
            default:
                break;
        }
    }
    $("#StorType").append(str);
}

function StorType_change() {
    var v = $("#StorType").val();
    if (1 == v) {// 网络硬盘
        $("#formatspan").addClass("hidden");
        $("#formatBtn").addClass("hidden");
        $("#pathDL").removeClass("hidden");
        $("#enableSDCard").addClass("hidden");
    } else {
        $("#formatspan").removeClass("hidden");
        $("#formatBtn").removeClass("hidden");
        $("#pathDL").addClass("hidden");
        if (!top.banner.isSupportCapture) {
            $("#enableSDCard").removeClass("hidden");
        }
    }
}

function valueChange(id) {
    var picAllocMem,
        $allocMen = $("#" + id);
    if (!top.banner.isSupportPersonPhoto && !top.banner.isSupportsystemSetUpLink) {
        if (top.banner.isSupportCapture) {
            $("#PicAllocMem").val(dataMap["TotalMemory"] - $("#RecAllocMem").val());
        } else {
            $("#IPCPicAllocMem").val(dataMap["TotalMemory"] - $("#RecAllocMem").val());
        }
    } else {
        picAllocMem = dataMap["TotalMemory"] - $("#RecAllocMem").val() - $("#IPCPicAllocMem").val();

        if (picAllocMem < 0) {
            alert($.lang.tip["tipUpTotalStorage"]);
            $allocMen.val($allocMen[0].getAttribute("defaultValue"));
            return;
        } else {
            $("#PicAllocMem").val(picAllocMem);
            $("#PicAllocMem")[0].setAttribute("defaultValue",picAllocMem);
            $allocMen[0].setAttribute("defaultValue",$allocMen.val());
        }
    }
}
function connectNAS() {
    openWin($.lang.pub["NASWinTitle"], "nas_info.htm", 400, 150, false);
}

//获取格式化SD卡的响应消息
function SDStatusCallBack(recode) {
    if (0 == recode) {
        // 遮盖界面
        top.banner.updateBlock(true,$.lang.tip["tipFormating"]);
    } else if (561 == recode) {         //存储异常
        alert($.lang.tip["tipFormatFailedReboot"]);
    } else if (560 == recode) {         //SD卡不能识别
        alert($.lang.tip["tipFormatFailedChange"]);
    } else {
        alert($.lang.tip["tipFormatFailed"]);
    }
}

function eventMemoryCardFormat(pcParam) {
    var msg = $.lang.tip["tipFormatSuccess"], pcParam = parseInt(pcParam), flag = (ResultCode.RESULT_CODE_SUCCEED ==
                                                                                   pcParam);

    if (flag) {
        top.banner.PageBlockType = BlockType.REBOOT;
        parent.$("#statusInfo").text($.lang.tip["tipRebooting"]);
    } else {
        top.banner.updateBlock(false);
        msg = $.lang.tip["tipFormatFailed"];
    }

    top.banner.showMsg(flag, msg);
    setTimeout("top.banner.autoLogin()", 5000);
}

// NAS连接状态上报
function eventConnectNAS(pcParam) {
    var errorMsg = $.lang.tip["tipConnectFailed"];
    top.banner.updateBlock(false);
    top.showedFlag = true;
    pcParam = parseInt(pcParam);
    var $NASPath = $("#NASPath");
    if (pcParam) {// 失败
        if ("" != $NASPath.text()) {
            $NASPath.text("");
        }
        if (isFirstConnect) {
            isFirstConnect = false;
            eventAlert(errorMsg);
        }
    } else {
        $NASPath.text(dataMap["Addr"] + dataMap["Path"]);
    }
}

function disableItems() {
    //3表示SD卡状态正常。0表示SD卡状态不存在，1表示SD卡状态故障 ，2表示SD卡状态检测中，4表示设备存在
    if (3 != sdMap["StatusParam"]["SDStatus"]) {

        disableAll();
        $("#StorType").attr("disabled", false);
        $("#connect").attr("disabled", false);
        $("#SDCardEnable").attr("disabled", false);
        if (4 == sdMap["StatusParam"]["SDStatus"]) {
            $("#formatBtn").attr("disabled", false);
        }
    }
}

function release() {
    parent.hiddenVideo();
}

function initPage() {
    initStorTypeOption();
    if (top.banner.isSupportJPEG) {
        $("#ManualStreamIDP").addClass("hidden");
    }
    if (top.banner.isSupportTrafficFlow || !top.banner.isSupportJPEG) {
        $("#picStorageField").addClass("hidden");
    }
    if (!top.banner.isSupportBasicFTP && !top.banner.isSupportJPEG) {
        $("#capacityAssignment").addClass("hidden");
    }
    if (top.banner.isSupportRecordPlayback) {
        $("#planStorage_enable_span").removeClass("hidden");
        $("#planDiv").removeClass("hidden");
    }

    if (!top.banner.isSupportCapture || (IVAMode.ILLEGAL == top.banner.IVAType)) {
        $("#AlarmPastTime").removeClass("hidden");
    }

    if (!top.banner.isSupportCapture) { // 非智能交通产品
        $("#photoCapacity").removeClass("hidden");

        if (top.banner.isSupportPersonPhoto || top.banner.isSupportsystemSetUpLink) {
            $("#illphotoCapacity").removeClass("hidden");
            $("#IPCstoreSpaceTip").removeClass("hidden");
        } else {
            $("#IPCPicAllocMem").attr("disabled", true);
        }
    }
}

function callback(retCode) {
    var flag = ((ResultCode.RESULT_CODE_SUCCEED == retCode) || (ResultCode.RESULT_CODE_NOT_MOUNT == retCode));
    if (flag) {
        if (ResultCode.RESULT_CODE_NOT_MOUNT == retCode) {// NAS未挂载上
            var tmpList = "Addr=0.0.0.0&Port=0&Path=\\&UserName=&Password=";
            sdkAddCfg(dataMap, tmpList);
            jsonMap_NAS = {};
            jsonMap_NAS["Address"] = {};
            jsonMap_NAS["Address"]["Addr"] = dataMap["Addr"];
            jsonMap_NAS["Address"]["Port"] = dataMap["Port"];
            jsonMap_NAS["Path"] = dataMap["Path"];
            jsonMap_NAS["UserName"] = dataMap["UserName"];
            jsonMap_NAS["Password"] = dataMap["Password"];
            top.banner.updateBlock(true);
            top.showedFlag = false;
        } else {
            changeMapToMapByMapping(jsonMap_NAS, mappingMap_NAS, dataMap, 0);
            $("#NASPath").text(dataMap["Addr"] + dataMap["Path"]);
        }
    } else {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        return;
    }
}

function init() {
    var flag,
        tmpMap = {},
        i,
        len;

    dataMap = {};
    sdMap = {};
    jsonMap = {};
    dataMap_sd = {};
    
    if (!LAPI_GetCfgData(LAPI_URL.LAPI_SD,sdMap)) {
        disableAll();
        return;
    }

    if (!LAPI_GetCfgData(LAPI_URL.VideoEncode,tmpMap)) {
        disableAll();
        return;
    }
    for (i = 0, len = Number(tmpMap["StreamNum"]); i < len; i++) {
        // 非鱼眼设备只能存主辅流
        if (!top.banner.isSupportFishEye && 2 == i) {
            break;
        }

        if (0 == tmpMap["VideoEncoderCfg"][i]["VideoStreamCfg"]["IsEnable"])
            break;
        $("#RecManualStreamID").append("<option value=" + i + ">" + $.lang.pub[streamNameArr[i]] +
                                       "</option>");
    }

    flag = LAPI_GetCfgData(LAPI_URL.Storage,jsonMap);
    if (flag) {
        // 双卡设备
        if (jsonMap["StorageResource"]["Nums"] > 1) {
            $("#SDCard1Label").removeClass("hidden");
            $("#SD2Info").removeClass("hidden");
            $("#capacityAssignment").children("legend").text($.lang.pub["SDCard1Memory"]);
            mappingMap["TotalMemory2"] = ["StorageResource", "MemInfos", 1, "TotalMemory"];
            mappingMap["SpareMemory2"] = ["StorageResource", "MemInfos", 1, "SpareMemory"];
        }

        changeMapToMapByMapping(jsonMap, mappingMap, dataMap, 0);
        if (top.banner.isSupportPersonPhoto) {
            $("#PicAllocMem").val(dataMap["TotalMemory"] - dataMap["RecAllocMem"] -
                                  dataMap["IPCPicAllocMem"]);
        }
        if (top.banner.isOldPlugin && !top.banner.isMac && (1 == dataMap["StorType"])) {// NAS
            LAPI_GetCfgData(LAPI_URL.STOR_NAS_CFG, jsonMap_NAS, "", true, callback);

        }
    }

    if (!flag) {// 获取参数失败
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }

    if (top.banner.isSupportRecordPlayback) {
        Plan.init(LAPI_URL.WeekPlan+planName);
        $("#PlanEnable").addClass("hidden"); 
        if (planMap["PlanEnable"]!= 1 ) {
            $("#planDiv").addClass("hidden");
        }
    }

    if (dataMap["RecStorMode"] == 10) { //10表示软件返回给你的RecStorMode值，其对应着开启手动存储    
        dataMap["StorageMode"] = 0;//StorageMode的值为0表示开启手动存储               
    }
    else if (dataMap["RecStorMode"] == 11) {//11表示软件返回给你的RecStorMode值，其对应着不开启手动存储
        if (planMap["PlanEnable"] == 1) {//PlanEnable为1表示开启计划存储
            dataMap["StorageMode"] = 1;
        }
        else {//PlanEnable为0表示开启计划存储不开启手动和计划存储
            dataMap["StorageMode"] = 2;
        }
    }


    if (!top.banner.isSupportCapture || (IVAMode.ILLEGAL == top.banner.IVAType)) {
        if (!LAPI_GetCfgData(LAPI_URL.AlarmStorage, dataMap)) {

            disableAll();
            return;
        }
        if(!LAPI_GetCfgData(LAPI_URL.SDCardSwitch,jsonMap_sd)) {
            disableAll();
            return;
        }
    }
    jsonMap_sd_bak = objectClone(jsonMap_sd);
    LAPI_CfgToForm("frmSetup", jsonMap_sd);

    cfgToForm(dataMap, "frmSetup");
    setLabelValue(dataMap);
    $("#RecAllocMem").attr("maxLength", dataMap["TotalMemory"].length);
    $("#IPCPicAllocMem").attr("maxLength", dataMap["TotalMemory"].length);
    StorType_change();
    storType = dataMap["StorType"];

    disableItems();

}

//jquery验证框架
function initValidator() {
    var totalMemory = Number(dataMap["TotalMemory"]);
    $("#RecAllocMem").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, totalMemory));
    $("#IPCPicAllocMem").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, totalMemory));
    $("#PastTime").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 30, 1800));
    validator = $("#frmSetup").validate({
        focusInvalid :   false,
        errorElement :   "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success :        function(label) {
        },
        rules :          {
            RecAllocMem :    {
                integer :  true,
                required : true,
                range :    [0, totalMemory]
            },
            IPCPicAllocMem : {
                integer :  true,
                required : true,
                range :    [0, totalMemory]
            },
            PastTime :       {
                integer :  true,
                required : true,
                range :    [30, 1800]
            }

        }
    });
    validator.init();
}

window.onload = function() {
    var flag;
    parent.selectItem("storageManagerTab");// 选中菜单
    beforeDataLoad();
    initPage();
    initLang();

    $("#SDCardEnable").bind("click", function() {
        if (!confirm($.lang.tip["tipChangeSDcardEnable"])) {
            return false;
        }
        LAPI_FormToCfg("frmSetup", jsonMap_sd);
        flag = LAPI_SetCfgData(LAPI_URL.SDCardSwitch, jsonMap_sd);
        if (flag) {
            jsonMap_sd_bak = objectClone(jsonMap_sd);
            disableAll();
            top.banner.PageBlockType = BlockType.REBOOT;
            top.banner.updateBlock(true, $.lang.tip["tipRebooting"]);
        }
    });

    $("#StorType").change(function() {
        if (!confirm($.lang.tip["tipChangeStorType"])) {
            $("#StorType").val(dataMap["StorType"]);
            return false;
        }
        isReboot = true;
        if (submitF()) {
            StorType_change();
            disableAll();
        }
    });

    $("#formatBtn").bind("click", function() {
        if (!confirm($.lang.tip["tipConfirmFormat"]))
            return;

        LAPI_SetCfgData(LAPI_URL.SDFormat,"",false,SDStatusCallBack);

    });

    $("#connect").bind("click", connectNAS);

    $("input[name='StorageMode']").bind("click", function() {
        if ($("#manualStorage_enable").is(":checked")) {
            $("#PlanEnable").attr("checked", false);
            $("#RecStorMode").val(10);
            $("#planDiv").addClass("hidden");
        } else if ($("#planStorage_enable").is(":checked")) {
            $("#planDiv").removeClass("hidden");
            $("#PlanEnable").attr("checked", true);
            $("#RecStorMode").val(11);
        } else if ($("#manualStorage_close").is(":checked")) {
            $("#PlanEnable").attr("checked", false);
            $("#RecStorMode").val(11);
            $("#planDiv").addClass("hidden");
        }
    });

    init();
    initValidator();
    afterDataLoad();
};