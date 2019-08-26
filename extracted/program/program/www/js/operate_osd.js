GlobalInvoke(window);

// 加载语言文件
loadlanguageFile(top.language);

var channelId = 0;
var currectInfo = null;         // 当前叠加信息号
var currectAreaID = 0;          // 当前选中的区域（仅通过表格选中）
var osdInfoNum = 8;             // osd叠加信息行数
var osdAreaNum = top.banner.infoOSDNum;             // 叠加osd区域个数
var osdTypeList = top.banner.osdTypeList;           // 支持的叠加osd类型

// 8表示叠加osd区域的个数 ，isDTStyle是否显示非行业样式（一个区域对应一行）
var isDTStyle = ((8 == osdAreaNum) && (VersionType.IN == top.banner.versionType));
var InfoOsdMap = {};
var RollInfoOsdMap = {};
var OsdStyleMap = {};
var ISInfoList = [];
var jsonMap_ISInfo={};
var drawCount = 0;
var video = top.banner.video;                       // 播放器
var posMap = {};                                    // 上次遮盖的坐标
var InfoOsdList = [];
var pageType = getparastr("pageType");
var OSDTYPE = {
    "ISinfo" : 18, //超感类型
    "Rollinfo" : 20,
    "logoInfo": 21 //图片OSD类型
};

var DirectionMap = {};
var jsonMap_OSDStyle = {};
var jsonMap_OSDStyle_bak = {};
var mappingMap_OSDStyle = {
    FontStyle: ["OSDStyleBase", "FontStyle"],
    FontSize: ["OSDStyleBase", "FontSize"],
    DateFormat: ["OSDStyleBase","DateFormat"],
    TimeFormat: ["OSDStyleBase","TimeFormat"],
    Margin: ["OSDStyleExtend", "Margin"],
    Color:["OSDStyleBase", "Color"]
};
var jsonMap_InfoOsd = {};
var jsonMap_InfoOsd_bak = {};
var mappingMap_InfoOsd = {};
var jsonMap_RollInfoOsd = {};
var jsonMap_RollInfoOsd_bak = {};
var mappingMap_RollOSDInfo = {
    MarqueeTxt: ["Value"]
}
var osdTypeName = [
    "",
    $.lang.pub["custom"],
    $.lang.pub["datetime"],
    "",
    $.lang.pub["PTZpos"],
    "",
    $.lang.pub["zoom"],
    $.lang.pub["cruisePresetPos"],
    $.lang.pub["alarm"],
    "",
    $.lang.pub["serialMsg"],
    $.lang.pub["ptzDirectionMsg"],
    "",
    "",
    $.lang.pub["personCount"],
    $.lang.pub["networkMsg"],
    $.lang.pub["time"],
    $.lang.pub["date"],
    $.lang.pub["ISinfo"],
    $.lang.pub["batteryStatus"],
    $.lang.pub["RollOsd"],
    $.lang.pub["logoMsg"],
    $.lang.pub["vehicleFlow"],      //机动车流量
    $.lang.pub["isNotVehicleFlow"], //非机动车流量
    $.lang.pub["runningManFlow"]    //行人流量
];

function changeStyleForInfoType(index) {
    var $InfoTypeindex = $("#InfoType" + index);
    var infoType = $InfoTypeindex.val();
    //超感OSD单独处理
    if (infoType == OSDTYPE.ISinfo ) {
        $("#Value"+index).addClass("hidden");
        $("#ISInfoType"+index).removeClass("hidden");

        $("#logoText"+index).addClass("hidden");
        $("#logoOpacity"+index).addClass("hidden");
        $("#MarqueeContent").addClass("hidden");
        $InfoTypeindex.css("width","50%");
    }else if(OSDTYPE.logoInfo == infoType){ //图片OSD单独处理
        $("#Value"+index).addClass("hidden");
        $("#logoText"+index).removeClass("hidden");
        $("#logoOpacity"+index).removeClass("hidden");

        $("#ISInfoType"+index).addClass("hidden");
        $("#MarqueeContent").addClass("hidden");
        $InfoTypeindex.css("width","50%");
    }else if(OSDTYPE.Rollinfo == infoType){
        $("#Value"+index).removeClass("hidden");
        $("#MarqueeContent").removeClass("hidden");

        $("#ISInfoType"+index).addClass("hidden");
        $("#logoText"+index).addClass("hidden");
        $("#logoOpacity"+index).addClass("hidden");
        $InfoTypeindex.css("width","100%");
    } else {
        $("#Value"+index).removeClass("hidden");
        $("#MarqueeContent").addClass("hidden");
        $("#ISInfoType"+index).addClass("hidden");
        $("#logoText"+index).addClass("hidden");
        $("#logoOpacity"+index).addClass("hidden");
        $InfoTypeindex.css("width","100%");
    }
}

// 叠加osd信息类型赋值
function selectInfoType(index)
{
    var infoType = $("#InfoType"+index).val();
    var field = $("#Field"+index).val();
    var flag = (1 != infoType);
    var text = "";
    var $logoOpacity = $("#logoOpacity"+index);

    if (infoType == OSDTYPE.ISinfo){
        text = $("#ISInfoType"+index+" option:selected").text();
    }else if (infoType == OSDTYPE.logoInfo){  //图片OSD
        text = $("#logoOpacity"+index).val();
    }else {
        text = $("#InfoType"+index+" option:selected").text();
    }

    //超感OSD,图片OSD,滚动OSD单独处理
    changeStyleForInfoType(index);

    text = (!flag)? "": text;
    var $Valueindex = $("#Value" + index);
    $Valueindex.val(text);
    if(OSDTYPE.logoInfo == infoType){
        $("#logoOpacity"+index).focus();  //图片OSD处理
    }else {
        $Valueindex.focus();
    }
    $Valueindex.attr("isChanged", (flag)? 0: 1);
    
    if (isDTStyle) {
        field =  $("#InfoEnable"+index).is(":checked");
        if (flag && field) {
            InfoOsdList[index]["InfoType"] = infoType;
            InfoOsdList[index]["Field"] = index+1;
            if (OSDTYPE.logoInfo == infoType){
                InfoOsdList[index]["Value"] = text;
            }
            submitF_InfoOsd(null,index);
        }
    } else if (flag && (0 != field)) {
        $("#status"+index).addClass("checked");
        if (infoType == OSDTYPE.ISinfo || infoType == OSDTYPE.logoInfo) {  //图片和超感需要下发Value
            InfoOsdList[index]["Value"] = text;
        }
        InfoOsdList[index]["InfoType"] = infoType;
        InfoOsdList[index]["Field"] = field;
        submitF_InfoOsd(null,index);
    }
}

