// JavaScript Document
GlobalInvoke(window);

// 加载语言文件
loadlanguageFile(top.language);
var enhanceMode = 0;  // 增强模式开关（0：未开启，1：开启）
var startPresetID = 1;
var endPresetID = top.banner.PresetNum;
var isShowPtzForHTS = false;
var ShowMsgTimeID = null; // 提示信息渐隐定时器
var channelId = 0;
var IVAType = IVAMode.TG;
var IVACommonType = IVACommonMode.PERIMETER;
var StartVideoTimeID = null; // 启实况的timeID
var DefaultStreamID = 0; // 默认流ID
var LiveMode = -1;   // 实况模式
var IsAutoStartVideo = true; // 是否自动启流
var PageBlockType = BlockType.UNCONNECTED; // 断网
var isShowIVASpecialParam = false; // 是否显示场景特殊参数
var titleDeviceType = "";
var prototypeName = "";
var prototypeCfg = "";
var userMap = {           //密码修改栏，修改密码提示
    "UserName" : "admin",
    "Level" : "0"
};
var EnhancedMap;
var keepAliveNum = 0;
var Vm_sdk_viewer = null;
var isUN = true;
var exportLog = false;
if (("undefined" != typeof showProductType) && (1 == showProductType)) { 
    isUN = false;
}
if ("undefined" != typeof (showDeviceType)) {
    titleDeviceType =  showDeviceType.split("@")[0];
}
if ("undefined" != typeof (showDeviceName)) {
    var arr =  showDeviceName.split("@");
    prototypeName = arr[0];
    prototypeCfg = (1 == arr.length)? "" : arr[1];
}
parent.StreamID = 0;
if (top.banner.isSupportFishEye) {
    parent.StreamID = 10;
}
parent.VideoType = VideoType.LIVE;
var anchor = "1.14";
parent.userType = UserType.Operator;

//将在top里面的变量赋值传递
var loginType = top.loginType;// 界面登陆类型，参见 LoginType
var loginUserName = top.loginUserName;
var loginUserPwd = top.loginUserPwd;
var loginServerIp = top.loginServerIp;
var loginClientIp = top.loginClientIp;
var sdkPort = top.SDKPort;
if("https:" == document.location.protocol){
    httpPort = ("" == window.location.port)?443:window.location.port;
}else{
    httpPort = ("" == window.location.port)?80:window.location.port;
}
var rtspPort = top.RTSPPort;
var menuType = top.menuType;// 菜单类型，参见 menuDefaultPage
parent.IsRemote = top.IsRemote;// 是否本地网络0：本地，1：外网
top.IsTempCert = 0;// 是否临时密码 0：非临时密码，1：临时密码
var isFriendPasswordEnable = false;
var tempMap = {};
if(LAPI_GetCfgData(LAPI_URL.FriendPwd, tempMap, false)){
    isFriendPasswordEnable = tempMap["Enable"];
}

// 皮肤样式
var searchStr = parent.window.location.search;
if (searchStr.indexOf("style=") > -1) {
    searchStr = searchStr.substring(searchStr.indexOf("style="));
    parent.style = searchStr.substring(0, searchStr.indexOf("&")).replace("style=", "");
}
var eventMsgList = [];// 事件上报消息列表

// 能力集map， {弹出窗口界面能力集对应的控件id: [能力集tagName，资源文件，是否启用]}
var capMap = {
    sceneCapEnable : [ "Scene", "sceneCap", false ],
    dscpCapEnable : [ "DSCP", "dscpCap", false ],
    autoFoucsCapEnable : [ "AutoFoucs", "autoFoucsCap", false ]
};
// 演示功能菜单与能力集map的映射表{菜单id： 能力集map的key}
var demoMenuMap = {
    sceneTR : "sceneCapEnable",
    demoOtherTR : "dscpCapEnable"
};
//升级上报定时器
var updateTime = null;
//升级成功状态标识
var updateStatus = false;
//本地升级状态信息标识
var updateMsg = false;
//http鉴权类型
var auzType = 0;
//互斥列表
var smartMapping = {
    0 : $.lang.pub["faceDetectTitle"],
    1 : $.lang.pub["peopleCountMenu"],
    2 : $.lang.pub["twCapture"],
    3 : $.lang.pub["smartTrackLink"],
    4 : $.lang.pub["Chain_Calculation"],
    100 : $.lang.pub["crossBorderTitle"],
    101 : $.lang.pub["ruleType_stay"],
    102 : $.lang.pub["enterArea"],
    103 : $.lang.pub["leaveArea"],
    104 : $.lang.pub["wanderDetect"],
    105 : $.lang.pub["fastMove"],
    199 : $.lang.pub["alarmMenu"],
    200 : $.lang.pub["peopleGather"],
    201 : $.lang.pub["parkDetect"],
    202 : $.lang.pub["leftGood"],
    203 : $.lang.pub["handleGood"],
    204 : $.lang.pub["virtualFocusTitle"],
    205 : $.lang.pub["sceneChangeTitle"],
    206 : $.lang.pub["heatMap"],
    299 : $.lang.pub["alarmAbnorMenu"]
}

// 获取智能类型
function getIVAType() {
    var tmpMap = {}, top = GetTopWindow(), resultList = [], retval;

    retval = top.sdk_viewer.ViewerAxGetIVAMode20();
    resultList = getSDKParam(retval);

    if (ResultCode.RESULT_CODE_SUCCEED == resultList[0]) {
        sdkAddCfg(tmpMap, resultList[1]);
        IVAType = Number(tmpMap["IVAMode"]);
        if (IVAMode.ILLEGAL == IVAType || top.banner.isSupportTWCpt || top.banner.isSupportSmart) {
            isShowPtzForHTS = true;
        }
    }
}

// 获取智能枪通用类型
function getIVACommonType() {
    var tmpMap = {};

    if (getCfgData(channelId, CMD_TYPE.IVA_COMMON_MODE, tmpMap)) {
        IVACommonType = Number(tmpMap["IVACommonMode"]);
    }
}

function saveHerfParam() {
    var herfStr = "?langinfo=" + top.language;
    if (0 != rtspPort) {
        herfStr += "&SDKPort=" + sdkPort + "&RTSPPort=" + rtspPort;
    }
    return herfStr;
}

// 界面退出
function pageLogout(msg) {
    var top = GetTopWindow();
    if (LoginType.WEB_LOGIN == loginType) {
        if (undefined != msg) {
            alert(msg);
        }
        var href = window.location.href;
        href = href.substring(0, href.indexOf(window.location.pathname));
        top.window.location = href + saveHerfParam();
    } else {
        if (undefined == msg) {
            msg = $.lang.pub["tipReboot"];
        }
        top.window.location = "error.htm?ErrorMsg=" + msg;
    }
}

function userLogout() {
    if (confirm($.lang.tip["tipCfmLogout"])) {
        pageLogout();
    }
}

function showMsg(success, msg, msgType) { //msgType 0:warn
    if (null !== ShowMsgTimeID) {
        clearTimeout(ShowMsgTimeID);
        ShowMsgTimeID = null;
    }
    var color = "black";
    var showTime = 2000;
    var $msgDiv = $("#msgDiv");
    $msgDiv.find("a").removeClass();
    $msgDiv.find("a").addClass("icon");
    if (!success) {
        color = "red";
        showTime = 5000;
        $msgDiv.find("a").addClass("fail");
    } else {
        if ("undefined" != msgType && 0 == msgType) {
            $msgDiv.find("a").addClass("warn");
        } else {
            $msgDiv.find("a").addClass("success");
        }
    }
    $msgDiv.css("color", color);

    if (LoginType.WEB_LOGIN != loginType) {
        $msgDiv.css( {
            top : "10px",
            width : "380px"
        });
        var $contentDiv = $("#contentDiv");
        var left = $contentDiv.position().left + ($contentDiv.width() - $msgDiv.width()) / 2;
        if ((LoginType.VM_LOGIN == loginType) && (2 == menuType || 5 == menuType || 6 == menuType)) {
            left += 200;
        }
        $msgDiv.css("left", left + "px");
    }

    if (msg) {
        $("#msg").html(msg);
    } else {
        if (success) {
            $("#msg").html($.lang.tip["tipSetCfgSucceeded"]);
        } else {
            $("#msg").html($.lang.tip["tipSetCfgFail"]);
        }
    }

    if ($msgDiv.is(":visible")) { // 提示信息可见
        $msgDiv.stop();
        if (1 == $msgDiv.css("opacity")) {
            $msgDiv.fadeTo(100, 0);
        }
        $msgDiv.fadeTo(200, 1);
    } else {
        $msgDiv.removeClass("hidden");
        $msgDiv.fadeIn(300);
    }

    ShowMsgTimeID = setTimeout(function() {
        $("#msgDiv").fadeOut(700, function() {
            $("#msgDiv").addClass("hidden");
            ShowMsgTimeID = null;
        });
    }, showTime);
}

