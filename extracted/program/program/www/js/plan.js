$package("Plan");

//样式
var disarmColor = "#fff";                       // 撤防颜色
var defenceColor = "#58C8EA";                   // 布防颜色
var textColor = "#000";                         // 文字颜色
var redTextColor = "red";                       // 周末文字颜色
var timeTextFont = "12px Arial";                // 小时文字样式
var weekTextFont = "12px 'Microsoft YaHei'";    // 星期文字样式
var lineColor = "#959595";                      // 表格线颜色
var areaBorderColor = "#CCDB33";                // 激活边框颜色
    
// 变量
var leftWidth = 50;
var leftHeight = 20;
var Width = 18;
var Height = 25;
var canvasWidth = 500;
var canvasHeight = 200;
var PLANNUM = 4;
var WeekArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var isForCanvas = true;
var isPainting = false;
var isMouseDown = false;
var offsetLeft = 0;
var offsetTop = 0;
var StartX = 0;
var StartY = 0;
var EndX = 0;
var EndY = 0;
var context = null;
var planMode = -1;
var PlanJsonMap = {};
var PlanStatusMap = {};
var PlanDataList = [];
var PlanDataList_bak = [];
var planMap = {};
var color = disarmColor;
var docMouseSelectEvent = document.onselectstart;

// 绘制布防计划入口
Plan.PaintPlanTemplate = function() {
    var canvas = document.getElementById("canvas");
    if (!isForCanvas) {
        canvas = G_vmlCanvasManager.initElement(canvas)
    }
    if (!canvas) {
        return
    }
    context = canvas.getContext("2d");
    context.fillRect(leftWidth, leftHeight, canvasWidth, canvasHeight);
    Plan.PaintPlanData();
    Plan.PaintPlanBorder()
};

// 绘制文字
Plan.PaintWeek = function() {
    var i,
        length = 0;
    
    // 绘制小时
    context.fillStyle = textColor;
    context.font = timeTextFont;
    context.lineWidth = 1;
    for (i = 0; i <= 24; i++) {
        context.fillText(i, leftWidth - 5 + Width * i, leftHeight - 5);
    }
    
    // 绘制星期
    context.font = weekTextFont;
    length = WeekArray.length;
    for (i = 0; i < length; i++) {
        if (5 == i) {   // 周六、周日显示红色
            context.fillStyle = redTextColor;
        }
        context.fillText($.lang.pub[WeekArray[i]], leftWidth - 40, leftHeight + 15 + Height * i);
    }
};

// 绘制线
Plan.PaintPlanBorder = function() {
    var i,
        j = 0,
        length;
    
    context.strokeStyle = lineColor;
    context.lineWidth = 1;
    length = WeekArray.length;
    for (i = 0; i < 24; i++) {
        for (j = 0; j < length; j++) {
            context.strokeRect(leftWidth + Width * i + .5, leftHeight + Height * j + .5, Width, Height)
        }
    }
};

Plan.changeTimeStrToH = function(timeStr) {
    var minutes = 0,
        timeArr;
    
    if ("" != timeStr) {
        timeArr = timeStr.split(":");
        minutes = Number(timeArr[0]) * 3600 + Number(timeArr[1]) * 60 + Number(timeArr[2]);
    }
    return minutes/3600;
};

// 自定义比较算法
Plan.sortFun = function(range1, range2){
    if (range1["PlanStartTime"] == range2["PlanStartTime"]) return 0;
    if ("" == range1["PlanStartTime"]) return 1;
    if ((range1["PlanStartTime"] > range2["PlanStartTime"]) && ("" != range2["PlanStartTime"])) {
        return 1;
    } else {
        return -1;
    }
};

Plan.TimeArraySort = function(){
    var i,
        len = WeekArray.length,
        dayPlanArray = [];
    
    for (i = 0; i < len; i++) {
        dayPlanArray = PlanDataList[i];
        dayPlanArray.sort(Plan.sortFun);
    }
};

