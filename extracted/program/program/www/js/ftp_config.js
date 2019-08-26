/*
 * ******************************* 全局变量定义 start
 * *************************
 */
GlobalInvoke(window);
var pageType = getparastr("pageType");
var channelId = 0;
var dataMap = {};
var PassVehiclelList = [];
var IllegalPicList = [];
var PicNameRuleList = [];
var EpPicNameRuleList = [];
var PathNameArr = top.banner.FTPPathNameArr;
var FileNameArr = top.banner.FTPFileNameArr;
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    DataType: ["UploadType"],
    ServerIP: ["ServerAddr"],
    Port: ["ServerPort"],
    Username: ["UserName"],
    Password: ["Password"],
    StorMode: ["StorMode"],
    FullCoverNum: ["FullCoverNum"]
};
var ruleTypeList = [

    $.lang.pub["none"], $.lang.pub["custom"], $.lang.pub["ipAddr"], $.lang.pub["time"],
    $.lang.pub["date"], $.lang.pub["roadInfo"], $.lang.pub["roadID"], $.lang.pub["deviceId"],
    $.lang.pub["NeedCarPlate"], $.lang.pub["NeedPlateColor"], $.lang.pub["PlateColorID"],
    $.lang.pub["plateType"], $.lang.pub["plateTypeID"], $.lang.pub["drivewayID"],
    $.lang.pub["speed"], $.lang.pub["markedSpeed"], $.lang.pub["limitedSpeed"],
    $.lang.pub["overSpeedPercent"], $.lang.pub["NeedDirect"], $.lang.pub["directID"],
    $.lang.pub["NeedSecurityCode"], $.lang.pub["illegalType"], $.lang.pub["illegalParams"],
    $.lang.pub["carType"], $.lang.pub["carLogo"], $.lang.pub["NeedCarColor"],
    $.lang.pub["CarColorID"], $.lang.pub["CarColorDept"],
    $.lang.pub["picNum"], $.lang.pub["epPicNum"], $.lang.pub["dataAndHour"],
    $.lang.pub["timeYear"], $.lang.pub["timeMonth"], $.lang.pub["timeDay"], $.lang.pub["timeHour"],
    $.lang.pub["timeMin"], $.lang.pub["timeSec"], $.lang.pub["TrgMode"], $.lang.pub["FrameCount"],
    $.lang.pub["carCoordinate"], $.lang.pub["plateCoordinate"], $.lang.pub["redLightTime"],
    $.lang.pub["randomValue"], $.lang.pub["elementLowercase"], $.lang.pub["elementUpercase"], $.lang.pub["picAllCount"],"","","","",$.lang.pub["timeHourMin"]
];
var pathOptionList = [
    $.lang.pub["disable"], $.lang.pub["custom"],
    $.lang.pub["ipAddr"], $.lang.pub["time"], $.lang.pub["date"],
    $.lang.pub["roadInfo"], "", $.lang.pub["device"], "",
    "", "", "", "", $.lang.pub["roadway"], "", "",
    "", "", "", "", "", $.lang.pub["illegalType"], "", "", "", "", "", "", $.lang.pub["picNum"], "", $.lang.pub["dataAndHour"],
    $.lang.pub["timeYear"], $.lang.pub["timeMonth"], $.lang.pub["timeDay"], $.lang.pub["hours"],
    $.lang.pub["timeMin"],"","","","","","","","","","","","","","",$.lang.pub["timeHourMin"]
];
var PICRULENUM = 20;
var PATHNUM = 3;

var signalOptionMap = {
    ".": ".",
    "-": "-",
    "=": "=",
    "_": "_"
};
signalOptionMap[$.lang.pub["custom"]] = $.lang.pub["custom"];


/** ******************************* 全局变量定义 end ************************* */
/** ******************************* 数据处理start************************* */

//过车照片、违章照片tab点击切换
function picTab_click() {
    $(".sectionDiv").addClass("hidden");
    var id = $(this).attr("data-divID");
    $("#" + id).removeClass("hidden");
    $(".tab_selected").removeClass("tab_selected");
    $(this).addClass("tab_selected");
}

//分隔符切换
function toggleFgSignal(id) {
    var options = $("#" + id + " option:selected"),
        $BreakChar = $("#BreakChar"),
        $EpBreakChar = $("#EpBreakChar"),
        value  = $("#" + id).val();
        dataMap[id] = value;
    if(id == "fgSignal"){                 //过车
        if ($.lang.pub["custom"] == value) {
            $BreakChar.removeClass("hidden");
            $BreakChar.val("");
        } else {
            $BreakChar.addClass("hidden");
            $BreakChar.val(options.text());
        }
        $BreakChar.trigger("change");
        $BreakChar.trigger("blur");
    } else {                            //违章
        if ($.lang.pub["custom"] == value) {
            $EpBreakChar.removeClass("hidden");
            $EpBreakChar.val("");
        } else {
            $EpBreakChar.addClass("hidden");
            $EpBreakChar.val(options.text());
        }
        $EpBreakChar.trigger("change");
        $EpBreakChar.trigger("blur");
    }

}

function changeMapToPassVehiclelList() {
    PassVehiclelList = [];

    for (var i = 0; i < PATHNUM; i++) {
        var map = {};
        map["type"] = dataMap["PassVehiclePathType" + i];
        map["name"] = dataMap["PassVehiclePathName" + i];
        PassVehiclelList.push(map);
    }
}

