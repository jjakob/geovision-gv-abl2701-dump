// JavaScript Document
GlobalInvoke(window);
var validator = null;
var channelId = 0;// 通道号
var pageType = getparastr("pageType");
/********************************* 全局变量定义 start **************************/
var contentHtml = "";
var PicOSDcount = 0;
var mjpegOSDcount = 0;
var illegalOSDcount = 0;
var TGSyntOSDcount = 0;
var closeUpOSDcount = 0;
var CurrentArea = 0;
var tabID = 0;

var GlobalOSDArr = [
    {"data-lang": "itemName", "value": "1"},
    {"data-lang": "overspeedPercent", "value": "2"},
    {"data-lang": "TGSyntOSD", "value": "4"},
    {"data-lang": "SyntOSD", "value": "8"}
];
var SubOsd1EnableMap = {};//用于保存通行记录单张图中使能的OSD信息
var SubOsd2EnableMap = {};//用于保存违章记录单张图中使能的OSD信息
var SubOsd3EnableMap = {};//用于保存违章记录合成图中使能的OSD信息
var SubOsd4EnableMap = {};//用于保存通行记录合成图中使能的OSD信息
var SubOsd5EnableMap = {};//用于保存车辆特写图中使能的OSD信息
var OsdExpandMap = {};
var SubOsd1JsonMap = {};
var SubOsd1JsonMap_bak = {};
var SubOsd1mappingMap = {
    SubOSD1OSDMode : ["OSDBaseCFG", "Mode"],
    SubOSD1fontColor : ["OSDBaseCFG", "OSDStyle", "Color"],
    SubOSD1FontSize : ["OSDBaseCFG", "OSDStyle", "FontSize"],
    SubOSD1backgroundColor : ["OSDBaseCFG", "BackColor"],
    SubOSD1CharacterGap : ["OSDBaseCFG", "FontSpace"],
    SubOSD1OSDPrame : ["OSDBaseCFG", "OSDPrame"],
    SubOSD1TimeFormat : ["OSDBaseCFG", "OSDStyle", "TimeFormat"],
    SubOSD1DateFormat : ["OSDBaseCFG", "OSDStyle", "DateFormat"]
};

var SubOsd2JsonMap = {};
var SubOsd2JsonMap_bak = {};
var SubOsd2mappingMap = {
    SubOSD2OSDMode : ["OSDBaseCFG", "Mode"],
    SubOSD2fontColor : ["OSDBaseCFG", "OSDStyle", "Color"],
    SubOSD2FontSize : ["OSDBaseCFG", "OSDStyle", "FontSize"],
    SubOSD2backgroundColor : ["OSDBaseCFG", "BackColor"],
    SubOSD2CharacterGap : ["OSDBaseCFG", "FontSpace"],
    SubOSD2OSDPrame : ["OSDBaseCFG", "OSDPrame"],
    SubOSD2TimeFormat : ["OSDBaseCFG", "OSDStyle", "TimeFormat"],
    SubOSD2DateFormat : ["OSDBaseCFG", "OSDStyle", "DateFormat"]
};

var SubOsd3JsonMap = {};
var SubOsd3JsonMap_bak = {};
var SubOsd3mappingMap = {
    SubOSD3OSDMode : ["OSDBaseCFG", "Mode"],
    SubOSD3fontColor : ["OSDBaseCFG", "OSDStyle", "Color"],
    SubOSD3FontSize : ["OSDBaseCFG", "OSDStyle", "FontSize"],
    SubOSD3backgroundColor : ["OSDBaseCFG", "BackColor"],
    SubOSD3CharacterGap : ["OSDBaseCFG", "FontSpace"],
    SubOSD3OSDPrame : ["OSDBaseCFG", "OSDPrame"],
    SubOSD3TimeFormat : ["OSDBaseCFG", "OSDStyle", "TimeFormat"],
    SubOSD3DateFormat : ["OSDBaseCFG", "OSDStyle", "DateFormat"]
};

var SubOsd4JsonMap = {};
var SubOsd4JsonMap_bak = {};
var SubOsd4mappingMap = {
    SubOSD4OSDMode : ["OSDBaseCFG", "Mode"],
    SubOSD4fontColor : ["OSDBaseCFG", "OSDStyle", "Color"],
    SubOSD4FontSize : ["OSDBaseCFG", "OSDStyle", "FontSize"],
    SubOSD4backgroundColor : ["OSDBaseCFG", "BackColor"],
    SubOSD4CharacterGap : ["OSDBaseCFG", "FontSpace"],
    SubOSD4OSDPrame : ["OSDBaseCFG", "OSDPrame"],
    SubOSD4TimeFormat : ["OSDBaseCFG", "OSDStyle", "TimeFormat"],
    SubOSD4DateFormat : ["OSDBaseCFG", "OSDStyle", "DateFormat"]
};

var SubOsd5JsonMap = {};
var SubOsd5JsonMap_bak = {};
var SubOsd5mappingMap = {
    SubOSD5OSDMode : ["OSDBaseCFG", "Mode"],
    SubOSD5fontColor : ["OSDBaseCFG", "OSDStyle", "Color"],
    SubOSD5FontSize : ["OSDBaseCFG", "OSDStyle", "FontSize"],
    SubOSD5backgroundColor : ["OSDBaseCFG", "BackColor"],
    SubOSD5CharacterGap : ["OSDBaseCFG", "FontSpace"],
    SubOSD5OSDPrame : ["OSDBaseCFG", "OSDPrame"],
    SubOSD5TimeFormat : ["OSDBaseCFG", "OSDStyle", "TimeFormat"],
    SubOSD5DateFormat : ["OSDBaseCFG", "OSDStyle", "DateFormat"]
};