// 升级遮盖
function updateBlock(isLock, msg) {
    if (isLock) {
        if("undefined" == typeof msg){
            msg = "";
        }
        $("#statusInfo").text(msg);
        $.blockUI( {
            message : $("#boxImg"),
            css : {
                border : 'none',
                backgroundColor : ''
            }
        });
        document.onkeydown = "";
    } else {
        $.unblockUI();
        document.onkeydown = showVersion;
    }
    this.focus();
}

function init(defineMenuType) {
    var _menuType = defineMenuType | menuType;
    if (top.IsTempCert) {
        openWin($.lang.pub["changePwdTitle"],"userinfo_edit.htm?type=1&isTempCert=" + top.IsTempCert,520,300,false,"10%","10%",true);
    } else {
        if (parent.userType == UserType.Administrator && top.banner.isUN && ("admin" == loginUserPwd || "123456" == loginUserPwd) ) {
            if(isFriendPasswordEnable){
                $("#changePwd").attr("data-lang","changePwd");
                $("#confirmDiv").slideDown();
            }else{
                openWin($.lang.pub["changePwdTitle"],"userinfo_edit.htm?type=1",500,340,false,"32.5%","30%",true);
                $("#titleBar a").addClass("hidden");
                $($(".button").get(1)).addClass("hidden");
                return;
            }
        } else if (0 == checkStrong(loginUserPwd) || 1 == checkStrong(loginUserPwd)) { //弱密码校验
            if(isFriendPasswordEnable){
                $("#changePwd").attr("data-lang", "changeWeakPwd");
                $("#confirmDiv").slideDown();
                setTimeout(cancelBar, 6000);
            }else{
                openWin($.lang.pub["changePwdTitle"],"userinfo_edit.htm?type=1",500,340,false,"32.5%","30%",true);
                $("#titleBar a").addClass("hidden");
                $($(".button").get(1)).addClass("hidden");
                return;
            }
        }
    }
    $("#homePage").removeClass("hidden");// 显示界面
    if ((LoginType.WEB_LOGIN == loginType) && !defineMenuType) {
        try {
            // 窗口最大化
            parent.moveTo(0, 0);
            parent.resizeTo(screen.availWidth, screen.availHeight);
        } catch (e) {
        }

        // 定向到首页实况
        $("#live").trigger("click", ["live"]);

    } else {// 跳转到对应的页面
        if(menuDefaultPage[_menuType] == "playback"){
            $("#playback").trigger("click", ["playback"]);
        }
        if(menuDefaultPage[_menuType] == "photo") {
            $("#photo").trigger("click", ["photo"]);
        }

        var tabID = menuDefaultPage[_menuType];
        var linkID = getModuleNameByTabID(tabID);
        $("#" + linkID).attr("data-defaultLink", tabID);
        if (checkNavigator("safari")) {
            safariClick(linkID);
        } else {
            document.getElementById(linkID).click();
        }
    }

}

function showUpdateResult(result) {

    result = parseInt(result);
    var errorMsg = "";

    /* 提示用户升级结果 */
    var isRebooted = true; /* 标识设备是否已重启 */
    switch (result) {
        /*文件传输完毕，正在升级*/
        case UpdateResult.FILEFINISH:
            errorMsg = $.lang.tip["tipSysUpdating"];
            break;
        /* 升级准备完毕，正在升级过程中 */
        case UpdateResult.INPROCESS:
            errorMsg = $.lang.tip["tipSysUpdating"];
            break;
        /* 升级成功 */
        case UpdateResult.SUCCESS:
            errorMsg = $.lang.tip["tipSysUpdateSuccess"];
            break;
        /* 升级失败 */
        case UpdateResult.FAIL:
            errorMsg = $.lang.tip["tipSysUpdateCheckFileErr"];
            break;
        /* 升级失败，内存或系统空间不足，已经擦除了FLASH，不能重启，需要重新升级 */
        case UpdateResult.NOMEMORY:
            isRebooted = false;
            errorMsg = $.lang.tip["tipSysUpdateMemoryErr"];
            break;
        /* 升级失败，打开镜像文件出错 */
        case UpdateResult.FILE_OPEN_ERR:
            errorMsg = $.lang.tip["tipSysUpdateFileOpenErr"];
            break;
        /*升级失败，文件类型不匹配*/
        case UpdateResult.FILE_TYPE_ERR:
            errorMsg = $.lang.tip["tipSysUpdateFileMatchErr"];
            break;
        /*升级失败，版本不匹配*/
        case UpdateResult.VERSION_ERR:
            errorMsg = $.lang.tip["tipSysUpdateVerMatchErr"];
            break;
        /* 升级失败，烧写应用程序分区出错，已经擦除了FLASH，不能重启，需要重新升级 */
        case UpdateResult.DEVICE_ERR:
            isRebooted = false;
            errorMsg = $.lang.tip["tipSysUpdateWriteErr"];
            break;
        /* 升级失败，已经有其他用户启动升级 */
        case UpdateResult.BUSY:
            errorMsg = $.lang.tip["tipSysUpdateConfictErr"];
            break;
        /* 升级失败，CRC校验失败 */
        case UpdateResult.CRC_ERR:
            errorMsg = $.lang.tip["tipSysUpdateCrcCheckErr"];
            break;
        /* 升级失败，初始化出错 */
        case UpdateResult.INIT_ERR:
            errorMsg = $.lang.tip["tipSysUpdateInitErr"];
            break;
        /* 升级失败，MD5校验失败 */
        case UpdateResult.MD5_ERR:
            errorMsg = $.lang.tip["tipSysUpdateMd5CheckErr"];
            break;
        /* 升级成功，需要重置配置（用于跨版本升级）*/
        case UpdateResult.SUCCESS_REBOOT:
            errorMsg = $.lang.tip["tipSysUpdateSuccess"];
            break;
        default:
            if(1001 <= result && result <= 1100){  //文件正在传输
                errorMsg = $.lang.tip["tipSysUpdating"];
            }
            else {
                /* 文件上传失败 */
                isRebooted = false;
                errorMsg = $.lang.tip["tipSysUpdateUploadErr"];
            }
            break;
    }
    if (!((UpdateResult.INPROCESS == result) || (1001 <= result && result<= 1100) || (UpdateResult.FILEFINISH == result))) {
        clearTimeout(updateTime);
        updateMsg = true;
        window.frames["mainIframe"].showResult("updateStatusDiv", (UpdateResult.SUCCESS == result || UpdateResult.SUCCESS_REBOOT == result), errorMsg);
    }
    if (UpdateResult.SUCCESS == result || UpdateResult.SUCCESS_REBOOT == result) {
        updateStatus = true;
        errorMsg = $.lang.tip["tipSysUpdateSuccessII"];
    }

   
    if (isRebooted) {
        var $statusInfo = $("#statusInfo");
        if ($statusInfo.length > 0) {
            $statusInfo.text(errorMsg);
        }
        if ($("#videoDiv").hasClass("waiting")) {
            $("#waitingImg").addClass("hidden");
        }
    } else {
        updateBlock(false);
    }
}

