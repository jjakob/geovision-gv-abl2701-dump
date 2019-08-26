var channelId = 0;
var dataMap = {};
var validator = null;
var pcTimeID = null; //同步PC时间的定时器
var oldTimeZone = 0; //记录原有时区
var oldSynTimeWay = 0;//记录原有的时间同步方式
var isSyncPCTime = false; // 判断是否在同步计算机时间
var pageType = getparastr("pageType");
var TimeDataMap = {};
var TimeDataMapClone = {};
var tmpDateMap = {};
var NTPServerDataMap = {};
var SynTimeMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    NTPIPAddr: ["IPAddr"],
    NTPSyncInterval: ["SyncInterval"]
};
var jsonMapSyncType = {};
var jsonMapSyncType_bak = {};
var mappingMapSyncType = {
    SyncType:["SyncType"]
}
var jsonMapFeastDay = {};
var jsonMapFeastDay_bak = {};
var mappingMapFeastDay = {
    holiday: ["FeastDay"],
    offday: ["ChangeDay"]
};

//创建节假日时间配置表格需要的表头信息
var holidayInfoList = [
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "holiday"
    },
    {
        fieldId : "option",
        fieldType : "option",
        option : "<a href='#' class='icon black-del' rowNum=rowNum onclick='delHoliday($(this).attr(\"rowNum\"));' title='"
                 + $.lang.pub["del"] + "'></a>"
    }
];
//创建调休日时间配置表格需要的表头信息
var offdayInfoList = [
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "offday"
    },
    {
        fieldId : "option",
        fieldType : "option",
        option : "<a href='#' class='icon black-del' rowNum=rowNum onclick='delOffday($(this).attr(\"rowNum\"));' title='"
                 + $.lang.pub["del"] + "'></a>"
    }
];

//删除节假日
function delHoliday(CurrentRowNum)
{
    var holidayList = TimeDataMap["holiday"];
    holidayList.splice(CurrentRowNum, 1);
    HoliDataView.refresh();
}

//删除调休日
function delOffday(CurrentRowNum)
{
    var offdataList = TimeDataMap["offday"];
    offdataList.splice(CurrentRowNum, 1);
    OffDataView.refresh();
}

//开启关闭录像备份是BM服务器地址的灰显情况
function BMAddressEnable()
{
    var bool = document.getElementById("BMClose").checked;
    document.getElementById("BMIPAddr").disabled = bool;
    if (bool) {
        var $BMIPAddr = $("#BMIPAddr");
        $BMIPAddr.val(dataMap["BMIPAddr"]);
        validator.element($BMIPAddr);
    }
}

//将TimeDataMap解析为string
function changeTimeDataMapToString() {
    var str = "",
        i,
        name,
        value,
        tmpTimeMap;

    for (name in TimeDataMap) {
        str += name + "=";
        value = TimeDataMap[name];
        for (i = 0 ; i < value.length; i++) {
            tmpTimeMap = value[i];
            str += tmpTimeMap[name] + ",";
        }

        if(value.length != 0) {
            str = str.substring(0, str.length - 1);
        }
        str += "&";
    }

    str = str.substring(0, str.length - 1);
    return str;
}