function changeMapToIllegalPicList() {
    IllegalPicList = [];

    for (var i = 0; i < PATHNUM; i++) {
        var map = {};
        map["type"] = dataMap["IllegalPathType" + i];
        map["name"] = dataMap["IllegalPathName" + i];
        IllegalPicList.push(map);
    }
}

function changeMapToPicNameRuleList() {
    PicNameRuleList = [];

    for (var i = 0; i < PICRULENUM; i++) {
        var map = {};
        map["type"] = dataMap["PicNameRulePathType" + i];
        map["name"] = dataMap["PicNameRulePathName" + i];

        if (0 == map["type"]) {

            // 当选项为无时，将后面的数据清空
            for (var j = i; j < PICRULENUM; j++) {

                dataMap["PicNameRulePathType" + j] = 0;

                dataMap["PicNameRulePathName" + j] = "";
            }
            break;
        } else {
        PicNameRuleList.push(map);
        }
    }

// 不满12行时表格中最后添一行，类型为无
    if (i < PICRULENUM) {
        var tmpMap = {type: 0, name: ""};
        PicNameRuleList.push(tmpMap);
    }
}

function changeMapToEpPicNameRuleList() {
    EpPicNameRuleList = [];

    for (var i = 0; i < PICRULENUM; i++) {
        var map = {};
        map["type"] = dataMap["EpPicNameRulePathType" + i];
        map["name"] = dataMap["EpPicNameRulePathName" + i];

        if (0 == map["type"]) {
            // 当选项为无时，将后面的数据清空
            for (var j = i; j < PICRULENUM; j++) {

                // $("#PicNameRulePathType"+j).val(0);
                dataMap["EpPicNameRulePathType" + j] = 0;

                // $("#PicNameRulePathName"+j).val("");
                dataMap["EpPicNameRulePathName" + j] = "";
            }
            break;
        } else {
        EpPicNameRuleList.push(map);
        }
    }

    // 不满12行时表格中最后添一行，类型为无
    if (i < PICRULENUM) {
        var tmpMap = {type: 0, name: ""};
        EpPicNameRuleList.push(tmpMap);
    }
}

/** ******************************* 数据处理end ************************* */
function createRuleOption() {
    var RuleOption = "",
        i,
        len;

    if (FileNameArr.length > 0) {
        for (i = 0, len = FileNameArr.length; i < len; i++) {
            var index = FileNameArr[i];
            RuleOption += "<option value='" + index + "'>" + ruleTypeList[index] + "</option>";
        }
    } else {
        if (!top.banner.isSupportCapture) {
            FileNameArr = [0,1,2,3,4,28,30,31,32,33,34,35,36,50];
            for (i = 0, len = FileNameArr.length; i < len; i++) {
                var index = FileNameArr[i];
                RuleOption += "<option value='" + index + "'>" + ruleTypeList[index] + "</option>";
            }
        } else {
            for(i = 0, len = ruleTypeList.length; i < len; i++) {
                if ("" != ruleTypeList[i]) {
                    RuleOption += "<option value='" + i + "'>" + ruleTypeList[i] + "</option>";
                }
            }
        }
    }
    return RuleOption;
}
// 刷新过车记录表格
function initPicRuleTable() {
    var $picNameRule = $("#picNameRule");
    $picNameRule.empty();
    var RuleOption = createRuleOption();
    var i = 0, len = PicNameRuleList.length;

    for (i; i < len; i++) {
        var info = "<tr><td>" + (i + 1) + "</td>" +
            "<td>" +
            "<div id='InfoDiv" + i + "'>" +
            "<input type='text' class='absoluteDiv hidden' id='PicNameRulePathName" + i + "' maxlength='10' style='width: 150px;position: absolute;' onchange='savePicName(" + i + ")'>" +
            "<select id='PicNameRulePathType" + i + "' style='width:180px' onchange='editInfo(" + i + ")' onblur=''>" +
            RuleOption +
            "</select>" +
            "</div></td>" +
            "<td>" +
            "<input type='text' id='FormatStr" + (i + 1) + "' name='FormatStr" + (i + 1) + "' class='middleTxt hidden' maxlength='32' onchange='saveParam(this.id)'>" +
            "<input type='text' id='UnknowStr" + (i + 1) + "' name='UnknowStr" + (i + 1) + "' class='shortTxt hidden' maxlength='9' onchange='saveParam(this.id)'>" +
            "&nbsp;</td></tr>";
        $picNameRule.append(info);
    }

    // 补齐表格后面的空行
    for (i; i < PICRULENUM; i++) {
        info = "<tr><td>" + (i + 1) + "</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
        $picNameRule.append(info);
    }
    
    dataMap["StorMode"] = $("#StorMode").is(":checked");
    dataMap["DataType"] = $("#DataType").is(":checked");

    // 将内存中的数据填充到页面中
    cfgToForm(dataMap, "frmSetup");

    // 将自定义类型的文本框显示出来
    for (var j = 0; j < PicNameRuleList.length; j++) {
        if (1 == PicNameRuleList[j]["type"]) {
            $("#PicNameRulePathName" + j).removeClass("hidden");
        }
    }

    // 刷新路径
    showPicName();
}

