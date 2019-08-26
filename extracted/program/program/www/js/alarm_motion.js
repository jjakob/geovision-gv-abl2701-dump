// JavaScript Document
GlobalInvoke(window);
/********************************** 全局变量 start ***************************************/
var pageType = getparastr("pageType"); // 0:区域检测，1：拌线检测
var validator = null;
var currentArea = null; // 当前设置的检测区域
var channelId = 0; // 通道号
var alarmMotionMap = {}; // 存放运动检测配置数据
var activityList = [];// 存放运动量的数据
var activityIndex = 0;
var detectType = 0; // 运动检测方式: 0-区域，1-宏块
var alarmType = AlarmType.MOVE_DETECT; // 告警类型
var planType = PlanType.MOVE_DETECT; // 布防计划类型
var drawObjType = DrawType.RECT;
var changeBySlider = true; // 是否滑动条触发
var getActivityTimeId = 0; // 获取数据定时器id
var drawActivityTimeId = 0;// 画图定时器id
var drawActivityNum = 25; // 1秒画运动量的个数
var areaNum = top.banner.motionAreaNum;
var colorList = [ "CC66FF", "FF6633", "0099FF", "339933", "CC0033", "6666CC", "FFFF66", "99CC00" ];
var drawCount = 0; // 尝试画区域的次数
var video = top.banner.video; // 播放器

var linkAreaMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var jsonMap_Interval = {};
var jsonMap_Interval_bak = {};
var mappingMap = {
    AreaNum: ["AreaNum"]
};
var jsonMap_Type = {};
var jsonMap_Type_bak = {};
var jsonMap_Diamond = {};
var jsonMap_Diamond_bak = {};
/********************************** 全局变量 end ***************************************/

/********************************** 滑动条 start ***************************************/
// 滑动条参数列表（map<k,map<k,v>>
var slidersMap = {
    Sensitivity : {
        sliderId : "SensitivitySld",
        barId : "SensitivityBar",
        minValue : 1,
        maxValue : 100,
        sld : null
    },
    TargetSize : {
        sliderId : "TargetSizeSld",
        barId : "TargetSizeBar",
        minValue : 1,
        maxValue : 100,
        sld : null
    },
    Duration : {
        sliderId : "DurationSld",
        barId : "DurationBar",
        minValue : 1,
        maxValue : 100,
        sld : null
    }
};

/**
 * 初始化滑动条
 * 
 * @param f
 * @return
 */
function initSlider() {
    for ( var textId in slidersMap) {
        var sldMap = slidersMap[textId];
        var sld = new Slider(sldMap.sliderId, sldMap.barId, {
            onMove : function() {
                if (changeBySlider) {
                    $("#" + this.textId).val(Math.round(this.GetValue()));
                }
                if ((0 == detectType) && ("TargetSize" == this.textId)) {
                    $("hr[class='sizeline']").css("marginTop", 101 - Math.round(this.GetValue()));
                }
            },
            onDragStop : function() {
                submitF(true);
            },
            showTip : true
        });
        sld.textId = textId;
        sld.MinValue = sldMap.minValue;
        sld.MaxValue = sldMap.maxValue;
        sldMap["sld"] = sld;
    }
}

/**
 * 滑动条赋值
 * 
 * @return
 */
function setSliderValue() {
    var n;

    for (n in slidersMap) {
        changeBySlider = false;
        slidersMap[n]["sld"].SetValue(Number($("#" + n).val()));
        changeBySlider = true;
    }
}

// 滑动条灰显/不灰显
function setSliderEnable(TxtId, disabled) {
    var SliderId = slidersMap[TxtId]["sliderId"];
    var BarId = slidersMap[TxtId]["barId"];
    if (disabled) {
        $("#" + SliderId).removeClass().addClass("slider4");
        $("#" + BarId).removeClass().addClass("bar3 bar4");
    } else {
        $("#" + SliderId).removeClass().addClass("slider3");
        $("#" + BarId).removeClass().addClass("bar3");
    }
    slidersMap[TxtId]["sld"].setEnable(!disabled);
    $("#" + TxtId).attr("disabled", disabled);
}
/********************************** 滑动条 end ***************************************/

