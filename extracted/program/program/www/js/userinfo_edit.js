// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var jsonMap = parent.userMap;
// 密码是否被修改
var isChangedPwd = false; // 标志位，密码是否被修改
///var userPwdDefaultValue = "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"; // 密码初始显示值，内容无意义
var validator = null;
var type = getparastr("type");
var isTempCert = getparastr("isTempCert");

/**
 * 如果2个密码框中任意一个获得过焦点，则密码内容2个都置空
 */
function initPwdChanged() {
    if (isChangedPwd) return;
    $("#userPwd").val("");
    $("#userConfirmPwd").val("");
    isChangedPwd = true;
}

// 检测用户名是否重复
function checkDuplicatedName(){
    var i,
        len = parent.jsonMap["Users"].length,
        flag = false,
        user;
    
    for ( i = 0; i < len; i++) {
        user = parent.jsonMap["Users"][i];
        if ((1 == type) && (i == parent.UserDataView.currectRow)) continue;
        if (user["Name"] == $("#Name").val()) {
            top.banner.showMsg(true, $.lang.tip["tipDuplicatedName"], 0);
            flag = true;
            break;
        }
    }
    
    return flag;
}

function pwStrength(pwd){
    var level,
        lPicclass,
        mPicclass,
        hPicclass,
        lTextclass,
        mTextclass,
        hTextclass;
    
    if (pwd == null){   
        lPicclass = "level1" ;   
        mPicclass = hPicclass = "level0";   
        lTextclass = "levelT1" ;   
        mTextclass = hTextclass = "levelT0"; 
    } else {
        level=checkStrong(pwd); 
        
        switch(level) {   
            case 0:
            case 1:   
                lPicclass = "level1" ;   
                mPicclass = hPicclass = "level0";   
                lTextclass = "levelT1" ;   
                mTextclass = hTextclass = "levelT0";   
                break;
                
            case 2:   
                lPicclass = mPicclass = "level2";   
                hPicclass = "level0";   
                mTextclass = "levelT2";   
                lTextclass = hTextclass = "levelT0";   
                break;
                
            default:   
                lPicclass = mPicclass = hPicclass = "level3";   
                hTextclass = "levelT3";  
                lTextclass = mTextclass = "levelT0";
        } 
    }

    $(".levelPic").removeClass("level0").removeClass("level1").removeClass("level2").removeClass("level3");
    $(".levelText").removeClass("levelT0").removeClass("levelT1").removeClass("levelT2").removeClass("levelT3");
    
    $("#pwdLevelPic_1").addClass(lPicclass);   
    $("#pwdLevelPic_2").addClass(mPicclass);   
    $("#pwdLevelPic_3").addClass(hPicclass);
    $("#pwdLevelText_1").addClass(lTextclass);   
    $("#pwdLevelText_2").addClass(mTextclass);   
    $("#pwdLevelText_3").addClass(hTextclass);
 } 
/********************************** end ***********************************/
function initPage() {
    $("#Name").attr("disabled", (1 == type));
    if (1 == isTempCert) {
        $("#tipDiv").removeClass("hidden")
    } else if (0 == checkStrong(top.banner.loginUserPwd) || 1 == checkStrong(top.banner.loginUserPwd)){
        if(!top.banner.isFriendPasswordEnable){
            $("#noticeHR").removeClass("hidden");
            $("#notice").removeClass("hidden");
        }
    }
}

function initData() {
    document.onkeydown = shieldEsc;

    $("#userPwd").val("");
    $("#userConfirmPwd").val("");
    cfgToForm(jsonMap, "frmSetup");
}

function submitWinData() {
    var flag_ChangePwd = (LoginType.WEB_LOGIN == top.banner.loginType && top.banner.loginUserName == $("#Name").val());//判断登录方式是否为web登录且修改的用户是否为登录用户
    if(0 == type) {
        $("#userPwd").focus().blur();
    }
    if (!validator.form()) {
        return;
    }

    jsonMap["Passwd"] = base64encode($("#userPwd").val());

    if (0 == type) {    //添加
        // 检查用户名是否重复
        if (checkDuplicatedName()) {
            return;
        }
        jsonMap["ID"] = -1;
        jsonMap["Name"] =$("#Name").val();
        jsonMap["Level"] =$("#Level").val();
        flag = LAPI_CreateCfgData(LAPI_URL.Users_Cfg + "/Users",jsonMap);

    } else {    //编辑
        // 未修改，直接返回
        if (!isChangedPwd) {
            top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
            return;
        }
        if(flag_ChangePwd && !confirm($.lang.tip["tipPasswdChanged"])) return;
        flag = LAPI_SetCfgData(LAPI_URL.Users_Cfg + "/Users/" + jsonMap["ID"],jsonMap);
    }

    top.banner.showMsg(flag);
    if (flag) {
        if(top.banner.loginUserName == $("#Name").val()){
            top.banner.loginUserPwd = $("#userPwd").val();
        }
    	if(parent.UserDataView)
    	{
           parent.UserDataView.refresh();
    	}
        if (1 == isTempCert) {
            parent.logout();
        } else {
            if(flag_ChangePwd) {
                top.banner.logout();
            }
            parent.closeWin();
        }
    }
    
}

function userConfirmPwdCheck() {
    var $userConfirmPwd = $("#userConfirmPwd");
    if("" != $userConfirmPwd.val()){
        $userConfirmPwd.valid();
    }
}

function initEvent() {
    var $userPwd = $("#userPwd");
    $userPwd.bind("keyup", function(){pwStrength(this.value)});
    $userPwd.bind("blur", function(){pwStrength(this.value)}).bind("blur", function(){userConfirmPwdCheck()});

    $userPwd.bind("focus", initPwdChanged);
    $("#userConfirmPwd").bind("focus", initPwdChanged);
}

function initValidator() {
    var msg = top.IsRemote? $.lang.tip["tipPwsStrong"] : $.lang.tip["tipCharFmtErr"];
    $("#Name").attr("tip", $.lang.tip["tipUserName2"]);
    $("#userPwd").attr("tip", $.lang.tip["tipPassword"]);
    $("#userConfirmPwd").attr("tip", $.lang.tip["tipPassword"]);

    $.validator.addMethod("checkUserName", function(value) {
        return checkUserName(value);
    }, $.lang.tip["tipCharFmtErr"]);

    $.validator.addMethod("checkPwd", function(value) {
        var flag = true;
        if (isChangedPwd) {
            flag = checkPassword(value);
            if (flag && top.IsRemote) {
                flag = !($("#pwdLevelPic_2").hasClass("level0"));
            }
        }
        return flag;
    }, msg);

    $.validator.addMethod("userDefinedConfirmPwd", function() {
            // 两次输入的密码应该相同
            return ($("#userPwd").val() == $("#userConfirmPwd").val());
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
                required : true,
                checkUserName : ""
            },
            userPwd : {
                checkPwd : ""
            },
            userConfirmPwd : {

                userDefinedConfirmPwd : ""
            }
        }
    });
    validator.init();
}

$(document).ready(function() {
    beforeDataLoad();
    initPage();
    initLang();
    initEvent();
    initValidator();
    initData();
    afterDataLoad();
});