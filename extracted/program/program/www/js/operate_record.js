// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var RecordList = [];
var DownloadList = [];
var currentIndex = 0;
var LAPI_RecordDownload;

// 表头字段
var recordTh = ["IsSelect:radio","rowNum:label","StartTime:label","EndTime:label"];
var fieldList = ["Year", "Month", "MonthDay", "Hour", "Minute", "Second"];


//加载语言文件
loadlanguageFile(top.language);

function pickerTime(){
    var top = GetTopWindow();
    WdatePicker({
        skin: "whyGreen",
        dateFmt: "yyyy-MM-dd",
        lang: top.wdateLang,
        readOnly:true
    });
}

// 解析数据
function parseDataMapToList(map)
{
    for(var i = 0; i < map["RecordNum"]; i++)
    {
        var tempMap = [];
        for(var j=0; j<fieldList.length; j++)
        {
            var startTime = Number(map["RecordInfo"][i]["Begin"][fieldList[j]]);
            tempMap["Start"+fieldList[j]] = (startTime < 10)? "0"+startTime :startTime;

            var endTime = Number(map["RecordInfo"][i]["End"][fieldList[j]]);
            tempMap["End"+fieldList[j]] = (endTime < 10)? "0"+endTime :endTime;
        }
        RecordList.push(tempMap);
    }
}

// 创建表格
function createTable(thInfoList,dataList)
{
    //清空表格
    var tbl = document.getElementById("dataview_tbody");
    for(var len=tbl.rows.length; len>0; len--)
    {
        tbl.deleteRow(len-1);
    }

    for(var i=0,len=RecordList.length;i<len;i++)
    {
        createRow("dataview_tbody", i, recordTh, RecordList[i]);
    }
}

// 创建一行数据
function createRow(tblId,index,thInfoList,data)
{
    var tbl = document.getElementById(tblId);
    var tr = document.createElement("tr");
    tr.setAttribute("id","tr"+index);
    tr.onclick = function(){selectTR(this.id)};

    for(var i=0,len=thInfoList.length;i<len;i++)
    {
        var td = document.createElement("td");
        var arr = thInfoList[i].split(":");
        var id = arr[0];
        var tag = arr[1];

        var node = null;
        if("radio" == tag)
        {//input对象
            node = document.createElement("input");
            node.setAttribute("type",tag);
            node.setAttribute("id","chk"+index);
            node.setAttribute("name","chk");
        
            node.onclick = function(e){e && e.stopPropagation ? e.stopPropagation() : window.event.cancelBubble=true;};
        } else if("label" == tag)
        {//其他对象
            node = document.createElement(tag);
          /*  if ("Status" == id)
            {
                node.setAttribute("id","lbl"+index);
            }*/
            // 赋值
            var v = "";
            if("StartTime" == id)
            {
                v = data["StartYear"] + "-" + data["StartMonth"] + "-" + data["StartMonthDay"] + " " +
                    data["StartHour"] + ":" + data["StartMinute"] + ":" + data["StartSecond"]
            }
            else if ("EndTime" == id)
            {
                v = data["EndYear"] + "-" + data["EndMonth"] + "-" + data["EndMonthDay"] + " " +
                    data["EndHour"] + ":" + data["EndMinute"] + ":" + data["EndSecond"]
            }
            else if ("rowNum" == id)
            {
                v = index+1;
            }

            node.innerHTML = v;
        } 
        td.appendChild(node);
        tr.appendChild(td);
    }
    tbl.appendChild(tr)
}

//选中行事件
function selectTR(id)
{
    var index = id.replace("tr","");
    var chkBox = document.getElementById("chk"+index);
    chkBox.checked = !chkBox.checked;
    //$(".selectedTR").removeClass("selectedTR");
    //$("#"+id).addClass("selectedTR");
}

// 下载
function downloadRecord()
{
    DownloadList = [];
    var nRecordCount = 0;

    // 遍历选中记录
    var tbl = document.getElementById("dataview_tbody");
    for(var i=0; i<tbl.rows.length; i++)
    {
        var chkBox = document.getElementById("chk"+i);
        if(chkBox.checked)
        {
            nRecordCount++;
            var map = {};
            map["index"] = i;
            DownloadList.push(map);
        }
    }

    // 未选中记录
    if(0 == nRecordCount)
    {
        alert($.lang.tip["tipSelectRecord"]);
        return;
    }

    // 下载第1 条记录
    $(top.banner.document.getElementById("bgObj")).css("z-index",1004);
   
    currentIndex = 0;
    download();
}