function selectISInfoType(index) 
{
    var text = $("#ISInfoType"+index+" option:selected").text();
    var $Valueindex = $("#Value" + index);
    if (text == $Valueindex.val()) return;
    $Valueindex.val(text);
    InfoOsdList[index]["Value"] = text;
    submitF_InfoOsd(null,index);
}       

// 编辑osd叠加信息
function editOsdInfo(index) {
    showHiddenEditImg(false, "editImg_info", index);

    var $Valueindex = $("#Value" + index);
    if($Valueindex.is(":visible"))return;         // 已经处于编辑状态不需再变换状态
    var $ISInfoTypeindex = $("#ISInfoType" + index);
    if($ISInfoTypeindex.is(":visible")) return;   //已经选中不需要再变化状态
    var $logoOpacityindex = $("#logoOpacity" + index);
    if ($logoOpacityindex.is(":visible")) return; //图片OSD处于编辑状态不需再变换状态

    $("#osdInfoLabel"+index).addClass("hidden");
    $("#osdInfoDiv"+index).removeClass("hidden");
    changeStyleForInfoType(index);
    if($Valueindex.is(":visible") == true) {//如果value可见时选中
        $Valueindex.focus();
    } else {
        if (OSDTYPE.ISinfo == Number($("#InfoType" + index).val())){
            $ISInfoTypeindex.focus();
        }else if (OSDTYPE.logoInfo == Number($("#InfoType" + index).val())){
            $logoOpacityindex.focus();
        }
    }
}

//透明度变化
function logoOpacityChange(index){
    var $logoOpacity = $("#logoOpacity" + index);
    if (!validNumber($logoOpacity[0], 0, 100, $.lang.tip["tipNumScopeErr"].replace("%s", 0+"~"+100))) {  //校验不通过弹框
        $logoOpacity.val($("#Value" + index).val());
        return;
    }
    var text = $logoOpacity.val();

    var $Valueindex = $("#Value" + index);
    if (text == $Valueindex.val()) return;
    $Valueindex.val(text);
    InfoOsdList[index]["Value"] = text;
    submitF_InfoOsd(null,index);
}
        
// 隐藏osd叠加信息
function hiddenOsdInfo(index) {
    setTimeout(function() {
        var actId = document.activeElement.id;
        
        if (("InfoType"+index) == actId ||("ISInfoType"+index) == actId  || ("Value"+index) == actId || ("logoOpacity"+index) == actId) return;

        var $Valueindex = $("#Value" + index);
        if ((1 == $Valueindex.attr("isChanged")) && "" == $Valueindex.val()) {
            $Valueindex.change();
        }
        var $osdInfoLabelindex = $("#osdInfoLabel" + index);

        if(OSDTYPE.logoInfo == Number($("#InfoType"+index).val())){ //图片OSD
            $osdInfoLabelindex.text($("#logoText"+index).text() + $Valueindex.val());
        }else {
            $osdInfoLabelindex.text($Valueindex.val());
        }
        $osdInfoLabelindex.removeClass("hidden");
        $("#osdInfoDiv"+index).addClass("hidden");
    }, 1);
}
        
// 编辑osd显示位置
function editOsdArea(index) {
    showHiddenEditImg(false, "editImg_field", index);
    $("#osdAreaLabel"+index).addClass("hidden");
    var $Fieldindex = $("#Field" + index);
    $Fieldindex.removeClass("hidden");
    $Fieldindex.focus();
}
        
// 隐藏osd显示位置
function hiddenOsdArea(index) {
    var text = $("#Field"+index+" option:selected").text();

    var $osdAreaLabelindex = $("#osdAreaLabel" + index);
    $osdAreaLabelindex.text(text);
    $("#Field"+index).addClass("hidden");
    $osdAreaLabelindex.removeClass("hidden");
}
        
// 叠加osd信息列表选中样式变化
function selectInfoOsd(index) {

    if (null != currectInfo) {
        $("#infoTR" + currectInfo).removeClass("selectedTR");
    }
    currectInfo = index;
    $("#infoTR" + currectInfo).addClass("selectedTR");
    var infoType = $("#InfoType"+index).val();

    if (!isDTStyle) {
        currectAreaID = Number($("#Field" + index).val());
        if (0 == currectAreaID) {
            $("#areaPosField").addClass("hidden");
        } else {
            $("#areaPos").text($.lang.pub["areaPos"] + currectAreaID);
            $("#InfoLeft").val(InfoOsdMap["InfoLeft" + (currectAreaID - 1)]);
            $("#InfoTop").val(InfoOsdMap["InfoTop" + (currectAreaID - 1)]);
            $("#FontAlign").val(OsdStyleMap["FontAlign" + (currectAreaID - 1)]);
            $("#areaPosField").removeClass("hidden");
            $("#areaPosPoint").removeClass("hidden");
            if(OSDTYPE.logoInfo == infoType){ //图片OSD
                $("#importLogoDiv").removeClass("hidden");
            }else {
                $("#importLogoDiv").addClass("hidden");
            }
	       if(OSDTYPE.Rollinfo == infoType){
                $("#MarqueeContent").removeClass("hidden");
                $("#MarqueeTxt").val(jsonMap_RollInfoOsd_bak["Value"]);
		        $("#MarqueeTxt").removeClass("MarqueeTxtError");
            }else{
	            $("#MarqueeContent").addClass("hidden");
	       }
        }
    } else {
        if((OSDTYPE.logoInfo == infoType) || (OSDTYPE.Rollinfo == infoType)){
            $("#areaPosField").removeClass("hidden");
            if(OSDTYPE.logoInfo == infoType){ //图片OSD
                $("#importLogoDiv").removeClass("hidden");
                $("#MarqueeContent").addClass("hidden");
            }else{                          //滚动OSD
                $("#MarqueeContent").removeClass("hidden");
                $("#MarqueeTxt").val(jsonMap_RollInfoOsd_bak["Value"]);
                $("#MarqueeTxt").removeClass("MarqueeTxtError");
                $("#importLogoDiv").addClass("hidden");
            }
        }else {
            $("#areaPosField").addClass("hidden");
        }
        currectAreaID = (index + 1);
    }
}