// 刷新违章记录表格
function initEpPicRuleTable() {
    var $epPicNameRule = $("#epPicNameRule");
    $epPicNameRule.empty();
    var RuleOption = createRuleOption();
    var i = 0, len = EpPicNameRuleList.length;
    var index = PicNameRuleList.length;
    for (i; i < len; i++, index++) {
        var info = "<tr><td>" + (i + 1) + "</td>" +
            "<td>" +
            "<div id='InfoDiv" + i + "'>" +
            "<input type='text' class='absoluteDiv hidden' id='EpPicNameRulePathName" + i + "' maxlength='10' style='width: 150px;position: absolute;' onchange='saveEpPicName(" + i + ")'>" +
            "<select id='EpPicNameRulePathType" + i + "' style='width:180px' onchange='editEpInfo(" + i + ")' onblur=''>" +
            RuleOption +
            "</select>" +
            "</div></td>" +
            "<td>" +
            "<input type='text' id='FormatStr" + (index + 1) + "' name='FormatStr" + (index + 1) + "' class='middleTxt hidden' maxlength='32' onchange='saveParam(this.id)'>" +
            "<input type='text' id='UnknowStr" + (index + 1) + "' name='UnknowStr" + (index + 1) + "' class='shortTxt hidden' maxlength='9' onchange='saveParam(this.id)'>" +
            "&nbsp;</td></tr>";
        $epPicNameRule.append(info);
    }

    // 补齐表格后面的空行
    for (i; i < PICRULENUM; i++) {
        info = "<tr><td>" + (i + 1) + "</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
        $epPicNameRule.append(info);
    }
    dataMap["DataType"] = $("#DataType").is(":checked");
    // 将内存中的数据填充到页面中
    cfgToForm(dataMap, "frmSetup");

    // 将自定义类型的文本框显示出来
    for (var j = 0; j < EpPicNameRuleList.length; j++) {
        if (1 == EpPicNameRuleList[j]["type"]) {
            $("#EpPicNameRulePathName" + j).removeClass("hidden");
        }
    }

    // 刷新路径
    showEpPicName();
}

function editInfo(index) {

    // 修改表格中选项时刷新内存，刷新表格
    var $PicNameRulePathType = $("#PicNameRulePathType" + index);
    var value = $PicNameRulePathType.val();
    var length_before = PicNameRuleList.length;
    var tmpMap = objectClone(dataMap);
    dataMap["PicNameRulePathType" + index] = value;

    changeMapToPicNameRuleList();

    // 更新dataMap里的值
    var length_after = PicNameRuleList.length,
        length_total = PicNameRuleList.length + EpPicNameRuleList.length,
        i = length_after + 1;

    for (i; i < length_total; i++, length_before++) {
        dataMap["FormatStr" + i] = tmpMap["FormatStr" + (length_before + 1)];
        dataMap["UnknowStr" + i] = tmpMap["UnknowStr" + (length_before + 1)];
    }
    dataMap["FormatStr" + length_after] = "";
    dataMap["UnknowStr" + length_after] = "";

    initPicRuleTable();
    initEpPicRuleTable();


    // 选项为自定义时将文本输入框显示出来
    var $PicNameRulePathName = $("#PicNameRulePathName" + index);
    if (1 == $PicNameRulePathType.val()) {
        $PicNameRulePathName.removeClass("hidden");
        $PicNameRulePathName.focus();
    } else {
        $PicNameRulePathName.addClass("hidden");
    }
    showPicName();
    showAdvancedParam();
    initValidator();
}

function editEpInfo(index) {

    // 修改表格中选项时刷新内存，刷新表格
    var $EpPicNameRulePathType = $("#EpPicNameRulePathType" + index);
    var value = $EpPicNameRulePathType.val();

    dataMap["EpPicNameRulePathType" + index] = value;
    changeMapToEpPicNameRuleList();
    initEpPicRuleTable();

    // 选项为自定义时将文本输入框显示出来
    var $EpPicNameRulePathName = $("#EpPicNameRulePathName" + index);
    if (1 == $EpPicNameRulePathType.val()) {
        $EpPicNameRulePathName.removeClass("hidden");
        $EpPicNameRulePathName.focus();
    } else {
        $EpPicNameRulePathName.addClass("hidden");
    }
    showEpPicName();
    showAdvancedParam();
    initValidator();
}

function createOption() {
    var str = "";
    if (PathNameArr.length > 0) {
        for (var i = 0; i < PathNameArr.length; i++) {
            var index = PathNameArr[i];
            str += "<option value=" + index + ">" + ruleTypeList[index] + "</option>";
        }
    } else {
        if (!top.banner.isSupportCapture) {
            PathNameArr = [0,1,2,4,30,31,32,33,34,35,50];
            for (var i = 0; i < PathNameArr.length; i++) {
                var index = PathNameArr[i];
                str += "<option value=" + index + ">" + pathOptionList[index] + "</option>";
            }
        } else {
            for (var j = 0, len = pathOptionList.length; j < len; j++) {
                if ("" != pathOptionList[j]) {
                    str += "<option value=" + j + ">" + pathOptionList[j] + "</option>";
                }
            }
        }
    }

    $("select").append(str);
}

//生成“分隔符”下拉列表
function createSignalOption() {
    var str = "",
        value = "",
        $fgSignal = $("#fgSignal"),
        $illfgSignal = $("#illfgSignal");

    $fgSignal.empty();
    $illfgSignal.empty();

    for (var key in  signalOptionMap) {
        value = signalOptionMap[key];
        str += "<option value=" + key + ">" + value + "</option>";
    }

    $fgSignal.append(str);
    $illfgSignal.append(str);
}

