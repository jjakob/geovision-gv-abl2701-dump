// JavaScript Document
GlobalInvoke(window);
var channelId = 0;// 通道号

// 加载语言文件
loadlanguageFile(top.language);
var video = top.banner.video; // 播放器

var isAutoFocus = false; // 自动对焦是否开启
var isControlOpen = false; // 判断云台是否有操作
var resultCode = -1; // 增加单播流成功与否
var sld1 = null; // 调节音量
var sld2 = null; // 调节麦克风音量
var sld3 = null; // 云台转速
var isControlRun = false; // 判断云台是否在转动
var isManualABFStart = false; // 手动ABF是否启用
var curTurnVal = 0; // 中心旋转按钮当前的状态码
var varRotateSpeed = video.varRotateSpeed; // 转速
var RotateSpeed = isNaN(varRotateSpeed) ? 1 : varRotateSpeed;
var titleDeviceType = top.banner.titleDeviceType;
var isSlierMove = true; // 是否滑动条移动下发
var IsResetVideoWH = true; // 是否重设视频的高宽
var isEnableGrab = true; // 抓拍功能是否可用
var isIgnoreTrfficLightOpen = false; //模拟红灯是否开启
var peccancyCodeNameMap = {};
var isSupportCapture = ((top.banner.isSupportCapture && !parent.isShowPtzForHTS) || top.banner.isSupportIvaPark);//isSupportCapture为ture时，表示卡口球卡口模式或者其他卡口电警设备，isSupportCapture为false时，表示非卡口电警设备或者卡口球普通模式
var isSupportIpcCapture = (top.banner.isSupportIpcCapture && !parent.isShowPtzForHTS);
var isFishSupportPTZ = (top.banner.isSupportPTZ || top.banner.isSupportFishEye);//鱼眼设备首页需可显示云台
var isStreamChanging = false; //流切换是否正在进行的标志位
function showMBF(e) {
    var event = getEvent();
    e = e || event;
    var currKey = e.keyCode || e.which || e.charCode;
    if ((KEY_CODE.keyM == currKey) && e.shiftKey && e.ctrlKey && e.altKey) {
        var $manualbackfocusBtns = $("#manualbackfocusBtns");
        if ($manualbackfocusBtns.is(":hidden")) {
            $manualbackfocusBtns.removeClass("hidden");
        } else {
            $manualbackfocusBtns.addClass("hidden");
        }
    }
}
var jsonMap={};
var dataMap={};

// 判断是否有云台操作
function changControl() {
    isControlOpen = true;
}

/* Begin: Added by xkf2256 2010-12-28 for VVD51459 */
/* 禁用与控件相关的按钮 */
function disableAllButtons() {
    /* 禁用实况等按钮 */
    if(document.getElementById("btn_grabImg")){
        document.getElementById("btn_grabImg").disabled = true;
        document.getElementById("btn_grabImg").className = "noGrabImg";
    }
    document.getElementById("btn_prScrn").disabled = true;
    document.getElementById("btn_prScrn").className = "noSnapshot";
    document.getElementById("btn_stop").disabled = true;
    document.getElementById("btn_stop").className = "noPlay";
    document.getElementById("btn_record").disabled = true;
    document.getElementById("btn_record").className = "noRecord";
    if(!$("#btn_talk").hasClass("hidden")){
        document.getElementById("btn_talk").disabled = true;
        document.getElementById("btn_talk").className = "noTalk";
    }

    if(!$("#btn_digitalZoom").hasClass("hidden")){
        document.getElementById("btn_digitalZoom").disabled = true;
        document.getElementById("btn_digitalZoom").className = "noDigitalZoom";
    }
    if(!$("#btn_opticsZoom").hasClass("hidden")){
        document.getElementById("btn_opticsZoom").disabled = true;
        document.getElementById("btn_opticsZoom").className = "noOpticsZoom";
    }
    if(!$("#btn_manualSnap").hasClass("hidden")){
        document.getElementById("btn_manualSnap").disabled = true;
        document.getElementById("btn_manualSnap").className = "noManualSnap";
    }
    
    document.getElementById("btn_mute").disabled = true;
    document.getElementById("btn_mute").className = "noAdjustVoice";
    document.getElementById("btn_mic_mute").disabled = true;
    document.getElementById("btn_mic_mute").className = "noMicVoice";
    if(!$("#btn_areaFocus").hasClass("hidden")){
        $("#btn_areaFocus").attr("disabled",true).removeClass().addClass("noAreaFocus");
    }
    /* 灰显掉音量调节按钮 */
    document.getElementById("sliderVolume").className = "slider4";
    document.getElementById("barVolume").className = "bar3 bar4";
    sld1.setEnable(false);
    document.getElementById("sliderMic").className = "slider4";
    document.getElementById("barMic").className = "bar3 bar4";
    sld2.setEnable(false);

    /* 禁用视频流选择 */
    $("#LiveStreamTyp").attr("disabled", true);
    document.getElementById("btn_fullScreen").disabled = true;
    document.getElementById("btn_fullScreen").className = "fullscreen_black_disable";
}

function initSliderForVideoObject(){
    showMuteVoiceCss();
    sld1 = new Slider("sliderVolume", "barVolume", {
        onMove : function() {
        },
        showTip: true
    });
    sld1.MinValue = parseInt("0", 10);
    sld1.MaxValue = parseInt("255", 10);
    sld1.onMove();
    sld1.onMove = function() {
        if (isSlierMove) {
            top.pcVolume = this.GetValue();
            if (!video.setAdjustVolume(this.GetValue())) {
                var pcVolume = 0;
                var retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetVolume",0);
                if (ResultCode.RESULT_CODE_SUCCEED == retcode.code) {
                    pcVolume = retcode.result;
                }
                if (isNaN(pcVolume))
                    pcVolume = 0;
                isSlierMove = false;
                sld1.SetValue(pcVolume);
                top.pcVolume = pcVolume;
                isSlierMove = true;
            }
            if (true == video.isVoiceMute) {
                video.setSilenceStatus(1);
                showMuteVoiceCss();
            }
        }
    };

    showMuteMicCss();
    sld2 = new Slider("sliderMic", "barMic", {
        onMove : function() {
        },
        showTip: true
    });
    if(0 == video.isVoiceTalkOpen){
        document.getElementById("btn_mic_mute").disabled = true;
        sld2.setEnable(false);
    }else{
        document.getElementById("btn_mic_mute").disabled = false;
        sld2.setEnable(true);
    }
    sld2.MinValue = parseInt("0", 10);
    sld2.MaxValue = parseInt("255", 10);
    sld2.onMove();
    sld2.onMove = function() {
        if (isSlierMove && video.isVoiceTalkOpen) {
            if (video.setMicVolume(this.GetValue(), false)) {
                showMuteMicCss();
                top.pcMicVolume = this.GetValue();
            } else {
                var pcMicVolume = 0;
                var retcode;
                retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetMicVolume",0);
                if (ResultCode.RESULT_CODE_SUCCEED == retcode.code) {
                    pcMicVolume = retcode.result;
                }
                if (isNaN(pcMicVolume))
                    pcMicVolume = 0;

                isSlierMove = false;
                sld2.SetValue(pcMicVolume);
                top.pcMicVolume = pcMicVolume;
                isSlierMove = true;
            }
        }
    }
}

function initSliderForVideoData(){
    var pcVolume = 0;
    if (top.pcVolume) {
        pcVolume = top.pcVolume;
    }else {
        pcVolume = 255;
    }
    showMuteVoiceCss();
    isSlierMove = false;
    sld1.SetValue(pcVolume);
    top.pcVolume = pcVolume;
    isSlierMove = true;

    var pcMicVolume = 0;
    if (top.pcMicVolume && video.isVoiceTalkOpen) {
        pcMicVolume = top.pcMicVolume;
    } else {
        pcMicVolume = 255;
    }
    sld2.SetValue(pcMicVolume);
    top.pcMicVolume = pcMicVolume;
}

function initSliderForSpeed() {
    sld3 = new Slider("rotateSpeedSld", "rotateSpeedBar", {
        onMove : function() {
            if (isSlierMove) {
                varRotateSpeed = Math.round(this.GetValue());
            }
        },
        Horizontal: false,
        showTip: true
    });
    sld3.MinValue = 1;
    sld3.MaxValue = 9;
    isSlierMove = false;
    sld3.SetValue(varRotateSpeed);
    isSlierMove = true;
}

function createEmptyString(l) {
    var a = [];
    for ( var i = 0; i < l; i++) {
        a[i] = '*';
    }
    return a.join('');
}

// 刷新某runMode下的显示比例
function refreshRenderScaleByRunMode(runMode) {
    if (top.sdk_viewer.isInstalled) {
        var retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetOCXRendScale");
        video.cur_scale = retcode.result;
    }else{
        video.cur_scale = 1;
    }
}
// 解析违章码和类型的关系
function changeDataMapToPeccancyMap(map) {
    var num= (IVAMode.ILLEGAL == top.banner.IVAType)? Number(map["IllegalCodeNum"]) : Number(map["PeccancyTypeNum"]),
        isChangeName = false,
        i,
        type,
        code,
        n;

        for (i = 1; i <= num; i++) {
            type = (IVAMode.ILLEGAL == top.banner.IVAType)?map["IllegalType" + i] : map["PeccancyType" + i];
            code = (IVAMode.ILLEGAL == top.banner.IVAType)?map["IllegalCodeStr" + i] : map["PeccancyCodeStr" + i];
            if (0 == Number(map["Enable" + i])) {
                continue;
            }
            if ("undefined" == typeof peccancyCodeNameMap[code]) {
                peccancyCodeNameMap[code] = type;
            } else {
                if(("16" == type) || ("32" == type) || ("4096" == type)) {
                    isChangeName = true;
                } else if (("128" == type) || ("16777216" == type) || ("262144" == type) || ("33554432" == type) ||
                    ("67108864" == type) || ("16384" == type) || ("134217728" == type) || ("268435456" == type) ||
                    ("536870912" == type) || ("1073741824" == type) || ("524288" == type)) {
                    peccancyCodeNameMap[code] = 128;
                }
            }
        }

        for (code in peccancyCodeNameMap) {
            type = peccancyCodeNameMap[code];
            if((("16" == type) || ("32" == type) || ("4096" == type)) && isChangeName) {
                peccancyCodeNameMap[code] = $.lang.pub["disobeyBan"];
            } else {
                if(IVAMode.ILLEGAL == top.banner.IVAType) {
                    peccancyCodeNameMap[code] = $.lang.pub[peccancyIllegalIVAMap[type]];
                } else {
                    peccancyCodeNameMap[code] = $.lang.pub[peccancyMap[type]];
                }
            }
        }
}