function importCfg() {
    LAPI_UploadFile(LAPI_URL.ImportFile, "importFileName", importCfg_callback);
}

function importCfg_callback(flag) {
    if(flag) {
        showResult("exportStatusDiv",true, $.lang.tip["tipLogoUploaded"]);
        //submitF_InfoOsd();
    } else {
        showResult("exportStatusDiv",false, $.lang.tip["tipLogoUploadFailed"]);
    }
    $("#importFile").val("");
    $("#importBtn").attr("disabled", true);
}

//显示导入结果
function showResult(id, bool, msg) {
    if (bool) {
        $("#" + id + " a").removeClass("fail").addClass("success");
    } else {
        $("#" + id + " a").removeClass("success").addClass("fail");
    }
    $("#" + id + " span").text(msg);
    $("#" + id).removeClass("hidden");
}

// 上移
function toUp(tableId) {
    var tbl = document.getElementById(tableId);
    
    if (currectInfo != null) {
        
        if (currectInfo == 0) {
            return;
        }
        
        if (0 == $("#Field"+currectInfo).val() &&
            1 == $("#InfoType"+currectInfo).val() &&
             "" == $("#Value"+currectInfo).val()) {         // 本行是空行
            return;
        } else {                                            // 交换值
            changeValues(currectInfo-1);
        }
    }
}
        
// 下移
function toDown(tableId) {
    var tbl = document.getElementById(tableId);
    
    if (currectInfo != null) {
        
        if (currectInfo == tbl.rows.length-1) {              // 已是最后一行
            return;
        }
        
        if (0 == document.getElementById("Field"+currectInfo).value) {          // 本行是空行
            return;
        } else {                // 交换值
            changeValues(currectInfo+1);
        }
    }
}
        
// 交换两行的数据
function changeValues(nextIndex) {
    
    // 界面数据交换
    var $osdInfoLabelcurrectInfo = $("#osdInfoLabel" + currectInfo);
    var infoValueText = $osdInfoLabelcurrectInfo.text();
    var $ValuecurrectInfo = $("#Value" + currectInfo);
    var infoValue = $ValuecurrectInfo.val();
    var $ISInfoTypecurrectInfo = $("#ISInfoType" + currectInfo);
    var isInfoType = $ISInfoTypecurrectInfo.val();
    var $InfoTypecurrectInfo = $("#InfoType" + currectInfo);
    var infoType = $InfoTypecurrectInfo.val();
    var $osdAreaLabelcurrectInfo = $("#osdAreaLabel" + currectInfo);
    var infoFieldText = $osdAreaLabelcurrectInfo.text();
    var $FieldcurrectInfo = $("#Field" + currectInfo);
    var infoField = $FieldcurrectInfo.val();
    var $statuscurrectInfo = $("#status" + currectInfo);
    var class_cur = $statuscurrectInfo.attr("class");

    var $osdInfoLabelnextIndex = $("#osdInfoLabel" + nextIndex);
    $osdInfoLabelcurrectInfo.text($osdInfoLabelnextIndex.text());
    var $ValuenextIndex = $("#Value" + nextIndex);
    $ValuecurrectInfo.val($ValuenextIndex.val());
    var $InfoTypenextIndex = $("#InfoType" + nextIndex);
    $InfoTypecurrectInfo.val($InfoTypenextIndex.val());
    var $ISInfoTypenextIndex = $("#ISInfoType" + nextIndex);
    $ISInfoTypecurrectInfo.val($ISInfoTypenextIndex.val());
    var $osdAreaLabelnextIndex = $("#osdAreaLabel" + nextIndex);
    $osdAreaLabelcurrectInfo.text($osdAreaLabelnextIndex.text());
    var $FieldnextIndex = $("#Field" + nextIndex);
    $FieldcurrectInfo.val($FieldnextIndex.val());
    var $statusnextIndex = $("#status" + nextIndex);
    $statuscurrectInfo.attr("class", $statusnextIndex.attr("class"));
    
    $osdInfoLabelnextIndex.text(infoValueText);
    $ValuenextIndex.val(infoValue);
    $InfoTypenextIndex.val(infoType);
    $ISInfoTypenextIndex.val(isInfoType);
    $osdAreaLabelnextIndex.text(infoFieldText);
    $FieldnextIndex.val(infoField);
    $statusnextIndex.attr("class", class_cur);
    
    // 缓存数据交换
    var tmpField = InfoOsdList[currectInfo]["Field"];
    var tmpInfoType = InfoOsdList[currectInfo]["InfoType"];
    var tmpValue = InfoOsdList[currectInfo]["Value"];
    InfoOsdList[currectInfo]["Field"] = InfoOsdList[nextIndex]["Field"];
    InfoOsdList[currectInfo]["InfoType"] = InfoOsdList[nextIndex]["InfoType"];
    InfoOsdList[currectInfo]["Value"] = InfoOsdList[nextIndex]["Value"];
    InfoOsdList[nextIndex]["Field"] = tmpField;
    InfoOsdList[nextIndex]["InfoType"] = tmpInfoType;
    InfoOsdList[nextIndex]["Value"] = tmpValue;
    
    selectInfoOsd(nextIndex);
    submitF_InfoOsd();
}
            
// 显示隐藏编辑图标
function showHiddenEditImg(flag, id, index) {
    
    if((("editImg_info" == id) && $("#osdInfoLabel"+index).is(":hidden")) ||
       (("editImg_field" == id) && $("#osdAreaLabel"+index).is(":hidden"))) {
          return;
    }
    
    if(flag) {
        $("#"+id+index).removeClass("hidden");
    } else {
        $("#"+id+index).addClass("hidden");
    }
}
        
function validNameContent(v){
    return v.length <= 30;
}
            