Plan.getIndex = function(curDayArray, value) {
    var i = 0,
        timeRangeLen = curDayArray.length,
        start = "",
        end = "",
        index = -1;
    
    for (; (i < timeRangeLen) && (-1 == index); i++) {
        start = curDayArray[i]["PlanStartTime"];
        end = curDayArray[i]["PlanEndTime"];
        
        if (value < start) {
            if((i == 0) || (value > curDayArray[i - 1]["PlanEndTime"])) {
                index = i - 0.5;
            }
        } else if (value >= start && value <= end) {
            index = i;
        } else {
            if((i == (timeRangeLen - 1)) || (value < curDayArray[i + 1]["PlanStartTime"])) {
                index = i + 0.5;
            }
        }
    }
    
    return index;
};

Plan.MergeArray = function(tmpPlanArray){
    var i = 0,
        j = 0,
        dayLen = tmpPlanArray.length,
        newStart = 0,
        newEnd = 0,
        start = 0,
        end = 0,
        curDayArray = [],
        newCurDayArray = [],
        curRange = {},
        newRange = {},
        timeRangeLen,
        sIndex = 0, 
        eIndex = 0;

    for (j = 0; j < dayLen; j++) {
        if ("undefined" == typeof tmpPlanArray[j]) continue;
        newStart = tmpPlanArray[j]["PlanStartTime"];
        newEnd = tmpPlanArray[j]["PlanEndTime"];
        if ("24:00:00" == newEnd) {
            newEnd = "23:59:59";
        }
        curDayArray = [];   // 当前的数据
        $.extend(curDayArray, PlanDataList[j]);
        newCurDayArray = [];    //merge后的数据
        sIndex = Plan.getIndex(curDayArray, newStart);     // 新的开始点在对应天计划中的位置
        eIndex = Plan.getIndex(curDayArray, newEnd);     // 新的结束点在对应天计划中的位置
        timeRangeLen = curDayArray.length;
        
        if (0 == planMode) {    // 布防合并算法
            
            // 新布防时间段之前的保留
            for (i = 0; i < sIndex; i++) {
                if ((("00:00:00" == curDayArray[i]["PlanStartTime"]) && ("00:00:00" == curDayArray[i]["PlanEndTime"]))
                        || (("" == curDayArray[i]["PlanStartTime"]) && ("" == curDayArray[i]["PlanEndTime"]))) continue;
                newCurDayArray.push(curDayArray[i]);
            }
            
            if (i < timeRangeLen) {
                newRange = {};
                newRange["PlanStartTime"] = (curDayArray[i]["PlanStartTime"] > newStart)? newStart : curDayArray[i]["PlanStartTime"];
                if ((eIndex - parseInt(eIndex, 10)) == 0) {
                    newRange["PlanEndTime"] = curDayArray[eIndex]["PlanEndTime"];
                    i = eIndex + 1;
                } else {
                    newRange["PlanEndTime"] = newEnd;
                    i = eIndex + 0.5;
                }
                newCurDayArray.push(newRange);
                
                for (; i < timeRangeLen; i++) {
                    if ((("00:00:00" == curDayArray[i]["PlanStartTime"]) && ("00:00:00" == curDayArray[i]["PlanEndTime"]))
                            || (("" == curDayArray[i]["PlanStartTime"]) && ("" == curDayArray[i]["PlanEndTime"]))) break;
                    newCurDayArray.push(curDayArray[i]);
                }
            } else {
                newRange = {};
                newRange["PlanStartTime"] = newStart;
                newRange["PlanEndTime"] = newEnd;
                newCurDayArray.push(newRange);
            }
            
            
        } else if(1 == planMode) {  // 撤防合并算法
            
            // 撤防时间段之前的保留
            for (i = 0; i < sIndex; i++) {
                if ((("00:00:00" == curDayArray[i]["PlanStartTime"]) && ("00:00:00" == curDayArray[i]["PlanEndTime"])) 
                        || (("" == curDayArray[i]["PlanStartTime"]) && ("" == curDayArray[i]["PlanEndTime"]))) continue;
                newCurDayArray.push(curDayArray[i]);
            }
            
            if (i < timeRangeLen) {
                
                if (curDayArray[i]["PlanStartTime"] < newStart) {
                    newRange = {};
                    newRange["PlanStartTime"] = curDayArray[i]["PlanStartTime"];
                    newRange["PlanEndTime"] = newStart;
                    newCurDayArray.push(newRange);
                }
                
                if ((eIndex - parseInt(eIndex, 10)) == 0) {
                    if (curDayArray[eIndex]["PlanEndTime"] > newEnd) {
                        newRange = {};
                        newRange["PlanStartTime"] = newEnd;
                        newRange["PlanEndTime"] = curDayArray[eIndex]["PlanEndTime"];
                        newCurDayArray.push(newRange);
                    }
                    i = eIndex + 1;
                } else {
                    i = eIndex + 0.5;
                }
                for (; i < timeRangeLen; i++) {
                    if ((("00:00:00" == curDayArray[i]["PlanStartTime"]) && ("00:00:00" == curDayArray[i]["PlanEndTime"]))
                            || (("" == curDayArray[i]["PlanStartTime"]) && ("" == curDayArray[i]["PlanEndTime"]))) break;
                    newCurDayArray.push(curDayArray[i]);
                }
            }
        }
        
        if (newCurDayArray.length > PLANNUM) {
            Plan.PaintPlanData();
            Plan.PaintPlanBorder();
            Plan.PaintAreaBorder();
            alert($.lang.tip["tipTimeSectionLimit"].replace("%s1", $.lang.pub[WeekArray[j]]).replace("%s2", PLANNUM));
            return false
        } else if(newCurDayArray.length < PLANNUM){
            for (i = newCurDayArray.length; i < PLANNUM; i++) {
                newRange = {};
                newRange["PlanStartTime"] = "";
                newRange["PlanEndTime"] = "";
                newCurDayArray.push(newRange);
            }
        }
        
        PlanDataList[j] = newCurDayArray;
    }
};
// 根据数据绘制图形
Plan.PaintPlanData = function () {
    var len = WeekArray.length,
        i,
        startPX = 0,
        endPX = 0,
        dayPlanArray = [],
        j = 0;
    
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    Plan.PaintWeek();
    for (i = 0; i < len; i++) {
        dayPlanArray = PlanDataList[i];
        for (j = 0; j < PLANNUM; j++) {
            startPX = Plan.changeTimeStrToH(dayPlanArray[j]["PlanStartTime"]) * Width;
            endPX = Plan.changeTimeStrToH(dayPlanArray[j]["PlanEndTime"]) * Width;
            if (startPX == endPX) {
                continue;
            }
            context.fillStyle = defenceColor;
            context.fillRect(leftWidth + startPX, leftHeight + i * Height, endPX - startPX, Height);
        }
    }
};