/********************************** 数据处理 start ***************************************/
/**
 * 紧缩位压缩方法（PackBits）
 *
 * @param srcArr  待压缩数组，长度不能超过128
 * @returns {Array} 压缩后的数组
 */
function packbits(srcArr) {
    var dstArr = [],
        rdPos,                  /* 读的位置 */
        wdPos ,                 /* 写的位置 */
        rdSrcPos ,                 /* 欲读字串的源位置 */
        idx = 0,
        count = 0,
        maxRunCnt = 0,
        remainCnt = srcArr.length;      /* 剩余需要压缩编码的数量 */

    for (rdSrcPos = 0, wdPos = 0; remainCnt > 0; rdSrcPos = rdPos, remainCnt = remainCnt - count) {
        // A run cannot be longer than 128 bytes.
        maxRunCnt = (remainCnt < 128) ? remainCnt : 128;
        if ((remainCnt >= 3) && (srcArr[rdSrcPos + 1] == srcArr[rdSrcPos]) && (srcArr[rdSrcPos + 2] == srcArr[rdSrcPos])) {
            // 'run' points to at least three duplicated values.
            // Step forward until run length limit, end of input,
            // or a non matching byte:
            for (rdPos = rdSrcPos + 3, idx = 3; (idx < maxRunCnt) && (srcArr[rdPos] == srcArr[rdSrcPos]); idx++) {
                ++rdPos;
            }

            /* 这里ulCount不是ulIdx + 1,而是ulIdx,表示连续相同字符的个数 */
            count = idx;

            // replace this run in output with two bytes:
            dstArr[wdPos++] = 1 + 256 - count; /* flag byte, which encodes count (129..254) */

            dstArr[wdPos++] = srcArr[rdSrcPos];      /* byte value that is duplicated */
        } else {
            // If the input doesn't begin with at least 3 duplicated values,
            // then copy the input block, up to the run length limit,
            // end of input, or until we see three duplicated values:
            for (rdPos = rdSrcPos, idx = 0; idx < maxRunCnt; idx++) {
                if ((remainCnt >= (idx + 3)) && (srcArr[rdPos + 1] == srcArr[rdPos]) && (srcArr[rdPos + 2] == srcArr[rdPos])) {
                    break; // 3 bytes repeated end verbatim run
                } else {
                    ++rdPos;
                }
            }

            /* 这里ulIdx根据算法已经保证大于0,否则就进入到该else分支并列的if分支去了 */
            count = idx;
            dstArr[wdPos++] = count - 1;        /* flag byte, which encodes count (0..127) */
            dstArr = dstArr.concat(srcArr.slice(rdSrcPos, rdSrcPos + count)); /* followed by the bytes in the run */
            wdPos += count;
        }
    }
    return dstArr;
}

/**
 * 紧缩位压缩方法（PackBits）的解压动作
 *
 * @param srcArr
 * @returns {Array}
 */
function unpackbits(srcArr) {
    var dstArr = [],
        j,
        n,
        ulLen,
        val,
        inlen = srcArr.length;

    for(j=0; inlen > 1 ;) {
        /* get flag byte */
        ulLen = srcArr[j++];
        --inlen;

        if(ulLen != 128) {
            if(ulLen > 128) {
                ulLen = 1+256-ulLen;

                /* get value to repeat */
                val = srcArr[j++];
                --inlen;

                for (n = 0; n < ulLen; n++) {
                    dstArr.push(val);
                }
            } else {
                ++ulLen;
                if(ulLen > inlen)
                    break; // abort - ran out of input data
                /* copy verbatim run */
                dstArr = dstArr.concat(srcArr.slice(j, j + ulLen));
                j += ulLen;
                inlen -= ulLen;
            }
        }
    }

    return dstArr;
}

function strToNumArr(str) {
    var i,
        num = str.length% 8,
        numArr = [];

    if (0 != num) {
        num = 8 - num;
        for (i = 0; i < num; i++) {
            str += "0";
        }
    }

    for (num = str.length; num > 0; num -= 8) {
        numArr.push(parseInt(str.substr(0, 8), 2));
        str = str.substring(8);
    }

    return numArr;
}