function initVideo_callback(streamType, streamID, runMode) {
    var _wndID = (isSupportCapture || isSupportIpcCapture)? 0 :video.wndID;
    if ($("#audioBar").is(":visible") && top.sdk_viewer.isInstalled) {//起流后需要重新设置音量
        initSliderForVideoData();
    }

    if(top.banner.isSupportFishEye) {
        $(".mousepointer").each(function(){
            if (!$(this).hasClass("hidden")) {
                $(this).trigger("click");
                return false;
            }
        });
    } else if(top.sdk_viewer.isInstalled){
        var videoType = Number($("#videoType").val());
        if ((isSupportCapture || isSupportIpcCapture) && !video.isCaptureOpen) {
            video.startJpeg();
        }
        changeVideoBtnByVideoType(_wndID);
    }
    refreshRenderScaleByRunMode(runMode);
    $("#renderScale").val(video.cur_scale);

    changeRenderScale();
}

function initCmdRelationTable() {
    var i,
        len,
        contentHtml,
        text;

    var $ptzCmdBody = $("#ptzCmdBody");
    $ptzCmdBody.empty();
    for (i = 0; i < 29; i++) {
        text = $.lang.pub["cmdName" + i];
        contentHtml = "<div class='ptz-acc-item'>" + "<div class='mid_right'>" +
                            "<button class='icon start' hidefocus='true' data-cmd='"+ i+"' onclick='submitCtrolCmd(0x9000 + " + i +");' title='"+$.lang.pub["start"]+"'></button>"+
                            "</div>" +
                            "<span class='ptz-acc-span' title='"+ text + "'>" + text + "</span></div>";
        $ptzCmdBody.append(contentHtml);
        
    }
}
function initData() {
    var streamNum = 1,
        tmpMap = {}, 
        runMode = (isSupportCapture || isSupportIpcCapture)? RunMode.LIVE_JPEG : RunMode.LIVE,
        i,
        ptzFlag = 0;
    if(top.banner.isSupportFishEye && (PearlEyeLiveMode.PTZ4 == parent.LiveMode)) {
        runMode = RunMode.SCREEN_4;
    }

    // 获取当前使能流的分辨率
    resetVideoSize(StreamID.MAIN_VIDEO, "videoTD", false);

    if (video.statusList.length == 0) {
        video.statusList[0] = objectClone(video.statusMap);
        video.statusList[0]["streamID"] = parent.DefaultStreamID;
    }

    var $streamIDDiv = $("#streamIDDiv");
    if($streamIDDiv.is(":visible")) {
        streamNum = video.streamNum;
        for (i = 1; i < streamNum; i++) {
            $($streamIDDiv.find("button").get(i)).removeClass("hidden");
            $($streamIDDiv.find(".line").get(i-1)).removeClass("hidden");
        }
        $($streamIDDiv.find("button").get(i-1)).addClass("last-btn-right");
        changeStreamBtnStyle($streamIDDiv.find("button[data-value='" + top.StreamID + "']")[0]);
    }
    if(top.banner.isSupportPTZ){
        ptzFlag = 1;
    }

    initVideo("videoTD", StreamType.LIVE, runMode, video.statusList[0]["streamID"], false, initVideo_callback,ptzFlag);
    if (top.banner.isOldPlugin && !top.banner.isMac && isSupportCapture ) {
        // 更新抓拍状态
        if (LAPI_GetCfgData(LAPI_URL.CAMARA_CAPTURE_CFG, tmpMap)) {
            isEnableGrab = ((Number(tmpMap["CapturePeccancyType"]) & 4) > 0);

            if (!isEnableGrab) {
                tip = $.lang.tip["tipNoGrabImg"];
                var $btnGrabImg = $("#btn_grabImg");
                $btnGrabImg.attr("disabled", true);
                $btnGrabImg.removeClass().addClass("noGrabImg");
                $btnGrabImg.attr("title", tip);
            }
        }
        
        tmpMap = {};
        var cmdType;
        if(IVAMode.ILLEGAL == top.banner.IVAType) {
            cmdType = CMD_TYPE.IVA_ITS_ILLEGAL_CODE_CFG;
        } else {
            cmdType = LAPI_URL.PECCANCY_CAPTURE_CFG;
        }
        if(!top.banner.isSupportIpcCapture){
            if (getCfgData(channelId, cmdType, tmpMap)) {
                changeDataMapToPeccancyMap(tmpMap);
            }
        }

    }

    if (isFishSupportPTZ) {
        if(2 == top.banner.ptzType) {
            parent.initMaxPresetNum();
            video.resetCombox();
        }
        freshPreset(); //刷新预置位
        initCruiseInfo();
        //todo:待切换接口
        /*if (!top.banner.isMac) {
            if (top.banner.isSupportHDMM) {
             initCmdRelationTable();
             $("#cmdTab").trigger("click");
             }
        }*/
    }
}

/**
 * 启动/停止实况
 * 
 * @type
 */
function startstopVideo() {
    var _wndID = (isSupportCapture || isSupportIpcCapture)? 0 :video.wndID,
        isStreamOpen = video.statusList[_wndID]["isVideoOpen"], 
        status = -1, 
        streamID = video.statusList[_wndID]["streamID"],
        ptzFlag = 0,
        isLive = true;

    // 首页实况关闭则其他界面的流均关闭，不会自动启流
    parent.IsAutoStartVideo = !isStreamOpen;

    if(top.banner.isSupportFishIpc){
        resetFish();
    }

    if (isStreamOpen) {
        for(var i=0; i<video.statusList.length; i++) {
            video.stopVideo(StreamType.LIVE, i);
        }
    } else {
        if(top.banner.isSupportPTZ){
            ptzFlag = 1;
        }
        for(var i=0; i<video.statusList.length; i++) {
            video.startVideo(video.statusList[i]["streamID"], true, i,ptzFlag,isLive);
        }
    }

    status = video.statusList[_wndID]["isVideoOpen"] ? 1 : 0;

    eventNetStreamRst(status);
}

function resetFish(){
    $(".installMode").each(function(){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $(this).removeClass(this.id+"-open").addClass(this.id);
        }
    });
    $("#player-top-installation").removeClass("player-top-installation").addClass("player-top-installation"+"-open").addClass("selected");;
    $(".button-7").removeClass("hidden");
    $(".button-5").addClass("hidden");
    $(".playMode").each(function(){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $(this).removeClass(this.id+"-open").addClass(this.id);
        }
    });
    $("#player-original").removeClass("player-original").addClass("player-original-open").addClass("selected");
    $('#renderScale').attr("disabled","");
}

/**
 * 启动/停止语音对讲
 * 
 * @type
 */
function startstopTalk() {
    if (!video.isVoiceTalkOpen) {
        video.startVoiceTalk();
    } else {
        video.stopVoiceTalk();
    }
    var status = video.isVoiceTalkOpen ? 1 : 0;
    if (!video.isVoiceTalkOpen) {
        document.getElementById("btn_mic_mute").disabled = true;
        sld2.setEnable(false);
    } else {
        document.getElementById("btn_mic_mute").disabled = false;
        sld2.setEnable(true);
    }
    eventVoiceTalkRst(status);
}

// 是否禁音对应的图标变化
function showMuteVoiceCss() {
    if (!video.isVoiceMute) {
        $("#btn_mute").removeClass("closeAdjustVoice").addClass("openAdjustVoice");
        $("#sliderVolume").removeClass("slider4").addClass("slider3");
        $("#barVolume").removeClass("bar4");
        document.getElementById("btn_mute").title = $.lang.pub["audioOff"];
    } else {
        $("#btn_mute").removeClass("openAdjustVoice").addClass("closeAdjustVoice");
        $("#sliderVolume").removeClass("slider3").addClass("slider4");
        $("#barVolume").addClass("bar4");
        document.getElementById("btn_mute").title = $.lang.pub["audioOn"];
    }
}

// 是否禁麦克风对应的图标变化
function showMuteMicCss() {
    if (!video.isMicMute) {
        $("#btn_mic_mute").removeClass("noMicVoice").addClass("openMicVoice");
        $("#sliderMic").removeClass("slider4").addClass("slider3");
        $("#barMic").removeClass("bar4");
        document.getElementById("btn_mic_mute").title = $.lang.pub["audioOff"];
    } else {
        $("#btn_mic_mute").removeClass("openMicVoice").addClass("noMicVoice");
        $("#sliderMic").removeClass("slider3").addClass("slider4");
        $("#barMic").addClass("bar4");
        document.getElementById("btn_mic_mute").title = $.lang.pub["audioOn"];
    }
}

function muteVoice() {// 静音控制（扬声器）
    var status = video.isVoiceMute ? 0 : 1;
    video.setSilenceStatus(status);
    showMuteVoiceCss();
    if(0 == status){
        sld1.setEnable(true);
    }else{
        sld1.setEnable(false);
    }
}

function muteMic() {// 闭音控制（麦克风）
    //var micVolume = video.isMicMute ? sld2.GetValue() : 0;
    video.setMicVolume(sld2.GetValue(), true);
    showMuteMicCss();
}

/**
 * 启动/停止录像
 * 
 * @type
 */
function startStopRecord() {
    var result, i;
    var wndID =(isSupportCapture || isSupportIpcCapture)? 0 :video.wndID;
    _wndID = ("undefined" == typeof wndID) ? 0 : wndID;
    
    //停止非当前选中窗口的录像
    for(i = 0; i < video.statusList.length; i++) {
        if(video.statusList[i]["bRecEnabled"] && _wndID != i) {
             video.stopStorage(i);
        }
    }
    var status = -1;
    if (VideoType.LIVE == top.VideoType) {// 实况流的录像启停
        if (video.statusList[_wndID]["bRecEnabled"]) {
            video.stopStorage(_wndID);
        } else {
            video.startStorage(_wndID);
        }
        status = video.statusList[_wndID]["bRecEnabled"] ? 1 : 0;
    } else {// 抓拍流的录像启停
        video.autoSaveGrabImg();
        status = video.isCapRecEnabled ? 1 : 0;
    }
    eventStorageRst(status);
}

