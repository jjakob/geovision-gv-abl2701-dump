// JavaScript Document
GlobalInvoke(window);
var isLoading = false;    // 是否在下载解码库
var wndID = 0;
//加载语言文件
if ("undefined" == typeof parent.parent.language) {
    var languageList = showLangList.replace(/\s/g, "").split(",");
    parent.parent.language = Number(getparastr("langinfo", parent.window.location.href));
    if (-1 != parent.parent.language) {
        if (0 > isContainsElement(parent.parent.language, languageList)) {
            parent.parent.language = languageList[0];
        }
    }
}
loadlanguageFile(parent.parent.language);
var statusMap = {
    isVideoOpen: false, // 实况流是否开启，默认为否
    bRecEnabled: false, // 是否启动本地实况录像
    streamID: 0           // 流ID
};

var statusList = [];
statusList[0] = objectClone(statusMap);//防止跳转页面出错，获取不到状态
var sdk_viewer = null;

var isVoiceTalkOpen = false; // 语音对讲是否开启,默认为否
var isInitPlayWnd = false; // 播放窗口是否实例化
var cur_scale = 0; // 实况大小：实际大小，满比例，按比例
var isFullScreen = false; // 是否全屏
var channelId = 0;
var isCaptureOpen = false; // 抓拍流是否开启，默认为否
var isMJpegOpen = false; // 照片流是否开启，默认为否
var isVoiceTalkOpen = false; // 语音对讲是否开启,默认为否
var isCapRecEnabled = false; // 是否启动本地抓拍录像
var isVoiceMute = true; // 是否音量静音
var isMicMute = false; // 是否麦克静音
var isLock = true; // 是否锁屏
var isAutoFocus = false; // 是否自动对焦
var isAreaFocus = false; //是否启动区域对焦
var isDigitalZoom = false; // 是否启动数字放大
var isManualSnap = false; // 是否启动手动取证
var ShowMsgTimeID = null; // 提示信息渐隐定时器
var isOpticsZoom = false;
var sweepSnowEnabled = false; /* 除雪是否开启 */
var fristTime = true; // 第一次进入该界面
var isControlOpen = false; /* 判断云台是否有操作 */
var isControlRun = false; /* 判断云台是否在转动 */
var curTurnVal = 0; /* 中心旋转按钮当前的状态码 */
var varRotateSpeed = 6; /* 转速 */
var speedSld = null; /* 转速滑动条 */
var isSlierMove = true; /* 是否滑动条下发参数 */
var isManualABFStart = false;       // 是否启用手动后焦功能
var isCircumgyrate90 = false; // 是否旋转90度
var StreamInfoList = [];
var isIVAStreamOpen = true;
var streamNum = top.banner.maxStreamNum;
var  streamInfoList = [ "Width", "Height", "FrameRate", "StreamID", "IsEnable", "EncodeFmt",
                        "BitRate", "GopType", "IInterval", "EncMode", "Quality", "SmoothValue"];

var videoWidth = 0; // 图像分辨率
var videoHeight = 0;

var frameWidth = 0; // 图像显示区域
var frameHeight = 0;

var videoPosStartX = 0; // 实际视频显示的位置
var videoPosStartY = 0;
var videoPosEndX = 0;
var videoPosEndY = 0;

var isShowPtz = false;
var isLiveReplay = true;
var isJPEGReplay = true;
var isSleepReplay = false;// 暂停自动建流
var ptzCmd = null;
var wheelTime;
var currentCmd;

// 检查版本号
function checkVersion() {
    var top = GetTopWindow();
    sdk_viewer = document.getElementById('recordManager_activeX');
    top.sdk_viewer = sdk_viewer;
    if ((LoginType.WEB_LOGIN == parent.loginType) && (false == check_version(sdk_viewer))) {
        // 版本检查失败，返回登录页面
        var msg = $.lang.tip["tipOcxCheckVerFail"];
        parent.pageLogout(msg);
        return false;
    }
    return true;
}

/**新控件消息上报各种事件入口
 * 分隔符“__”在初始化新控件时：prefix: '__'声明
 * 2,3,6等数字是和控件相对应的上报事件码
 * 上报事件触发流程为控件通过“NetSDKRUNINFO”上报入口（界面在plugin.js中进行了绑定）trigger对应事件上报对应参数
 * @type {{__2, __3, __6, __8, __106, __110, __111, __112, __113}}
 */
 EventMap = (function(){
    return {
        /*鼠标点击上报窗口信息*/
        __10: function(ButtonAct,Button,PtzInfo){//ptzInfo包含方向和转速
            dealGetWndId(Number(ButtonAct),Number(Button),PtzInfo);
        },
        /*本地录像过程中上报运行信息*/
        __3: function(port,pcParam){
            dealPlayerRecordVideo(port,pcParam);
        },
        /* 语音业务过程中上报运行信息 */
        __6: function(port,pcParam){
            dealPlayerMediaVioce(port,pcParam);
        },
        /* 视频解码过程中上报运行信息 */
        __8: function(port,errCode,winId){
            dealPlayerCodeProcess(port,Number(errCode),Number(winId));
        },
        /* 云台D定位鼠标up 事件 */
        __106: function(strParam){
            dealEvent3DPosition(strParam);
        },
        /* 实况异常事件 */
        __110: function(lReportType,stResourceCode){
            EventStatusReport(lReportType,stResourceCode);
        },
        /* 选中图形上报 */
        __111: function(type,num){
            dealEventSelDrawObj(Number(type),Number(num));
        },
        /* 坐标上报 */
        __112: function(type,num,strParam){
            dealEventDrawObjParam(Number(type),Number(num),strParam);
        },
        /* 区域聚焦上报*/
        __113: function(strParam){
            dealeventAreaFoucs(strParam);
        },
        /* 过车记录上报*/
        __115: function(xmlPararm,strParam){
            dealCarReport(xmlPararm,strParam);
        }
    };
})();

/**过车记录上报
 * 新控件过车记录上报流程：
 * 进入实况页面抓拍流通道开启，界面点击抓拍下发手动抓拍使能接口,设备侧抓拍图片，控件侧检测到图片上报
 * 参数1：xml格式的string，参数2：抓拍图片保存地址
 * @param strParam
 */
function dealCarReport(xmlPararm,strParam){
    if (parent.frames["mainIframe"].eventCarRecordReport) {
        parent.frames["mainIframe"].eventCarRecordReport(xmlPararm,strParam);
    }
}

/**区域聚焦上报
 * 新控件区域聚焦流程：
 * 界面启用区域聚焦下发控件区域聚焦使能接口,鼠标放实况可拉框聚焦，松开鼠标控件通过上报坐标
 * 界面收到上报，解析参数，将坐标等通过LAPI接口下发给设备侧
 * @param strParam
 */
function dealeventAreaFoucs(strParam){
    if (parent.frames["mainIframe"].eventAreaFoucs) {
        parent.frames["mainIframe"].eventAreaFoucs(strParam);
    }
}

//3D定位坐标上报,流程同上
function dealEvent3DPosition(strParam){
    if (parent.frames["mainIframe"].event3DPosition) {
        parent.frames["mainIframe"].event3DPosition(strParam);
    }
}

/*鼠标点击上报窗口信息*/
function dealGetWndId(ButtonAct,Button,PtzInfo){
    var recode,
        PtzPos,
        ptzSpeed;

    var arrPtzInfo = PtzInfo.split(",");
    PtzPos = Number(arrPtzInfo[0]);
    ptzSpeed = Number(arrPtzInfo[1]);
    /*获取当前选中的窗口ID*/
    recode = sdk_viewer.execFunctionReturnAll("NetSDKGetFocusWnd");
    wndID = parseInt(recode.result);
    if(parent.frames["mainIframe"].changeVideoBtnByVideoType && top.banner.isSupportFishEye) {
        parent.frames["mainIframe"].changeVideoBtnByVideoType(wndID);
    }

    if(top.banner.isSupportPTZ && 0 != PtzPos){  //数字放大开启或者区域聚焦开启或者云台使能关闭，上报的ptzPos为0
        if(PtzButtonAct.ButtonDown == ButtonAct){ //鼠标按下
            switch (PtzPos) {
                case 1: //左下
                    ptzCmd = PtzDerectMap.leftDown[0];
                    break;
                case 2://下
                    ptzCmd = PtzDerectMap.goDown[0];
                    break;
                case 3: //右下
                    ptzCmd = PtzDerectMap.rightDown[0];
                    break;
                case 4: //左
                    ptzCmd = PtzDerectMap.goLeft[0];
                    break;
                case 5:  //center
                    ptzCmd = null;
                    break;
                case 6:  //右
                    ptzCmd = PtzDerectMap.goRight[0];
                    break;
                case 7: //左上
                    ptzCmd = PtzDerectMap.leftUp[0];
                    break;
                case 8: //上
                    ptzCmd = PtzDerectMap.goUp[0];
                    break;
                case 9: //右上
                    ptzCmd = PtzDerectMap.rightUp[0];
                    break;
            }
        }else if(PtzButtonAct.ButtonUp == ButtonAct){//鼠标弹起
            if(null != ptzCmd){ //云台操作鼠标弹起才下发转动命令
                ptzCmd = 0x0902; //云台转动停止
            }
        }else{
            if(PtzButton.WheelZoomIn == Button){//滚轮数字变倍缩小
                ptzCmd = PtzLensMap.BecomeSub1[0];
            }else{//滚轮数字变倍放大
                ptzCmd = PtzLensMap.BecomeAdd1[0];
            }

            if(null != wheelTime){//如果不是第一次收到变倍消息
                if(ptzCmd == currentCmd){ //400ms内再次收到同上一次变倍类型相同的，则清空定时器重新起定时器
                    clearTimeout(wheelTime);
                    wheelTime = setTimeout("wheelReset()", 400);
                    return;
                }else{//若400ms内再次收到同上一次变倍不同类型的则立马清空定时器和下发上次变倍类型的停止位，并重新针对当前变倍起新的定时器
                    clearTimeout(wheelTime);
                    submitCtrolCmd(currentCmd-1, varRotateSpeed, varRotateSpeed);//马上下发前一次已变倍的停止位，保证变倍开始和停止都是成对的
                    wheelTime = setTimeout("wheelReset()", 400);
                }

            }else{//第一次收到变倍消息
                wheelTime = setTimeout("wheelReset()", 400);//该事件处理是因为滚轮进行变倍时无法确定什么时候停止，不进行自动停止会产生的现象是一直变倍
            }
        }
        if(null != ptzCmd && "undefined" != ptzCmd && 0 != PtzPos ){//PtzPos等于0的时候代表与云台无关
            submitCtrolCmd(ptzCmd, ptzSpeed, ptzSpeed);
            currentCmd = ptzCmd;  //记录当前已下发过的变倍类型
        }
    }

}

//滚轮事件定时器，超过400ms没有新的滚轮事件上报则停止变倍
function wheelReset(){
    if(PtzLensMap.BecomeSub1[0] == ptzCmd ||  PtzLensMap.BecomeAdd1[0] == ptzCmd){
        submitCtrolCmd(ptzCmd-1, varRotateSpeed, varRotateSpeed);
        clearTimeout(wheelTime);
        wheelTime = null;   //下发停止后将定时器清空
        currentCmd = null;
    }
}