function numArrToStr(arr){
    var i,
        j,
        len = arr.length,
        str = "",
        bitStr,
        bitStrLen;

    for (i = 0; i < len; i++) {
        bitStr = parseInt(arr[i]).toString(2);
        bitStrLen = 8 - bitStr.length;

        for (j = 0; j < bitStrLen; j++) {
            str += "0";
        }
        str += bitStr;
    }

    return str;
}

function encodeData(str) {
    var retStr = "",
        strArr = str,
        index;

    if(top.banner.isOldPlugin && !top.banner.isMac){
        strArr = strToNumArr(str);
    }else{
        strArr = str;
    }
    strArr = packbits(strArr);
    for (index = 0, len = strArr.length; index < len; index++) {
        retStr += String.fromCharCode(strArr[index]);
    }
    if(top.banner.isOldPlugin && !top.banner.isMac){
        return numArrToStr(strArr);
    }else{
        return base64encode(retStr)
    }
}

function decodeData(str) {
    var strArr = [],
        index,
        len;

    str = base64decode(str);
    for (index = 0, len = str.length; index < len; index++) {
        strArr.push(str.charCodeAt(index));
    }
    strArr = unpackbits(strArr);
    return strArr;

}
/********************************** 数据处理 start ***************************************/

/********************************** 交互性处理（业务） start ***************************************/
function clickMotionAreaLink() {
    var flag = true;
    for (var i = 0; i < areaNum; i++) {
        if (!$("#areaTR" + i).is(":hidden")) {
            flag = false;
            break;
        }
    }

    if ($("#MotionAreaLinkEnable").is(":checked")) {
        $("#MotionAreaLinkTime").attr("disabled", false);
        $("#linkOutIFrame").find("li").attr("disabled", true);
        $("#MotionPresetNum").attr("disabled", flag);
    } else {
        $("#MotionAreaLinkTime").attr("disabled", true);
        $("#linkOutIFrame").find("li").attr("disabled", false);
        $("#MotionPresetNum").attr("disabled", true);
    }
}

// 区域选中
function selectArea(index) {
    if (null != currentArea) {
        $("#areaTR" + currentArea).removeClass("selectedTR");
        $("#selectDiv" + currentArea).removeClass("selectedDiv");
    }
    currentArea = index;
    $("#areaTR" + currentArea).addClass("selectedTR");
    $("#selectDiv" + currentArea).addClass("selectedDiv");
    selectDrawObj(drawObjType, currentArea);
    getMotionAreaLinkCfg();
    showAreaInfo();
}

function getMotionAreaLinkCfg() {
    if (!$("#MotionAreaLinkEnable").is(":visible")) return;
    if (!getCfgData(channelId, CMD_TYPE.ALARM_LINK_CFG, linkAreaMap, AlarmType.MOTION_DETECT_AREA1 + currentArea)) {
        disableAll();
        return false;
    }
    var value = linkAreaMap["ActNum"] > 0 ? linkAreaMap["AlarmParam1"] : -1;
    $("#MotionPresetNum").val(value);
}

function changeMotionDetectArea() {
    submitF(false);
}

function clearTimeId(timeId) {
    if (timeId) {
        clearInterval(timeId);
        if (timeId == getActivityTimeId) {
            getActivityTimeId = 0;
        } else {
            drawActivityTimeId = 0;
        }
    }
}