function liveSwitch() {
    parent.isShowPtzForHTS = !parent.isShowPtzForHTS;
    if (parent.isShowPtzForHTS) {
        parent.$("#RTStatus").addClass("hidden");
    } else {
        parent.$("#RTStatus").removeClass("hidden");
    }
    window.location.reload();
}

// 区域聚焦坐标上报事件
function eventAreaFoucs(strParam) {
    var posMap = {},
        jsonMap={};
    posMap = $.parseJSON(strParam);

    if(video.isAreaFocus) {
        jsonMap["TopLeft"] = {};
        jsonMap["BotRight"] = {};
        jsonMap["TopLeft"]["X"] = Number(posMap["left"]);
        jsonMap["TopLeft"]["Y"] = Number(posMap["top"]);
        jsonMap["BotRight"]["X"] = Number(posMap["right"]);
        jsonMap["BotRight"]["Y"] = Number(posMap["bottom"]);
        LAPI_SetCfgData(LAPI_URL.AreaFocus,jsonMap,false);
    }
}

//3D定位上报
function event3DPosition(strParam){
    var posMap = {},
        jsonMap={},PositionMode;
    posMap = $.parseJSON(strParam);

    if(video.isOpticsZoom) {
        jsonMap["MidPointX"] = Number(posMap["usMidPointX"]);
        jsonMap["MidPointY"] = Number(posMap["usMidPointY"]);
        jsonMap["LengthX"] = Number(posMap["usLengthX"]);
        jsonMap["LengthY"] = Number(posMap["usLengthY"]);
        jsonMap["Width"] = Number(posMap["usWidth"]);
        jsonMap["Height"] = Number(posMap["usHeight"]);
        jsonMap["Height"] = Number(posMap["usHeight"]);
        PositionMode = Number(posMap["usPtzZoomType"]);
        if(PostionMode.PositionOut== PositionMode || PostionMode.Positionlocation== PositionMode){ //3D定位（拉框放大）
            LAPI_SetCfgData(LAPI_URL.AreaZoomIn,jsonMap,false);
        }else if(PostionMode.PositionIn== PositionMode){ //3D定位（拉框缩小）
            LAPI_SetCfgData(LAPI_URL.AreaZoomOut,jsonMap,false);
        }
    }
}

//当准备开启其它功能时，停止其它互斥功能。
function stopMutexFunc() {
    if (video.isDigitalZoom) {
        ditigalZoom();
    };
    if (video.isManualSnap) {
        manualSnap();
    };
    if (video.isOpticsZoom) {
        opticsZoom();
    };
    if(video.isAreaFocus) {
        areaFocus();
    };
}

function areaFocus() {
    if (!video.isAreaFocus) {
       stopMutexFunc();
    }

    video.setAreaFocus();
    eventSetAreaFocus();
}

function opticsZoom() {
    if (!video.isOpticsZoom ){
        stopMutexFunc();
    }
    
    video.setOpticsZoom();
    if(top.banner.isSupport3DAreaZoom){
        eventSetOpticsZoom();
    }
}

// 启动/停止数字放大
function ditigalZoom() {
    if (!video.isDigitalZoom ) {
        stopMutexFunc();
    }     
    video.setDigitalZoom();
    eventSetDigitalZoom();
}

//启动/停止手动取证
function manualSnap() {
    if (!video.isManualSnap ) {
        stopMutexFunc();
    }  
    video.setManualSnap();
    eventSetManualSnap();
}

function bindPtzDerectEvent(ptzMap) {
    if (typeof ptzMap !== "object") {
        return false;
    }
    for ( var name in ptzMap) {
        var $name = $("#" + name);
        $name.bind("mousedown", ptzMap[name], function(event) {
            var ret = submitCtrolCmd(event.data[0], varRotateSpeed, varRotateSpeed);
            if (ret) {
                changControl();
                isControlRun = true;
            }
        });
        $name.bind("mouseup", ptzMap[name], function(event) {
            if (isControlRun) {
                var ret = submitCtrolCmd(event.data[1], varRotateSpeed, varRotateSpeed);
                if (ret) {
                    changControl();
                    isControlRun = false;
                }
            }
        });
        $name.bind("mouseout", ptzMap[name], function(event) {
            if (isControlRun) {
                var ret = submitCtrolCmd(event.data[1], varRotateSpeed, varRotateSpeed);
                if (ret) {
                    changControl();
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
    var $name = $("#" + name);
        $name.bind("mousedown", ptzMap[name], function(event) {
            var ret = submitCtrolCmd(event.data[0]);
            if (ret) {
                changControl();
                isControlRun = true;
            }
        });
        $name.bind("mouseup", ptzMap[name], function(event) {
            if (isControlRun) {
                submitCtrolCmd(event.data[1]);
                changControl();
                isControlRun = false;
            }
        });
        $name.bind("mouseout", ptzMap[name], function(event) {
            if (isControlRun) {
                submitCtrolCmd(event.data[1]);
                changControl();
                isControlRun = false;
            }
        });
    }
}

function bindManualBackFocusNear() {
    var $manualbackfocusNear = $("#manualbackfocusNear");
    $manualbackfocusNear.bind("mousedown", function() {
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"2"}, false);
        isManualABFStart = true;
    });
    $manualbackfocusNear.bind("mouseup", function() {
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"}, false);
        isManualABFStart = false;
    });
    $manualbackfocusNear.bind("mouseout", function() {
        if (isManualABFStart) {
            LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"}, false);
            isManualABFStart = false;
        }
    });
}

function bindManualBackFocusFar() {
    var $manualbackfocusFar = $("#manualbackfocusFar");
    $manualbackfocusFar.bind("mousedown", function() {
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"1"},false);
        isManualABFStart = true;
    });
    $manualbackfocusFar.bind("mouseup", function() {
        LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"},false);
        isManualABFStart = false;
    });
    $manualbackfocusFar.bind("mouseout", function() {
        if (isManualABFStart) {
            LAPI_SetCfgData(LAPI_URL.SetBackFocus,{"CmdType":2,"ComParams":"0"},false);
            isManualABFStart = false;
        }
    });
}

function changeRenderScale() {
    video.cur_scale = Number($("#renderScale").val());
    resetVideoWH();
    parent.changeVideoSize(video.videoWidth, video.videoHeight);// 设置视频高宽(界面部分)
    if (isSupportCapture) {
        setRenderScale(VideoType.PICTRUE);
    }
    if(isSupportIpcCapture){
        setRenderScale(2);
    }
    setRenderScale(VideoType.LIVE);
}

function changeScreenNum() {
}

function setVideoWidthAndHeight() {
    if (!video.isFullScreen) {
        parent.changeVideoSize(video.videoWidth, video.videoHeight);// 设置视频高宽(界面部分)
        setRenderScale(VideoType.LIVE);// 设置视频高宽(控件窗口部分)
    }
}

// 改变实况窗口大小（控件）
function setRenderScale(wndType) {
    video.setRenderScale(wndType, 1);
}

// 更新界面按钮样式
function changeVideoBtnByVideoType(wndID) {
    var _wndID = ("undefined" == typeof wndID) ? 0 : wndID;
    
    if ($("#fishEyeMode2").hasClass("menu-active")) {
        $("#btn_digitalZoom").css("display", "none");
        $("#btn_opticsZoom").css("display", "none");
    } else {
        $("#btn_digitalZoom").css("display", "");
        $("#btn_opticsZoom").css("display", "");
    }

    if(!top.sdk_viewer.isInstalled){
        disableAllButtons();
        return;
    }

    // 更新录像按钮状态
    var status = video.statusList[_wndID]["bRecEnabled"]? 1 : 0;
    eventStorageRst(status);

    // 更新播放按钮状态
    status = video.statusList[_wndID]["isVideoOpen"] ? 1 : 0;
    eventNetStreamRst(status);

    //更改数字放大按钮状态
    eventSetDigitalZoom();

    //更新3D定位按钮状态
    if(top.banner.isSupport3DAreaZoom){
        eventSetOpticsZoom();
    }

    // 更新音频相关按钮状态
    if (top.banner.isSupportAudio && !isSupportCapture && !isSupportIpcCapture) {//非卡口电警设备或卡口球普通模式下，支持音频时显示音频
        $("#audioBar").removeClass("hidden");
        if(top.banner.isSupportAudioTalk){
            $("#btn_talk").removeClass("hidden");
            status = video.isVoiceTalkOpen ? 1 : 0;
            eventVoiceTalkRst(status);// 初始化界面图标（开启语音对讲）
        }
    }
}