/* 视频解码过程中上报运行信息 */
function dealPlayerCodeProcess(winId,errCode){  // ErrCode：上报的错误码 winId:窗口号
    winId = Number(winId);
    if(2 == winId && (top.banner.isSupportCapture || top.banner.isSupportIpcCapture)){
        isCaptureOpen = false;
        var retcode = sdk_viewer.execFunctionReturnAll("NetSDKStopPlay", 2);
        if (ResultCode.RESULT_CODE_SUCCEED == retcode.code) {
            sdk_viewer.execFunctionReturnAll("NetSDKCloseStream", 2);
            sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 2);
            sdk_viewer.execFunctionReturnAll("NetSDKStopPlayLocalJPG",1);//退出时关闭窗口1的播放
            sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 1);
        }
        setTimeout("parent.autoStartStream("  + (top.banner.maxStreamNum + 1) + "," + winId + ")", 3000);

    }else{
        if (parent.frames["mainIframe"].stopVideoBack_click) {   //回放界面
            parent.frames["mainIframe"].stopVideoBack_click();
        } else {
            parent.$("#videoDiv").addClass("waiting");
            if (parent.frames["mainIframe"].startstopVideo) { // 首页
                parent.frames["mainIframe"].$("#blockDiv").css("display", "block");
            }
            stopVideo(StreamType.LIVE, winId);
            setTimeout("parent.autoStartStream("  + statusList[winId]["streamID"] + "," + winId + ")", 3000);
        }
    }

}

/* 语音业务过程中上报运行信息 */
function dealPlayerMediaVioce(port,pcParam){
    var errorMsg = $.lang.tip["tipUnknownErr"];
    pcParam = parseInt(pcParam);
    switch (pcParam) {
        case XPErrorResult.AUDIO_DEVICE_UNRIPE:// 音频设备未准备好
            errorMsg = $.lang.tip["tipTalkStopAudioDevNotReady"];
            break;
        case XPErrorResult.VOICE_RUNNING_ERROR: // 语音对讲运行过程中出现错误
            errorMsg = $.lang.tip["tipTalkStopAudioDevNotReady"];
            break;
        default:
            break;
    }

    // 停止语音对讲
    if (parent.frames["mainIframe"].startstopTalk) {
        parent.frames["mainIframe"].startstopTalk();
    }
    eventAlert(errorMsg);
}

/*本地录像过程中上报运行信息*/
function dealPlayerRecordVideo(port,pcParam){
    var errorMsg = $.lang.tip["tipUnknownErr"];
    pcParam = parseInt(pcParam);
    switch (pcParam) {
        case XPErrorResult.RECORDSTATE_MANUAL:// 手动停止
        case XPErrorResult.RECORD_FINISHED:// 录像结束
            return;
        case XPErrorResult.RECORDSTATE_SUBSECTION: // 按规则分割
            // 这两种信息不处理
            return;
        case XPErrorResult.RECORDSTATE_CAPACITYLIMIT:// 容量达到上限
            errorMsg = $.lang.tip["tipTotalCapReached"];
            break;
        case XPErrorResult.DISK_CAPACITY_WARN:// 硬盘剩余空间低于阈值
            errorMsg = $.lang.tip["tipDiskSpaceUnderThreshold"];
            break;
        case XPErrorResult.DISK_CAPACITY_NOT_ENOUGH:// 硬盘剩余空间不足
            errorMsg = $.lang.tip["tipDiskSpaceNoEnouch"];
            break;
        case XPErrorResult.WRITE_FILE_FAILED:// 写文件操作失败
            errorMsg = $.lang.tip["tipWriteFileErr"];
            break;
        case XPErrorResult.PROCESS_MEDIA_DATA_FAILED:// 媒体数据处理失败
            errorMsg = $.lang.tip["tipMediaDataErr"];
            break;
        case XPErrorResult.NOT_SUPPORT_MEDIA_ENCODE_TYPE:// 媒体编码格式不支持录像操作
            errorMsg = $.lang.tip["tipNotSupportMediaEncode"];
            break;
        case XPErrorResult.MEDIA_RESOLUTION_CHANGE:// 媒体流分辨率发生变化
            errorMsg = $.lang.tip["tipMediaResolutionChange"];
            break;
        default:
            break;
    }
    if (XPErrorResult.DISK_CAPACITY_WARN != pcParam) {// 停止录像
        if (parent.frames["mainIframe"].startStopRecord) {
            parent.frames["mainIframe"].startStopRecord();
        }
    }
    eventAlert(errorMsg);
}

function EventStatusReport(lReportType,stResourceCode){
    var pcParam,ResourceCode,ptzStatusMap = {},userName;
    ResourceCode = $.parseJSON(stResourceCode);
    switch (lReportType) {
        case MacReportType.REPORT_UPDATE:// 升级
            pcParam = ResourceCode["StatusInfo"]["UpdateResult"];
            parent.showUpdateResult(pcParam);
            break;
        case  MacReportType.REPORT_NETWORK_CONFIG:// 网口配置结果上报
            pcParam = ResourceCode["StatusInfo"]["IPChangeStatus"];
            if (parent.frames["mainIframe"].onNetworkCfgResult) {
                parent.frames["mainIframe"].onNetworkCfgResult(pcParam);
            }
            break;
        case  MacReportType.STOR_MEMORY_CARD_FORMAT:// SD卡格式化上报
        {
            pcParam = ResourceCode["StatusInfo"]["MemoryFormatResult"];
            if (parent.frames["mainIframe"].eventMemoryCardFormat) {
                parent.frames["mainIframe"].eventMemoryCardFormat(pcParam);
            }
            break;
        }
        case  MacReportType.UPNP_PORT_MAP_INFO: //UPNP状态上报
        {
            if(parent.frames["mainIframe"].eventUPNPStatus)
            {
                parent.frames["mainIframe"].eventUPNPStatus();
            }
            break;
        }
        case MacReportType.VM_SERVER_ONLINE:// vm连接状态
        {
            pcParam = ResourceCode["StatusInfo"]["VMServerOnline"];
            parent.eventStatusReport("VmRegStatus", pcParam);
            break;
        }
        case MacReportType.PHOTO_SERVER_ONLINE:// 照片服务器连接状态
        {
            pcParam = ResourceCode["StatusInfo"]["PhotoServerOnline"];
            parent.eventStatusReport("TmsRegStatus", pcParam);
            break;
        }
        case MacReportType.PTZ_STATUS:// 云台状态上报
        {
            //pcParam = ResourceCode["StatusInfo"]["PTZStatus"];
            ptzStatusMap["PTZStatus"] = {};
            ptzStatusMap["PTZStatus"]["Status"] = ResourceCode["StatusInfo"]["PTZStatus"]["Status"];
            ptzStatusMap["PTZStatus"]["Param1"] = ResourceCode["StatusInfo"]["PTZStatus"]["Param1"];
            if (parent.frames["mainIframe"].onCruiseStatus) {
                parent.frames["mainIframe"].onCruiseStatus(ptzStatusMap);
            }
            break;
        }
        case MacReportType.SCENE_CURRENT:// 场景切换上报
        {
            pcParam = ResourceCode["StatusInfo"]["SceneCurrent"];
            if (parent.frames["mainIframe"].eventSwitchScene) {
                parent.frames["mainIframe"].eventSwitchScene(pcParam);
            }
            break;
        }
        case MacReportType.SD_STATUS:// SD卡状态
        {
            pcParam = ResourceCode["StatusInfo"]["SDStatus"];
            parent.eventStatusReport("SDStatus", pcParam);
            break;
        }
        case MacReportType.DDNS_DOMAIN_CHECK_RESULT: //< DDNS域名检测完成 对应参数类型: BOOT_T: 改变:1  不改变:0 */
        {
            pcParam = ResourceCode["StatusInfo"]["DDNSDomainTestResult"];
            if (parent.frames["mainIframe"].eventDomainCheck) {
                parent.frames["mainIframe"].eventDomainCheck(pcParam);
            }
            break;
        }
        case MacReportType.REPORT_USERINFOCHANGED:// 用户信息已被修改
        {
            userName = ResourceCode["StatusInfo"]["QuitUserInfo"]["QuitUser"];
            if(userName == top.loginUserName){
                top.showedFlag = true;
                eventAlert( {
                    isReboot : true,
                    msg : $.lang.tip["tipUserInfoChanged"]
                });
                break;
            }
        }
    }
}

// 初始化控件
function initOcx() {
    var top = GetTopWindow(),PortMap = {},CurrentPasswdMap = {};
    var arr = parent.loginServerIp.split(":");
    var flag = true,
        clsid,
        isUN = true,
        application,
        pluginVersion;
    if ( 1 < arr.length) {
        parent.loginServerIp = arr[0];
        parent.httpPort = arr[1];
    }
    if ("localhost" == parent.loginServerIp) {
        parent.loginServerIp = "127.0.0.1";
    }
    if (("undefined" != typeof showProductType) && (1 == showProductType)) {
        isUN = false;
    }

    /**
     * 新控件NAPI加载是通过application区分宇视和白牌
     * IE中宇视和白牌通过clsid进行区分
     */
    if(top.banner.isMac){
        application = "netsdkplayer-plugin";
        pluginVersion = "1.2.0.3";
    }else{
        if (true == isUN) {
            clsid = "B91BB9EA-9CDF-4917-9037-27CE4DEF0D8A";
            application = "netsdkplayer-plugin-un";
            pluginVersion = "0.2.1.6";
            if(top.is64Platform) {
                pluginVersion = "1.2.0.2";
            }
        }
        else {
            clsid = "0F1A61E3-9097-4550-AC8C-3EA1D34690C9";
            application = "netsdkplayer-plugin-nb";
            pluginVersion = "0.2.1.6";
            if(top.is64Platform) {
                pluginVersion = "1.2.0.2";
            }
        }
    }

        sdk_viewer = new Player({
            application: application,
            eventname: 'plgnevent',
            clsid: clsid,
            id: 'player',
            version:pluginVersion,
            container: 'activeX_obj',
            name: 'sdk_viewer',
            szDeviceIp: parent.loginServerIp,
            events:EventMap,
            /**
             * 事件前缀，由于控件目前所有的事件上报都是一个，同时使用第一个参数作为事件类型，而此参数为数字
             * 使用数字作为自定义事件名来监听和触发目前看来无法实现，故将事件加上一个前缀
             * @type {String}
             */
            prefix: '__',
            maxWnd: 6
        });
        top.sdk_viewer = sdk_viewer;
         //临时密码登录判断
         var loginUserName = parent.loginUserName;
         var loginUserPwd = parent.loginUserPwd;
         var name = hex_md5(loginUserName);
         var passwd = hex_md5(loginUserPwd);
         LAPI_GetCfgData(LAPI_URL.CurrentPasswordInfo,CurrentPasswdMap, "UserName=" + name + "&Password="+passwd);
         if(CurrentPasswdMap["IsTempPassword"]){
             top.IsTempCert =1;
         }

    /**
     * 鼠标移到实况处，用于激活窗口
     * 新控件滚轮滚动事件需在聚焦激活窗口的情况下触发，点击实况其他区域就会失去焦点导致不能滚动
     * 故采用鼠标移到实况处调用激活窗口函数
     */
     $("#activeX_obj").mouseenter(function() {
        if(sdk_viewer.isInstalled){
            sdk_viewer.execFunctionReturnAll("NetSDKActiveWnd");
        }
    });
    return;

}



