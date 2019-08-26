GlobalInvoke(window);
var channelId = 0;//通道号

//加载语言文件
loadlanguageFile(top.language);
var CHANNEL_ID = 0;
var video = top.banner.video;   // 播放器
var sld1 = null;                // 调节音量
var isSlierMove = true;         // 是否滑动条移动下发
var IsResetVideoWH = true;      // 是否重设视频的高宽
var Dataview = null;
var VideoStatus = 0;            // 0:未播放，1：播放中，2：暂停
var timer_id = null;            // 进度条定时器
var timer_id2 = null;            // 进度条校正定时器
var isGetData = false;          // 是否获取数据
var DataMap = {};

var headInfoList = [
    {
        fieldId: "status"
    },
    {
        fieldId: "timeslice"
    }
];

function initSliderForVideo(){
    sld1 = new Slider("sliderVolume","barVolume",{
        onMove:function(){},
        showTip : true
    });
    sld1.MinValue = parseInt("0", 10);
    sld1.MaxValue = parseInt("255", 10);
    sld1.onMove = function(){
        if(isSlierMove)
        {
            if(true == video.isVoiceMute){
                video.setSilenceStatus(0);
                showMuteVoiceCss();
            }
            if(!video.setAdjustVolume(this.GetValue()))
            {
                var pcVolume = 0;
                if (!top.banner.isOldPlugin && top.sdk_viewer.isInstalled) {
                    var retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetVolume",0);
                    if (ResultCode.RESULT_CODE_SUCCEED == retcode.code) {
                        pcVolume = retcode.result;
                   }
                } else if(top.banner.isOldPlugin){
                    var retval = top.sdk_viewer.ViewerAxGetVolume20();
                    var resultList = getSDKParam(retval);
                    if (0 == resultList[0]){
                        pcVolume = resultList[1];
                    }
                }
                if(isNaN(pcVolume))pcVolume = 0;
                isSlierMove = false;
                sld1.SetValue(pcVolume);
                isSlierMove = true;
            }
        }
    };
    sld1.SetValue(0);
}

function getData() {
    var dataList = [],
        map = {},
        dateStr = "",
        pcParam = "",
        recordNum = 0,
        i;

    if (isGetData) {
        //获取查询录像接口
        var $year = $("#year");
        var $month = $("#month");
        var $day = $("#day");
        dateStr =
        pcParam = "StartYear=" + $year.val() + "&StartMonth=" + $month.val() +"&StartDay=" + $day.val() +
                  "&StartHour=0&StartMinute=0&StartSecond=0&" +
                  "EndYear=" + $year.val() + "&EndMonth=" + $month.val() +"&EndDay=" + $day.val() +
                  "&EndHour=23&EndMinute=59&EndSecond=59";

        var param1 = $year.val()+"/"+$month.val()+"/"+$day.val()+" "+"00:00:00";
        var param2 = $year.val()+"/"+$month.val()+"/"+$day.val()+" "+"23:59:59";
        if(LAPI_GetCfgData(LAPI_URL.RecordSearch + param1+"&End="+param2,DataMap)){
            recordNum = DataMap["RecordNum"];

            for ( i = 0; i < recordNum; i++) {
                map = {};
                map["StartYear"] = Number(DataMap["RecordInfo"][i]["Begin"]["Year"]);
                map["StartMonth"] = Number(DataMap["RecordInfo"][i]["Begin"]["Month"]);
                map["StartDay"] = Number(DataMap["RecordInfo"][i]["Begin"]["MonthDay"]);
                map["StartHour"] = Number(DataMap["RecordInfo"][i]["Begin"]["Hour"]);
                map["StartMinute"] = Number(DataMap["RecordInfo"][i]["Begin"]["Minute"]);
                map["StartSecond"] = Number(DataMap["RecordInfo"][i]["Begin"]["Second"]);
                map["EndYear"] = Number(DataMap["RecordInfo"][i]["End"]["Year"]);
                map["EndMonth"] = Number(DataMap["RecordInfo"][i]["End"]["Month"]);
                map["EndDay"] = Number(DataMap["RecordInfo"][i]["End"]["MonthDay"]);
                map["EndHour"] = Number(DataMap["RecordInfo"][i]["End"]["Hour"]);
                map["EndMinute"] = Number(DataMap["RecordInfo"][i]["End"]["Minute"]);
                map["EndSecond"] = Number(DataMap["RecordInfo"][i]["End"]["Second"]);
                map["status"] = 0;
                map["timeslice"] = formatTime(map["StartHour"], map["StartMinute"], map["StartSecond"]) +
                                    " - " +
                                    formatTime(map["EndHour"], map["EndMinute"], map["EndSecond"]);
                dataList.push(map);
            }
        }
    }

    return dataList;
}
/********************************* 进度条 ***********************************/
function run(totalTime){
    var $barPlay = $("#barPlay");
    var w = Number($barPlay.width()),
        max_w = Number($("#sliderPlay").width()),
        intval = (totalTime/max_w) * 1000,
        step = 1;

    if (intval < 50) {
        intval = 50;
        step = (max_w * intval)/(totalTime*1000);
    }

    if (w >= max_w) {
        clearTimeout(timer_id);
        timer_id = null;
    } else {
        if (1 == VideoStatus) {
            $barPlay.css("width", (w + step)*100/max_w+"%");
        }

        timer_id = setTimeout("run("+ totalTime +")", intval);
    }
}