// 启停实况的执行结果的响应方法
function eventNetStreamRst(lRst) {
    var btnStop = document.getElementById("btn_stop");
    var btnGrabImg = document.getElementById("btn_grabImg");
    var btnPrScrn = document.getElementById("btn_prScrn");
    var btnRecord = document.getElementById("btn_record");
    var btnDZoom = document.getElementById("btn_digitalZoom");
    var btnOZoom = document.getElementById("btn_opticsZoom");
    var btnManualSnap = document.getElementById("btn_manualSnap");
    var videoType = video.StreamInfoList[top.StreamID]["EncodeFmt"];

    switch (lRst) {
        // 停止实况成功
        case 0:
            if(!video.isVoiceTalkOpen && $("#audioBar").is(":visible")){
                document.getElementById("btn_mute").disabled = true;
                sld1.setEnable(false);
            }
            btnStop.className = "startPlay";
            btnStop.title = $.lang.pub["play"];
            btnRecord.disabled = true;
            btnRecord.className = "noRecord";
            btnRecord.title = $.lang.pub["startRecord"];
            video.isDigitalZoom = false;
            btnDZoom.disabled = true;
            btnDZoom.className = "noDigitalZoom";
            btnDZoom.title = $.lang.pub["startDigitalZoom"];

            video.isManualSnap = false;
            if ((IVAMode.ILLEGAL == top.banner.IVAType) && parent.isShowPtzForHTS) {
                btnManualSnap.disabled = true;
                btnManualSnap.className = "noManualSnap";
                btnManualSnap.title = $.lang.pub["startManualSnap"];
            }

            // 主线判断云台能力，重构线判断3D定位能力
            if (top.banner.isSupport3DAreaZoom && !isSupportIpcCapture) {
                btnOZoom.disabled = true;
                btnOZoom.className = "noOpticsZoom";
                btnOZoom.title = $.lang.pub["startOpticsZoom"];
            }

            if (VideoFormat.JPEG == videoType) {
                btnGrabImg.disabled = true;
                btnGrabImg.className = "noGrabImg";
                if (!isEnableGrab) {
                    btnGrabImg.title = $.lang.pub["grabImg"];
                }
                video.isCapRecEnabled = false;
            } else {
                btnPrScrn.disabled = true;
                btnPrScrn.className = "noSnapshot";
                video.bRecEnabled = false;
            }

            if (top.banner.isSupportAreaFocus) {
                video.isAreaFocus = false;
                $("#btn_areaFocus").attr("title",$.lang.pub["startAreaFocus"]).attr("disabled",true).removeClass().addClass("noAreaFocus");
            }

             break;

        // 启动实况成功
        case 1:
            if($("#audioBar").is(":visible")){
                document.getElementById("btn_mute").disabled = false;
                if(!video.isVoiceMute){
                    sld1.setEnable(true);
                }else{
                    sld1.setEnable(false);
                }
            }

            btnStop.className = "stopPlay";
            btnStop.title = $.lang.pub["stop"];
            btnRecord.disabled = false;
            btnRecord.className = "startRecord";
            btnDZoom.disabled = false;
            btnDZoom.className = "openDigitalZoom";
            if ((IVAMode.ILLEGAL == top.banner.IVAType)  && parent.isShowPtzForHTS) {
                btnManualSnap.disabled = false;
                btnManualSnap.className = "openManualSnap";
            }
            // 主线判断云台能力，重构线判断3D定位能力
            var isShow = (top.banner.isRefactor) ? (top.banner.isSupport3DAreaZoom && !isSupportIpcCapture) : isFishSupportPTZ && !isSupportCapture;
            if (isShow) {
                btnOZoom.disabled = false;
                btnOZoom.className = "openOpticsZoom";
            }

            if (VideoFormat.JPEG == videoType) {
                if (isEnableGrab) {
                    btnGrabImg.disabled = false;
                    btnGrabImg.className = "grabImg";
                } else {
                    var tip = $.lang.tip["tipNoGrabImg"];
                    btnGrabImg.title = tip;
                }
            } else {
                btnPrScrn.disabled = false;
                btnPrScrn.className = "snapshot";
            }
            if (top.banner.isSupportAreaFocus) {
                video.isAreaFocus = false;
                $("#btn_areaFocus").attr("title",$.lang.pub["startAreaFocus"]).attr("disabled",false).removeClass().addClass("openAreaFocus");
            }
          
            break;

        // 照片流停止成功
        case 2:
            btnGrabImg.disabled = true;
            btnGrabImg.className = "noGrabImg";
            if (!isEnableGrab) {
                btnGrabImg.title = $.lang.pub["grabImg"];
            }
            break;

        // 照片流启动成功
        case 3:
            if (isEnableGrab) {
                btnGrabImg.disabled = false;
                btnGrabImg.className = "grabImg";
            } else {
                var tip = $.lang.tip["tipNoGrabImg"];

                btnGrabImg.title = tip;
            }
            break;

        default:
            eventAlert($.lang.tip["tipUnknownErr"]);
            break;
    }
}

// 启停录像动作的执行结果
function eventStorageRst(lRst) {
    var videoType = $("#videoType").val();
    var object = document.getElementById("btn_record");
    switch (lRst) {
        /* 停止录像成功 */
        case 0:
            if (VideoType.PICTRUE == videoType) {
                object.className = "startAutoSave";
                object.title = $.lang.pub["startSave"];
            } else {
                object.className = "startRecord";
                object.title = $.lang.pub["startRecord"];
            }
            break;
        /* 启动录像成功 */
        case 1:
            if (VideoType.PICTRUE == videoType) {
                object.className = "stopAutoSave";
                object.title = $.lang.pub["stopSave"];
            } else {
                object.className = "stopRecord";
                object.title = $.lang.pub["stopRecord"];
            }
            break;
        default:
            eventAlert($.lang.tip["tipUnknownErr"]);
            break;
    }
}

// 启停语音对讲动作的执行结果
function eventVoiceTalkRst(lRst) {
    var object = document.getElementById("btn_talk");
    switch (lRst) {
        /* 停止语音对讲成功 */
        case 0:
            for(var i = 0; i < video.statusList.length; i++) {
                if(video.statusList[i]["isVideoOpen"]){
                    break;
                }
            }
            if (i == video.statusList.length) {
                document.getElementById("btn_mute").disabled = true;
                sld1.setEnable(false);
            }
            
            object.className = "startTalk";
            object.title = $.lang.pub["openVoiceTalk"];
            break;
        /* 启动语音对讲成功 */
        case 1:
            document.getElementById("btn_mute").disabled = false;
            sld1.setEnable(true);
            object.className = "stopTalk";
            object.title = $.lang.pub["closeVoiceTalk"];
            break;
        default:
            eventAlert($.lang.tip["tipUnknownErr"]);
            break;
    }
    disableAudio();
}

// 锁屏/解锁上报事件
function eventSetLockWnd() {
    var className = (video.isLock) ? "unlock" : "lock";
    var title = (video.isLock) ? $.lang.pub["stopLock"] : $.lang.pub["startLock"];
    var $btnLock = $("#btn_lock");
    $btnLock.removeClass().addClass(className);
    $btnLock.attr("title", title);
}

// 更新数字放大按钮的状态
function eventSetDigitalZoom() {
    var className = (video.isDigitalZoom) ? "closeDigitalZoom" : "openDigitalZoom";
    var title = (video.isDigitalZoom) ? $.lang.pub["stopDigitalZoom"] : $.lang.pub["startDigitalZoom"];
    var $btnDigitalZoom = $("#btn_digitalZoom");
    $btnDigitalZoom.removeClass().addClass(className);
    $btnDigitalZoom.attr("title", title);
}

//更新手动取证按钮的状态
function eventSetManualSnap() {
    var className = (video.isManualSnap) ? "closeManualSnap" : "openManualSnap";
    var title = (video.isManualSnap) ? $.lang.pub["stopManualSnap"] : $.lang.pub["startManualSnap"];
    var $btnManualSnap = $("#btn_manualSnap");
    $btnManualSnap.removeClass().addClass(className);
    $btnManualSnap.attr("title", title);
}

function eventSetOpticsZoom() {
    var className = (video.isOpticsZoom) ? "closeOpticsZoom" : "openOpticsZoom";
    var title = (video.isOpticsZoom) ? $.lang.pub["stopOpticsZoom"] : $.lang.pub["startOpticsZoom"];
    var $btnOpticsZoom = $("#btn_opticsZoom");
    $btnOpticsZoom.removeClass().addClass(className);
    $btnOpticsZoom.attr("title", title);
}

//更新区域聚焦按钮的状态
function eventSetAreaFocus() {
    var className = (video.isAreaFocus) ? "closeAreaFocus" : "openAreaFocus";
    var title = (video.isAreaFocus) ? $.lang.pub["stopAreaFocus"] : $.lang.pub["startAreaFocus"];
    $("#btn_areaFocus").removeClass().addClass(className);
    $("#btn_areaFocus").attr("title", title);
}

//刷新预置位列表
function freshPreset() {

    //获取预置位
    var $listMap = video.$("#position option"),
        $map,
        i,
        len,
        presetId,
        presetName,
        contentHtml,
        text;

    var $ptzPresetBody = $("#ptzPresetBody");
    $ptzPresetBody.empty();
    for (i = 0, len = $listMap.length; i<len; i++) {
        $map = $($listMap[i]);
        presetId = $map.attr("value");
        if(-1 == presetId)continue;
        presetName = $map.text();
        presetName =  presetName.substring(presetName.indexOf("[")+1);
        presetName = presetName.substring(0, presetName.indexOf("]"));
        contentHtml = "<div class='ptz-acc-item' data-id='"+ presetId+"'>" + "<div class='mid_right'>" +
                            "<button class='icon call-preset' hidefocus='true' onclick='callPreset(this)' title='"+$.lang.pub["gotoPreset"]+"'></button>";
        if (UserType.Administrator == top.userType) {
            contentHtml += "<button class='icon black-del' hidefocus='true' onclick='delPreset(this)' title='"+$.lang.pub["delete"]+"'></button>";
        }
        contentHtml += "</div>" + "<span class='ptz-acc-desc'>" + presetId +"</span>" + 
                            "<span class='ptz-acc-span' title='"+presetName+"'>[" + presetName +"]</span>" + "</div>";
        $ptzPresetBody.append(contentHtml);
        
    }
}

//预置位调用
function callPreset(obj)
{
    var presetId = Number($(obj).parents("div.ptz-acc-item").attr("data-id"));
    video.callPreset(presetId);
}

//预置位删除
function delPreset(obj)
{
    var presetId = Number($(obj).parents("div.ptz-acc-item").attr("data-id"));
    
    if (video.delPreset(presetId)) {
        freshPreset();
    }
}

function release() {
    for (var i = 0; i < video.statusList.length; i++) {
        parent.$("#RTStatus .contentLine").addClass("RTStatusHeight");
        if (!top.banner.isSupportFishEye && parent.DefaultStreamID == video.statusList[i]["streamID"]) {
            // 停录像
            if (video.statusList[i]["bRecEnabled"]) {
                video.stopStorage(i);
            } 

        }
    }
    if (isSupportCapture || isSupportIpcCapture) {
        parent.$("#RTStatus").removeClass("realstatus_eplive").removeClass("realstatus_live");
        parent.$("div.realStatusSection").removeClass("left");
    }

    if (isFishSupportPTZ) {
        // 记住转速
        video.varRotateSpeed = varRotateSpeed;
    }

    // 记住音量大小
    if ($("#audioBar").is(":visible")) {
        top.pcVolume = sld1.GetValue();
        if ($("#btn_mic_mute").is(":visible")) {
            top.pcMicVolume = sld2.GetValue();
        }
    }

    //停止手动取证， 停止3D定位，停止数字放大，停止区域对焦
    stopMutexFunc();

    IsResetVideoWH = false;
    parent.hiddenVideo();
    video.wndID = 0;
}

