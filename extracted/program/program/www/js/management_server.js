// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var dataMap_bak = {};
var validator = null;
// 密码是否被修改
var isChangedVMPwd = false; //标志位，GB 服务器密码是否被修改
var pwdDefaultValue = "00000000000000000000000000000000"; //密码初始显示值，内容无意义
var vmpwdDefaultValue = "0000000000000000"; //密码初始显示值，内容无意义
var pageType = getparastr("pageType");

var jsonMap_ManageServer = {};
var jsonMap_ManageServer_bak = {};
var jsonMap_BMServer = {};
var jsonMap_BMServer_bak = {};
var mappingMap_ManageServer = {     
    VMProtocol: ["MngProtocol"],        
    DeviceID: ["DeviceID"], 
    ServerID: ["ServerID"], 
    DeviceName: ["DeviceName"], 
    VMIPAddr: ["Address"], 
    VMPort: ["Port"], 
    VideoChlID: ["VideoChlID"],
    AudioChlID: ["AudioChlID"],
    ExpireTime: ["Expire"]
};
var mappingMap_BMServer = {  
    IsUploadEnable: ["Enable"],         
    BMIPAddr: ["ServerAddr"]
};
var jsonMap_DisCache = {};
var jsonMap_DisCache_bak = {};
var mappingMap_DisCache = {
    OnvifStorEnable:["Enable"],
    OnvifStorIpAddr:["StreamIPAddr"]
};
/**
 * 密码框获得过焦点，则密码内容置空
 */
function initPwdChanged(id) {
    if (!isChangedVMPwd) {
        $("#VMPassword").val("");
        isChangedVMPwd = true;
    }
}

//开启关闭录像备份是BM服务器地址的灰显情况
function BMAddressEnable()
{
    var b = document.getElementById("BMClose").checked;
    document.getElementById("BMIPAddr").disabled = b;
    if (b) {
        $("#BMIPAddr").val(dataMap["BMIPAddr"]);
        validator.element($("#BMIPAddr"));
    }
}

//开启关闭Onvif断网续传使服务器地址的灰显情况
function OnvifAddressEnable()
{
    var b = $("#OnvifClose").is(":checked");
    $("#OnvifStorIpAddr").attr("disabled", b);
    if (b) {
        $("#OnvifStorIpAddr").val(dataMap["OnvifStorIpAddr"]);
        validator.element($("#OnvifStorIpAddr"));
    }
}

function submitF()
{
    parent.status = "";
    var isReboot = false;
    if(!validator.form()){
            return;
    }
    
    if (!top.banner.isSupportBMNoRebootPrompt) {
        /* 修改后的服务器地址 */
        if (($("#DeviceID").val() != dataMap["DeviceID"]) ||
        ($("#VMIPAddr").val() != dataMap["VMIPAddr"]) ||
        ($("#VMProtocol").val() != dataMap["VMProtocol"]))
        {
            /* 提示用户系统将会重启，是否继续 */
            var tip = $.lang.tip["tipCfmChangeSysCfg"];
            if (!confirm(tip))
            {
                return;
            }
            isReboot = true;
        }
    }
    LAPI_FormToCfg("frmSetup", jsonMap_ManageServer, dataMap, mappingMap_ManageServer);
    var isManageServerChanged = !isObjectEquals(jsonMap_ManageServer, jsonMap_ManageServer_bak);
    LAPI_FormToCfg("frmSetup", jsonMap_BMServer, dataMap, mappingMap_BMServer);
    var isBMServerChanged = !isObjectEquals(jsonMap_BMServer, jsonMap_BMServer_bak);
    var isChanged = !isObjectEquals(dataMap, dataMap_bak);
    if (!isChanged && !isChangedVMPwd && !isManageServerChanged && !isBMServerChanged)
    {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }

    //如果VM BM地址为空，规范为0.0.0.0
    if ("" == $("#VMIPAddr").val()){
        $("#VMIPAddr").val("0.0.0.0");
    }
    if ("" == $("#BMIPAddr").val()){
        $("#BMIPAddr").val("0.0.0.0");
    }

    if(isChangedVMPwd)
    {
        jsonMap_ManageServer["RegPassword"] = $("#VMPassword").val();
    }
    
    var flag = false;
    var retcode;
    
    if (top.banner.isSupportBMServer) {
        //BM服务器
        if (isBMServerChanged) {
            flag = LAPI_SetCfgData(LAPI_URL.LAPI_BMServer,jsonMap_BMServer);
            if (!flag) return;
            jsonMap_BMServer_bak = objectClone(jsonMap_BMServer);
        }
    }

    //Onvif断网存储地址
    if (isChanged) {
        LAPI_FormToCfg("frmSetup",jsonMap_DisCache,dataMap,mappingMap_DisCache);
        var isChanged = !isObjectEquals(jsonMap_DisCache,jsonMap_DisCache_bak);
        if(isChanged) {
            flag = LAPI_SetCfgData(LAPI_URL.DisconnectCache,jsonMap_DisCache);
            if(flag) {
                jsonMap_DisCache_bak = objectClone(jsonMap_DisCache);
            }
        }
    }

    if (top.banner.isSupportVM) {
        if (isManageServerChanged  || isChangedVMPwd) {
            flag = LAPI_SetCfgData(LAPI_URL.LAPI_ManageServer,jsonMap_ManageServer);
            if (!flag) return;
            jsonMap_ManageServer_bak = objectClone(jsonMap_ManageServer);
            isChangedVMPwd = false;
        }
    }

    if(flag && isReboot)
    {//若设备要重启则下发参数后要灰显界面。
        disableAll();
    }
}