//设置进度条播放位置
function setPlaySliderPos(totalTime) {
    var curectTime = 0,
        tmpMap = {};

    //获取播放进度
    if (getCfgData(CHANNEL_ID, CMD_TYPE.CMD_PLAYER_POSITION, tmpMap)) {
        curectTime = Number(tmpMap["PlayerPosition"]);

        if (curectTime >= totalTime) {
            clearTimeout(timer_id2);
            timer_id2 = null;
        } else {
            if (1 == VideoStatus) {
                $("#barPlay").css("width", curectTime*100/totalTime+"%");
            }
            timer_id2 = setTimeout("setPlaySliderPos("+ totalTime +")", totalTime * 1000/10); //进度每到1/10的地方校正一次
        }
    }
}
/***************************************************************************/
function changeBtnStatus(){
    var $btnPlay = $("#btn_play");
    var $btnStop = $("#btn_stop");
    var $btnPrScrn = $("#btn_prScrn");
    var $btnDigitalZoom = $("#btn_digitalZoom");
    if (0 == VideoStatus) { //未播放（停止）
        $btnPlay.removeClass("pausePlay").addClass("startPlay");
        $btnPlay.attr("title", $.lang.pub["play"]);
        $btnStop.removeClass().addClass("stopPlay_disable");
        $btnStop.attr("disabled", true);
        $btnPrScrn.removeClass().addClass("noSnapshot");
        $btnPrScrn.attr("disabled", true);
        $btnDigitalZoom.removeClass().addClass("noDigitalZoom");
        $btnDigitalZoom.attr("title", $.lang.pub["startDigitalZoom"]);
        $btnDigitalZoom.attr("disabled", true);
        if (video.isDigitalZoom) {
            video.setDigitalZoom();
        }
    } else if (1 == VideoStatus) {    //播放中
        $btnPlay.removeClass().addClass("pausePlay");
        $btnPlay.attr("title", $.lang.pub["pause"]);
        $btnStop.removeClass().addClass("stopPlay");
        $btnStop.attr("disabled", false);
        $btnPrScrn.removeClass().addClass("snapshot");
        $btnPrScrn.attr("disabled", false);
        $btnDigitalZoom.removeClass().addClass("openDigitalZoom");
        $btnDigitalZoom.attr("disabled", false);
    } else if (2 == VideoStatus) { //暂停
        $btnPlay.removeClass().addClass("startPlay");
        $btnPlay.attr("title", $.lang.pub["play"]);
    }
}