//云升级结果
function showUpdateCloudResult(result){
    result = parseInt(result);
    var errorMsg = "";

    /* 提示用户升级结果 */
    var isRebooted = true; /* 标识设备是否已重启 */
    switch (result) {
        /*文件传输完毕，正在升级*/
        case UpdateCloudResult.FILEFINISH:
            errorMsg = $.lang.tip["tipSysUpdating"];
            break;
        /* 升级准备完毕，正在升级过程中 */
        case UpdateCloudResult.INPROCESS:
            errorMsg = $.lang.tip["tipSysUpdating"];
            break;
        /* 升级成功 */
        case UpdateCloudResult.SUCCESS:
            errorMsg = $.lang.tip["tipSysUpdateSuccess"];
            break;
        /* 升级失败 */
        case UpdateCloudResult.FAIL:
            errorMsg = $.lang.tip["tipSysUpdateCheckFileErr"];
            break;
        /* 升级失败，内存或系统空间不足，已经擦除了FLASH，不能重启，需要重新升级 */
        case UpdateCloudResult.NOMEMORY:
            isRebooted = false;
            errorMsg = $.lang.tip["tipSysUpdateMemoryErr"];
            break;
        /* 升级失败，打开镜像文件出错 */
        case UpdateCloudResult.FILE_OPEN_ERR:
            errorMsg = $.lang.tip["tipSysUpdateFileOpenErr"];
            break;
        /*升级失败，文件类型不匹配*/
        case UpdateCloudResult.FILE_TYPE_ERR:
            errorMsg = $.lang.tip["tipSysUpdateFileMatchErr"];
            break;
        /*升级失败，版本不匹配*/
        case UpdateCloudResult.VERSION_ERR:
            errorMsg = $.lang.tip["tipSysUpdateVerMatchErr"];
            break;
        /* 升级失败，烧写应用程序分区出错，已经擦除了FLASH，不能重启，需要重新升级 */
        case UpdateCloudResult.DEVICE_ERR:
            isRebooted = false;
            errorMsg = $.lang.tip["tipSysUpdateWriteErr"];
            break;
        /* 升级失败，已经有其他用户启动升级 */
        case UpdateCloudResult.BUSY:
            errorMsg = $.lang.tip["tipSysUpdateConfictErr"];
            break;
        /* 升级失败，CRC校验失败 */
        case UpdateCloudResult.CRC_ERR:
            errorMsg = $.lang.tip["tipSysUpdateCrcCheckErr"];
            break;
        /* 升级失败，初始化出错 */
        case UpdateCloudResult.INIT_ERR:
            errorMsg = $.lang.tip["tipSysUpdateInitErr"];
            break;
        /* 升级失败，MD5校验失败 */
        case UpdateCloudResult.MD5_ERR:
            errorMsg = $.lang.tip["tipSysUpdateMd5CheckErr"];
            break;
        /* 等待接收数据 */
        case UpdateCloudResult.WAIT_RECEIVE_DATA:
            errorMsg = $.lang.tip["tipSysUpdating"];
            break;
        default:
            if(1001 <= result && result <= 1100){  //文件正在传输
                errorMsg = $.lang.tip["tipSysUpdating"];
            }
            else {
                /* 文件上传失败 */
                isRebooted = false;
                errorMsg = $.lang.tip["tipSysUpdateUploadErr"];
            }
            break;
    }

    if (!((UpdateCloudResult.INPROCESS == result) || (1001 <= result && result <= 1100) || (UpdateCloudResult.FILEFINISH == result) || (UpdateCloudResult.WAIT_RECEIVE_DATA == result))) { //非升级过程
        window.frames["mainIframe"].showResult("cloudUpdateStatus", (UpdateCloudResult.SUCCESS == result), errorMsg);
    }

    if (UpdateCloudResult.SUCCESS == result) {
        updateStatus = true;
        errorMsg = $.lang.tip["tipSysUpdateSuccessII"];
    }

    top.showedFlag = true;
    if (isRebooted) {
        var $statusInfo = $("#statusInfo");
        if ($statusInfo.length > 0) {
            $statusInfo.text(errorMsg);
        }
        if ($("#videoDiv").hasClass("waiting")) {
            $("#waitingImg").addClass("hidden");
        }
    } else {
        updateBlock(false);
    }
}

function keepAlive() {
    //保活成功不提示，保活失败3次，提示失败信息。
   GetKeepAliveData(LAPI_URL.KeepAlive, {}, "", false, keepAliveCallback, {async: true});

}

function keepAliveCallback(errCode) {
    var top = GetTopWindow();

    if(exportLog) {
        errCode = ResultCode.RESULT_CODE_SUCCEED;
    }

    if (ResultCode.RESULT_CODE_SUCCEED == errCode) {
        keepAliveNum = 0;
    } else {
        keepAliveNum++;
       if (3 === keepAliveNum) {
           if(top.sdk_viewer.isInstalled){
               top.sdk_viewer.execFunctionReturnAll("NetSDKUnRegPostEvent");
           }
            video.isSleepReplay = true;// 自动建流线程进入睡眠
            var $videoDiv = $("#videoDiv");

           if ($videoDiv.width() > 20) {    // 带实况界面，需要隐藏实况窗口（否则遮盖层会被挡住）
                $("#waitingImg").addClass("hidden");
                $("#video").addClass("video_hidden");
            }
            if (BlockType.UNCONNECTED == PageBlockType) {
                updateBlock(true, $.lang.tip["tipDisconnection2"]);
            }
            setTimeout("autoLogin()", 30000);
        }
    }
    if (keepAliveNum < 3) {
        setTimeout(keepAlive, 10000);
    }
}
function GetKeepAliveData(url, map, dataStr, isShowResultMsg, callback, paramMap)
{
    var _isShow = ("undefined" == typeof isShowResultMsg)? true : isShowResultMsg;
    var dataStr = ("undefined" == typeof dataStr)? "" : dataStr;
    var flag = true;
    var asyncFlag = false;

    url += "?randomkey="+ (new Date().getTime());

    if ("undefined" != typeof paramMap){
        if ("undefined" != typeof paramMap["async"]) asyncFlag = paramMap["async"];
    }
    $.ajax({
        type: "GET",
        async: asyncFlag,
        url: url,
        data: dataStr,
        dataType: "json",
        timeout: 5000,
        success: function(data){
            flag =(ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode);
            if (callback && (callback instanceof Function)) {
                callback(data.Response.StatusCode,map,paramMap);
            }

        },
        error: function(e) {
            flag = false;
            if (callback && (callback instanceof Function)) {
                callback(ResultCode.RESULT_CODE_KEEPALIVEFAIL,{},paramMap);
            }
        }
    });
    return flag;
}

function  startVideoCallback(errCode,map,paramMap) {
    var flag = false,
        wndID = paramMap["wndID"],
        streamID = 0,
        autoSatartPtzFlag = 0,
        autoStartisLive = false;
    // 重连退出条件
    if(2 == wndID && (top.banner.isSupportCapture || top.banner.isSupportIpcCapture)){
        streamID = top.banner.maxStreamNum + 1;
    }else{
        streamID = video.statusList[wndID]["streamID"];
    }
    if(top.banner.isSupportPTZ){//实况云台按钮显示
        autoSatartPtzFlag = 1;
    }
    if (window.frames["mainIframe"].startstopVideo) { // 是否实况首页用于显示内置信息
        autoStartisLive = true;
    }
    if (ResultCode.RESULT_CODE_SUCCEED == errCode && !video.isSleepReplay) { // 暂停建流，进入sleep
        if(2 == wndID && (top.banner.isSupportCapture || top.banner.isSupportIpcCapture)){ //抓拍流断开
            flag = video.startJpeg();
        }else{
            flag = video.startVideo(streamID, false, wndID,autoSatartPtzFlag,autoStartisLive);
        }

    }

    if (!flag) {
        setTimeout("autoStartStream("+ streamID + "," + wndID +")", 3000);
    } else {
        $("#videoDiv").removeClass("waiting");
        $("#videoMsg").addClass("hidden");
        if (video.bRecEnabled) {// 恢复录像
            video.bRecEnabled = false;
            window.frames["mainIframe"].startStopRecord();
        }
        if (window.frames["mainIframe"].startstopVideo) { // 首页
            window.frames["mainIframe"].$("#blockDiv").css("display", "none");
        }else{
            window.frames["mainIframe"].window.location.reload();
        }
    }
}

function autoStartStream(streamID,wndID) {
    // 重连退出条件
    GetKeepAliveData(LAPI_URL.KeepAlive,{},"", false, startVideoCallback, {async: true,wndID:wndID});
}