var vehicleRecordGlobalOSDArr = top.banner.vehicleRecordGlobalOSDArr; //过车记录通用OSD选项
var peccancyRecordGlobalOSDArr = top.banner.peccancyRecordGlobalOSDArr; //违章记录通用OSD选项
var peccancySyntPicGlobalOSDArr = top.banner.peccancySyntPicGlobalOSDArr; //违章合成图通用OSD选项
var TGSyntPicGlobalOSDArr = top.banner.TGSyntPicGlobalOSDArr; //过车合成图通用OSD选项
var closeUpGlobalOSDArr = top.banner.closeUpGlobalOSDArr; //特写图通用OSD选项
var vehicleOSDArr = top.banner.vehicleRecordOSDArr;  //过车记录OSD选项
var peccancyOSDArr = top.banner.peccancyRecordOSDArr; //违章记录OSD选项
var SyntPicOSDArr = top.banner.peccancySyntPicOSDArr; //违章合成图OSD选项
var TGSyntOSDArr = top.banner.TGSyntPicOSDArr; //过车合成图OSD选项
var pictrueTypecloseUpOSDArr = top.banner.closeUpOSDArr; //特写图OSD选项
var osdType = [
    {"id":"PicTimeOsdEnable","lang":"time"},
    {"id":"PicSpeedOsdEnable","lang":"speed"},
    {"id":"PicLmtSpeedOsdEnable","lang":"lmtSpeed"},
    {"id":"PicPeccancyOsdEnable","lang":"illegalTypeOSD"},
    {"id":"PicCarColorOsdEnable","lang":"carColor"},
    {"id":"PicCarLogoOsdEnable","lang":"carLogo"},
    {"id":"PicCarTypeOsdEnable","lang":"carType"},
    {"id":"PicDrivingTypeOsdEnable","lang":"DrivingType"},
    {"id":"PicVehiclePlateOsdEnable","lang":"plateNumber"},
    {"id":"PicVehicleWayIDOsdEnable","lang":"roadway"},
    {"id":"PicVehicleCameraIDOsdEnable","lang":"cameraID"},
    {"id":"PicVehicleDirectionOsdEnable","lang":"NeedDirect"},
    {"id":"PicVehicleCapDirectionOsdEnable","lang":"captureDirection"},
    {"id":"PicVehicleVerifyOsdEnable","lang":"verify"},
    {"id":"PicVehicleNameOsdEnable","lang":"itemName"},
    {"id":"PicVehicleSpeedPercentOsdEnable","lang":"overspeedPercent"},
    {"id":"MJPEGVehicleCapDirectionOsdEnable","lang":"NeedDirect"},
    {"id":"MJPEGVehicleRoadMessageOsdEnable","lang":"NeedSceneName"},
    {"id":"MJPEGVehicleTimeOsdEnable","lang":"time"},
    {"id":"PicTimeMilisecOsdEnable","lang":"millisecond"},
    {"id":"MJPEGVehicleTimeMilisecOsdEnable","lang":"millisecond"},
    {"id":"PicDeviceIDOsdEnable","lang":"device"},
    {"id":"PicRodeMessageOsdEnable","lang":"NeedSceneName"},
    {"id":"MJPEGVehicleDeviceIDOsdEnable","lang":"device"},
    {"id":"MJPEGVehicleVerifyOsdEnable","lang":"verify"},
    {"id":"MJPEGVehicleRedStartTimeOsdEnable","lang":"redStartTime"},
    {"id":"MJPEGVehicleNameOsdEnable","lang":"itemName"},
    {"id":"SyntPicDeviceIDEnable","lang":"device"},
    {"id":"SyntPicPlaceEnable","lang":"NeedSceneName"},
    {"id":"SyntPicDirectionEnable","lang":"NeedDirect"},
    {"id":"SyntPicWayIDEnable","lang":"roadway"},
    {"id":"SyntPicTimeEnable","lang":"time"},
    {"id":"SyntPicRedLightStartTimeEnable","lang":"redLightStartTime"},
    {"id":"SyntPicRedLightEndTimeEnable","lang":"redLightEndTime"},
    {"id":"SyntPicVehiclePlateEnable","lang":"plateNumber"},
    {"id":"SyntPicPlateColorEnable","lang":"NeedPlateColor"},
    {"id":"SyntPicPeccancyTypeEnable","lang":"illegalTypeOSD"},
    {"id":"SyntPicVehicleLogoEnable","lang":"carLogo"},
    {"id":"SyntPicVehicleTypeEnable","lang":"carType"},
    {"id":"SyntPicVehicleSpeedEnable","lang":"speed"},
    {"id":"SyntPicVehicleColorEnable","lang":"carColor"},
    {"id":"SyntPicLimitSpeedEnable","lang":"lmtSpeed"},
    {"id":"SyntPicVehicleDirectionEnable","lang":"drivingDirection"},
    {"id":"SyntPicTimeMiliSecEnable","lang":"millisecond"},
    {"id":"SyntPicVehicleVerifyEnable","lang":"verify"},
    {"id":"SyntPicVehicleNameEnable","lang":"itemName"},
    {"id":"PicVehiclePlateColorEnable","lang":"NeedPlateColor"},  //46
    {"id":"MJPEGPeccancyTypeEnable","lang":"illegalTypeOSD"},
    {"id":"MJPEGVehicleWayIDEnable","lang":"roadway"},
    {"id":"MJPEGPeccencyCodeEnable","lang":"illegalCodeOSD"},
    {"id":"SyntPeccencyCodeEnable","lang":"illegalCodeOSD"},
    {"id":"PicVehicleWeightOsdEnable","lang":"carWeight"},
    {"id":"MJPEGVehicleSpeedEnable","lang":"speed"},
    {"id":"MJPEGLimitedSpeedEnable","lang":"lmtSpeed"},
    {"id":"MJPEGVehicleSpeedPercentEnable","lang":"overspeedPercent"},
    {"id":"MJPEGVehiclePlateEnable","lang":"plateNumber"},
    {"id":"SyntVehicleSpeedPercentEnable","lang":"overspeedPercent"},
    {"id":"PicSunPilotStatusEnable","lang":"sunPolitOsd"},
    {"id":"MJPEGSunPilotStatusEnable","lang":"sunPolitOsd"},
    {"id":"SyntSunPilotStatusEnable","lang":"sunPolitOsd"},
    {"id":"TGSyntTimeEnable","lang":"time"},
    {"id":"TGSyntPlaceEnable","lang":"NeedSceneName"},
    {"id":"TGSyntDirectionEnable","lang":"NeedDirect"},
    {"id":"TGSyntDeviceIDEnable","lang":"device"},
    {"id":"TGSyntVehicleVerifyOsdEnable","lang":"verify"},
    {"id":"TGSyntPeccancyTypeEnable","lang":"illegalTypeOSD"},
    {"id":"TGSyntVehiclePlateOsdEnable","lang":"plateNumber"},
    {"id":"TGSyntVehiclePlateColorEnable","lang":"NeedPlateColor"},
    {"id":"TGSyntVehicleSpeedEnable","lang":"speed"},
    {"id":"TGSyntPicVehicleTypeEnable","lang":"carType"},
    {"id":"TGSyntCarLogoOsdEnable","lang":"carLogo"},
    {"id":"TGSyntPicVehicleColorEnable","lang":"carColor"},
    {"id":"TGSyntVehicleWayIDEnable","lang":"roadway"},
    {"id":"TGSyntPicLimitSpeedEnable","lang":"lmtSpeed"},
    {"id":"TGSyntVehicleSpeedPercentOsdEnable","lang":"overspeedPercent"},
    {"id":"TGSyntVehicleTimeMilisecOsdEnable","lang":"millisecond"},
    {"id":"TGSyntVehicleCapDirectionOsdEnable","lang":"captureDirection"},
    {"id":"TGSyntPicVehicleNameEnable","lang":"itemName"},
    {"id":"TGSyntDrivingTypeOsdEnable","lang":"DrivingType"},
    {"id":"TGSyntVehicleCameraIDOsdEnable","lang":"cameraID"},
    {"id":"TGSyntVehicleWeightOsdEnable","lang":"carWeight"},
    {"id":"TGSyntSunPilotStatusEnable","lang":"sunPolitOsd"},
    {"id":"TGSyntSeatBeltEnable","lang":"SeatBeltOsd"},
    {"id":"PicSeatBeltEnable","lang":"SeatBeltOsd"},
    {"id":"MJPEGSeatBeltEnable","lang":"SeatBeltOsd"},
    {"id":"SyntSeatBeltEnable","lang":"SeatBeltOsd"},
    {"id":"MJPEGRedlightHasTime","lang":"RedlightTime"},
    {"id":"SyntRedlightHasTime","lang":"RedlightTime"},
    {"id":"","lang":""},//监测点编号
    {"id":"TGSyntOSDEnable","lang":"TGSyntOSD"},
    {"id":"SyntOSDEnable","lang":"SyntOSD"},
    {"id":"NeedPlateColor","lang":"NeedPlateColor"},
    {"id":"PicWhiteListEnable","lang":"WhiteList"},
    {"id":"MJPEGIPManualSnap","lang":"manualCaptureOSD"},  //93
    {"id":"SynIPManualSnap","lang":"manualCaptureOSD"},
    {"id":"MJPEGCustom1","lang":"Needcustom1"},
    {"id":"MJPEGCarColorOsdEnable","lang":"carColor"},
    {"id":"PicTelPhoneOsdEnable","lang":"telPhoneOsd"},
    {"id":"MJPEGTelPhoneOsdEnable","lang":"telPhoneOsd"},
    {"id":"SyntTelPhoneOsdEnable","lang":"telPhoneOsd"},
    {"id":"TGSyntTelPhoneOsdEnable","lang":"telPhoneOsd"},
    {"id":"MJPEGCustom2","lang":"Needcustom2"},
    {"id":"MJPEGCustom3","lang":"Needcustom3"},
    {"id":"CloseupTimeEnable","lang":"time"},
    {"id":"CloseupMessageOsdEnable","lang":"NeedSceneName"},
    {"id":"CloseupVehicleWayIDEnable","lang":"roadway"},
    {"id":"CloseupVehiclePlateOsdEnable","lang":"plateNumber"},
    {"id":"CloseupCustom1","lang":"Needcustom1"},
    {"id":"CloseupCustom2","lang":"Needcustom2"},
    {"id":"CloseupCustom3","lang":"Needcustom3"},
    {"id":"PicVehicleCustom1","lang":"Needcustom1"},
    {"id":"PicVehicleCustom2","lang":"Needcustom2"},
    {"id":"PicVehicleCustom3","lang":"Needcustom3"},
    {"id":"SyntPicCustom1","lang":"Needcustom1"},
    {"id":"SyntPicCustom2","lang":"Needcustom2"},
    {"id":"SyntPicCustom3","lang":"Needcustom3"},
    {"id":"TGSyntCustom1","lang":"Needcustom1"},
    {"id":"TGSyntCustom2","lang":"Needcustom2"},
    {"id":"TGSyntCustom3","lang":"Needcustom3"},
    {"id":"PicLowSpeedEnable","lang":"lowspeedOSD"},
    {"id":"SyntLowSpeedEnable","lang":"lowspeedOSD"},
    {"id":"MJPEGLowSpeedEnable","lang":"lowspeedOSD"},
    {"id":"TGSyntLowSpeedEnable","lang":"lowspeedOSD"},
    {"id":"vehicleFlowOsdEnable","lang":"vehicleFlow"},          //机动车流量
    {"id":"isNotVehicleFlowOsdEnable","lang":"isNotVehicleFlow"},//非机动车流量
    {"id":"runningManFlowOsdEnable","lang":"runningManFlow"}    //行人流量
];
/********************************* 全局变量定义 end **************************/ 
//动态生成OSD选项
function initOSDFieldset() {
    var index = 0;
    var id = "";
    var lang = "";
    var str = "";

    for (var i = 0; i < vehicleOSDArr.length; i++) {
        index = vehicleOSDArr[i];
        id = osdType[index]["id"];
        lang = osdType[index]["lang"];
        str = "<li><input type='checkbox' name='vehicleOSDLI' id='" + id +
            "' /><label for='" + id + "'><lang name='" + lang + "'></lang></label></li>";
        $("#vehicleOSD").append(str);
        $("#" + id).bind("change", initpicOsdTbl);
    }
    for (var i = 0; i < TGSyntOSDArr.length; i++) {
        index = TGSyntOSDArr[i];
        id = osdType[index]["id"];
        lang = osdType[index]["lang"];
        str = "<li><input type='checkbox' name='TGSyntOSDLI' id='" + id +
            "' /><label for='" + id + "'><lang name='" + lang + "'></lang></label></li>";
        $("#TGSyntOSD").append(str);
        $("#" + id).bind("change", initTGSyntOsdTbl);
    }
    for (var i = 0; i < peccancyOSDArr.length; i++) {
        index = peccancyOSDArr[i];
        id = osdType[index]["id"];
        lang = osdType[index]["lang"];
        str = "<li><input type='checkbox' name='peccancyOSDLI' id='" + id +
            "' /><label for='" + id + "'><lang name='" + lang + "'></lang></label></li>";
        $("#peccancyOSD").append(str);
        $("#" + id).bind("change", initmjpegOsdTbl);
    }
    for (var i = 0; i < SyntPicOSDArr.length; i++) {
        index = SyntPicOSDArr[i];
        id = osdType[index]["id"];
        lang = osdType[index]["lang"];
        str = "<li><input type='checkbox' name='SyntPicOSDLI' id='" + id +
            "' /><label for='" + id + "'><lang name='" + lang + "'></lang></label></li>";
        $("#SyntPicOSD").append(str);
        $("#" + id).bind("change", initillegalOsdTbl);
    }
    for (var i = 0; i < pictrueTypecloseUpOSDArr.length; i++) {
        index = pictrueTypecloseUpOSDArr[i];
        id = osdType[index]["id"];
        lang = osdType[index]["lang"];
        str = "<li><input type='checkbox' name='closeUpOSDLI' id='" + id +
            "' /><label for='" + id + "'><lang name='" + lang + "'></lang></label></li>";
        $("#closeUpOSD").append(str);
        $("#" + id).bind("change", initcloseUpOsdTbl);
    }
}

function disableSubItem(id, subId) {
    var bool = $("#" + id).attr("checked");
    var $subId = $("#" + subId);
    if (!bool) {
        $subId.attr("checked", false);
    }
    $subId.attr("disabled", !bool);
}

function tab_click() {
    var event = getEvent(),
        oSrc = event.srcElement ? event.srcElement : event.target,
        id = $(oSrc).attr("data-divID");
    strShow($(this));

    $("#picOsdDiv").addClass("hidden");
    $("#mjpegOsdDiv").addClass("hidden");
    $("#illegalOsdDiv").addClass("hidden");
    $("#TGSyntOsdDiv").addClass("hidden");
    $("#pictrueTypecloseUpDiv").addClass("hidden");
    $("#" + id).removeClass("hidden");

    //选中样式变化
    $(".tab_selected").removeClass("tab_selected");
    $(oSrc).addClass("tab_selected");
    if("picOsdDiv" == id) {
        tabID = 1;
    } else if("mjpegOsdDiv" == id) {
        tabID = 2;
    } else if("illegalOsdDiv" == id) {
        tabID = 3;
    } else if("TGSyntOsdDiv" == id) {
        tabID = 4;
    } else if("pictrueTypecloseUpDiv" == id) {
        tabID = 5;
    }
    parent.initOsdDrawObjData(tabID);
    parent.setIframeHeight("subOSDInfoiframe");
    initValidator();
}

