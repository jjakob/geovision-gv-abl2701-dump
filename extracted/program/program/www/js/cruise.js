var channelId = 0;
var curCruiseTrackId = -1; // 当前巡航路线ID
var curRecordTrackId = -1; // 正在录制的路线ID
var trackInfoMap = {};//数据结构为：{trackId: [轨迹点list]}
var trackOptions = [];//list[map<id, name>]
/**
 * 上报巡航状态处理
 *  lCruiseStatus 巡航状态码
 */
function onCruiseStatus(ptzParam) {

    var cruiseStatus= Number(ptzParam["PTZStatus"]["Status"]),
        curTrackId = Number(ptzParam["PTZStatus"]["Param1"]);
    
    //空闲状态，按钮显示“巡航”
    if (PTZ_STATE_CRUISE.IDLE == cruiseStatus || PTZ_STATE_CRUISE.IVA_PLAN == cruiseStatus ||
        PTZ_STATE_CRUISE.ECOMPASS_START == cruiseStatus) {
        var $ptzCruiseBody = $("#ptzCruiseBody").find("button.stop");
        $ptzCruiseBody.attr("title", $.lang.pub["start"]);
        $ptzCruiseBody.removeClass("stop").addClass("start");
        curCruiseTrackId = -1;
        if(-1 != curRecordTrackId)
        {//原先是录制，则停止录制后获取一下刚刚录制的数据
            //更新预置位列表
            top.banner.video.resetCombox();
            getTrackInfo();
            recodeBlock(false);           
            curRecordTrackId = -1;
            initCruiseInfo();
        }
        if (PTZ_STATE_CRUISE.ECOMPASS_START == cruiseStatus) {// 开始标定
            top.banner.updateBlock(true, $.lang.tip["tipOrienting"]);
        } else if (PTZ_STATE_CRUISE.IDLE == cruiseStatus) {
            top.banner.updateBlock(false);
        }
    } else if(PTZ_STATE_CRUISE.TRACK_RECORD == cruiseStatus)  {//恢复记录状态
        $("#cruiseTab").trigger("click");
        curRecordTrackId = curTrackId;
        recodeBlock(true);
    } else if(PTZ_STATE_CRUISE.MANUAL_CRUISE == cruiseStatus){ //手动巡航状态
        curCruiseTrackId = curTrackId;
        var $Cruise = $("#ptzCruiseBody").find("div[data-id='" + curCruiseTrackId + "'] button.start");
        $Cruise.attr("title", $.lang.pub["stop"]);
        $Cruise.removeClass("start").addClass("stop");
    }
    
}

//初始化巡航路线信息
function initCruiseInfo()
{
    var ptzStatusMap = {};
    getTrackInfo();
    initTrackTable("ptzCruiseBody");
    
    //获取云台状态
    if (LAPI_GetCfgData(LAPI_URL.PTZStatus,ptzStatusMap)) {
        if (7 == ptzStatusMap["StatusID"]) {
            onCruiseStatus(ptzStatusMap["StatusParam"]);
        }
    }
}

//编辑巡航路线
function editCruise(obj){
    var curTrackId = Number($(obj).parents("div.ptz-acc-item").attr("data-id")),
        curTrackName = $(obj).parents("div.ptz-acc-item").children("span.ptz-acc-span").attr("title");
    parent.openWin($.lang.pub["modify"], "cruise_edit.htm?type=0&trackId="+curTrackId + "&trackName=" + curTrackName, 750, 500, false, "40%", "25%");
    
    
}

//删除巡航路线
function removeCruise(obj)
{
    var curTrackId = Number($(obj).parents("div.ptz-acc-item").attr("data-id")),
        recode;
    
    if (!confirm($.lang.tip["tipConfirmDel"]))return;
    if (curTrackId == curCruiseTrackId) {
        LAPI_SetCfgData(LAPI_URL.PTZStopPatrolRoute, {"RouteID":curTrackId},false);
    }

    recode = LAPI_DelCfgData(LAPI_URL.PTZPatrolRoute + "/" + curTrackId,{},false,patrolCallback);

    if (recode) {
        $(obj).parents("div.ptz-acc-item").remove();
        for (var i = 0, len = trackOptions.length; i < len; i++) {
            if (curTrackId == trackOptions[i]["id"]){
                trackOptions.splice(i, 1);
                break;
            }
        }
    }
}

function patrolCallback(recode){
   if (4970 == recode){
        alert($.lang.tip["tipTrackBeUsed"]);
    }
}

/**
 * 巡航启动/停止
 */
function onClickCruise(obj)
{
    var curTrackId = Number($(obj).parents("div.ptz-acc-item").attr("data-id")),
        isStop = (-1 != curCruiseTrackId),
        isStart = (curCruiseTrackId != curTrackId);
    
    //停止巡航
    if (isStop) {
        LAPI_SetCfgData(LAPI_URL.PTZStopPatrolRoute, {"RouteID":curCruiseTrackId},false);
    }
    
    //启动巡航（之前未启动或新启动一个巡航）
    if (isStart) {
        //如果智能分析启用，提示其到场景巡航页面关闭智能分析
        if (top.ivaEnable) {
            alert($.lang.tip["tipStopCruiseFirst"]);
            return;
        }
        LAPI_SetCfgData(LAPI_URL.PTZStartPatrolRoute, {"RouteID":curTrackId},false);
    }
}

/**
 * 获取轨迹点列表
 */