// 自动登录（断网时重连）
function autoLogin() {
    var top = GetTopWindow(),retcode,jsonMap,flag;
    var pcParam = "LocalIpAddr=" + loginClientIp + "&RemoteIpAddr=" + loginServerIp + "&UserName=" + loginUserName
            + "&Password=" + loginUserPwd;
    retcode = GetKeepAliveData(LAPI_URL.KeepAlive,{});
    var  msg  = "";
    
    if (!retcode) {
        setTimeout("autoLogin()", 5000);
    }else {
        // 需要退出的情况
        if (((BlockType.UPDATE == PageBlockType) && updateStatus) || (BlockType.PRODUCT_SWITCH == PageBlockType) || (BlockType.RELOGIN == PageBlockType) || (BlockType.CUSTOM_UPDATE == PageBlockType)) {
            if (BlockType.CUSTOM_UPDATE == PageBlockType) {
                msg = $.lang.tip["tipCustomUpdate"].replace("%s1",
                    "<a href='#' onclick='pageLogout()'>").replace("%s2", "</a>");
            } else if (BlockType.UPDATE == PageBlockType) {
                msg = $.lang.tip["tipSysUpdateSuccessIII"].replace("%s1",
                    "<a href='#' onclick='pageLogout()'>").replace("%s2", "</a>");
            } else if (BlockType.RELOGIN == PageBlockType) {
                msg = $.lang.tip["tipCustomModelRelogin"].replace("%s1",
                    "<a href='#' onclick='pageLogout()'>").replace("%s2", "</a>");
            } else {
                msg = $.lang.tip["tipProductSwitchSuccess"].replace("%s1",
                    "<a href='#' onclick='pageLogout()'>").replace("%s2", "</a>");
            }
            $("#statusInfo").html(msg);
            return;
        }
        if(top.sdk_viewer.isInstalled) {
            top.sdk_viewer.execFunctionReturnAll("NetSDKRegPostAuzEvent",LAPI_URL.Subscription,loginServerIp,Number(httpPort),8,loginUserName,loginUserPwd,auzType);
        }
        updateBlock(false);
	    clearTimeout(updateTime);
        if (!updateMsg && (BlockType.UPDATE == PageBlockType)) {
            window.frames["mainIframe"].showResult("updateStatusDiv", false, $.lang.tip["tipSysUpdateTimeout"]);
        }
        PageBlockType = BlockType.UNCONNECTED;
        var $videoDiv = $("#videoDiv");
        if ($videoDiv.width() > 20) {
            $("#waitingImg").removeClass("hidden");
            $("#video").removeClass("video_hidden");
        }
        if (video.isVoiceTalkOpen) {
            // 先停语音对讲
            video.stopVoiceTalk();
            if (window.frames["mainIframe"].startstopTalk) {
                window.frames["mainIframe"].startstopTalk();
            } else {
                video.startVoiceTalk();
            }
        }
        video.isSleepReplay = false;// 继续建流

        if(top.banner.isSupportRealtimeStatus || top.banner.isSupportIvaPark){
            getRealtimeStatusInfo();
        }

        if (frames["mainIframe"].onCruiseStatus) {
            var ptzStatusMap = {};
            //获取云台状态
            if (LAPI_GetCfgData(LAPI_URL.PTZStatus,ptzStatusMap)) {
                if (7 == ptzStatusMap["StatusID"]) {
                    frames["mainIframe"].onCruiseStatus(ptzStatusMap["StatusParam"]);
                }
            }
        }
        keepAlive();
    }
}
/** **************************************************************** */
var versionInfo = ""; // 版本信息
var capInfo = ""; // 设备能力集
// 按F2弹出版本信息
function showVersion(e) {
    var resultCode,
        tempMapF = {},
        tempMapS = {},
        flag = false,
        result;
    if ("block" == $("#blockDiv").css("display"))
        return;// 有遮盖层的时候不显示版本信息
    var event = getEvent();
    e = e || event;
    var currKey = e.keyCode || e.which || e.charCode;
    if (top.banner.isSupportDebugger) {
        if ((KEY_CODE.keyD == currKey) && e.shiftKey && e.ctrlKey && e.altKey) {
            if (top.banner.isSupportCapture) {  //交通版
                var $debuggerCfgLink = $("#debuggerCfgLink");
                if ($debuggerCfgLink.is(":hidden")) {
                    $debuggerCfgLink.parent().removeClass("hidden");
                } else {
                    if ($debuggerCfgLink.parent().hasClass("navigation-active")) { // 如果当前处于调试页，则需要跳转到其他页
                        $("#systemCfgLink").trigger("click");
                    }
                    $debuggerCfgLink.parent().addClass("hidden");
                }
                if ($("#debuggerCfgIVABallLink").is(":hidden")) {
                    $("#debuggerCfgIVABallLink").parent().removeClass("hidden");
                } else {
                    if ($("#debuggerCfgIVABallLink").parent().hasClass("navigation-active")) { // 如果当前处于调试页，则需要跳转到其他页
                        $("#systemCfgLink").trigger("click");
                    }
                    $("#debuggerCfgIVABallLink").parent().addClass("hidden");
                }
            } else {
                var $debuggerOthersLink = $("#debuggerOthersLink");
                if ($debuggerOthersLink.parent().prev("div").is(":hidden")) {
                    $debuggerOthersLink.parent().prev("div").removeClass("hidden");
                } else {
                    if ($debuggerOthersLink.parent().children(".menu-active").length > 0) { // 如果当前处于调试页，则需要跳转到其他页
    
                        $("#navigationLink").trigger("click");
                    }
                    $debuggerOthersLink.parent().prev("div").addClass("hidden");
                    $debuggerOthersLink.parent().slideUp(0); //将其他已经展开的收缩
                    $debuggerOthersLink.parent().prev("div").children("a").removeClass("menu-image-up"); //将其他向上箭头的改为向下箭头
                }
            }
        }
        if(top.banner.isSupportLowDelay){
            resultCode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetConfig");
            if(0 == resultCode.code){
                tempMapF = $.parseJSON(resultCode.result);
            }
            if(LAPI_GetCfgNoTip(LAPI_URL.LowDelay,tempMapS) && 0 == resultCode.code){
                if((KEY_CODE.keyN == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
                    if(1 == tempMapS["Enabled"] && 2 == tempMapF["Fluency"] && 0 == tempMapF["VideoTransProto"]){
                        return;
                    }
                    tempMapF["Fluency"] = 2;
                    tempMapF["VideoTransProto"] = 0;
                    tempMapS["Enabled"] = 1;
                    result = top.sdk_viewer.execFunctionReturnAll("NetSDKSetConfig", tempMapF);
                    if(LAPI_SetCfgNoTip(LAPI_URL.LowDelay,tempMapS) &&　result){
                        $("#keyTip").addClass("keyBoardRight-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardRight-tip");
                        },1000);
                    }else{
                        $("#keyTip").addClass("keyBoardError-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardError-tip");
                        },1000);
                    }
                }
                if((KEY_CODE.keyF == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
                    if(0 == tempMapS["Enabled"]){
                        return;
                    }
                    tempMapS["Enabled"] = 0;
                    if(LAPI_SetCfgNoTip(LAPI_URL.LowDelay,tempMapS)){
                        $("#keyTip").addClass("keyBoardRight-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardRight-tip");
                        },1000);
                    }else{
                        $("#keyTip").addClass("keyBoardError-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardError-tip");
                        },1000);
                    }
                }
            }
        }
        if((KEY_CODE.keyH == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
            if(enhanceMode){
                return;
            }else{
                EnhancedMap["Enabled"] = 1;
                if(LAPI_SetCfgNoTip(LAPI_URL.EnhanceMode,EnhancedMap)){
                    enhanceMode = 1;
                    $("#keyTip").addClass("keyBoardRight-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardRight-tip");
                    },1000);
                }else{
                    $("#keyTip").addClass("keyBoardError-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardError-tip");
                    },1000);
                }
            }
        }
        if((KEY_CODE.keyU == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
            if(!enhanceMode){
                return;
            }else{
                EnhancedMap["Enabled"] = 0;
                if(LAPI_SetCfgNoTip(LAPI_URL.EnhanceMode,EnhancedMap)){
                    enhanceMode = 0;
                    $("#keyTip").addClass("keyBoardRight-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardRight-tip");
                    },1000);
                }else{
                    $("#keyTip").addClass("keyBoardError-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardError-tip");
                    },1000);
                }
            }
        }
    }
    if (top.banner.isSupportDemo || (VersionType.PRJ == top.banner.versionType)) {
        if(top.banner.isSupportIvaPark) {
            if((KEY_CODE.keyD == currKey) && e.shiftKey && e.ctrlKey && e.altKey) {
                if ($("#debuggerCfgIVABallLink").is(":hidden")) {
                    $("#debuggerCfgIVABallLink").parent().removeClass("hidden");
                } else {
                    if ($("#debuggerCfgIVABallLink").parent().hasClass("navigation-active")) { // 如果当前处于调试页，则需要跳转到其他页
                        $("#systemCfgLink").trigger("click");
                    }
                    $("#debuggerCfgIVABallLink").parent().addClass("hidden");
                }
            }
        }
        if ((KEY_CODE.keyY == currKey) && e.shiftKey && e.ctrlKey && e.altKey) {
            var $demoFuncLink = $("#demoFuncLink");
            if ($demoFuncLink.parent().prev("div").is(":hidden")) {
                $demoFuncLink.parent().prev("div").removeClass("hidden");
            } else {
                if ($demoFuncLink.hasClass("menu-active")) { // 如果当前处于演示页，则需要跳转到其他页
                    $("#navigationLink").trigger("click");
                }
                $demoFuncLink.parent().prev("div").addClass("hidden");
                $demoFuncLink.parent().slideUp(0); //将其他已经展开的收缩
                $demoFuncLink.parent().prev("div").children("a").removeClass("menu-image-up"); //将其他向上箭头的改为向下箭头
            }
        }
    }
    if(top.banner.isSupportDemo){
        if(top.banner.isSupportLowDelay){
            resultCode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetConfig");
            if(0 == resultCode.code){
                tempMapF = $.parseJSON(resultCode.result);
            }
            if(LAPI_GetCfgNoTip(LAPI_URL.LowDelay,tempMapS) && 0 == resultCode.code){
                if((KEY_CODE.keyN == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
                    if(1 == tempMapS["Enabled"] && 2 == tempMapF["Fluency"] && 0 == tempMapF["VideoTransProto"]){
                        return;
                    }
                    tempMapF["Fluency"] = 2;
                    tempMapF["VideoTransProto"] = 0;
                    tempMapS["Enabled"] = 1;
                    result = top.sdk_viewer.execFunctionReturnAll("NetSDKSetConfig", tempMapF);
                    if(LAPI_SetCfgNoTip(LAPI_URL.LowDelay,tempMapS) &&　result){
                        $("#keyTip").addClass("keyBoardRight-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardRight-tip");
                        },1000);
                    }else{
                        $("#keyTip").addClass("keyBoardError-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardError-tip");
                        },1000);
                    }
                }
                if((KEY_CODE.keyF == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
                    if(0 == tempMapS["Enabled"]){
                        return;
                    }
                    tempMapS["Enabled"] = 0;
                    if(LAPI_SetCfgNoTip(LAPI_URL.LowDelay,tempMapS)){
                        $("#keyTip").addClass("keyBoardRight-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardRight-tip");
                        },1000);
                    }else{
                        $("#keyTip").addClass("keyBoardError-tip");
                        setTimeout(function(){
                            $("#keyTip").removeClass("keyBoardError-tip");
                        },1000);
                    }
                }
            }
        }
        if((KEY_CODE.keyH == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
            if(enhanceMode){
                return;
            }else{
                EnhancedMap["Enabled"] = 1;
                if(LAPI_SetCfgNoTip(LAPI_URL.EnhanceMode,EnhancedMap)){
                    enhanceMode = 1;
                    $("#keyTip").addClass("keyBoardRight-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardRight-tip");
                    },1000);
                }else{
                    $("#keyTip").addClass("keyBoardError-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardError-tip");
                    },1000);
                }
            }
        }
        if((KEY_CODE.keyU == currKey) && e.shiftKey && e.ctrlKey && e.altKey){
            if(!enhanceMode){
                return;
            }else{
                EnhancedMap["Enabled"] = 0;
                if(LAPI_SetCfgNoTip(LAPI_URL.EnhanceMode,EnhancedMap)){
                    enhanceMode = 0;
                    $("#keyTip").addClass("keyBoardRight-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardRight-tip");
                    },1000);
                }else{
                    $("#keyTip").addClass("keyBoardError-tip");
                    setTimeout(function(){
                        $("#keyTip").removeClass("keyBoardError-tip");
                    },1000);
                }
            }
        }
    }
}