//流id样式变化
function changeStreamBtnStyle(obj) {
    var $streamIDDiv = $("#streamIDDiv");
    $streamIDDiv.find(".selected").removeClass("selected");
    $(obj).addClass("selected");
    if(0 == $(obj).attr("data-value")) {
        $streamIDDiv.find(".btn_l").addClass("selected");
    } 
    if($(obj).hasClass("last-btn-right")) {
        $streamIDDiv.find(".btn_r").addClass("selected");
    }
    if(top.banner.isSupportFishIpc){
        resetFish();
    }
}

// 实况缩放
function resetVideoWH() {
    var w,
        h;
    if (isFishSupportPTZ) {
        var $ptzPresetBody = $("#ptzPresetBody");
        var $ptzCruiseBody = $("#ptzCruiseBody");
        h = $("#ctrlPanel").height() - Math.max($("#ptzCmdBody").offset().top, $ptzPresetBody.offset().top,$ptzCruiseBody.offset().top) - $("#linkBtnDiv").height() - 25;
        var $ptzPresetFoot = $("#ptzPresetFoot");
        if(UserType.Administrator == top.userType){
            $ptzPresetBody.height(h - $ptzPresetFoot.height());
            $ptzCruiseBody.height(h - $ptzPresetFoot.height());
        }else {
            $ptzPresetBody.height(h);
            $ptzCruiseBody.height(h);
        }
         if (top.banner.isSupportHDMM) {
             $("#ptzCmdBody").height(h);
         }
    }
    if (!IsResetVideoWH)
        return;
    var $videoTD = $("#videoTD");
    w = $videoTD.width();
    h = $videoTD.height();
    parent.$("#videoDiv").css( {
        width : w + "px",
        height : h + "px"
    });
    if (video.cur_scale != 0xff) {
        parent.video.$("#activeX_obj").css( {
            width : w + "px",
            height : h + "px"
        });
    }

    h = $("#realStatusDiv").height();
    $("#dataViewTbody").height(h - $("#dataViewThead").height() - 6);
}

//*****************************************过车记录*******************************************
var dataView = null;
var dataList = [];
var headInfoList = [
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "PassTime"
    },
    {
        fieldId: "LaneID",
        hidden : !top.banner.isSupportCommonCapture
    },
    {
        fieldId: "CarColor",
        hidden : !top.banner.isSupportIvaPark
    },
    {
        fieldId: "PlateColor"
    },
    {
        fieldId: "PlateNum"
    },
    {
        fieldId: "DriveStatusStr",
        hidden : !top.banner.isSupportCommonCapture || top.banner.isSupportIvaPark || !top.banner.isSupportIllegalParam
    },
    {
        fieldId: "Speed",
        hidden : !top.banner.isSupportCommonCapture || top.banner.isSupportIvaPark
    },
    {
        fieldId: "PicName",
        hidden : true
    },
    {
        fieldId: "PicPalateExist",
        hidden : true
    }
];
//************************************************交通参数结果上报**************************************************
var dataViewT = null;
var dataListT = [];
var headInfoListT = [
        {
                fieldId:"StartTime"
        },
        {
                fieldId:"DrivewayID"
        },
        {
                fieldId:"CarFlow"
        },
        {
                fieldId:"AveSpeed"
        },
        {
                fieldId:"AveHeadTime"
        },
        {
                fieldId:"AveTimeOcupyRat"
        }
];

function getData() {
    return dataList;
}

function getDataT() {
        return dataListT;
}
function initDataView() {
    dataView = new DataView("dataview_tbody", getData, headInfoList);
    dataView.setFields( {
        PassTime: function(data) {
            var str = "";
            if (17 == data.length){
                str = data.substring(0,4) + "-" +data.substring(4,6) + "-" + data.substring(6,8) + " " +
                data.substring(8,10) + ":" + data.substring(10,12) + ":" + data.substring(12,14) + "." + data.substring(14,17)
            }
            return str;
        },
        PlateColor: function(data) {
            if (0 == data) {
                data = $.lang.pub["white"];
            } else if (1 == data) {
                data = $.lang.pub["yellow"];
            } else if (2 == data) {
                data = $.lang.pub["blue"];
            } else if (3 == data) {
                data = $.lang.pub["black"];
            } else if (4 == data) {
                data = $.lang.pub["other"];
            } else if (5 == data) {
                data = $.lang.pub["green"];
            } else if (6 == data) {
                data = $.lang.pub["red"];
            }
            return data;
        },
        CarColor: function(data) {
            switch(data) {
                case "65" : 
                    data = $.lang.pub["white"];
                    break;
                case "66" : 
                    data = $.lang.pub["gray"];
                    break;
                case "67" : 
                    data = $.lang.pub["yellow"];
                    break;
                case "68" : 
                    data = $.lang.pub["pink"];
                    break;
                case "69" : 
                    data = $.lang.pub["red"];
                    break;
                case "70" : 
                    data = $.lang.pub["purple"];
                    break;
                case "71" : 
                    data = $.lang.pub["green"];
                    break;
                case "72" : 
                    data = $.lang.pub["blue"];
                    break;
                case "73" : 
                    data = $.lang.pub["brown"];
                    break;
                case "74" : 
                    data = $.lang.pub["black"];
                    break;
                case "75" : 
                    data = $.lang.pub["orange"];
                    break;
                case "76" : 
                    data = $.lang.pub["cyan"];
                    break;
                case "77" : 
                    data = $.lang.pub["silvery"];
                    break;
                case "78" : 
                    data = $.lang.pub["silvery_white"];
                    break;
                case "90" : 
                    data = $.lang.pub["other"];
                    break;
            }
            return data;
        },
        DriveStatusStr: function(data) {
            var type = "";

            if (0 == data) {
                type = $.lang.pub["none"];
            } else if ("undefined" != typeof peccancyCodeNameMap[data]) {
                type = peccancyCodeNameMap[data];
            }
            return type;
        },
        PlateNum: function(data) {
            if ("-" == data) {
                data = $.lang.pub["unIdentify"];
            } else if ("#" == data) {
                data = $.lang.pub["recognizing"];
            } else if ("*" == data) {
                data = $.lang.pub["freeCarPort"];
            }
            return data;
        }
    });
    dataViewT = new DataView("dataview_tbodyT", getDataT, headInfoListT);
    dataViewT.setFields({
        StartTime: function(data) {
                var str = "";
                if (14 == data.length){
                    str = data.substring(0,4) + "-" +data.substring(4,6) + "-" + data.substring(6,8) + " " +
                    data.substring(8,10) + ":" + data.substring(10,12) + ":" + data.substring(12,14)
                }
                return str;
        }
    });
    dataView.setTrEvnet({
        "onclick": function(){
            var event = getEvent(),
                node = event.srcElement? event.srcElement : event.target,
                rowNum,
                picName,
                isPicPalateExist,
                plateNum;
                
            if (("TR" == node.tagName) || ("TD" == node.tagName)) {
                rowNum = $(node).attr("rowNum");
            } else {
                rowNum = $(node).parents("td").attr("rowNum");
            }
            
            // 选中新行
            dataView.checkRow(rowNum);
            
            picName = dataView.getData(rowNum, "PicName");
            isPicPalateExist = dataView.getData(rowNum, "PicPalateExist");
            plateNum = dataView.getData(rowNum, "PlateNum");
            top.sdk_viewer.execFunctionReturnAll("NetSDKPlayLocalPic",wndIdNum.CAPTURESCREEN,picName,"");
            if(isPicPalateExist){
                picName = picName.substring(0, picName.lastIndexOf("_")+1)+"p.jpg";
                top.sdk_viewer.execFunctionReturnAll("NetSDKPlayLocalPic",1,picName,dataView.getData(rowNum, "PlateNum"));
            }else{
                top.sdk_viewer.execFunctionReturnAll("NetSDKPlayLocalPic",1,"",""); //关闭三分屏车牌彩色小图显示流
            }
        }
    });
    dataView.createDataView();
    dataViewT.createDataView();
    
}

// 清空记录列表
function clearCarRecord() {
    dataList = [];
    dataListT = [];
    dataView.refresh();
    dataViewT.refresh();
}

