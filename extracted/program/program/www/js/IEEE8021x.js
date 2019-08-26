// JavaScript Document
GlobalInvoke(window);

var validator = null;
var jsonMap = {};
var jsonMap_bak = {};

loadlanguageFile(top.language);

function submitF() {
    if(!validator.form()) return;
    LAPI_FormToCfg("frmSetup",jsonMap);
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }
    if(!LAPI_SetCfgData(LAPI_URL.IEEE8021x,jsonMap))return;
    jsonMap_bak = objectClone(jsonMap);
}

function initValidator() {
    $("#UserName").attr("tip",$.lang.tip["tipIEEEUserPwdErr"]);
    $("#Password").attr("tip",$.lang.tip["tipIEEEUserPwdErr"]);
    $("#PasswordConfirm").attr("tip",$.lang.tip["tipDDNSPasswordConfirm"]);

    $.validator.addMethod("checkUserPwd", function(value) {
        return checkPassword(value);
    }, $.lang.tip["tipCharFmtErr"]);

    $.validator.addMethod("userDefinedConfirmPwd", function() {
        return ($("#Password").val() == $("#PasswordConfirm").val());
    }, $.lang.tip["tipUnequalUserPwd"]);

    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success : function(label) {
        },
        rules : {
            UserName : {
                required : true,
                maxlength:64,
                checkUserPwd : ""
            },
            Password : {
                required : true,
                maxlength:64,
                checkUserPwd : ""
            },
            PasswordConfirm : {
                checkUserPwd : "",
                userDefinedConfirmPwd : ""
            }
        }
    });
    validator.init();
}

function initData() {
    jsonMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.IEEE8021x,jsonMap)){
        disableAll();
        return;
    }
    jsonMap_bak =objectClone(jsonMap);

    LAPI_CfgToForm("frmSetup",jsonMap);
    $("#ProtocolType").attr("disabled","true");
    $("#PasswordConfirm").val($("#Password").val());
}

$(document).ready(function() {
    parent.selectItem("IEEE8021xCfgTab");
    beforeDataLoad();
    initLang();
    initValidator();
    initData();
    afterDataLoad();
});/**
 * Created by w02927 on 2016/2/23.
 */