// 根据图形更新数据
Plan.updatePlanData = function () {
    var tmpPlanArray = [],
        j = 0,
        obj = {};
    
    Plan.TimeArraySort();
    for (j = Math.min(StartY, EndY); j <= Math.max(StartY, EndY); j++) {
        obj = {};
        obj["PlanStartTime"] = Math.min(StartX, EndX) + ":00:00";
        obj["PlanEndTime"] = (Math.max(StartX, EndX) + 1) + ":00:00";
        
        if (7 == obj["PlanStartTime"].length) {
            obj["PlanStartTime"] = "0" + obj["PlanStartTime"];
        }
        if (7 == obj["PlanEndTime"].length) {
            obj["PlanEndTime"] = "0" + obj["PlanEndTime"];
        }
        
        if ("24:00:00" == obj["PlanEndTime"].length) {
            obj["PlanEndTime"] = "23:59:59";
        }
        
        tmpPlanArray[j] = obj;
    }
    Plan.MergeArray(tmpPlanArray);
};

// 重绘
Plan.redraw = function() {
    var leftX = 0,
        leftY = 0,
        Xlength = 0,
        Ylenght = 0,
        sx = 0,
        sy = 0,
        ex = 0,
        ey = 0;
    
    // 在表格外面绘制
    if (((-1 == StartX) || (24 == StartX) || (-1 == StartY) || (7 == StartY)) && 
            ((-1 == EndX) || (24 == EndX) || (-1 == EndY) || (7 == EndY)))
        return;
    
    Plan.PaintPlanData();
    context.fillStyle = color;
    
    sx = Plan.formatX(StartX);
    ex = Plan.formatX(EndX);
    sy = Plan.formatY(StartY);
    ey = Plan.formatY(EndY);
    
    if ((sx + ex + sy + ey) > 0) {
        
        leftX = Math.min(sx, ex);
        leftY = Math.min(sy, ey);
        
        Xlength = Math.max(sx, ex) - leftX + 1;
        Ylength = Math.max(sy, ey) - leftY + 1;
        
        // 转换为像素
        leftX = leftX* Width + leftWidth;
        leftY = leftY* Height + leftHeight;
        
        context.lineWidth = 1;
        context.fillRect(leftX, leftY, Width * Xlength, Height * Ylength);
    }
    
    Plan.PaintPlanBorder();
    Plan.PaintAreaBorder();
};