// 显示区域信息
function showAreaInfo() {
    $("#areaName").html(currentArea + 1);

    LAPI_CfgToForm("frmSetup", jsonMap["MotionDetectParam"][currentArea]);

    for ( var text in slidersMap) {
        setSliderEnable(text, false);
    }
    setSliderValue();

    clearTimeId(drawActivityTimeId);
    clearTimeId(getActivityTimeId);
    $("#alarmView").children().css( {
        height : "0px",
        marginTop : "100px"
    });// 清空运动量的图
    $("hr[class='sizeline']").css("marginTop", 101 - parseInt(jsonMap["MotionDetectParam"][currentArea]["TargetSize"]));

    // 获取运动量，1s获取1次
    getActivityTimeId = setInterval(function() {
        var index = currentArea,
            activityMap = {};
        clearTimeId(drawActivityTimeId);

        if(!LAPI_GetCfgData(LAPI_URL.MotionActivity + "/" + index, activityMap))
            return;
        var resultList = activityMap["Activity"];
        activityList.splice(0, drawActivityNum);
        var len = activityMap["SampleNum"];
        var interval = (0 == len) ? 0 : Math.max(len, drawActivityNum) / Math.min(len, drawActivityNum);
        for ( var i = 0, j = 1; i < drawActivityNum; i++) {
            var map = {};
            var activity = 0;
            var alarmOn = 0;
            if (len > 0) {
                if (drawActivityNum > len) {
                    var index = Math.round(interval * (j - 1));
                    if (i == index) {
                        activity = resultList[j - 1]["Activity"];
                        alarmOn = resultList[j - 1]["AlarmOn"];
                        j++
                    }
                } else {
                    var index = Math.round(interval * i);
                    activity = resultList[index]["Activity"];
                    alarmOn = resultList[index]["AlarmOn"];
                }
            }
            map["Activity"] = activity;
            map["AlarmOn"] = alarmOn;
            activityList.push(map);
        }

        // 画图
            activityIndex = 0;
            drawActivityTimeId = setInterval("drawMotionActivity()", 1000 / drawActivityNum);
        }, 1000);
}

// 画运动量动态图
function drawMotionActivity() {
    if (drawActivityNum == activityIndex) {
        activityIndex = 0;
    }
    var activity = activityList[activityIndex]["Activity"];
    var alarmOn = activityList[activityIndex]["AlarmOn"];
    var color = (1 == alarmOn) ? "red" : "gray";
    var activityHtml = "<div class='activity' style='height: " + activity + "px;margin-top: " + (100 - activity)
            + "px;background-color: " + color + "'></div>";
    var $alarmView = $("#alarmView");
    if (300 == $alarmView.children().length) {
        $alarmView.find(":first-child").remove();
    }
    $alarmView.append(activityHtml);
    activityIndex++;
}

// 增加运动检测区域
function addArea() {
    var drawObjParam,
        i,
        areaInfo,
        areaPos;

    for (i = 0; i < areaNum; i++) {
        if ($("#areaTR" + i).is(":hidden")) {
            break;
        }
    }
    if (i == areaNum) {
        top.banner.showMsg(true, $.lang.tip["tipUpperMotionInfo"], 0);
        return;
    }

    areaInfo = jsonMap["MotionDetectParam"][i];
    areaInfo["Enable"] = 1;
    areaPos = areaInfo["Area"];
    // 下发配置
    if (!submitF(true))
        return;

    drawObjParam = DrawObjMap[drawObjType][i];
    drawObjParam["Left"] =  Number(areaPos["TopLeft"]["X"]) * 100;
    drawObjParam["Top"] = Number(areaPos["TopLeft"]["Y"]) * 100;
    drawObjParam["Right"] = Number(areaPos["BotRight"]["X"]) * 100;
    drawObjParam["Bottom"] = Number(areaPos["BotRight"]["Y"]) * 100;
    setDrawObj(drawObjType, i, DrawObjMap);
    showHiddenArea(drawObjType, i, 1);
    $("#areaTR" + i).removeClass("hidden");
    selectArea(i);
    clickMotionAreaLink();
}

// 删除运动检测区域
function removeArea(index) {
    // 下发配置
    jsonMap["MotionDetectParam"][index]["Enable"] = 0;
    $("#MotionPresetNum").val(-1);
    if (!submitF(true))
        return;

    // 如果删除的是当前选中行，则选中第一行
    if (index == currentArea && null != currentArea) {
        currentArea = null;
        for ( var i = 0; i < areaNum; i++) {
            if (1 == jsonMap["MotionDetectParam"][i]["Enable"]) {
                selectArea(i);
                break;
            }
        }
    }
    for ( var text in slidersMap) {
        setSliderEnable(text, false);
    }
    if (null == currentArea) {
         // 清空区域信息
        $("#areaName").html("");
        $("#Sensitivity").val(1);
        $("#Duration").val(1);
        $("#TargetSize").val(1);
        setSliderValue();
        for ( var text in slidersMap) {
            setSliderEnable(text, true);
        }
        clearTimeId(drawActivityTimeId);
        clearTimeId(getActivityTimeId);
        $("#alarmView").children().css( {
            height : "0px",
            marginTop : "100px"
        });// 清空运动量的图
    }
    $("#areaTR" + index).addClass("hidden");
    if(top.banner.isOldPlugin && !top.banner.isMac){
        showHiddenArea(drawObjType, index, 0);
    }else{
        delDrawObj(drawObjType, index);
    }
    clickMotionAreaLink();
}