// 开启实况
function startVideo(streamID, bshowTip, wndID,ptzFlag,isLive) {
    var top = GetTopWindow(),
        _streamID = ("undefined" == typeof streamID) ? 0 : Number(streamID),
        _bshowTip = ("undefined" == typeof bshowTip) ? true : bshowTip,
        _wndID = ("undefined" == typeof wndID) ? 0 : wndID,
        isStreamOpen = statusList[_wndID]["isVideoOpen"],
        retcode,
        jsonMap = {},
        url,
        tempUrl,
        macStreamId,
        drawParam,
        drawParamMap,
        drawFlag,
        VideoTransProto,
        index,
        rtspurl;
    if("undefined" == typeof ptzFlag){
        ptzFlag = 0;
    }
    if(LoginType.VM_LOGIN == parent.loginType){
        parent.IsAutoStartVideo = true;
    }
    if (!parent.IsAutoStartVideo  || isStreamOpen)
        return true;

    // 获取url，拼接启流接口参数URL，区分主辅流
    if(!LAPI_GetCfgData(LAPI_URL.LivingStream,jsonMap,"",false)){
        return false;
    }
    url= jsonMap["Data"].split("//");
    rtspurl = url[1].split(":");
    if("localhost" == rtspurl[0]){
        rtspurl[0] = top.banner.loginServerIp;
    }
    if(0 != top.banner.rtspPort){
        index = rtspurl[1].indexOf("/");
        if(-1 != index){
            rtspurl[1] = rtspurl[1].substring(index);
            rtspurl[1] = top.banner.rtspPort + rtspurl[1];
        }
    }
    url=url[0]+"//"+top.banner.loginUserName+":"+top.banner.loginUserPwd+"@" + rtspurl[0] + ":" + rtspurl[1];
    url = url.replace("video1", "video" + (_streamID + 1));//软件获取字符串主码流，辅码流，第三流对应video1,video2,video3,但是界面流ID对应0,1,2,故加1处理
    //statusList[_wndID]["url"] = url;

    // 初始化资源
    sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort", _wndID);
    //实况消息内置使能
    sdk_viewer.execFunctionReturnAll("NetSDKEnShowVideoInfo",isLive);
    drawParam = sdk_viewer.execFunctionReturnAll("NetSDKGetConfig");//获取本地配置页面参数
    drawParamMap = $.parseJSON(drawParam.result);
    VideoTransProto = drawParamMap["VideoTransProto"];//媒体流协议类型,启流接口中需要用到协议类型

    /** 启流
     *参数：
     * 通道号
     * URL ：从livingStream获取媒体流协议的url区分主辅流
     * 协议类型:通过本地配置页面接口的媒体流协议确定协议类型
     * 开始时间
     * 结束时间
     * 播放类型（0：实况，1：回放）
     */
    retcode = sdk_viewer.execFunctionReturnAll("NetSDKOpenIPCNetStream",_wndID,url,VideoTransProto,0,0,0);
    retcode = retcode.code;
    if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
        // 播放
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKStartPlay", _wndID);
        retcode = retcode.code;

        //实况云台箭头显示
        sdk_viewer.execFunctionReturnAll("NetSDKPtzCtrl",0,ptzFlag);
        if(!isVoiceTalkOpen){
            sdk_viewer.execFunctionReturnAll("NetSDKOpenSound",0,0);//实况声音开启需要OpenSound接口
            //设置音量
            if(undefined == top.pcVolume){
                top.pcVolume = 255;
            }
            sdk_viewer.execFunctionReturnAll("NetSDKSetVolume",0,top.pcVolume);
            if(!isVoiceMute && isLive){ //只有实况才有声音，切换到配置页面无声音
                sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",0,0);
            }else{
                sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",0,1);
            }
        }
        //用于激活窗口，实现鼠标放置在实况处滚轮就可滚动变倍，若没有激活控件将无法触发滚轮事件
        sdk_viewer.execFunctionReturnAll("NetSDKActiveWnd");

        /**
         * 元数据画图，控件实况界面是否显示检测框，检测线等
         *1111分别代表：目标框轨迹；未触发规则结果框标志；触发规则结果框标志；规则线框标志
         * 本地配置的智能标记为未触发规则结果框标志故控制二进制的第二位，其他位默认都为1
         */
        if(0 == drawParamMap["UntriggeredTarget"]){//智能标记参数
            drawFlag = 11; //不启用智能标记 1011
        }else{
            drawFlag = 15; //启用智能标记1111
        }
        sdk_viewer.execFunctionReturnAll("NetSDKEnableIvaDraw",0,1,drawFlag);
    } else {
        sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", _wndID);
    }

    if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
        isStreamOpen = true;
        statusList[_wndID]["isVideoOpen"] = isStreamOpen;
    } else {
        if (_bshowTip) {
            if (XPErrorResult.VIDEO_STREAM_FULL == retcode) {
                top.banner.showMsg(false, $.lang.tip['tipVideoFull']);
            } else {
                top.banner.showMsg(false, $.lang.tip['tipStartVideoFailed']);
            }
        }
    }

    // todo：待确认
    if(top.banner.isSupportAudio){
        videoChannel(0);
    }
    return isStreamOpen;
}

function startJpeg(){
    var url,
        jsonMap = {},
        retcode,
        flag;

    // 开启抓拍流
    retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort", 2);
    flag = (retcode.code == ResultCode.RESULT_CODE_SUCCEED);
    if (flag) {
        //抓拍窗口
        flag = LAPI_GetCfgData(LAPI_URL.LivingStream,jsonMap,"",false);
        if (flag) {
            url= jsonMap["Data"].split("//");
            url=url[0]+"//"+top.banner.loginUserName+":"+top.banner.loginUserPwd+"@"+url[1];
            url = url.replace("video1", "video" + (top.banner.maxStreamNum + 1));
            retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKOpenIPCNetStream",2,url,2,0,0,0);//参数：窗口号；URL；TCP＋Uniview1 报文模式；开始时间；结束时间；播放类型
            flag = (retcode.code == ResultCode.RESULT_CODE_SUCCEED);
            if (flag) {
                retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKStartPlay", 2); //开启抓拍窗口流
                flag = (retcode.code == ResultCode.RESULT_CODE_SUCCEED);
                if (!flag) {
                    sdk_viewer.execFunctionReturnAll("NetSDKCloseStream", 2);
                    sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 2);
                }
            } else {
                top.sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 2);
            }
        }
    } else {
        top.sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 2);
    }

    // 开启车牌小图流
    if (flag) {
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort", 1);//车牌彩色小图窗口
        flag = (retcode.code == ResultCode.RESULT_CODE_SUCCEED);
        if (flag) {
            retcode = sdk_viewer.execFunctionReturnAll("NetSDKStartPlayLocalJPG", 1); //彩色小图流开启
            flag = (retcode.code == ResultCode.RESULT_CODE_SUCCEED);
            if (!flag) {
                sdk_viewer.execFunctionReturnAll("NetSDKStopPlayLocalJPG",1);//退出时关闭窗口1的播放
                sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 1);
                sdk_viewer.execFunctionReturnAll("NetSDKStopPlay", 2);
                sdk_viewer.execFunctionReturnAll("NetSDKCloseStream", 2);
                sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 2);
            }
        } else {
            sdk_viewer.execFunctionReturnAll("NetSDKStopPlay", 2);
            sdk_viewer.execFunctionReturnAll("NetSDKCloseStream", 2);
            sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 2);
            sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 1);
        }
    }
    isCaptureOpen = flag;
    return isCaptureOpen;
}

//语音通道
function videoChannel(StreamType){
    var AudioMap = {},
        channel,
        AudioEnable;
    if (LAPI_GetCfgData(LAPI_URL.AudioIn, AudioMap)) {
        if (AudioMap["Type"] == 1) {
            channel = "Channel=0";
        } else {
            AudioEnable = AudioMap["AudioInputs"][0]["Enabled"];
            if (1 == top.banner.AudioInNum) {
                if (1 == AudioEnable) {
                    channel = "Channel=0";
                } else {
                    channel = "Channel=2";
                }
            } else if (2 == top.banner.AudioInNum) {
                if (1 == AudioEnable) {
                    channel = "Channel=0";
                } else if ((0 == AudioEnable) && (0 == AudioMap["AudioInputs"][1]["Enabled"])) {
                    channel = "Channel=2";
                } else {
                    channel = "Channel=1";
                }
            }
        }
        sdk_viewer.execFunctionReturnAll("NetSDKSetSoundChannel", 0, channel);
    }
}

// 停止实况
function stopVideo(streamType, wndID) {
    var _wndID = ("undefined" == typeof wndID) ? 0 : wndID,
        isStreamOpen = statusList[_wndID]["isVideoOpen"], 
        retcode;

    if ((StreamType.PICTRUE == streamType) || (StreamType.IMAGE_TYPE_PLATE == streamType)) {
        isStreamOpen = isCaptureOpen;
    }

    if (!isStreamOpen)
        return;// 已停止

    if ((StreamType.PICTRUE == streamType) || (StreamType.IMAGE_TYPE_PLATE == streamType)) {
        // 停止自动保存
        if (isCapRecEnabled)
            autoSaveGrabImg();
    } else if (StreamType.LIVE == streamType) {
        // 停止录像
        if (statusList[_wndID]["bRecEnabled"])
            stopStorage(_wndID);

        // 停止数字放大
        if (isDigitalZoom)
            setDigitalZoom();
        //停止3D定位功能
        if (isOpticsZoom)
            setOpticsZoom();
        
        if (isManualSnap)
            setManualSnap();

        //停止区域聚焦
        if(isAreaFocus){
            setAreaFocus();
        }
    }

    retcode = sdk_viewer.execFunctionReturnAll("NetSDKStopPlay", _wndID);
    retcode = retcode.code;
    if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
        sdk_viewer.execFunctionReturnAll("NetSDKCloseSound",0,0);
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKCloseStream", _wndID);
        retcode = retcode.code;
    }

    if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", _wndID);
        retcode = retcode.code;
    }
    isStreamOpen = !(ResultCode.RESULT_CODE_SUCCEED == retcode);

    if ((StreamType.PICTRUE == streamType) || (StreamType.IMAGE_TYPE_PLATE == streamType)) {
        isCaptureOpen = isStreamOpen;
    } else {
        statusList[_wndID]["isVideoOpen"] = isStreamOpen;
    }

    if (isStreamOpen) {
        top.banner.showMsg(false, $.lang.tip["tipStopVideoFailed"]);
    }
}

