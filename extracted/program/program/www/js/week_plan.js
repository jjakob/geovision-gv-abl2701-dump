
GlobalInvoke(window);
var planType = parent.planType;
var currentWeek = 0;                // 星期一
var sectionNum = parent.PLANNUM;

// 加载语言文件
loadlanguageFile(top.language);
var TimeOverlap = $.lang.tip["tipTimeOverlap"];
var WeekDay = new Array($.lang.pub["Monday"], $.lang.pub["Tuesday"],
        $.lang.pub["Wednesday"], $.lang.pub["Thursday"],
        $.lang.pub["Friday"], $.lang.pub["Saturday"],$.lang.pub["Sunday"]);
        
function ValidTimeRange() {
    var f = document.frmSetup,
        arrbt = [],
        arret = [],
        i;
    
    for (i = 0; i < sectionNum; i++) {
        arrbt[i] = $("#StartTime" + (i+1)).val();
        arret[i] = $("#EndTime" + (i+1)).val();
        
        if (("" == arrbt[i] && "" == arret[i]) || 
            ("00:00:00" == arrbt[i] && "00:00:00" == arret[i]))continue;
            
        if ("" == arrbt[i] || "" == arret[i]) {
            alert($.lang.tip["tipTimeFormatErr1"].replace("%s",WeekDay[currentWeek]));
            return false;
        }
        
        if (arrbt[i] >= arret[i]) {
            alert($.lang.tip["tipTimeFormatErrStartEnd"].replace("%s", WeekDay[currentWeek]));
            return false;
        }
    }
    
    for (i = 0; i < sectionNum; i++) {
        
        if (("" == arrbt[i] && "" == arret[i]) ||
            ("00:00:00" == arrbt[i] && "00:00:00" == arret[i])) {
                continue;
            }
            
        for (var j=1; (i + j)<sectionNum; j++) {
            var tmpbt = arrbt[i + j];
            var tmpet = arret[i + j];
            
            if (("" == tmpbt && "" == tmpet) ||
                ("00:00:00" == tmpbt && "00:00:00" == tmpet)) {
                continue;
            }
            
            if ((arrbt[i] >= tmpbt && arrbt[i] < tmpet) ||
                (tmpbt >= arrbt[i] && tmpbt < arret[i])) {
                alert(TimeOverlap.replace("%s", WeekDay[currentWeek]));
                return false;
            }
        }
    }
    
    return true;
}

function planToForm() {
    var dataList = parent.PlanDataList[currentWeek],
        dataMap = {},
        i = 0,
        len = dataList.length;
    
    for (i = 0; i < len; i++) {
        dataMap = dataList[i];
        $("#StartTime" + (i + 1)).val(dataMap["PlanStartTime"]);
        $("#EndTime" + (i + 1)).val(dataMap["PlanEndTime"]);
    }
}

function formToPlan() {
    var dataList = parent.PlanDataList[currentWeek],
        dataMap = {},
        i = 0,
        len = dataList.length;

    for (i = 0; i < len; i++) {
        dataMap = dataList[i];
        dataMap["PlanStartTime"] = $("#StartTime" + (i + 1)).val();
        dataMap["PlanEndTime"] = $("#EndTime" + (i + 1)).val();
    }
    parent.Plan.repareData(parent.PlanDataList[currentWeek]);
}

// 下发布防计划
function submitWinData() {
    if(!ValidTimeRange())return;
    formToPlan();
    parent.Plan.redraw();
    parent.closeWin();
}
            
function toggle(obj, weekId) {
    
    // 验证时间是否非法
    if(!ValidTimeRange())return;
    
    // 保持数据
    formToPlan();
    
    $("li.selected").removeClass("selected");
    $(obj).addClass("selected");
    currentWeek = weekId;
    planToForm();
    $("#selectAll").attr("checked", false);
    for ( var i = 0; i < 7; i++) {
        var $checkbox = $("#checkbox" + i);
        $checkbox.attr("checked", (currentWeek == i));
        $checkbox.attr("disabled", (currentWeek == i));
    }
}

function selectAll() {
    if ($("#selectAll").is(":checked")) {
        for ( var i = 0; i < 7; i++) {
            if (currentWeek != i) {
                $("#checkbox" + i).attr("checked", true);
            }
        }
    } else {
        for ( var i = 0; i < 7; i++) {
            if (currentWeek != i) {
                $("#checkbox" + i).attr("checked", false);
            }
        }
    }
}

// 复制到星期（数据拷贝）
function doPasteToWeek() {  // 复制到星期几
    var i;
    
    if(!ValidTimeRange())   return;
    formToPlan();
    
    for (i = 0; i < 7; i++) {
        if ($("#checkbox" + i).is(":checked")) {
            if (i == currentWeek) continue;
            parent.Plan.cloneDayData(currentWeek, i);
        }
    }
}

function initPage() {    
    
}

function initEvent() {
    $("#selectAll").bind("click", selectAll);
    $("#copy").bind("click", doPasteToWeek);
    $("input[class='Wdate']").bind("focus", pickerTime);
}

function initData() {
    currentWeek = 0;
    planToForm();
    
    // 默认选中星期一
    $("a[class='selected']").removeClass("selected");
    $("#monday").addClass("selected");
    
    return true;
}

$(document).ready( function() {
    beforeDataLoad();
    initPage();
    initLang();
    initEvent();
    initData();
    strLimit();
});