function submitF() {
    parent.status = "";
    var NowTime = $("#NowTime").val();
    if(!validator.form() || "" == NowTime){
        return;
    }
    LAPI_FormToCfg("frmSetup", jsonMapSyncType, SynTimeMap, mappingMapSyncType);
    var isSynTimeChanged = !isObjectEquals(jsonMapSyncType, jsonMapSyncType_bak);
    LAPI_FormToCfg("frmSetup", jsonMap, NTPServerDataMap, mappingMap);
    var isNtpChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    var dataTimeArr = NowTime.split(" ");
    var dataArr = dataTimeArr[0].split("-");
    var timeArr = dataTimeArr[1].split(":");
    dataMap["LocalTime"]["Year"]=parseInt(dataArr[0],10);
    dataMap["LocalTime"]["Month"]=parseInt(dataArr[1],10);
    dataMap["LocalTime"]["MonthDay"]=parseInt(dataArr[2],10);
    dataMap["LocalTime"]["Hour"]= parseInt(timeArr[0], 10);
    dataMap["LocalTime"]["Minute"]= parseInt(timeArr[1], 10);
    dataMap["LocalTime"]["Second"]=parseInt(timeArr[2], 10);
    LAPI_FormToCfg("frmSetup", dataMap);
    var isSysTimeChanged = !isObjectEquals(dataMap,dataMap_bak);
    if (!isSynTimeChanged && !isNtpChanged && !isSysTimeChanged && isObjectEquals(TimeDataMap, TimeDataMapClone) && isObjectEquals(TimeDataMapClone, TimeDataMap))
    {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }

    //如果地址为空，规范为0.0.0.0
    var $NTPIPAddr = $("#NTPIPAddr");
    if ("" == $NTPIPAddr.val()){
        $NTPIPAddr.val("0.0.0.0");
    }
    if (top.banner.isSupportNTP) {
        //NTP服务器
        if (isNtpChanged) {
            LAPI_FormToCfg("frmSetup", jsonMap, NTPServerDataMap, mappingMap);
            if (LAPI_SetCfgData(LAPI_URL.NTPServer,jsonMap)) {
                jsonMap_bak = objectClone(jsonMap);
            } else {
                return;
            }
        }
    }

    if(isSynTimeChanged) {
        if (LAPI_SetCfgData(LAPI_URL.SyncTime, jsonMapSyncType)) {
            jsonMapSyncType_bak = objectClone(jsonMapSyncType);
        } else {
            return;
        }
    }
    //系统时间
    if (isSysTimeChanged) {
        if (LAPI_SetCfgData(LAPI_URL.SystemTime, dataMap)) {
            dataMap_bak = objectClone(dataMap);
        } else {
            return;
        }
    }


    //节假日调休日
    if (top.banner.isSupportCapture) {
        var resultStr = changeTimeDataMapToString();
        var tempFeastMap = {};
        tempFeastMap["holiday"] = resultStr.split("&")[0].split("=")[1];
        tempFeastMap["offday"] = resultStr.split("&")[1].split("=")[1];
        LAPI_FormToCfg("frmSetup", jsonMapFeastDay, tempFeastMap, mappingMapFeastDay);
        if(!isObjectEquals(jsonMapFeastDay, jsonMapFeastDay_bak)) {
            if (LAPI_SetCfgData(LAPI_URL.FeastChangeDay, jsonMapFeastDay)) {
                jsonMapFeastDay_bak = objectClone(jsonMapFeastDay);
            } else {
                return;
            }
        }
    }
}

//开启关闭NTP时间
function NTPAddressEnable()
{
    var bool = (3 == $("#SyncType").val());//同步NTP时间

    var $NTPIPAddr = $("#NTPIPAddr");
    var $NTPSyncInterval = $("#NTPSyncInterval");
    if (bool) {
        $("#NTPfieldset").removeClass("hidden");
        validator.element($NTPIPAddr);
        validator.element($NTPSyncInterval);
    } else {
        $("#NTPfieldset").addClass("hidden");
        $NTPIPAddr.val(NTPServerDataMap["NTPIPAddr"]);
        $NTPSyncInterval.val(NTPServerDataMap["NTPSyncInterval"]);
    }
    disableClientTime();
}

/**
 * 格式化时间为0000-00-00 00:00:00
 *
 * @param year
 * @param month
 * @param day
 * @param hour
 * @param minute
 * @param second
 * @return
 */
function formatDataTime(year,month,day,hour, minute, second) {
    var nowTime = "";
    nowTime += year+"-";
    if(1 == month.toString().length)
    {
        nowTime += "0";
    }
    nowTime += month+"-";
    if(1 == day.toString().length)
    {
        nowTime += "0";
    }
    nowTime += day+" ";
    if(1 == hour.toString().length)
    {
        nowTime += "0";
    }
    nowTime += hour+":";
    if(1 == minute.toString().length)
    {
        nowTime += "0";
    }
    nowTime += minute+":";
    if(1 == second.toString().length)
    {
        nowTime +=  "0";
    }
    nowTime += second;

    return nowTime;
}



/**
 * 简单时间控件调用接口，仅用于时间段的时间控件
 *
 * @return
 */