// 语音对讲开启
function startVoiceTalk() {
    var retcode,
        resourceID,
        url,
        rtspurl,
        index,
        jsonMap = {};

    if (isVoiceTalkOpen)
        return;

    sdk_viewer.execFunctionReturnAll("NetSDKCloseSound",0,0); //语音对讲开启则实况声音关闭
    sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort",160);//语音对讲的通道号为160，实况的是0
    sdk_viewer.execFunctionReturnAll("NetSDKOpenSound",160,0);
    //设置音量
    sdk_viewer.execFunctionReturnAll("NetSDKSetVolume",160,top.pcVolume);
    if(!isVoiceMute){
        sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",160,0);
    }else{
        sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",160,1);
    }

    
    LAPI_GetCfgData(LAPI_URL.LivingStream,jsonMap);
    url= jsonMap["Data"].split("//");
    rtspurl = url[1].split(":");
    if("localhost" == rtspurl[0]){
        rtspurl[0] = top.banner.loginServerIp;
    }
    if(0 != top.banner.rtspPort){
        index = rtspurl[1].indexOf("/");
        if(-1 != index){
            rtspurl[1] = rtspurl[1].substring(index);
            rtspurl[1] = top.banner.rtspPort + rtspurl[1];
        }
    }
    url=url[0]+"//"+top.banner.loginUserName+":"+top.banner.loginUserPwd+"@" + rtspurl[0] + ":" + rtspurl[1];
    retcode = sdk_viewer.execFunctionReturnAll("NetSDKOpenVoiceSvcEx",160,url,1,3);
    retcode = retcode.code;

    isVoiceTalkOpen = (ResultCode.RESULT_CODE_SUCCEED == retcode);
    
    if(!isMicMute){
        sdk_viewer.execFunctionReturnAll("NetSDKSetMicVolume",160,top.pcMicVolume);
    }

    if (!isVoiceTalkOpen) {
        var msg = $.lang.tip["tipUnableOpenVoiceTalk"];
        if (XPErrorResult.AUDIO_DEVICE_UNRIPE == retcode) {
            msg = $.lang.tip["tipStartFailAudioDevNotReady"];
        }
        top.banner.showMsg(false, msg);
    }else{
        isVoiceTalkOpen = true;
    }
    videoChannel(1);
}

// 语音对讲关闭
function stopVoiceTalk() {
    var retcode;

    if (!isVoiceTalkOpen)
        return;
    retcode = sdk_viewer.execFunctionReturnAll("NetSDKCloseVoiceSvcEx",160);
    //sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort",0);
    retcode = retcode.code;
    for(var i = 0; i < statusList.length; i++) {
        if(statusList[i]["isVideoOpen"]){
            sdk_viewer.execFunctionReturnAll("NetSDKOpenSound",0,0);
            //设置音量
            sdk_viewer.execFunctionReturnAll("NetSDKSetVolume",0,top.pcVolume);
            if(!isVoiceMute){
                sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",0,0);
            }else{
                sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",0,1);
            }
            break;
        }
    }

    isVoiceTalkOpen = !(ResultCode.RESULT_CODE_SUCCEED == retcode);
    if (isVoiceTalkOpen) {
        top.banner.showMsg(false, $.lang.tip["tipUnableCloseVoiceTalk"]);
    }else{
        isVoiceTalkOpen = false;
    }
}

/**
 * 开始录像
 * 录像保存默认路径在本地配置页面，录像具体地址界面拼接：Record-IP地址-时间-文件名
 * @param wndID
 */
function startStorage(wndID) {
    var _wndID = ("undefined" == typeof wndID) ? 0 : wndID,
        retcode,
        time,
        fileName,
        timeFlag;

    if (statusList[_wndID]["bRecEnabled"])
        return;

    var jsonMap = sdk_viewer.execFunctionReturnAll("NetSDKGetDefaultPath"); //获取文件保存路径
    if(ResultCode.RESULT_CODE_SUCCEED == jsonMap.code){
        var e = new Date,
            year = e.getFullYear().toString(),
            month = (e.getMonth() + 1).toString(),
            date = e.getDate().toString(),
            hour = +e.getHours().toString(),
            minutes = e.getMinutes().toString(),
            seconds = e.getSeconds().toString();

        time = formatNewTime(year,month,date,hour,minutes,seconds);
        timeFlag = formatDate(year,month,date);
        if(checkNavigator("safari")){
            fileName = jsonMap.result+"Record"+"/"+ parent.loginServerIp +"/" + timeFlag +"/" + time;
        }else{
            fileName = jsonMap.result+"Record"+"\\"+ parent.loginServerIp +"\\" + timeFlag +"\\" +time;
        }
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKStartRecord", _wndID, fileName,1);
        retcode = retcode.code;
    } else {
        retcode = jsonMap.code;
    }
    statusList[_wndID]["bRecEnabled"] = (ResultCode.RESULT_CODE_SUCCEED == retcode);
    if (!statusList[_wndID]["bRecEnabled"]) {
        if (XPErrorResult.DISK_CAPACITY_NOT_ENOUGH == retcode) {
            top.banner.showMsg(false, $.lang.tip["tipDiskSpaceNotEnoughStorage"]);
        } else if (XPErrorResult.CREATE_DIR_FAIL == retcode) {
            top.banner.showMsg(false, $.lang.tip["tipCreateDirFailStorage"]);
        } else if (XPErrorResult.DIR_TOO_LONG == retcode) {
            top.banner.showMsg(false, $.lang.tip["tipDirTooLongStorage"]);
        } else if (XPErrorResult.RECORDSTATE_CAPACITYLIMIT == retcode) {
            top.banner.showMsg(false, $.lang.tip["tipRecordCapacityLimitStorage"]);
        } else {
            top.banner.showMsg(false, $.lang.tip["tipUnableStartPlayer"]);
        }
    }
    LAPI_SetCfgData(LAPI_URL.KeyFrame, {"StreamID":statusList[_wndID]["streamID"]}, false);
}

// 停止录像
function stopStorage(wndID) {
    var _wndID = ("undefined" == typeof wndID) ? 0 : wndID,
        msg = $.lang.tip["tipStopStorageSuccess"],
        retcode;
    
    if (!statusList[_wndID]["bRecEnabled"])
        return;

    retcode = sdk_viewer.execFunctionReturnAll("NetSDKStopRecord", _wndID);
    retcode = retcode.code;
    statusList[_wndID]["bRecEnabled"] = !(ResultCode.RESULT_CODE_SUCCEED == retcode);
    if (statusList[_wndID]["bRecEnabled"]) {
        msg = $.lang.tip["tipUnableStopPlayer"];
    }
    top.banner.showMsg(!statusList[_wndID]["bRecEnabled"], msg);
}

// 设置音量大小，num音量值：0-255
function setAdjustVolume(num) {
    var flag = true,
        retcode,
        voiceChannal;
    if(sdk_viewer.isInstalled){
        //sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort", 0);
        if (isVoiceTalkOpen) {
            voiceChannal = 160;
        } else {
            voiceChannal = 0;
        }
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKSetVolume",voiceChannal,num);
        retcode = retcode.code;
        if (ResultCode.RESULT_CODE_SUCCEED != retcode) {
            top.banner.showMsg(false, $.lang.tip["tipSetAdjustVolumeFail"]);
            flag = false;
        }
    }
    return flag;
}

// 开启/关闭 禁音 status：0不禁音，1禁音
function setSilenceStatus(status) {
    var retcode,
        voiceChannal;

    if(sdk_viewer.isInstalled){
        if(isVoiceTalkOpen){
            voiceChannal = 160;
            retcode = sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",voiceChannal,status);
            /*if(1 == status){
                retcode = sdk_viewer.execFunctionReturnAll("NetSDKCloseSound",voiceChannal,0);
            }else{
                retcode = sdk_viewer.execFunctionReturnAll("NetSDKOpenSound",voiceChannal,0);
            }*/
        }else{
            //sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort",0);
            voiceChannal = 0;
            retcode = sdk_viewer.execFunctionReturnAll("NetSDKSetQuietStatus",voiceChannal,status);
            /*if(1 == status){
                retcode = sdk_viewer.execFunctionReturnAll("NetSDKCloseSound",0,status);
            }else{
                retcode = sdk_viewer.execFunctionReturnAll("NetSDKOpenSound",0,status);
            }*/
        }

        retcode = retcode.code;
        var bRet = (ResultCode.RESULT_CODE_SUCCEED == retcode);
        if (bRet) {
            isVoiceMute = (1 == status);
        } else {
            var msg = isVoiceMute ? $.lang.tip["tipAdjustNotSilenceFail"] : $.lang.tip["tipAdjustSilenceFail"];
            top.banner.showMsg(false, msg)
        }
    }
}

// 设置麦克风音量大小，num音量值：0~255
// flag:标志是否设置关闭/启用麦克风
function setMicVolume(num, flag) {
    var retcode;
    retcode = sdk_viewer.execFunctionReturnAll("NetSDKSetMicVolume",160,num);
    retcode = retcode.code;
    var bRet = (ResultCode.RESULT_CODE_SUCCEED == retcode);
    if (bRet) {
        isMicMute = flag ? !isMicMute : false;
    } else {
        top.banner.showMsg(false, $.lang.tip["tipSetMicFail"]);
    }
    //麦克风静音与否
    sdk_viewer.execFunctionReturnAll("NetSDKSendVoiceData",160,isMicMute);

    return bRet;
}

// 设置区域聚焦使能
function setAreaFocus() {
    var isEnable;
    isAreaFocus = !isAreaFocus;
    if(true == isAreaFocus){
        isEnable = 1;
    }else{
        isEnable = 0;
    }
    sdk_viewer.execFunctionReturnAll("NetSDKEnAreaFocus",0,isEnable);
}

// 设置数字放大
function setDigitalZoom() {
    var isEnable;
    isDigitalZoom = !isDigitalZoom;
    if(true == isDigitalZoom){
        isEnable = 1;
    }else{
        isEnable = 0;
    }
    sdk_viewer.execFunctionReturnAll("NetSDKDigitalZoom",0,isEnable);
}

//设置手动取证
function setManualSnap() {
    isManualSnap= !isManualSnap;
    top.sdk_viewer.ViewerAxSetConfig(DEFAULT_CHANNEL_ID, CMD_TYPE.CMD_MANUAL_SNAP, "");
}

//设置3D定位功能
function setOpticsZoom() {
    var isEnable;
    isOpticsZoom = !isOpticsZoom;

    if (true == isOpticsZoom) {
        isEnable = 1;
    } else {
        isEnable = 0;
    }
    sdk_viewer.execFunctionReturnAll("NetSDKDraw3DPosition", 0, isEnable);
}

// 抓拍流录像
function autoSaveGrabImg() {
    var bool = isCapRecEnabled ? 0 : 1;
    var retcode = sdk_viewer.ViewerAxAutoSaveGrabImg(bool);
    var bRet = (ResultCode.RESULT_CODE_SUCCEED == retcode);
    if (bRet) {
        isCapRecEnabled = !isCapRecEnabled;
    } else {
        var msg = isCapRecEnabled ? $.lang.tip["tipStopAutoSaveFail"] : $.lang.tip["tipStartAutoSaveFail"];
        top.banner.showMsg(false, msg);
    }
}

// 自动对焦
function autoFocus() {
    var bool = isAutoFocus ? 0 : 1;
    var retcode = sdk_viewer.ViewerAxAutoFocus(bool);
    var bRet = (ResultCode.RESULT_CODE_SUCCEED == retcode);
    if (bRet) {
        isAutoFocus = !isAutoFocus;
    } else {
        var msg = isAutoFocus ? $.lang.tip["tipStopAutoFocusFail"] : $.lang.tip["tipStartAutoFocusFail"];
        top.banner.showMsg(false, msg);
    }
}