function startVideoBack(rowNum) {
    var startHour = Dataview.getData(rowNum, "StartHour"),
        startMinute = Dataview.getData(rowNum, "StartMinute"),
        startSecond = Dataview.getData(rowNum, "StartSecond"),
        endHour = Dataview.getData(rowNum, "EndHour"),
        endMinute = Dataview.getData(rowNum, "EndMinute"),
        endSecond = Dataview.getData(rowNum, "EndSecond"),
        totalTime = "",
        pcParam = "",
        retcode = ResultCode.RESULT_CODE_SUCCEED,
        flag = false,jsonMap = {},url,drawParam,
        drawParamMap,
        VideoTransProto = 0;

    totalTime = Number(endHour)*3600 + Number(endMinute)*60 + Number(endSecond) -
                        (Number(startHour)*3600 + Number(startMinute)*60 + Number(startSecond));

    pcParam = "StartYear=" + Dataview.getData(rowNum, "StartYear") +
                "&StartMonth=" + Dataview.getData(rowNum, "StartMonth") +
                "&StartDay=" + Dataview.getData(rowNum, "StartDay") +
                "&StartHour=" + startHour +
                "&StartMinute=" + startMinute +
                "&StartSecond=" + startSecond +
                "&EndYear=" + Dataview.getData(rowNum, "EndYear") +
                "&EndMonth=" + Dataview.getData(rowNum, "EndMonth") +
                "&EndDay=" + Dataview.getData(rowNum, "EndDay") +
                "&EndHour=" + endHour +
                "&EndMinute=" + endMinute +
                "&EndSecond=" + endSecond;

    if(top.banner.isOldPlugin ){
        flag = submitF(CMD_TYPE.CMD_PLAYER_START, pcParam);
        if (flag) {
            VideoStatus = 1;
            run(totalTime);
            //setPlaySliderPos(totalTime);
            //设置声音
            if (!video.isVoiceTalkOpen && !video.isVoiceMute) {
                video.setSilenceStatus(0);
                sld1.SetValue(128);
                video.setAdjustVolume(128);
            }
        }

        return flag;

    }else{
        var  SynTimeMap = {},
             TimeZone = 0,
             dstMap ={},
             dstTime = 0,
            recordUrl,
            index;
        if(LAPI_GetCfgData(LAPI_URL.SystemTime,  SynTimeMap)) {//时区
            TimeZone = SynTimeMap["TimeZone"];
            if(Math.abs(TimeZone) /100 > 1){
                TimeZone = TimeZone /100;
            }
        }
        if(LAPI_GetCfgData(LAPI_URL.DST_Cfg, dstMap)) {//夏令时偏移量
            if(1 == dstMap["Enable"]){
                dstTime = dstMap["OffsetMinute"] ;
            }
        }

        // 播放录像接口,所传时间需转化成UTC时间，并且减去时区和偏移量
        var startTime = Date.UTC(Dataview.getData(rowNum, "StartYear"),Dataview.getData(rowNum, "StartMonth")-1,Dataview.getData(rowNum, "StartDay"),startHour,startMinute,startSecond);
        var endTime = Date.UTC(Dataview.getData(rowNum, "EndYear"),Dataview.getData(rowNum, "EndMonth")-1,Dataview.getData(rowNum, "EndDay"),endHour,endMinute,endSecond);
        startTime = startTime/1000-TimeZone*60*60-dstTime*60;
        endTime = endTime/1000 -TimeZone*60*60-dstTime*60;
        LAPI_GetCfgData(LAPI_URL.RecordStream,jsonMap);
        url= jsonMap["Data"].split("//");
        recordUrl = url[1].split(":");
        if("localhost" == recordUrl[0]){
            recordUrl[0] = top.banner.loginServerIp;
        }
        if(0 != top.banner.rtspPort){
            index = recordUrl[1].indexOf("/");
            if(-1 != index){
                recordUrl[1] = recordUrl[1].substring(index);
                recordUrl[1] = top.banner.rtspPort + recordUrl[1];
            }
        }
        url=url[0]+"//"+top.banner.loginUserName+":"+top.banner.loginUserPwd+"@"+recordUrl[0] + ":" + recordUrl[1];


        top.sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort",0);
        //实况消息内置使能
        top.sdk_viewer.execFunctionReturnAll("NetSDKEnShowVideoInfo",false);
        drawParam = top.sdk_viewer.execFunctionReturnAll("NetSDKGetConfig");//获取本地配置页面参数
        drawParamMap = $.parseJSON(drawParam.result);
        VideoTransProto = drawParamMap["VideoTransProto"];//媒体流协议类型,启流接口中需要用到协议类型
        retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKOpenIPCNetStream",0,url,VideoTransProto,startTime,endTime,1);//参数：通道号，URL，协议类型，开始时间，结束时间，播放类型（0：实况，1：回放）
        retcode = retcode.code;
        if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
            // 播放
            retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKStartPlay", 0);
            retcode = retcode.code;
            VideoStatus = 1;
            run(totalTime);
            if(!video.isVoiceMute){
                top.sdk_viewer.execFunctionReturnAll("NetSDKOpenSound",0,0);
            }
            if (top.banner.isSupportAudio) {
                //设置声音
                if (!video.isVoiceTalkOpen && !video.isVoiceMute) {
                    sld1.setEnable(true);
                    video.setSilenceStatus(0);
                    sld1.SetValue(128);
                    video.setAdjustVolume(128);
                }
            }
        } else {
            top.sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort", 0);
        }
        return (ResultCode.RESULT_CODE_SUCCEED == retcode);
    }
}

