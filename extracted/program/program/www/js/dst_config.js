GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var validator = null;
var pageType = getparastr("pageType");
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    EnableDST: ["Enable"],
    DST_TimeOffset: ["OffsetMinute"],
    DSTMonth: ["BeginTime","Month"],
    DSTNum: ["BeginTime","WeekNum"],
    DSTWeek: ["BeginTime","WeekDay"],
    DSTTime: ["BeginTime","Hour"],
    DSTMonth_end: ["EndTime","Month"],
    DSTNum_end: ["EndTime","WeekNum"],
    DSTWeek_end: ["EndTime","WeekDay"],
    DSTTime_end: ["EndTime","Hour"]
};
function submitF()
{
    var flag;
    //始末月份相同时，提示错误
    if($("#DSTMonth").val() == $("#DSTMonth_end").val()){
        top.banner.showMsg(false, $.lang.tip["tipMonthExist"]);
        return;
    }
    //下发夏令时配置
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
    var isDSTChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    if (isDSTChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.DST_Cfg, jsonMap);
        if (flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

function initMonthOption() {
    var str = "";
    var length = 12;
    for (var i = 1; i <= length; i++) {
        var value = i;
        
        switch (value) {
            case 1:
                str += "<option value='1' lang='January'></option>";
                break;
            case 2:
                str += "<option value='2' lang='February'></option>";
                break;
            case 3:
                str += "<option value='3' lang='March'></option>";
                break;
            case 4:
                str += "<option value='4' lang='April'></option>";
                break;
            case 5:
                str += "<option value='5' lang='May'></option>";
                break;
            case 6:
                str += "<option value='6' lang='June'></option>";
                break;
            case 7:
                str += "<option value='7' lang='July'></option>";
                break;
            case 8:
                str += "<option value='8' lang='August'></option>";
                break;
            case 9:
                str += "<option value='9' lang='September'></option>";
                break;
            case 10:
                str += "<option value='10' lang='October'></option>";
                break;
            case 11:
                str += "<option value='11' lang='November'></option>";
                break;
            case 12:
                str += "<option value='12' lang='December'></option>";
                break;
        }
    }
    $("#DSTMonth").append(str);
    $("#DSTMonth_end").append(str);
}

function initWeekOption(){
    var str = "";
    var length = 7;
    for (var i = 1; i <= length; i++) {
        var value = i;
        
        switch (value) {
            case 1:
                str += "<option value='1' lang='Monday'></option>";
                break;
            case 2:
                str += "<option value='2' lang='Tuesday'></option>";
                break;
            case 3:
                str += "<option value='3' lang='Wednesday'></option>";
                break;
            case 4:
                str += "<option value='4' lang='Thursday'></option>";
                break;
            case 5:
                str += "<option value='5' lang='Friday'></option>";
                break;
            case 6:
                str += "<option value='6' lang='Saturday'></option>";
                break;
            case 7:
                str += "<option value='0' lang='Sunday'></option>";
                break;
        }
    }
    $("#DSTWeek").append(str);
    $("#DSTWeek_end").append(str);
}

function initTimeOption() {
    var str = "";
    var length = 24;
    for (var i = 0; i < length; i++) {
        var value = i;
        if (i < 10) {
            str += "<option value='"+ value + "'>0" + value +"</option>";
        } else {
            str += "<option value='"+ value + "'>" + value + "</option>";
        }
    }
        $("#DSTTime").append(str);
        $("#DSTTime_end").append(str);
}
function setDSTEnable() {
    var bool = $("#dstOpen").is(":checked");
    
    //灰显/不灰显相关按钮
    $("#startTime_TR select").attr("disabled", !bool);
    $("#endTime_TR select").attr("disabled", !bool);
    $("#DSTOffset_TR select").attr("disabled", !bool);
}

function initEvent() {
    $("input[name='EnableDST']").bind("click", setDSTEnable);
}

function initPage(){
//初始化月份选项
    initMonthOption();
    
    //初始化星期选项
    initWeekOption();
    
    //初始化时间
    initTimeOption();
}
function initData() {
    jsonMap = {};
    //获取夏令时配置
    if (!LAPI_GetCfgData(LAPI_URL.DST_Cfg, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
    setDSTEnable();
}

    

$(document).ready(function(){
    if (1 == pageType) {
        parent.selectItem("Com_dstCfgTab");
    } else {
        parent.selectItem("dstCfgTab");
    }
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initEvent();  
    initData();
    
    afterDataLoad();
});