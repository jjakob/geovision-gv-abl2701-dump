// JavaScript Document
GlobalInvoke(window);
// 加载语言文件
loadlanguageFile(top.language);
var channelId = 0;
var dataMap = {};
var video = top.banner.video; // 播放器
var DrawObjMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var areaNum;  //最大区域数
var colorList = [ "CC66FF", "FF6633", "0099FF", "339933", "CC0033", "6666CC", "FFFF66", "99CC00" ];
var currentArea = null;   //当前选中区域
var drawObjType = DrawType.RECT;

function release() {
    EnableDrawFun(StreamType.LIVE, 0);
    parent.hiddenVideo();
}

//显示区域
function showArea() {
    var i, isShow = 0;

    for (i = 0; i < areaNum; i++) {
        isShow = 0;
        if (1 == dataMap[i]["Enable"]) {// 显示框体
            isShow = 1;
        }
        showHiddenArea(drawObjType, i, isShow);
    }
}

function SetSDKStr(obj){
    var n,
        str = "";
    for(n in obj){
        str += n + "=" + obj[n] + "&";
    }
    str = str.substring(0,str.length-1);
    return str;
}

// 参数下发
function submitF() {
    var flag;
    jsonMap["AreaInfos"] = dataMap;
    var isChange = !isObjectEquals(jsonMap,jsonMap_bak);
    if(isChange){
        flag = LAPI_SetCfgData(LAPI_URL.ROI, jsonMap);
        if(flag){
            jsonMap_bak = objectClone(jsonMap);
        }
    }else{
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
    }
    return flag;
}

// 坐标修正,返回值为false表示有过修正
function correctPos(map, rate, leftKey, rightKey, topKey, bottomKey) {
    var w = top.banner.video.videoWidth,
        h = top.banner.video.videoHeight,
        tmp = 0,
        flag = true;
    
    map[leftKey] = (map[leftKey] < 0) ? 0 : map[leftKey];
    map[topKey] = (map[topKey] < 0) ? 0 : map[topKey];
    map[rightKey] = (map[rightKey] > rate) ? 0 : map[rightKey];
    map[bottomKey] = (map[bottomKey] > rate) ? 0 : map[bottomKey];
    
    if (w * (Number(map[rightKey]) - Number(map[leftKey]))/rate < 16) {   // 宽度小于16px
        tmp = Math.ceil(Number(map[leftKey]) + (16 * rate)/w);  // 对右边的点进行修正
        if (tmp > rate) {
            map[leftKey] = Math.floor(Number(map[rightKey]) - (16 * rate)/w);
        } else {
            map[rightKey] = tmp;
        }
        flag = false;
    }
    
    if (h * (Number(map[bottomKey]) - Number(map[topKey]))/rate < 16) {   // 高度小于16px
        tmp = Math.ceil(Number(map[topKey]) + (16 * rate)/h);  // 对下边的点进行修正
        if (tmp > rate) {
            map[topKey] = Math.floor(Number(map[bottomKey]) - (16 * rate)/h);
        } else {
            map[bottomKey] = tmp;
        }
        flag = false;
    }
    
    return flag;
}
/** ******************************* 上报事件 start *************************** */
// 坐标上报事件
function eventDrawObjParam(type, num, strParam) {
    var posMap = {}, paramMap, n;

    paramMap = DrawObjMap[type][num];
    if(top.banner.isOldPlugin && !top.banner.isMac){
        sdkAddCfg(posMap, strParam);
    }else{
        posMap = $.parseJSON(strParam);
    }
    
    if (!correctPos(posMap, 10000, "Left", "Right", "Top", "Bottom")) {
        DrawObjMap[DrawType.RECT][num]["Left"] = posMap["Left"];
        DrawObjMap[DrawType.RECT][num]["Top"] = posMap["Top"];
        DrawObjMap[DrawType.RECT][num]["Right"] = posMap["Right"];
        DrawObjMap[DrawType.RECT][num]["Bottom"] = posMap["Bottom"];
        if(top.banner.isOldPlugin && !top.banner.isMac){
            setDrawObj(DrawType.RECT, 0, DrawObjMap);
        }else{
            ModifyDrawObj(DrawType.RECT, 0, DrawObjMap);
        }
    }

    // 更新新图形的坐标
    for (n in posMap) {
        paramMap[n] = Number(posMap[n]);
    }

    dataMap[num]["Area"]["TopLeft"][ "X"] = Math.round(paramMap["Left"] / 100);
    dataMap[num]["Area"]["TopLeft"][ "Y"] = Math.round(paramMap["Top"] / 100);
    dataMap[num]["Area"]["BotRight"][ "X"] = Math.round(paramMap["Right"] / 100);
    dataMap[num]["Area"]["BotRight"][ "Y"] = Math.round(paramMap["Bottom"] / 100);
    submitF();
}