// 过车记录上报事件
function eventCarRecordReport(pcParam,strParam) {
    var xmlDoc = parseXML(pcParam),
        carinfo = {},
        jpegPath = [],
        PicCount = 0,
        PicData,
        time,
        newJpegName = "",
        PicName;

    var $xmlDoc = $(xmlDoc);
    carinfo["PicPalateExist"] = false;

    if ( $xmlDoc.find("RecordID").length > 0) {/**< 车辆信息编号:由1开始自动增长(转换成字符串要求不超过16字节) */
        carinfo["rowNum"] = Number($xmlDoc.find("RecordID").text());
    }
    if ( $xmlDoc.find("PassTime").length > 0) {/**< 经过时刻:YYYYMMDDHHMMSS, 时间按24小时制 */
        carinfo["PassTime"] = $($xmlDoc.find("Image PassTime")[0]).text();
    }
    if ( $xmlDoc.find("LaneID").length > 0) {/**< 车道编号:从1开始, 车辆行驶方向最左车道为1，由左向右顺序编号 */
        carinfo["LaneID"] = Number($xmlDoc.find("LaneID").text());
    }
    if ( $xmlDoc.find("VehicleColor").length > 0) {/**< 车身颜色 */
        carinfo["CarColor"] = $xmlDoc.find("VehicleColor").text();
    }
    if ( $xmlDoc.find("PlateColor").length > 0) {/* 号牌颜色:0-白色1-黄色 2-蓝色 3-黑色 4-其他 */
        carinfo["PlateColor"] = $xmlDoc.find("PlateColor").text();
    }
    if ( $xmlDoc.find("CarPlate").length > 0) {/**< 号牌号码:不能自动识别的用"-"表示 */
        carinfo["PlateNum"] = $xmlDoc.find("CarPlate").text();
    }
    if ( $xmlDoc.find("DriveStatus").length > 0) {/**< 行驶状态:0-正常 1-嫌疑或按GA408.1编码 */
        carinfo["DriveStatusStr"] = $xmlDoc.find("DriveStatus").text();
    }
    if ( $xmlDoc.find("VehicleSpeed").length > 0) {/**< 车辆速度: 单位km/h, -1-无测速功能 */
        carinfo["Speed"] = Number($xmlDoc.find("VehicleSpeed").text());
    }
    if( $xmlDoc.find("PicNumber").length > 0) {/**< 照片张数 */
    var PicNumber = Number($xmlDoc.find("PicNumber").text());
    }

    jpegPath = strParam.split(";"); //照片老路径，若有多张以“；”分隔
    PicData = carinfo["PassTime"].substring(0,8); //图片日期
    time = carinfo["PassTime"].substring(8,16);//图片时间
    //新图片路径及名称：日期+时间+车辆信息编码+行驶状态+车身颜色+车牌颜色+车牌号+车道号
    PicName = PicData +"_"+ time +"_"+ carinfo["rowNum"] + "_" + carinfo["DriveStatusStr"] + "_" + carinfo["CarColor"] + "_" +
              carinfo["PlateColor"] + "_" + carinfo["PlateNum"] + "_" + carinfo["LaneID"];

    if (top.banner.isMac) {
        carinfo["PicName"] = jpegPath[0].substring(0, jpegPath[0].lastIndexOf("/")+1) + PicName + "_" + PicCount + ".jpg";//抓拍大图新路径名称
    }else{
        carinfo["PicName"] = jpegPath[0].substring(0, jpegPath[0].lastIndexOf("\\")+1) + PicName + "_" + PicCount + ".jpg";//抓拍大图新路径名称
    }
    for(var i = 0;i < PicNumber; i++){
        if(2 == $($xmlDoc.find("Image ImageType")[i]).text()){
            PicCount = "p";
            carinfo["PicPalateExist"] = true;//判断是否存在车牌彩色小图，若是彩色小图则图片索引值改为p
        }
        if (top.banner.isMac) {
            newJpegName = jpegPath[0].substring(0, jpegPath[0].lastIndexOf("/")+1) + PicName + "_" + PicCount + ".jpg";
        }else{
            newJpegName = jpegPath[0].substring(0, jpegPath[0].lastIndexOf("\\")+1) + PicName + "_" + PicCount + ".jpg";
        }

        top.sdk_viewer.execFunctionReturnAll("NetSDKChangeFileName",jpegPath[i],newJpegName); //修改抓拍图片名称
        if("p" == PicCount){
            top.sdk_viewer.execFunctionReturnAll("NetSDKPlayLocalPic",1,newJpegName,carinfo["PlateNum"]);//车牌彩色小图显示
        }
        PicCount = i;
        PicCount++;
    }
    if(!carinfo["PicPalateExist"]){
        top.sdk_viewer.execFunctionReturnAll("NetSDKPlayLocalPic",1,"","");//车牌彩色小图显示
    }
    dataList.push(carinfo);
    dataView.addData();

    var $dataViewTbody = $("#dataViewTbody");
    $dataViewTbody[0].scrollTop = $dataViewTbody[0].scrollHeight;
}

//交通参数结果上报
function getTrafficParamReport(pcParam) {
        var trafficparaminfo = {};
        
        sdkAddCfg(trafficparaminfo,pcParam);
        for(var i = 0; i < trafficparaminfo["DriveWayNum"]; i++) {
                var trafficparaminfoT = {};
                trafficparaminfoT["StartTime"] = trafficparaminfo["StartTime"];
                trafficparaminfoT["DrivewayID"] = trafficparaminfo["DrivewayID" + i];
                trafficparaminfoT["CarFlow"] = trafficparaminfo["CarFlow" + i];
                trafficparaminfoT["AveSpeed"] = trafficparaminfo["AveSpeed" + i];
                trafficparaminfoT["AveHeadTime"] = trafficparaminfo["AveHeadTime" + i];
                trafficparaminfoT["AveTimeOcupyRat"] = trafficparaminfo["AveTimeOcupyRat" + i];
                dataListT.push(trafficparaminfoT);
                dataViewT.addData();
        }

    var $dataViewTbodyT = $("#dataViewTbodyT");
    $dataViewTbodyT[0].scrollTop = $dataViewTbodyT[0].scrollHeight;
        
}

// 获取信号灯状态
function getTrafficLightColor() {
    var retcode = top.sdk_viewer.ViewerAxGetConfig20(channelId, CMD_TYPE.CMD_TRAFFIC_LIGHT_STATUS, "");
    var resultList = getSDKParam(retcode);

    if(ResultCode.RESULT_CODE_SUCCEED == resultList[0]){
        eventTrafficLightColor(resultList[1])
    }
}

// 交通灯状态变化
function eventTrafficLightColor(statusStr) {
    var statusMap = {},
        n,
        v,
        className;
    sdkAddCfg(statusMap, statusStr);
    
    for (n in statusMap) {
        v = Number(statusMap[n]);
        
        if ("LeftLight" == n) {
            className = "left_";
        } else if("StraightLight" == n) {
            className = "straight_";
        } else if("RightLight" == n) {
            className = "right_";
        }
        
        switch(v) {
            case 0x1:
                className += "red";
                break;
            case 0x2:
                className += "yellow";
                break;
            case 0x4:
                className += "green";
                break;
            case 0xf:
                className += "black";
                break;
            default:
                 break;
        }
        $("#" + n).removeClass().addClass("traffic_light").addClass(className);
    }
}

 // 菜单选中
function changeFishEyeModeStyle(id) {
    var $obj = $("#" + id),
        isSelected = $obj.hasClass("menu-active");
        
    if (!isSelected) {
        $(".menu-content li").removeClass("menu-active");
        $obj.addClass("menu-active");
    }
}

function chooseStream(id) {
    var $obj = $("#" + id),
        runMode = $obj.attr("data-runMode")? $obj.attr("data-runMode") : RunMode.LIVE,
        streamIdList = ("" == $obj.attr("data-value"))? [] : $obj.attr("data-value").split(","),
        steamID = 0,
        winID = 0,
        i,
        ptzFlag = 0;

    if(top.banner.isSupportFishEye) {
        var $ctrlPanelBtn = $("#ctrlPanelBtn");
        if(4 <= streamIdList.length) {
            if ($ctrlPanelBtn.hasClass("open-ptz")) {
                $ctrlPanelBtn.trigger("click");
            }
        } else {
            if ($ctrlPanelBtn.hasClass("close-ptz")) {
                $ctrlPanelBtn.trigger("click");
            }
        }
    }
    
    // stopVideo
    for(i=0; i<video.statusList.length; i++) {
        if (video.statusList[i]["isVideoOpen"])
            video.stopVideo(StreamType.LIVE, i);
    }
    
    
    video.wndID = 0;
    video.statusList = [];

    // startVideo
    setTimeout(function(){
        for(i=0; i<streamIdList.length; i++) {
            steamID = streamIdList[i];
            winID = i;

            video.statusList[i] = objectClone(video.statusMap);
            video.statusList[i]["streamID"] = steamID;
            // 获取当前分辨率，用于切换显示比例用
            video.getCurVideoFormat(steamID);
            if(top.banner.isSupportPTZ){
                ptzFlag = 1;
            }
            video.startVideo(steamID, true, winID,ptzFlag,true);
            setVideoWidthAndHeight();// 设置视频大小

            // 更新实况按钮
            changeVideoBtnByVideoType(winID);
        }
        isStreamChanging = false;
    }, 100)
}

function toggleCtrlPanel(type) {
    var $videoTD = $("#videoTD");
    var right = Number($videoTD.css("right").replace("px",""));
    var title;
    if (0 == type) { // 云台面板
        if($("#ctrlPanelBtn").hasClass("open-ptz")) {
            $("#ctrlPanelBtn").removeClass("open-ptz").addClass("close-ptz");
        } else {
            $("#ctrlPanelBtn").removeClass("close-ptz").addClass("open-ptz");
        }

    } else { // 经济型鱼眼面板
        if($("#btn_fishIpc").hasClass("openFishIpc")) {
            $("#btn_fishIpc").removeClass("openFishIpc").addClass("closeFishIpc");
            title =  $.lang.pub["openFishIpc"];
        } else {
            $("#btn_fishIpc").removeClass("closeFishIpc").addClass("openFishIpc");
             title = $.lang.pub["closeFishIpc"];
        }
        $("#btn_fishIpc").attr("title",title);
    }
    $("#ctrlPanel").animate({width: 'toggle'}, null,null, function(){
        if ($("#ctrlPanel").is(":visible")) {
            if (isFishSupportPTZ) {
                sld3.SetValue(varRotateSpeed);
            }
        }
        resetVideoWH();
    });
    $("#videoBar").animate({right: (222-right)+"px"});
    $videoTD.animate({right: (222-right)+"px"},null,null, function(){
        var w = $("#videoTD").width();
        parent.$("#videoDiv").css({width: w+"px"});
        resetVideoWH();
    });
}
//************************************************************************************8

function initPearlEyePage() {
    // 获取鱼眼模式
    var $fishEyeMode0 = $("#fishEyeMode0"),
        $fishEyeMode1 = $("#fishEyeMode1"),
        $fishEyeMode2 = $("#fishEyeMode2"),
        $fishEyeMode3 = $("#fishEyeMode3"),
        liveMode;

    $("#ctrlPanelBtn").addClass("hidden");

    parent.getPearEyeCommonCfg();
    parent.getDefaultStreamID();
    liveMode = parent.LiveMode;

    if (PearlEyeLiveMode.PearlEye_Full_3PTZ == liveMode ||
        PearlEyeLiveMode.PearlEye_4PTZ == liveMode ||
        PearlEyeLiveMode.Full_4PTZ == liveMode) {

        $("#ctrlPanel_fisheye").removeClass("hidden");
        $("#controlhead").addClass("controlhead");
        $("#videoBar").css("left", "220px");
        $("#videoTD").css("left", "220px");
    }

    switch (liveMode) {
        case PearlEyeLiveMode.PearlEye_Full_3PTZ:
            $fishEyeMode0.removeClass("hidden");
            $fishEyeMode1.removeClass("hidden");
            $fishEyeMode3.removeClass("hidden");
            break;
        case PearlEyeLiveMode.PearlEye_4PTZ:
            $fishEyeMode0.removeClass("hidden");
            $fishEyeMode2.removeClass("hidden");
            break;
        case PearlEyeLiveMode.Full_4PTZ:
            $fishEyeMode1.removeClass("hidden");
            $fishEyeMode2.removeClass("hidden");
            break;
        case PearlEyeLiveMode.PearlEye:
            $fishEyeMode0.removeClass("hidden");
            break;
        case PearlEyeLiveMode.Full:
            $fishEyeMode1.removeClass("hidden");
            break;
        case PearlEyeLiveMode.PTZ4:
            $fishEyeMode2.removeClass("hidden");
            break;
        default:
            break;
    }
}