function download() {
    var startTime,
        endTime,
        index,
        startStr = "",
        endStr = "";
    index = DownloadList[currentIndex]["index"];
    for (var j = 0; j < fieldList.length; j++) {
        startTime = Number(dataMap["RecordInfo"][index]["Begin"][fieldList[j]]);
        startStr += (startTime < 10) ? "0" + startTime : startTime;
        endTime = Number(dataMap["RecordInfo"][index]["End"][fieldList[j]]);
        endStr += (endTime < 10) ? "0" + endTime : endTime;
    }
    LAPI_RecordDownload = LAPI_URL.RecordDownload + parent.loginServerIp + "_" + startStr + "_" + endStr + ".ts?t=" + new Date().getTime();
    stateSearch();
}
function stateSearch() {
    LAPI_GetCfgData(LAPI_URL.RecordDownloadState, {}, "", false, stateCallback);
}
function stateCallback(errCode) {
    if (errCode == ResultCode.RESULT_CODE_DOWNLOADING) {
        alert($.lang.tip["tipDownloadProcessBusy"]);
    } else {
        window.location.href = LAPI_RecordDownload;
    }
    $(top.banner.document.getElementById("bgObj")).css("z-index", 1001);
}
// 查询录像
function searchRecord()
{
    // 清空记录
    RecordList = [];

    // 生成查询条件
    var param = "";
    var startTime = $("#StartTime").val().split("-");
    var endTime = $("#EndTime").val().split("-");
    $("#StartYear").val(startTime[0]);
    $("#StartMonth").val(startTime[1]);
    $("#StartDay").val(startTime[2]);
    $("#EndYear").val(endTime[0]);
    $("#EndMonth").val(endTime[1]);
    $("#EndDay").val(endTime[2]);
    
    for(var j=0; j<fieldList.length; j++)
    {
        param += "Start" + fieldList[j] + "=" + $("#Start"+fieldList[j]).val() + "&";
        param += "End" + fieldList[j] + "=" + $("#End"+fieldList[j]).val() + "&";
    }

    var strParam = param.substring(0, param.length-1);
    var param1 = startTime[0]+"/"+startTime[1]+"/"+startTime[2]+" "+"00:00:00";
    var param2 = endTime[0]+"/"+endTime[1]+"/"+endTime[2]+" "+"23:59:59";
    if(!LAPI_GetCfgData(LAPI_URL.RecordSearch + param1+"&End="+param2,dataMap))
    {// 获取参数失败
        disableAll();
        return;
    }

    // 解析数据
    parseDataMapToList(dataMap);

    // 更新录像列表
    createTable(recordTh, RecordList);
}

function pickerTime() {
    var top = GetTopWindow();
    WdatePicker({
        skin: "whyGreen",
        dateFmt: "yyyy-MM-dd",
        lang: top.wdateLang,
        readOnly:true
    });
}

function initPage() {
    // 日期默认选中当天
    var localDate = new Date();
    var year = localDate.getFullYear();
    var month = localDate.getMonth() + 1;
    month = (month < 10)? "0" + month : month;
    var day = localDate.getDate();
    day = (day < 10)? "0" + day : day;
    $("#openFolder").parent().addClass("hidden");
    $("#StartTime").val(year + '-' + month + '-' + day);
    $("#EndTime").val(year + '-' + month + '-' + day);

    $("#StartYear").val(year);
    $("#EndYear").val(year);
    $("#StartMonth").val(month);
    $("#EndMonth").val(month);
    $("#StartDay").val(day);
    $("#EndDay").val(day);
}

function initEvent() {
   $("#download").bind("click", downloadRecord);
   // $("#openFolder").bind("click", openRecordFolder);
    $("#recordSearch").bind("click", searchRecord);
}

function submitWinData(){
    $("#download").trigger("click");
}

$(document).ready( function() {
    //菜单选中
    beforeDataLoad();
    $(top.banner.document.getElementById("popwin_btnbar")).children().first().find("input").val($.lang.pub["download"]);
    $(top.banner.document.getElementById("popwin_btnbar")).children().last().remove();

    //初始化语言标签
    initLang();
    initPage();
    initEvent();
    afterDataLoad();
});