function pickerDataTime()
{
    var startTime = "2000-01-01 00:00:00";
    var endTime = "2029-12-31 00:00:00";
    var NowTime;
    var dataTimeArr;
    var dataArr;
    var timeArr;
    var event = getEvent();
    var oSrc = event.srcElement? event.srcElement: event.target;
    if(oSrc.id.indexOf("End")>-1)
    {
        startTime = "2000-01-01 23:59:59";
        endTime = "2029-12-31 23:59:59"
    }

    var top = GetTopWindow();
    WdatePicker({
        skin: "whyGreen",
        dateFmt: "yyyy-MM-dd HH:mm:ss",
        minDate: startTime,
        maxDate: endTime,
        lang: top.wdateLang,
        readOnly:true
    });
    //解决浏览器兼容性模式下非法时间可正常下发的问题
    NowTime = $("#NowTime").val();
    if ("" == NowTime) {
        $("#NowTime").click();
    } else {
        dataTimeArr = NowTime.split(" ");
        dataArr = dataTimeArr[0].split("-");
        timeArr = dataTimeArr[1].split(":");
        if (Number(dataArr[0]) > 2029) {
            dataArr[0] = "2029";
        }
        if (Number(dataArr[1]) > 12) {
            dataArr[1] = "12";
        }
        if (Number(timeArr[0]) > 23) {
            timeArr[0] = "23";
        }
        if (Number(timeArr[1]) > 59) {
            timeArr[1] = "59";
        }
        if (Number(timeArr[2]) > 59) {
            timeArr[2] = "59";
        }
        $("#NowTime").val(dataArr[0] + "-" + dataArr[1] + "-" + dataArr[2] + " " + timeArr[0] + ":" + timeArr[1] + ":" + timeArr[2]);
    }
}


function updateTime(localDate) {
    var year = localDate.getFullYear();
    var month = localDate.getMonth() + 1;
    var day = localDate.getDate();
    var hour = localDate.getHours();
    var minute = localDate.getMinutes();
    var second = localDate.getSeconds();

    $("#NowTime").val(formatDataTime(year,month,day,hour, minute, second));
}
function syncPCTime() {
    var timeZone;
    isSyncPCTime = !isSyncPCTime;
    if (isSyncPCTime) {
        $("#syncPCTime").val($.lang.pub["noSyncPCTime"]);
    }
    else {
        $("#syncPCTime").val($.lang.pub["syncPCTime"]);
    }

    var bool = isSyncPCTime;
    var $TimeZone = $("#TimeZone");
    $TimeZone.attr("disabled", bool);
    $("#NowTime").attr("disabled", bool);
    $("#SynTime").attr("disabled", bool);
    if (bool) {
        var start = new Date(2015, 0, 1),
            middle = new Date(2015, 6, 1),
            timezoneOffset = Math.min(-start.getTimezoneOffset(), -middle.getTimezoneOffset()) / 60;

        
        oldTimeZone = timezoneOffset;
        if ((timezoneOffset - Math.floor(timezoneOffset)) > 0) {
            timezoneOffset = timezoneOffset * 100;
        }
        $TimeZone.val(timezoneOffset);
        updateTime(new Date());
        pcTimeID = setInterval("updateTime(new Date())", 1000);
    } else {
        clearInterval(pcTimeID);
    }
}

function TimeZone_change() {
    var dataTimeArr = $("#NowTime").val().split(" ");
    var dataArr = dataTimeArr[0].split("-");
    var milliseconds = Date.parse(dataArr[1] + "/" + dataArr[2] + "/" + dataArr[0] + " " + dataTimeArr[1]);
    var newTimeZone = Number($("#TimeZone").val());
    newTimeZone = (newTimeZone >= 15 || newTimeZone <= -15)? newTimeZone/100 : newTimeZone;
    milliseconds += (newTimeZone - oldTimeZone) * 3600000;

    // 基于当前时区更新时间
    var localDate = new Date(milliseconds);
    updateTime(localDate);

    // 更新原有时区
    oldTimeZone = newTimeZone;
}

function SynTimeWay_change() {
    var newSynTimeWay = Number($("#SynTime").val());
    oldSynTimeWay = newSynTimeWay;
}

function disableClientTime(){
    var flag = (0 != $("#SyncType").val() && 1 != $("#SyncType").val());

    $("#syncPCTime").attr("disabled", flag);
    $("#TimeZone").attr("disabled", isSyncPCTime);
    $("#SynTime").attr("disabled", isSyncPCTime);
    $("#Year").attr("disabled", flag || isSyncPCTime);
    $("#Month").attr("disabled", flag || isSyncPCTime);
    $("#Day").attr("disabled", flag || isSyncPCTime);
    $("#NowTime").attr("disabled", flag || isSyncPCTime);
    if(flag) {
        $("#NowTime").val(formatDataTime(dataMap["LocalTime"]["Year"],dataMap["LocalTime"]["Month"],dataMap["LocalTime"]["MonthDay"],dataMap["LocalTime"]["Hour"], dataMap["LocalTime"]["Minute"], dataMap["LocalTime"]["Second"]));
    }
}

function disablesyncPCTime(){
    if(isSyncPCTime) {
        syncPCTime();
    }
    NTPAddressEnable();
}