//若音频设置界面输入关闭则语音对讲灰显
function disableAudio(){
    var audioMap = {},isMute = 0;
    if(!$("#btn_talk").hasClass("hidden")){
        if (LAPI_GetCfgData(LAPI_URL.AudioIn, audioMap) && ($("#btn_talk").length > 0)) {
            isMute = audioMap["IsMute"];
            if(0 == isMute){
                if(!$("#btn_talk").hasClass("stopTalk")){
                    document.getElementById("btn_talk").disabled = false;
                    document.getElementById("btn_talk").className = "startTalk";
                }
            }else{
                document.getElementById("btn_talk").disabled = true;
                document.getElementById("btn_talk").className = "noTalk";
            }
        }
    }
}

function initPage() {
    top.document.title = $.lang.pub["liveTitle"];
    ScaleHtml ='<option value="0" lang="scale_full"></option>' +'<option value="1" lang="scale_proportion" selected="selected"></option>'
    if (IVAMode.ILLEGAL == top.banner.IVAType) {
        $("#btn_manualSnap").removeClass("hidden");
    }

    if (isSupportCapture || isSupportIpcCapture) {

        if(!top.banner.isSupportIvaPark && IVAMode.ILLEGAL != top.banner.IVAType && top.banner.isSupportTrafficParam) {
            $("#TrafficStatisticPeSpan").removeClass("hidden");
        }
        if (!top.banner.isSupportUsualCapture) {
            $("#drivewayIDHead").removeClass("hidden");
            $("#drivewayTheadCol").removeClass("hidden");
            $("#drivewayTbodyCol").removeClass("hidden");
            if(top.banner.isSupportIvaPark) {
                $("#drivewayIDHead").attr("data-lang", "CapPortID");
                $("#carColorHead").removeClass("hidden");
                $("#carColorTheadCol").removeClass("hidden");
                $("#carColorTbodyCol").removeClass("hidden");
            } else {
                if(top.banner.isSupportIllegalParam) {
                    $("#peccancyHead").removeClass("hidden");
                    $("#peccancyTheadCol").removeClass("hidden");
                    $("#peccancyTbodyCol").removeClass("hidden");
                }
                $("#speedHead").removeClass("hidden");
                $("#speedTheadCol").removeClass("hidden");
                $("#speedTbodyCol").removeClass("hidden");
            }
        }
        $("#videoBar").remove();
        $("#videoBar_traffic").removeClass("hidden");
        $("#trafficInfoDiv").removeClass("hidden");
        $("#videoTD").addClass("live-plugins-traffic");
        parent.$("#RTStatus").addClass("realstatus_live");
        parent.$("div.realStatusSection").addClass("left");
        if (top.banner.isSupportTrafficLight) {
            parent.$("#RTStatus").addClass("realstatus_eplive");
            $("#tlStatusDiv").removeClass("hidden");
            $("#intelligentLink").attr("href", "operate_epIntelligent.htm");
        }
    } else {
        $("#videoBar_traffic").remove();
        $("#videoBar").removeClass("hidden");
        $("#videoTD").removeClass("plugin-bar_traffic");
        
        if(!top.banner.isSupportFishEye) {
            ScaleHtml += '<option value="255" lang="scale_actual"></option>';
        }
    }
    $("#renderScale").append(ScaleHtml);
    if ((!isSupportCapture || top.banner.maxStreamNum > 1) && !top.banner.isSupportFishEye) {
        $("#streamIDDiv").removeClass("hidden");
    }


    if(isSupportCapture ||isSupportIpcCapture ) {

        $("#streamIDDiv").addClass("hidden");
        if(IVAMode.ILLEGAL == top.banner.IVAType) {
            $("#btn_grabImg").addClass("hidden");
        }
    }
    if (top.banner.isSupportAudio) {
        $("#audioBar").removeClass("hidden");
        //语音对讲，麦克风，音量按钮可见
        if(top.banner.isSupportAudioTalk){
            $("#btn_talk").removeClass("hidden");
            $("#btn_mic_mute").removeClass("hidden");
            $("#sliderMic").removeClass("hidden");
            if (!isSupportCapture && !isSupportIpcCapture) {
                disableAudio();
            }
        }else{
            $("#voiceTalk").addClass("hidden");
        }



    }
    
    if ((top.banner.isSupportLens || top.banner.isSupportABF || isFishSupportPTZ ||
        top.banner.isSupportFishIpc) && !isSupportCapture && !isSupportIpcCapture) {
        if (!top.banner.isSupportFishIpc) {
            $("#ctrlPanelBtn").removeClass("hidden");
            $("#ctrlBody").removeClass("hidden");
        }
        if (top.banner.isSupportFishIpc) {
            $("#btn_fishIpc").removeClass("hidden");
            $("#ctrlFishBody").removeClass("hidden");
        }
        $("#ctrlPanel").removeClass("hidden");
        $("#videoTD").removeClass("video_full_w");
        $("#videoBar").removeClass("video_full_w");
        
        if (top.banner.isSupportLens || top.banner.isSupportABF ||  top.banner.isSupportMBF) {
            $("#LENSDiv").removeClass("hidden");
            
            if (top.banner.isSupportLens) {
                //支持变倍对焦
                if(!top.banner.isSupportFishEye) {
                    $("#focusBtns").removeClass("hidden");
                    if (top.banner.isSupportIRIS) {
                        $("#apertureBtns").removeClass("hidden");//显示光圈控制
                    }
                }
                $("#becomeBtns").removeClass("hidden");
            }
            
            if (!top.banner.isSupportFishEye) {
                // 支持ABF
                if (top.banner.isSupportABF) {
                    $("#autobackfocusBtns").removeClass("hidden");
                }
                // 支持MBF
                if (top.banner.isSupportMBF) {
                    document.onkeydown = showMBF;
                }
            }
        }
        
        // 主线判断云台能力，重构线判断3D定位能力
        if (top.banner.isSupport3DAreaZoom) {
            $("#btn_opticsZoom").removeClass("hidden");// 显示3D定位按钮
        }
        
        if (isFishSupportPTZ) {
            //支持云台
            $("#derectionBtns").removeClass("hidden");
            if(!top.banner.isSupportFishEye) {
            // 支持云台附加功能
                if (top.banner.isSupportPeripheralPTZ) {
                        // 支持雨刷
                        if (top.banner.isSupportInfrare) {
                                $("#infrareBtns").removeClass("hidden");
                        }
                        // 支持加热
                        if (top.banner.isSupportHeatup) {
                                $("#heatupBtns").removeClass("hidden");
                        }
                        // 支持红外
                        if (top.banner.isSupportRainbrush) {
                                $("#rainbrushBtns").removeClass("hidden");
                        }
                        // 支持照明
                        if (top.banner.isSupportIlluminate) {
                                $("#illuminateBtns").removeClass("hidden");
                        }
                }
                                
                // 支持除雪
                if (top.banner.isSupportClearSnow) {
                        $("#clearsnowBtns").removeClass("hidden");
                        video.changeSweepSnowStatus();// 更新除雪状态
                }
                                
                if (top.banner.isSupportPeripheralPTZ || top.banner.isSupportClearSnow) {
                        $("#ptzExtend").removeClass("hidden");
                }
                                
                // 预置位巡航相关功能
                if (top.banner.isSupportHDMM) {
                        $(".ptz-acc-header-tab").addClass("ptz-acc-header-tab2");
                        $("#cmdTab").removeClass("hidden");
                }
                $("#ptzAccordion").removeClass("hidden");
            }
            initSliderForSpeed();
        }
    }
    
    // 用户鉴权
    if (UserType.Administrator == top.userType) {
        if (isFishSupportPTZ) {
            $("#ptzPresetFoot").removeClass("hidden");
        }
        if (!top.banner.isSupportHDMM) {
            $("#imgConfigSpn").removeClass("hidden");
        }
        if ((IVADeviceMode.TG == top.banner.IVADeviceType) || (IVADeviceMode.EP == top.banner.IVADeviceType) || (IVADeviceMode.PARK == top.banner.IVADeviceType) || (IVAMode.ILLEGAL == top.banner.IVAType)) {
            $("#intelligentLink").parent("span").removeClass("hidden");
        }
    }
    if (top.banner.isSupportFishEye) {
        initPearlEyePage();
    }
    if (top.banner.isSupportLiveSwitch) {
        $("#btn_liveSwitch_pic").removeClass("hidden");
        $("#btn_liveSwitch_live").removeClass("hidden");
    }

    if(top.banner.isSupportAreaFocus) {
        $("#btn_areaFocus").removeClass("hidden");
    }
    var len = $(".ptz-acc-header-tab").parent().find(".hidden").length;
    if(len == 0){
        $(".ptz-acc-header-tab").css("width","65px");
    }else{
        $(".ptz-acc-header-tab").css("width","98px");
    }
    if($("#audioBar").is(":visible")){
        initSliderForVideoObject();
    }

}