function pauseVideoBack() {
    var flag = false, retcode;

    if (1 == VideoStatus) {
        if(top.banner.isOldPlugin){
            flag = submitF(CMD_TYPE.CMD_PLAYER_PAUSE, "");
            if (flag) {
                VideoStatus = 2;
            }
        }else{
            retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKPlayBackCtrl",0,0);//0:暂:，1:恢复
            retcode = retcode.code;
            flag = (ResultCode.RESULT_CODE_SUCCEED == retcode);
            if (flag) {
                VideoStatus = 2;
            }
        }

    } else if (2 == VideoStatus) {
        if (top.banner.isOldPlugin) {
            flag = submitF(CMD_TYPE.CMD_PLAYER_RESUME, "");
            if (flag) {
                VideoStatus = 1;
            }

        } else {
            retcode =top.sdk_viewer.execFunctionReturnAll("NetSDKPlayBackCtrl",0,1);//0:暂:，1:恢复
            retcode = retcode.code;
            flag = (ResultCode.RESULT_CODE_SUCCEED == retcode);
            if (flag) {
                VideoStatus = 1;
            }
        }
    }

    return flag;
}

/**
 * 停止
 * @type
 */
function stopVideoBack()
{
    var flag = false,retcode;

    if (top.banner.isOldPlugin) {
        flag = submitF(CMD_TYPE.CMD_PLAYER_STOP, "");
        if (flag) {
            VideoStatus = 0;
            clearTimeout(timer_id);
            timer_id = null;
            clearTimeout(timer_id2);
            timer_id2 = null;
            $("#barPlay").css("width", "0px");
        }

        return flag;
    } else if(top.sdk_viewer.isInstalled){
        if (top.banner.isSupportAudio) {
            document.getElementById("btn_mute").disabled = true;
            sld1.setEnable(false);
        }
        retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKStopPlay",0);
        retcode = retcode.code;
        if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
            retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKCloseStream",0);
            retcode = retcode.code;
        }

        if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
            retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKFreeLocalPort",0);
            retcode = retcode.code;
        }

        if (ResultCode.RESULT_CODE_SUCCEED == retcode) {
            VideoStatus = 0;
            clearTimeout(timer_id);
            timer_id = null;
            clearTimeout(timer_id2);
            timer_id2 = null;
            $("#barPlay").css("width", "0px");
        }
        if(top.banner.isSupportFishIpc){
            resetFish();
        }

        return (ResultCode.RESULT_CODE_SUCCEED == retcode);
    }
}

function resetFish(){
    $(".installMode").each(function(){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $(this).removeClass(this.id+"-open").addClass(this.id);
        }
    });
    $("#player-top-installation").removeClass("player-top-installation").addClass("player-top-installation"+"-open").addClass("selected");;
    $(".playMode").each(function(){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            $(this).removeClass(this.id+"-open").addClass(this.id);
        }
    });
    $("#player-original").removeClass("player-original").addClass("player-original-open").addClass("selected");
}

/**
 * 点击播放/暂停
 * @type
 */
function startOrPauseVideoBack_click(){
    var flag = false;

    if(top.banner.isSupportFishIpc){
        resetFish();
    }
    if (0 == VideoStatus) { //当前未播放，执行播放动作
        var tr = null;
        if (-1 == Dataview.currectRow) {
            return;
        }
        tr = $("#dataview_tbody").find("tr").get(Dataview.currectRow);
        $(tr).addClass("playing");

        flag = startVideoBack(Dataview.currectRow);
    } else { //执行暂停或继续播放动作
        flag = pauseVideoBack();
    }
    if (flag) {
        changeBtnStatus();
    }
}