// 改变实况大小（页面）
function changeVideoSize(videoWidth, videoHeight) {
    var realWidth = 0, realHeight = 0;

    var $video = $("#video");
    $video.css( {
        width : "",
        height : ""
    });

    if (video.cur_scale == 0xff) {
        realWidth = $video.width();
        realHeight = $video.height();

        if (videoWidth > realWidth) {
            $video.css("width", videoWidth + "px");
            video.$("#activeX_obj").css("width", videoWidth + "px");
        }
        if (videoHeight > realHeight) {
            $video.css("height", videoHeight + "px");
            video.$("#activeX_obj").css("height", videoHeight + "px");
        }
    }
}

// 按快捷键或刚配置时用
// 按获取的能力集决定是否显示功能调试菜单，以及内含的所有页面（默认只要有一个能力开启，则功能调试菜单可见）
function updateFunDemoMenu() {
    // 更新实况中自动对焦功能显隐
    if (window.frames["mainIframe"].updateAutoFocusFunction) {
        window.frames["mainIframe"].updateAutoFocusFunction();
    }

    // 功能演示菜单相关
    var isDemoPageVisible = false;
    for ( var n in demoMenuMap) {// 变量演示功能菜单中对应能力集是否启用
        if (capMap[demoMenuMap[n]][2]) {
            isDemoPageVisible = true;
            break;
        }
    }

    var menuName = menuTitle[4]; // 功能调试菜单元素
    var $menuName = $("#" + menuName + "_menu");
    if (!isDemoPageVisible) {
        $menuName.addClass("hidden");
        if (("undefined" != typeof (title)) && title_fundemo == title) // 如果当前处于功能演示页，则需要跳转到其他页
        {
            selectItem("networkConfigLink");
            if (checkNavigator("safari")) {
                safariClick("networkConfigLink");
            } else {
                document.getElementById("networkConfigLink").click();
            }
        }
        return;
    }
    
    if (checkNavigator("safari")) {
        safariClick("fundemoBigLink");
    } else {
        document.getElementById("fundemoBigLink").click();
    }
    $menuName.removeClass("hidden");

    for ( var n in demoMenuMap) {// 显示隐藏菜单
        if (capMap[demoMenuMap[n]][2]) {
            $("#" + n).removeClass("hidden");
        } else {
            $("#" + n).addClass("hidden");
        }
    }
}

// 实况显示
function showVideo(w, h, t, l, isShowPtz) {
    var object = document.getElementById("mainIframe");
    var offset = {
        x : 0,
        y : 0
    };
    GetOffset(object, offset);


    t = parseInt(t) + parseInt(offset.y);
    l = parseInt(l) + parseInt(offset.x);
    window.frames["video"].changeVideoType(isShowPtz, w, h);
    window.frames["video"].resetCombox();
    if (true == isShowPtz) {
        h += parseInt(window.frames["video"].document.getElementById("ctrlTR").offsetHeight);
    }
    var videoDiv = document.getElementById("videoDiv");
    var videoIframe = document.getElementById("video");
    videoIframe.style.cssText = "width: 100%; height: 100%";
    videoDiv.style.cssText = "left: " + l + "px; top: " + t + "px; z-index: 103; width: " + w + "px; height: " + h
            + "px";
}

// 实况隐藏
function hiddenVideo() {
    document.getElementById("videoDiv").style.cssText = "";
    document.getElementById("video").style.cssText = "";

    if (video.isShowPtz) {
        video.changeVideoType(false);
    }
    // 隐藏掉实况窗口时也隐藏添加预置位的弹出框
    $("#editPreset").addClass("hidden");

    if (null !== StartVideoTimeID) {
        clearTimeout(StartVideoTimeID);
        StartVideoTimeID = null;
    }
    
    //停流
    if (top.sdk_viewer.obj) {
        for(var i = 0; i < video.statusList.length; i++) {
            if (video.statusList[i]["isVideoOpen"]) {
                video.stopVideo(StreamType.LIVE );
            }
        }
    }
    // 恢复 video.statusList 初始值
    if(parent.DefaultStreamID != video.statusList[0]["streamID"]){
        video.statusList[0] = objectClone(video.statusMap);
        video.statusList[0]["streamID"] = parent.DefaultStreamID;
    }

    // 清空流信息
    video.StreamInfoList = [];

    video.streamNum = 0;
    video.isLiveReplay = false;
}

function submitF() {
    window.frames["mainIframe"].document.getElementById("submitBtn").click();
}

var statusMap = {};// 实时状态数据

// 获取实时状态信息
function getRealtimeStatusInfo() {
    var tmpMap = {};
    if (LAPI_GetCfgData(LAPI_URL.LAPI_ManagerServerInfo,tmpMap)) {
        statusMap["VmRegStatus"] = tmpMap["StatusParam"]["VMServerOnline"];
    }
    if (LAPI_GetCfgData(LAPI_URL.LAPI_PhotoServer,tmpMap)) {
        statusMap["TmsRegStatus"] = tmpMap["StatusParam"]["PhotoServerOnline"];
    }
    if (top.banner.isSupportIvaPark) {
        var ParkDetstatus = 0,
            CarPortjsonMap = {};
        getCfgData(channelId, CMD_TYPE.CMD_PARK_STATUS, statusMap);
        LAPI_GetCfgData(LAPI_URL.ParkingDetection, CarPortjsonMap);
        for (var i = 0; i < top.banner.carportCount; i++) {
            ParkDetstatus = CarPortjsonMap["ParkingSpaces"][i]["Status"];
            if(ParkDetstatus == 1) {
                $("#ParkingInfo" + Number(i + 1)).parent().removeClass("hidden");
            }
        }
    }
    if (LAPI_GetCfgData(LAPI_URL.LAPI_SD,tmpMap)) {
        statusMap["SDStatus"] = tmpMap["StatusParam"]["SDStatus"];
    }
    changeStatusText();
    showRealStatus(statusMap);
}

// 实时状态信息上报
function eventStatusReport(key, pcParam) {
    statusMap = {};
    if ("CoilStatus" == key || "ParkingInfo" == key) {
        sdkAddCfg(statusMap, pcParam);
    } else {
        statusMap[key] = pcParam;
    }
    changeStatusText();
    showRealStatus(statusMap);
}

