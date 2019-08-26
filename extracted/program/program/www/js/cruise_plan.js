// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var trackOptions = [];// list[map<id, name>]
var planType = PlanType.CRUISE;
var planMap = {};
var currentWeek = 1;//星期一
//加载语言文件
loadlanguageFile(top.language);
var CopyWeek = 0; //被拷贝的weekId（1：周一， ...，7：周日）
var TimeOverlap = $.lang.tip["tipTimeOverlap"];
var WeekDay = [$.lang.pub["monday"], $.lang.pub["tuesday"],
        $.lang.pub["wednesday"], $.lang.pub["thursday"],
        $.lang.pub["friday"], $.lang.pub["saturday"], $.lang.pub["sunday"]];

var temMap = {};
var weekDay = 8;

/**
 * @return {boolean}
 */
function ValidTimeRange() {
    var arrbt = [],
        arret = [],
        track = [],
        i;
                
    for (i = 0; i < weekDay; i++) {
        arrbt[i] = $("#StartTime" + (i+1)).val();
        arret[i] = $("#EndTime" + (i+1)).val();
        track[i] = $("#Track" + (i+1)).val();
                    
        if(("" == arrbt[i] && "" == arret[i])) {
            // 时间为空路线不为空
            if (0 != track[i]) {
                alert($.lang.tip["tipTimeFormatErr1"].replace("%s",WeekDay[currentWeek-1]));
                return false;
            }
        } else if (0 == track[i]) { // 时间不为空路线为空时
            alert($.lang.tip["tipCruisePlanRouteErr"].replace("%s",WeekDay[currentWeek-1]));
            return false;
        } else {
            if(arrbt[i] >= arret[i]) {
                alert($.lang.tip["tipTimeFormatErrStartEnd"].replace("%s", WeekDay[currentWeek-1]));
                return false;
            }
        }
    }
    for (i = 0; i < weekDay; i++) {
        if (("" == arrbt[i] && "" == arret[i])) {
                continue;
            }

        for (var j=1; (i + j)<weekDay; j++) {
            var tmpbt = arrbt[i + j];
            var tmpet = arret[i + j];

            if (("" == tmpbt && "" == tmpet)) {
                continue;
            }

            if ((arrbt[i] >= tmpbt && arrbt[i] <= tmpet) ||
                (tmpbt >= arrbt[i] && tmpbt <= arret[i])) {
                alert(TimeOverlap.replace("%s", WeekDay[currentWeek-1]));
                return false;
            }
        }
    }

    //将合法的时间复制到隐藏控件中
    for(i = 1;i < (weekDay +1); i++) {
        var index = (currentWeek-1)*weekDay + i;
        $("#PlanStartTime"+index).val($("#StartTime"+i).val());
        $("#PlanEndTime"+index).val($("#EndTime"+i).val());
        $("#PlanTrack"+index).val($("#Track"+i).val());
    }
    return true;
}
            
function toggle(obj, weekId) {
    //验证时间是否非法
    if(!ValidTimeRange())return ;
    $("li.selected").removeClass("selected");
    $(obj).addClass("selected");
    currentWeek = weekId;
    //将weekId对应的隐藏控件中的值赋给界面
    for(var i = 1;i < 9; i++) {
        var index = (currentWeek-1)*weekDay+i;
        $("#StartTime"+i).val($("#PlanStartTime"+index).val());
        $("#EndTime"+i).val($("#PlanEndTime"+index).val());
        $("#Track"+i).val($("#PlanTrack"+index).val());
    }
}
        
function DoCopy() {
    if(!ValidTimeRange())return;
    CopyWeek = currentWeek;
}
        
function DoPaste() {
    if (CopyWeek != 0) {
        for(var i = 1;i < 9; i++) {
            var pasteindex = (currentWeek-1)*weekDay+i;
            var copyIndex = (CopyWeek-1)*weekDay+i;
            var $PlanStartTime = $("#PlanStartTime" + copyIndex);
            $("#PlanStartTime"+pasteindex).val($PlanStartTime.val());
            var PlanEndTime = $("#PlanEndTime" + copyIndex);
            $("#PlanEndTime"+pasteindex).val(PlanEndTime.val());
            var PlanTrack = $("#PlanTrack" + copyIndex);
            $("#PlanTrack"+pasteindex).val(PlanTrack.val());
            $("#StartTime"+i).val($PlanStartTime.val());
            $("#EndTime"+i).val(PlanEndTime.val());
            $("#Track"+i).val(PlanTrack.val());
        }
    }
}
/**
 * 获取轨迹点列表
 */