// 初始化运动检测区域列表
function initAreaList() {
    var areaList = jsonMap["MotionDetectParam"];

    for ( var i = 0; i < areaNum; i++) {
        var areaInfo = areaList[i];
        var color = colorList[i];
        var text = $.lang.pub["area"];
        var isShow = (1 == areaInfo["Enable"]) ? "" : "hidden";
        var html = "<tr id='areaTR" + i + "' class='" + isShow + "'>" + "<td onclick='selectArea(" + i + ");' >"
                + "<div id='selectDiv" + i + "' class='unselectDiv'>"
                + "<div class='colorDiv' style='background-color: #" + color + "'></div>" + "</div>" + "</td>"
                + "<td onclick='selectArea(" + i + ");' >" + text + (i + 1) + "</td>"
                + "<td align='right'>" + "<a class='icon black-del' onclick='removeArea(" + i + ");this.blur();' "
                + "title='" + $.lang.pub["del"] + "'></a></td></tr>";
        $("#areaTbl").append(html);
    }
}

function generalPresetOption() {
    if ($("#MotionPresetNum").is(":visible")) {
        var str = video.$("#position").html();
        $("#MotionPresetNum").html(str);
    }
}

function setRenderScale() {
    video.setRenderScale(StreamType.LIVE, 0);
}

// 检测方式切换事件
function detectType_change() {
    var i,
        text,
        isShow = 0,
        isSelected = false,
        areaList = jsonMap["MotionDetectParam"];

    detectType = Number($("#Type").val());

    if (0 == detectType) {    // 区域检测
        // 处理界面布局
        $("#areaTblDiv").removeClass("hidden");
        $("#areaType").removeClass("hidden");
        $("#areaName").removeClass("hidden");
        $("#settingsDiv").removeClass("sectionDiv").addClass("areaInfo panel");
        $("#alarmViewLi").removeClass("hidden");
        $("#TargetSizeLi").removeClass("hidden");
        //$("#DurationLi").removeClass("hidden");

        showHiddenArea(DrawType.RECT_DIAMOND, 0, isShow);   //隐藏宏块
        for (i = 0; i < areaNum; i++) { // 按使能情况显示区域
            isShow = 0;
            if (1 == areaList[i]["Enable"]) {// 显示框体
                isShow = 1;
                if (!isSelected) {
                    selectArea(i);
                    isSelected = true;
                }
            }
            showHiddenArea(drawObjType, i, isShow);
        }

        if (isSelected) {
            clickMotionAreaLink();
        } else {
            // 清空区域信息
            $("#Sensitivity").val(1);
            $("#Duration").val(1);
            $("#TargetSize").val(1);
            setSliderValue();
            for (text in slidersMap) {
                setSliderEnable(text, true);
            }
        }

        jsonMap_Diamond["Enable"] = 0;
    } else { //宏块检测
        // 处理界面布局
        $("#areaTblDiv").addClass("hidden");
        $("#areaType").addClass("hidden");
        $("#areaName").addClass("hidden");
        $("#settingsDiv").removeClass().addClass("sectionDiv");
        $("#alarmViewLi").addClass("hidden");
        $("#TargetSizeLi").addClass("hidden");
        //$("#DurationLi").addClass("hidden");

        // 隐藏区域
        for (i = 0; i < areaNum; i++) { // 按使能情况显示区域
            showHiddenArea(drawObjType, i, isShow);
        }

        // 显示宏块
        isShow = 1;
        showHiddenArea(DrawType.RECT_DIAMOND, 0, isShow);   // 显示宏块
        selectDrawObj(DrawType.RECT_DIAMOND, 0);

        // 赋值
        LAPI_CfgToForm("frmSetup", jsonMap_Diamond);
        for (text in slidersMap) {
            setSliderEnable(text, false);
        }
        setSliderValue();

        jsonMap_Diamond["Enable"] = 1;
    }
    // 界面变化导致画布坐标系变更，需要重新初始化一下
    if (LoginType.VM_LOGIN != parent.loginType) {
        // 部分计划初始化
        Plan.init(LAPI_URL.WeekPlan + "MotionDetect");
    }
}
/** ***************************** 交互性处理（业务） end ****************************** */