// 将实时状态值替换为文字
function changeStatusText(key) {
    var textMap = {
        "CoilStatus" : [ $.lang.pub["unConnect"], $.lang.pub["connect"], $.lang.pub["untapped"] ],
        "VmRegStatus" : [ $.lang.pub["regFail"], $.lang.pub["regSucceed"], $.lang.pub["untapped"] ],
        "TmsRegStatus" : [ $.lang.pub["regFail"], $.lang.pub["regSucceed"], $.lang.pub["untapped"] ],
        "RadarStatus" : [ $.lang.pub["unConnect"], $.lang.pub["connect"], $.lang.pub["untapped"] ],
        "PolarizerStatus" : [ $.lang.pub["using"], $.lang.pub["untapped"], $.lang.pub["goDown"], $.lang.pub["goUp"],
                $.lang.pub["unconventionality"], $.lang.pub["switching"] ],
        "LEDStatus" : [ $.lang.pub["open"], $.lang.pub["close"] ],
        "OpenDetectStatus" : [$.lang.pub["conventionality"], $.lang.pub["unconventionality"]],
        "TrafficLightStatus" : [ $.lang.pub["regFail"], $.lang.pub["regSucceed"], $.lang.pub["untapped"] ],
        "NDFilterStatus" : [ $.lang.pub["using"], $.lang.pub["untapped"], $.lang.pub["goDown"], $.lang.pub["goUp"],
                $.lang.pub["unconventionality"], $.lang.pub["switching"] ],
        "SDStatus" : [ $.lang.pub["noexist"], $.lang.pub["fault"], $.lang.pub["checking"], $.lang.pub["normal"], $.lang.pub["exist"] ],
        "ParkingInfo1" : [ $.lang.pub["freeCarport"], $.lang.pub["usedCarport"], $.lang.pub["faultCarport"] ],
        "ParkingPlate1" : "",
        "ParkingInfo2" : [ $.lang.pub["freeCarport"], $.lang.pub["usedCarport"], $.lang.pub["faultCarport"] ],
        "ParkingPlate2" : "",
        "ParkingInfo3" : [ $.lang.pub["freeCarport"], $.lang.pub["usedCarport"], $.lang.pub["faultCarport"] ],
        "ParkingPlate3" : "",
        "CarportLEDCtrlStatus" : [ $.lang.pub["regFail"], $.lang.pub["regSucceed"], $.lang.pub["untapped"] ]
    };
    var classMap = {
        "CoilStatus" : ["error", "correct", "untapped"],
        "VmRegStatus" : ["error", "correct", "untapped"],
        "TmsRegStatus" : ["error", "correct", "untapped"],
        "RadarStatus" : ["error", "correct", "untapped"],
        "PolarizerStatus" : ["correct", "untapped", "godown", "goup", "error", "switching"],
        "LEDStatus" : ["correct", "untapped"],
        "OpenDetectStatus" : ["correct","error"],
        "TrafficLightStatus" : ["error", "correct", "untapped"],
        "NDFilterStatus" : ["correct", "untapped", "godown", "goup", "error", "switching"],
        "SDStatus" : ["untapped", "error", "switching", "correct" ],
        "ParkingInfo1" : ["correct", "error", "untapped"],
        "ParkingInfo2" : ["correct", "error", "untapped"],
        "ParkingInfo3" : ["correct", "error", "untapped"],
        "CarportLEDCtrlStatus" : ["error", "correct", "untapped"]
    };
    var status = "";
    var isCoilStatus = false;
    var radarStatus = "";
    var isRadarStatus = false; 
    var CoilNum = 0;
    for ( var n in statusMap) {
        var key = n;
        if (top.banner.isSupportCoil && key.indexOf("CoilStatus") > -1) {
            isCoilStatus = true;
            var no1 = key.substring("CoilStatus".length, key.length);
            if ((255 == no1) || (2 == Number(statusMap[n])))
                continue;
            no1 = (0 != no1)? no1 : "";

            switch (Number(statusMap[n])) {
                case 0:
                    status += "<div class='icon untapped'";
                    break;

                case 1:
                    status += "<div class='icon correct'";
                    break;

                default:
                    break;
            }
            status += "title='" + no1 + "(" + textMap["CoilStatus"][statusMap[n]] + ")'></div>";
            CoilNum++;
        } else if (top.banner.isSupportRadar && key.indexOf("RadarStatus") > -1) { 
            isRadarStatus = true;
            for (var i = 0; i < 4; i++) {
                var value = Number(statusMap["RadarStatus"]);
                value = value >> (4*i);
                value = value & 15;
                if (1 == value) {
                    radarStatus += "<div class='icon correct' title='" + (i + 1) + "(" + textMap["RadarStatus"][value] + ")'></div>";
                } else if (0 == value) {
                    radarStatus += "<div class='icon untapped' title='" + (i + 1) + "(" + textMap["RadarStatus"][value] + ")'></div>";
                }
            }
            statusMap[n] = radarStatus;
        } else if(key.indexOf("ParkingPlate") > -1) {
            continue;
        } else {
            if (undefined == textMap[key]) {
                continue;
            }
            statusMap[n] = "<div class='icon " + classMap[key][statusMap[n]] + "' title='" + textMap[key][statusMap[n]] + "'></div>";
        }
    }
    
    if (isCoilStatus) {
        if (status.length > 0) {
            $("#CoilStatusTbl").removeClass("hidden");
            $("#coilStatusSignTd").html(status);
            if (CoilNum > 4) {
                $("#CoilLabelSpan").removeClass("labelSpan strLimit");
            } else {
                $("#CoilLabelSpan").addClass("labelSpan strLimit");
            }
        } else {
            $("#CoilStatusTbl").addClass("hidden");
            $("#coilStatusSignTd").html("");
        } 
    } 
    if (isRadarStatus) { 
        if (radarStatus.length > 0) { 
            $("#radarID").removeClass("hidden"); 
        } else { 
            $("#radarID").addClass("hidden");
        }
    }
}

function showRealStatus(map) {
    var n, e;
    for (n in map) {
        e = document.getElementById(n);
        if (e && ("SPAN" == e.tagName)) {
            e.innerHTML = map[n];
            if (n.indexOf("ParkingPlate") > -1) {
                if ("-" == map[n]) {
                    e.innerHTML = $.lang.pub["unIdentify"];
                } else if ("#" == map[n]) {
                    e.innerHTML = $.lang.pub["recognizing"];
                } else if ("*" == map[n]) {
                    e.innerHTML = $.lang.pub["freeCarPort"];
                }
            }
        }
    }
}

// 遮盖层显示或隐藏
function blockDiv(bool) {
    var status = bool ? "block" : "none";
    $("#blockDiv").css("display", status);
    $("#blockDiv2").css("display", status);
    $("#blockDiv3").css("display", status);
}

function cfgLink(){

    $LocalCfgLink = $("#LocalCfgLink");
    $systemCfgLink = $("#systemCfgLink");
    $NetWorkLink = $("#NetWorkLink");
    $imgCfgLink = $("#imgCfgLink");
    $AudioVideoLink = $("#AudioVideoLink");
    $ivaCfgLink = $("#ivaCfgLink");
    $osdCfgLink = $("#osdCfgLink");
    $debuggerCfgLink = $("#debuggerCfgLink");
    $deviceStatusLink = $("#deviceStatusLink");
    $userCfgLink = $("#userCfgLink");
    $ptzCfgLink = $("#ptzCfgLink");
    $systemMaintenanceLink = $("#systemMaintenanceLink");
    $ivaCfgIVABallLink = $("#ivaCfgIVABallLink");
    $debuggerCfgIVABallLink = $("#debuggerCfgIVABallLink");
    $alarmMangeCfgLink = $("#alarmMangeCfgLink");

}

function cfgLinkChange(){

    $LocalCfgLink.parent().removeClass("hidden");
    $LocalCfgLink.parent().next().removeClass("hidden");
    $systemCfgLink.parent().removeClass("hidden");
    $systemCfgLink.parent().next().removeClass("hidden");
    $NetWorkLink.parent().removeClass("hidden");
    $NetWorkLink.parent().next().removeClass("hidden");
    $imgCfgLink.parent().removeClass("hidden");
    $imgCfgLink.parent().next().removeClass("hidden");
    $AudioVideoLink.parent().removeClass("hidden");
    $AudioVideoLink.parent().next().removeClass("hidden");
    $ivaCfgLink.parent().removeClass("hidden");
    $ivaCfgLink.parent().next().removeClass("hidden");
    $ivaCfgIVABallLink.parent().removeClass("hidden");
    $ivaCfgIVABallLink.parent().next().removeClass("hidden");
    $osdCfgLink.parent().removeClass("hidden");
    $osdCfgLink.parent().next().removeClass("hidden");
    $debuggerCfgLink.parent().removeClass("hide");
    $debuggerCfgLink.parent().next().removeClass("hide");
    $debuggerCfgIVABallLink.parent().removeClass("hide");
    $debuggerCfgIVABallLink.parent().next().removeClass("hide");
    $deviceStatusLink.parent().addClass("hidden");
    $deviceStatusLink.parent().next().addClass("hidden");
    $userCfgLink.parent().addClass("hidden");
    $userCfgLink.parent().next().addClass("hidden");
    $ptzCfgLink.parent().removeClass("hidden");
    $ptzCfgLink.parent().next().removeClass("hidden");
    $alarmMangeCfgLink.parent().removeClass("hidden");
    $alarmMangeCfgLink.parent().next().removeClass("hidden");
    $systemMaintenanceLink.parent().addClass("hidden");
    $systemMaintenanceLink.parent().next().addClass("hidden");

}

