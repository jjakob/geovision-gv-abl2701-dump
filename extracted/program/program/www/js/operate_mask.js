
GlobalInvoke(window);
//加载语言文件
loadlanguageFile(top.language);

var channelId = 0;
var osdCoverNum = top.banner.coverOsdNum;//遮盖osd个数
var osdColorList = ["CC66FF","FF6633","0099FF","339933","CC0033","6666CC","FFFF66","99CC00",
                    "CC66FF","FF6633","0099FF","339933","CC0033","6666CC","FFFF66","99CC00",
                    "CC66FF","FF6633","0099FF","339933","CC0033","6666CC","FFFF66","99CC00"];
var tmpMap = {
        "Enable" : 1,
        "Area" : {
            "TopLeft" : {
                "X" : 0,
                "Y" : 0
            },
            "BotRight" : {
                "X" : 10,
                "Y" : 10
            }
        }
    };
var drawCount = 0;
var video = top.banner.video;   //播放器
var Is3DCover = top.banner.isSupport3DCover; //是否支持3D遮盖
var posMap = {};//上次遮盖的坐标
var isFirstDraw = true; //是否第一次画（3D遮盖时用）
var CoverOsdMap = {};
var CoverOsdList = [];
var CoverDataView = null;
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {};
var CoverOsdZoomMap_bak = {};
var CoverOsdZoomMap = {};
var mappingMap_3DOSD = {};
//创建场景管理表格需要的表头信息
var headInfoList = [
    { 
        fieldId: "CoverEnable",
        hidden:true,
        hiddenFillter: 0
    },
    { 
        fieldId: "CoverLeft",
        fieldType: "text",
        hidden:true
    },
    { 
        fieldId: "CoverTop",
        fieldType: "text",
        hidden:true
    },
    { 
        fieldId: "CoverRight",
        fieldType: "text",
        hidden:true
    },
    { 
        fieldId: "CoverBottom",
        fieldType: "text",
        hidden:true
    },
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "name"
    },
    {
        fieldId: "Zoom",
        fieldType: "text",
        hidden: !(Is3DCover && (1 == top.banner.ptzType)),
        eventMap: {
            "onchange": changeZoom
        }
    },
    {
        fieldId : "option",
        fieldType : "option",
        hidden: !(Is3DCover && (1 == top.banner.ptzType)),
        option : "<span class='button hidden' id='getZoom#rowNum'>" +
                    "<span class='btn_l'></span>" +
                    "<button type='button' rowNum=#rowNum onclick='setCurrentZoom($(this).attr(\"rowNum\"))'>"+$.lang.pub["setAsCurrentZoom"]+"</button>" +
                    "<span class='btn_r'></span>" +
                 "</span>" +
                 "<span class='button hidden' id='gotoAreaPos#rowNum'>" +
                     "<span class='btn_l'></span>" +
                     "<button type='button' rowNum=#rowNum onclick='presetCoverArea($(this).attr(\"rowNum\"))'>"+$.lang.pub["cruisePreset"]+"</button>" +
                     "<span class='btn_r'></span>" +
                 "</span>&nbsp;"
    }
];