/** ***************************** 绘图 start ****************************** */
// 初始化运动检测区域(控件画框)
function initMotionArea() {
    var drawObjParam,
        i,
        index,
        name= (LANG_TYPE.Chinese == top.language) ? $.lang.pub["area"]:"area",
        areaList = jsonMap["MotionDetectParam"],
        areaInfo,
        topLeft,
        botRight;

    DrawObjMap = {};
    DrawObjMap[drawObjType] = [];

    // 区域
    for (i = 0; i < areaNum; i++) {
        areaInfo = areaList[i]["Area"];
        topLeft = areaInfo["TopLeft"];
        botRight = areaInfo["BotRight"];
        drawObjParam = {};

        drawObjParam["Text"] = name + (i + 1);
        drawObjParam["Left"] = Number(topLeft["X"]) * 100;
        drawObjParam["Top"] = Number(topLeft["Y"]) * 100;
        drawObjParam["Right"] = Number(botRight["X"]) * 100;
        drawObjParam["Bottom"] = Number(botRight["Y"]) * 100;

        drawObjParam["LineColor"] = getDrawObjColor(colorList[i]);
        drawObjParam["LineWidth"] = 2;
        DrawObjMap[drawObjType].push(drawObjParam);
    }

    // 宏块
    DrawObjMap[DrawType.RECT_DIAMOND] = [];
    drawObjParam = {};
    drawObjParam["DiamondLengthNum"] = 22;
    drawObjParam["DiamondHeightNum"] = 18;
    drawObjParam["Diamond"] = decodeData(jsonMap_Diamond["ActiveCell"]);

    drawObjParam["LineColor"] = getDrawObjColor("FF0000");
    drawObjParam["LineWidth"] = 1;
    DrawObjMap[DrawType.RECT_DIAMOND].push(drawObjParam);

    initDrawObj(DrawObjMap, detectType_change);
}

// 坐标上报事件
function eventDrawObjParam(type, num, strParam) {
    var areaInfo = jsonMap["MotionDetectParam"][num]["Area"],
        topLeft = areaInfo["TopLeft"],
        botRight = areaInfo["BotRight"],
        posMap = {},
        paramMap, 
        n;

    paramMap = DrawObjMap[type][num];
    if(top.banner.isOldPlugin && !top.banner.isMac){
        sdkAddCfg(posMap, strParam);
    }else{
        posMap = $.parseJSON(strParam);
    }

    // 更新新图形的坐标
    for (n in posMap) {
        paramMap[n] = posMap[n];
    }

    if (DrawType.RECT == type) {
        topLeft["X"] = Math.round(paramMap["Left"] / 100);
        topLeft["Y"] = Math.round(paramMap["Top"] / 100);
        botRight["X"] = Math.round(paramMap["Right"] / 100);
        botRight["Y"] = Math.round(paramMap["Bottom"] / 100);
    } else if(DrawType.RECT_DIAMOND == type) {
        jsonMap_Diamond["ActiveCell"] = encodeData(paramMap["Diamond"]);
    }

    submitF(true);
}

// 选中上报事件
function eventSelDrawObj(type, num) {
    if (DrawType.RECT == type) {
        selectArea(num);
    }
}
/** ***************************** 绘图 end ****************************** */
function release() {
    clearTimeId(drawActivityTimeId);
    clearTimeId(getActivityTimeId);
    EnableDrawFun(StreamType.LIVE, 0);
    parent.hiddenVideo();
}

/**
 * 参数下发 bool 标志位：true表示运动检测信息，false表示告警联动和布防计划
 */