function nav_click(id) {
    var linkName = "",
        $selectedLink = "";
    if (("live" == id) || ("playback" == id) || ("photo" == id)) {
        $("#mainIframe").attr("src", $("#" + id).attr("data-href"));
        if (("playback" == id) || ("photo" == id)) {
            $("#RTStatus").addClass("hidden");
        } else {
            if (top.banner.isSupportRealtimeStatus || top.banner.isSupportIvaPark) {
                if (isShowPtzForHTS) {
                    $("#RTStatus").addClass("hidden");
                } else {
                    $("#RTStatus .contentLine").removeClass("RTStatusHeight");
                    $("#RTStatus").removeClass("hidden");
                }
            }
        }
    } else {
        if ((top.banner.isSupportRealtimeStatus && !top.banner.isSupportIpcCapture) || top.banner.isSupportIvaPark) {
            $("#RTStatus").removeClass("hidden");
        }
        if (top.banner.isSupportIpcCapture) {
            $("#RTStatus").addClass("hidden");
        }
        if (top.banner.isSupportHorizontalMenu) {  //交通版

            cfgLink();
            if ("config" == id) {

                cfgLinkChange();
                linkName = "LocalCfgLink";
            } else if ("maintain" == id) {
                $LocalCfgLink.parent().addClass("hidden");
                $LocalCfgLink.parent().next().addClass("hidden");
                $systemCfgLink.parent().addClass("hidden");
                $systemCfgLink.parent().next().addClass("hidden");
                $NetWorkLink.parent().addClass("hidden");
                $NetWorkLink.parent().next().addClass("hidden");
                $imgCfgLink.parent().addClass("hidden");
                $imgCfgLink.parent().next().addClass("hidden");
                $AudioVideoLink.parent().addClass("hidden");
                $AudioVideoLink.parent().next().addClass("hidden");
                $ivaCfgLink.parent().addClass("hidden");
                $ivaCfgLink.parent().next().addClass("hidden");
                $ivaCfgIVABallLink.parent().addClass("hidden");
                $ivaCfgIVABallLink.parent().next().addClass("hidden");
                $osdCfgLink.parent().addClass("hidden");
                $osdCfgLink.parent().next().addClass("hidden");
                $debuggerCfgLink.parent().addClass("hide");
                $debuggerCfgLink.parent().next().addClass("hide");
                $debuggerCfgIVABallLink.parent().addClass("hide");
                $debuggerCfgIVABallLink.parent().next().addClass("hide");
                $ptzCfgLink.parent().addClass("hidden");
                $ptzCfgLink.parent().next().addClass("hidden");
                $alarmMangeCfgLink.parent().addClass("hidden");
                $alarmMangeCfgLink.parent().next().addClass("hidden");
                $deviceStatusLink.parent().removeClass("hidden");
                $deviceStatusLink.parent().next().removeClass("hidden");
                $userCfgLink.parent().removeClass("hidden");
                $userCfgLink.parent().next().removeClass("hidden");
                $systemMaintenanceLink.parent().removeClass("hidden");
                $systemMaintenanceLink.parent().next().removeClass("hidden");
                
                linkName = "deviceStatusLink";
            }
            
            $selectedLink = $(".navigation-active a").filter(function() {
                return !$(this).parent().is(":hidden");
            }); 
            
            if ($selectedLink.length > 0) {
                linkName = $selectedLink.attr("id");
            }
        } else {
             
                linkName = $(".menu-content a").first().attr("id");
            var $menu = $(".menu-content a.menu-active");
            if ($menu.length > 0) {
                linkName = $menu.attr("id");
             }
         }
         $("#" + linkName).trigger("click");
    }
}

// 消息事件监听事件
function lisenceEvent() {
    var isReboot = false;
    for ( var len = eventMsgList.length; len > 0; len--) {
        var msgMap = eventMsgList.shift();
        var msg = msgMap;
        if (typeof msgMap === "object") {
            isReboot = msgMap["isReboot"];
            msg = msgMap["msg"];
        }
        alert(msg);
        if (isReboot) {
            pageLogout();
            return;
        }
        len = eventMsgList.length;
    }
    setTimeout("lisenceEvent()", 1000);
}

// 获取鱼眼模式
function getPearEyeCommonCfg(EyeMap){
    var _map = ("undefined" == typeof EyeMap)? {} : EyeMap;
    if(!LAPI_GetCfgData(LAPI_URL.PearlEyeCommonCfg, _map))return false;
    LiveMode = Number(_map["LiveMode"]);
    return true;
}

// 是否开启了增强模式
function getEnhanceMode(){
    if (isMac)return;
    EnhancedMap = {};
    if (LAPI_GetCfgData(LAPI_URL.EnhanceMode, EnhancedMap)) {
        enhanceMode = EnhancedMap["Enabled"];
    }
    startPresetID = (0 == enhanceMode)? 1 : 0;
}

// 登录成功将用户名密码保存在cookie中
function saveUserNameAndPassword() {
    if ("true" == getCookie("isRecordLoginCert")) {
        var username = loginUserName;
        var password = loginUserPwd;
        setCookie("userName", username);
        setCookie("loginCert", password);
    }
}

// 注销控件
function release() {
    var top = GetTopWindow();
    if(LoginType.VM_LOGIN == loginType){
        Vm_sdk_viewer.ViewerAxUnreg();
    }
   else {
        if(top.sdk_viewer.isInstalled){
            top.sdk_viewer.execFunctionReturnAll("NetSDKStopPlay",0);//实况停止播放
            top.sdk_viewer.execFunctionReturnAll("NetSDKUnRegPostEvent");
            if(isSupportCapture || isSupportIpcCapture){
                top.sdk_viewer.execFunctionReturnAll("NetSDKStopPlay",2);//抓拍停止播放
                top.sdk_viewer.execFunctionReturnAll("NetSDKStopPlayLocalJPG",1);//停止车牌彩色小图
            }
            top.sdk_viewer.unInit();
        }
    }
}

function initPage() {
    var objElement,
        jsonMap={},
        pcParam,
        ret = ResultCode.RESULT_CODE_SUCCEED,
        resultList = [],
        flag = true;


    var $homePage = $("#homePage");
    if (LoginType.EZS_LOGIN == loginType) {// EzStation跳转
        $("#titleTR").addClass("hidden");
        $homePage.css("background", "");
        $("#bodyDiv").removeClass("content");
        if (7 == menuType) {
            $("#configTitle").addClass("hidden");
            $("#menu").addClass("hidden");
        }
    } else if (LoginType.VM_LOGIN == loginType) {// VM 跳转
        $("#titleTR").addClass("hidden");
        $homePage.css("background", "");
        $("#configTitle").addClass("hidden");
        $("#menu").addClass("hidden");
        $homePage.removeClass("mainDiv");
        $homePage.css( {
            width : "100%",
            height : "100%"
        });
        $("#bodyDiv").removeClass("content");
        /**
         * VM跳转因为没有同户名和密码，获取用户名和密码需要从老接口中获取
         * 故此处会加载VM控件，目的是获取用户名和密码进行登录
         * @type {string}
         */
        objElement = "<object classid='clsid:C94369C1-B0E4-43d8-893A-2DE60804600A' id='recordManager_activeX' events='true' height='0' width='0'></object>";
        var video = window.frames["video"];
        video.$("body").append(objElement);
        Vm_sdk_viewer = video.document.getElementById('recordManager_activeX');
        pcParam = (null==getparastr("IsVMNB",location.href))? 0 : getparastr("IsVMNB",location.href) ;
        pcParam = "IsVMNB=" + pcParam;
        Vm_sdk_viewer.ViewerAxSetLocalCfgEx(pcParam);
        ret = Vm_sdk_viewer.ViewerAxGetVMUserInfo20();
        resultList = getSDKParam(ret);
        flag = (ResultCode.RESULT_CODE_SUCCEED == resultList[0]);
        if (!flag) {
            parent.pageLogout($.lang.tip["tipOcxInitInvalidUser"]);
            return;
        }

        var kvArray = resultList[1].split("&");
        loginUserName = kvArray[0];
        loginUserPwd = kvArray[1];

        jsonMap["UserName"] = loginUserName;
        jsonMap["Password"] = passwd2Cipher(loginUserPwd);
        if(!LAPI_SetCfgData(LAPI_URL.LoginCfg,jsonMap,false,queryStatus)){
            return;
        }
    }

    afterPlugInit();

    if (!isShowPtzForHTS && top.banner.isSupportRealtimeStatus && (LoginType.VM_LOGIN != loginType) && (7 != menuType)) {
        $("#RTStatus").removeClass("hidden");
    }
    if (top.banner.isSupportIpcCapture) {
        document.getElementById("TmsReg").innerText = $.lang.pub["smartServerTip"];
    }
    if (top.banner.isLandSide) {
        $("#VmRegStatusDiv").removeClass("hidden");
    }
}