function initVMProtocol() {
    var str = "",
        gbStr = "<option value='1'>GB</option>";

    if (VersionType.PRJ == top.banner.versionType) {// 工程商
        str = "<option value='2' lang='none'></option>";
        if (!top.banner.isSupportHorizontalMenu && top.banner.isSupportH265) {
            str += "<option value='0'>IMOS</option>";
        }
        str += (gbStr + "<option value='3' lang='other'></option>");
        $("#VMProtocol_private").append("<option value='4' lang='Protocol_liyuan'></option>");;
    }else if(VersionType.DT == top.banner.versionType){
        str = "<option value='2' lang='none'></option>";
        str += gbStr;
    }else {
        if (VersionType.IN == top.banner.versionType) {    // 海外版
            gbStr = "";
        }
        if (top.banner.isSupportNoBrand) {
            str += ("<option value='2' lang='none'></option>" + 
                    "<option value='0' lang='privateProtocol'></option>" +  gbStr);
            //智能交通、LY定制开放其他选项（含LY协议）
            if (top.banner.isSupportCapture || (1 == top.banner.customType)) {
                str += "<option value='3' lang='other'></option>";
                $("#VMProtocol_private").append("<option value='4' lang='Protocol_liyuan'></option>");
            }
        } else {
            str += ("<option value='2' lang='none'></option>" + 
                    "<option value='0'>IMOS</option>" + 
                    gbStr + 
            "<option value='3' lang='other'></option>");
            $("#VMProtocol_private").append("<option value='4' lang='Protocol_liyuan'></option>");
        }
    }
    
    $("#VMProtocol_pub").append(str);
}