function getTrackInfo() {
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
            tmpMap["Track"+(m+1)+"StayTime" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["StayTime"];
            tmpMap["Track"+(m+1)+"Duration" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Duration"];
            tmpMap["Track"+(m+1)+"Speed" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Speed"];
        }
    }
    trackOptions = [];
    for ( var i = 1; (undefined != tmpMap["Track" + i + "TrackId"]); i++) {
        // 巡航路线下拉列表项
        var preId = "Track" + i;
        var trackId = tmpMap[preId + "TrackId"];
        var optionMap = {};
        optionMap["id"] = trackId;
        optionMap["name"] = tmpMap[preId + "TrackName"];
        trackOptions.push(optionMap);
    }
}

/**
 * 生成下拉框列表
 *
 * @param selectId
 * @param options
 */
function makeSelectList(selectId, options) {
    var select = $("#" + selectId);
    select.empty();
    select.append("<option value='0' selected='selected'>" + $.lang.pub["pleaseSelect"] + "</option>");
    for ( var i = 0, len = options.length; i < len; i++) {
        var option = options[i];
        if (!option)
            continue;
        var id = option["id"];
        var name = option["name"];
        var text = id + "[" + name + "]";
        var optionHtml = "<option value='" + id + "' title='" + text + "'>" + text + "</option>";
        select.append(optionHtml);
    }
}

// jquery验证初始化
function initValidator() {

}

function initPage() {
    var hiddenInputs = "";
    for(var i = 1; i < 57; i++) {
        hiddenInputs +="<input name='PlanStartTime" + i +
                            "' id='PlanStartTime" + i +
                            "' type='hidden' value=''/>" +
                        "<input name='PlanEndTime" + i +
                            "' id='PlanEndTime" + i +
                            "' type='hidden' value=''/>" + 
                        "<input name='PlanTrack" + i +
                            "' id='PlanTrack" + i +
                            "' type='hidden' value=''/>";
    }
    $("#hiddenInputsDiv").html(hiddenInputs);
}
            
function initEvent() {
}
            
function initData() {
    var i,jsonMap = {};
    temMap = {};

    //获取轨迹列表
    getTrackInfo();
    for (i = 1; i <= weekDay; i++) {
        makeSelectList("Track"+i, trackOptions);
    }
    
    if(!LAPI_GetCfgData(LAPI_URL.PTZPatrolWeekPlan,temMap)) {
        return;
    }

    for(var m = 0; m < 7;m++){
        for(var n = 0;n < weekDay; n++){
            var planMapIndex = m*weekDay +n + 1,
                temMapIndex = (m+1)% 7,  //对应json字符串的数组下标，json字符串的第0位对应的是周日
                timeSection = temMap["Day"][temMapIndex]["TimeSection"][n];
            planMap["PlanStartTime" + planMapIndex] = timeSection["Begin"];
            planMap["PlanEndTime" + planMapIndex] = timeSection["End"];
            planMap["PlanTrack" + planMapIndex] = timeSection["RouteID"];
        }
    }

    //兼容老配置
    for (i = 1; i < 57; i++) {
        if ("00:00:00" ==  planMap["PlanStartTime" + i] && "00:00:00" == planMap["PlanEndTime" + i]) {
            planMap["PlanStartTime" + i] = "";
            planMap["PlanEndTime" + i] = "";
            planMap["PlanTrack" + i] = 0;
        }
    }
    
    for(var n in planMap) {//将无效时间“24:00:00”转换为“”
        if("24:00:00" == planMap[n]) {
            planMap[n] = "";
        }
    }
    var retcode =LAPI_GetCfgData(LAPI_URL.PTZWeekPlanStatusPatrol,jsonMap);
    if(retcode) {
        planMap["PlanEnable"] =jsonMap["Enable"];
    } else {
        disableAll();
        return false;
    }
    cfgToForm(planMap, "frmSetup");
    //默认选中星期一
    $("a[class='selected']").removeClass("selected");
    $("#monday").addClass("selected");
    currentWeek = 1;
    //将weekId对应的隐藏控件中的值赋给界面
    for(i=1;i<9;i++) {
        $("#StartTime"+i).val($("#PlanStartTime"+i).val());
        $("#EndTime"+i).val($("#PlanEndTime"+i).val());
        $("#Track"+i).val($("#PlanTrack"+i).val());
    }
    return true;
}
            
function submitWinData() {
    var v;

    //验证时间是否非法
    if(!ValidTimeRange())return;
    var flag = false;
    formToCfg("frmSetup", planMap);
    var pcParam = "";
    for (var n in planMap) {//将“”转换为无效时间“24:00:00”
        v = planMap[n];
        if("" === v) {
            v = "24:00:00";
            planMap[n] = v;
        }
        pcParam += n+"="+v+"&";
    }
    for(var m = 0; m<7;m++){
        for(var n=0;n<weekDay; n++){
            var planMapIndex = m*weekDay +n + 1,
                temMapIndex = (m+1)% 7,  //对应json字符串的数组下标，json字符串的第0位对应的是周日
                timeSection = temMap["Day"][temMapIndex]["TimeSection"][n];
            timeSection["Begin"] = planMap["PlanStartTime" + planMapIndex];
            timeSection["End"] =planMap["PlanEndTime" + planMapIndex];
            timeSection["RouteID"] = planMap["PlanTrack" + planMapIndex];
        }
    }
    var retcode =LAPI_SetCfgData(LAPI_URL.PTZPatrolWeekPlan,temMap);
    if (retcode) {//刷新内存数据
        formToCfg("frmSetup", planMap);
         v = $("#PlanEnable").is(":checked")? 1 : 0;
        retcode =LAPI_SetCfgData(LAPI_URL.PTZWeekPlanStatusPatrol,{"Enable": v});
        if (retcode) {
            planMap["PlanEnable"] = v;
            flag = true;
        }
    }
    top.banner.showMsg(flag);
    if (flag) {
        parent.closeWin();
    }
}

$(document).ready(function() {
    beforeDataLoad();
    // 初始化语言标签
    initPage();
    initLang();
    initEvent();
    initValidator();
    initData();
    afterDataLoad();
    $("input[class='Wdate']").bind("focus", pickerTime);
});