function queryStatus(errCode) {
    var strMsg;
    if (ResultCode.RESULT_CODE_SUCCEED == errCode) {
        return;
    }
    else if (ResultCode.RESULT_CODE_USERFULL == errCode) {
        strMsg = $.lang.tip["tipOcxInitFullUser"];
    } else if ((ResultCode.RESULT_CODE_USERNONEXIST == errCode) || (ResultCode.RESULT_CODE_PASSWD_INVALID == errCode)) {
        strMsg = $.lang.tip["tipOcxInitInvalidUser"];
    } else if (ResultCode.RESULT_CODE_TIMEOUT == errCode) {
        strMsg = $.lang.tip["tipOcxInitWaiting"];
    } else if (ResultCode.ERR_SDK_COMMON_LOCK_USER == errCode) {
        strMsg = $.lang.tip["tipLockUser"];
    } else if (ResultCode.ERR_SDK_REMOTE_USER_WITH_WEAK_PASSWD == errCode) {
        strMsg = $.lang.tip["tipLockUserPassword"];
    } else {
        strMsg = $.lang.tip["tipOcxInitFail"];
    }
    pageLogout(strMsg);
}

// 插件初始化完成后
function afterPlugInit() {
    var tmpUsersMap= {};
    if (LAPI_GetCfgData(LAPI_URL.Users_Cfg, tmpUsersMap)) {
        for(var i= 0, len = tmpUsersMap["Users"].length; i< len; i++ ){
            if(loginUserName == tmpUsersMap["Users"][i]["Name"]){
                userMap = tmpUsersMap["Users"][i];
                break;
            }
        }
    }
    if(userMap["Level"] == 0){
        parent.userType = UserType.Administrator;
        userMap["UserName"] = loginUserName;
    }
    var jsonMap={};
        // 初始化控件
        video.initOcx();
        // 检测版本号；
        var flag = top.sdk_viewer.checkVersion();
    if (null === flag) {    // 未安装控件
        IsAutoStartVideo = false;
        if (isMac || top.is64Platform) {
            $("#video").contents().find("#ieVersion .activeXDiv").html($.lang.tip["tipInstallPlugin"]);
        } else {
            $("#video").contents().find("#ieVersion .downloadTip").html($.lang.pub["downloadTip3"] + " ");
        }
        $("#video").contents().find("#ieVersion").slideDown();
    } else {  // 控件初始化成功
        IsAutoStartVideo = ("1" == getCookie("isAutoStartVideo"));
        if (!flag) {  //不是最新控件，需要更新
            if (isMac || top.is64Platform) {
                $("#video").contents().find("#ieVersion .activeXDiv").html($.lang.tip["tipInstallPlugin"]);
            } else {
                $("#video").contents().find("#ieVersion .downloadTip").html($.lang.pub["downloadTip3"] + " ");
            }
            $("#video").contents().find("#ieVersion").slideDown();
        }
            //全屏放大初始化
            top.sdk_viewer.execFunctionReturnAll("NetSDKEnDblClkFull",1); //双击全屏使能接口，默认为0，1：双击可全屏

            //获取http鉴权类型
            LAPI_GetCfgData(LAPI_URL.HttpAuth, jsonMap);
            auzType = Number(jsonMap["Mode"]);
            if("https:" == document.location.protocol){
                 switch(auzType){
                     case 0:
                         auzType = 10;
                         break;
                     case 1:
                         auzType = 11;
                         break;
                     case 2:
                         auzType = 12;
                         break;
                 }
            }

            top.sdk_viewer.execFunctionReturnAll("NetSDKRegPostAuzEvent",LAPI_URL.Subscription,loginServerIp,Number(httpPort),8,loginUserName,loginUserPwd,auzType);
            // 设置控件不判断可信站点
            top.sdk_viewer.execFunctionReturnAll("NetSDKSetTrustSiteEnable", 0);
        }
    if (LoginType.WEB_LOGIN == loginType) {
        saveUserNameAndPassword();
    }
    getCapInfo();
    getEnhanceMode();
    parent.showedFlag = true;// 控件上报事件是否允许弹提示框,true为允许，false为不允许
    document.onkeydown = showVersion;

    if (top.banner.isSupportRecordPlayback) {
        $("#playback").removeClass("hidden");
    }

    if (top.banner.isSupportRealtimeStatus || top.banner.isSupportIvaPark) {
        getRealtimeStatusInfo();

        if (top.banner.isSupportPolarizer) {
            $("#polarizerID").removeClass("hidden");
        }
        if (top.banner.isSupportTrafficLight) {
            $("#trafficLightStatusID").removeClass("hidden");
        }
        if (top.banner.isSupportLED) {
            $("#ledStatusID").removeClass("hidden");
        }
        if (top.banner.isSupportNDFilter) {
            $("#NDFilterStatusID").removeClass("hidden");
        }
        if(top.banner.isSupportOpenDetect) {
            $("#openDetectID").removeClass("hidden");
        }
        if (top.banner.isSupportStorage) {
            $("#SDCardStatusID").removeClass("hidden");
        }
        if(top.banner.isSupportLEDCtrl) {
            $("#CarportLEDCtrlStatusID").removeClass("hidden");
        }
    }

    // TODO: 临时处理待修改
    if (!top.banner.isSupportCapture && top.banner.isSupportAlarm) {
        $("#alarmMenu").removeClass("hidden");
    }
    
    if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture || ("-1" != isContainsElement("0",top.banner.storTypeArr))) {
        $("#photo").removeClass("hidden");
    } else {
        $("#navigationLink").removeClass("hidden");
    }
    
    if (top.banner.isSupportHorizontalMenu) {
        $("#maintain").removeClass("hidden");
    }

    if (isSupportIVA) {
        // todo:待切换接口
        //getIVAType();
        getIVACommonType();
        updateCapInfo();
    }

    // 支持变倍对焦
    if (top.banner.isSupportLens || top.banner.isSupportABF) {
        video.$("#LENSDiv").removeClass("hidden");
        if (top.banner.isSupportLens) {
            //支持变倍对焦
            video.$("#focusBtns").removeClass("hidden");
            video.$("#becomeBtns").removeClass("hidden");
            
            // 支持光圈控制
            if (top.banner.isSupportIRIS) {
                video.$("#apertureBtns").removeClass("hidden");
            }
        }

        // 支持ABF
        if (top.banner.isSupportABF) {
            video.$("#autobackfocusBtns").removeClass("hidden");
        }
    }

    // 支持云台附加功能
    if (top.banner.isSupportPeripheralPTZ) {
        // 支持雨刷
        if (top.banner.isSupportInfrare) {
            video.$("#infrareBtns").removeClass("hidden");
        }
        // 支持加热
        if (top.banner.isSupportHeatup) {
            video.$("#heatupBtns").removeClass("hidden");
        }
        // 支持红外
        if (top.banner.isSupportRainbrush) {
            video.$("#rainbrushBtns").removeClass("hidden");
        }
        // 支持照明
        if (top.banner.isSupportIlluminate) {
            video.$("#illuminateBtns").removeClass("hidden");
        }
    }
    
    // 支持除雪
    if (top.banner.isSupportClearSnow) {
        video.getSweepSnowInfo();
        video.$("#clearsnowBtns").removeClass("hidden");
    }

    initMenu();
    if (UserType.Administrator != parent.userType) {    
        $("#playback").remove();
        $("#maintain").remove();
        
    }    

    $("#devType").text(titleDeviceType);

    initEvent();
    
    // check default password
    init();

     // 初始化语言标签 针对非IE浏览器保护
    initLang();
    strLimit();
}

function logout () {
    var top = GetTopWindow();
    var href = window.location.href;
    href = href.substring(0, href.indexOf(window.location.pathname));
    top.window.location = href + saveHerfParam();
}


function initEvent() {
    document.onkeydown = showVersion;
    $("#modifyPwd").bind("click", function(){
        openWin($.lang.pub["changePwdTitle"],"userinfo_edit.htm?type=1",500,300,false,"10%","10%",true);
    });
    $("#cancelBar").bind("click",  cancelBar);
    $("#live").bind("click", function(){nav_click("live");});
    $("#photo").bind("click",function(){nav_click("photo");});
    $("#playback").bind("click", function(){nav_click("playback");});
    $("#config").bind("click",function(){nav_click("config");});
    $("#maintain").bind("click",function(){nav_click("maintain");});
    $("#logout").bind("click",function(){
        if (!confirm($.lang.tip["tipCfmLogout"])) return;
        logout();
    });
    initMenuEvent();

    //iframe加载完毕触发的事件
    $("#mainIframe").bind("load", function(){
        top.status="";
    });
}
function cancelBar() {
    $("#confirmDiv").slideUp(0);
}

function initMaxPresetNum(){
    var presetMap = {};
    LAPI_GetCfgData(LAPI_URL.ExPtzSpecFunc, presetMap);
    if(1 == presetMap["Enabled"]){
        endPresetID = 255;
    }else{
        endPresetID = top.banner.PresetNum;
    }
}

window.onload = function() {
    beforeDataLoad();
    initPage();
    lisenceEvent();
    keepAlive();

    afterDataLoad();
};