// osd叠加信息改变事件
function osdInfoChange(index) {
    var $InfoTypeindex = $("#InfoType" + index);
    $InfoTypeindex.val(1);                // 改为自定义
    var $Valueindex = $("#Value" + index);
    $Valueindex.attr("isChanged", 0);
    var $Fieldindex = $("#Field" + index);
    var field = $Fieldindex.val();
    var value = $Valueindex.val();
    var flag = (0 != field);

    if (isDTStyle) {
        field = $Fieldindex.text();
        flag = $("#InfoEnable"+index).is(":checked");
    }
    
    if (value.length <= 30) {
        
        if (flag) {
            
            // 改变状态
            if ("" == value) {                  // 删除操作
                $("#status"+index).removeClass("checked");
                
                if (undefined == InfoOsdList[index]["Field"]) return;       // 原本就没值
                InfoOsdList[index] = {};
            } else {                                                        // 修改、增加操作
                $("#status"+index).addClass("checked");
                InfoOsdList[index]["Value"] = value;
                InfoOsdList[index]["Field"] = field;
                InfoOsdList[index]["InfoType"] = $InfoTypeindex.val();
            }
            submitF_InfoOsd(null, index);
        }
    } else {
        $("#status"+index).removeClass("checked");
        alert($.lang.tip["inputErr"]+$.lang.tip["tipOSDInfoName"]);
    }
}
        
function osdAreaChange(index) {
    var v = $("#Value"+index).val();
    var field = "";
    var infoType = $("#InfoType"+index).val();
    var isDelete = false;
    
    if (isDTStyle) {
        var value = $("#InfoEnable" + index).is(":checked")? 1 : 0;
        field = $("#Field"+index).text();
        
        InfoOsdMap["InfoEnable"+index] = value;
        InfoOsdList[index]["Enable"] = value;
        showAllArea();
        isDelete = (0 == value);
    } else {
        field = $("#Field"+index).val();
        isDelete = (0 == field);
    }
    
    if ("" == v) return;
    
    if (isDelete) {               // 删除叠加信息
        $("#status"+index).removeClass("checked");
        
        if(undefined == InfoOsdList[index]["Field"]) return;            // 原本就没有叠加信息，不用执行删除直接返回
        
        InfoOsdList[index] = {};
    } else {
        
        if ((1 == infoType) && !validNameContent(v)) {                  // 自定义时验证不通过，直接返回
            return;
        }

        $("#status"+index).addClass("checked");
        InfoOsdList[index]["InfoType"] = infoType;
        
        if (1 == infoType || OSDTYPE.logoInfo == infoType) { //自定义或者图片OSD需要下发value
            InfoOsdList[index]["Value"] = v;
        }
        InfoOsdList[index]["Field"] = field;
    }
    submitF_InfoOsd(null, index);
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
            
// 获取叠加信息osd的下发数据
function getSubmitInfoOsd() {
    LAPI_FormToCfg("frmSetup", jsonMap_InfoOsd, InfoOsdMap, mappingMap_InfoOsd);
    for(var Areanum = 0; Areanum < osdAreaNum; Areanum++) {
        jsonMap_InfoOsd["InfoOSD"][Areanum]["Enable"] = 0;
        for(var Linenum = 0; Linenum < osdInfoNum; Linenum++) {
            jsonMap_InfoOsd["InfoOSD"][Areanum]["InfoParam"][Linenum]["InfoType"] = 0;
            jsonMap_InfoOsd["InfoOSD"][Areanum]["InfoParam"][Linenum]["Value"] = "";
        }
    }
    var enableStr = "";
    var key = "";
    var AreanumList = {};
    for(var AreaID = 1; AreaID <= osdAreaNum; AreaID++) {
        AreanumList["Area" + AreaID + "Num"] = 0;
    }
    var num = 0;
    
    for (var i=0, j=0; i<osdInfoNum; i++) {
        var map = InfoOsdList[i];
 
        if(undefined == map["Field"]) continue;
        if(!(enableStr.indexOf("InfoEnable" + (map["Field"] - 1)) < 0)) {
            AreanumList["Area" + map["Field"] + "Num"]++;
        }
        
        for (var n in map) {
            key = n + j;
            
            if (isDTStyle) {
                key = n + i;
            }

            if ("Field" == n) {
                var k = "InfoEnable"+(map[n]-1);
                
                if (enableStr.indexOf(k)<0) {
                    enableStr += k+"=1&";
                    jsonMap_InfoOsd["InfoOSD"][map[n] - 1]["Enable"] = 1;
                }
                continue;
            }
            num = AreanumList["Area" + map["Field"] + "Num"];
            jsonMap_InfoOsd["InfoOSD"][map["Field"] - 1]["InfoParam"][num][n] = map[n] + "";
        }
        j++;
    }
}

function submitF_InfoOsd(pos, index) {
    var flag;
    
    // 叠加osd内容下发
    getSubmitInfoOsd();
    
    // 坐标
    if (undefined != pos) {
        jsonMap_InfoOsd["InfoOSD"][index]["Area"]["TopLeft"]["X"] = parseInt(pos.split("&")[0].split("=")[1]);
        jsonMap_InfoOsd["InfoOSD"][index]["Area"]["TopLeft"]["Y"] = parseInt(pos.split("&")[1].split("=")[1]);
    }
    
    var isInfoOsdChanged = !isObjectEquals(jsonMap_InfoOsd, jsonMap_InfoOsd_bak);
    if (isInfoOsdChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.OSD, jsonMap_InfoOsd);
        if (flag) {
            jsonMap_InfoOsd_bak = objectClone(jsonMap_InfoOsd);
        }
    }
}
//滚动字幕下发
function submitF_RollInfoOsd(areaNum){
    var isDel = false,
        flag;
    var field = "";
    if (isDTStyle) {
        var value = $("#InfoEnable" + areaNum).is(":checked")? 1 : 0;
        isDel = (0 == value);
    } else {
        field = Number($("#osdAreaLabel"+areaNum).text());
        isDel = (0 == field);
    }
    if(isDel){
        return;
    }
    var Valid = isValidRollData();
    if(!Valid){
        top.banner.showMsg(false);
        return;
    }

    jsonMap_RollInfoOsd["Value"] = $("#MarqueeTxt").val();
    var isRollInfoChanged = !isObjectEquals(jsonMap_RollInfoOsd, jsonMap_RollInfoOsd_bak);
    if(isRollInfoChanged){
        flag = LAPI_SetCfgData(LAPI_URL.Marquee, jsonMap_RollInfoOsd);
        if (flag) {
            jsonMap_RollInfoOsd_bak = objectClone(jsonMap_RollInfoOsd);
        }
    }
}

// osd样式下发
function submitF_OsdStyle() {
    var flag;
    LAPI_FormToCfg("frmSetup", jsonMap_OSDStyle, OsdStyleMap, mappingMap_OSDStyle);
    var isOSDStyleChanged = !isObjectEquals(jsonMap_OSDStyle, jsonMap_OSDStyle_bak);
    if (isOSDStyleChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.OSDStyleCfg, jsonMap_OSDStyle);
        if (flag) {
            jsonMap_OSDStyle_bak = objectClone(jsonMap_OSDStyle);
        }
    }
}