function initEvent() {
    var btnDZoom = document.getElementById("btn_digitalZoom");
    window.onresize = resetVideoWH;
    $("#intelligentLink").click(function() {
        if(IVAMode.ILLEGAL == top.banner.IVAType) {
            parent.$("#ivaCfgLink").attr("data-defaultLink", "ivaSceneManagerTab");
            parent.$("#ivaCfgLink").trigger("click");
        } else if(IVADeviceMode.PARK == top.banner.IVADeviceType){
            parent.$("#ivaCfgLink").attr("data-defaultLink", "ivaParkSceneTab");
            parent.$("#ivaCfgLink").trigger("click");
        } else {
            parent.$("#ivaCfgLink").attr("data-defaultLink", "intelligentTab");
            parent.$("#ivaCfgLink").trigger("click");
        }
    });
    $("#imgConfigLink").click(function() {
        parent.$("#imgCfgLink").attr("data-defaultLink", "imgConfigTab");
        parent.$("#imgCfgLink").trigger("click");
    });
    $("#ctrlPanelBtn").click(function(){toggleCtrlPanel(0);});
    $("#btn_fishIpc").click(function(){toggleCtrlPanel(1);});
    $("#player-top-installation,#player-bottom-installation").click(function() {
        $(".button-7").removeClass("hidden");
        $(".button-5").addClass("hidden");
        $('#renderScale').attr("disabled","");
    });
    $("#player-side-installation").click(function() {
        $(".button-7").addClass("hidden");
        $(".button-5").removeClass("hidden");
        $('#renderScale').attr("disabled","");
    });

    $(".installMode").bind("click", function() {
        var  lFixMode,lPtzMode;
        $(".installMode").each(function(){
            if($(this).hasClass("selected")){
                $(this).removeClass("selected");
            }
        });
        $(this).addClass("selected");

        $(".installMode").each(function(){
            if($(this).hasClass("selected")){
                $(this).removeClass(this.id).addClass(this.id+"-open");

                lFixMode = this.value;
            }else{
                $(this).removeClass(this.id+"-open").addClass(this.id);
            }
            resetVideoWH();
        });
        $(".playMode").each(function(){
            if($(this).hasClass("selected")){
                $(this).removeClass(this.id+"-open").addClass(this.id);
            }
        });
        $("#player-original").removeClass("player-original").addClass("player-original-open");
        var VideoOpen = false;
        for (var i=0; i<video.statusList.length; i++) {
            if (video.statusList[i]["isVideoOpen"]) {
                VideoOpen = true;
                break;
            }
        }
        if(top.sdk_viewer.isInstalled && VideoOpen){
            btnDZoom.disabled = false;
            btnDZoom.className = "openDigitalZoom";
        }
        top.sdk_viewer.execFunctionReturnAll("NetSDKSetPtzAndFixMode",0,0,Number(lFixMode));
    });
    $(".playMode").bind("click", function() {
        var  lFixMode,lPtzMode;
        $(".playMode").each(function(){
            if($(this).hasClass("selected")){
                $(this).removeClass("selected");
            }
        });
        $(this).addClass("selected");
        $(".playMode").each(function(){
            if($(this).hasClass("selected")){
                $(this).removeClass(this.id).addClass(this.id+"-open");
                lPtzMode = this.value;
            }else{
                $(this).removeClass(this.id+"-open").addClass(this.id);
            }
        });
        $(".installMode").each(function(){
            if($(this).hasClass("selected")){
                lFixMode = this.value;
            }
        });
        if(0 != Number(lPtzMode)){
            //鱼眼矫正必须满比例，原图才能数字放大
            $("#renderScale").val(0);
            changeRenderScale();
            $('#renderScale').attr("disabled","disabled");
            btnDZoom.className = "noDigitalZoom";
            btnDZoom.title = $.lang.pub["startDigitalZoom"];
            btnDZoom.disabled = true;
            if(video.isDigitalZoom){
                video.isDigitalZoom = !video.isDigitalZoom;
                top.sdk_viewer.execFunctionReturnAll("NetSDKDigitalZoom",0,0);
            }
        }else{
            var VideoOpen = false;
            for (var i=0; i<video.statusList.length; i++) {
                if (video.statusList[i]["isVideoOpen"]) {
                    VideoOpen = true;
                    break;
                }
            }
            if(top.sdk_viewer.isInstalled && VideoOpen){
                btnDZoom.disabled = false;
                btnDZoom.className = "openDigitalZoom";
            }
            $('#renderScale').attr("disabled","");
        }
        top.sdk_viewer.execFunctionReturnAll("NetSDKSetPtzAndFixMode",0,Number(lPtzMode),Number(lFixMode));
    });

    $("a.ptz-acc-header-tab").click(function() {
        $("a.ptz-acc-header-tab").removeClass("ptz-acc-header-tab-selected");
        $(this).addClass("ptz-acc-header-tab-selected");
        
        if ("presetTab" == this.id) {
            $("#ptzCmdBody").addClass("hidden");
            $("#ptzPresetBody").removeClass("hidden");
            $("#ptzCruiseBody").addClass("hidden");
            if(UserType.Administrator == top.userType){
                $("#ptzPresetFoot").removeClass("hidden");
            }
            $("#record").addClass("hidden");
            $("#plan").addClass("hidden");
            freshPreset();
        } else if ("cmdTab" == this.id) {
            $("#ptzCmdBody").removeClass("hidden");
            $("#ptzPresetBody").addClass("hidden");
            $("#ptzCruiseBody").addClass("hidden");
            $("#ptzPresetFoot").addClass("hidden");
            $("#record").addClass("hidden");
            $("#plan").addClass("hidden");
        } else {
            $("#ptzCmdBody").addClass("hidden");
            $("#ptzPresetBody").addClass("hidden");
            $("#ptzCruiseBody").removeClass("hidden");
            if(UserType.Administrator == top.userType){
                $("#ptzPresetFoot").removeClass("hidden");
            }
            $("#plan").removeClass("hidden");
            //支持模式巡航
            if (top.banner.isSupportTrackRecord) {
                $("#record").removeClass("hidden");
            }
        }
    });
    $("#centerBtn").click(function() {
        submitCtrolCmd(PtzTurnAroundVal[(curTurnVal++) % 4], varRotateSpeed, varRotateSpeed);
        changControl();
    });
    
    $("#addPreset").bind("click", function() {
        if ($("#ptzPresetBody").is(":visible")) {
            parent.openWin($.lang.pub["cruisePresetPosAdd"], "preset_edit.htm", 400, 195, false, "70%", "60%");
        } else {
            parent.openWin($.lang.pub["trackAdd"], "cruise_edit.htm?type=0&trackId=-1", 750, 500, false, "40%", "25%");
        }
    });
    $("#record").bind("click", function(){recordTrack();});
    $("#plan").bind("click", function() {
        parent.openWin($.lang.pub["trackPlan"], "cruise_plan.htm", 680, 380, false, "40%", "25%");
    });
    $("#ptzExtend").find("button").bind("click", function(){
        submitCtrolCmd(Number($(this).attr("data-cmd")));
    });
    $("#clearsnowBtns").find("button").bind("click", function(){
        video.sweepSnow(Number($(this).attr("data-cmd")));
    });
    $("#streamIDDiv").find(".streamBtn").bind("click", function(){
        var id,
            oldID,
            obj,
            len = $("#streamIDDiv").find(".selected").length,
            jsonMap = {},
            w,
            h,
            stremId;
        for(var i = 0;i < len;i ++){
            if("" != $($("#streamIDDiv").find(".selected")[i]).attr("id")){
                oldID = $($("#streamIDDiv").find(".selected")[i]).attr("id");
                break;
            }
        }
        //最左边按钮边
        if($(this).hasClass("btn_l")){
            obj = $(this).next()[0];
            id = obj.id;
        }
        else if ($(this).hasClass("btn_r")){
            //都没有隐藏
            if(undefined == $(this).parent().find(".hidden")[0]){
                obj = $(this).prev()[0];
            }
            else {
                obj = $($(this).parent().find(".hidden")[0]).prev()[0];
            }
            id = obj.id;
        }
        else {
            obj = this;
            id = this.id;
        }


        if("mainStream" == id){
            stremId = 0;
        }else if("auxStream" == id){
            stremId = 1;
        }else{
            stremId = 2;
        }

        if(LAPI_GetCfgData("/LAPI/V1.0/Channel/0/Media/VideoEncode", jsonMap)){
            w = jsonMap["VideoEncoderCfg"][stremId]["VideoStreamCfg"]["Resolution"]["Width"];
            h = jsonMap["VideoEncoderCfg"][stremId]["VideoStreamCfg"]["Resolution"]["Height"];
        }
        if(top.banner.isSupportFishIpc){
            //D1及以下分辨率不支持鱼眼矫正
            if((w * h) <= (720 * 576)){
                if($("#btn_fishIpc").hasClass("openFishIpc")) {
                    toggleCtrlPanel(1);
                }
                document.getElementById("btn_fishIpc").className = "nocloseFishIpc";
                document.getElementById("btn_fishIpc").disabled = true;
            }else{
                if($("#btn_fishIpc").hasClass("nocloseFishIpc")){
                    $("#btn_fishIpc").removeClass("nocloseFishIpc").addClass("closeFishIpc");
                }
                document.getElementById("btn_fishIpc").disabled = false;
            }
        }

        if (isStreamChanging || id == oldID) return;
        isStreamChanging = true;

        changeStreamBtnStyle(obj);
        chooseStream(id);
    });

    $(".mousepointer").bind("click", function(){
        var id = this.id,
            oldID = $("div.menu-content li.menu-active").attr("id");

        if (isStreamChanging || id == oldID) return;
        isStreamChanging = true;
        changeFishEyeModeStyle(id);
        chooseStream(id);
    });
    $("#openPicPath").bind("click", function(){
       var fileName,
           jsonMap;

        jsonMap = top.sdk_viewer.execFunctionReturnAll("NetSDKGetDefaultPath");
        if(ResultCode.RESULT_CODE_SUCCEED == jsonMap.code) {
            fileName = jsonMap.result + "JPEG";
            top.sdk_viewer.execFunction("NetSDKOpenFloder", fileName);
        }
    });

    $("#TrafficStatisticPe").bind("click", function(){
        $(".dataViewold").addClass("hidden");
        $(".dataViewnew").removeClass("hidden");
        $(".TrafficStatisticPe").addClass("hidden");
        $(".capturePhoto").removeClass("hidden");
    });
    $("#capturePhoto").bind("click" ,function(){
        $(".dataViewold").removeClass("hidden");
        $(".dataViewnew").addClass("hidden");
        $(".TrafficStatisticPe").removeClass("hidden");
        $(".capturePhoto").addClass("hidden");
    });
    $("#clearCarInfo").bind("click", clearCarRecord);
    $("#autobackfocusStart").bind("click",  function(){video.startAutoBackFocus();});
    $("#autobackfocusPosition").bind("click", function(){video.restoreABFPosition();});
    bindPtzDerectEvent(PtzDerectMap);
    bindPtzLensEvent(PtzLensMap);
    bindManualBackFocusNear();
    bindManualBackFocusFar();

    //视频工具栏按钮若不在灰显状态则鼠标移上去添加背景色，鼠标移出恢复
    $(".plugin-bar a,.plugin-bar button").hover(function(){
        if(!$(this)[0]["disabled"]){
            $(this).addClass("barHover");
        }
    },function(){
        $(this).removeClass("barHover");
    })
}

$(document).ready(function() {
    parent.selectItem("live");//菜单选中
    beforeDataLoad();
    initPage();

    // 初始化语言标签
    initLang();
    initEvent();
    initDataView();
    initData();
    resetVideoWH();
    afterDataLoad();
});