// 绘制表格外边框，表现激活效果
Plan.PaintAreaBorder = function() {
    if (isForCanvas && isPainting) {
        context.strokeStyle = areaBorderColor;
        context.lineWidth = 3;
        context.strokeRect(leftWidth - 2, leftHeight - 2, Width * 24 + 4, Height * 7 + 4)
    }
};

Plan.getStartPoint = function(x, y) {
    x = Plan.repairX(x);
    y = Plan.repairY(y);
    
    StartX = x;
    StartY = y;
    EndX = x;
    EndY = y
};

Plan.getEndPoint = function(x, y) {
    x = Plan.repairX(x);
    y = Plan.repairY(y);
    
    if (EndX != x || EndY != y) {
        EndX = x;
        EndY = y;
        Plan.redraw();
    }
};

Plan.repairX = function(X) {
    var tmpX = X;
    
    tmpX = (tmpX - leftWidth) / Width;
    if (tmpX < 0) {
        tmpX = -1;
    } else if (tmpX > 24) {
        tmpX = 24;
    } else {
        tmpX = Math.floor(tmpX);
    }
    
    return tmpX;
};

Plan.repairY = function(Y) {
    var tmpY = Y;
    
    tmpY = (tmpY - leftHeight) / Height;
    if (tmpY < 0) {
        tmpY = -1;
    } else if (tmpY > 7) {
        tmpY = 7;
    } else {
        tmpY = Math.floor(tmpY);
    }
    
    return tmpY;
};

Plan.formatX = function(X) {
    var tmpX = X;
    if ( - 1 == tmpX) {
        tmpX = 0
    } else if (24 == tmpX) {
        tmpX = 23
    }
    return tmpX
};

Plan.formatY = function(Y) {
    var tmpY = Y;
    if ( - 1 == tmpY) {
        tmpY = 0
    } else if (7 == tmpY) {
        tmpY = 6
    }
    return tmpY
};

Plan.cloneDayData = function(index, targetIndex) {
    PlanDataList[targetIndex] = objectClone(PlanDataList[index]);
};

Plan.repareData = function (dayPlanList){
    var i = 0,
        len = dayPlanList.length,
        currectEnd = 0,
        nextStart = 0;
    
    dayPlanList.sort(Plan.sortFun);
    for (i = 0; i < (len - 1); i++) {
        currectEnd = dayPlanList[i]["PlanEndTime"];
        if ("" == currectEnd) continue;
        timeArr = currectEnd.split(":");
        currectEnd = Number(timeArr[0]) * 3600 + Number(timeArr[1]) * 60 + Number(timeArr[2]);
        
        nextStart = dayPlanList[i + 1]["PlanStartTime"];
        timeArr = nextStart.split(":");
        nextStart = Number(timeArr[0]) * 3600 + Number(timeArr[1]) * 60 + Number(timeArr[2]);
        
        if (nextStart - currectEnd <= 1) {
            dayPlanList[i]["PlanEndTime"] = dayPlanList[i + 1]["PlanEndTime"];
            dayPlanList.splice(i+1, 1);
            dayPlanList.push({
                PlanStartTime: "",
                PlanEndTime: ""
            });
            i--;
        }
    }
};