//将SceneDataMap解析为list<map>
function changeDateMapToList() {
    var tmpTimeMap = {},
        HolidayList = [],
        OffdayList = [],
        i,
        k,
        value;



    for(i = 0; i < parseInt((dataMap["holiday"].length)/10); i++) {
        tmpDateMap["holiday" + (i + 1)] =  dataMap["holiday"].split(",")[i];
    }

    for(i = 0; i < parseInt((dataMap["offday"].length)/10); i++) {
        tmpDateMap["offday" + (i + 1)] =  dataMap["offday"].split(",")[i];
    }

    // 解析场景字段
    for (k = 0 ; (k < 20) &&　tmpDateMap["holiday" + (k + 1)]; k++) {
        tmpTimeMap = {};
        tmpTimeMap["holiday"] = tmpDateMap["holiday" + (k + 1)] ;
        HolidayList.push(tmpTimeMap);
    }
    for (k = 0 ; (k < 20) &&　tmpDateMap["offday" + (k + 1)]; k++) {
        tmpTimeMap = {};
        tmpTimeMap["offday"] = tmpDateMap["offday" + (k + 1)] ;
        OffdayList.push(tmpTimeMap);
    }
    TimeDataMap["holiday"] = HolidayList;
    TimeDataMap["offday"] = OffdayList;
}

function getHolidayMapList() {
    return TimeDataMap["holiday"];
}

function getOffdayMapList() {
    return TimeDataMap["offday"];
}
function checkIPAddrOrEmpty(v) {
    var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
        + '((\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])(\.(\\d|[1-9](\\d)?|1\\d{2}|2[0-4]\\d|25[0-5])){3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
    var reg=new RegExp(strRegex); //RegExp 是正则表达式的缩写，RegExp 对象用于规定在文本中检索的内容。
    return reg.test(v);//test() 方法检索字符串中的指定值。返回值是 true 或 false
}

function initData()
{
    jsonMapSyncType = {};
    SynTimeMap = {};

    document.onkeydown = shieldEsc;


    if(!LAPI_GetCfgData(LAPI_URL.SystemTime, dataMap)) {
        disableAll();
        return;
    }

    if (top.banner.isSupportNTP) {
        if (!LAPI_GetCfgData(LAPI_URL.NTPServer,jsonMap)){
            disableAll();
            return;
        }
        jsonMap_bak = objectClone(jsonMap);
        LAPI_CfgToForm("frmSetup", jsonMap, NTPServerDataMap, mappingMap);//将JsonMap的值赋给页面
    }
    if (!LAPI_GetCfgData(LAPI_URL.SyncTime, jsonMapSyncType)) {
        disableAll();
        return;
    }
    jsonMapSyncType_bak = objectClone(jsonMapSyncType);
    LAPI_CfgToForm("frmSetup", jsonMapSyncType, SynTimeMap, mappingMapSyncType);
    if (top.banner.isSupportCapture) {
        if (!LAPI_GetCfgData(LAPI_URL.FeastChangeDay, jsonMapFeastDay)) {
            disableAll();
            return;
        }
        jsonMapFeastDay_bak = objectClone(jsonMapFeastDay);
        LAPI_CfgToForm("frmSetup", jsonMapFeastDay, dataMap, mappingMapFeastDay);
        //changeMapToMapByMapping(jsonMapFeastDay, mappingMapFeastDay, dataMap, 0);
        changeDateMapToList();
        TimeDataMapClone = objectClone(TimeDataMap);
        HoliDataView = new DataView("Holidataview_tbody", getHolidayMapList, holidayInfoList, 20);
        HoliDataView.createDataView();
        OffDataView = new DataView("Offdataview_tbody", getOffdayMapList, offdayInfoList, 20);
        OffDataView.createDataView();
    }

    LAPI_CfgToForm("frmSetup",dataMap);
    dataMap_bak = objectClone(dataMap);
    $("#NowTime").val(formatDataTime(dataMap["LocalTime"]["Year"],dataMap["LocalTime"]["Month"],dataMap["LocalTime"]["MonthDay"],dataMap["LocalTime"]["Hour"], dataMap["LocalTime"]["Minute"], dataMap["LocalTime"]["Second"]));
    oldTimeZone = Number($("#TimeZone").val());
    oldTimeZone = (oldTimeZone >= 15 || oldTimeZone <=-15)? oldTimeZone/100 : oldTimeZone;
    oldSynTimeWay = Number($("#SynTime").val());
    NTPAddressEnable();
}