// 修改叠加OSD坐标
function onChangeInfoOsdPos(areaNum, obj) {
    var index = isDTStyle? areaNum : "";
    if (!validNumber(obj, 0, 99, $.lang.tip["tipNumScopeErr"].replace("%s", 0+"~"+99))) {
        return;
    }

    var $InfoLeftindex = $("#InfoLeft" + index);
    var xVal = Number($InfoLeftindex.val());
    var $InfoTopindex = $("#InfoTop" + index);
    var yVal = Number($InfoTopindex.val());
    var drawObjParam = DrawObjMap[DrawType.TITLE][areaNum];

    xVal = isNaN(xVal)? 0: xVal;
    yVal = isNaN(yVal)? 0: yVal;

    if (xVal < RimRect.MIN_WIDTH) {
        xVal = RimRect.MIN_WIDTH;
    }
    
    if (yVal < RimRect.MIN_HEIGHT) {
        yVal = RimRect.MIN_HEIGHT;
    }

    InfoOsdMap["InfoLeft"+areaNum] = xVal;
    InfoOsdMap["InfoTop"+areaNum] = yVal;
    $InfoLeftindex.val(xVal);
    $InfoTopindex.val(yVal);
    var pos = "InfoLeft"+areaNum + "=" + xVal + "&"+
                "InfoTop"+areaNum + "=" + yVal;
    submitF_InfoOsd(pos, areaNum);
    
    drawObjParam["Left"] = xVal * 100;
    drawObjParam["Top"] = yVal * 100;
    if(top.banner.isOldPlugin && !top.banner.isMac){
        setDrawObj(DrawType.TITLE, areaNum, DrawObjMap);
    }else{
        ModifyDrawObj(DrawType.TITLE, areaNum, DrawObjMap);
    }
}

/**
 * ******************************* 上报事件 start
 * ***************************
 */

// 坐标上报事件
function eventDrawObjParam(type, num, strParam) {
    var posMap = {},
        paramMap,
        n,
        startX,
        startY,
        endX,
        endY,
        pos;
    
    paramMap = DrawObjMap[Number(type)][Number(num)];
    if(top.banner.isOldPlugin && !top.banner.isMac){
        sdkAddCfg(posMap, strParam);
    } else {
        posMap = $.parseJSON(strParam);
    }
    // 更新新图形的坐标
    for (n in posMap) {
        paramMap[n] = Number(posMap[n]);
    }
    
    startX = Math.round(paramMap["Left"]/100);
    startY = Math.round(paramMap["Top"]/100);
    InfoOsdMap["InfoLeft"+num] = startX;
    InfoOsdMap["InfoTop"+num] = startY;

    if (!isDTStyle) {
        if (num == (currectAreaID - 1)) {
            $("#InfoLeft").val(startX);
            $("#InfoTop").val(startY);
        }
    } else {
        $("#InfoLeft" + num).val(startX);
        $("#InfoTop" + num).val(startY);
    }
        
    pos = "InfoLeft"+num + "=" + startX + "&"+
            "InfoTop"+num + "=" + startY;
    submitF_InfoOsd(pos, num);
}
        
 // 选中上报事件
function eventSelDrawObj(type, num) {
        selectDrawObj(type, num);
}

// 上报“自动”标定状态
function onCruiseStatus(returnParam)
{
    var cruiseStatus= Number(returnParam["PTZStatus"]["Status"]);

    if (PTZ_STATE_CRUISE.ECOMPASS_START == cruiseStatus) {// 开始标定
        top.banner.updateBlock(true, $.lang.tip["tipOrienting"]);
    } else if(PTZ_STATE_CRUISE.IDLE == cruiseStatus)  {// 结束标定
        top.banner.updateBlock(false);
    }
}

/**
 * ***************************** 上报事件 end
 * ******************************
 */

function changeOptionForLanguage() {
    var str = "";
    var $ptzDirection = $("#ptzDirection");
    var $DateFormat = $("#DateFormat");
    if (LANG_TYPE.Chinese == top.language) {
        
        $ptzDirection.empty();
        str = "<option value='' lang='pleaseSelect'></option>";
        if (top.banner.isSupportEleCompass) {
            str += "<option value='8' lang='automatic'></option>";
        }
        str += "<option value='0' lang='east'></option>"+
            "<option value='2' lang='south'></option>"+
            "<option value='4' lang='west'></option>"+
            "<option value='6' lang='north'></option>"+
            "<option value='1' lang='southeast'></option>"+
            "<option value='7' lang='northeast'></option>"+
            "<option value='3' lang='southwest'></option>"+
            "<option value='5' lang='northwest'></option>";
        $ptzDirection.append(str);
        
        $DateFormat.empty();
        str = "<option value='0' lang='dateFormat0'></option>"+
            "<option value='1' lang='dateFormat1'></option>"+
            "<option value='2' lang='dateFormat2'></option>"+
            "<option value='3' lang='dateFormat3'></option>"+
            "<option value='4' lang='dateFormat4'></option>"+
            "<option value='5' lang='dateFormat5'></option>";
        $DateFormat.append(str);
    } else {
        
        $ptzDirection.empty();
        str = "<option value='' lang='pleaseSelect'></option>";
        if (top.banner.isSupportEleCompass) {
            str += "<option value='264' lang='automatic'></option>";
        }
        str += "<option value='256' lang='east'></option>"+
            "<option value='258' lang='south'></option>"+
            "<option value='260' lang='west'></option>"+
            "<option value='262' lang='north'></option>"+
            "<option value='257' lang='southeast'></option>"+
            "<option value='263' lang='northeast'></option>"+
            "<option value='259' lang='southwest'></option>"+
            "<option value='261' lang='northwest'></option>";
        $ptzDirection.append(str);
        
        $DateFormat.empty();
        str = "<option value='256' lang='dateFormat256'></option>"+
            "<option value='257' lang='dateFormat257'></option>"+
            "<option value='258' lang='dateFormat258'></option>"+
            "<option value='259' lang='dateFormat259'></option>"+
            "<option value='260' lang='dateFormat260'></option>"+
            "<option value='261' lang='dateFormat261'></option>"+
            "<option value='262' lang='dateFormat262'></option>"+
            "<option value='263' lang='dateFormat263'></option>"+
            "<option value='264' lang='dateFormat264'></option>";
        $DateFormat.append(str);
    }
}
            