// 选中上报事件
function eventSelDrawObj(type, num) {
    selectArea(num);
}
/** ******************************* 上报事件 end *************************** */
function initRoiDrawObjData() {
    var drawObjParam = {},
        i,
        color,
        name = $.lang.pub["area"],
        index;
    DrawObjMap = {};
    DrawObjMap[DrawType.RECT] = [];
    for(i = 0; i < areaNum; i++){
        drawObjParam = {};
        index = i + 1;
        color = colorList[i];
        drawObjParam["Text"] = name + index;
        drawObjParam["Left"] = Number(dataMap[i]["Area"]["TopLeft"][ "X"]) * 100;
        drawObjParam["Top"] = Number(dataMap[i]["Area"]["TopLeft"][ "Y"]) * 100;
        drawObjParam["Right"] = Number(dataMap[i]["Area"]["BotRight"][ "X"]) * 100;
        drawObjParam["Bottom"] = Number(dataMap[i]["Area"]["BotRight"][ "Y"]) * 100;
        drawObjParam["LineColor"] = getDrawObjColor(color);
        drawObjParam["LineWidth"] = 2;

        DrawObjMap[DrawType.RECT].push(drawObjParam);
    }

    initDrawObj(DrawObjMap, showArea);
}
//区域选中
function selectArea(index) {
    if (null != currentArea) {
        $("#areaTR" + currentArea).removeClass("selectedTR");
        $("#selectDiv" + currentArea).removeClass("selectedDiv");
    }
    currentArea = index;
    $("#areaTR" + currentArea).addClass("selectedTR");
    $("#selectDiv" + currentArea).addClass("selectedDiv");
    selectDrawObj(drawObjType, currentArea);
}
// 增加区域
function addArea() {
    var drawObjParam = {}, i;

    for (i = 0; i < areaNum; i++) {
        if ($("#areaTR" + i).is(":hidden")) {
            break;
        }
    }
    if (i == areaNum) {
        top.banner.showMsg(true, $.lang.pub["tipUpperROIAreaInfo"], 0);
        return;
    }
    dataMap[i]["Enable"] = 1;
    // 下发配置
    if (!submitF()){
        return;
    }

    drawObjParam = DrawObjMap[drawObjType][i];
    drawObjParam["Left"] =  Number(dataMap[i]["Area"]["TopLeft"][ "X"]) * 100;
    drawObjParam["Top"] = Number(dataMap[i]["Area"]["TopLeft"][ "Y"]) * 100;
    drawObjParam["Right"] = Number(dataMap[i]["Area"]["BotRight"][ "X"]) * 100;
    drawObjParam["Bottom"] = Number(dataMap[i]["Area"]["BotRight"][ "Y"]) * 100;
    setDrawObj(drawObjType, i, DrawObjMap);
    showHiddenArea(drawObjType, i, 1);
    $("#areaTR" + i).removeClass("hidden");
    selectArea(i);
}
//删除区域
function removeArea(index) {
    dataMap[index]["Enable"] = 0;
    // 下发配置
    if (!submitF()){
        return;
    }

    // 如果删除的是当前选中行，则选中第一行
    if (index == currentArea && null != currentArea) {
        currentArea = null;
        for ( var i = 0; i < areaNum; i++) {
            if (1 == dataMap[i]["Enable"]) {
                selectArea(i);
                break;
            }
        }
    }
    $("#areaTR" + index).addClass("hidden");
    showHiddenArea(drawObjType, index, 0);
}

//初始化区域列表
function initAreaList() {
    for ( var i = 0; i < areaNum; i++) {
        var color = colorList[i];
        var text = $.lang.pub["area"];
        var isShow = (1 == dataMap[i]["Enable"]) ? "" : "hidden";
        var html = "<tr id='areaTR" + i + "' class='" + isShow + "'>" + "<td onclick='selectArea(" + i + ");' >"
                   + "<div id='selectDiv" + i + "' class='unselectDiv'>"
                   + "<div class='colorDiv' style='background-color: #" + color + "'></div>" + "</div>" + "</td>"
                   + "<td onclick='selectArea(" + i + ");' >" + text + (i + 1) + "</td>"
                   + "<td align='right'>" + "<a class='icon black-del' onclick='removeArea(" + i + ");this.blur();' "
                   + "title='" + $.lang.pub["del"] + "'></a></td></tr>";
        $("#areaTbl").append(html);
    }
}
//TopLeft{X,Y}数据结构与Left,Right形式结构转换
function changeDataMap(map,changeMap,type){
    if(0 == type){
        changeMap["left"] = map["TopLeft"]["X"];
        changeMap["right"] = map["TopLeft"]["Y"];
        changeMap["topX"] = map["BotRight"]["X"];
        changeMap["bottom"] = map["BotRight"]["Y"];
    }else{
        map["TopLeft"]["X"] = changeMap["left"];
        map["TopLeft"]["Y"] = changeMap["right"];
        map["BotRight"]["X"] = changeMap["topX"];
        map["BotRight"]["Y"] = changeMap["bottom"];
    }

}
function initData() {
    var changeMap = {};
    jsonMap = {};
    dataMap = [];
    document.onkeydown = shieldEsc;
    if(!LAPI_GetCfgData(LAPI_URL.ROI,jsonMap)) {
        disableAll();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
    }
    jsonMap_bak = objectClone(jsonMap);
    areaNum = top.banner.RoiAreaNum;
    dataMap = jsonMap["AreaInfos"];
    for(i = 0; i < areaNum ; i++){
        changeDataMap(dataMap[i]["Area"],changeMap,0);
        correctPos(changeMap, 100, "left", "topX", "right", "bottom");
        changeDataMap(dataMap[i]["Area"],changeMap,1);
    }
    initAreaList();
}

function initVideo_callback(streamType) {
    EnableDrawFun(streamType, 1);
    initRoiDrawObjData();
}

function initPage() {
    $("#add").attr("title", $.lang.pub["add"]);
    resetVideoSize(StreamID.MAIN_VIDEO, "recordManager_div_activeX");
}

function initEvent() {
    $("#add").bind("click", function(){
        addArea();
        this.blur();
    });
}

$(document).ready(function() {
    parent.selectItem("roiTab");// 选中菜单
        beforeDataLoad();
        // 初始化语言标签
        initLang();
        initPage();
        initEvent();
        initData();
        initVideo("recordManager_div_activeX", StreamType.LIVE, RunMode.CONFIG, null, false, initVideo_callback);
        afterDataLoad();
    });