/**
 * 点击停止
 * @type
 */
function stopVideoBack_click(){
    if (0 == VideoStatus) return;
    if (stopVideoBack()){
        $(".playing").removeClass("playing");
        changeBtnStatus();
    }
}

//是否禁音对应的图标变化
function showMuteVoiceCss(){
    if(!video.isVoiceMute){
        $("#btn_mute").removeClass("closeAdjustVoice").addClass("openAdjustVoice");
        $("#sliderVolume").removeClass("slider4").addClass("slider3");
        $("#barVolume").removeClass("bar4");
        document.getElementById("btn_mute").title = $.lang.pub["audioOff"];
    }
    else{
        $("#btn_mute").removeClass("openAdjustVoice").addClass("closeAdjustVoice");
        $("#sliderVolume").removeClass("slider3").addClass("slider4");
        $("#barVolume").addClass("bar4");
        document.getElementById("btn_mute").title = $.lang.pub["audioOn"];
    }
}

function muteVoice(){//静音控制（扬声器）
    var status = video.isVoiceMute? 0: 1;
    video.setSilenceStatus(status);
    showMuteVoiceCss();
}



// 启动/停止数字放大
function ditigalZoom()
{
    if(!video.isDigitalZoom && video.isOpticsZoom)
        opticsZoom();

    video.setDigitalZoom();
    eventSetDigitalZoom();
}

function setVideoWidthAndHeight()
{
    if(!video.isFullScreen)
    {
        parent.changeVideoSize(video.videoWidth, video.videoHeight);//设置视频高宽(界面部分)
        var wndType = $("#videoType").val();
        setRenderScale(wndType);//设置视频高宽(控件窗口部分)
    }
}

//改变实况窗口大小（控件）
function setRenderScale(wndType)
{
    video.setRenderScale(wndType, 1);
}

// 更新数字放大按钮的状态
function eventSetDigitalZoom()
{
    var className = (video.isDigitalZoom)? "closeDigitalZoom": "openDigitalZoom";
    var title = (video.isDigitalZoom)? $.lang.pub["stopDigitalZoom"]: $.lang.pub["startDigitalZoom"];
    var $btnDigitalZoom = $("#btn_digitalZoom");
    $btnDigitalZoom.removeClass().addClass(className);
    $btnDigitalZoom.attr("title", title);
}



function release()
{
    IsResetVideoWH = false;
    parent.hiddenVideo();
    stopVideoBack();
    if ((top.banner.isSupportRealtimeStatus && !top.banner.isSupportIpcCapture) || top.banner.isSupportIvaPark) {
        parent.$("#RTStatus").removeClass("hidden");
    }
}

//实况缩放
function resetVideoWH()
{
    var w,
        h;

    var $ptzPresetBody = $("#ptzPresetBody");
    h = $("#ctrlPanel").height() - $ptzPresetBody.offset().top - 20;
    $ptzPresetBody.css("height", h);
    if(!IsResetVideoWH)return;
    var $videoTD = $("#videoTD");
    w = $videoTD.width();
    h = $videoTD.height();
    parent.$("#videoDiv").css({width: w+"px",height:h+"px"});
    parent.video.$("#activeX_obj").css({width: w+"px",height:h+"px"});
}

function submitF(cmd ,pcParam) {
     var retcode = top.sdk_viewer.ViewerAxSetConfig(CHANNEL_ID, cmd, pcParam);
     return (ResultCode.RESULT_CODE_SUCCEED == retcode);
}