// osd叠加信息列表
function initOsdInfoTable() {
    var infoTypeOption = "",
        areaOption = "";
    
    for (var j=0,len=osdTypeList.length; j<len; j++) {
        var v = osdTypeList[j];

        infoTypeOption += "<option value='"+v+"'>&lt"+osdTypeName[v]+"&gt</option>";
    }

    var isInfoOption = "";
    for (var i = 0,len=ISInfoList.length; i < len; i++) {
        var ISInfo = ISInfoList[i];
        isInfoOption += "<option value='"+ISInfo["Identify"]+"'>"+ISInfo["Identify"]+"</option>";
    }

    var $osdInfoTable = $("#osdInfoTable");
    $osdInfoTable.empty();

    for (var i = 1; i <= osdAreaNum; i++) {
        areaOption +=  "<option value='" + i + "'>" + $.lang.pub["area"] + i + "</option>";
    }

    for(var i=0; i<osdInfoNum; i++) {
        var status = (InfoOsdMap["Field"+i])? " checked": "";
        var osdInfo = "";
        
        if (isDTStyle) {
            osdInfo = "<tr id='infoTR"+i+"' onclick='selectInfoOsd("+i+")'> "+
                                    "<td>"+
                                        "<input type='checkbox' id='InfoEnable"+i+"' onclick='osdAreaChange("+i+")'>"+
                                    "</td>"+ 
                                    "<td id='Field"+i+"'>"+(i+1)+"</td>"+
                                    "<td onclick='editOsdInfo("+i+")' onmouseover='showHiddenEditImg(true, \"editImg_info\", "+i+")' onmouseout='showHiddenEditImg(false, \"editImg_info\", "+i+")'>"+
                                        "<a class='flagSpan"+status+" right' id='status"+i+"'> </a>"+
                                        "<a id='editImg_info"+i+"' class='icon black-edit right hidden'></a>"+
                                        "<label id='osdInfoLabel"+i+"' style='float: left;width:80%'></label>"+
                                        "<div id='osdInfoDiv"+i+"' class='hidden' style='position:relative;overflow:hidden;'>"+
                                        "<div style='position: absolute;left: 0; right: 20px;'>" +
                                        "<input type='text' isChanged='0' name='Value"+i+"' id='Value"+i+"' maxlength='20' style='width: 100%;' onchange='osdInfoChange("+i+")' onblur='hiddenOsdInfo("+i+")'>"+
                                        "</div>" +
                                        "<select name='InfoType"+i+"' id='InfoType"+i+"' style='width: 100%' onchange='selectInfoType("+i+")' onblur='hiddenOsdInfo("+i+")'>"+
                                        infoTypeOption+
                                        "</select>"+
                                        "<label id='logoText" +i+"' style='width: 25%;text-align: right;' title='"+$.lang.pub['logoOpacity']+"' class='strLimit hidden'>" + $.lang.pub['logoOpacity']+ "</label>"+
                                        "<input type='text' id='logoOpacity"+i+"' name='logoOpacity" +i+"' class='hidden' value='0' style='width: 20%' onchange='logoOpacityChange("+i+",this)' onkeypress='onPicKeyPress(this);' onblur='hiddenOsdInfo("+i+");'>"+
                                        "</div>"+
                                    "</td>"+
                                    "<td><input type='text' id='InfoLeft"+i+"' class='infoText' maxlength='2' onchange = 'onChangeInfoOsdPos("+i+", this)' onKeyPress='onPicKeyPress(this);'/></td>" +
                                    "<td><input type='text' id='InfoTop"+i+"' class='infoText' maxlength='2' onchange = 'onChangeInfoOsdPos("+i+", this)' onKeyPress='onPicKeyPress(this);'/></td>" +
                                "</tr>";
        } else {

            osdInfo = "<tr id='infoTR"+i+"' onclick='selectInfoOsd("+i+")'> "+
                        "<td>"+(i+1)+"</td>"+
                        "<td onclick='editOsdArea("+i+")' onmouseover='showHiddenEditImg(true, \"editImg_field\", "+i+")' onmouseout='showHiddenEditImg(false, \"editImg_field\", "+i+")'>"+
                            "<label id='osdAreaLabel"+i+"' style='float: left'></label>"+
                            "<select name='Field"+i+"' id='Field"+i+"' class='hidden' style='width:60px' onchange='osdAreaChange("+i+")' onblur='hiddenOsdArea("+i+")'>"+
                                "<option value='0' selected='selected'>"+$.lang.pub["none"]+"</option>"+
                                areaOption +
                            "</select>"+
                            "<img id='editImg_field"+i+"' src='images/pen.gif' class='hidden' style='float: right'>"+
                        "</td>"+
                        "<td onclick='editOsdInfo("+i+")' onmouseover='showHiddenEditImg(true, \"editImg_info\", "+i+")' onmouseout='showHiddenEditImg(false, \"editImg_info\", "+i+")'>"+
                            "<label id='osdInfoLabel"+i+"' style='float: left;width:95%'></label>"+
                            "<div id='osdInfoDiv"+i+"' class='hidden' style='position:relative;'>"+
                            "<div style='position: absolute;left: 0; right: 20px;'>" +
                            "<input type='text' isChanged='0' name='Value"+i+"' id='Value"+i+"' maxlength='30' style='width: 100%;' onchange='osdInfoChange("+i+")' onblur='hiddenOsdInfo("+i+")'>"+
                            "</div>" +
                            "<select name='InfoType"+i+"' id='InfoType"+i+"' style='width: 100%' onchange='selectInfoType("+i+")' onblur='hiddenOsdInfo("+i+")'>"+
                            infoTypeOption+
                            "</select>"+
                            "<select name='ISInfoType"+i+"' id='ISInfoType"+i+"' class='hidden' style='width: 50%' onblur='selectISInfoType("+i+");hiddenOsdInfo("+i+");'>"+
                            isInfoOption+
                            "</select>"+
                            "<label id='logoText" +i+"' style='width: 20%;text-align: right;' title='"+$.lang.pub['logoOpacity']+"' class='strLimit hidden'>" + $.lang.pub['logoOpacity']+ "</label>"+
                            "<input type='text' id='logoOpacity"+i+"' name='logoOpacity" +i+"' class='hidden' value='0' style='width: 25%' onchange='logoOpacityChange("+i+",this)' onkeypress='onPicKeyPress(this);' onblur='hiddenOsdInfo("+i+")'>"+
                            "</div>"+
                            "<img id='editImg_info"+i+"' src='images/pen.gif' class='hidden' style='float: right'>"+
                        "</td>"+
                        "<td>"+
                            "<div class='flagSpan"+status+"' id='status"+i+"'> </div>"+
                        "</td>"+    
                    "</tr>";
            }
        $osdInfoTable.append(osdInfo);
    }
}