// 抓拍
function grabImg() {

    var retcode = LAPI_SetCfgData(LAPI_URL.CAPTURE_FORMAL,{},false);

    if (!retcode) {
        top.banner.showMsg(false, $.lang.tip["tipGrabImgFail"]);
    }
}
// 抓拍调试接口
function grabDebugImg() {
    if(top.banner.isOldPlugin && !top.banner.isMac){
        top.sdk_viewer.ViewerAxGrabDebugImg();
    }else if(top.sdk_viewer.isInstalled) {
        LAPI_SetCfgData(LAPI_URL.CAPTURE_DEBUG,{},false);
    }
}

/**
 * 开始截屏
 * 录像保存默认路径在本地配置页面，录像具体地址界面拼接：Snap-IP地址-时间-文件名
 * @param wndID
 */
function snatchPic(wndID) {
    var _wndID = ("undefined" == typeof wndID) ? 0 : wndID,
        retcode,
        flag,
        msg = $.lang.tip["tipSnatchSuccess"],
        time,
        fileName,
        timeFlag,
        dataMap = {},
        IQDebugInfo;

        if(LAPI_GetCfgData(LAPI_URL.IQDebugInfo, dataMap,"",false)){//获取IQ调试信息
            IQDebugInfo = dataMap["Info"];
        }
        var jsonMap = sdk_viewer.execFunctionReturnAll("NetSDKGetDefaultPath");
        if(ResultCode.RESULT_CODE_SUCCEED == jsonMap.code){
            var e = new Date,
                year = e.getFullYear().toString(),
                month = (e.getMonth() + 1).toString(),
                date = e.getDate().toString(),
                hour = +e.getHours().toString(),
                minutes = e.getMinutes().toString(),
                seconds = e.getSeconds().toString();
            time = formatNewTime(year,month,date,hour,minutes,seconds);
            timeFlag = formatDate(year,month,date);
            if(checkNavigator("safari")){
                fileName = jsonMap.result+"Snap"+"/"+ parent.loginServerIp +"/" + timeFlag +"/" +time;
            }else{
                fileName = jsonMap.result+"Snap"+"\\"+ parent.loginServerIp +"\\" + timeFlag +"\\"+time;
            }
            retcode = sdk_viewer.execFunctionReturnAll("NetSDKSnatchOnce", _wndID,fileName,2);

            sdk_viewer.execFunctionReturnAll("NetSDKSetIQDebugInfo",IQDebugInfo,fileName+".jpg");//ISP图片信息携带接口
            flag = (ResultCode.RESULT_CODE_SUCCEED == retcode.code);
            if(!flag){
                if(XPErrorResult.DISK_CAPACITY_NOT_ENOUGH== retcode.code){
                    msg = $.lang.tip["tipDiskSpaceNotEnoughSnatchFail"];
                }else{
                    msg = $.lang.tip["tipSnatchFail"];
                }
            }
        }
    top.banner.showMsg(flag, msg);
}

// 满屏
function fullscreen(flag) {
    var retcode,
        id,
        userAgent = navigator.userAgent.toLowerCase(),
        rMsie = /(msie\s|trident.*rv:)([\w.]+)/;

    retcode = sdk_viewer.execFunctionReturnAll("NetSDKFullScreen", flag);
    retcode = retcode.code;
    id = "player";
    if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
        isFullScreen = (1 == flag);
        /*//IE兼容性处理（IE10以下浏览器首次全屏受父级div位置的影响）
        if(null != rMsie.exec(userAgent)){
            if (!isFullScreen){
                $("#" + id).css( {  //IE取消全屏时实况宽高会发生变化
                    width : "100%",
                    height : "100%"
                });
                $("#activeX_obj").removeClass("video_fullscreen");
            }else {
                $("#activeX_obj").addClass("video_fullscreen");
            }
        }*/
    }
}

/** ***************************************************云台相关********************************************** */

// 预置位排序
function sortPrestList(prestList) {
    var prestArr = prestList.split("|");
    var temArr = [];
    for ( var i = 0; i < prestArr.length; i++) {
        var str = prestArr[i];
        if ("" != str) {
            temArr[str.split("*")[0]] = str;
        }
    }
    prestList = "";
    for ( var i = 0; i < temArr.length; i++) {
        var str = temArr[i];
        if ("" != str && undefined != str) {
            prestList += str + "|";
        }
    }
    prestList = prestList.substring(0, prestList.lastIndexOf("|"));
    return prestList;
}

// 重新生成下拉框选项
function resetCombox() {
    if (!top.banner.isSupportPTZ) return;
    // 获取预置位列表
    var listMap = [];
    var tmpMap = {};
    if (! LAPI_GetCfgData(LAPI_URL.PresetList, tmpMap)) {
            return;
    }
    for ( var i = 0; i< tmpMap["Nums"]; i++) {
        var presetInfo = tmpMap["PresetInfos"][i];
        var presetId = Number(presetInfo["ID"]);
        if ((presetId >= top.banner.startPresetID) && (presetId <= top.banner.endPresetID)) {
            var optionMap = {};
            var presetName = presetInfo["Name"];
            optionMap["id"] = presetId;
            optionMap["name"] = presetName;
            listMap[presetId] = optionMap;
        }
    }
    $("#position").empty();
    $("#position").append("<option value='-1'>[" + $.lang.pub["none"] + "]</option>");
    for ( var i = 0, len = listMap.length; i < len; i++) {
        var option = listMap[i];
        if (!option)
            continue;
        var id = option["id"];
        var name = option["name"];
        var text = id + "[" + name + "]";
        var optionHtml = "<option value='" + id + "' title='" + text + "'>" + text + "</option>";
        $("#position").append(optionHtml);
    }
}

//预置位预置
function callPreset(presetId) {
   if (presetId > -1) {
       LAPI_SetCfgData(LAPI_URL.GoPreset + presetId + "/goto",{}, false);
   }
}
           
//预置位删除
function delPreset(presetId) {
   var recode;
   
   if (presetId == -1) return;
   if (!confirm($.lang.tip["tipConfirmDel"]))return;
   recode = LAPI_DelCfgData(LAPI_URL.PresetList + "/"+presetId,{},false,callBack);

   return recode;
}

function callBack(recode){
    var flag;
    if (recode == ResultCode.PTZ_PRESET_ISUSED) {
        alert($.lang.tip["advErrorMeg"]);
        return;
    }
    if (ResultCode.DEL_PTZ_PRESET == recode) {
        alert($.lang.tip["delPresetErrorMeg"]);
        return;
    }
    flag = (ResultCode.RESULT_CODE_SUCCEED == recode);
    if (flag) {
        resetCombox();
        var mainIframe = top.banner.frames["mainIframe"];
        if(mainIframe.$("#presetTR").is(":visible")) {
            var PresetNum = mainIframe.$("#PresetNum").val();
            mainIframe.makePresetList();
            mainIframe.$("#PresetNum").val(PresetNum);
        }
        if(mainIframe.$("#MotionPresetNum").is(":visible")) {
            var PresetNum = mainIframe.$("#MotionPresetNum").val();
            mainIframe.generalPresetOption();
            mainIframe.$("#MotionPresetNum").val(PresetNum);
        }
    }
    top.banner.showMsg(flag);
}
function bindPtzDerectEvent(ptzMap) {
    if (typeof ptzMap !== "object") {
        return false;
    }
    for ( var name in ptzMap) {
        $("#" + name).bind("mousedown", ptzMap[name], function(event) {
            var ret = submitCtrolCmd(event.data[0], varRotateSpeed, varRotateSpeed);
            if (ret) {

                isControlRun = true;
            }
        });
        $("#" + name).bind("mouseup", ptzMap[name], function(event) {
            if (isControlRun) {
                var ret = submitCtrolCmd(event.data[1], varRotateSpeed, varRotateSpeed);
                if (ret) {
                    isControlRun = false;
                }
            }
        });
        $("#" + name).bind("mouseout", ptzMap[name], function(event) {
            if (isControlRun) {
                var ret = submitCtrolCmd(event.data[1], varRotateSpeed, varRotateSpeed);
                if (ret) {
                    isControlRun = false;
                }
            }
        });
    }
}
function bindPtzLensEvent(ptzMap) {
    if (typeof ptzMap !== "object") {
        return false;
    }
    for ( var name in ptzMap) {
        $("#" + name).bind("mousedown", ptzMap[name], function(event) {
            var ret = submitCtrolCmd(event.data[0]);
            if (ret) {
                isControlRun = true;
            }
        });
        $("#" + name).bind("mouseup", ptzMap[name], function(event) {
            if (isControlRun) {
                var ret = submitCtrolCmd(event.data[1]);
                if (ret) {
                    isControlRun = false;
                }
            }
        });
        $("#" + name).bind("mouseout", ptzMap[name], function(event) {
            if (isControlRun) {
                var ret = submitCtrolCmd(event.data[1]);
                if (ret) {
                    isControlRun = false;
                }
            }
        });
    }
}

function bindManualBackFocusNear() {
    $("#manualbackfocusNear").bind("mousedown", function(){
        LAPI_SetCfgData(LAPI_URL.SetBackFocus, {"CmdType":2,"ComParams":"2"}, false );
        isManualABFStart = true;
    });
    $("#manualbackfocusNear").bind("mouseup", function(){
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"}, false);
        isManualABFStart = false;
    });
    $("#manualbackfocusNear").bind("mouseout", function(){
        if (isManualABFStart) {
            LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"}, false);
            //top.sdk_viewer.ViewerAxSetConfig(channelId, CMD_TYPE.MANUAL_BACK_FOCUS_CTRL, "ManualBackFocusCmd=" + MANUAL_BACK_FOCUS.Stop);
            isManualABFStart = false;
        }
    });
}
            
function bindManualBackFocusFar() {
    $("#manualbackfocusFar").bind("mousedown", function(){
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"1"}, false);
        isManualABFStart = true;
    });
    $("#manualbackfocusFar").bind("mouseup", function(){
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"}, false);
        isManualABFStart = false;
    });
    $("#manualbackfocusFar").bind("mouseout", function(){
        if (isManualABFStart) {
            LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"}, false);
            isManualABFStart = false;
        }
    });
}

// 改变浏览器大小时重新给遮盖层设定宽度。
function resetDivWidth() {
    if (null != document.getElementById("bgObj_id")) {
        document.getElementById("bgObj_id").style.width = document.body.scrollWidth + "px";
    }
}

// 改变实况的外观形式
function changeVideoType(bool , w, h) {
    isShowPtz = bool;
    if(top.banner.isSupportFishEye) {
        isShowPtz = false;
    }
    if (isShowPtz) {
        $("#ctrlTR").removeClass("hidden");
        speedSld.SetValue(varRotateSpeed);
    } else {
        $("#ctrlTR").addClass("hidden");
    }
        $("#activeX_obj").css({
            width: w,
            height: h
        });
}

function startAutoBackFocus() {
    var flag = LAPI_SetCfgData(LAPI_URL.SetBackFocus, {"CmdType":1,"ComParams":"0"}, false);
    if (!flag) {
        top.banner.showMsg(false, $.lang.tip["tipOperateFail"]);
    }
}