function VMprotocol_change() {
    var v = parseInt($("#VMProtocol").val());

    if (2 < $("#VMProtocol").val()) {
        $("#VMProtocol_private").removeClass("hidden");
    } else {
        $("#VMProtocol_private").addClass("hidden");
        $("#VMProtocol_private").val("3");
    }

    switch (v) {
        case 0://IMOS
            $("#DeviceNameTR").addClass("hidden");
            $("#VideoChlIDTR").addClass("hidden");
            $("#AudioChlIDTR").addClass("hidden");
            $("#ServerIDTR").addClass("hidden");
            $("#vmTbl").removeClass("hidden");
            $("#VMPasswordTR").addClass("hidden");
            $("#regExpireTimeTR").addClass("hidden");

            //恢复合法值
            $("#DeviceName").val(dataMap["DeviceName"]);
            $("#VideoChlID").val(dataMap["VideoChlID"]);
            $("#AudioChlID").val(dataMap["AudioChlID"]);
            $("#ServerID").val(dataMap["ServerID"]);
            $("#VMPassword").val(vmpwdDefaultValue);
            isChangedVMPwd = false;
            break;

        case 1://GB
            $("#DeviceNameTR").removeClass("hidden");
            $("#VideoChlIDTR").removeClass("hidden");
            $("#AudioChlIDTR").removeClass("hidden");
            $("#ServerIDTR").removeClass("hidden");
            $("#vmTbl").removeClass("hidden");
            $("#VMPasswordTR").removeClass("hidden");
            $("#regExpireTimeTR").removeClass("hidden");
            break;
            
        case 4:// LY
        case 3:// VISS
            $("#DeviceNameTR").removeClass("hidden");
            $("#VideoChlIDTR").removeClass("hidden");
            $("#AudioChlIDTR").removeClass("hidden");
            $("#ServerIDTR").removeClass("hidden");
            $("#vmTbl").removeClass("hidden");
            $("#VMPasswordTR").removeClass("hidden");
            $("#regExpireTimeTR").addClass("hidden");
            break;

        case 2://无
            $("#vmTbl").addClass("hidden");
            $("#VMPassword").val(vmpwdDefaultValue);
            $("#DeviceName").val(dataMap["DeviceName"]);
            $("#VideoChlID").val(dataMap["VideoChlID"]);
            $("#AudioChlID").val(dataMap["AudioChlID"]);
            $("#ServerID").val(dataMap["ServerID"]);
            $("#VMIPAddr").val(dataMap["VMIPAddr"]);
            $("#VMPort").val(dataMap["VMPort"]);
            $("input[name='IsUploadEnable'][value='"+dataMap["IsUploadEnable"]+"']").attr("checked",true);
            $("#BMIPAddr").val(dataMap["BMIPAddr"]);
            isChangedVMPwd = false;
            break;

        //没有default
    }

    //去除之前的验证提示信息
    validator.init();
}

function initData()
{   
    jsonMap_ManageServer = {};
    jsonMap_BMServer = {};
    document.onkeydown = shieldEsc;

    if(!LAPI_GetCfgData(LAPI_URL.DisconnectCache,jsonMap_DisCache)) {
        disableAll();
        return;
    }
    jsonMap_DisCache_bak = objectClone(jsonMap_DisCache);
    LAPI_CfgToForm("frmSetup", jsonMap_DisCache, dataMap, mappingMap_DisCache);

    if(!LAPI_GetCfgData(LAPI_URL.LAPI_ManageServer, jsonMap_ManageServer) ||
       !LAPI_GetCfgData(LAPI_URL.LAPI_BMServer, jsonMap_BMServer)) {
        disableAll();
        return;
    }
    jsonMap_ManageServer_bak = objectClone(jsonMap_ManageServer);
    LAPI_CfgToForm("frmSetup", jsonMap_ManageServer, dataMap, mappingMap_ManageServer);
    jsonMap_BMServer_bak = objectClone(jsonMap_BMServer);
    LAPI_CfgToForm("frmSetup", jsonMap_BMServer, dataMap, mappingMap_BMServer);

    if (dataMap["VMProtocol"] > 2) { // 私有协议
        dataMap["VMProtocol_pub"] = 3;
        dataMap["VMProtocol_private"] = dataMap["VMProtocol"];
    } else {
        dataMap["VMProtocol_pub"] = dataMap["VMProtocol"];
        dataMap["VMProtocol_private"] = 3;
    }
    dataMap_bak = objectClone(dataMap);
    cfgToForm(dataMap, "frmSetup");
    $("#VMPassword").val(vmpwdDefaultValue);
    VMprotocol_change();
    if (top.banner.isSupportBMServer) {
        BMAddressEnable();
    }
    OnvifAddressEnable();
}

function initPage(){
    if (top.banner.isSupportBMServer) {
        $("#recordBackupTR").removeClass("hidden");
        $("#bmAddrTR").removeClass("hidden");
    }
    initVMProtocol();
    if (!top.banner.isSupportBMNoRebootPrompt) {
        $("#notice").removeClass("hidden");
        $("#noticeHR").removeClass("hidden");
    }
    if (top.banner.isSupportStorage) {
        $("#onvifStorDiv").removeClass("hidden");
    }
}