function submitF() {
    var v,
        OsdEnable,
        SpeedPercentOsdEnable,
        TGSyntOsdEnable,
        SyntOsdEnable,
        $SubOSD1NameOsdEnable = $("#SubOSD1NameOsdEnable"),
        $SubOSD1SpeedPercentOsdEnable = $("#SubOSD1SpeedPercentOsdEnable"),
        $SubOSD1TGSyntOsdEnable = $("#SubOSD1TGSyntOsdEnable"),
        $SubOSD1SyntOsdEnable = $("#SubOSD1SyntOsdEnable"),
        $SubOSD2NameOsdEnable = $("#SubOSD2NameOsdEnable"),
        $SubOSD2SpeedPercentOsdEnable = $("#SubOSD2SpeedPercentOsdEnable"),
        $SubOSD2TGSyntOsdEnable = $("#SubOSD2TGSyntOsdEnable"),
        $SubOSD2SyntOsdEnable = $("#SubOSD2SyntOsdEnable"),
        $SubOSD3NameOsdEnable = $("#SubOSD3NameOsdEnable"),
        $SubOSD3SpeedPercentOsdEnable = $("#SubOSD3SpeedPercentOsdEnable"),
        $SubOSD3TGSyntOsdEnable = $("#SubOSD3TGSyntOsdEnable"),
        $SubOSD3SyntOsdEnable = $("#SubOSD3SyntOsdEnable"),
        $SubOSD4NameOsdEnable = $("#SubOSD4NameOsdEnable"),
        $SubOSD4SpeedPercentOsdEnable = $("#SubOSD4SpeedPercentOsdEnable"),
        $SubOSD4TGSyntOsdEnable = $("#SubOSD4TGSyntOsdEnable"),
        $SubOSD4SyntOsdEnable = $("#SubOSD4SyntOsdEnable"),
        $SubOSD5NameOsdEnable = $("#SubOSD5NameOsdEnable"),
        $SubOSD5SpeedPercentOsdEnable = $("#SubOSD5SpeedPercentOsdEnable"),
        $SubOSD5TGSyntOsdEnable = $("#SubOSD5TGSyntOsdEnable"),
        $SubOSD5SyntOsdEnable = $("#SubOSD5SyntOsdEnable");
    if(!validator.form())
        return;
    if (vehicleOSDArr.length > 0) {
        if (peccancyOSDArr.length <= 0) {
            v = $("#SubOSD1FontColor").val();
            v = v.replace("#", "0x");
            $("#SubOSD1fontColor").val(Number(v));

            v = $("#SubOSD1BackgroundColor").val();
            v = v.replace("#", "0x");
            $("#SubOSD1backgroundColor").val(Number(v));
        }
        OsdEnable = Number($SubOSD1NameOsdEnable.length > 0 && $SubOSD1NameOsdEnable.is(":checked")?$SubOSD1NameOsdEnable.val() : 0);
        SpeedPercentOsdEnable = Number($SubOSD1SpeedPercentOsdEnable.length > 0 && $SubOSD1SpeedPercentOsdEnable.is(":checked")?$SubOSD1SpeedPercentOsdEnable.val() : 0);
        TGSyntOsdEnable = Number($SubOSD1TGSyntOsdEnable.length > 0 && $SubOSD1TGSyntOsdEnable.is(":checked")?$SubOSD1TGSyntOsdEnable.val() : 0);
        SyntOsdEnable = Number($SubOSD1SyntOsdEnable.length > 0 && $SubOSD1SyntOsdEnable.is(":checked")?$SubOSD1SyntOsdEnable.val() : 0);
        $("#SubOSD1OSDPrame").val(OsdEnable + SpeedPercentOsdEnable + TGSyntOsdEnable + SyntOsdEnable);
        for(i = 0; i < SubOsd1JsonMap["OSDNum"]; i++) {
            $("#" + osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).val($("#" + osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")?1 : 0);
        }

        LAPI_FormToCfg("frmSetup", SubOsd1JsonMap, OsdExpandMap, SubOsd1mappingMap);
        if(!isObjectEquals(SubOsd1JsonMap,SubOsd1JsonMap_bak)) {
            if (!LAPI_SetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=0", SubOsd1JsonMap)) return;
            SubOsd1JsonMap_bak = objectClone(SubOsd1JsonMap);
        }
    }

    if (peccancyOSDArr.length > 0) {
        v = $("#SubOSD2FontColor").val();
        v = v.replace("#", "0x");
        $("#SubOSD2fontColor").val(Number(v));

        v = $("#SubOSD2BackgroundColor").val();
        v = v.replace("#", "0x");
        $("#SubOSD2backgroundColor").val(Number(v));
        OsdEnable = Number($SubOSD2NameOsdEnable.length > 0 && $SubOSD2NameOsdEnable.is(":checked")?$SubOSD2NameOsdEnable.val() : 0);
        SpeedPercentOsdEnable = Number($SubOSD2SpeedPercentOsdEnable.length > 0 && $SubOSD2SpeedPercentOsdEnable.is(":checked")?$SubOSD2SpeedPercentOsdEnable.val() : 0);
        TGSyntOsdEnable = Number($SubOSD2TGSyntOsdEnable.length > 0 && $SubOSD2TGSyntOsdEnable.is(":checked")?$SubOSD2TGSyntOsdEnable.val() : 0);
        SyntOsdEnable = Number($SubOSD2SyntOsdEnable.length > 0 && $SubOSD2SyntOsdEnable.is(":checked")?$SubOSD2SyntOsdEnable.val() : 0);
        $("#SubOSD2OSDPrame").val(OsdEnable + SpeedPercentOsdEnable + TGSyntOsdEnable + SyntOsdEnable);
        for(i = 0; i < SubOsd2JsonMap["OSDNum"]; i++) {
            $("#" + osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).val($("#" + osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")?1 : 0);
        }
        LAPI_FormToCfg("frmSetup", SubOsd2JsonMap, OsdExpandMap, SubOsd2mappingMap);
        if(!isObjectEquals(SubOsd2JsonMap,SubOsd2JsonMap_bak)) {
            if (!LAPI_SetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=1", SubOsd2JsonMap)) return;
            SubOsd2JsonMap_bak = objectClone(SubOsd2JsonMap);
        }
    }

    if (SyntPicOSDArr.length > 0) {
        v = $("#SubOSD3FontColor").val();
        v = v.replace("#", "0x");
        $("#SubOSD3fontColor").val(Number(v));
        
        v = $("#SubOSD3BackgroundColor").val();
        v = v.replace("#", "0x");
        $("#SubOSD3backgroundColor").val(Number(v));
        OsdEnable = Number($SubOSD3NameOsdEnable.length > 0 && $SubOSD3NameOsdEnable.is(":checked")?$SubOSD3NameOsdEnable.val() : 0);
        SpeedPercentOsdEnable = Number($SubOSD3SpeedPercentOsdEnable.length > 0 && $SubOSD3SpeedPercentOsdEnable.is(":checked")?$SubOSD3SpeedPercentOsdEnable.val() : 0);
        TGSyntOsdEnable = Number($SubOSD3TGSyntOsdEnable.length > 0 && $SubOSD3TGSyntOsdEnable.is(":checked")?$SubOSD3TGSyntOsdEnable.val() : 0);
        SyntOsdEnable = Number($SubOSD3SyntOsdEnable.length > 0 && $SubOSD3SyntOsdEnable.is(":checked")?$SubOSD3SyntOsdEnable.val() : 0);
        $("#SubOSD3OSDPrame").val(OsdEnable + SpeedPercentOsdEnable + TGSyntOsdEnable + SyntOsdEnable);
        for(i = 0; i < SubOsd3JsonMap["OSDNum"]; i++) {
            $("#" + osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).val($("#" + osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")?1 : 0);
        }
        LAPI_FormToCfg("frmSetup", SubOsd3JsonMap, OsdExpandMap, SubOsd3mappingMap);
        if(!isObjectEquals(SubOsd3JsonMap,SubOsd3JsonMap_bak)) {
            if (!LAPI_SetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=2", SubOsd3JsonMap)) return;
            SubOsd3JsonMap_bak = objectClone(SubOsd3JsonMap);
        }
    }

    if (TGSyntOSDArr.length > 0) {
        if (SyntPicOSDArr.length <= 0) {
            v = $("#SubOSD4FontColor").val();
            v = v.replace("#", "0x");
            $("#SubOSD4fontColor").val(Number(v));
        
            v = $("#SubOSD4BackgroundColor").val();
            v = v.replace("#", "0x");
            $("#SubOSD4backgroundColor").val(Number(v));
        }
        OsdEnable = Number($SubOSD4NameOsdEnable.length > 0 && $SubOSD4NameOsdEnable.is(":checked")?$SubOSD4NameOsdEnable.val() : 0);
        SpeedPercentOsdEnable = Number($SubOSD4SpeedPercentOsdEnable.length > 0 && $SubOSD4SpeedPercentOsdEnable.is(":checked")?$SubOSD4SpeedPercentOsdEnable.val() : 0);
        TGSyntOsdEnable = Number($SubOSD4TGSyntOsdEnable.length > 0 && $SubOSD4TGSyntOsdEnable.is(":checked")?$SubOSD4TGSyntOsdEnable.val() : 0);
        SyntOsdEnable = Number($SubOSD4SyntOsdEnable.length > 0 && $SubOSD4SyntOsdEnable.is(":checked")?$SubOSD4SyntOsdEnable.val() : 0);
        $("#SubOSD4OSDPrame").val(OsdEnable + SpeedPercentOsdEnable + TGSyntOsdEnable + SyntOsdEnable);
        for(i = 0; i < SubOsd4JsonMap["OSDNum"]; i++) {
            $("#" + osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).val($("#" + osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")?1 : 0);
        }
        LAPI_FormToCfg("frmSetup", SubOsd4JsonMap, OsdExpandMap, SubOsd4mappingMap);
        if(!isObjectEquals(SubOsd4JsonMap,SubOsd4JsonMap_bak)) {
            if (!LAPI_SetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=3", SubOsd4JsonMap)) return;
            SubOsd4JsonMap_bak = objectClone(SubOsd4JsonMap);
        }
    }

    if (pictrueTypecloseUpOSDArr.length > 0) {
        OsdEnable = Number($SubOSD5NameOsdEnable.length > 0 && $SubOSD5NameOsdEnable.is(":checked")?$SubOSD5NameOsdEnable.val() : 0);
        SpeedPercentOsdEnable = Number($SubOSD5SpeedPercentOsdEnable.length > 0 && $SubOSD5SpeedPercentOsdEnable.is(":checked")?$SubOSD5SpeedPercentOsdEnable.val() : 0);
        TGSyntOsdEnable = Number($SubOSD5TGSyntOsdEnable.length > 0 && $SubOSD5TGSyntOsdEnable.is(":checked")?$SubOSD5TGSyntOsdEnable.val() : 0);
        SyntOsdEnable = Number($SubOSD5SyntOsdEnable.length > 0 && $SubOSD5SyntOsdEnable.is(":checked")?$SubOSD5SyntOsdEnable.val() : 0);
        $("#SubOSD5OSDPrame").val(OsdEnable + SpeedPercentOsdEnable + TGSyntOsdEnable + SyntOsdEnable);
        for(i = 0; i < SubOsd5JsonMap["OSDNum"]; i++) {
            $("#" + osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).val($("#" + osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")?1 : 0);
        }
        LAPI_FormToCfg("frmSetup", SubOsd5JsonMap, OsdExpandMap, SubOsd5mappingMap);
        if(!isObjectEquals(SubOsd5JsonMap,SubOsd5JsonMap_bak)) {
            if (!LAPI_SetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=4", SubOsd5JsonMap)) return;
            SubOsd5JsonMap_bak = objectClone(SubOsd5JsonMap);
        }
    }
    parent.initOsdDrawObjData(tabID);
}

function bindEvent() {
    var event = getEvent(),
        oSrc = event.srcElement ? event.srcElement : event.target,
        id = oSrc.id;
    if ("PicPeccancyOsdEnable" == id) {
        disableSubItem("PicPeccancyOsdEnable", "PicVehicleSpeedPercentOsdEnable");
    }
    if ("MJPEGVehicleTimeOsdEnable" == id) {
        disableSubItem("MJPEGVehicleTimeOsdEnable", "MJPEGVehicleTimeMilisecOsdEnable");
    }
    if ("PicTimeOsdEnable" == id) {
        disableSubItem("PicTimeOsdEnable", "PicTimeMilisecOsdEnable");
    }
    if ("SyntPicPeccancyTypeEnable" == id) {
        disableSubItem("SyntPicPeccancyTypeEnable", "SyntVehicleSpeedPercentEnable");
    }
    if ("MJPEGPeccancyTypeEnable" == id) {
        disableSubItem("MJPEGPeccancyTypeEnable", "MJPEGVehicleSpeedPercentEnable");
    }
    if ("TGSyntTimeEnable" == id) {
        disableSubItem("TGSyntTimeEnable", "TGSyntVehicleTimeMilisecOsdEnable");
    }
    if ("TGSyntPeccancyTypeEnable" == id) {
        disableSubItem("TGSyntPeccancyTypeEnable", "TGSyntVehicleSpeedPercentOsdEnable");
    }
}

function toUpPicOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if(line > 0) {
        for(var i = 0; i < SubOsd1JsonMap["OSDNum"]; i++) {
            if(SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd1EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd1JsonMap["OSDNum"]; j++) {
            if(SubOsd1JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd1EnableMap[line - 1]["OSDType"])
                break;
        }
        var temp = SubOsd1JsonMap["PicOSDCFG"][i];
        SubOsd1JsonMap["PicOSDCFG"][i] = SubOsd1JsonMap["PicOSDCFG"][j];
        SubOsd1JsonMap["PicOSDCFG"][j] = temp;
    }
    initpicOsdTbl();
}

function toUpmjpegOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if(line > 0) {
        for(var i = 0; i < SubOsd2JsonMap["OSDNum"]; i++) {
            if(SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd2EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd2JsonMap["OSDNum"]; j++) {
            if(SubOsd2JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd2EnableMap[line - 1]["OSDType"])
                break;
        }
        var temp = SubOsd2JsonMap["PicOSDCFG"][i];
        SubOsd2JsonMap["PicOSDCFG"][i] = SubOsd2JsonMap["PicOSDCFG"][j];
        SubOsd2JsonMap["PicOSDCFG"][j] = temp;
    }
    initmjpegOsdTbl();
}

function toUpTGSyntOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if(line > 0) {
        for(var i = 0; i < SubOsd4JsonMap["OSDNum"]; i++) {
            if(SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd4EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd4JsonMap["OSDNum"]; j++) {
            if(SubOsd4JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd4EnableMap[line - 1]["OSDType"])
                break;
        }
        var temp = SubOsd4JsonMap["PicOSDCFG"][i];
        SubOsd4JsonMap["PicOSDCFG"][i] = SubOsd4JsonMap["PicOSDCFG"][j];
        SubOsd4JsonMap["PicOSDCFG"][j] = temp;
    }
    initTGSyntOsdTbl();
}

function toUpillegalOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if(line > 0) {
        for(var i = 0; i < SubOsd3JsonMap["OSDNum"]; i++) {
            if(SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd3EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd3JsonMap["OSDNum"]; j++) {
            if(SubOsd3JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd3EnableMap[line - 1]["OSDType"])
                break;
        }
        var temp = SubOsd3JsonMap["PicOSDCFG"][i];
        SubOsd3JsonMap["PicOSDCFG"][i] = SubOsd3JsonMap["PicOSDCFG"][j];
        SubOsd3JsonMap["PicOSDCFG"][j] = temp;
    }
    initillegalOsdTbl();
}

function toUpcloseUpOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if(line > 0) {
        for(var i = 0; i < SubOsd5JsonMap["OSDNum"]; i++) {
            if(SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd5EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd5JsonMap["OSDNum"]; j++) {
            if(SubOsd5JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd5EnableMap[line - 1]["OSDType"])
                break;
        }
        var temp = SubOsd5JsonMap["PicOSDCFG"][i];
        SubOsd5JsonMap["PicOSDCFG"][i] = SubOsd5JsonMap["PicOSDCFG"][j];
        SubOsd5JsonMap["PicOSDCFG"][j] = temp;
    }
    initcloseUpOsdTbl();
}

function toDownPicOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if (line < PicOSDcount - 1) {
        for(var i = 0; i < SubOsd1JsonMap["OSDNum"]; i++) {
            if(SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd1EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd1JsonMap["OSDNum"]; j++) {
            if(SubOsd1JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd1EnableMap[line + 1]["OSDType"])
                break;
        }
        var temp = SubOsd1JsonMap["PicOSDCFG"][i];
        SubOsd1JsonMap["PicOSDCFG"][i] = SubOsd1JsonMap["PicOSDCFG"][j];
        SubOsd1JsonMap["PicOSDCFG"][j] = temp;
    }
    initpicOsdTbl();
}

function toDownmjpegOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if (line < mjpegOSDcount - 1) {
        for(var i = 0; i < SubOsd2JsonMap["OSDNum"]; i++) {
            if(SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd2EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd2JsonMap["OSDNum"]; j++) {
            if(SubOsd2JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd2EnableMap[line + 1]["OSDType"])
                break;
        }
        var temp = SubOsd2JsonMap["PicOSDCFG"][i];
        SubOsd2JsonMap["PicOSDCFG"][i] = SubOsd2JsonMap["PicOSDCFG"][j];
        SubOsd2JsonMap["PicOSDCFG"][j] = temp;
    }
    initmjpegOsdTbl();
}

function toDownTGSyntOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if (line < TGSyntOSDcount - 1) {
        for(var i = 0; i < SubOsd4JsonMap["OSDNum"]; i++) {
            if(SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd4EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd4JsonMap["OSDNum"]; j++) {
            if(SubOsd4JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd4EnableMap[line + 1]["OSDType"])
                break;
        }
        var temp = SubOsd4JsonMap["PicOSDCFG"][i];
        SubOsd4JsonMap["PicOSDCFG"][i] = SubOsd4JsonMap["PicOSDCFG"][j];
        SubOsd4JsonMap["PicOSDCFG"][j] = temp;
    }
    initTGSyntOsdTbl();
}

function toDownillegalOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if (line < illegalOSDcount - 1) {
        for(var i = 0; i < SubOsd3JsonMap["OSDNum"]; i++) {
            if(SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd3EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd3JsonMap["OSDNum"]; j++) {
            if(SubOsd3JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd3EnableMap[line + 1]["OSDType"])
                break;
        }
        var temp = SubOsd3JsonMap["PicOSDCFG"][i];
        SubOsd3JsonMap["PicOSDCFG"][i] = SubOsd3JsonMap["PicOSDCFG"][j];
        SubOsd3JsonMap["PicOSDCFG"][j] = temp;
    }
    initillegalOsdTbl();
}

function toDowncloseUpOSDCFG(line) {
    var AreaOption;
    var line = Number(line);
    if (line < closeUpOSDcount - 1) {
        for(var i = 0; i < SubOsd5JsonMap["OSDNum"]; i++) {
            if(SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"] == SubOsd5EnableMap[line]["OSDType"])
                break;
        }
        for(var j = 0; j < SubOsd5JsonMap["OSDNum"]; j++) {
            if(SubOsd5JsonMap["PicOSDCFG"][j]["OSDType"] == SubOsd5EnableMap[line + 1]["OSDType"])
                break;
        }
        var temp = SubOsd5JsonMap["PicOSDCFG"][i];
        SubOsd5JsonMap["PicOSDCFG"][i] = SubOsd5JsonMap["PicOSDCFG"][j];
        SubOsd5JsonMap["PicOSDCFG"][j] = temp;
    }
    initcloseUpOsdTbl();
}

function delPicOSDCFG(line) {
    var line = Number(line);
    $("#" + osdType[SubOsd1EnableMap[line]["OSDType"]]["id"]).attr("checked", false);
    initpicOsdTbl();
}

function delmjpegOSDCFG(line) {
    var line = Number(line);
    $("#" + osdType[SubOsd2EnableMap[line]["OSDType"]]["id"]).attr("checked", false);
    initmjpegOsdTbl();
}

function delTGSyntOsdCFG(line) {
    var line = Number(line);
    $("#" + osdType[SubOsd4EnableMap[line]["OSDType"]]["id"]).attr("checked", false);
    initTGSyntOsdTbl();
}

function delillegalOsdCFG(line) {
    var line = Number(line);
    $("#" + osdType[SubOsd3EnableMap[line]["OSDType"]]["id"]).attr("checked", false);
    initillegalOsdTbl();
}

function delcloseUpOSDCFG(line) {
    var line = Number(line);
    $("#" + osdType[SubOsd5EnableMap[line]["OSDType"]]["id"]).attr("checked", false);
    initcloseUpOsdTbl();
}

function setText(num,i,obj) {
    if(1 == num) {
        SubOsd1JsonMap["PicOSDCFG"][i]["OSDName"] = obj.value;
    } else if(2 == num) {
        SubOsd2JsonMap["PicOSDCFG"][i]["OSDName"] = obj.value;
    } else if(3 == num) {
        SubOsd3JsonMap["PicOSDCFG"][i]["OSDName"] = obj.value;
    } else if(4 == num) {
        SubOsd4JsonMap["PicOSDCFG"][i]["OSDName"] = obj.value;
    } else if(5 == num) {
        SubOsd5JsonMap["PicOSDCFG"][i]["OSDName"] = obj.value;
    }
    CurrentArea = obj.value;
}

//校验叠加格式字符串
function validFormatStr(value) {
    var reg = /^<(\(.*\)([1-9]{1}|[1]\d{1}|20))>$/;
    return reg.test(value) || ("" == value);
}

function setformat(num,i,obj) {
    var value = obj.value;
    if(!validFormatStr(value)) {
        alert($.lang.tip["tipCharFmtErr"] + $.lang.tip["tipOSDFormatStrTip"]);
        if(1 == num) {
            obj.value = SubOsd1JsonMap["PicOSDCFG"][i]["OSDForm"];
        } else if(2 == num) {
            obj.value = SubOsd2JsonMap["PicOSDCFG"][i]["OSDForm"];
        } else if(3 == num) {
            obj.value = SubOsd3JsonMap["PicOSDCFG"][i]["OSDForm"];
        } else if(4 == num) {
            obj.value = SubOsd4JsonMap["PicOSDCFG"][i]["OSDForm"];
        } else if(5 == num) {
            obj.value = SubOsd5JsonMap["PicOSDCFG"][i]["OSDForm"];
        }
    } else {
        if(1 == num) {
            SubOsd1JsonMap["PicOSDCFG"][i]["OSDForm"] = value;
        } else if(2 == num) {
            SubOsd2JsonMap["PicOSDCFG"][i]["OSDForm"] = value;
        } else if(3 == num) {
            SubOsd3JsonMap["PicOSDCFG"][i]["OSDForm"] = value;
        } else if(4 == num) {
            SubOsd4JsonMap["PicOSDCFG"][i]["OSDForm"] = value;
        } else if(5 == num) {
            SubOsd5JsonMap["PicOSDCFG"][i]["OSDForm"] = value;
        }
    }
}

function ValidspaceStr(value) {
    var reg = /^\d{1}$/;
    return reg.test(value) || (10 == Number(value));
}
function setspace(num,i,obj) {
    var value = obj.value;
    if(!ValidspaceStr(value)) {
        alert($.lang.tip["tipspacevalue"]);
        if(1 == num) {
            obj.value = SubOsd1JsonMap["PicOSDCFG"][i]["SpaceNum"];
        } else if(2 == num) {
            obj.value = SubOsd2JsonMap["PicOSDCFG"][i]["SpaceNum"];
        } else if(3 == num) {
            obj.value = SubOsd3JsonMap["PicOSDCFG"][i]["SpaceNum"];
        } else if(4 == num) {
            obj.value = SubOsd4JsonMap["PicOSDCFG"][i]["SpaceNum"];
        } else if(5 == num) {
            obj.value = SubOsd5JsonMap["PicOSDCFG"][i]["SpaceNum"];
        }
    } else {
        if(1 == num) {
            SubOsd1JsonMap["PicOSDCFG"][i]["SpaceNum"] = Number(obj.value);
        } else if(2 == num) {
            SubOsd2JsonMap["PicOSDCFG"][i]["SpaceNum"] = Number(obj.value);
        } else if(3 == num) {
            SubOsd3JsonMap["PicOSDCFG"][i]["SpaceNum"] = Number(obj.value);
        } else if(4 == num) {
            SubOsd4JsonMap["PicOSDCFG"][i]["SpaceNum"] = Number(obj.value);
        } else if(5 == num) {
            SubOsd5JsonMap["PicOSDCFG"][i]["SpaceNum"] = Number(obj.value);
        }
    }
}

function ValidenterStr(value) {
    var reg = /^[0-3]{1}$/;
    return reg.test(value);
}
function setenter(num,i,obj) {
    var value = obj.value;
    if(!ValidenterStr(value)) {
        alert($.lang.tip["tipentervalue"]);
        if(1 == num) {
            obj.value = SubOsd1JsonMap["PicOSDCFG"][i]["NewLineNum"];
        } else if(2 == num) {
            obj.value = SubOsd2JsonMap["PicOSDCFG"][i]["NewLineNum"];
        } else if(3 == num) {
            obj.value = SubOsd3JsonMap["PicOSDCFG"][i]["NewLineNum"];
        } else if(4 == num) {
            obj.value = SubOsd4JsonMap["PicOSDCFG"][i]["NewLineNum"];
        } else if(5 == num) {
            obj.value = SubOsd5JsonMap["PicOSDCFG"][i]["NewLineNum"];
        }
    } else {
        if(1 == num) {
            SubOsd1JsonMap["PicOSDCFG"][i]["NewLineNum"] = Number(obj.value);
        } else if(2 == num) {
            SubOsd2JsonMap["PicOSDCFG"][i]["NewLineNum"] = Number(obj.value);
        } else if(3 == num) {
            SubOsd3JsonMap["PicOSDCFG"][i]["NewLineNum"] = Number(obj.value);
        } else if(4 == num) {
            SubOsd4JsonMap["PicOSDCFG"][i]["NewLineNum"] = Number(obj.value);
        } else if(5 == num) {
            SubOsd5JsonMap["PicOSDCFG"][i]["NewLineNum"] = Number(obj.value);
        }
    }
}

function setValue(num,i,obj) {
    var flag;
    CurrentArea = obj.value;
    if(1 == num) {
        SubOsd1JsonMap["PicOSDCFG"][i]["AreaIndex"] = obj.value;
        $("#PicOSDareaPos").text($.lang.pub["areaPos"] + (Number(CurrentArea) + 1));
        $("#PicOSDInfoLeft").val(SubOsd1JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"]);
        $("#PicOSDInfoTop").val(SubOsd1JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"]);
        flag = $("#PicOSDareaPosField").hasClass("hidden");
        if(flag) {
            $("#PicOSDareaPosField").removeClass("hidden");
        }
    } else if(2 == num) {
        SubOsd2JsonMap["PicOSDCFG"][i]["AreaIndex"] = obj.value;
        $("#mjpegOSDareaPos").text($.lang.pub["areaPos"] + (Number(CurrentArea) + 1));
        $("#mjpegOSDInfoLeft").val(SubOsd2JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"]);
        $("#mjpegOSDInfoTop").val(SubOsd2JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"]);
        flag = $("#mjpegOSDareaPosField").hasClass("hidden");
        if(flag) {
            $("#mjpegOSDareaPosField").removeClass("hidden");
        }
    } else if(3 == num) {
        SubOsd3JsonMap["PicOSDCFG"][i]["AreaIndex"] = obj.value;
        $("#illegalOSDareaPos").text($.lang.pub["areaPos"] + (Number(CurrentArea) + 1));
        $("#illegalOSDInfoLeft").val(SubOsd3JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"]);
        $("#illegalOSDInfoTop").val(SubOsd3JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"]);
        flag = $("#illegalOSDareaPosField").hasClass("hidden");
        if(flag) {
            $("#illegalOSDareaPosField").removeClass("hidden");
        }
    } else if(4 == num) {
        SubOsd4JsonMap["PicOSDCFG"][i]["AreaIndex"] = obj.value;
        $("#TGSyntOSDareaPos").text($.lang.pub["areaPos"] + (Number(CurrentArea) + 1));
        $("#TGSyntOSDInfoLeft").val(SubOsd4JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"]);
        $("#TGSyntOSDInfoTop").val(SubOsd4JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"]);
        $("#TGSyntOSDareaPosField").removeClass("hidden");
        if(flag) {
            $("#TGSyntOSDareaPosField").removeClass("hidden");
        }
    } else if(5 == num) {
        SubOsd5JsonMap["PicOSDCFG"][i]["AreaIndex"] = obj.value;
        $("#closeupOSDareaPos").text($.lang.pub["areaPos"] + (Number(CurrentArea) + 1));
        $("#closeupOSDInfoLeft").val(SubOsd5JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"]);
        $("#closeupOSDInfoTop").val(SubOsd5JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"]);
        flag = $("#closeupOSDareaPosField").hasClass("hidden");
        if(flag) {
            $("#closeupOSDareaPosField").removeClass("hidden");
        }
    }
    if(flag) {
        parent.setIframeHeight("subOSDInfoiframe");
    }
    initValidator();
}

function setXPos(i, obj) {
    if (1 == i) {
        SubOsd1JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"] = obj.value;
    } else if (2 == i) {
        SubOsd2JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"] = obj.value;
    } else if (3 == i) {
        SubOsd3JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"] = obj.value;
    } else if (4 == i) {
        SubOsd4JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"] = obj.value;
    } else if (5 == i) {
        SubOsd5JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["X"] = obj.value;
    }
}

function setYPos(i, obj) {
    if (1 == i) {
        SubOsd1JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"] = obj.value;
    } else if (2 == i) {
        SubOsd2JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"] = obj.value;
    } else if (3 == i) {
        SubOsd3JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"] = obj.value;
    } else if (4 == i) {
        SubOsd4JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"] = obj.value;
    } else if (5 == i) {
        SubOsd5JsonMap["OSDBaseCFG"]["OSDArea"][CurrentArea]["TopLeft"]["Y"] = obj.value;
    }
}

function initpicOsdTbl() {
    var i,
        j,
        k,
        AreaOption;
    // 清空表格
    $("#picOSDTbl").empty();
    contentHtml = "";
    for (i = 0, PicOSDcount = 0; i < SubOsd1JsonMap["OSDNum"]; i++) {
        if($("#" + osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            SubOsd1EnableMap[PicOSDcount] = SubOsd1JsonMap["PicOSDCFG"][i];
            PicOSDcount++;
        }
    }
    for (i = 0, k = 0; i < SubOsd1JsonMap["OSDNum"], k < PicOSDcount; i++) {
        if($("#" + osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            var type = $.lang.pub[osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["lang"]];
            var code = SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"];
            var value = SubOsd1JsonMap["PicOSDCFG"][i]["OSDName"];
            var format = SubOsd1JsonMap["PicOSDCFG"][i]["OSDForm"];
            var space = SubOsd1JsonMap["PicOSDCFG"][i]["SpaceNum"];
            var enter = SubOsd1JsonMap["PicOSDCFG"][i]["NewLineNum"];
            var area = SubOsd1JsonMap["PicOSDCFG"][i]["AreaIndex"];
            var AreaOption = "";
            for (j = 0; j < SubOsd1JsonMap["OSDBaseCFG"]["OSDArea"].length; j++) {
                if(area == j) {
                    AreaOption += "<option value='" + j + "' selected='selected'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                } else {
                    AreaOption += "<option value='" + j + "'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                }
            }

            contentHtml +="<tr>" 
                        + "    <td>"
                        + "        <label>" + type + "</label>" 
                        + "    </td>" 
                        + "    <td>"
                        + "        <input type='text' name='SubOSD1type_" + code + "' id='SubOSD1type_" + code + "' onchange=setText(1," + i + ",this) value='" + value + "' class='shortShortText' maxlength='20'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <input type='text' name='SubOSD1format_" + code + "' id='SubOSD1format_" + code + "' onchange=setformat(1," + i + ",this) value='" + format + "' style='width: 130px' maxlength='10'/>" 
                        + "    </td>"
                        + "    <td>" 
                        + "        <select name='SubOSD1area_" + code + "' id='SubOSD1area_" + code + "' onclick=setValue(1," + i + ",this) value='" + area + "'>" + AreaOption + "</select>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD1space_" + code + "' id='SubOSD1space_" + code + "' onchange=setspace(1," + i + ",this) value='" + space + "' style='width: 40px' maxlength='2'/>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD1enter_" + code + "' id='SubOSD1enter_" + code + "' onchange=setenter(1," + i + ",this) value='" + enter + "' style='width: 40px' maxlength='1'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <button id='moveUp' onClick=toUpPicOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveUp'></div>"
                        + "        </button>"
                        + "        <button id='moveDown' onClick=toDownPicOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveDown'></div>"
                        + "        </button>"
                        + "        <a class='icon black-del' onclick=delPicOSDCFG('" + k + "')></a>"
                        + "    </td>"
                        + "</tr>";
            k++;
        }
    }
    $("#picOSDTbl").append(contentHtml);
    initValidator();
}

function initTGSyntOsdTbl() {
    var i,
        j,
        k,
        AreaOption;
    // 清空表格
    $("#TGSyntOSDTbl").empty();
    contentHtml = "";
    for (i = 0, TGSyntOSDcount = 0; i < SubOsd4JsonMap["OSDNum"]; i++) {
        if($("#" + osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            SubOsd4EnableMap[TGSyntOSDcount] = SubOsd4JsonMap["PicOSDCFG"][i];
            TGSyntOSDcount++;
        }
    }
    for (i = 0, k = 0; i < SubOsd4JsonMap["OSDNum"], k < TGSyntOSDcount; i++) {
        if($("#" + osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            var type = $.lang.pub[osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["lang"]];
            var code = SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"];
            var value = SubOsd4JsonMap["PicOSDCFG"][i]["OSDName"];
            var format = SubOsd4JsonMap["PicOSDCFG"][i]["OSDForm"];
            var space = SubOsd4JsonMap["PicOSDCFG"][i]["SpaceNum"];
            var enter = SubOsd4JsonMap["PicOSDCFG"][i]["NewLineNum"];
            var area = SubOsd4JsonMap["PicOSDCFG"][i]["AreaIndex"];
            var AreaOption = "";
            for (j = 0; j < SubOsd4JsonMap["OSDBaseCFG"]["OSDArea"].length; j++) {
                if(area == j) {
                    AreaOption += "<option value='" + j + "' selected='selected'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                } else {
                    AreaOption += "<option value='" + j + "'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                }
            }

            contentHtml +="<tr>" 
                        + "    <td>"
                        + "        <label>" + type + "</label>" 
                        + "    </td>" 
                        + "    <td>"
                        + "        <input type='text' name='SubOSD4type_" + code + "' id='SubOSD4type_" + code + "' onchange=setText(4," + i + ",this) value='" + value + "' class='shortShortText' maxlength='20'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <input type='text' name='SubOSD4format_" + code + "' id='SubOSD4format_" + code + "' onchange=setformat(4," + i + ",this) value='" + format + "' style='width: 130px' maxlength='15'/>" 
                        + "    </td>"
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD4space_" + code + "' id='SubOSD4space_" + code + "' onchange=setspace(4," + i + ",this) value='" + space + "' style='width: 40px' maxlength='2'/>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD4enter_" + code + "' id='SubOSD4enter_" + code + "' onchange=setenter(4," + i + ",this) value='" + enter + "' style='width: 40px' maxlength='1'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <button id='moveUp' onClick=toUpTGSyntOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveUp'></div>"
                        + "        </button>"
                        + "        <button id='moveDown' onClick=toDownTGSyntOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveDown'></div>"
                        + "        </button>"
                        + "        <a class='icon black-del' onclick=delTGSyntOsdCFG('" + k + "')></a>"
                        + "    </td>"
                        + "</tr>";
            k++;
        }
    }
    $("#TGSyntOSDTbl").append(contentHtml);
    initValidator();
}

function initmjpegOsdTbl() {
    var i,
        j,
        k,
        AreaOption;
    // 清空表格
    $("#mjpegOSDTbl").empty();
    contentHtml = "";
    for (i = 0, mjpegOSDcount = 0; i < SubOsd2JsonMap["OSDNum"]; i++) {
        if($("#" + osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            SubOsd2EnableMap[mjpegOSDcount] = SubOsd2JsonMap["PicOSDCFG"][i];
            mjpegOSDcount++;
        }
    }
    for (i = 0, k = 0; i < SubOsd2JsonMap["OSDNum"], k < mjpegOSDcount; i++) {
        if($("#" + osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            var type = $.lang.pub[osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["lang"]];
            var code = SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"];
            var value = SubOsd2JsonMap["PicOSDCFG"][i]["OSDName"];
            var format = SubOsd2JsonMap["PicOSDCFG"][i]["OSDForm"];
            var space = SubOsd2JsonMap["PicOSDCFG"][i]["SpaceNum"];
            var enter = SubOsd2JsonMap["PicOSDCFG"][i]["NewLineNum"];
            var area = SubOsd2JsonMap["PicOSDCFG"][i]["AreaIndex"];
            var AreaOption = "";
            for (j = 0; j < SubOsd2JsonMap["OSDBaseCFG"]["OSDArea"].length; j++) {
                if(area == j) {
                    AreaOption += "<option value='" + j + "' selected='selected'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                } else {
                    AreaOption += "<option value='" + j + "'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                }
            }

            contentHtml +="<tr>" 
                        + "    <td>"
                        + "        <label>" + type + "</label>" 
                        + "    </td>" 
                        + "    <td>"
                        + "        <input type='text' name='SubOSD2type_" + code + "' id='SubOSD2type_" + code + "' onchange=setText(2," + i + ",this) value='" + value + "' class='shortShortText' maxlength='20'/>"
                        + "    </td>"
                        + "    <td>"
                        + "        <input type='text' name='SubOSD2format_" + code + "' id='SubOSD2format_" + code + "' onchange=setformat(2," + i + ",this) value='" + format + "' style='width: 130px' maxlength='15'/>" 
                        + "    </td>"
                        + "    <td>" 
                        + "        <select name='SubOSD2area_" + code + "' id='SubOSD2area_" + code + "' onclick=setValue(2," + i + ",this) value='" + area + "'>" + AreaOption + "</select>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD2space_" + code + "' id='SubOSD2space_" + code + "' onchange=setspace(2," + i + ",this) value='" + space + "' style='width: 40px' maxlength='2'/>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD2enter_" + code + "' id='SubOSD2enter_" + code + "' onchange=setenter(2," + i + ",this) value='" + enter + "' style='width: 40px' maxlength='1'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <button id='moveUp' onClick=toUpmjpegOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveUp'></div>"
                        + "        </button>"
                        + "        <button id='moveDown' onClick=toDownmjpegOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveDown'></div>"
                        + "        </button>"
                        + "        <a class='icon black-del' onclick=delmjpegOSDCFG('" + k + "')></a>"
                        + "    </td>"
                        + "</tr>";
            k++;
        }
    }
    $("#mjpegOSDTbl").append(contentHtml);
    initValidator();
}

function initillegalOsdTbl() {
    var i,
        j,
        k,
        AreaOption;
    // 清空表格
    $("#illegalOSDTbl").empty();
    contentHtml = "";
    for (i = 0, illegalOSDcount = 0; i < SubOsd3JsonMap["OSDNum"]; i++) {
        if($("#" + osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            SubOsd3EnableMap[illegalOSDcount] = SubOsd3JsonMap["PicOSDCFG"][i];
            illegalOSDcount++;
        }
    }
    for (i = 0, k = 0; i < SubOsd3JsonMap["OSDNum"], k < illegalOSDcount; i++) {
        if($("#" + osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            var type = $.lang.pub[osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["lang"]];
            var code = SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"];
            var value = SubOsd3JsonMap["PicOSDCFG"][i]["OSDName"];
            var format = SubOsd3JsonMap["PicOSDCFG"][i]["OSDForm"];
            var space = SubOsd3JsonMap["PicOSDCFG"][i]["SpaceNum"];
            var enter = SubOsd3JsonMap["PicOSDCFG"][i]["NewLineNum"];
            var area = SubOsd3JsonMap["PicOSDCFG"][i]["AreaIndex"];
            var AreaOption = "";
            for (j = 0; j < SubOsd3JsonMap["OSDBaseCFG"]["OSDArea"].length; j++) {
                if(area == j) {
                    AreaOption += "<option value='" + j + "' selected='selected'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                } else {
                    AreaOption += "<option value='" + j + "'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                }
            }

            contentHtml +="<tr>" 
                        + "    <td>"
                        + "        <label>" + type + "</label>" 
                        + "    </td>" 
                        + "    <td>"
                        + "        <input type='text' name='SubOSD3type_" + code + "' id='SubOSD3type_" + code + "' onchange=setText(3," + i + ",this) value='" + value + "' class='shortShortText' maxlength='20'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <input type='text' name='SubOSD3format_" + code + "' id='SubOSD3format_" + code + "' onchange=setformat(3," + i + ",this) value='" + format + "' style='width: 130px' maxlength='15'/>" 
                        + "    </td>"
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD3space_" + code + "' id='SubOSD3space_" + code + "' onchange=setspace(3," + i + ",this) value='" + space + "' style='width: 40px' maxlength='2'/>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD3enter_" + code + "' id='SubOSD3enter_" + code + "' onchange=setenter(3," + i + ",this) value='" + enter + "' style='width: 40px' maxlength='1'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <button id='moveUp' onClick=toUpillegalOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveUp'></div>"
                        + "        </button>"
                        + "        <button id='moveDown' onClick=toDownillegalOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveDown'></div>"
                        + "        </button>"
                        + "        <a class='icon black-del' onclick=delillegalOsdCFG('" + k + "')></a>"
                        + "    </td>"
                        + "</tr>";
            k++;
        }
    }
    $("#illegalOSDTbl").append(contentHtml);
    initValidator();
}

function initcloseUpOsdTbl() {
    var i,
        j,
        k,
        AreaOption;
    // 清空表格
    $("#closeupOSDTbl").empty();
    contentHtml = "";
    for (i = 0, closeUpOSDcount = 0; i < SubOsd5JsonMap["OSDNum"]; i++) {
        if($("#" + osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            SubOsd5EnableMap[closeUpOSDcount] = SubOsd5JsonMap["PicOSDCFG"][i];
            closeUpOSDcount++;
        }
    }
    for (i = 0, k = 0; i < SubOsd5JsonMap["OSDNum"], k < closeUpOSDcount; i++) {
        if($("#" + osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]).is(":checked")) {
            var type = $.lang.pub[osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["lang"]];
            var code = SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"];
            var value = SubOsd5JsonMap["PicOSDCFG"][i]["OSDName"];
            var format = SubOsd5JsonMap["PicOSDCFG"][i]["OSDForm"];
            var space = SubOsd5JsonMap["PicOSDCFG"][i]["SpaceNum"];
            var enter = SubOsd5JsonMap["PicOSDCFG"][i]["NewLineNum"];
            var area = SubOsd5JsonMap["PicOSDCFG"][i]["AreaIndex"];
            var AreaOption = "";
            for (j = 0; j < SubOsd5JsonMap["OSDBaseCFG"]["OSDArea"].length; j++) {
                if(area == j) {
                    AreaOption += "<option value='" + j + "' selected='selected'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                } else {
                    AreaOption += "<option value='" + j + "'>" + $.lang.pub["area"] + (j + 1) + "</option>";
                }
            }

            contentHtml +="<tr>" 
                        + "    <td>"
                        + "        <label>" + type + "</label>" 
                        + "    </td>" 
                        + "    <td>"
                        + "        <input type='text' name='SubOSD5type_" + code + "' id='SubOSD5type_" + code + "' onchange=setText(5," + i + ",this) value='" + value + "' class='shortShortText' maxlength='20'/>" 
                        + "    </td>"
                        + "    <td>"
                        + "        <input type='text' name='SubOSD5format_" + code + "' id='SubOSD5format_" + code + "' onchange=setformat(5," + i + ",this) value='" + format + "' style='width: 130px' maxlength='15'/>" 
                        + "    </td>"
                        + "    <td>" 
                        + "        <select name='SubOSD5area_" + code + "' id='SubOSD5area_" + code + "' onclick=setValue(5," + i + ",this) value='" + area + "'>" + AreaOption + "</select>" 
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD5space_" + code + "' id='SubOSD5space_" + code + "' onchange=setspace(5," + i + ",this) value='" + space + "' style='width: 40px' maxlength='2'/>"
                        + "    </td>" 
                        + "    <td align='center'>"
                        + "        <input type='text' name='SubOSD5enter_" + code + "' id='SubOSD5enter_" + code + "' onchange=setenter(5," + i + ",this) value='" + enter + "' style='width: 40px' maxlength='1'/>"
                        + "    </td>"
                        + "    <td>"
                        + "        <button id='moveUp' onClick=toUpcloseUpOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveUp'></div>"
                        + "        </button>"
                        + "        <button id='moveDown' onClick=toDowncloseUpOSDCFG('" + k + "')>"
                        + "            <div class='moveBtn moveDown'></div>"
                        + "        </button>"
                        + "        <a class='icon black-del' onclick=delcloseUpOSDCFG('" + k + "')></a>"
                        + "    </td>"
                        + "</tr>";
            k++;
        }
    }
    $("#closeupOSDTbl").append(contentHtml);
    initValidator();
}

function initPage() {
    var index = 0,
        lang = "",
        value = "",
        id = "",
        name = "",
        str = "";
    for (index = 0; index < vehicleRecordGlobalOSDArr.length; index++) {
        lang = GlobalOSDArr[vehicleRecordGlobalOSDArr[index]]["data-lang"];
        value = GlobalOSDArr[vehicleRecordGlobalOSDArr[index]]["value"];
        if (1 == value) {
            id = "SubOSD1NameOsdEnable";
        } else if (2 == value) {
            id = "SubOSD1SpeedPercentOsdEnable";
        } else if (4 == value) {
            id = "SubOSD1TGSyntOsdEnable";
        } else if (8 == value) {
            id = "SubOSD1SyntOsdEnable";
        }
        str += "<span class='ColorSpan'>" + 
                  "<input type='checkbox' id='" + id + "' value='" + value + "'/>" +
                  "<label for='" + name + "' data-lang='" + lang + "'></label>" +
               "</span>";
    }
    $("#GlobalOSDDiv1").append(str);

    str = "";
    for (index = 0; index < peccancyRecordGlobalOSDArr.length; index++) {
        lang = GlobalOSDArr[peccancyRecordGlobalOSDArr[index]]["data-lang"];
        value = GlobalOSDArr[peccancyRecordGlobalOSDArr[index]]["value"];
        if (1 == value) {
            id = "SubOSD2NameOsdEnable";
        } else if (2 == value) {
            id = "SubOSD2SpeedPercentOsdEnable";
        } else if (4 == value) {
            id = "SubOSD2TGSyntOsdEnable";
        } else if (8 == value) {
            id = "SubOSD2SyntOsdEnable";
        }
        str += "<span class='ColorSpan'>" + 
                  "<input type='checkbox' id='" + id + "' value='" + value + "'/>" +
                  "<label for='" + name + "' data-lang='" + lang + "'></label>" +
               "</span>";
    }
    $("#GlobalOSDDiv2").append(str);

    str = "";
    for (index = 0; index < peccancySyntPicGlobalOSDArr.length; index++) {
        lang = GlobalOSDArr[peccancySyntPicGlobalOSDArr[index]]["data-lang"];
        value = GlobalOSDArr[peccancySyntPicGlobalOSDArr[index]]["value"];
        if (1 == value) {
            id = "SubOSD3NameOsdEnable";
        } else if (2 == value) {
            id = "SubOSD3SpeedPercentOsdEnable";
        } else if (4 == value) {
            id = "SubOSD3TGSyntOsdEnable";
        } else if (8 == value) {
            id = "SubOSD3SyntOsdEnable";
        }
        str += "<span class='ColorSpan'>" + 
                  "<input type='checkbox' id='" + id + "' value='" + value + "'/>" +
                  "<label for='" + name + "' data-lang='" + lang + "'></label>" +
               "</span>";
    }
    $("#GlobalOSDDiv3").append(str);

    str = "";
    for (index = 0; index < TGSyntPicGlobalOSDArr.length; index++) {
        lang = GlobalOSDArr[TGSyntPicGlobalOSDArr[index]]["data-lang"];
        value = GlobalOSDArr[TGSyntPicGlobalOSDArr[index]]["value"];
        if (1 == value) {
            id = "SubOSD4NameOsdEnable";
        } else if (2 == value) {
            id = "SubOSD4SpeedPercentOsdEnable";
        } else if (4 == value) {
            id = "SubOSD4TGSyntOsdEnable";
        } else if (8 == value) {
            id = "SubOSD4SyntOsdEnable";
        }
        str += "<span class='ColorSpan'>" + 
                  "<input type='checkbox' id='" + id + "' value='" + value + "'/>" +
                  "<label for='" + name + "' data-lang='" + lang + "'></label>" +
               "</span>";
    }
    $("#GlobalOSDDiv4").append(str);

    str = "";
    for (index = 0; index < closeUpGlobalOSDArr.length; index++) {
        lang = GlobalOSDArr[closeUpGlobalOSDArr[index]]["data-lang"];
        value = GlobalOSDArr[closeUpGlobalOSDArr[index]]["value"];
        if (1 == value) {
            id = "SubOSD5NameOsdEnable";
        } else if (2 == value) {
            id = "SubOSD5SpeedPercentOsdEnable";
        } else if (4 == value) {
            id = "SubOSD5TGSyntOsdEnable";
        } else if (8 == value) {
            id = "SubOSD5SyntOsdEnable";
        }
        str += "<span class='ColorSpan'>" + 
                  "<input type='checkbox' id='" + id + "' value='" + value + "'/>" +
                  "<label for='" + name + "' data-lang='" + lang + "'></label>" +
               "</span>";
    }
    $("#GlobalOSDDiv5").append(str);

    if (peccancyOSDArr.length > 0) {
        $("#SubOSD2Color").removeClass("hidden");
    } else if (vehicleOSDArr.length > 0) {
        $("#SubOSD1Color").removeClass("hidden");
    }
    if (SyntPicOSDArr.length > 0) {
        $("#SubOSD3Color").removeClass("hidden");
    } else if (TGSyntOSDArr.length > 0) {
        $("#SubOSD4Color").removeClass("hidden");
    }
    if (1 == pageType) {
        $(".tab_bar").removeClass();
        $(".tab_content").removeClass();
        $("#illegalOsdDiv").removeClass("hidden");

    } else {
        if (vehicleOSDArr.length > 0) {//支持JPEGosd
            $("button[data-divID='picOsdDiv']").removeClass("hidden");
        }
        if (peccancyOSDArr.length > 0) {
            $("button[data-divID='mjpegOsdDiv']").removeClass("hidden");
        }
        if (SyntPicOSDArr.length > 0) {
            $("button[data-divID='illegalOsdDiv']").removeClass("hidden");
        }
        if (TGSyntOSDArr.length > 0) {
            $("button[data-divID='TGSyntOsdDiv']").removeClass("hidden");
        }
        if (pictrueTypecloseUpOSDArr.length > 0) {
            $("button[data-divID='pictrueTypecloseUpDiv']").removeClass("hidden");
        }
        //非违停球除特写图外均支持超速百分比
        if(IVAMode.ILLEGAL != top.banner.IVAType) {
            for(var i = 1; i < 5; i++) {
                $("#SubOSD" + i +"SpeedPercentOsdSpan").removeClass("hidden");
            }
        }
    }
    initOSDFieldset();
}

function initEvent() {
    $("input[name='vehicleOSDLI']").bind("click", bindEvent);
    $("input[name='peccancyOSDLI']").bind("click", bindEvent);
    $("input[name='SyntPicOSDLI']").bind("click", bindEvent);
    $("input[name='TGSyntOSDLI']").bind("click", bindEvent);
    $("input[name='closeUpOSDLI']").bind("click", bindEvent);
    $("input[name='SubOSD1OSDMode']").change(function() {setAddMode(1)});
    $("input[name='SubOSD2OSDMode']").change(function() {setAddMode(2)});
    $("button.sectionTab").bind("click", tab_click);
    $("#PicOSDInfoLeft").change(function() {setXPos(1, this)});
    $("#PicOSDInfoTop").change(function() {setYPos(1, this)});
    $("#TGSyntOSDInfoLeft").change(function() {setXPos(4, this)});
    $("#TGSyntOSDInfoTop").change(function() {setYPos(4, this)});
    $("#mjpegOSDInfoLeft").change(function() {setXPos(2, this)});
    $("#mjpegOSDInfoTop").change(function() {setYPos(2, this)});
    $("#illegalOSDInfoLeft").change(function() {setXPos(3, this)});
    $("#illegalOSDInfoTop").change(function() {setYPos(3, this)});
    $("#closeupOSDInfoLeft").change(function() {setXPos(5, this)});
    $("#closeupOSDInfoTop").change(function() {setYPos(5, this)});
}

function initValidator() {
    var i, j;
    $("#PicOSDInfoLeft").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 99));
    $("#PicOSDInfoTop").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 99));
    $("#mjpegOSDInfoLeft").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 99));
    $("#mjpegOSDInfoTop").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 99));
    $("#closeupOSDInfoLeft").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 99));
    $("#closeupOSDInfoTop").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 99));
    for (i = 1; i < 6; i++) {
        $("#SubOSD" + i + "CharacterGap").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));
    }
    
    for(j in vehicleOSDArr) {
        $("#SubOSD1format_" + vehicleOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipOSDFormatStrTip"]));
        $("#SubOSD1space_" + vehicleOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));
        $("#SubOSD1enter_" + vehicleOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 3));
    }
    for(j in peccancyOSDArr) {
        $("#SubOSD2format_" + peccancyOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipOSDFormatStrTip"]));
        $("#SubOSD2space_" + peccancyOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));
        $("#SubOSD2enter_" + peccancyOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 3));
    }
    for(j in SyntPicOSDArr) {
        $("#SubOSD3format_" + SyntPicOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipOSDFormatStrTip"]));
        $("#SubOSD3space_" + SyntPicOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));
        $("#SubOSD3enter_" + SyntPicOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 3));
    }
    for(j in TGSyntOSDArr) {
        $("#SubOSD4format_" + TGSyntOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipOSDFormatStrTip"]));
        $("#SubOSD4space_" + TGSyntOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));
        $("#SubOSD4enter_" + TGSyntOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 3));
    }
    for(j in pictrueTypecloseUpOSDArr) {
        $("#SubOSD5format_" + pictrueTypecloseUpOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipOSDFormatStrTip"]));
        $("#SubOSD5space_" + pictrueTypecloseUpOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 10));
        $("#SubOSD5enter_" + pictrueTypecloseUpOSDArr[j]).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 3));
    }

    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "");
        },
        success : function(label) {
        },
        rules : {
                SubOSD1CharacterGap : {
                integer : true,
                required : true,
                range : [ 0, 10 ]
            },
            SubOSD2CharacterGap : {
                integer : true,
                required : true,
                range : [ 0, 10 ]
            },
            SubOSD3CharacterGap : {
                integer : true,
                required : true,
                range : [ 0, 10 ]
            },
            SubOSD4CharacterGap : {
                integer : true,
                required : true,
                range : [ 0, 10 ]
            },
            SubOSD5CharacterGap : {
                integer : true,
                required : true,
                range : [ 0, 10 ]
            },
            PicOSDInfoLeft : {
                integer : true,
                required : true,
                range : [ 0, 99 ]
            },
            PicOSDInfoTop : {
                integer : true,
                required : true,
                range : [ 0, 99 ]
            },
            mjpegOSDInfoLeft : {
                integer : true,
                required : true,
                range : [ 0, 99 ]
            },
            mjpegOSDInfoTop : {
                integer : true,
                required : true,
                range : [ 0, 99 ]
            },
            closeupOSDInfoLeft : {
                integer : true,
                required : true,
                range : [ 0, 99 ]
            },
            closeupOSDInfoTop : {
                integer : true,
                required : true,
                range : [ 0, 99 ]
            }
        }
    });
    validator.init();
}
function setAddMode(i)
{
    parent.initOsdDrawObjData(i);
}

function fullSubOsd1mappingMap() {
    for(var i = 0; i < SubOsd1JsonMap["OSDNum"]; i++) {
        SubOsd1mappingMap[osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = ["PicOSDCFG", i, "Enable"];
    }
}

function fullSubOsd2mappingMap() {
    for(var i = 0; i < SubOsd2JsonMap["OSDNum"]; i++) {
        SubOsd2mappingMap[osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = ["PicOSDCFG", i, "Enable"];
    }
}

function fullSubOsd3mappingMap() {
    for(var i = 0; i < SubOsd3JsonMap["OSDNum"]; i++) {
        SubOsd3mappingMap[osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = ["PicOSDCFG", i, "Enable"];
    }
}

function fullSubOsd4mappingMap() {
    for(var i = 0; i < SubOsd4JsonMap["OSDNum"]; i++) {
        SubOsd4mappingMap[osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = ["PicOSDCFG", i, "Enable"];
    }
}

function fullSubOsd5mappingMap() {
    for(var i = 0; i < SubOsd5JsonMap["OSDNum"]; i++) {
        SubOsd5mappingMap[osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = ["PicOSDCFG", i, "Enable"];
    }
}

function initData() {
    var flag = false;
    //获取osd信息
    if(((vehicleOSDArr.length > 0) && !LAPI_GetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=0", SubOsd1JsonMap)) ||
       ((peccancyOSDArr.length > 0) && !LAPI_GetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=1", SubOsd2JsonMap)) ||
       ((SyntPicOSDArr.length > 0) && !LAPI_GetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=2", SubOsd3JsonMap)) || 
       ((TGSyntOSDArr.length > 0) && !LAPI_GetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=3", SubOsd4JsonMap)) ||
       ((pictrueTypecloseUpOSDArr.length > 0) && !LAPI_GetCfgData(LAPI_URL.IVA_EVIDENCE_OSD_CFG + "?BaseCfgType=4", SubOsd5JsonMap))) {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }

    if(vehicleOSDArr.length > 0) {
        SubOsd1JsonMap_bak = objectClone(SubOsd1JsonMap);
        var fontcolor = Number(SubOsd1JsonMap["OSDBaseCFG"]["OSDStyle"]["Color"]).toString(16);
        for (var i = fontcolor.length; i < 6; i++) {
            fontcolor = "0" + fontcolor;
        }
        OsdExpandMap["SubOSD1FontColor"] = "#" + fontcolor;
        $("#SubOSD1FontColor").css("background", OsdExpandMap["SubOSD1FontColor"]);

        var backgroundcolor = Number(SubOsd1JsonMap["OSDBaseCFG"]["BackColor"]).toString(16);
        for (i = backgroundcolor.length; i < 6; i++) {
            backgroundcolor = "0" + backgroundcolor;
        }
        OsdExpandMap["SubOSD1BackgroundColor"] = "#" + backgroundcolor;
        $("#SubOSD1BackgroundColor").css("background", OsdExpandMap["SubOSD1BackgroundColor"]);

        var value = Number(SubOsd1JsonMap["OSDBaseCFG"]["OSDPrame"]);
        OsdExpandMap["SubOSD1NameOsdEnable"] = value & 1;
        OsdExpandMap["SubOSD1SpeedPercentOsdEnable"] = value & 2;

        fullSubOsd1mappingMap();
        for(i = 0; i < SubOsd1JsonMap["OSDNum"]; i++) {
            OsdExpandMap[osdType[SubOsd1JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = SubOsd1JsonMap["PicOSDCFG"][i]["Enable"];
        }
        LAPI_CfgToForm("frmSetup", SubOsd1JsonMap, OsdExpandMap, SubOsd1mappingMap);
        initpicOsdTbl();
    }

    if(peccancyOSDArr.length > 0) {
        SubOsd2JsonMap_bak = objectClone(SubOsd2JsonMap);
        fontcolor = Number(SubOsd2JsonMap["OSDBaseCFG"]["OSDStyle"]["Color"]).toString(16);
        for (i = fontcolor.length; i < 6; i++) {
            fontcolor = "0" + fontcolor;
        }
        OsdExpandMap["SubOSD2FontColor"] = "#" + fontcolor;
        $("#SubOSD2FontColor").css("background", OsdExpandMap["SubOSD2FontColor"]);

        backgroundcolor = Number(SubOsd2JsonMap["OSDBaseCFG"]["BackColor"]).toString(16);
        for (i = backgroundcolor.length; i < 6; i++) {
            backgroundcolor = "0" + backgroundcolor;
        }
        OsdExpandMap["SubOSD2BackgroundColor"] = "#" + backgroundcolor;
        $("#SubOSD2BackgroundColor").css("background", OsdExpandMap["SubOSD2BackgroundColor"]);

        value = Number(SubOsd2JsonMap["OSDBaseCFG"]["OSDPrame"]);
        OsdExpandMap["SubOSD2NameOsdEnable"] = value & 1;
        OsdExpandMap["SubOSD2SpeedPercentOsdEnable"] = value & 2;

        fullSubOsd2mappingMap();
        for(i = 0; i < SubOsd2JsonMap["OSDNum"]; i++) {
            OsdExpandMap[osdType[SubOsd2JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = SubOsd2JsonMap["PicOSDCFG"][i]["Enable"];
        }
        LAPI_CfgToForm("frmSetup", SubOsd2JsonMap, OsdExpandMap, SubOsd2mappingMap);
        initmjpegOsdTbl();
    }

    if(SyntPicOSDArr.length > 0) {
        SubOsd3JsonMap_bak = objectClone(SubOsd3JsonMap);
        fontcolor = Number(SubOsd3JsonMap["OSDBaseCFG"]["OSDStyle"]["Color"]).toString(16);
        for (i = fontcolor.length; i < 6; i++) {
            fontcolor = "0" + fontcolor;
        }
        OsdExpandMap["SubOSD3FontColor"] = "#" + fontcolor;
        $("#SubOSD3FontColor").css("background", OsdExpandMap["SubOSD3FontColor"]);

        backgroundcolor = Number(SubOsd3JsonMap["OSDBaseCFG"]["BackColor"]).toString(16);
        for (i = backgroundcolor.length; i < 6; i++) {
            backgroundcolor = "0" + backgroundcolor;
        }
        OsdExpandMap["SubOSD3BackgroundColor"] = "#" + backgroundcolor;
        $("#SubOSD3BackgroundColor").css("background", OsdExpandMap["SubOSD3BackgroundColor"]);

        value = Number(SubOsd3JsonMap["OSDBaseCFG"]["OSDPrame"]);
        OsdExpandMap["SubOSD3NameOsdEnable"] = value & 1;
        OsdExpandMap["SubOSD3SpeedPercentOsdEnable"] = value & 2;

        fullSubOsd3mappingMap();
        for(i = 0; i < SubOsd3JsonMap["OSDNum"]; i++) {
            OsdExpandMap[osdType[SubOsd3JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = SubOsd3JsonMap["PicOSDCFG"][i]["Enable"];
        }
        LAPI_CfgToForm("frmSetup", SubOsd3JsonMap, OsdExpandMap, SubOsd3mappingMap);
        initillegalOsdTbl();
    }

    if(TGSyntOSDArr.length > 0) {
        SubOsd4JsonMap_bak = objectClone(SubOsd4JsonMap);
        fontcolor = Number(SubOsd4JsonMap["OSDBaseCFG"]["OSDStyle"]["Color"]).toString(16);
        for (i = fontcolor.length; i < 6; i++) {
            fontcolor = "0" + fontcolor;
        }
        OsdExpandMap["SubOSD4FontColor"] = "#" + fontcolor;
        $("#SubOSD4FontColor").css("background", OsdExpandMap["SubOSD4FontColor"]);

        backgroundcolor = Number(SubOsd4JsonMap["OSDBaseCFG"]["BackColor"]).toString(16);
        for (i = backgroundcolor.length; i < 6; i++) {
            backgroundcolor = "0" + backgroundcolor;
        }
        OsdExpandMap["SubOSD4BackgroundColor"] = "#" + backgroundcolor;
        $("#SubOSD4BackgroundColor").css("background", OsdExpandMap["SubOSD4BackgroundColor"]);

        value = Number(SubOsd4JsonMap["OSDBaseCFG"]["OSDPrame"]);
        OsdExpandMap["SubOSD4NameOsdEnable"] = value & 1;
        OsdExpandMap["SubOSD4SpeedPercentOsdEnable"] = value & 2;

        fullSubOsd4mappingMap();
        for(i = 0; i < SubOsd4JsonMap["OSDNum"]; i++) {
            OsdExpandMap[osdType[SubOsd4JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = SubOsd4JsonMap["PicOSDCFG"][i]["Enable"];
        }
        LAPI_CfgToForm("frmSetup", SubOsd4JsonMap, OsdExpandMap, SubOsd4mappingMap);
        initTGSyntOsdTbl();
    }

    if(pictrueTypecloseUpOSDArr.length > 0) {
        SubOsd5JsonMap_bak = objectClone(SubOsd5JsonMap);
        value = Number(SubOsd5JsonMap["OSDBaseCFG"]["OSDPrame"]);
        OsdExpandMap["SubOSD5NameOsdEnable"] = value & 1;
        OsdExpandMap["SubOSD5TGSyntOsdEnable"] = value & 4;
        OsdExpandMap["SubOSD5SyntOsdEnable"] = value & 8;

        fullSubOsd5mappingMap();
        for(i = 0; i < SubOsd5JsonMap["OSDNum"]; i++) {
            OsdExpandMap[osdType[SubOsd5JsonMap["PicOSDCFG"][i]["OSDType"]]["id"]] = SubOsd5JsonMap["PicOSDCFG"][i]["Enable"];
        }
        LAPI_CfgToForm("frmSetup", SubOsd5JsonMap, OsdExpandMap, SubOsd5mappingMap);
        initcloseUpOsdTbl();
    }
    if(vehicleOSDArr.length > 0 || peccancyOSDArr.length > 0 || SyntPicOSDArr.length > 0 || TGSyntOSDArr.length > 0 || pictrueTypecloseUpOSDArr.length > 0) {
        if (top.banner.isOldPlugin && !top.banner.isMac) {
            parent.initOsdDrawObjData(0);
        }
        $("button.sectionTab").filter(function () {
            return $(this).is(":visible");
        }).get(0).click();
    }
    parent.initVideoSize();
}

$(document).ready(function() {
    beforeDataLoad();//公共方法，对按钮、页面风格做处理
    initPage();
    initLang();//公共方法，加载语言
    initEvent();//为界面元素绑定时间处理函数
    initData();//页面参数初始化
    initValidator();//jquery验证方法初始化
    afterDataLoad();//公共方法
});