function restoreABFPosition() {
    var flag = LAPI_SetCfgData(LAPI_URL.SetBackFocus, {"CmdType":0,"ComParams":"0"}, false);
    if (!flag) {
        top.banner.showMsg(false, $.lang.tip["tipOperateFail"]);
    }
}
//实况暂停
function startstopLivePlay() {
    isIVAStreamOpen = !isIVAStreamOpen;
    if (isIVAStreamOpen) {
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKResumePlay", 0);//恢复播放
        $("#stopLiveStream").html($.lang.pub["stopLiveStream"]);
    } else {
        retcode = sdk_viewer.execFunctionReturnAll("NetSDKPausePlay", 0);//暂停播放
        $("#stopLiveStream").html($.lang.pub["startLiveStream"]);
    }
}
/**
 * ****************************** 公共方法 *********************************
 */
// 设置显示比例
function setRenderScale(wndType, bSaveCfg) {
    calVideoRealPos();
    if (top.sdk_viewer.isInstalled) {
        sdk_viewer.execFunctionReturnAll("NetSDKSetRendScale",wndType,cur_scale);//设置窗格播放比例
        if (bSaveCfg) {
            sdk_viewer.execFunctionReturnAll("NetSDKSetOCXRendScale",cur_scale);
        }
    }
}

function getVideoFormat() {
    var top = GetTopWindow(),
        jsonMap = {},
        tmpMap = {},
        i,
        tmp;

    if (LAPI_GetCfgData(LAPI_URL.ImageEnhance + "/Video",tmpMap)) {
        isCircumgyrate90 = ("4" == tmpMap["MirrorMode"] || "5" == tmpMap["MirrorMode"]);
    }

    var isGetDataOK = LAPI_GetCfgData(LAPI_URL.VideoEncode,jsonMap);
    if (isGetDataOK) {
        for (var streamId = 0; streamId < jsonMap["StreamNum"]; streamId++) {
            var map = {};
            for (i = 0; i < streamInfoList.length; i++) {
                var n = streamInfoList[i];
                if("Height" == n || "Width" ==n ){
                    map[n] = jsonMap["VideoEncoderCfg"][streamId]["VideoStreamCfg"]["Resolution"][n];
                }else if("StreamID" == n){
                    map[n] = jsonMap["VideoEncoderCfg"][streamId][n];
                }else{
                    map[n] = jsonMap["VideoEncoderCfg"][streamId]["VideoStreamCfg"][n];
                }
            }
            if (top.banner.isSupportAlureMode) {
                tmp = map["Height"];
                map["Height"] = map["Width"];
                map["Width"] = tmp;
            }
            StreamInfoList.push(map);
        }

        for (i = 0; i < top.banner.maxStreamNum; i++) {
            if (Number(StreamInfoList[i]["IsEnable"]) == 0) {
                break;
            }
        }
        streamNum = i;
    }
}

// 根据StreamID获得StreamType
function getStreamTypeByStreamID(streamID) {
    var encodeFmt = Number(StreamInfoList[streamID]["EncodeFmt"]), streamType = StreamType.LIVE;

    if (top.banner.isSupportCapture) {
        switch (encodeFmt) {
            case VideoFormat.H264:
                streamType = StreamType.LIVE;
                break;

            case VideoFormat.JPEG:
                streamType = StreamType.IMAGE_TYPE_PLATE;
                break;

            case VideoFormat.MJPEG:
                streamType = StreamType.MJPEG;
                break;

            // 没有defualt
        }
    }

    return streamType;
}

// 获取当前视频的分辨率
function getCurVideoFormat(streamID) {
    var _stremID = (streamID < 10)? streamID : (streamID - 10);
    var streamInfo = StreamInfoList[_stremID];

    if (isCircumgyrate90) {// 旋转90度
        videoWidth = Number(streamInfo["Height"]);
        videoHeight = Number(streamInfo["Width"]);
    } else {
        videoWidth = Number(streamInfo["Width"]);
        videoHeight = Number(streamInfo["Height"]);
    }
}

function calVideoRealPos() {
    if (cur_scale == 0xff) {
        videoPosStartX = videoPosStartY = 0;
        videoPosEndX = videoWidth;
        videoPosEndY = videoHeight;
    } else if (cur_scale == 1) {// XP_RENDER_SCALE_PROPORTION 按比例？
        if (frameWidth * videoHeight > frameHeight * videoWidth) {
            videoPosStartX = (frameWidth - (frameHeight * videoWidth / videoHeight)) / 2;
            videoPosStartY = 0;
            videoPosEndX = (frameWidth + (frameHeight * videoWidth / videoHeight)) / 2;
            videoPosEndY = frameHeight;
        } else {
            videoPosStartX = 0;
            videoPosStartY = (frameHeight - (frameWidth * videoHeight / videoWidth)) / 2;
            videoPosEndX = frameWidth;
            videoPosEndY = (frameHeight + (frameWidth * videoHeight / videoWidth)) / 2;

        }
    } else {
        videoPosStartX = videoPosStartY = 0;
        videoPosEndX = frameWidth;
        videoPosEndY = frameHeight;
    }
}

function rectPerVal(value) {
    if (value < 0) {
        value = 0;
    } else if (value > 100) {
        value = 100;
    }
    return value;
}

function realPosToPer(realPos) {
    var arr = realPos.split(',');
    var StartX = rectPerVal(Math.round(100 * (parseInt(arr[0]) - videoPosStartX) / (videoPosEndX - videoPosStartX)));
    var StartY = rectPerVal(Math.round(100 * (parseInt(arr[1]) - videoPosStartY) / (videoPosEndY - videoPosStartY)));
    var EndX = rectPerVal(Math.round(100 * (parseInt(arr[2]) - videoPosStartX) / (videoPosEndX - videoPosStartX)));
    var EndY = rectPerVal(Math.round(100 * (parseInt(arr[3]) - videoPosStartY) / (videoPosEndY - videoPosStartY)));

    return StartX + "," + StartY + "," + EndX + "," + EndY;
}

function perPosToReal(perPos) {
    var arr = perPos.split(',');
    var StartX = Math.round(videoPosStartX + rectPerVal(arr[0]) * (videoPosEndX - videoPosStartX) / 100);
    var StartY = Math.round(videoPosStartY + rectPerVal(arr[1]) * (videoPosEndY - videoPosStartY) / 100);
    var EndX = Math.round(videoPosStartX + rectPerVal(arr[2]) * (videoPosEndX - videoPosStartX) / 100);
    var EndY = Math.round(videoPosStartY + rectPerVal(arr[3]) * (videoPosEndY - videoPosStartY) / 100);

    return StartX + "," + StartY + "," + EndX + "," + EndY;
}

function initSlider() {
    speedSld = new Slider("rotateSpeedSld", "rotateSpeedBar", {
        onMove : function() {
            if (isSlierMove) {
                varRotateSpeed = Math.round(this.GetValue());
            }
        },
        showTip : true
    });
    speedSld.MinValue = 1
    speedSld.MaxValue = 9;
    isSlierMove = false;
    speedSld.SetValue(varRotateSpeed);
    isSlierMove = true;
}

// 获取除雪信息
function getSweepSnowInfo() {
    if (fristTime || sweepSnowEnabled) {
        fristTime = false;
        var jsonMap = {};
        if(!LAPI_GetCfgData(LAPI_URL.SnowMode,jsonMap)){
            disableAll();
            return;
        }
        // 实时状态
        if (0 == jsonMap["StatusParam"]["SnowModeStatus"]) {// 不使能
            sweepSnowEnabled = false;
        } else {
            sweepSnowEnabled = true;
        }
        changeSweepSnowStatus();
    }
    setTimeout("getSweepSnowInfo()", 600000);
}

function changeSweepSnowStatus() {
    if (sweepSnowEnabled) {
        $("#clearsnowOpen").removeClass("clearsnow-open").addClass("clearsnowOpen_disable");
        $("#clearsnowOpen").attr("disabled", true);
        $("#clearsnowClose").removeClass("clearsnowClose_disable").addClass("clearsnow-close");
        $("#clearsnowClose").attr("disabled", false);
        if (parent.frames["mainIframe"].document.getElementById("clearsnowOpen")) {
            parent.frames["mainIframe"].$("#clearsnowOpen").removeClass("clearsnow-open").addClass(
                    "clearsnowOpen_disable");
            parent.frames["mainIframe"].$("#clearsnowOpen").attr("disabled", true);
            parent.frames["mainIframe"].$("#clearsnowClose").removeClass("clearsnowClose_disable").addClass(
                    "clearsnow-close");
            parent.frames["mainIframe"].$("#clearsnowClose").attr("disabled", false);
        }
    } else {
        $("#clearsnowOpen").removeClass("clearsnowOpen_disable").addClass("clearsnow-open");
        $("#clearsnowOpen").attr("disabled", false);
        $("#clearsnowClose").removeClass("clearsnow-close").addClass("clearsnowClose_disable");
        $("#clearsnowClose").attr("disabled", true);
        if (parent.frames["mainIframe"].document.getElementById("clearsnowOpen")) {
            parent.frames["mainIframe"].$("#clearsnowOpen").removeClass("clearsnowOpen_disable").addClass(
                    "clearsnow-open");
            parent.frames["mainIframe"].$("#clearsnowOpen").attr("disabled", false);
            parent.frames["mainIframe"].$("#clearsnowClose").removeClass("clearsnow-close").addClass(
                    "clearsnowClose_disable");
            parent.frames["mainIframe"].$("#clearsnowClose").attr("disabled", true);
        }
    }
}

function sweepSnow(cmd, speed1, speed2) {
    if (submitCtrolCmd(cmd, speed1, speed2)) {
        sweepSnowEnabled = (0x1301 == cmd);
        changeSweepSnowStatus();
    }
}
function showMBF(e) {
    if (!top.banner.isSupportMBF) return;
    var $manualbackfocusBtns = $("#manualbackfocusBtns");
    var event = getEvent();
    e = e || event;
    var currKey = e.keyCode || e.which || e.charCode;
    if ((KEY_CODE.keyM == currKey) && e.shiftKey && e.ctrlKey && e.altKey ) {
        if ($manualbackfocusBtns.is(":hidden")) {
            $manualbackfocusBtns.removeClass("hidden");
        } else {
            $manualbackfocusBtns.addClass("hidden");
        }
    }
}
//点击下载最新控件
function checkInstallStatus(){
    // 初始化控件
    if (checkNavigator("ie") || checkNavigator("firefox")) {
        initOcx();
    }
    // 检测版本号；
    var flag = top.sdk_viewer.checkVersion();
    if (!flag || null === flag) {
        setTimeout("checkInstallStatus()", 5000);
    } else {
        parent.location.reload();//安装成功后刷新页面加载控件
    }
}

