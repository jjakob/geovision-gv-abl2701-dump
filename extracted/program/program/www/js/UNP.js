// JavaScript Document
GlobalInvoke(window);
var validator = null;
var jsonMapUNP = {};
var jsonMapUNP_bak = {};
var mappingMapUNP = {
    UNPEnable: ["Enable"],
    UNPAddress: ["Address"],
    UNPIdentify: ["Identify"],
    UNPUserName: ["UserName"],
    Interface:   ["Interface"]
};

var i;
var isChangedUNPPwd = false;
var PasswordDefaultValue = "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@";


function initUNPPwdChanged(f) {
    if (!isChangedUNPPwd)
    {
        f.UNPPassword.value = "";
        isChangedUNPPwd = true;
    }
}



function submitF()
{
    var f = document.frmSetup;

    if(!validator.form())return;
    if(isChangedUNPPwd)
    {
        dataMap["UNPPassword"] = $("#UNPPassword").val();
    }


    if (0 == f.UNPAddress.value.length){
        f.UNPAddress.value = "0.0.0.0";
    }


    LAPI_FormToCfg("frmSetup", jsonMapUNP, dataMap, mappingMapUNP);
    var isChangedUNP = !isObjectEquals(jsonMapUNP,jsonMapUNP_bak);
    if (isChangedUNP || isChangedUNPPwd) {
        if(isChangedUNPPwd) {
            jsonMapUNP["Password"] = dataMap["UNPPassword"];
        }
        LAPI_SetCfgData(LAPI_URL.UNP_Cfg, jsonMapUNP,false, callBack);
    }
}

function callBack(recode) {

    if (ResultCode.RESULT_CODE_SUCCEED == recode) {
        jsonMapUNP_bak = objectClone(jsonMapUNP);
        top.banner.showMsg(true);
    }else if(ResultCode.RESULT_CODE_UNPPPPOE_CONFLICT == recode){
        top.banner.showMsg(false, $.lang.tip["tipUnpPppoeConfict"]);
    }else{
        top.banner.showMsg(false, $.lang.tip["tipSetCfgFail"]);
    }
}

function initEvent(){

    $("#UNPAddress").change(function(){
        if("" == $("#UNPAddress").val())
        {
            $("#UNPAddress").val("0.0.0.0");
        }
    });

}

function init(f)
{

    jsonMapUNP = {};
    f.UNPPassword.value = PasswordDefaultValue;


    if(!LAPI_GetCfgData(LAPI_URL.UNP_Cfg, jsonMapUNP))
    {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }

    jsonMapUNP_bak = objectClone(jsonMapUNP);
    LAPI_CfgToForm("frmSetup", jsonMapUNP, dataMap, mappingMapUNP);

}

function initPage(){
    if(top.banner.isSupportNet4G){
        $("#Interface").append("<option value= 1>4G</option>");
    }
}
$(document).ready(function(){

    parent.selectItem("UNPTab");

    beforeDataLoad();
    initPage();
    initLang();


    $.validator.addMethod("checkCommonNamePwd", function(value) {
        return checkCommonNamePwd(value);
    }, $.lang.tip["tipCharFmtErr"]);


    $("#UNPAddress").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#UNPUserName").attr("tip",$.lang.tip["tipCommonNamePwd"]);
    $("#UNPPassword").attr("tip",$.lang.tip["tipCommonNamePwd"]);


    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);

    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            UNPAddress: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            },
            UNPUserName: {
                checkCommonNamePwd:""
            },
            UNPPassword: {
                checkCommonNamePwd:""
            }
        }
    });
    initEvent();
    init(document.frmSetup);
    afterDataLoad();
});
/**
 * Created by w02927 on 2016/3/17.
 */
