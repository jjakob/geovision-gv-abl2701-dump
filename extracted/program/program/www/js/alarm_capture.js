// JavaScript Document
GlobalInvoke(window);
/** ******************************* 全局变量 ********************************* */
var validator = null;
var channelId = 0; // 通道号
var DataMap = {}; // 数据
var jsonMap = {};       
var jsonMap_bak = {};
var mappingMap = {               
    Enable: ["EventCapture","CommonParam","Enable"],
    Format: ["EventCapture","CommonParam","Format"],
    Width: ["EventCapture","CommonParam","Resolution","Width"], 
    Height: ["EventCapture","CommonParam","Resolution","Height"], 
    Quality: ["EventCapture","CommonParam","Quality"], 
    CaptureInterval: ["EventCapture","CommonParam","CaptureInterval"],
    CaptureNumber: ["EventCapture","CommonParam","CaptureNumber"],
    CaptureTimeMode: ["TimingCapture","CaptureTimeMode"],
    PlanNum: ["TimingCapture","PlanNum"],
    IntervalTime: ["TimingCapture","Interval"]
};
var CaptureTimeList = [];
var headInfoList = [                      
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },                              
    {
        fieldId: "Time"
    },
    {
         fieldId : "option",
         fieldType : "option",
         option : "<a href='#' class='icon black-del' rowNum=rowNum onclick='delHoliday($(this).attr(\"rowNum\"));' title='"
         + $.lang.pub["del"] + "'></a>" 
     }
];
/** ******************************* 全局变量 end ******************************* */

/** ***************************** operation start ************************* */

/** ***************************** operation End ************************* */

/** ***************************** common method start ************************* */

function initPage() {
}

function initValidator() {
    $("#IntervalTime").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 86400));
    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success : function(label) {
        },
        rules : {
            IntervalTime : {
                integer : true,
                required : true,
                range : [ 1, 86400 ]
            }
        }
    });
    validator.init();
}

function initEvent() {
    $("input[name='CaptureTimeMode']").bind("click", changeCaptureTimeMode);
    $("#addHoliday").bind("click", addTime);
}

// 抓拍模式切换响应事件
function changeCaptureTimeMode() {
    if ($("#intervalUpload").is(":checked")) {
        $("#IntervalTimeDiv").removeClass("hidden");
        $("#timeTableDiv").addClass("hidden");
    } else {      
        $("#timeTableDiv").removeClass("hidden");
        $("#IntervalTimeDiv").addClass("hidden");
    }
}

// 新增时间段
function addTime () {
    WdatePicker({el:'d12',dateFmt:'HH:mm:ss',lang: top.wdateLang, onpicked: function(dp){  //WdatePicker自定义事件，使用onpicked实现日期选择联动
        var timeNew = dp.cal.getDateStr();
        for(var i = 0, len = CaptureTimeList.length; i < len; i++) {
            if (0 == CaptureTimeList[i]["Enable"]) {
                CaptureTimeList[i]["Enable"] = 1;
                CaptureTimeList[i]["Time"] = timeNew;
                break;
            } else {
                if(timeNew == CaptureTimeList[i]["Time"]) return;
            }
        }
        TimeDataView.refresh();}
    })
}

// 删除时间段
function delHoliday(CurrentRowNum)
{
    CaptureTimeList.splice(CurrentRowNum, 1);
    CaptureTimeList.push({
        Enable :0,
        Time: ""
    });
    TimeDataView.refresh();
}

//把返回的时间List中有效的数据放在一个新的list中用于表格数据展示
function getDataList() {        
        var dataList = [],
            tempMap = {},
            i,
            len;
        
        for(i = 0, len = Number(DataMap["PlanNum"]); i < len; i++) {
                tempMap = CaptureTimeList[i];
                if(1 == tempMap["Enable"]) {
                    dataList.push(tempMap);
        } 

    }     
    return dataList;
}

function initData() {
    var resolution = "";
    jsonMap = {};   
    
    if (!LAPI_GetCfgData(LAPI_URL.CaptureImage, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    CaptureTimeList = jsonMap["TimingCapture"]["UserDefPlan"];
    LAPI_CfgToForm("frmSetup", jsonMap, DataMap, mappingMap);

    TimeDataView = new DataView("dataview_tbody", getDataList, headInfoList, 6);
    TimeDataView.createDataView();
    
    changeCaptureTimeMode();
     
    // 显示分辨率
    resolution = DataMap["Width"] + "*" + DataMap["Height"];
    $("#Resolution").html("<option value='" + resolution + "'>" + resolution + "</option>");
}

function submitF(bool) {
    var flag;
    if (!validator.form())return;
    LAPI_FormToCfg("frmSetup", jsonMap, DataMap, mappingMap);
        
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.CaptureImage, jsonMap);
    if (flag) {
         jsonMap_bak = objectClone(jsonMap);
    }
}

$(document).ready(function(){
    parent.selectItem("alarmCaptureTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});
/** ***************************** common method end ************************* */