//jquery验证框架
function initValidator()
{
    $("#DeviceID").attr("tip",$.lang.tip["tipDeviceID"]);
    $("#VideoChlID").attr("tip",$.lang.tip["tipPassword"]);
    $("#AudioChlID").attr("tip",$.lang.tip["tipPassword"]);
    $("#DeviceName").attr("tip",$.lang.tip["tipDeviceName"]);
    $("#ServerID").attr("tip",$.lang.tip["tipDeviceID"]);
    $("#VMIPAddr").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#VMPort").attr("tip",$.validator.format($.lang.tip["tipIntRange"], 1025, 65535));
    $("#VMPassword").attr("tip",$.lang.tip["tipVMPwd"]);
    $("#BMIPAddr").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#OnvifStorIpAddr").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#ExpireTime").attr("tip",$.validator.format($.lang.tip["tipIntRange"], 3600, 36000));
    
    $.validator.addMethod("isIPAddress", function(value) {
        return isIPAddress(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223", function(value) {
        return checkIP1To223(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("validStrNoNull", function(value) {
        return validStrNoNull(value);
    }, $.lang.validate["valRequired"]);
    $.validator.addMethod("checkServerID", function(value) {
        return checkServerID(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("validNameContent", function(value) {
        if(""  == value)
            return true;

        return validNameContent(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("checkVMPwd", function(value) {
        if (isChangedVMPwd){
            return checkServerID(value);
        }
        else{
            return true;
        }
    }, $.lang.tip["tipCharFmtErr"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            VMPassword: {
                maxlength:16,
                validStrNoNull:"",
                checkVMPwd:""
            },
            DeviceID: {
                maxlength:32,
                validStrNoNull:"",
                checkServerID:""
            },
            VideoChlID: {
                maxlength:32,
                checkServerID:""
            },
            AudioChlID: {
                maxlength:32,
                checkServerID:""
            },
            DeviceName: {
                maxlength:20,
                validNameContent:""
            },
            ServerID: {
                maxlength:32,
                validStrNoNull:"",
                checkServerID:""
            },
            VMIPAddr: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            },
            VMPort: {
                integer: true,
                required: true,
                range:[1025, 65535]
            },
            BMIPAddr: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            },
            OnvifStorIpAddr: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            },
            ExpireTime: {
                integer: true,
                required: true,
                range:[3600, 36000]
            }
        }
    });
    validator.init();
}

function initEvent(){
    $("#VMProtocol_pub").change(function() {
        $("#VMProtocol").val($("#VMProtocol_pub").val());
        VMprotocol_change();
        
        var v = Number($("#VMProtocol").val());
        if (0 == v) {
            if (5063 == parseInt($("#VMPort").val())) {
                $("#VMPort").val(5060);
            }
        } else if (1 == v) {
            if (5060 == parseInt($("#VMPort").val())) {
                $("#VMPort").val(5063);
            }
        }
    });
    $("#VMProtocol_private").change(function() {
        $("#VMProtocol").val($("#VMProtocol_private").val());
        VMprotocol_change();
    });
    
    //服务器地址为空时，自动填充0.0.0.0
    $("#VMIPAddr").change(function(){
        if("" == $("#VMIPAddr").val()) {
            $("#VMIPAddr").val("0.0.0.0");
        }
    });
    
    //BM服务器地址为空时，自动填充0.0.0.0
    $("#BMIPAddr").change(function(){
        if("" == $("#BMIPAddr").val()) {
            $("#BMIPAddr").val("0.0.0.0");
        }
    });
    
    //Onvif录像地址为空时，自动填充0.0.0.0
    $("#OnvifStorIpAddr").change(function(){
        if("" == $("#OnvifStorIpAddr").val()) {
            $("#OnvifStorIpAddr").val("0.0.0.0");
        }
    });
}

$(document).ready(function(){
    if (1 == pageType) {
        parent.selectItem("Com_managementServerTab");//菜单选中
    } else {
        parent.selectItem("managementServerTab");//菜单选中
    }
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});