/************************************* 数据处理 **********************************************/
function changeDataToList() {
    var dataMap = {},
        i,
        j = 0,
        flag;
    
    CoverOsdList = [];
    for(i = 0; i < osdCoverNum; i++) {
        dataMap = {};
        flag = false;
        for(j = 0; j < jsonMap["AreaNum"]; j++) {
            if(i == CoverOsdMap["Index" + j]) {
                flag = true;
                break;
            }
        }
        dataMap["name"] = $.lang.pub["coverOsd"] + (i + 1);
        dataMap["CoverEnable"] = (flag ? CoverOsdMap["CoverEnable" + j] : 0);
        dataMap["CoverLeft"] = (flag ? CoverOsdMap["CoverLeft" + j] : 0);
        dataMap["CoverTop"] = (flag ? CoverOsdMap["CoverTop" + j] : 0);
        dataMap["CoverRight"] = (flag ? CoverOsdMap["CoverRight" + j] : 1000);
        dataMap["CoverBottom"] = (flag ? CoverOsdMap["CoverBottom" + j] : 1000);
        if (Is3DCover && (1 == top.banner.ptzType)) {
            dataMap["Zoom"] = CoverOsdMap["Zoom" + i];
        }
        CoverOsdList.push(dataMap);
    }
    return CoverOsdList;
}
/************************************* end **********************************************/
// 增加遮盖osd
function addCoverArea() {
    var drawObjParam = {},
        j = 0,
        SelectNum = jsonMap["AreaNum"];
    if (jsonMap["AreaNum"] == osdCoverNum) {
        top.banner.showMsg(true, $.lang.tip["tipUpperMaskInfo"], 0);
        return;
    }
    for(; j < jsonMap["AreaNum"]; j++) {
        if(j != jsonMap["CoverOSD"][j]["Index"]) {
            SelectNum = j;
            break;
        }
    }
    //下发配置
    tmpMap["Area"]["TopLeft"]["X"] = 0;
    tmpMap["Area"]["TopLeft"]["Y"] = 0;
    tmpMap["Area"]["BotRight"]["X"] = 10;
    tmpMap["Area"]["BotRight"]["Y"] = 10;
    
    if (LAPI_CreateCfgData(LAPI_URL.Cover_OSD, tmpMap)) {
        initData();
        initOsdDrawObjData();
        if (1 == jsonMap["AreaNum"]) {
            repareCoverOsdPos();
            isFirstDraw = true;
        }
        $("#dataview_tbody").find("tr[rowNum='" + SelectNum + "']").click();
    }
}

// 删除遮盖osd
function removeCoverArea() {
    var DeleteMap = {};
    var index = CoverDataView.currectRow;
    // 下发配置
    CoverOsdList[index]["CoverEnable"] = 0;
    if (Is3DCover && (1 == top.banner.ptzType)) {
        CoverOsdList[index]["Zoom"] = 100;
        $("#Zoom" + index).val("1.00");
    }
    
    
    if(LAPI_DelCfgData(LAPI_URL.Cover_OSD+"/" + index, DeleteMap)) {
        if (Is3DCover && (1 == top.banner.ptzType)) {
            submitF_osdZoom()
        }
        initData();
        if(top.banner.isOldPlugin && !top.banner.isMac){
            initOsdDrawObjData();
            showHiddenArea(DrawType.RECT, index, 0);
        }else{
            delDrawObj(DrawType.RECT, index);
        }
        var $dataviewTbody = $("#dataview_tbody");
        if ($dataviewTbody.find("tr:visible").length > 0) {
            index = $dataviewTbody.find("tr:visible").get(0).getAttribute("rowNum");
            $dataviewTbody.find("tr[rowNum='" + index + "']").click();
        }
    }
}
    
// 预置到遮盖osd
function presetCoverArea(index) {

    if (!submitCtrolCmd(0x8000,index)){
        alert($.lang.tip["tipPresetMaskFailed"]);
    }
}

function changeZoom(){
    var event = getEvent(),
        oSrc = event.srcElement? event.srcElement : event.target,
        id = oSrc.id,
        rowNum = Number(id.replace("Zoom", ""));
    
    // 参数校正
    var $id = $("#" + id);
    var v = $id.val();
    if (isNaN(v)) {
        v = 1.00;
    } else {
        v = (1 > Number(v))? 1.00 : parseFloat(v); 
    }
    $id.val(v.toFixed(2));
    CoverOsdList[rowNum]["Zoom"] = Number($id.val()) * 100;
    submitF_osdZoom();
}

function setCurrentZoom(rowNum) {
    var tmpMap = {},
        v;
    if(!LAPI_GetCfgData(LAPI_URL.PTZAbsZoom,tmpMap)){
        top.banner.showMsg(false, $.lang.tip["tipGetPtzPosErr"]);
        return;
    }
    v = Number(tmpMap["StatusParam"]["PTZAbsZoom"]["PTZZoomNum"]).toFixed(2);
    $("#Zoom" + rowNum).val(v);
    CoverOsdList[rowNum]["Zoom"] = v * 100;
    submitF_osdZoom();
}