function changeOSDChannel(){
    var streamID = $("#FishEyeVideoMode").val();
    initData();
    top.banner.video.stopVideo(StreamType.LIVE, 0);
    video.getCurVideoFormat(streamID);
    if(top.banner.isOldPlugin){
        top.banner.video.startVideo(StreamType.LIVE, streamID);
    } else {
        top.banner.video.startVideo(streamID);
    }
    video.setRenderScale(StreamType.LIVE, 0);
    initOsdDrawObjData();
}

function release(){
    EnableDrawFun(StreamType.LIVE, 0);
    parent.hiddenVideo();
}



// 将osd叠加信息Map转换为list<map>
function changeMapToList() {
    InfoOsdList = [];
    for (var i=0; i<osdInfoNum; i++) {
        var map = {};
        
        if (undefined != InfoOsdMap["Field"+i]) {
            map["Field"] = InfoOsdMap["Field"+i];
            map["Value"] = InfoOsdMap["Value"+i];
            map["InfoType"] = InfoOsdMap["InfoType"+i];
        }
        InfoOsdList.push(map);
    }

}

//选择文件
function chooseFileText(obj) {
    var path = obj.value;

    if ("" == path){  //图片校验不通过，清空图片路径
        return;
    }

    //校验图片格式
    if(!(path.match( /.bmp/i ) || path.match( /.png/i ))){  //忽略大小写
        $("#importFile").val("");
        $("#importBtn").attr("disabled",true);
        $("#importFileName").val("");
        showResult("exportStatusDiv",false, $.lang.tip["tipLogoUploadFailed"]); //显示图片上传失败
        alert($.lang.tip["tipFileType"]);
        return;
    }

    $("#importFile").val(path);
    $("#importBtn").attr("disabled",false);
}
        
function initPage(){
    var i,
        posStr;

    if(top.banner.isSupportFishEye) {
        $("#FishEyeVideoModeDiv").removeClass("hidden");
    }
    resetVideoSize(parent.DefaultStreamID, "recordManager_div_activeX");

    if (2 == parent. getCfg("style")) {
        $("body").css("backgroundColor", "#f1f2f3");
    }
    
    if (isDTStyle) {
        $("#infoOsd_8").removeClass("hidden");
        $("#infoOsd_3").remove();
        $("#areaPosPoint").remove();
    } else {
        $("#infoOsd_8").remove();
        $("#infoOsd_3").removeClass("hidden");
        $("#moveBtnDiv").removeClass("hidden");
    }
    
    // 该能力集比较特殊
    if ((top.banner.marginArr.length > 0) && ("" != top.banner.marginArr[0])) {
        parseCapOptions("Margin", top.banner.marginArr, "mode");
        $("#MarginLI").removeClass("hidden");
    }
    if (top.banner.isSupportFontStyle) {
        parseCapOptions("FontStyle", top.banner.osdFontStyleArr, "mode");
        $("#FontStyleLI").removeClass("hidden");
    }
    parseCapOptions("FontSize", top.banner.osdFontSizeArr, "mode");
    
    for (var i = 0, len = osdTypeList.length; i < len; i++) {
        
        if (11 == osdTypeList[i]) {                 // 支持标定
        $("#orientationField").removeClass("hidden");
            break;
        }
    }
    
    changeOptionForLanguage();

    for(i = 0; i < top.banner.infoOSDNum; i++) {
        mappingMap_InfoOsd["InfoLeft" + i] = ["InfoOSD", i, "Area", "TopLeft", "X"];
        mappingMap_InfoOsd["InfoTop" + i] = ["InfoOSD", i, "Area", "TopLeft", "Y"];
        mappingMap_InfoOsd["InfoEnable" + i] = ["InfoOSD", i, "Enable"];
        mappingMap_OSDStyle["FontAlign" + i] = ["OSDStyleExtend", "FontAlign", i];
    }
}
//验证滚动字幕字数
function isValidRollData(){
    var flag = true;
    var MarqueeTxt = $("#MarqueeTxt").val();
    if(MarqueeTxt.length > 200){
        flag = false;
        $("#MarqueeTxt").addClass("MarqueeTxtError");
    }else {
        $("#MarqueeTxt").removeClass("MarqueeTxtError");
    }
    return flag;
}

function initEvent(){
    $("#FontAlign").change(function(){
        OsdStyleMap["FontAlign" + (currectAreaID - 1)] = $("#FontAlign").val();
        submitF_OsdStyle();
    });
    $("#InfoLeft").change(function() {onChangeInfoOsdPos(currectAreaID - 1, this)});
    $("#InfoTop").change(function() {onChangeInfoOsdPos(currectAreaID - 1, this)});
    $("#MarqueeTxt").change(function(){submitF_RollInfoOsd(currectAreaID - 1,this);});
    $("#FishEyeVideoMode").bind("change", changeOSDChannel);
    $("#FontStyle").change(submitF_OsdStyle);
    $("#FontSize").change(submitF_OsdStyle);
    $("#FontColor").change(function() {
        var v = $("#FontColor").val();
        v = v.replace("#", "0x");
        $("#Color").val(Number(v));
        submitF_OsdStyle();
    });
    $("#Margin").change(submitF_OsdStyle);
    $("#DateFormat").change(submitF_OsdStyle);
    $("#TimeFormat").change(submitF_OsdStyle);
    $("#orient").bind("click", function(){
        var v;
        
        v = $("#ptzDirection").val();
        if ("" == v) return;
        DirectionMap["Direction"] = Number(v);
        LAPI_SetCfgData(LAPI_URL.Orientation, DirectionMap);
    });
    $("#importFileName").bind("change",function(){
        chooseFileText(this);
    });
    $("#importBtn").bind("click",importCfg);
}
            