Plan.initPage = function() {
    var drawBtnClass= "";
    
    if (typeof G_vmlCanvasManager != "undefined") {
        isForCanvas = false;
        drawBtnClass = "hidden";
    }
    var planTxt = "";
    if ("undefined" != typeof storType) {
        planTxt = $.lang.pub["StoragePlan"];
    } else if ("undefined" != typeof alarmType || "undefined" != typeof parkType) {
        planTxt = $.lang.pub["enablePlan"];
    } else {
        planTxt = $.lang.pub["enbaleOutputPlan"];
    }
    
    var planHtmlStr ="<fieldset>" +
                        "<legend class='textCell'><input type='checkbox' id='PlanEnable' name='PlanEnable' checked= ''/>" +
                            "<label for='PlanEnable'>" + planTxt +"</label>" +
                        "</legend>" +
                        "<div class='editBtnDiv' style='width: " + canvasWidth + "px;height: 24px'>" +
                            "<span class='button right' id='editPlan'>" +
                                "<span class='btn_l'></span><button type='button' class='submit_btn'>" + $.lang.pub["modify"] + "</button><span class='btn_r'></span>" +
                            "</span>" +
                            "<span class='button " + drawBtnClass + "' id='defence'>" +
                                "<span class='btn_l'></span><button type='button' class='submit_btn buttonTextLeft'>" +
                                    "<div class='plan_colorDiv defence'></div>" +
                                    $.lang.pub["defence"] + 
                                "</button><span class='btn_r'></span>" +
                            "</span>" +
                            "<span class='button " + drawBtnClass + "' id='disarm'>" +
                                "<span class='btn_l'></span><button type='button' class='submit_btn buttonTextLeft'>" +
                                    "<div class='plan_colorDiv disarm'></div>" +
                                    $.lang.pub["disarm"] + 
                                "</button><span class='btn_r'></span>" +
                            "</span>" +
                            
                        "</div>" + 
                        "<div class='planContent' id='planContent'></div>" +
                    "</fieldset>";
    var $planDiv = $("#planDiv");
    $planDiv.html("");
    $planDiv.append(planHtmlStr);
    
    var canvas = document.createElement("canvas");
    $(canvas).attr({
        width: canvasWidth,
        height: canvasHeight,
        id: "canvas"
    });
    // IE7 兼容性处理
    $(canvas).css("position", "relative");
    $("#planContent").append(canvas);

    var $canvas = $("#canvas");
    offsetLeft = $canvas[0] ? $canvas[0].offsetLeft : 0;
    offsetTop = $canvas[0] ? $canvas[0].offsetTop : 0;
};

Plan.IsChanged = function(){
    var v = $("#PlanEnable").is(":checked")? 1: 0;
    
    return !isObjectEquals(PlanDataList, PlanDataList_bak) || (planMap["PlanEnable"] != v);
};

Plan.initData = function(cmdType){
    var cmd = "",
        i = 0,
        j = 0,
        len,
        dayPlanList,
        dayPlanList_jsonMap,
        sectionMap,
        sectionMap_jsonMap;

    if(!LAPI_GetCfgData(cmdType, PlanJsonMap)) {
        disableAll();
        return false;
    }

    PlanDataList = [];
    for(i = 0, len = Number(PlanJsonMap["DayNum"]); i < len; i++) {
        dayPlanList = [];
        dayPlanList_jsonMap = PlanJsonMap["Day"][(i + 1)%7];   // 获取的数据0号位表示周日，需要做转换

        for(j = 0; j < PLANNUM; j++) {
            sectionMap = {};
            sectionMap_jsonMap = dayPlanList_jsonMap["TimeSection"][j];
            sectionMap["PlanStartTime"] = sectionMap_jsonMap["Begin"];
            sectionMap["PlanEndTime"] =  sectionMap_jsonMap["End"];
            if ("24:00:00" == sectionMap["PlanStartTime"]) {
                sectionMap["PlanStartTime"] = "";
            }
            if ("24:00:00" == sectionMap["PlanEndTime"]) {
                sectionMap["PlanEndTime"] = "";
            }

            dayPlanList.push(sectionMap);
        }
        Plan.repareData(dayPlanList);
        PlanDataList.push(dayPlanList);
    }

    PlanDataList_bak = objectClone(PlanDataList);
    if("undefined" == typeof parkType) {
        if(!LAPI_GetCfgData(cmdType.replace("WeekPlan", "WeekPlanStatus"), PlanStatusMap)) {
            disableAll();
            return false;
        } else {
            planMap["PlanEnable"] = PlanStatusMap["Enable"];
            $("#PlanEnable").attr("checked", (1 == planMap["PlanEnable"]));
        }
    }
};