function showPicName() {
    var str = $.lang.pub["fileName"],
        $BreakChar = $("#BreakChar"),
        flag = $BreakChar.val();

    // 将字符转成asc码存在内存中
    dataMap["BreakSign"] = ("" == flag) ? flag : flag.charCodeAt(0);
    $("#BreakSign").val(dataMap["BreakSign"]);

    for (var i = 0; i < PicNameRuleList.length; i++) {
        var value = PicNameRuleList[i]["type"];

        if (0 == value) {
            break;
        }
        if (1 == value) {
            str += ("[" + PicNameRuleList[i]["name"] + "]" + flag);
        } else {
            str += ("[" + ruleTypeList[value] + "]" + flag);
        }
    }

    if ("" != flag && $.lang.pub["fileName"] != str) {
        str = str.substring(0, str.length - 1);
    }

    if (PicNameRuleList.length > 1) {
        str += ".jpg";
    }
    $("#flieName").text(str);
}

function showEpPicName() {
    var str = $.lang.pub["fileName"],
        $EpBreakChar = $("#EpBreakChar"),
        flag = $EpBreakChar.val();

    // 将字符转成asc码存在内存中
    dataMap["EpBreakSign"] = ("" == flag) ? flag : flag.charCodeAt(0);
    $("#EpBreakSign").val(dataMap["EpBreakSign"]);

    for (var i = 0; i < EpPicNameRuleList.length; i++) {
        var value = EpPicNameRuleList[i]["type"];

        if (0 == value) {
            break;
        }

        if (1 == value) {
            str += ("[" + EpPicNameRuleList[i]["name"] + "]" + flag);
        } else {
            str += ("[" + ruleTypeList[value] + "]" + flag);
        }
    }

    if ("" != flag && $.lang.pub["fileName"] != str) {
        str = str.substring(0, str.length - 1);
    }

    if (EpPicNameRuleList.length > 1) {
        str += ".jpg";
    }
    $("#EpFlieName").text(str);
}

function savePicName(index) {
    var id = "PicNameRulePathName" + index,
        value = $("#" + id).val();

    if (!validBreakChar(value)) {
        alert($.lang.tip["inputErr"] + $.lang.tip["tipFTPNameErr"]);
        $("#" + id).val(dataMap[id]);
        return;
    }
    // 修改文本框时刷新内存，刷新路径显示
    dataMap["PicNameRulePathName" + index] = value;
    changeMapToPicNameRuleList();
    showPicName();
}

function saveEpPicName(index) {
    var id = "EpPicNameRulePathName" + index,
        value = $("#" + id).val();

    if (!validBreakChar(value)) {
        alert($.lang.tip["inputErr"] + $.lang.tip["tipFTPNameErr"]);
        $("#" + id).val(dataMap[id]);
        return;
    }
    // 修改文本框时刷新内存，刷新路径显示
    dataMap["EpPicNameRulePathName" + index] = $("#EpPicNameRulePathName" + index).val();
    changeMapToEpPicNameRuleList();
    showEpPicName();
}

function showDir(id) {
    var str = $.lang.pub["ftpPath"];
    var i;
    var j = 0;

    for (i = 0; i < PATHNUM; i++) {
        if (0 == dataMap[id + "PathType" + i]) {

            // 当选择选项为无时，将后面的数据置空
            for (j = i; j < PATHNUM; j++) {
                $("#" + id + "PathType" + j).val(0);
                dataMap[id + "PathType" + j] = 0;
                $("#" + id + "PathName" + j).val("");
                dataMap[id + "PathName" + j] = "";
                $("#" + id + "PathName" + j).addClass("hidden");
            }
            break;
        } else {
            str += (0 == i) ? "\\" + "\\ " : "\\ ";
            if (1 == dataMap[id + "PathType" + i]) {
                str += dataMap[id + "PathName" + i];
            } else {
                str += ("[" + $("select" + "[id='" + id + "PathType" + i + "']" + " option:selected").text() + "]");
            }
        }
    }
    $("#" + id + "Dir").text(str);
}
function optionChange(id) {
    if (!validBreakChar($("#" + id).val())) {
        alert($.lang.tip["inputErr"] + $.lang.tip["tipFTPNameErr"]);
        $("#" + id).val(dataMap[id]);
        return;
    }
    dataMap[id] = $("#" + id).val();
    changeMapToPassVehiclelList();
    changeMapToIllegalPicList();
    refreshPassVehicleOption();
    refreshIllegalOption();
}

function refreshPassVehicleOption() {
    var i;
    var j = 0;

    for (j = 0; j < PATHNUM; j++) {
        if (1 == PassVehiclelList[j]["type"]) {
            if(0 == j || 0 != PassVehiclelList[j-1]["type"]){
                $("#PassVehiclePathName" + j).removeClass("hidden");
            }
        } else {
            $("#PassVehiclePathName" + j).addClass("hidden");
        }
    }
    showDir("PassVehicle");
}

function refreshIllegalOption() {
    var i;
    var j = 0;

    for (j = 0; j < PATHNUM; j++) {
        if (1 == IllegalPicList[j]["type"]) {
            if(0 == j || 0 != IllegalPicList[j-1]["type"]){
                $("#IllegalPathName" + j).removeClass("hidden");
            }
        } else {
            $("#IllegalPathName" + j).addClass("hidden");
        }
    }
    showDir("Illegal");
}