function showAllArea(){
    var i,
        isShow;
                
    for (i = 0; i < osdAreaNum; i++) {
        isShow = 1;
        if (isDTStyle &&　(0 == InfoOsdMap["InfoEnable"+i])) {
            isShow = 0;
        }
        showHiddenArea(DrawType.TITLE, i, isShow);
    }
}
            
// 初始化OSD框体的数据
function initOsdDrawObjData() {
    var drawObjParam,
        i,
        index,
        color,
        name= (LANG_TYPE.Chinese == top.language) ? $.lang.pub["area"]:"area";
        
    DrawObjMap = {};
    DrawObjMap[DrawType.TITLE] = [];
    
    for (i = 0; i < osdAreaNum; i++) {
        drawObjParam = {};
        drawObjParam["Text"] = name + (i + 1);
        drawObjParam["Left"] = Number(InfoOsdMap["InfoLeft" + i])*100;
        drawObjParam["Top"] = Number(InfoOsdMap["InfoTop" + i])*100;
        drawObjParam["LineColor"] = getDrawObjColor("99CCFF");
        drawObjParam["FillColor"] = getDrawObjColor("99CCFF");
        DrawObjMap[DrawType.TITLE].push(drawObjParam);
        drawObjParam["LineWidth"] = 2;
        drawObjParam["OSDType"] = 1;
    }
    initDrawObj(DrawObjMap, showAllArea);
}
            
function initData()
{
    OsdStyleMap = {};
    InfoOsdMap = {};
    RollInfoOsdMap = {};
    channelId = (top.banner.isSupportFishEye ? (parseInt($("#FishEyeVideoMode").val()) - 10) : 0);
    // 获取osd信息
    var i,
        j = 0,
        k = 0,
        areanum = 0,
        OSDLineNum = 0;
    if (!LAPI_GetCfgData(LAPI_URL.OSD, jsonMap_InfoOsd) ||
        !LAPI_GetCfgData(LAPI_URL.OSDStyleCfg, jsonMap_OSDStyle)) {
        
        // 叠加osd和样式获取失败
        disableAll();
        return;
    }

    if (-1 < isContainsElement(OSDTYPE["ISinfo"], osdTypeList)) {
        if (!LAPI_GetCfgData(LAPI_URL.IsStatus,jsonMap_ISInfo)) {
            disableAll();
            return;
        }
        ISInfoList = jsonMap_ISInfo["SensorInfo"];//存储表格数据
    }

    //滚动OSD数据获取
    if(-1 < isContainsElement(OSDTYPE["Rollinfo"],osdTypeList)){
        if(!LAPI_GetCfgData(LAPI_URL.Marquee, jsonMap_RollInfoOsd)){
            disableAll();
            return;
        }
        jsonMap_RollInfoOsd_bak = objectClone(jsonMap_RollInfoOsd);
        LAPI_CfgToForm("frmSetup", jsonMap_RollInfoOsd, RollInfoOsdMap, mappingMap_RollOSDInfo);
    }
    jsonMap_InfoOsd_bak = objectClone(jsonMap_InfoOsd);
    jsonMap_OSDStyle_bak = objectClone(jsonMap_OSDStyle);



    for(i = 0, areanum = jsonMap_InfoOsd["AreaNum"]; i < areanum; i++) {
        if(0 == jsonMap_InfoOsd["InfoOSD"][i]["Enable"]) {
            if (isDTStyle) {
                k++;
            }
            continue;
        }
        for(j = 0, OSDLineNum = jsonMap_InfoOsd["InfoOSD"][i]["InfoParam"].length; j < OSDLineNum; j++) {
            if(0 != jsonMap_InfoOsd["InfoOSD"][i]["InfoParam"][j]["InfoType"]) {
                InfoOsdMap["Field" + k] = i + 1;
                InfoOsdMap["InfoType" + k] = jsonMap_InfoOsd["InfoOSD"][i]["InfoParam"][j]["InfoType"];
                InfoOsdMap["Value" + k] = jsonMap_InfoOsd["InfoOSD"][i]["InfoParam"][j]["Value"];
                k++;
            }
        }
    }

    changeMapToList();
    initOsdInfoTable();         // 生成表格
    // 将颜色数值转换为颜色值
    var color = Number(jsonMap_OSDStyle["OSDStyleBase"]["Color"]).toString(16);
    for (var i = color.length; i < 6; i++) {
        color = "0" + color;
    }
    OsdStyleMap["FontColor"] = "#" + color;
    $("#FontColor").css("background", OsdStyleMap["FontColor"]);
    LAPI_CfgToForm("frmSetup", jsonMap_InfoOsd, InfoOsdMap, mappingMap_InfoOsd);
    LAPI_CfgToForm("frmSetup", jsonMap_OSDStyle, OsdStyleMap, mappingMap_OSDStyle);
    
    for (var i=0; i<osdInfoNum; i++) {
        // 给label赋值
        var infoText = $("#InfoType" + i + " option:selected").text();

        var $InfoTypeI = $("#InfoType" + i);
        if (1 != $InfoTypeI.val() && OSDTYPE.ISinfo != $InfoTypeI.val() && OSDTYPE.logoInfo != $InfoTypeI.val()) {
            $("#Value"+i).val(infoText);
        } else {
            infoText = $("#Value" + i).val();
        }
        if (OSDTYPE.ISinfo == $InfoTypeI.val()) {//设置超感选项的值
            $("#ISInfoType"+i).val(infoText);
        }
        if(OSDTYPE.logoInfo == $InfoTypeI.val()) {//设置图片OSD透明度
            $("#logoOpacity" + i).val(infoText);
            $("#osdInfoLabel" + i).text($.lang.pub["logoOpacity"] + infoText);
        }else {
            $("#osdInfoLabel" + i).text(infoText);
        }
        $("#osdAreaLabel" + i).text($("#Field" + i + " option:selected").text());
    }
}
            
function initVideo_callback(streamType){
    EnableDrawFun(streamType, 1);
    initOsdDrawObjData();
}


$(document).ready(function(){
    if (1 == pageType) {
        parent.selectItem("Com_osdTab");
    } else {
        parent.selectItem("osdTab");
    }
    beforeDataLoad();
    initPage();
    // 初始化语言标签
    initLang();
    initEvent();
    initData();
    initVideo("recordManager_div_activeX", StreamType.LIVE, RunMode.CONFIG, null, top.banner.isSupportPTZ,initVideo_callback);
    afterDataLoad();
});