function initVideo_callback(streamType) {
    EnableDrawFun(streamType, 1);
    // 为了使宏块贴边，设置为满比例
    video.cur_scale = UIRenderScale.FULL;
    setRenderScale();

    initMotionArea();
}

function initPage() {
    var $activeXDiv = $("#recordManager_div_activeX");
    resetVideoSize(parent.DefaultStreamID, "recordManager_div_activeX");
    $activeXDiv.height(Math.ceil($activeXDiv.height()/18) * 18);

    $("#add").attr("title", $.lang.pub["add"]);
    if (LoginType.VM_LOGIN == parent.loginType) {
        var $videoDiv = $("#videoDiv");
        $videoDiv.css("float", "left");
        $("#linkOutIFrame").addClass("hidden");
        $("#planDiv").addClass("hidden");
        $("#contentDiv").css( {
            margin : "0 0 0 15px",
            width : "555px"
        });
        $videoDiv.css("marginLeft", "5px");
        $("#submitBtn").remove();
        $("#IntervalTime").change(function() {
                submitF(false);
        });
        $("#Dejitter").change(function() {
                submitF(false);
        });      
    }

    initSlider();
    for ( var n in slidersMap) {// 默认灰显滑动条
        setSliderEnable(n, true);
        setSliderValue();
    }
    if (top.banner.isSupportMotionLinkPreset) {
        $("#presetTR").addClass("hidden");
        $("#MotionLinkPresetDIV").removeClass("hidden");
        $("#MotionAreaLinkEnableDIV").removeClass("hidden");
    }

    for (n = 1; n < 300; n++) {
        var activityHtml = "<div class='activity' style='height: 0px;margin-top: 100px;background-color: black'></div>";
        $("#alarmView").append(activityHtml);
    }

    generalPresetOption();
}

function initValidator() {
    $("#IntervalTime").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 5, 3600));
    $("#Dejitter").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 600));
    $("#MotionAreaLinkTime").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 300));
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
                range : [ 5, 3600 ]
            },
            Dejitter : {
                integer : true,
                required : true,
                range : [ 1, 600 ]
            },
            MotionAreaLinkTime: {
                integer : true,
                required : true,
                range : [ 1, 300 ]
            }
        }
    });
    validator.init();
}

function initEvent() {
    document.onkeydown = shieldEsc;

    $("#Type").change(function() {
        detectType_change();
        validator.init();
        submitF(true);
    });

    $("#MotionPresetNum").change(changeMotionDetectArea);
}

function initData() {
    if (!LAPI_GetCfgData(LAPI_URL.MotionDetectType, jsonMap_Type) ||
        !LAPI_GetCfgData(LAPI_URL.MotionDetect, jsonMap) ||
        !LAPI_GetCfgData(LAPI_URL.MotionDiamondDetect, jsonMap_Diamond) ||
        !LAPI_GetCfgData(LAPI_URL.MotionInterval, jsonMap_Interval)) {
        disableAll();
        return;
    }

    jsonMap_Type_bak = objectClone(jsonMap_Type);
    jsonMap_bak = objectClone(jsonMap);
    jsonMap_Diamond_bak = objectClone(jsonMap_Diamond);
    jsonMap_Interval_bak = objectClone(jsonMap_Interval);
    LAPI_CfgToForm("frmSetup", jsonMap_Type);
    LAPI_CfgToForm("frmSetup", jsonMap_Interval);

    // 记录在全局变量中
    detectType = jsonMap_Type["Type"];

    if ($("#MotionAreaLinkEnable").is(":visible")) {
        if (!getCfgData(channelId, CMD_TYPE.MOTION_AREA_LINK, alarmMotionMap)) {
            disableAll();
            return;
        }
        cfgToForm(alarmMotionMap, "frmSetup");
    }

    initAreaList();

    if (LoginType.VM_LOGIN != parent.loginType) {
        if (!linkOutIframe.initData(LAPI_URL.MotionDetectLink)) {
            disableAll();
            top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        }
        // 部分计划初始化
        Plan.init(LAPI_URL.WeekPlan + "MotionDetect");
    }
    detectType_change();
}

