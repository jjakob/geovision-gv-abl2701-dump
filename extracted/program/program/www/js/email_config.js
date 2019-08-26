// JavaScript Document
GlobalInvoke(window);
/** ******************************* 全局变量 ********************************* */
var validator = null;
var channelId = 0; // 通道号
var DataMap = {}; // 数据
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    Name:["SenderName"],
    From:["SenderAddress"],
    SmtpServer:["SmtpServer"],
    SmtpServerPort:["ServerPort"],
    EnableSSL:["SSL"],
    CaptureIntervals:["AttachmentInterval"],
    ImageAttachments:["AttachmentType"],
    EnableServerAuth:["ServerAuth"],
    UserName:["Account"],
    PassWord:["Password"],
    RecipientName0:["Recipients",0,"Name"],
    Recipient0:["Recipients",0,"Address"],
    RecipientName1:["Recipients",1,"Name"],
    Recipient1:["Recipients",1,"Address"],
    RecipientName2:["Recipients",2,"Name"],
    Recipient2:["Recipients",2,"Address"]
};
/** ******************************* 全局变量 end ******************************* */

/** ***************************** operation start ************************* */

/** ***************************** operation End ************************* */

/** ***************************** common method start ************************* */
function initPage() {
}

function initValidator() {
    $("#Name").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#From").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#SmtpServer").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#SmtpServerPort").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
    $("#UserName").attr("tip", $.lang.tip["tipEmailAdress"]);
    $("#PassWord").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#comfirmPassWord").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#RecipientName0").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#Recipient0").attr("tip", $.lang.tip["tipEmailAdress"]);
    $("#RecipientName1").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#Recipient1").attr("tip", $.lang.tip["tipEmailAdress"]);
    $("#RecipientName2").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#Recipient2").attr("tip", $.lang.tip["tipEmailAdress"]);
    
    $.validator.addMethod("validStrNoNull", function(value) {
        return validStrNoNull(value);
    }, $.lang.validate["valRequired"]);
    
    $.validator.addMethod("validNameContent", function(value) {
        if(""  == value)
            return true;

        return validNameContent(value);
    }, $.lang.tip["tipCharFmtErr"]);
    
    $.validator.addMethod("validEmailAdress", function(value) {
        if(""  == value)
            return true;

        return validEmailAdress(value);
    }, $.lang.tip["tipEmailFmtErr"]);
    
    $.validator.addMethod("checkUserName", function(value) {
        return checkUserName(value);
    }, $.lang.tip["tipCharFmtErr"]);

    $.validator.addMethod("checkPwd", function(value) {
        //if (isChangedPwd) {
            return checkPassword(value);
        /*} else {
            return true;
        }*/
    }, $.lang.tip["tipCharFmtErr"]);

    $.validator.addMethod("userDefinedConfirmPwd", function(value, element, param) {
        // 两次输入的密码应该相同
            return ($(param).val() == value);
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
            Name : {
                maxlength:32,
                validNameContent:""
            },
            From : {
                maxlength:32,
                validNameContent:""
            },
            SmtpServer : {
                maxlength:32,
                validNameContent:""
            },
            SmtpServerPort : {
                integer: true,
                required: true,
                range:[1, 65535]
            },
            UserName : {
                maxlength: 48,
                validEmailAdress:""
            },
            PassWord : {
                maxlength: 32,
                validNameContent:""/*,
                userDefinedConfirmPwd : "#comfirmPassWord",
                relationTo : [ {
                    id : "#comfirmPassWord",
                    method : "userDefinedConfirmPwd"
                } ]
            },
            comfirmPassWord : {
                checkPwd : "",
                userDefinedConfirmPwd : "#PassWord",
                relationTo : [ {
                    id : "#PassWord",
                    method : "userDefinedConfirmPwd"
                } ]*/
            },
            RecipientName0 : {
                maxlength:32,
                validNameContent:""
            },
            Recipient0 : {
                maxlength:48,
                validEmailAdress:""
            },
            RecipientName1 : {
                maxlength:32,
                validNameContent:""
            },
            Recipient1 : {
                maxlength:48,
                validEmailAdress:""
            },
            RecipientName2 : {
                maxlength:32,
                validNameContent:""
            },
            Recipient2 : {
                maxlength:48,
                validEmailAdress:""
            }
        }
    });
    validator.init();
}

function initEvent() {
}

function initData() {
    jsonMap = {};
    DataMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.Email_Cfg,jsonMap))
        return ;
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, DataMap, mappingMap);
}

function submitF(bool) {
    var flag;
    if (!validator.form() || !IsChanged("frmSetup", DataMap)) {
        return;
    }
    LAPI_FormToCfg("frmSetup", jsonMap, DataMap, mappingMap);
    var isChanged = !isObjectEquals(jsonMap,jsonMap_bak);
    if(isChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.Email_Cfg, jsonMap);
        if (flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

$(document).ready(function(){
    parent.selectItem("emailConfigTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});
/** ***************************** common method end ************************* */