function initPage() {
    var date = new Date();
    top.document.title = $.lang.pub["playback"];
    if(!top.banner.isOldPlugin && top.sdk_viewer.isInstalled){
        top.sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort",0);
    }
    if (top.banner.isSupportAudio) {
        $("#audioBar").removeClass("hidden");
        initSliderForVideo();
        showMuteVoiceCss();
    }
    WdatePicker({
        skin: "whyGreen",
        eCont: 'datePicker',
        onpicked: function(dp){
                    $("#year").val(dp.cal.date.y);
                    $("#month").val(dp.cal.date.M);
                    $("#day").val(dp.cal.date.d);
                  },
        lang: top.wdateLang
    });
    $("#year").val(date.getFullYear());
    $("#month").val(date.getMonth() + 1);
    $("#day").val(date.getDate());

	if (top.banner.isSupportRealtimeStatus) {
        parent.$("#RTStatus").addClass("hidden");
    }
    if (top.banner.isSupportFishIpc) {
        $("#buttunBar").removeClass("hidden");
    }
}

function initEvent() {
    document.onselectstart = function(){return false;};
    window.onresize = resetVideoWH;
    $("#queryBtn").bind("click",function(){
        Dataview.refresh();

        var $ptzAccordion = $("#ptzAccordion");
        if($ptzAccordion.hasClass("hidden")) {
            $ptzAccordion.removeClass("hidden");
            resetVideoWH();
        }
    });
    $("#loadBtn").bind("click",function(){
        resetVideoWH();
        parent.openWin($.lang.pub["recordCfg"], "operate_record.htm", 620, 550, false, "50%", "20%");
    });
    //视频工具栏按钮若不在灰显状态则鼠标移上去添加背景色，鼠标移出恢复
    $(".plugin-bar a,.plugin-bar button").hover(function(){
        if(!$(this)[0]["disabled"]){
            $(this).addClass("barHover");
        }
    },function(){
        $(this).removeClass("barHover");
    });

    $("#btn_fishIpc").click(function() {
        if($(this).hasClass("openFishIpc")) {
            $(this).removeClass("openFishIpc").addClass("closeFishIpc");
            $("#ctrlFishBody").addClass("hidden");
            $("#ctrlBody").removeClass("hidden");
        } else {
            $(this).removeClass("closeFishIpc").addClass("openFishIpc");
            $("#ctrlBody").addClass("hidden");
            $("#ctrlFishBody").removeClass("hidden");
        }
    });

    $("#backToTime").click(function() {
        $("#ctrlFishBody").addClass("hidden");
        $("#ctrlBody").removeClass("hidden");
        $("#btn_fishIpc").removeClass("openFishIpc").addClass("closeFishIpc");
    });


    $("#player-top-installation,#player-bottom-installation").click(function() {
        $(".button-7").removeClass("hidden");
        $(".button-5").addClass("hidden");
    });
    $("#player-side-installation").click(function() {
        $(".button-7").addClass("hidden");
        $(".button-5").removeClass("hidden");
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
        });
        $(".playMode").each(function(){
            if($(this).hasClass("selected")){
                $(this).removeClass(this.id+"-open").addClass(this.id);
            }
        });
        $("#player-original").removeClass("player-original").addClass("player-original-open");
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
        top.sdk_viewer.execFunctionReturnAll("NetSDKSetPtzAndFixMode",0,Number(lPtzMode),Number(lFixMode));
    });

}

function fishIpc(){
    $("#ctrlBody").addClass("hidden");
    $("#ctrlFishBody").removeClass("hidden");
}

function initData()
{
    //获取使能流的分辨率
    video.getVideoFormat();
    Dataview = new DataView("dataview_tbody", getData, headInfoList);
    Dataview.setFields({
        status: function(data){
            data = "<a class='icon pucker hidden'></a>";
            return data;
        }
    });
    Dataview.setTrEvnet({
        "ondblclick": function(){
            var event = getEvent(),
                node = event.srcElement? event.srcElement : event.target;

            if ("TD" == node.tagName) {
                node = $(node).parent("tr");
            }

            $(".playing").removeClass("playing");
            node.addClass("playing");

            if (0 != VideoStatus) {
                //先停录像
                stopVideoBack();
            }
            //播放录像
            startVideoBack($(node).attr("rowNum"));
            changeBtnStatus();
        }
    });
    Dataview.createDataView();

    isGetData = true;
}

$(document).ready(function(){
    parent.selectItem("playback");//菜单选中
    beforeDataLoad();
    initPage();

    //初始化语言标签
    initLang();
    initEvent();
    initData();
    initVideo("videoTD", StreamType.LIVE, RunMode.CONFIG, 255);
    resetVideoWH();
    afterDataLoad();
});