function initPage() {
    // 对加载顺序的容错处理
    if ("undefined" == typeof parent.isMac) {
        parent.isMac = isMacPlatform();
    }
    //下载控件提示框提示语
    $("#ieVersion").attr("title", $.lang.pub["hiddenTips"]);
    $("#download").attr("title", $.lang.pub["downloadSetup"]);

    if (LoginType.VM_LOGIN != parent.loginType) {
        $("#addPreset").removeClass("hidden");
        $("#removePreset").removeClass("hidden");
    }
    if(SkinStyle.Black == top.style) {
        
        $("#ptz").attr("src", "skin/black/images/ptz_black.png");
    }
}
function initEvent() {
    document.onkeydown = showMBF;
    bindPtzDerectEvent(PtzDerectMap);
    bindPtzLensEvent(PtzLensMap);
    bindManualBackFocusNear();
    bindManualBackFocusFar();

    $("#ieVersion").bind("dblclick", function() {
        $("#ieVersion").slideUp(0);
    });
    $("#download").bind("click", checkInstallStatus);

    $("#autobackfocusStart").bind("click",  function(){startAutoBackFocus();});
    $("#autobackfocusPosition").bind("click", function(){restoreABFPosition();});
    $("#centerBtn").click(function() {
        submitCtrolCmd(PtzTurnAroundVal[(curTurnVal++) % 4], varRotateSpeed, varRotateSpeed);
    });

    $("#gotoPreset").bind("click", function() {
        callPreset($("#position").val());
    });
    $("#addPreset").bind("click", function() {
        parent.openWin($.lang.pub["cruisePresetPosAdd"], "preset_edit.htm",400, 195, false, "25%", "50%");
    });
    $("#removePreset").bind("click", function() {
        delPreset($("#position").val());
    });
    $("#ptzExtend button").bind("click", function() {
        submitCtrolCmd(Number($(this).attr("data-cmd")));
    });
    $("#gotoScenePreset").bind("click", function() {
        parent.frames["mainIframe"].gotoCruisePreset();
    });
    $("#addScenePreset").bind("click", function() {
        parent.frames["mainIframe"].setCruisePreset();
    });
    initSlider();
}

$(document).ready(function() {
    beforeDataLoad();
    // 初始化语言标签
        initLang();
        initPage();
        initEvent();
    });

function addEvent(obj, name, func) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + name, func);
    } else if (obj.addEventListener) {
        obj.addEventListener(name, func, false);
    } else {
        alert("failed to attach event");
    }
}

function attachEvents(obj) {
    addEvent(obj, 'eventParamVal', dealEventParamVal);
    addEvent(obj, 'eventStatusReport', dealEventStatusReport);
    addEvent(obj, 'eventRgnPos', dealEventRgnPos);

    addEvent(obj, 'eventStopLive', dealEventStopLive);
    addEvent(obj, 'eventStorageCtrl', dealEventStorageCtrl);
    addEvent(obj, 'eventTalkCtrl', dealEventTalkCtrl);

    addEvent(obj, 'EventExportDebugInfo', dealEventExportDebugInfo);
    addEvent(obj, 'eventSetAutoSaveImg', dealEventSetAutoSaveImg);
    addEvent(obj, 'eventIntelAreaPos', dealEventIntelAreaPos);
    addEvent(obj, 'eventDrawObjParam', dealEventDrawObjParam);
    addEvent(obj, 'eventSelDrawObj', dealEventSelDrawObj);

    addEvent(obj, 'eventRecvGrabStreamData', dealEventRecvGrabStreamData);
    addEvent(obj, 'eventOperSdFileRst', dealEventOperSdFileRst);
    addEvent(obj, 'eventSelectRim', dealEventSelectRim);
    addEvent(obj, 'eventChangeRenderScale', dealEventChangeRenderScale);

    parent.afterPlugInit();
}

function dealEventParamVal(paramNum, params) {
    var top = GetTopWindow();
    top.sdkReturnParam = params;
}

// 状态上报
function dealEventStatusReport(lReportType, pcParam) {
    var top = GetTopWindow(),
        errorMsg = $.lang.tip["tipUnknownErr"],
        i;
    switch (lReportType) {
        case ReportType.REPORT_KEEPALIVE:// 保活
            parent.showKeepLiveResult(pcParam);
            break;
        case ReportType.REPORT_UPDATE:// 升级
            parent.showUpdateResult(pcParam);
            break;
        case ReportType.VM_SERVER_ONLINE:// vm连接状态
            parent.eventStatusReport("VmRegStatus", pcParam);
            break;
        case ReportType.DDNS_DOMAIN_CHECK_RESULT:
            if (parent.frames["mainIframe"].eventDomainCheck) {
                parent.frames["mainIframe"].eventDomainCheck(pcParam);
            }
            break;               
        case ReportType.PHOTO_SERVER_ONLINE:// 照片服务器连接状态
            parent.eventStatusReport("TmsRegStatus", pcParam);
            break;
        case ReportType.PTZ_STATUS:// 云台状态上报
            if (parent.frames["mainIframe"].onCruiseStatus) {
                parent.frames["mainIframe"].onCruiseStatus(pcParam);
            }
            break;
        case ReportType.REPORT_NETWORK_CONFIG:// 网口配置结果上报
            if (parent.frames["mainIframe"].onNetworkCfgResult) {
                parent.frames["mainIframe"].onNetworkCfgResult(pcParam);
            }
            break;
        case ReportType.SCENE_CURRENT:// 场景切换上报
            if (parent.frames["mainIframe"].eventSwitchScene) {
                parent.frames["mainIframe"].eventSwitchScene(pcParam);
            }
            break;
        case ReportType.RADAR_STATE:// 雷达状态
            parent.eventStatusReport("RadarStatus", pcParam);
            break;
        case ReportType.POLARIZER_STATE:// 偏振镜状态
            parent.eventStatusReport("PolarizerStatus", pcParam);
            break;
        case ReportType.COIL_STATE:// 线圈状态
            parent.eventStatusReport("CoilStatus", pcParam);
            break;
        case ReportType.LED_STROBE_STATE:// LED灯状态
            parent.eventStatusReport("LEDStatus", pcParam);
            break;
        case ReportType.LID_STATUS:// 开箱检测状态
            parent.eventStatusReport("OpenDetectStatus", pcParam);
            break;
        case ReportType.ND_FILTER_STATE:// ND滤镜状态
            parent.eventStatusReport("NDFilterStatus", pcParam);
            break;
        case ReportType.TRAFFICLIGHT_STATUS:// 信号灯检测器状态
            parent.eventStatusReport("TrafficLightStatus", pcParam);
            break;
        case ReportType.SD_STATUS:// SD卡状态
            parent.eventStatusReport("SDStatus", pcParam);
            break;
        case ReportType.STATUS_IVA_PARK_STATUS_REPORT:// 车位状态
            parent.eventStatusReport("ParkingInfo", pcParam);
            break;
        case ReportType.STATUS_CARPORT_LEDCTRL_REPORT:// 车位灯控制器状态
            parent.eventStatusReport("CarportLEDCtrlStatus", pcParam);
            break;
        case ReportType.TRAFFICLIGHT_COLOUR:// 交通灯颜色状态
        {
            if (parent.frames["mainIframe"].eventTrafficLightColor) {
                parent.frames["mainIframe"].eventTrafficLightColor(pcParam);
            }
            break;
        }
        case ReportType.PLAYER_RECORD_VIDEO:// 本地录像过程中上报运行信息
            pcParam = parseInt(pcParam);
            switch (pcParam) {
                case XPErrorResult.RECORDSTATE_MANUAL:// 手动停止
                case XPErrorResult.RECORDSTATE_SUBSECTION: // 按规则分割
                    // 这两种信息不处理
                    return;
                case XPErrorResult.RECORDSTATE_CAPACITYLIMIT:// 容量达到上限
                    errorMsg = $.lang.tip["tipTotalCapReached"];
                    break;
                case XPErrorResult.DISK_CAPACITY_WARN:// 硬盘剩余空间低于阈值
                    errorMsg = $.lang.tip["tipDiskSpaceUnderThreshold"];
                    break;
                case XPErrorResult.DISK_CAPACITY_NOT_ENOUGH:// 硬盘剩余空间不足
                    errorMsg = $.lang.tip["tipDiskSpaceNoEnouch"];
                    break;
                case XPErrorResult.WRITE_FILE_FAILED:// 写文件操作失败
                    errorMsg = $.lang.tip["tipWriteFileErr"];
                    break;
                case XPErrorResult.PROCESS_MEDIA_DATA_FAILED:// 媒体数据处理失败
                    errorMsg = $.lang.tip["tipMediaDataErr"];
                    break;
                case XPErrorResult.NOT_SUPPORT_MEDIA_ENCODE_TYPE:// 媒体编码格式不支持录像操作
                    errorMsg = $.lang.tip["tipNotSupportMediaEncode"];
                    break;
                case XPErrorResult.MEDIA_RESOLUTION_CHANGE:// 媒体流分辨率发生变化
                    errorMsg = $.lang.tip["tipMediaResolutionChange"];
                    break;
                default:
                    break;
            }
            if (XPErrorResult.DISK_CAPACITY_WARN != pcParam) {// 停止录像
                if (parent.frames["mainIframe"].startStopRecord) {
                    parent.frames["mainIframe"].startStopRecord();
                }
            }
            eventAlert(errorMsg);
            break;
        case ReportType.PLAYER_MEDIA_PROCESS:// 视频媒体处理过程中的上报运行信息
        case ReportType.PLAYER_CODE_PROCESS:// 视频解码过程中的上报运行信息
            var statusMap = {}, 
                streamType, 
                streamID;

            sdkAddCfg(statusMap, pcParam);

            streamType = Number(statusMap.ImageType);
            
            if (XPErrorResult.NEED_DLL_FOR4K == statusMap.errCode) {    // 缺少解码库，sdk未停流，界面主动停
                if (top.banner.isSupportCapture ) return;   // 智能交通不支持多核解码
                if (!isLoading) {
                    isLoading = true;
                    if (parent.frames["mainIframe"].stopVideoBack_click) {   //回放界面
                        parent.frames["mainIframe"].stopVideoBack_click();
                    } else {
                        stopVideo(streamType);
                    }
                    top.sdk_viewer.ViewerAxSetConfig(channelId, CMD_TYPE.CMD_PLAYER_DLL_DOWNLOAD, "FileName=ActiveX/playerdll.zip");
                    isLoading = false;
                }
            } else {    // 流断开，sdk已停流，更新流的状态
                if (StreamType.PICTRUE == streamType) {
                    streamType = StreamType.IMAGE_TYPE_PLATE;
                }
                if ((StreamType.PICTRUE == streamType) || (StreamType.IMAGE_TYPE_PLATE == streamType)) {
                    isCaptureOpen = false;
                } else if (StreamType.MJPEG == streamType) {
                    isMJpegOpen = false;
                } else {
                    if (parent.frames["mainIframe"].stopVideoBack_click) {   //回放界面
                        parent.frames["mainIframe"].stopVideoBack_click();
                    }
                    for (i = 0; i < statusList.length; i++) {
                        statusList[i]["isVideoOpen"] = false;
                    }
                }
            }
            
            // 在有实况的界面或是断开的是抓拍流则重连流
            if ((isJPEGReplay && ((StreamType.PICTRUE == streamType) || (StreamType.IMAGE_TYPE_PLATE == streamType)))
                || (isLiveReplay && parent.$("#videoDiv").is(":visible"))) {
                if (parent.$("#videoDiv").is(":visible") && !parent.$("#videoDiv").hasClass("waiting")) {
                    parent.$("#videoDiv").addClass("waiting");
                    if (XPErrorResult.NEED_DLL_FOR4K == statusMap.errCode) {
                        parent.$("#videoMsg").removeClass("hidden");
                    }
                }
                if (parent.frames["mainIframe"].startstopVideo) { // 首页
                    parent.frames["mainIframe"].$("#blockDiv").css("display", "block");
                }
                
                // 抓拍流ID
                if (StreamType.PICTRUE == streamType || 
                    StreamType.MJPEG == streamType ||
                    StreamType.IMAGE_TYPE_PLATE == streamType) {
                    streamID = top.banner.maxStreamNum;
                }
                
                if(StreamType.LIVE != streamType) {
                    setTimeout("parent.autoStartStream(" + streamType + "," + streamID+ "," + wndID + ")", 3000);
                } else {
                    if (parent.frames["mainIframe"].onCruiseStatus) {
                        parent.frames["mainIframe"].onCruiseStatus(pcParam);
                    }
                    for(i = 0; i < statusList.length; i++) {
                        setTimeout("parent.autoStartStream(" + streamType + "," + statusList[i]["streamID"] + "," + i + ")", 3000);
                    }
                }
            }
            
            break;
        case ReportType.PLAYER_MEDIA_VOICE:// 语音业务过程中上报运行信息
            pcParam = parseInt(pcParam);
            switch (pcParam) {
                case XPErrorResult.AUDIO_DEVICE_UNRIPE:// 音频设备未准备好
                    errorMsg = $.lang.tip["tipTalkStopAudioDevNotReady"];
                    break;
                case XPErrorResult.VOICE_RUNNING_ERROR: // 语音对讲运行过程中出现错误
                    errorMsg = $.lang.tip["tipTalkStopAudioDevNotReady"];
                    break;
                default:
                    break;
            }

            // 停止语音对讲
            if (parent.frames["mainIframe"].startstopTalk) {
                parent.frames["mainIframe"].startstopTalk();
            }
            eventAlert(errorMsg);
            break;
        case ReportType.REPORT_USERINFOCHANGED:// 用户信息已被修改
        {
            top.showedFlag = true;
            eventAlert( {
                isReboot : true,
                msg : $.lang.tip["tipUserInfoChanged"]
            });
            break;
        }
        case ReportType.STOR_MEMORY_CARD_FORMAT:// SD卡格式化上报
        {
            if (parent.frames["mainIframe"].eventMemoryCardFormat) {
                parent.frames["mainIframe"].eventMemoryCardFormat(pcParam);
            }
            break;
        }
        case ReportType.STATUS_STOR_NAS_MOUNT:// NAS连接上报
        {
            if (parent.frames["mainIframe"].eventConnectNAS) {
                parent.frames["mainIframe"].eventConnectNAS(pcParam);
            }
            break;
        }
        case ReportType.WORKMODE_CHANGE:// 智能枪工作模式切换上报
        {
            top.showedFlag = true;
            eventAlert( {
                isReboot : true,
                msg : $.lang.tip["tipUserWorkModeChanged"]
            });
            break;
        }
        case CMD_TYPE.CMD_ZOOM_DIGITAL: // 数字放大上报
        {
            if (parent.frames["mainIframe"].ditigalZoom) {
                parent.frames["mainIframe"].ditigalZoom();
            }
            break;
        }
        case CMD_TYPE.CMD_SNAPSHOT: // 截屏
        {
            snatchPic();
            break;
        }
        case CMD_TYPE.CMD_PICTURE_INFO: // 过车记录
        {
            if (parent.frames["mainIframe"].eventCarRecordReport) {
                parent.frames["mainIframe"].eventCarRecordReport(pcParam);
            }
            break;
        }
        case ReportType.TRAFFIC_PARAM_REPORT_STATE: // 交通参数结果上报
        {
            if (parent.frames["mainIframe"].getTrafficParamReport) {
                parent.frames["mainIframe"].getTrafficParamReport(pcParam);
            }
            break;
        }        
        case ReportType.DOWNLOAD_RECORD:// 录像下载
        {
            if(parent.frames["iframeWin"].eventDownloadRecord)
            {
                parent.frames["iframeWin"].eventDownloadRecord(pcParam);
            }
        }
        case ReportType.UPNP_PORT_MAP_INFO: //UPNP状态上报
        {
            if(parent.frames["mainIframe"].eventUPNPStatus)
            {
                parent.frames["mainIframe"].eventUPNPStatus();
            }
        }
        case ReportType.IVA_ILLEGAL_DETECT_REPORT:// 智能手动抓拍配置
        {
            if (null !== ShowMsgTimeID) {
                clearTimeout(ShowMsgTimeID);
                ShowMsgTimeID = null;
            }
            var isFadeOut = true;
            var msg = "";
            var fadeTime = 500;
            pcParam = parseInt(pcParam);
            var infoSpan = parent.frames["mainIframe"].$("#IVAManualSnapInfo");
            switch (pcParam) {
                case IVAManualSnapErr.ILLEGAL_MANUAL_SNAP_START:// 手动抓拍开始
                    isFadeOut = false;
                    msg = $.lang.pub["manualSnapStart"];
                    fadeTime = 1000;
                    break;
                case IVAManualSnapErr.ILLEGAL_MANUAL_SNAP_OVER:// 手动抓拍结束
                    msg = $.lang.pub["manualSnapOver"];
                    break;
                case IVAManualSnapErr.MANUAL_SNAP_PTZ_MOVING:// 云台移动中，下发配置无效
                    msg = $.lang.pub["manualSnapPTZError"];
                    break;
                case IVAManualSnapErr.MANUAL_SNAP_OBJ_MAX_FULL:// 抓拍个数已满，下发配置无效
                    msg = $.lang.pub["manualSnapFull"];
                    break;
                case IVAManualSnapErr.WORK_MODE_NOT_SUPPORT:// 工作模式不支持，下发配置无效
                    msg = $.lang.pub["workModeNotSupport"];
                    break;
                default:
                    break;
            }
            if ("" == msg) return;
            infoSpan.html(msg);
            if (infoSpan.is(":visible")) { // 提示信息可见
                infoSpan.stop();
                if (1 == infoSpan.css("opacity")) {
                    infoSpan.fadeTo(100, 0);
                }
                infoSpan.fadeTo(200, 1);
            } else {
                infoSpan.removeClass("hidden");
                infoSpan.fadeIn(fadeTime);
            }
            if (isFadeOut) {
                ShowMsgTimeID = setTimeout(function() {
                    infoSpan.fadeOut(fadeTime, function() {
                        infoSpan.addClass("hidden");
                    });
                }, 800)
            }
        }
        case CMD_TYPE.CMD_GET_WNDID:// 获取当前选中的窗口ID
        {
            wndID = parseInt(pcParam);
            if(parent.frames["mainIframe"].changeVideoBtnByVideoType && top.banner.isSupportFishEye) {
                parent.frames["mainIframe"].changeVideoBtnByVideoType(wndID);
            }
            retcode = top.sdk_viewer.ViewerAxSetConfig(channelId, CMD_TYPE.CMD_SET_PAINT, "WndID=" +wndID);
        }
        default:
            break;
    }
}