function initPage(){
    var SyncTypeStr = "<option value='1' data-lang='SDKSynTime'></option>";
    if(top.banner.isSupportJPEG) {
        SyncTypeStr += "<option value='2' data-lang='TMSSynTime'></option>";
    }
    if(top.banner.isSupportNTP) {
        SyncTypeStr += "<option value='3' data-lang='NTPSynTime'></option>";
    }
    if(top.banner.isSupportVM) {
        SyncTypeStr += "<option value='4' data-lang='PlatformSynTime'></option>";
    }
    SyncTypeStr += "<option value='5' data-lang='ONVIFSynTime'></option>" +
                   "<option value='0' data-lang='DefaultSynTime'></option>";
    $("#SyncType").html(SyncTypeStr);

    if (top.banner.isSupportCapture && top.banner.isSupportOffday && (IVAMode.ILLEGAL != top.banner.IVAType) && !top.banner.isSupportTrafficFlow) {
        $("#HolidayDiv").removeClass("hidden");
        $("#OffdayDiv").removeClass("hidden");
    }
}
//jquery验证框架
function initValidator()
{
    $("#NTPIPAddr").attr("tip",$.lang.validate["valUrl"]);
    $("#NTPSyncInterval").attr("tip",$.validator.format($.lang.tip["tipIntRange"],30,3600));
    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
               return checkIPAddrOrEmpty(value);
           }, $.lang.validate["valUrl"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            NTPSyncInterval: {
                integer: true,
                required: true,
                range:[30,3600]
            }
        }
    });
    validator.init();
}

function initEvent(){
    $("#SyncType").change(disablesyncPCTime);
    $("#syncPCTime").bind("click", syncPCTime);
    $("#TimeZone").change(TimeZone_change);
    $("#SynTime").change(SynTimeWay_change);
    $("#NTPIPAddr").change(function(){
        var NTPContent = $("#NTPIPAddr").val().split(".");
        var reg1 = /^[0-9]{1,4}$/;
        var reg2 = /^(\d|[1-9](\d)?|1\d{2}|2[0-4]\d|25[0-5])$/;
        rule = validator.settings.rules;
        if(NTPContent.length == 4){
            rule["NTPIPAddr"] ={};
            if(reg1.test(NTPContent[0])&&reg2.test(NTPContent[1])&&reg2.test(NTPContent[2])&&reg2.test(NTPContent[3])){
                rule["NTPIPAddr"] = {
                    checkIP1To223OrEmpty:""
                };
            }else{
                rule["NTPIPAddr"] ={};
                rule["NTPIPAddr"] = {
                    checkIPAddrOrEmpty:""
                };
            }
        } else{
            rule["NTPIPAddr"] ={};
            rule["NTPIPAddr"] = {
                checkIPAddrOrEmpty:""
            };
        }
        //NTP地址为空时，自动填充0.0.0.0
        var $NTPIPAddr = $("#NTPIPAddr");
        if("" == $NTPIPAddr.val())
        {
            $NTPIPAddr.val("0.0.0.0");
        }
    });
    $("#addHoliday").bind("click", function(){
        WdatePicker({
            el:'d12',
            skin: "whyGreen",
            dateFmt: "yyyy-MM-dd",
            lang: top.wdateLang,
            readOnly:true,
            onpicked:function(dp){
                var holidayList = TimeDataMap["holiday"];
                var holidayNew = dp.cal.getDateStr();
                for(var i = 0; i < holidayList.length; i++) {
                    if(holidayNew == holidayList[i]["holiday"]) return;
                }
                var timeMap = {
                    holiday: holidayNew
                };

                holidayList.push(timeMap);
                HoliDataView.refresh();
            }
        })
    });
    $("#addOffday").bind("click", function(){
        WdatePicker({
            el:'d12',
            skin: "whyGreen",
            dateFmt: "yyyy-MM-dd",
            lang: top.wdateLang,
            readOnly:true,
            onpicked:function(dp){
                var offdayList = TimeDataMap["offday"];
                var offdayNew = dp.cal.getDateStr();
                for(var i = 0; i < offdayList.length; i++) {
                    if(offdayNew == offdayList[i]["offday"]) return;
                }
                var timeMap = {
                    offday: offdayNew
                };

                offdayList.push(timeMap);
                OffDataView.refresh();
            }
        })
    });
}

$(document).ready(function(){
    if (1 == pageType) {
        parent.selectItem("Com_timeCfgTab");
    } else {
        parent.selectItem("timeCfgTab");
    }
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});