// 判断某个元素是否包含在list中
function isContain(list, elem) {
    
    for (var i=0,len=list.length; i<len; i++) {
        
        if(elem == list[i]) {
            return true;
        }
    }
    return false;
}

function submitF_osdZoom() {
    var i;
    for(i = 0; i < osdCoverNum; i++) {
        CoverOsdZoomMap["AreaZooms"][i]["Zoom"] = CoverOsdList[i]["Zoom"];
        CoverOsdZoomMap["AreaZooms"][i]["AreaID"] = i;
    }
    if (!LAPI_SetCfgData(LAPI_URL.CoverOSDZooms,CoverOsdZoomMap)) {
        return;
    }
}

/********************************* 上报事件 start ****************************/
//坐标上报事件
function eventDrawObjParam(type, num, strParam) {
    var posMap = {},
        paramMap,
        n,
        startX,
        startY,
        endX,
        endY,
        pos;
    
    paramMap = DrawObjMap[type][num];
    if(top.banner.isOldPlugin && !top.banner.isMac){
        sdkAddCfg(posMap, strParam);
    }else{
        posMap = $.parseJSON(strParam);
    }
    
    //更新新图形的坐标
    for (n in posMap) {
        paramMap[n] = Number(posMap[n]);
    }
    tmpMap["Index"] = num;
    tmpMap["Enable"] = 1;
    tmpMap["Area"]["TopLeft"]["X"] = Math.round(paramMap["Left"]/100);
    tmpMap["Area"]["TopLeft"]["Y"] = Math.round(paramMap["Top"]/100);
    tmpMap["Area"]["BotRight"]["X"] = Math.round(paramMap["Right"]/100);
    tmpMap["Area"]["BotRight"]["Y"] = Math.round(paramMap["Bottom"]/100);
    LAPI_SetCfgData(LAPI_URL.Cover_OSD+"/" + num, tmpMap);
    initData();
    eventSelDrawObj(type, num);
}

 //选中上报事件
function eventSelDrawObj(type, num) {
    $("#dataview_tbody").find("tr[rowNum='"+num+"']").trigger("click");
}
/******************************* 上报事件 end *******************************/
function release(){
    EnableDrawFun(StreamType.LIVE, 0);
    parent.hiddenVideo();
}

// 3D遮盖mapping
function mappingMapFn(map) {
    mappingMap_3DOSD = {};
    for(var i=0;i<map["AreaNum"];i++){
        mappingMap_3DOSD["AreaId" + i] = ["Areas",i,"AreaID"];
        mappingMap_3DOSD["CoverLeft" + i] = ["Areas",i,"CoverPosition","TopLeft","X"];
        mappingMap_3DOSD["CoverTop" + i] = ["Areas",i,"CoverPosition","TopLeft","Y"];
        mappingMap_3DOSD["CoverRight" + i] = ["Areas",i,"CoverPosition","BotRight","X"];
        mappingMap_3DOSD["CoverBottom" + i] = ["Areas",i,"CoverPosition","BotRight","Y"];
    }
}
//修正遮盖osd的位置(3D遮盖)
function repareCoverOsdPos()
{
    if(!Is3DCover || (0 == $("#dataview_tbody").find("tr:visible").length))return;
    var flag = false;
    var tmpMap={};
    var jsonMap={};
    var drawObjParam = {};
    var drawIndex = 0;
    var areaNum = 0;

    var isGetDataOk;
    var isModefyFlag = false;

   
        

    if (LAPI_GetCfgData(LAPI_URL.OSD3DCoverPosition,jsonMap)) {
        mappingMapFn(jsonMap);
        changeMapToMapByMapping(jsonMap,mappingMap_3DOSD,tmpMap,0);

        for(var n in tmpMap)
        {
            if(!flag && (posMap[n] != tmpMap[n]))
            {
                flag = true;
            }
            posMap[n] = tmpMap[n];
            
        }
        //第一次时始终画
        if(isFirstDraw)
        {
            flag = true;
            isFirstDraw = false;
        }
        
        if(flag)
        {
            areaNum = jsonMap["AreaNum"];
            
            for(var i=0; i<areaNum; i++)
            {
                var isShow = 1;
                //设置框体大小
                var pos = tmpMap["CoverLeft"+i]+","+
                        tmpMap["CoverTop"+i]+","+
                        tmpMap["CoverRight"+i]+","+
                        tmpMap["CoverBottom"+i];
                if("0,0,0,0" == pos)
                {//不在该视野
                    isShow = 0;
                }
                drawIndex = Number(tmpMap["AreaId"+i]);
                drawObjParam = DrawObjMap[DrawType.RECT][drawIndex];
                drawObjParam["Left"] = Number(tmpMap["CoverLeft"+i])*100;
                drawObjParam["Top"] = Number(tmpMap["CoverTop"+i])*100;
                drawObjParam["Right"] = Number(tmpMap["CoverRight"+i])*100;
                drawObjParam["Bottom"] = Number(tmpMap["CoverBottom"+i])*100;
                if(top.banner.isOldPlugin && !top.banner.isMac){
                    isModefyFlag = setDrawObj(DrawType.RECT, drawIndex, DrawObjMap);
                }else{
                    isModefyFlag = ModifyDrawObj(DrawType.RECT, drawIndex, DrawObjMap);
                }
                if (isModefyFlag)
                {
                    showHiddenArea(DrawType.RECT, drawIndex, isShow);
                }
                else
                {
                    isFirstDraw = true;
                }
            }
        }
    }
    setTimeout("repareCoverOsdPos()", 1000);
}