function validBreakChar(value) {
    var reg = /[:\*\?\|\/\\"<>]/g;
    return !reg.test(value);
}

//校验规则字符串
function validFormatStr(value) {
    var reg = /^.*<(\(.*\)\d{1,}){0,1}%(\d{1,}\(.*\)){0,1}>.*$/;
    return reg.test(value) || ("" == value);
}

function saveParam(id) {
    dataMap[id] = $("#" + id).val();
}

function checkBoxClick(id) {
    var value = $("#" + id).is(":checked");
    dataMap[id] = value;
}
function showAdvancedParam() {

    var bool = $("#FormatStrEnable").is(":checked");
    var length1 = PicNameRuleList.length,
        length2 = PicNameRuleList.length + EpPicNameRuleList.length,
        i;
    for (i = 1; i < length2; i++) {
        if (length1 == i)continue;
        if (bool) {
            $("#FormatStr" + i).removeClass("hidden");
            $("#UnknowStr" + i).removeClass("hidden");
        } else {
            $("#FormatStr" + i).addClass("hidden");
            $("#UnknowStr" + i).addClass("hidden");
        }
    }
}
//当勾选覆盖存储的时候提示用户配置最后命名元素未图片序号
function storMode(){
    var isStorMode = $("#StorMode").is(":checked");

    if(isStorMode){
        $("#fileNameTip").removeClass("hidden");
    }else{
        $("#fileNameTip").addClass("hidden");
    }
}
//判断覆盖阈值有没有减小，减小则提示用户自己删除存储文件
function isSmaller(){
    var value = $("#FullCoverNum").val();
    if(jsonMap["FullCoverNum"] > value){
        $("#FullCover").removeClass("hidden");
    }else{
        $("#FullCover").addClass("hidden");
    }
}

function initPage() {
    var $RoadIDSpan = $("#RoadIDSpan");
    $RoadIDSpan.html($.lang.pub["roadID"]);
    var $isUploadPic = $("#isUploadPic");
    var $passVehicleFieldset = $("#passCarPic");
    if (top.banner.isSupportCapture) {
        $("#Tab_bar").removeClass("hidden");
    }
    if (1 == pageType) { // 智能FTP
        $("#deviceNameTR").removeClass("hidden");
        $("#deviceIDTR").removeClass("hidden");

        if (top.banner.isSupportIVA) {   // 智能枪球
            if (IVAMode.ILLEGAL == top.banner.IVAType) {
                if (top.banner.isSupportIllegalpic) {
                    $("#illegalCarPic").removeClass("hidden");
                    $("#passCarPic").addClass("hidden");
                    $("button:first").addClass("hidden");
                    $("button:first").removeClass("tab_selected");
                    $("button:last").removeClass("hidden");
                    $("button:last").addClass("tab_selected");
                }else{
                    $("#Tab_bar").addClass("hidden");
                }
                $("#RoadIDTD").removeClass("hidden");
                $("#DirectionIDTD").removeClass("hidden");
                $("#FormatStrTD").removeClass("hidden");
                $("#PathUtf8FormatDIV").removeClass("hidden");
                $("#EpAdvancedNameRule").html($.lang.pub["advanced"]);
                $RoadIDSpan.html($.lang.pub["SceneID"]);
                ruleTypeList[5] = $.lang.pub["sceneName"]; //将“路口名称”修改为“场景名”
                ruleTypeList[6] = $.lang.pub["SceneID"]; //将“路口编号”修改为“场景编号”
                pathOptionList[5] = $.lang.pub["sceneName"]; //将“路口名称”修改为“场景名”
            } else {
                $("#passCarPic").removeClass("hidden");
                $("#illegalCarPic").addClass("hidden");
                $("button:first").removeClass("hidden");
                $("button:first").addClass("tab_selected");
                $("button:last").addClass("hidden");
                $("button:last").removeClass("tab_selected");
                $("#RoadIDTD").removeClass("hidden");
                $("#DirectionIDTD").removeClass("hidden");
            }

        } else { // 卡口电警
            $("button:first").removeClass("hidden");
            $("button:first").addClass("tab_selected");
            $("#passCarPic").removeClass("hidden");
            $("#RoadIDTD").removeClass("hidden");
            $("#DirectionIDTD").removeClass("hidden");
            $("#PlateIDTD").removeClass("hidden");
            $("#FormatStrTD").removeClass("hidden");
            $("#PathUtf8FormatDIV").removeClass("hidden");
            $isUploadPic.parent().removeClass("hidden");
            $("#TgAdvancedNameRule").html($.lang.pub["advanced"]);
            $("#EpAdvancedNameRule").html($.lang.pub["advanced"]);
            if (top.banner.isSupportIllegalpic && top.banner.isSupportIllegalParam) {
                if (top.banner.isSupportPersonPhoto || top.banner.isSupportFaceDetection || top.banner.isSupportFaceQualityPro) {
                    $("#PathUtf8FormatDIV").addClass("hidden");
                    $("#isUploadPic").addClass("hidden");
                    $("#DataType").addClass("hidden");
                    $("#PlateIDTD").addClass("hidden");
                    $("#FormatStrTD").addClass("hidden");
                    $("#Tab_bar").find("button:first").html($.lang.pub["ivaPassVehicleTitle"]);
                } else {
                    $("button:last").removeClass("hidden");
                }
            }
        }
    } else { // 通用FTP
        if (top.banner.isSupportIvaPark) {
            $("#deviceNameTR").removeClass("hidden");
            $("#deviceIDTR").removeClass("hidden");
            $("#Tab_bar").find("button:first").html($.lang.pub["parkPicPath"]);
            $("#passCarPic").removeClass("hidden");
            $("#illegalCarPic").addClass("hidden");
            $("button:first").removeClass("hidden");
            $("button:first").addClass("tab_selected");
            $("button:last").addClass("hidden");
            $("button:last").removeClass("tab_selected");
            $("#RoadIDTD").removeClass("hidden");
            $("#FormatStrTD").removeClass("hidden");
            $("#EpAdvancedNameRule").html($.lang.pub["advanced"]);
            $RoadIDSpan.html($.lang.pub["SceneID"]);
            ruleTypeList[5] = $.lang.pub["sceneName"]; //将“路口名称”修改为“场景名”
            ruleTypeList[6] = $.lang.pub["SceneID"]; //将“路口编号”修改为“场景编号”
            ruleTypeList[13] = $.lang.pub["carPort"]; //将“车道号”修改为“车位号”
            pathOptionList[5] = $.lang.pub["sceneName"]; //将“路口名称”修改为“场景名” 
            pathOptionList[13] = $.lang.pub["carPort"]; //将“车道号”修改为“车位号”
        } else {
            PATHNUM = 4;
            $("#PathType3").removeClass("hidden");
            $("#PassVehicleSpan3").removeClass("hidden");
            $("#Tab_bar").find("button:first").html($.lang.pub["ivaPassVehicleTitle"]);
            $("button:first").removeClass("hidden");
            $isUploadPic.parent().removeClass("hidden");
            $isUploadPic.html($.lang.pub["uploadPic"]);
            $("#storModeTR").removeClass("hidden");
            $("#pageCoverTip").removeClass("hidden");
            $("#FullCoverNumTR").removeClass("hidden");
            $passVehicleFieldset.removeClass("hidden");
        }
    }
    $("#fileNameTip").attr("title", $.lang.pub["fileNameTip"]);  //初始化覆盖存储提示
    $("#FullCover").attr("title", $.lang.pub["FullCover"]); //初始化覆盖减小提示

    createOption();
    createSignalOption();
    $(".tab_selected").trigger("click");
}

function initEvent() {          // 为界面元素绑定处理函数
    var i = 0;
    $("#FormatStrEnable").bind("click", function () {
        showAdvancedParam();
        checkBoxClick(this.id);
    });
    $("button.sectionTab").bind("click", picTab_click);
    $("#fgSignal").change(function (){
        toggleFgSignal("fgSignal");
    });
    $("#illfgSignal").change(function (){
        toggleFgSignal("illfgSignal");
    });
    $("#BreakChar").bind("blur", showPicName);
    $("#BreakChar").change(function () {
        saveParam(this.id);
    });
    for (; i < 4; i++) {
        $("#PassVehiclePathType" + i + ",#PassVehiclePathName" + i).change(function () {
            optionChange(this.id);
        });
    }

    $("#FullCoverNum").change(function(){
       isSmaller();
    });
    $("#StorMode").change(function(){
       storMode();
    });
    $("#PathUtf8Format").bind("click", function () {
        checkBoxClick(this.id);
    });
}

function initValidator() {      // jquery验证方法初始化
    $("#Port").attr("tip",$.validator.format($.lang.tip["tipIntRange"],1,65535));
    $("#FullCoverNum").attr("tip",$.validator.format($.lang.tip["tipIntRange"],1,100000));
    $("#ServerIP").attr("tip",$.lang.tip["tipIPInfo"]);
    $("#Username").attr("tip",$.lang.tip["tipUserName"]);
    $("#DeviceName").attr("tip",$.lang.tip["tipUserName"]);
    $("#RoadID").attr("tip",$.lang.tip["tipUserName"]);
    $("#DeviceID").attr("tip",$.lang.tip["tipUserName"]);
    $("#DirectID").attr("tip",$.lang.tip["tipUserName"]);
    $("#PlateID").attr("tip", $.lang.tip["tipPlateIDErr"]);
    $("#Password").attr("tip", $.lang.tip["tipCommonNamePwd"]);
    $("#EpBreakChar").attr("tip", $.lang.tip["tipFTPBreakCharErr"]);
    $("#BreakChar").attr("tip", $.lang.tip["tipFTPBreakCharErr"]);
    $.validator.addMethod("isIPAddress", function (value) {
        return isIPAddress(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("validBreakChar", function (value) {
        return validBreakChar(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("checkIP1To223", function (value) {
        return checkIP1To223(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("checkUserName", function (value) {
        return checkUserName(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("checkFtpPwd", function (value) {
        return checkCommonNamePwd(value);
    }, $.lang.tip["tipCharFmtErr"]);
    $.validator.addMethod("validFormatStr", function (value) {
        return validFormatStr(value);
    }, $.lang.tip["tipCharFmtErr"]);

    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function (error, element) {
            var parentElement = "div";
            if ("EpBreakChar" == $(element).attr("id") || "BreakChar" == $(element).attr("id")) {
                parentElement = "li";
            }
            showJqueryErr(error, element, parentElement, "picNameRule");
        },
        success: function (label) {
        },
        rules: {
            ServerIP: {
                required: true,
                isIPAddress: "",
                checkIP1To223: ""
            },
            Port: {
                integer: true,
                required: true,
                range: [1, 65535]
            },
            FullCoverNum: {
                integer: true,
                required: true,
                range:[1,100000]
            },
            Username: {
                checkUserName: ""
            },
            Password: {
                checkFtpPwd: ""
            },
            DeviceName: {
                checkUserName: ""
            },
            DeviceID: {
                checkUserName: ""
            },
            RoadID: {
                checkUserName: ""
            },
            DirectID: {
                checkUserName: ""
            },
            PlateID: {
                checkFtpPwd: "",
                validBreakChar: ""
            },
            EpBreakChar: {
                validBreakChar: "",
                checkFtpPwd:""
            },
            BreakChar: {
                validBreakChar: "",
                checkFtpPwd:""
            }
        }
    });
    var rules = validator.settings.rules;
    var count = PicNameRuleList.length + EpPicNameRuleList.length;
    for (var i = 1; i <= count; i++) {
        var id = "FormatStr" + i;
        $("#" + id).attr("tip", $.lang.tip["tipFormatStrTip"]);
        rules[id] = {
            validFormatStr: ""
        };
        id = "UnknowStr" + i;
        $("#" + id).attr("tip", $.lang.tip["tipUnknowStrTip"]);
    }
    validator.init();
}

function fullmappingMap() {
    var i;
    for(i = 0; i < jsonMap["PicName"]["PicNameElement"].length; i++) {
        mappingMap["PicNameRulePathType" + i] = ["PicName", "PicNameElement", i, "PathType"];
        mappingMap["PicNameRulePathName" + i] = ["PicName", "PicNameElement", i, "Path"];
    }
    for(i = 0; i < jsonMap["EPPicName"]["PicNameElement"].length; i++) {
        mappingMap["EpPicNameRulePathType" + i] = ["EPPicName", "PicNameElement", i, "PathType"];
        mappingMap["EpPicNameRulePathName" + i] = ["EPPicName", "PicNameElement", i, "Path"];
    }
    for(i = 0; i < jsonMap["PhotoPath"].length; i++) {
        mappingMap["PassVehiclePathType" + i] = ["PhotoPath", i, "PathType"];
        mappingMap["PassVehiclePathName" + i] = ["PhotoPath", i, "Path"];
    }
    for(i = 0; i < jsonMap["EPPhotoPath"].length; i++) {
        mappingMap["IllegalPathType" + i] = ["EPPhotoPath", i, "PathType"];
        mappingMap["IllegalPathName" + i] = ["EPPhotoPath", i, "Path"];
    }
    for(i = 0; i < jsonMap["ElementNum"]; i++) {
        mappingMap["FormatStr" + (i + 1)] = ["PicAdvanceName", i, "FormatCtrl"];
        mappingMap["UnknowStr" + (i + 1)] = ["PicAdvanceName", i, "UnKnowStr"];
    }
}

function initData() {       // 页面参数初始化
    if (0 == pageType && !top.banner.isSupportIvaPark) {
        jsonMap = {};
        if (!LAPI_GetCfgData(LAPI_URL.FTP_Cfg, jsonMap)) {
            disableAll();
            return;
        }
        jsonMap_bak = objectClone(jsonMap);
       // PATHNUM = 4;
        mappingMap["BreakSign"] = ["NameFormat", "BreakSign"];
        for (var i = 0; i < PATHNUM; i++) {
            mappingMap["PassVehiclePathType" + i] = ["SavedPath", i, "FTPPathType"];
            mappingMap["PassVehiclePathName" + i] = ["SavedPath", i, "Path"];
        }
        for (i = 0; i < PICRULENUM; i++) {
            mappingMap["PicNameRulePathType" + i] = ["NameFormat","FTPPicNameElement", i, "FTPPathType"];
            mappingMap["PicNameRulePathName" + i] = ["NameFormat","FTPPicNameElement", i,"Path" ];
        }
        if(0 == jsonMap["NameFormat"]["BreakSign"]){             //解决火狐不显示空
            dataMap["BreakChar"] = "";
        }else{
            dataMap["BreakChar"] = String.fromCharCode(jsonMap["NameFormat"]["BreakSign"]);
        }
        if(dataMap["BreakChar"] == "." || dataMap["BreakChar"] == "_" ||
            dataMap["BreakChar"] == "-" || dataMap["BreakChar"] == "=") {
            dataMap["fgSignal"] = dataMap["BreakChar"];
        } else {
            dataMap["fgSignal"] = $.lang.pub["custom"];
            $("#BreakChar").removeClass("hidden");
        }
        LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
        changeMapToPicNameRuleList();
        changeMapToPassVehiclelList();
        initPicRuleTable();
        refreshPassVehicleOption();
        showAdvancedParam();
    } else {
        mappingMap = {
            FormatStrEnable: ["Advance"],
            FtpElementNum: ["ElementNum"],
            DataType: ["BaseCfg", "DataType"],
            DeviceID: ["BaseCfg", "DeviceID"],
            DeviceName: ["BaseCfg", "DeviceName"],
            DirectID: ["BaseCfg", "DirectionID"],
            Password: ["BaseCfg", "ServerPassword"],
            PathUtf8Format: ["BaseCfg", "PathUtf8Format"],
            PlateID: ["BaseCfg", "CarPlateInterval"],
            RoadID: ["BaseCfg", "DrivewayID"],
            Username: ["BaseCfg", "UserName"],
            ServerIP: ["BaseCfg", "ServerAddr","IPAddr"],
            Port: ["BaseCfg", "ServerAddr","Port"],
            BreakSign: ["PicName", "BreakSign"],
            EpBreakSign: ["EPPicName", "BreakSign"]
        };
        if (!LAPI_GetCfgData(LAPI_URL.PictureFTP, jsonMap)) {
            // 获取参数失败或是服务器模式
            disableAll();
            return;
        }
        fullmappingMap();
        jsonMap_bak = objectClone(jsonMap);
        LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
        //解决火狐不显示空的问题
        dataMap["BreakChar"] = (0 == dataMap["BreakSign"]) ? "" : String.fromCharCode(dataMap["BreakSign"]);
        dataMap["EpBreakChar"] = (0 == dataMap["EpBreakSign"]) ? "" : String.fromCharCode(dataMap["EpBreakSign"]);
        if(dataMap["BreakChar"] == "." || dataMap["BreakChar"] == "_" ||
            dataMap["BreakChar"] == "-" || dataMap["BreakChar"] == "=") {
            dataMap["fgSignal"] = dataMap["BreakChar"];
        } else {
            dataMap["fgSignal"] = $.lang.pub["custom"];
            $("#BreakChar").removeClass("hidden");
        }
        if(0 == jsonMap["EPPicName"]["BreakSign"]){
            dataMap["EpBreakChar"] = "";
        }else{
            dataMap["EpBreakChar"] = String.fromCharCode(jsonMap["EPPicName"]["BreakSign"]);
        }
        if(dataMap["EpBreakChar"] == "." || dataMap["EpBreakChar"] == "_" ||
            dataMap["EpBreakChar"] == "-" || dataMap["EpBreakChar"] == "=") {
            dataMap["illfgSignal"] = dataMap["EpBreakChar"];
        } else {
            dataMap["illfgSignal"] = $.lang.pub["custom"];
            $("#EpBreakChar").removeClass("hidden");
        }
        LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
        changeMapToPicNameRuleList();
        changeMapToEpPicNameRuleList();
        changeMapToPassVehiclelList();
        changeMapToIllegalPicList();
        initPicRuleTable();
        initEpPicRuleTable();
        refreshPassVehicleOption();
        refreshIllegalOption();
        showAdvancedParam();
    }
    storMode();
}

function submitF() {
    var len = PicNameRuleList.length;
    var isStorMode = $("#StorMode").is(":checked");
    if (!validator.form()) {
        return;
    }
    validator.init();   // 规避点击保存，提示信息位置改变问题
    if (0 == pageType && !top.banner.isSupportIvaPark) {
        LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
        if (isObjectEquals(jsonMap, jsonMap_bak)) {
            top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
            return;
        }
        if(PICRULENUM == len && 0 != PicNameRuleList[len-1]["type"] || 1 == len){  //ftp命名元素最后一行与第一行
            len = len - 1;
        }else{
            len = len -2;
        }
        if(isStorMode && 28 != PicNameRuleList[len]["type"]){
            alert($.lang.pub["fileNameTip"]);
            return;
        }else{
            if (LAPI_SetCfgData("/LAPI/V1.0/NetWork/FTP", jsonMap)) {
                jsonMap_bak = objectClone(jsonMap);
            }
        }
    } else {
        var ElementNum = EpPicNameRuleList.length + PicNameRuleList.length;
        for(i = 0; i < ElementNum; i++) {
            jsonMap["PicAdvanceName"][i] = {};
            jsonMap["PicAdvanceName"][i]["FormatCtrl"] = "";
            jsonMap["PicAdvanceName"][i]["UnKnowStr"] = "";
            mappingMap["FormatStr" + (i + 1)] = ["PicAdvanceName", i, "FormatCtrl"];
            mappingMap["UnknowStr" + (i + 1)] = ["PicAdvanceName", i, "UnKnowStr"];
        }
        LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
        jsonMap["ElementNum"] = ElementNum;
        if (isObjectEquals(jsonMap, jsonMap_bak)) {
            top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
            return;
        }
        for (i = 0; i < ElementNum; i++) {
            if (undefined == jsonMap["PicAdvanceName"][i]["FormatCtrl"]) {
                jsonMap["PicAdvanceName"][i]["FormatCtrl"] = "";
            }
            if (undefined == jsonMap["PicAdvanceName"][i]["UnKnowStr"]) {
                jsonMap["PicAdvanceName"][i]["UnKnowStr"] = "";
            }
        }
        if (LAPI_SetCfgData(LAPI_URL.PictureFTP, jsonMap)) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }

}

$(document).ready(function () {
    if (0 == pageType && !top.banner.isSupportIvaPark) {
        parent.selectItem("ftpConfigTab");
        PathNameArr = top.banner.BasicFTPPathNameArr;
        FileNameArr = top.banner.BasicFTPFileNameArr;
    } else {
        if (top.banner.isSupportIvaPark) {
            parent.selectItem("ftpConfigTab");
        } else if (top.banner.isSupportIpcCapture) {
            parent.selectItem("ivaFtpConfigTab");
        } else {
            parent.selectItem("ivaFtpConfigTab");
        }
    }
    beforeDataLoad();                       // 公共方法，对按钮、页面风格做处理
    initPage();
    initLang();                             // 公共方法，加载语言
    initEvent();                            // 为界面元素绑定时间处理函数
    initData();                             // 页面参数初始化
    initValidator();                        // jquery验证方法初始化
    afterDataLoad();                        // 公共方法
});