function getTrackInfo()
{
    var tmpMap = {},jsonMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.PTZPatrol,jsonMap))
    {
        return;
    }
    for(var m = 0;m < jsonMap["RouteNum"]; m++){
        tmpMap["Track"+(m+1)+"CruiseNum"] = jsonMap["Route"][m]["PointNum"];
        tmpMap["Track"+(m+1)+"TrackId"] = jsonMap["Route"][m]["RouteID"];
        tmpMap["Track"+(m+1)+"TrackName"] = jsonMap["Route"][m]["RouteName"];
       for(var n = 0;n < jsonMap["Route"][m]["PointNum"]; n++){
           tmpMap["Track"+(m+1)+"Action" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Action"];
           tmpMap["Track"+(m+1)+"Duration" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Duration"];
           tmpMap["Track"+(m+1)+"Speed" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Speed"];
       }
    }
    trackOptions = [];
    trackInfoMap = {};
    for(var i=1; (undefined != tmpMap["Track"+i+"TrackId"]); i++)
    {
        //巡航路线下拉列表项
        var preId = "Track"+i;
        var trackId = tmpMap[preId+"TrackId"];
        var optionMap = {};
        optionMap["id"] = trackId;
        optionMap["name"] = tmpMap[preId+"TrackName"];
        trackOptions.push(optionMap);
        //巡航路线轨迹点列表
        var trackInfoList = [];
        for(var j=1; j<=tmpMap[preId+"CruiseNum"]; j++)
        {
            var trackInfo = {};
            trackInfo["PresetId"] = tmpMap[preId+"PresetId"+j];
            trackInfo["Action"] = tmpMap[preId+"Action"+j];
            trackInfo["StayTime"] = tmpMap[preId+"StayTime"+j];
            trackInfo["Duration"] = tmpMap[preId+"Duration"+j];
            if(772 == trackInfo["Action"]){
	        trackInfo["Action"] = 770;
	    }
            if(770 == trackInfo["Action"]){
                trackInfo["Duration"] = tmpMap[preId+"Duration"+j]/100;
            }
            trackInfo["Speed"] = tmpMap[preId+"Speed"+j];
            trackInfoList.push(trackInfo);
        }
        trackInfoMap[trackId] = trackInfoList;
    }
}

//记录遮盖
function recodeBlock(bool)
{
    if(bool)
    {
        top.banner.blockDiv(true);
        top.banner.video.$("#blockDiv").css("display", "block");
        $("#blockDiv").css("display","block");
        $("#blockDiv_1").css("display","block");
        $("#record").removeClass("record-start").addClass("stop");
    } else {
        top.banner.blockDiv(false);
        top.banner.video.$("#blockDiv").css("display", "none");
        $("#blockDiv").css("display","none");
        $("#blockDiv_1").css("display","none");
        $("#record").removeClass("stop").addClass("record-start");
    }
}

//开始/停止录制
function recordTrack()
{
    var recode = 0,
        i,
        len;
    
    if (-1 != curRecordTrackId) {
        LAPI_SetCfgData(LAPI_URL.PTZStopPatrolRouteRecord, {"RouteID":curRecordTrackId},false);
        
    } else {
        curRecordTrackId = 1;
        for (i = 0, len = trackOptions.length; i < len; i++) {
            if (curRecordTrackId == trackOptions[i]["id"]) {
                curRecordTrackId++;
            }
        }
        if(16 < curRecordTrackId) {//不能超过16个
            curRecordTrackId = -1;
            alert($.lang.tip["tipTrackFull"]);            
            return false;
        }
        LAPI_SetCfgData(LAPI_URL.PTZStartPatrolRouteRecord, {"RouteID":curRecordTrackId},false);
    }
    return (ResultCode.RESULT_CODE_SUCCEED == recode);
}


//显示巡航轨迹的列表
function initTrackTable(trackTblId)
{
    var len = trackOptions.length,
        i = 0,
        trackOption = null,
        trackInfo = null,
        firstAction = null,
        contentHtml = "";

    var $trackTblId = $("#" + trackTblId);
    $trackTblId.empty();
    for (; i<len; i++) {
        trackOption = trackOptions[i];
        trackInfo = trackInfoMap[trackOption["id"]];
        if( 0 == trackInfo.length) continue;
        firstAction = trackInfo[0]["Action"];                
        contentHtml = "<div class='ptz-acc-item' data-id='"+ trackOption["id"]+"'>" + "<div class='mid_right'>" +
                                "<button class='icon start' hidefocus='true' onclick='onClickCruise(this)' title='" + $.lang.pub["start"] + "'></button>" ;
        if (UserType.Administrator == top.userType) {
            if ((firstAction < modeRouteRange.Start) || ( firstAction > modeRouteRange.End))
            {
                contentHtml += "<button class='icon black-edit' hidefocus='true' onclick='editCruise(this)' title='" + $.lang.pub["modify"] + "'></button>";
            }   
            contentHtml +="<button class='icon black-del' hidefocus='true' onclick='removeCruise(this)' title='" + $.lang.pub["delete"] + "'></button>" ;
        }
        contentHtml += "</div>" + "<span class='ptz-acc-desc'>" + trackOption["id"] +"</span>" ; 
        if ((firstAction < modeRouteRange.Start) || ( firstAction > modeRouteRange.End)){
            contentHtml += "<span class='ptz-acc-span' title='"+trackOption["name"]+"'>[" + trackOption["name"] +"]</span>" +"</div>";
        } else {
            contentHtml += "<span class='ptz-acc-span' title='"+$.lang.pub["modeRoute"]+trackOption["name"]+"'>[" +$.lang.pub["modeRoute"]+ trackOption["name"] +"]</span>" +"</div>";
        }
                            
        $trackTblId.append(contentHtml);
    }

}