function initPage(){
    if (Is3DCover && (1 == top.banner.ptzType)) {
        $("*[name='coverName']").css("width", "140px");
        $("*[name='zoom']").removeClass("hidden");
        $("*[name='operateTD']").removeClass("hidden");
    }
    resetVideoSize(StreamID.MAIN_VIDEO, "recordManager_div_activeX");
    
    if (2 == parent. getCfg("style")) {
        $("body").css("backgroundColor", "#f1f2f3");
    }
    initVideo("recordManager_div_activeX", StreamType.LIVE, RunMode.CONFIG, null, top.banner.isSupportPTZ,initVideo_callback);
}

function initEvent(){
    $("#addCover").bind("click", addCoverArea);
    $("#delCover").bind("click", removeCoverArea);
}

function showAllArea(){
    var i,
        isShow;
    
    for (i = 0; i < jsonMap["AreaNum"]; i++) {
        isShow = 0;
        if (!Is3DCover && (1 == CoverOsdMap["CoverEnable"+i])) {
                isShow = 1;
        }
        showHiddenArea(DrawType.RECT, CoverOsdMap["Index" + i], isShow);
    }
}

//初始化OSD框体的数据
function initOsdDrawObjData() {
    var drawObjParam,
        i,
        j,
        color,
        name= (LANG_TYPE.Chinese == top.language) ? $.lang.pub["coverOsd"] :"Mask";
    DrawObjMap = {};
    DrawObjMap[DrawType.RECT] = [];
    
    for (i = 0; i < osdCoverNum; i++) {
        drawObjParam = {};
        flag = false;
        for(j = 0; j < jsonMap["AreaNum"]; j++) {
            if(i == CoverOsdMap["Index" + j]) {
                flag = true;
                break;
            }
        }
        drawObjParam["Text"] = name + (i+1);
        drawObjParam["Left"] = (flag ? Number(CoverOsdMap["CoverLeft" + j])*100 : 0);
        drawObjParam["Top"] = (flag ? Number(CoverOsdMap["CoverTop" + j])*100 : 0);
        drawObjParam["Right"] = (flag ? Number(CoverOsdMap["CoverRight" + j])*100 : 1000);
        drawObjParam["Bottom"] = (flag ? Number(CoverOsdMap["CoverBottom" + j])*100 : 1000);
        drawObjParam["LineColor"] = getDrawObjColor(osdColorList[i]);
        drawObjParam["LineWidth"] = 2;
        DrawObjMap[DrawType.RECT].push(drawObjParam);
    }
    
    initDrawObj(DrawObjMap, showAllArea);
}