// 运动告警坐标上报
function dealEventRgnPos(ulRectNum, pcPosInfo) {
    if (parent.frames["mainIframe"].eventRgnPos) {
        parent.frames["mainIframe"].eventRgnPos(ulRectNum, pcPosInfo);
    }
}

// 启停实况
function dealEventStopLive() {
    if (parent.frames["mainIframe"].startstopVideo) {
        parent.frames["mainIframe"].startstopVideo();
    }
}

// 实况流启停录像
function dealEventStorageCtrl(ulPort, lStorageCtrl) {
    if (parent.frames["mainIframe"].startStopRecord) {
        parent.frames["mainIframe"].startStopRecord();
    }
}

// 启停语音对讲
function dealEventTalkCtrl(ulPort, lTalkCtrl) {
    if (parent.frames["mainIframe"].startstopTalk) {
        parent.frames["mainIframe"].startstopTalk();
    }
}

// 导出诊断信息结果
function dealEventExportDebugInfo(lResult) {
    var errorMsg = "";
    var top = GetTopWindow();
    var flag;
    top.banner.updateBlock(false);

    switch (lResult) {
        case ExportDebugInfoRst.EXPORT_DEBUG_INFO_SUCCESS:
            errorMsg = $.lang.tip["tipLogExportSuccess"];
            break;
        case ExportDebugInfoRst.EXPORT_DEBUG_INFO_FAIL:
            errorMsg = $.lang.tip["tipLogExportFail"];
            break;
        case ExportDebugInfoRst.EXPORT_DEBUG_INFO_TIMEOUT:
            errorMsg = $.lang.tip["tipLogExportTimeOut"];
            break;
        default:
            break;
    }

    flag = (lResult == ExportDebugInfoRst.EXPORT_DEBUG_INFO_SUCCESS);
    parent.frames["mainIframe"].showResult("downloadStatusDiv", flag,  errorMsg);
}

// 抓拍流启停录像
function dealEventSetAutoSaveImg(bAutoSave) {
    if (isCapRecEnabled == (1 == bAutoSave))
        return;
    if (parent.frames["mainIframe"].startStopRecord) {
        parent.frames["mainIframe"].startStopRecord();
    }
}

// 智能设置坐标上报
function dealEventIntelAreaPos(lAreaType, lAreaID, pcPos) {
    if (parent.frames["mainIframe"].eventIntelAreaPos) {
        parent.frames["mainIframe"].eventIntelAreaPos(lAreaType, lAreaID, pcPos);
    }
}

// 智能分析坐标上报
function dealEventDrawObjParam(type, num, strParam) {
    if (parent.frames["mainIframe"].eventDrawObjParam) {
        parent.frames["mainIframe"].eventDrawObjParam(type, num, strParam);
    }
}

// 智能分析选中上报
function dealEventSelDrawObj(type, num) {
    if (parent.frames["mainIframe"].eventSelDrawObj) {
        parent.frames["mainIframe"].eventSelDrawObj(type, num);
    }
}

// 切换抓拍流
function dealEventRecvGrabStreamData() {
    if (!isLock) {// 未锁定
        if (parent.frames["mainIframe"].$("input[name='videoType']").length > 0
                && parent.frames["mainIframe"].$("input[name='videoType'][value='0']").is(":checked")) {// 在实况界面且当前为实况模式
            parent.frames["mainIframe"].$("input[name='videoType'][value='1']").attr("checked", "checked");
            parent.frames["mainIframe"].$("input[name='videoType']:checked").click();
        }
    }
}

// 操作SD卡文件上报事件
function dealEventOperSdFileRst(cmdType, operRst) {
    if (parent.frames["mainIframe"].eventOperSdFileRst) {
        parent.frames["mainIframe"].eventOperSdFileRst(cmdType, operRst);
    }
}

// 线框选中上报
function dealEventSelectRim(rimNum) {
    if (parent.frames["mainIframe"].eventSelectRim) {
        parent.frames["mainIframe"].eventSelectRim(rimNum);
    }
}

function dealEventChangeRenderScale(fullscreen, scale, wndType) {
    cur_scale = scale;
    var bool = (1 == fullscreen);
    // 全屏/退出全屏
    if (bool != isFullScreen) {
        if (parent.frames["mainIframe"].onFullScreen) {
            parent.frames["mainIframe"].onFullScreen(fullscreen);
        }
        parent.video.fullscreen(fullscreen);
    } else {
        parent.changeVideoSize(videoWidth, videoHeight);
    }
    if (parent.frames["mainIframe"].setRenderScale) {
        parent.frames["mainIframe"].setRenderScale(wndType);
    }
}