function submitF(bool) {
    var pcParam = "";
    var flag = false;
    var isChanged = false;
    if (bool) {
        LAPI_FormToCfg("frmSetup", jsonMap_Type);
        isChanged = !isObjectEquals(jsonMap_Type, jsonMap_Type_bak);
        if (isChanged) {
            flag = LAPI_SetCfgData(LAPI_URL.MotionDetectType, jsonMap_Type);
            if (flag) {
                jsonMap_Type_bak = objectClone(jsonMap_Type);
            }
        }

        if (0 == detectType) {
            LAPI_FormToCfg("frmSetup", jsonMap["MotionDetectParam"][currentArea]);
            isChanged = !isObjectEquals(jsonMap, jsonMap_bak);
            if (isChanged) {
                flag = LAPI_SetCfgData(LAPI_URL.MotionDetect, jsonMap);
                if (flag) {
                    jsonMap_bak = objectClone(jsonMap);
                }
            }
        } else {
            LAPI_FormToCfg("frmSetup", jsonMap_Diamond);
            isChanged = !isObjectEquals(jsonMap_Diamond, jsonMap_Diamond_bak);
            if (isChanged) {
                flag = LAPI_SetCfgData(LAPI_URL.MotionDiamondDetect, jsonMap_Diamond);
                if (flag) {
                    jsonMap_Diamond_bak = objectClone(jsonMap_Diamond);
                }
            }
        }
    } else {
        if ($("#MotionAreaLinkEnableDIV").is(":visible")) {
            var linkEnableValue = Number($("#MotionAreaLinkEnable").is(":checked"));
            var MotionAreaLinkTimeValue = $("#MotionAreaLinkTime").val();
            if (alarmMotionMap["MotionAreaLinkEnable"] != linkEnableValue || alarmMotionMap["MotionAreaLinkTime"] != MotionAreaLinkTimeValue) {
                if (!validator.form())
                    return;
                setCfgData(channelId, CMD_TYPE.MOTION_AREA_LINK, "frmSetup", alarmMotionMap);
            }

            if (linkAreaMap["AlarmParam1"] != $("#MotionPresetNum").val()) {
                linkAreaMap["AlarmParam1"] = $("#MotionPresetNum").val();
                pcParam =  "ActCmd1=0&ActId1=0&ActNum=" + (linkAreaMap["AlarmParam1"]== -1 ? 0 : 1) +
                           "&AlarmParam1=" + $("#MotionPresetNum").val() + "&AlarmCmd="
                           + (AlarmType.MOTION_DETECT_AREA1 + currentArea);
                var retcode = top.sdk_viewer.ViewerAxSetConfig(channelId, CMD_TYPE.ALARM_LINK_CFG, pcParam);
                top.banner.showMsg(ResultCode.RESULT_CODE_SUCCEED == retcode);
            }
        }

        if (!validator.form())
            return;

        LAPI_FormToCfg("frmSetup", jsonMap_Interval);
        isChanged = !isObjectEquals(jsonMap_Interval, jsonMap_Interval_bak);
        if (isChanged) {
            flag = LAPI_SetCfgData(LAPI_URL.MotionInterval, jsonMap_Interval);

            if (flag) {
                jsonMap_Interval_bak = objectClone(jsonMap_Interval);
            }
        }

        var linkoutChanged = linkOutIframe.IsChanged();
        var planChanged = Plan.IsChanged();
        if (!isChanged && !linkoutChanged && !planChanged) {
            parent.status = $.lang.tip["tipAnyChangeInfo"];
            return;
        }
        if (planChanged) {
            flag = Plan.submitF(LAPI_URL.WeekPlan + "MotionDetect");
        }
        if (linkoutChanged) {
            flag = linkOutIframe.submitF(LAPI_URL.MotionDetectLink);
        }
    }
    return flag;
}

$(document).ready(function() {
    // 选中菜单
    parent.selectItem("motionDetectAreaAlarmTab");
    loadHtml("linkOutIFrame", "alarm_linkout.htm");
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    initVideo("recordManager_div_activeX", StreamType.LIVE, RunMode.CONFIG, null, top.banner.isSupportPTZ,
            initVideo_callback);
    afterDataLoad();
});