//初始化场景管理表格
function initDataView() {

    CoverDataView = new DataView("dataview_tbody", changeDataToList, headInfoList);
    if (Is3DCover && (1 == top.banner.ptzType)) {
        CoverDataView.setFields( {
            Zoom : function(data) {
                return (Number(data)/100).toFixed(2);
            }
        });
    }
    CoverDataView.setTrEvnet({
        "onclick": function(){
            var event = getEvent(),
                node = event.srcElement? event.srcElement : event.target,
                rowNum,
                oldRowNum = CoverDataView.currectRow;
            
            
            if (("TR" == node.tagName) || ("TD" == node.tagName)) {
                rowNum = $(node).attr("rowNum");
            } else if ("A" == node.tagName){
                return;
            } else {
                rowNum = $(node).parents("td").attr("rowNum");
            }
            
            if (oldRowNum == rowNum) {
                return;
            }
            
            if (-1 != oldRowNum) {
                
                if (Is3DCover && (1 == top.banner.ptzType)) {
                    $("#getZoom" + oldRowNum).addClass("hidden");
                    $("#gotoAreaPos" + oldRowNum).addClass("hidden");
                }
            }
            
            // 选中新行
            CoverDataView.checkRow(rowNum);
            if (Is3DCover && (1 == top.banner.ptzType)) {
                $("#getZoom" + rowNum).removeClass("hidden");
                $("#gotoAreaPos" + rowNum).removeClass("hidden");
            }
            selectDrawObj(DrawType.RECT, CoverDataView.currectRow);
        }
    });
    CoverDataView.createDataView();
}

function FullmappingMap() {
    var m;
    mappingMap = {};
    for (m = 0; m < jsonMap["AreaNum"]; m++) {
        mappingMap["Index" + m] = ["CoverOSD", m, "Index"];
        mappingMap["name" + m] = ["CoverOSD", m, "Name"];
        mappingMap["CoverEnable" + m] = ["CoverOSD", m, "Enable"];
        mappingMap["CoverLeft" + m] = ["CoverOSD", m, "Area", "TopLeft", "X"];
        mappingMap["CoverTop" + m] = ["CoverOSD", m, "Area", "TopLeft", "Y"];
        mappingMap["CoverRight" + m] = ["CoverOSD", m, "Area", "BotRight", "X"];
        mappingMap["CoverBottom" + m] = ["CoverOSD", m, "Area", "BotRight", "Y"];
    }
}

function initData()
{
    if (top.banner.isSupportFishEye && 10 != top.banner.DefaultStreamID) {
        $("#tipMsg").removeClass("hidden");
        disableAll();
        return;
    }
    jsonMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.PrivacyMask, jsonMap))
    {//支持遮盖osd，但获取失败
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    FullmappingMap();
    CoverOsdMap = {};
    if(0 == jsonMap["AreaNum"]) { 
        LAPI_CfgToForm("frmSetup", jsonMap);
    } else {
        LAPI_CfgToForm("frmSetup", jsonMap, CoverOsdMap, mappingMap);
    }
    //todo:待切换接口
    if (Is3DCover && (1 == top.banner.ptzType)) {
        if(!LAPI_GetCfgData(LAPI_URL.CoverOSDZooms,CoverOsdZoomMap)){
            disableAll();
            return;
        }

    

        CoverOsdZoomMap_bak = objectClone(CoverOsdZoomMap);
        for (var i= 0; i < CoverOsdZoomMap["Nums"]; i++) {
            CoverOsdMap["Zoom" + i] = CoverOsdZoomMap["AreaZooms"][i]["Zoom"];
        }
    }

    initDataView();
}

function initVideo_callback(streamType){
    EnableDrawFun(streamType, 1);
    initOsdDrawObjData();
    repareCoverOsdPos();
}

$(document).ready(function(){
    parent.selectItem("maskTab");//菜单选中
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initEvent();
    initData();
    afterDataLoad();
});