Plan.submitF = function(cmdType){
    var flag = false,
        pcParam = "",
        cmd = "",
        i = 0,
        j = 0,
        len = WeekArray.length,
        dayDataList = [],
        dayDataList_jsonMap,
        tmpMap = {},
        sectionMap_jsonMap,
        n,
        v,
        $PlanEnable = $("#PlanEnable");

        for (i = 0; i < len; i++) {
            dayDataList = PlanDataList[i];
            dayDataList_jsonMap = PlanJsonMap["Day"][(i + 1)%7];   // 获取上来的原始数据0号位表示周日，需要做转换
            for (j = 0; j < PLANNUM; j++) {
                tmpMap = dayDataList[j];
                sectionMap_jsonMap = dayDataList_jsonMap["TimeSection"][j];

                v = tmpMap["PlanStartTime"];
                if ("" == v) {
                    v = "24:00:00";
                }
                sectionMap_jsonMap["Begin"] = v;

                v = tmpMap["PlanEndTime"];
                if ("" == v) {
                    v = "24:00:00";
                }
                sectionMap_jsonMap["End"] = v;
            }
        }
        flag = LAPI_SetCfgData(cmdType, PlanJsonMap, false);

    if (flag) {
        PlanDataList_bak = objectClone(PlanDataList);
        if ("undefined" == typeof parkType) {
            v = $PlanEnable.is(":checked")? 1: 0;
            PlanStatusMap["Enable"] = v;
            if(!LAPI_SetCfgData(cmdType.replace("WeekPlan", "WeekPlanStatus"), PlanStatusMap)) {
                disableAll();
                return false;
            } else {
                planMap["PlanEnable"] = v;
            }
        }
    }
    top.banner.showMsg(flag);
    return flag;

};

Plan.initEvent = function() {
    var $html = $("html");
    $("#canvas").bind("mousedown", function(e) {
        if (isPainting) {
            document.onselectstart = function(){return false;};
            isMouseDown = true;
            Plan.getStartPoint(e.pageX - offsetLeft, e.pageY - offsetTop);
        }
    });

    $html.bind("mousemove", function(e) {
        if (isPainting) {
            if (isMouseDown) {
                Plan.getEndPoint(e.pageX - offsetLeft, e.pageY - offsetTop)
            }
        }
    });
    $html.bind("mouseup", function(e) {
        if (isPainting && isMouseDown) {
            isMouseDown = false;
            Plan.redraw();
            StartX = Plan.formatX(StartX);
            EndX = Plan.formatX(EndX);
            StartY = Plan.formatY(StartY);
            EndY = Plan.formatY(EndY);
            Plan.updatePlanData();
            document.onselectstart = docMouseSelectEvent;
        }
    });
    $("#editPlan").bind("click", function(){
        if ("undefined" != typeof parkType) {
            openWin($.lang.pub["modify"], "week_plan.htm", 535, 380, false, 0);
        } else {
            openWin($.lang.pub["modify"], "week_plan.htm", 535, 380, false, (offsetLeft-10));
        }
        StartX = 0;
        EndX = 0;
        StartY = 0;
        EndY = 0;
    });
    
    $("#defence").bind("click", function(e) {
        $(".plan_colorDiv_selected").removeClass("plan_colorDiv_selected");
        $("div.defence").addClass("plan_colorDiv_selected");
        isPainting = true;
        planMode = 0;
        color = defenceColor;
    });
    $("#disarm").bind("click", function(e) {
        $(".plan_colorDiv_selected").removeClass("plan_colorDiv_selected");
        $("div.disarm").addClass("plan_colorDiv_selected");
        isPainting = true;
        planMode = 1;
        color = disarmColor;
    });
    
}


Plan.init = function(cmdType) {
    Plan.initPage();
    Plan.initEvent();
    Plan.initData(cmdType);
    Plan.PaintPlanTemplate();
}