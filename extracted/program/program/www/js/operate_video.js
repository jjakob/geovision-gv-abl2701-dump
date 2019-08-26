GlobalInvoke(window);
var pageType = getparastr("pageType");
var channelId = 0;
var subChannelId = 0;
var faceSmallPicArr = top.banner.FaceSmallPicArr;
var dataMap = {};
var jsonMap = {};

var jsonMap_bak = {};
var mappingMap = {
    "StreamID": ["StreamID"],
    "IsEnable": ["VideoStreamCfg", "IsEnable"],
    "EncodeFmt": ["VideoStreamCfg", "EncodeFmt"],
    "BitRate": ["VideoStreamCfg", "BitRate"],
    "FrameRate": ["VideoStreamCfg", "FrameRate"],
    "GopType": ["VideoStreamCfg", "GopType"],
    "IInterval": ["VideoStreamCfg", "IInterval"],
    "Quality": ["VideoStreamCfg", "Quality"],
    "EncMode": ["VideoStreamCfg", "EncMode"],
    "SmoothValue": ["VideoStreamCfg", "SmoothValue"],
    "Width": ["VideoStreamCfg", "Resolution", "Width"],
    "Hight": ["VideoStreamCfg", "Resolution", "Height"],
    "SvcMode":["VideoStreamCfg","VideoSvcCfg","Mode"],
    "UCodeMode":["VideoStreamCfg","UCodeCfg","Mode"]
};
// 加载语言文件
loadlanguageFile(top.language);
var IsDebugger = false;                         // 是否处于调试状态
var bSpecifiedByInput = false;                  // 是否通过文本框来调节参数
var picFmtTypeVal = null;
var streamNum = top.banner.maxStreamNum;
var frameRateArr = ["1", "3", "5", "6", "8", "10", "12", "15", "20", "25", "30", "50", "60"];
var GopType = ["IP", "IBP", "IBBP", "I"];
var GopTypeArr = [];
var isFreshAuxPicSize = false;
var isFreshThirdPicSize = false;
var MinBitRate = 128;
var MaxBitRate = 16384;
var vinModeInfoMap = {};         // 制式数据
var jsonMap_VinModeInfo = {};    //json制式数据
var mappingMap_VinModeInfo = {
    "Hight": ["Resolution", "Height"],
    "Width": ["Resolution", "Width"],
    "FrameRate": ["FrameRate"]
};
var syntSld;
var procSld;
var passVehicleSld;
var jpegCfgMap = {};          // 照片大小、清晰度数据
var jpegCfgMap_bak = {};
var jsonMap_PicQuality = {};
var jsonMap_PicQuality_bak = {};
var mappingMap_PicQuality = {
    JPEGSize : ["JPEGSize"],
    SyntJPEGSize : ["SyntJPEGSize"],
    SyntQuality : ["SyntQuality"],
    ProcJPEGSize : ["ProcJPEGSize"],
    ProcQuality : ["ProcQuality"],
    TGSyntJPEGSize : ["TGSyntJPEGSize"],
    TGSyntQuality : ["TGSyntQuality"],
    single_closeUp_width : ["CloseupResolution", "Width"],
    single_closeUp_height : ["CloseupResolution", "Height"]
};
var encodeList = [
    {
        streamType: "MainStream",// 流类型
        encodeBility: 0,         // 能力集
        data: {}                 // 编码数据
    }
];
var AcceptanceModeMap ={};
var AnalogoutFormatMap = {};
var AnalogoutFormatMap_bak = {};
var picSizeMap = {
    "1920*1200": "WUXGA",
    "1920*1080": "1080P",
    "1280*960": "960P",
    "1280*720": "720P",
    "720*576": "D1",
    "352*288": "CIF",
    "1600*1200": "UXGA",
    "2048*1536": "3MP",
    "2592*2048": "5MP",
    "704*288": "2CIF",
    "1280*1024": "SXGA",
    "3840*2160": "8MP",
    "4000*3000": "12MP",
    "2592*1520": "4MP"
};

//解析jsonMap 到encodeList
function paraseJsonMap() {
    for (var streamId = 0; streamId < encodeList.length; streamId++) {//不能用jsonMap["Stream"]，抓拍球有隐藏的照片流
        //解析单个码流数据
        changeMapToMapByMapping(jsonMap["VideoEncoderCfg"][streamId], mappingMap, encodeList[streamId]["data"], 0);
        //接下去这段不涉及对jsonMap的操作
        encodeList[streamId]["data"]["PictureSize"] = encodeList[streamId]["data"]["Width"] + "*" + encodeList[streamId]["data"]["Hight"];
        cfgToForm(encodeList[streamId]["data"], encodeList[streamId]["streamType"]);
        bSpecifiedByInput = true;
        if ("undefined" != typeof encodeList[streamId]["sld"]) {
            encodeList[streamId]["sld"].SetValue(encodeList[streamId]["data"]["SmoothValue"]);
        }
        encodeList[streamId]["quaSld"].SetValue(encodeList[streamId]["data"]["Quality"]);
        bSpecifiedByInput = false;
    }
}

//解析encodeList到jsonMap 
function encodeListToJsonMap(num) {
    for (var streamId = 0; streamId < num; streamId++) {
        formToCfg(encodeList[streamId]["streamType"], encodeList[streamId]["data"]);
        changeMapToMapByMapping(jsonMap["VideoEncoderCfg"][streamId], mappingMap, encodeList[streamId]["data"], 1);
    }
}

// 编码能力计算公式
function getEncodeBility(w, h, frameRate) {
    return ((parseInt(w) + 15) & (~0xF)) * ((parseInt(h) + 15) & (~0xF)) * parseInt(frameRate);
}

// 根据streamId计算目前界面参数下该流的编码能力
function calculateByStreamId(streamId) {
    var encodeInfo = encodeList[streamId];
    var streamType = encodeInfo["streamType"];
    var $streamTypePictureSize = $("#" + streamType + "PictureSize");
    var picSizeStr = $streamTypePictureSize.val();

    if ("" == picSizeStr) {
        picSizeStr = $streamTypePictureSize.first().val();
    }

    var picSize = picSizeStr.split("*");
    var frameRate = $("#" + streamType + "FrameRate").val();
    var encodeBility = getEncodeBility(picSize[0], picSize[1], frameRate);

    // 若是MJPEG格式需要按比例转换一下
    if (VideoFormat.MJPEG == $("#" + streamType + "EncodeFmt").val()) {
        var conv = top.banner.capInfoMap["CONV"][0].split(":");
        encodeBility = encodeBility * parseInt(conv[0]) / parseInt(conv[1]);
    }
    encodeInfo["encodeBility"] = encodeBility;
}

// 根据streamId对应的流的编码能力变化，来判断后面几个流是否还允许开启
function enableStreamByStreamId(streamId) {
    var retCode = EncodeRetCode.Successed;
    var encodeBility_total = parseInt(top.banner.capInfoMap["ALONE"][0]) * 16 * 16;     // 总编码能力
    var encodeBility_use = 0;                                                       // 已使用编码能力
    calculateByStreamId(streamId);

    // 计算该流目前参数所需的编码能力
    for (var i = 0; i <= streamId; i++) {
        encodeBility_use += encodeList[i]["encodeBility"];
    }

    // 判断后面的流是否能开启
    for (; i < streamNum; i++) {
        var encodeInfo = encodeList[i];
        var streamType = encodeInfo["streamType"];

        // 流已开启，则判断目前参数在现有编码能力下是否能支持，若不支持则要关闭该流
        var $streamTypeIsEnable = $("#" + streamType + "IsEnable");
        if ($streamTypeIsEnable.is(":checked")) {
            var maxPicSize = $("#" + encodeList[i - 1]["streamType"] + "PictureSize").val().split("*");
            var newPicSize = $("#" + streamType + "PictureSize").val().split("*");

            if ((parseInt(newPicSize[0]) * parseInt(newPicSize[1])) > (parseInt(maxPicSize[0]) * parseInt(maxPicSize[1]))) {

                // 当前分辨率超过上一流的分辨率，须关闭
                retCode = EncodeRetCode.Close;
            } else {
                calculateByStreamId(i);         // 计算该流目前参数所需的编码能力

                if (encodeList[i]["encodeBility"] > (encodeBility_total - encodeBility_use)) {

                    // 目前参数在现有编码能力大于目前剩余的编码能力，则关流
                    retCode = EncodeRetCode.Close;
                } else {
                    encodeBility_use += encodeList[i]["encodeBility"];
                }
            }
        }

        // 判断剩余的编码能力是否支持开一路新流
        if (!$streamTypeIsEnable.is(":checked") || EncodeRetCode.Close == retCode) {

            for (var j = 0, len = top.banner.capInfoMap["Resolution"].length; j < len; j++) {
                var picSize = top.banner.capInfoMap["Resolution"][j].split("*");

                var encodeBility = getEncodeBility(picSize[0], picSize[1], parseInt(frameRateArr[0]));

                if (encodeBility <= (encodeBility_total - encodeBility_use)) {

                    // 改分辨率所需的最小编码能力小于等于目前剩余编码能力，则支持该分辨率
                    break;
                }
            }
            retCode = (j == len) ? EncodeRetCode.Disable : retCode;
        }

        if (EncodeRetCode.Successed != retCode) {

            // 引起后面的流无法开启
            retCode += "," + i;
            break;
        }
    }
    return retCode;
}

//图像采集制式大于30编码模式修改
function changeVinMode() {
    var $MainStreamUCCodeMode = $("#MainStreamUCCodeMode");
    var $MainStreamIIntervalDiv = $("#MainStreamIIntervalDiv");
    var $GopTypeDiv = $("#GopTypeDiv");
    var $MainStreamSmoothValueTR = $("#MainStreamSmoothValueTR");
    var $MainStreamSvcModeTR = $("#MainStreamSvcModeTR");
    var maxPicSize = $("#VinMode").val().split("*");
    var frameRate = maxPicSize[2];
    $MainStreamUCCodeMode.val(0);//0表示编码模式为关闭
    $MainStreamIIntervalDiv.removeClass("hidden");
    $GopTypeDiv.removeClass("hidden");
    $MainStreamSmoothValueTR.removeClass("hidden");
    isOpenSVC();
    if(frameRate > 30) {//30表示图像采集制式的帧率
        $MainStreamUCCodeMode.attr("disabled",true);
    } else {
        $MainStreamUCCodeMode.attr("disabled",false);
    }
}

// 根据编码能力修改streamId对应流的分辨率和帧率
function changePicsizeAndFrameRate(streamId) {
    var flag = false;
    var encodeBility_use = 0;
    var encodeBility_free = 0;
    var streamType = encodeList[streamId]["streamType"];
    var maxPicSize = $("#VinMode").val().split("*");
    var maxW = maxPicSize[0];
    var maxH = maxPicSize[1];
    var oldMaxFrameRate = maxPicSize[2];
    var resolutionArr = top.banner.capInfoMap["Resolution"];
    var bIgnoreResolutionLimit = top.banner.capInfoMap["IgnoreResolutionLimit"];

    if (0 < streamId) {
        maxPicSize = $("#" + encodeList[streamId - 1]["streamType"] + "PictureSize").val().split("*");
        maxW = maxPicSize[0];
        maxH = maxPicSize[1];
    }

    var $streamTypePictureSize = $("#" + streamType + "PictureSize");
    var picSizeVal = $streamTypePictureSize.val();
    $streamTypePictureSize.empty();

    for (var i = 0; i < streamId; i++) {
        encodeBility_use += parseInt(encodeList[i]["encodeBility"]);
    }
    encodeBility_free = parseInt(top.banner.capInfoMap["ALONE"][0]) * 16 * 16 - encodeBility_use;

    // 辅码流有特殊的分辨率
    if ((1 == streamId) && ("undefined" != typeof top.banner.capInfoMap["Resolution1"])) {
        resolutionArr = top.banner.capInfoMap["Resolution1"];
    }

    // 第三流有特殊分辨率
    if ((2 == streamId) && ("undefined" != typeof top.banner.capInfoMap["Resolution2"])) {
        resolutionArr = top.banner.capInfoMap["Resolution2"];
    }

    for (i = 0, len = resolutionArr.length; i < len; i++) {
        var picSize = resolutionArr[i];
        var picSizeArr = picSize.split("*");
        var w = parseInt(picSizeArr[0]);
        var h = parseInt(picSizeArr[1]);

        if (!bIgnoreResolutionLimit && ((w * h) > (maxW * maxH)))continue;

        if (!bIgnoreResolutionLimit && (1 == streamId && ((w * h) >= (2048 * 1536))))continue;     // 辅流不支持3M及3M以上的分辨率

        if (!bIgnoreResolutionLimit && (2 == streamId && ((w * h) > (720 * 576))))continue;        // 第三流分辨率最大为D1

        var encodeBility_need = getEncodeBility(w, h, 1);
        var newMaxFrameRate = Math.floor(encodeBility_free / encodeBility_need);
        maxFrameRate = Math.min(newMaxFrameRate, oldMaxFrameRate);

        // MJPEG

        if (VideoFormat.MJPEG == $("#" + streamType + "EncodeFmt").val()) {
            if (720 * 576 >= w * h) {
                maxFrameRate = (maxFrameRate > 15) ? 15 : maxFrameRate;
            } else {
                maxFrameRate = (maxFrameRate > 5) ? 5 : maxFrameRate;
            }
        }

        if (maxFrameRate >= parseInt(frameRateArr[0])) {
            var picSizeText = picSizeMap[picSize] ? picSizeMap[picSize] : picSize;
            $streamTypePictureSize.append("<option value='" + picSize + "' maxFrameRate='" + maxFrameRate + "'>" + picSizeText + "</option>");
        }
    }
}

// 根据分辨率修改帧率
function changeFrameRateByPicSize(streamType) {
    var maxFrameRate = parseInt(vinModeInfoMap["FrameRate"]);
    var newMaxFrameRate = $("#" + streamType + "PictureSize").find("option:selected").attr("maxFrameRate");

    if (newMaxFrameRate < maxFrameRate) {
        maxFrameRate = parseInt(newMaxFrameRate);
    }
    var $streamTypeFrameRate = $("#" + streamType + "FrameRate");

    $streamTypeFrameRate.empty();
    var frameRate = 1;

    for (var i = 0, len = frameRateArr.length; i < len; i++) {
        frameRate = parseInt(frameRateArr[i]);

        if (maxFrameRate < frameRate) break;

        if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
            frameRate = (12 == frameRate) ? 12.5 : frameRate;
        }

        $streamTypeFrameRate.append("<option value='" + parseInt(frameRate) + "'>" + frameRate + "</option>");
    }

    $("#" + streamType + "FrameRate option").last().attr("selected", true);
    if($("#" + streamType + "EncodeFmt").val() == VideoFormat.MJPEG){
        $("#" + streamType + "FrameRate").val(1);
    }else{
        $("#" + streamType + "FrameRate").val(maxFrameRate);
    }
}

// 流的启停
function streamEnable(streamId) {
    var streamType = encodeList[streamId]["streamType"];
    var $streamTypeIsEnable = $("#" + streamType + "IsEnable");
    var retCode = $streamTypeIsEnable.is(":checked") ? EncodeRetCode.Successed : EncodeRetCode.Close;
    retCode = (StreamID.MAIN_VIDEO == streamId) ? EncodeRetCode.Successed : retCode;

    if (EncodeRetCode.Successed == retCode) {

        if (StreamID.MAIN_VIDEO != streamId) {
            showStreamCfg(streamId, retCode);
        }
        $("#" + streamType + "PictureSize").mouseover();            // 计算支持的分辨率和帧率
        ChangeBitRate(streamType);

        retCode = enableStreamByStreamId(streamId);

        if (EncodeRetCode.Successed != retCode) {
            var arr = retCode.split(",");
            showStreamCfg(arr[1], arr[0]);
        }
    } else {

        if (1 == streamId && $("#ThirdStreamIsEnable").is(":checked") && !confirm($.lang.tip["tipCloseFollowStream"])) {
            $streamTypeIsEnable.attr("checked", true);
            return;
        }
        showStreamCfg(streamId, retCode);
    }
}

// 显示/隐藏流的配置项
function showStreamCfg(streamId, retCode) {
    var streamType = encodeList[streamId]["streamType"];

    var $streamTypeIsEnable = $("#" + streamType + "IsEnable");
    if (EncodeRetCode.Successed == retCode) {

        // 启流
        $streamTypeIsEnable.attr("checked", true);

        if ((1 == streamId) || ((0 == streamId) && $("#AuxStreamIsEnable").is(":checked"))) {

            // 第三流不灰显
            $("#ThirdStreamIsEnable").attr("disabled", false);
        }
        $("#" + streamType + "Tbl").removeClass("hidden");
        $("#" + streamType + "Fieldset").removeClass("closeFieldset");
        bSpecifiedByInput = true;
        encodeList[streamId]["sld"].SetValue($("#" + streamType + "SmoothValue").val());
        encodeList[streamId]["quaSld"].SetValue($("#" + streamType + "Quality").val());
        bSpecifiedByInput = false;
    } else {

        // 停流
        $streamTypeIsEnable.attr("checked", false);

        // 该流开不起来需灰显
        if (EncodeRetCode.Disable == retCode) {
            $streamTypeIsEnable.attr("disabled", true);
        }

        // 后面的流都要停
        for (var i = streamId; i < streamNum; i++) {
            streamType = encodeList[i]["streamType"];
            $("#" + streamType + "Tbl").addClass("hidden");
            $("#" + streamType + "Fieldset").addClass("closeFieldset");

            if (i > streamId) {
                $streamTypeIsEnable = $("#" + streamType + "IsEnable");
                $streamTypeIsEnable.attr("checked", false);
                $streamTypeIsEnable.attr("disabled", true);
            }
        }
    }
}

// 判断某个元素是否包含在list中
function isContain(list, elem) {

    for (var i = 0, len = list.length; i < len; i++) {

        if (elem == list[i]) {
            return true;
        }
    }
    return false;
}
//判断SVC开关是否显示
function  isOpenSVC(){
    if (top.banner.isSupportSVC) {
        $("#MainStreamSvcModeTR").removeClass("hidden");
    }
}

//数组去重
function arrDelete(picSizeList){
    var i = 0,
        len = picSizeList.length,
        map = {},
        arr = [],
        picSizeStr;

    for(; i < len; i++) {
        picSizeStr = picSizeList[i];
        if (1 != map[picSizeStr]) {
            arr.push(picSizeStr);
            map[picSizeStr] = 1;
        }
    }
    return arr;
}

// 初始化界面
function initPage() {
    if (top.banner.isSupportBNC) {
        $("#BNCfieldset").removeClass("hidden");
    }
    // 解析能力集
    // 图像制式
    var i = 0;
    var capInfoList = top.banner.capInfoMap["VinMode"];
    var len = capInfoList ? capInfoList.length : 0;
    var imageQualityStr;
    if(top.banner.isModuleVin){    //如果是机芯制式
        delete picSizeMap["2592*2048"];
        picSizeMap["3072*1728"] = "5M";
        picSizeMap["3072*2048"] = "6M";
    }

    for (; i < len; i++) {
        var picSizeArr = capInfoList[i].split("*");
        var picSize = picSizeArr[0] + "*" + picSizeArr[1];

        if (picSizeMap[picSize]) {

            if ("D1" == picSizeMap[picSize] || "CIF" == picSizeMap[picSize]) {
                picSize = "PAL";
            } else {
                var rate = picSizeArr[2];
                if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
                    rate = (12 == rate) ? 12.5 : rate;
                }
                picSize = picSizeMap[picSize] + "@" + rate;
            }
        } else {
            picSize = capInfoList[i];
        }
        $("#VinMode").append("<option value='" + capInfoList[i] + "'>" + picSize + "</option>");
    }

    var isGetDataOK = false;

    // 获取图像制式
    isGetDataOK = LAPI_GetCfgData(LAPI_URL.VideoInMode, jsonMap_VinModeInfo);
    changeMapToMapByMapping(jsonMap_VinModeInfo, mappingMap_VinModeInfo, vinModeInfoMap, 0);

    if (!isGetDataOK) {
        disablePage();
        return;
    }
    $("#VinMode").val(vinModeInfoMap["Width"] + "*" + vinModeInfoMap["Hight"] + "*" + vinModeInfoMap["FrameRate"]);

    // 车辆特写图分辨率
    if (top.banner.isSupportSingleCloseUp && !(IVAMode.ILLEGAL == top.banner.IVAType)) {
        $("#pictrueType_single_closeUp").removeClass("hidden");
        capInfoList = top.banner.capInfoMap["Resolution_closeup"];
        len = capInfoList ? capInfoList.length : 0;
        for (i = 0; i < len; i++) {
            var optionHtml = "";
            var picSize = capInfoList[i].split("*");
            if (parseInt(picSize[0]) * parseInt(picSize[1]) <= parseInt(vinModeInfoMap["Width"]) * parseInt(vinModeInfoMap["Hight"])) {
                picSize = picSizeMap[capInfoList[i]] ? picSizeMap[capInfoList[i]] : capInfoList[i];
                optionHtml = "<option value='" + capInfoList[i] + "'>" + picSize + "</option>";
                $("#single_closeUp_picSize").append(optionHtml);
            }
        }
    }

    // 解析帧率
    var frameName = "Framerate_" + vinModeInfoMap["Width"] + "x" + vinModeInfoMap["Hight"] + "x" + vinModeInfoMap["FrameRate"];

    if ("undefined" != typeof top.banner.capInfoMap[frameName]) {
        frameRateArr = top.banner.capInfoMap[frameName];
    }
    for (var i = 0, len = frameRateArr.length; i < len; i++) {

        // 更新帧率最大值
        var frameRate = parseInt(frameRateArr[i]);
        if (vinModeInfoMap["FrameRate"] < frameRate)break;
        if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
            frameRate = (12 == frameRate) ? 12.5 : frameRate;
        }
        $("#MainStreamFrameRate").append("<option value='" + parseInt(frameRate) + "'>" + frameRate + "</option>");
    }

    // 编码分辨率
    var bIgnoreResolutionLimit = top.banner.capInfoMap["IgnoreResolutionLimit"];
    capInfoList = top.banner.capInfoMap["Resolution"];
    if("undefined" != typeof top.banner.capInfoMap["Resolution1"]){
        capInfoList = capInfoList.concat(top.banner.capInfoMap["Resolution1"]);
    }
    if("undefined" != typeof top.banner.capInfoMap["Resolution2"]){
        capInfoList = capInfoList.concat(top.banner.capInfoMap["Resolution2"]);
    }
    capInfoList = arrDelete(capInfoList);
    len = capInfoList ? capInfoList.length : 0;

    for (i = 0; i < len; i++) {
        var picSize = capInfoList[i].split("*");
        if (bIgnoreResolutionLimit || (parseInt(picSize[0]) * parseInt(picSize[1])) <= (parseInt(vinModeInfoMap["Width"]) * parseInt(vinModeInfoMap["Hight"]))) {

            // 分辨率不能大于采集制式的分辨率
            var picSize = picSizeMap[capInfoList[i]] ? picSizeMap[capInfoList[i]] : capInfoList[i];
            var optionHtml = "<option value='" + capInfoList[i] + "'>" + picSize + "</option>";
            $("#MainStreamPictureSize").append(optionHtml);
        }
    }

    // 编码格式
    capInfoList = top.banner.capInfoMap["EncodeFormat"];
    i = 0;

    if (null != capInfoList && capInfoList.length > 0) {
        var optionsArr = $("#MainStreamEncodeFmt").find("option");

        for (len = optionsArr.length; i < len; i++) {
            var option = optionsArr[i];

            if (!isContain(capInfoList, $(option).attr("cap"))) {
                $(option).remove();
            }
        }
    }
    //判断UCCODE配置项是否显示
    if(top.banner.isSupportUCODE) {
        var value_framerate = $("#MainStreamFrameRate").val();
        if(30 >= value_framerate) {
            $("#MainStreamUCCodeModeTR").removeClass("hidden");
        }
        parseCapOptions("MainStreamUCCodeMode", top.banner.UCODEMode, "mode");
    }

    isOpenSVC();

    var $MainStreamTbl = $("#MainStreamTbl");
    var enCodeHtml = $MainStreamTbl.html();

    if (streamNum > 1) {
        encodeList.push({
            streamType: "AuxStream",
            encodeBility: 0,
            data: {}
        });
        var auxEnCodeHtml = enCodeHtml.replace(/MainStream/g, "AuxStream");
        $("#AuxStreamTbl").append(auxEnCodeHtml);
        $("#AuxStream").removeClass("hidden");
        $("#AuxStreamUCCodeModeTR").addClass("hidden-visible");
        // 辅码流有特殊的分辨率
        if ("undefined" != typeof top.banner.capInfoMap["Resolution1"]) {
            changePicsizeAndFrameRate(1);
        }
    }

    if (streamNum > 2) {
        encodeList.push({
            streamType: "ThirdStream",
            encodeBility: 0,
            data: {}
        });
        var thirdEnCodeHtml = enCodeHtml.replace(/MainStream/g, "ThirdStream");
        $("#ThirdStreamTbl").append(thirdEnCodeHtml);
        $("#ThirdStream").removeClass("hidden");
        $("#ThirdStreamUCCodeModeTR").addClass("hidden-visible");
        // 第三流有特殊分辨率
        if ("undefined" != typeof top.banner.capInfoMap["Resolution2"]) {
            changePicsizeAndFrameRate(2);
        }
    }

    // 禁止修改主码流分辨率
    if (top.banner.capInfoMap["NoModifyMainPicSize"]) {
        $("#MainStreamPictureSize").attr("disabled", true);
    }
    if(top.banner.isSupportsystemSetUpLink && !top.banner.isSupportIpcCapture) {
        $("#passRecord").addClass("hidden");
    }
    // 抓拍流配置项
    if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
        encodeList.push({
            streamType: "JpegStream",
            encodeBility: 0,
            data: {}
        });
        if (top.banner.isSupportEncodePic) {
            $("#JpegStream").removeClass("hidden");
        }

        if (top.banner.isSupportDeviceCombinePic) {
            $("#syntPassRecord").removeClass("hidden");
        }
        if (top.banner.isSupportIllegalParam) {
            $("#peccancyRecord").removeClass("hidden");
        }
        if (top.banner.isSupportDeviceCombinePic || top.banner.isSupportIllegalParam) {
            $("#peccancySyntRecord").removeClass("hidden");
        }
        if(IVAMode.ILLEGAL == top.banner.IVAType) {
            $("#JpegStream").css("float","none");
            $("#JpegStream").css("clear","both");
            $("#peccancySyntRecord").css("margin-bottom","0px");
            $("#passRecord").addClass("hidden");
            $("#syntPassRecord").addClass("hidden");
            $("#ProcJPEGSizeID").addClass("hidden");
            $("#SyntJPEGSizeID").addClass("hidden");
        }
        if ("undefined" != typeof top.banner.capInfoMap["Resolution_jpeg"]) {
            capInfoList = top.banner.capInfoMap["Resolution_jpeg"];
            len = capInfoList ? capInfoList.length : 0;

            for (i = 0; i < len; i++) {
                var picSize = capInfoList[i].split("*");
                if ((parseInt(picSize[0]) * parseInt(picSize[1])) <= (parseInt(vinModeInfoMap["Width"]) * parseInt(vinModeInfoMap["Hight"]))) {

                    // 分辨率不能大于采集制式的分辨率
                    var picSize = picSizeMap[capInfoList[i]] ? picSizeMap[capInfoList[i]] : capInfoList[i];
                    var optionHtml = "<option value='" + capInfoList[i] + "'>" + picSize + "</option>";
                    $("#JpegStreamPictureSize").append(optionHtml);
                }
            }
            $("#JpegStreamPicSizeTR").removeClass("hidden");
        }
    }

    imageQualityStr =   "<td>" + $.lang.pub["imageQuality"] + "</td>" +
                        "<td></td>" +
                        "<td>" +
                            "<div class='slider3' id='JpegStreamQuaSlider'>" +
                                "<div class='bar3' id='JpegStreamQuaBar'></div>" +
                            "</div>" +
                            " <input type='text' name='Quality' id='JpegStreamQuality' name='Quality' class='shortTxt' size='1' maxlength='3' onKeyPress='onPicKeyPress(this);'/>"; +
                        "</td>";

    if (top.banner.isSupportOnlyEncodeQuality) {
        $("#OnlyEncodeQuality").removeClass("hidden");
        $("#imageQualityTR").append(imageQualityStr);
        $("#passVehicleQuaSlider").parent().parent().addClass("hidden");
        $("#procQuaSlider").parent().parent().addClass("hidden");
        $("#syntQuaSlider").parent().parent().addClass("hidden");
    } else {
        $("#JpegStreamQualityTR").removeClass("hidden").append(imageQualityStr);
    }

    GopTypeArr = top.banner.GopTypeArr;
    if (GopTypeArr.length > 0) {
        var element = $MainStreamTbl.find("select[name='GopType']");
        element.empty();
        var str = "";
        for (var i = 0; i < top.banner.GopTypeArr.length; i++) {
            str += "<option value='" + GopTypeArr[i] + "'>" + GopType[i] + "</option>";
        }
        element.append(str);
        ChangeMainStreamPicSize();
    }
}

function ChangeMainStreamPicSize() {
    var element = $("#MainStreamTbl").find("select[name='GopType']");
    var value = $("#MainStreamPictureSize").val().split("*");
    if (parseInt(value[0]) * parseInt(value[1]) > 1920 * 1080) {
        element.val(0);
        element.attr("disabled", true);
    } else {
        element.attr("disabled", false);
    }
}

function setVinMode() {
    var $VinMode = $("#VinMode");
    if (!confirm($.lang.tip["tipVinModeChanged"])) {
        $VinMode.val(vinModeInfoMap["Width"] + "*" + vinModeInfoMap["Hight"] + "*" + vinModeInfoMap["FrameRate"]);
        return;
    }

    var arr = $VinMode.val().split("*");
    jsonMap_VinModeInfo["Resolution"]["Width"] = arr[0];
    jsonMap_VinModeInfo["Resolution"]["Height"] = arr[1];
    jsonMap_VinModeInfo["FrameRate"] = arr[2];
    var flag = LAPI_SetCfgData(LAPI_URL.VideoInMode, jsonMap_VinModeInfo, false);
    top.banner.showMsg(flag);
    return flag;
}

// 获取编码参数
function getEncodeData() {
    var num = (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) ? (streamNum + 1) : streamNum;
    var isGetDataOK = LAPI_GetCfgData(LAPI_URL.VideoEncode, jsonMap);

    if (!isGetDataOK) {
        disablePage();
        return false;
    }
    jsonMap_bak = objectClone(jsonMap);
    //解析jsonMap
    paraseJsonMap();

    return true;
}
//划分分辨率
function rangePic(obj){
    var rangeList = [100,250,350,550,750,950,1150];
    var i = 0;

    for(;i < rangeList.length; i++){
        if(obj <= rangeList[i]){
            break;
        }
    }
    return i;
}

// 根据分辨率修改码流范围
function ChangeBitRate(streamType) {

    var currentPictureSize = $("#" + streamType + "PictureSize").val();
    var currentEncodeFmt = $("#" + streamType + "EncodeFmt").val();
    var currentUCCodeMode = $("#" + streamType + "UCCodeMode").val();
    var currentFrameRate = $("#" + streamType + "FrameRate").val();
    var bitNum = 1,
        DefBitRate,
        picSize = currentPictureSize.split("*"),
        picSizeM,
        specialPicSize,
        rangeNum,
        newMinBitRate,
        DBitRateRemainder;

    /*支持抓拍的设备*/
    specialPicSize = ("1600*1200" == currentPictureSize) || ("1920*1080" == currentPictureSize) ||
              ("2048*1536" == currentPictureSize) || ("2592*2048" == currentPictureSize);
    picSizeM = picSize[0] * picSize[1];
    picSizeM = picSizeM /(1000 * 1000);     //转换成M单位
    picSizeM = picSizeM * 100;
    picSizeM = Math.floor(picSizeM);

    rangeNum = rangePic(picSizeM);
    switch (rangeNum) {
        case 0:
            if ("352*288" == currentPictureSize) {           //CIF
                DefBitRate = 128;
            } else if (("704*288" == currentPictureSize) || ("720*576" == currentPictureSize) || ("640*360" == currentPictureSize)) {  //2CIF 和 D1/PAL
                DefBitRate = 1024;
            } else {
                DefBitRate = 2048;                          //720P 以及其他小于720P分辨率
            }
            break;

        case 1:
            if (("1920*1080" == currentPictureSize) || ("1200*1600" == currentPictureSize) || ("1600*1200" == currentPictureSize)) {
                //1080P  UXGA
                if (top.banner.isSupportCapture) {
                    DefBitRate = 2048;
                } else {
                    DefBitRate = 4096;
                }
            } else if (("1280*1024" == currentPictureSize) || ("1280*960" == currentPictureSize)) {         //SXGA 960P
                DefBitRate = 2048;
            } else{
                DefBitRate = 4096;
            }
            break;

        case 2:
            if (("2048*1536" == currentPictureSize) || ("2048*1520" == currentPictureSize)) { //3M
                if (top.banner.isSupportCapture) {
                    DefBitRate = 2048;
                } else {
                    DefBitRate = 5120;
                }
            } else {
                DefBitRate = 5120;
            }
            break;

        case 3:
            if ("2592*2048" == currentPictureSize) {   //5M
                if (top.banner.isSupportCapture) {
                    DefBitRate = 2048;
                } else {
                    DefBitRate = 6144;
                }
            } else {
                DefBitRate = 6144;
            }
            break;

        case 4:
            DefBitRate = 7168;
            break;

        case 5:
            DefBitRate = 8192;
            break;

        case 6:
            DefBitRate = 9216;
            break;

        case 7:
            DefBitRate = 10240;
            break;

        default :
            break;
    }

    if (2 == currentUCCodeMode) {  //Ucode为高级模式
        bitNum = bitNum * 2;
    }else if(1 == currentUCCodeMode){   //u-code为普通模式
        if(550 > picSizeM){           //小于5.5M以下
            bitNum = bitNum * 4 / 3;
        }
    }
    DefBitRate = DefBitRate / bitNum;
    //码率转化成M单位取整，精确到0.125M
    DBitRateRemainder = Math.ceil(DefBitRate / 128);
    DefBitRate = DBitRateRemainder * 128;


    bitNum = 1;
    if (currentEncodeFmt == VideoFormat.H265) {  //h.265下码率为原来1/2
        bitNum = bitNum * 2;
    }
    DefBitRate = DefBitRate / bitNum;
    //码率转化成M单位取整，精确到0.125M
    DBitRateRemainder = Math.ceil(DefBitRate / 128);
    DefBitRate = DBitRateRemainder * 128;


    // if (20 > currentFrameRate) {         //[1，20)减半，[20,30]不变，（30,60]1.5倍
    //     if (specialPicSize) {
    //         if (!top.banner.isSupportCapture) {
    //             DefBitRate = 0.5 * DefBitRate;
    //         }
    //     } else {
    //         DefBitRate = 0.5 * DefBitRate;
    //     }
    // } else
        if ((60 >= currentFrameRate) && (30 < currentFrameRate)) {
        if (specialPicSize) {
            if (!top.banner.isSupportCapture) {
                DefBitRate = 1.5 * DefBitRate;
            }
        } else {
            DefBitRate = 1.5 * DefBitRate;
        }
    }
    //码率转化成M单位取整，精确到0.125M
    DBitRateRemainder = Math.ceil(DefBitRate / 128);
    DefBitRate = DBitRateRemainder * 128;

    if("MainStream" == streamType && AcceptanceModeMap["Mode"]){
        newMinBitRate = AcceptanceModeMap["MinBiteRate"];
    }else{
        newMinBitRate = MinBitRate;
    }
    $("#" + streamType + "BitRateUnit").html("[" + newMinBitRate + "~" + MaxBitRate + "]");
    var $streamTypeBitRate = $("#" + streamType + "BitRate");
    $streamTypeBitRate.attr("maxlength", MaxBitRate.toString().length);
    $streamTypeBitRate.attr("minBitRate", newMinBitRate);
    $streamTypeBitRate.attr("maxBitRate", MaxBitRate);
    $streamTypeBitRate.attr("defaultValue", DefBitRate);
    $streamTypeBitRate.val(DefBitRate);
}

/**
 * 变更编码模式触发的事件
 *
 * @type 码流类型
 */
function changeEncodeMode(type) {
    var encodeModeId = "#" + type + "EncodeMode";
    var isVBR = (1 == $(encodeModeId).val());

    if (isVBR) {
        $("#" + type + "QuaSlider").removeClass().addClass("slider3");
        $("#" + type + "QuaBar").removeClass().addClass("bar3");
    } else {
        $("#" + type + "QuaSlider").removeClass().addClass("slider4");
        $("#" + type + "QuaBar").removeClass().addClass("bar3 bar4");
    }

    for (var i = 0; i < streamNum; i++) {

        if (type == encodeList[i]["streamType"]) {
            encodeList[i]["quaSld"].setEnable(isVBR);
            break;
        }
    }
}
//切换主码流的编码格式事件
function changeMainStreamEncodeFmt() {
    var $MainStreamUCCodeMode = $("#MainStreamUCCodeMode");
    var $MainStreamIIntervalDiv = $("#MainStreamIIntervalDiv");
    var $GopTypeDiv = $("#GopTypeDiv");
    var $MainStreamSmoothValueTR = $("#MainStreamSmoothValueTR");
    var $MainStreamSvcModeTR = $("#MainStreamSvcModeTR");
    var maxPicSize = $("#VinMode").val().split("*");
    var frameRate = maxPicSize[2];
    if($("#MainStreamEncodeFmt").val() == VideoFormat.JPEG || frameRate > 30) {//3表示MJPEG
        $MainStreamUCCodeMode.val(0);
        $MainStreamUCCodeMode.attr("disabled",true);
        $MainStreamIIntervalDiv.removeClass("hidden");
        $GopTypeDiv.removeClass("hidden");
        $MainStreamSmoothValueTR.removeClass("hidden");
        isOpenSVC();
    } else {
        $MainStreamUCCodeMode.attr("disabled",false);
        if(0 != $MainStreamUCCodeMode.val()) {
            $MainStreamIIntervalDiv.addClass("hidden");
            $GopTypeDiv.addClass("hidden");
            $MainStreamSmoothValueTR.addClass("hidden");
            $MainStreamSvcModeTR.addClass("hidden");
        } else {
            $MainStreamIIntervalDiv.removeClass("hidden");
            $GopTypeDiv.removeClass("hidden");
            $MainStreamSmoothValueTR.removeClass("hidden");
            isOpenSVC();
        }
    }
}
// 编码格式切换事件
function changeEncodeFmt(type) {
    var encodeFmt = $("#" + type + "EncodeFmt").val();
    var isDisable = (VideoFormat.MJPEG == encodeFmt);// MJPEG

    $("#" + type + "EncodeMode").attr("disabled", isDisable);
    $("#" + type + "BitRate").attr("disabled", isDisable);
    $("#" + type + "IInterval").attr("disabled", isDisable);
    if("MainStream" == type && isDisable){
        $("#MainStreamUCCodeMode").attr("disabled", isDisable);
        $("#MainStreamUCCodeMode").val(0);
        enableConfig();
    }

    if(0 != $("#MainStreamUCCodeMode").val()) {
        $("#MainStreamEncodeMode").attr("disabled",true);
    }
    //编码格式切换为MJPEG的时候灰显SVC选项
    if(3 == $("#" + type + "EncodeFmt").val()){
        $("#" + type + "SvcModeTR").find("input").attr("disabled","true");
    }else{
        $("#" + type + "SvcModeTR").find("input").removeAttr("disabled");
    }
    if (isDisable) {
        // 图像质量
        $("#" + type + "QuaSlider").removeClass().addClass("slider3");
        $("#" + type + "QuaBar").removeClass().addClass("bar3");

        // 码流平滑
        $("#" + type + "Slider").removeClass().addClass("slider4");
        $("#" + type + "Bar").removeClass().addClass("bar3 bar4");
    } else {
        changeEncodeMode(type);
        $("#" + type + "Slider").removeClass().addClass("slider3");
        $("#" + type + "Bar").removeClass().addClass("bar3");
    }

    for (var i = 0; i < streamNum; i++) {

        if (type == encodeList[i]["streamType"]) {
            if (isDisable) {
                encodeList[i]["quaSld"].setEnable(true);
            }
            encodeList[i]["sld"].setEnable(!isDisable);
            break;
        }
    }
}

// 灰显界面
function disablePage() {
    var streamType = "";
    disableAll();

    for (var i = 0; i < streamNum; i++) {
        streamType = encodeList[i]["streamType"];

        $("#" + streamType + "QuaSlider").removeClass().addClass("slider4");
        $("#" + streamType + "QuaBar").removeClass().addClass("bar3 bar4");
        encodeList[i]["quaSld"].setEnable(false);

        $("#" + streamType + "Slider").removeClass().addClass("slider4");
        $("#" + streamType + "Bar").removeClass().addClass("bar3 bar4");
        encodeList[i]["sld"].setEnable(false);
    }
    if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
        streamType = encodeList[streamNum]["streamType"];

        $("#" + streamType + "QuaSlider").removeClass().addClass("slider4");
        $("#" + streamType + "QuaBar").removeClass().addClass("bar3 bar4");
        encodeList[streamNum]["quaSld"].setEnable(false);
    }
}

function validateBitRate(obj) {
    validNumber(obj, parseInt($(obj).attr("minBitRate")), parseInt($(obj).attr("maxBitRate")), $.lang.tip["tipBitRateScopeErr"]);
}

function ValidVideoIInterval(obj) {
    validNumber(obj, 5, 250, $.lang.tip["tipVideoIIntervalScopeErr"]);
}

//UCode启用时灰显相关项
function enableConfig() {
    var flag,
        type = encodeList[0]["streamType"],
        $MainStreamIIntervalDiv = $("#MainStreamIIntervalDiv"),
        $GopTypeDiv = $("#GopTypeDiv"),
        $MainStreamSmoothValueTR = $("#MainStreamSmoothValueTR"),
        $MainStreamSvcModeTR = $("#MainStreamSvcModeTR"),
        $MainStreamEncodeMode = $("#MainStreamEncodeMode"),
        value_ucode = $("#MainStreamUCCodeMode").val();
    if(0 != value_ucode) {
        flag = true;
        $MainStreamIIntervalDiv.addClass("hidden");
        $MainStreamSvcModeTR.addClass("hidden");
        $GopTypeDiv.addClass("hidden");
        $MainStreamSmoothValueTR.addClass("hidden");
        $MainStreamEncodeMode.val(1);
        changeEncodeMode(type);
    } else {
        flag = false;
        $MainStreamIIntervalDiv.removeClass("hidden");
        isOpenSVC();
        $GopTypeDiv.removeClass("hidden");
        $MainStreamSmoothValueTR.removeClass("hidden");
    }

    $MainStreamEncodeMode.attr("disabled", flag);
}


function submitF() {
    var flag = true;
    var retcode = ResultCode.RESULT_CODE_SUCCEED;
    var i = 0;
    var encodeInfo = null;
    var pcParam = "";
    var str = "";
    var jpegStr = "";
    var data = null;
    var n = "";
    var single_closeUp_picSize;
    var num = (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) ? (streamNum + 1) : streamNum;
    if(top.banner.isSupportBNC) {
        AnalogoutFormatMap["AnalogoutFormat"] = Number($("#AnalogoutFormat").val());
        if (!isObjectEquals(AnalogoutFormatMap, AnalogoutFormatMap_bak)) {
            if(LAPI_SetCfgData(LAPI_URL.AnalogoutFormat, AnalogoutFormatMap)){
                AnalogoutFormatMap_bak = objectClone(AnalogoutFormatMap);
            }
        }
    }

    if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
        if(IVAMode.ILLEGAL != top.banner.IVAType && top.banner.isSupportSingleCloseUp) {
            single_closeUp_picSize = $("#single_closeUp_picSize").val();
            jpegCfgMap["single_closeUp_width"] = single_closeUp_picSize.split("*")[0];
            jpegCfgMap["single_closeUp_height"] = single_closeUp_picSize.split("*")[1];
        }
        jpegCfgMap["ProcJPEGSize"] = $("#ProcJPEGSize").val() * 1000;
        jpegCfgMap["SyntJPEGSize"] = $("#SyntJPEGSize").val() * 1000;
        jpegCfgMap["JPEGSize"] = $("#JPEGSize").val() * 1000;
        jpegCfgMap["TGSyntJPEGSize"] = $("#TGSyntJPEGSize").val() * 1000;

        for (n in jpegCfgMap) {
            if(isNaN(jpegCfgMap[n])) {
                jpegCfgMap[n] = jpegCfgMap_bak[n];
            }
        }
        changeMapToMapByMapping(jsonMap_PicQuality, mappingMap_PicQuality, jpegCfgMap, 1);
        if (!isObjectEquals(jsonMap_PicQuality, jsonMap_PicQuality_bak)) {
            flag = LAPI_SetCfgData(LAPI_URL.PicQuality, jsonMap_PicQuality);
            if (flag) {
                jsonMap_PicQuality_bak = objectClone(jsonMap_PicQuality);
            }
        }
    }
    
    if (flag) {
        //下发编码参数
        encodeListToJsonMap(num);
        LAPI_SetCfgData(LAPI_URL.VideoEncode, jsonMap);
    }
}


function initEvent() {
    $("#MainStreamEncodeFmt").change(function () {
        changeMainStreamEncodeFmt();
        if(0 != $("#MainStreamUCCodeMode")) {
            $("#MainStreamEncodeMode").attr("disabled",true);
        }
    });
    $("#MainStreamUCCodeMode").change(function() {enableConfig();
        var type = this.id.replace("UCCodeMode", "");
        ChangeBitRate(type); });
    $("#VinMode").change(function () {
        changeVinMode();
        if (setVinMode()) {
            disablePage();
        }
    });

    for (var i = 0; i < streamNum; i++) {

        // 初始化滑动条
        var streamType = encodeList[i]["streamType"];
        sld = new Slider(streamType + "Slider", streamType + "Bar", {
            onMove: function () {

                if (!bSpecifiedByInput) {
                    var value = Math.round(this.GetValue());
                    $("#" + this.textId).val(value);
                }
            },
            onDragStop: function () {
            }
        });
        sld.textId = streamType + "SmoothValue";
        sld.MinValue = 1;
        sld.MaxValue = 9;
        encodeList[i]["sld"] = sld;

        quaSld = new Slider(streamType + "QuaSlider", streamType + "QuaBar", {
            onMove: function () {

                if (!bSpecifiedByInput) {
                    var value = Math.round(this.GetValue());
                    $("#" + this.textId).val(value);
                }
            },
            onDragStop: function () {
            }
        });
        quaSld.textId = streamType + "Quality";
        quaSld.MinValue = 1;
        quaSld.MaxValue = 9;
        encodeList[i]["quaSld"] = quaSld;

        // 事件绑定
        var $streamTypePictureSize = $("#" + streamType + "PictureSize");
        $streamTypePictureSize.attr("streamId", i);
        $streamTypePictureSize.attr("isFreshed", 0);
        $streamTypePictureSize.bind("mouseover", function () {
            var streamId = parseInt($(this).attr("streamId"));

            if (!parseInt($(this).attr("isFreshed"))) {
                var type = this.id.replace("PictureSize", "");
                var $typePictureSize = $("#" + type + "PictureSize");
                var picSize = $typePictureSize.val();
                var $typeFrameRate = $("#" + type + "FrameRate");
                var frameRate = $typeFrameRate.val();
                changePicsizeAndFrameRate(streamId);

                if ($("#" + type + "PictureSize option[value='" + picSize + "']").length > 0) {
                    $typePictureSize.val(picSize);
                } else {
                    $typePictureSize.first().attr("selected", true);
                    $typePictureSize.attr("defaultValue", $typePictureSize.val());
                }

                $("#" + type + "Hight").val($typePictureSize.val().split("*")[1]);
                $("#" + type + "Width").val($typePictureSize.val().split("*")[0]);
                changeFrameRateByPicSize(type);

                if ($("#" + type + "FrameRate option[value='" + frameRate + "']").length > 0) {
                    $typeFrameRate.val(frameRate);
                } else {
                    $typeFrameRate.last().attr("selected", true);
                    $typeFrameRate.attr("defaultValue", $typeFrameRate.val());
                }

                $(this).attr("isFreshed", 1);
                $typeFrameRate.attr("isFreshed", 1);
            }
        });
        $streamTypePictureSize.change(function () {
            var streamId = parseInt($(this).attr("streamId"));
            var type = this.id.replace("PictureSize", "");
            var arr = this.value.split("*");
            var $typeWidth = $("#" + type + "Width");
            $typeWidth.val(arr[0]);
            var $typeHight = $("#" + type + "Hight");
            $typeHight.val(arr[1]);
            changeFrameRateByPicSize(type);
            var reCode = enableStreamByStreamId(streamId);

            var $typeFrameRate = $("#" + type + "FrameRate");
            if (EncodeRetCode.Successed != reCode) {

                if (!confirm($.lang.tip["tipCloseFollowStream"])) {
                    $(this).val($(this).attr("defaultValue"));
                    var arr = this.value.split("*");
                    $typeWidth.val(arr[0]);
                    $typeHight.val(arr[1]);
                    changeFrameRateByPicSize(type);
                    $typeFrameRate.val(parseInt($typeFrameRate.attr("defaultValue")));
                    return;
                }

                var arr = reCode.split(",");
                showStreamCfg(arr[1], arr[0]);
            } else {

                if (streamId < (streamNum - 1)) {
                    $("#" + encodeList[streamId + 1]["streamType"] + "IsEnable").attr("disabled", false);
                }

                showStreamCfg(streamId, reCode);
            }
            $(this).attr("defaultValue", this.value);
            $typeFrameRate.attr("defaultValue", $typeFrameRate.val());
            ChangeBitRate(type);

            // 编码能力发生变化需要将后续流的刷新分辨率的标志位恢复为false
            for (var i = streamId + 1; i < streamNum; i++) {
                $("#" + encodeList[i]["streamType"] + "PictureSize").attr("isFreshed", 0);
                $("#" + encodeList[i]["streamType"] + "FrameRate").attr("isFreshed", 0);
            }
            if (GopTypeArr.length > 0) {
                ChangeMainStreamPicSize();
            }
        });
        var $streamTypeFrameRate = $("#" + streamType + "FrameRate");
        $streamTypeFrameRate.attr("streamId", i);
        $streamTypeFrameRate.attr("isFreshed", 0);
        $streamTypeFrameRate.bind("mouseover", function () {
            var streamId = parseInt($(this).attr("streamId"));

            if (!parseInt($(this).attr("isFreshed"))) {
                var type = this.id.replace("FrameRate", "");
                var $typePictureSize = $("#" + type + "PictureSize");
                var picSize = $typePictureSize.val();
                var $typeFrameRate = $("#" + type + "FrameRate");
                var frameRate = $typeFrameRate.val();
                changePicsizeAndFrameRate(streamId);

                if ($("#" + type + "PictureSize option[value='" + picSize + "']").length > 0) {
                    $typePictureSize.val(picSize);
                } else {
                    $typePictureSize.first().attr("selected", true);
                    $typePictureSize.attr("defaultValue", $typePictureSize.val());
                }

                $("#" + type + "Hight").val($typePictureSize.val().split("*")[1]);
                $("#" + type + "Width").val($typePictureSize.val().split("*")[0]);
                changeFrameRateByPicSize(type);

                if ($("#" + type + "FrameRate option[value='" + frameRate + "']").length > 0) {
                    $typeFrameRate.val(frameRate);
                } else {
                    $typeFrameRate.last().attr("selected", true);
                    $typeFrameRate.attr("defaultValue", $typeFrameRate.val());
                }

                $(this).attr("isFreshed", 1);
                $typePictureSize.attr("isFreshed", 1);
            }
        });
        $streamTypeFrameRate.change(function () {
            var type = this.id.replace("FrameRate", "");
            var streamId = parseInt($(this).attr("streamId"));
            var reCode = enableStreamByStreamId(streamId);

            if (EncodeRetCode.Successed != reCode) {

                if (!confirm($.lang.tip["tipCloseFollowStream"])) {
                    $(this).val(parseInt($(this).attr("defaultValue")));
                    return;
                }

                var arr = reCode.split(",");
                showStreamCfg(arr[1], arr[0]);
            } else {

                if (streamId < (streamNum - 1)) {
                    $("#" + encodeList[streamId + 1]["streamType"] + "IsEnable").attr("disabled", false);
                }
                showStreamCfg(streamId, reCode);
            }

            $(this).attr("defaultValue", this.value);

            // 编码能力发生变化需要将后续流的刷新分辨率的标志位恢复为false
            for (var i = streamId + 1; i < streamNum; i++) {
                $("#" + encodeList[i]["streamType"] + "PictureSize").attr("isFreshed", 0);
                $("#" + encodeList[i]["streamType"] + "FrameRate").attr("isFreshed", 0);
            }

            ChangeBitRate(type);
        });

        // 码率类型
        $("#" + streamType + "EncodeMode").change(function () {
            changeEncodeMode(this.id.replace("EncodeMode", ""));
        });

        // 编码格式
        $("#" + streamType + "EncodeFmt").change(function () {
            var type = this.id.replace("EncodeFmt", "");
            changeEncodeFmt(type);
            ChangeBitRate(type);
            var $typePictureSize = $("#" + type + "PictureSize");
            $typePictureSize.attr("isFreshed", 0);
            var $typeFrameRate = $("#" + type + "FrameRate");
            $typeFrameRate.attr("isFreshed", 0);
            $typePictureSize.mouseover();
            if (VideoFormat.MJPEG == $(this).val()) {// MJPEG
                // 默认1帧
                $typeFrameRate.val(1);
                //当编码格式为MJPEG时，灰显SVC选项
                 $("#" + type + "SvcModeTR").find("input").attr("disabled","true");
            }else{
                var maxFrameRate = parseInt(vinModeInfoMap["FrameRate"]);
                $typeFrameRate.val(maxFrameRate);
                $("#" + type + "SvcModeTR").find("input").removeAttr("disabled");
            }
        });
    }

    if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
        var streamType = encodeList[streamNum]["streamType"];
        quaSld = new Slider(streamType + "QuaSlider", streamType + "QuaBar", {
            onMove: function () {
                if (!bSpecifiedByInput) {
                    var value = Math.round(this.GetValue());
                    var $thistextId = $("#" + this.textId);
                    $thistextId.val(value);
                    $thistextId[0].setAttribute("defaultValue", value);

                }
            }
        });
        quaSld.textId = streamType + "Quality";
        quaSld.MinValue = 0;
        quaSld.MaxValue = 100;
        encodeList[streamNum]["quaSld"] = quaSld;

        $("#" + streamType + "Quality").bind("change", function () {
            if (validNumber(this, 0, 100, $.lang.tip["tipVideoImgQualityScopeErr"])) {
                encodeList[streamNum]["quaSld"].SetValue($(this).val());
                this.setAttribute("defaultValue", this.value);
            }
        });

        $("#JPEGSize").bind("change", function () {
            if (validNumber(this, 1, 4000, $.lang.tip["tipVideoJPEGSizeScopeErr"])) {
                this.setAttribute("defaultValue", this.value);
            }
        });

        $("#" + streamType + "PictureSize").change(function () {
            var streamId = parseInt($(this).attr("streamId"));
            var type = this.id.replace("PictureSize", "");
            var arr = this.value.split("*");
            $("#" + type + "Width").val(arr[0]);
            $("#" + type + "Hight").val(arr[1]);
        });

        // 违章合成图
        syntSld = new Slider("syntQuaSlider", "syntQuaBar", {
            onMove: function () {
                if (!bSpecifiedByInput) {
                    var value = Math.round(this.GetValue());
                    var $thistextId = $("#" + this.textId);
                    $thistextId.val(value);
                    $thistextId[0].setAttribute("defaultValue", value);
                }
                jpegCfgMap["SyntQuality"] = value;
            }
        });
        syntSld.textId = "SyntQuality";
        syntSld.MinValue = 0;
        syntSld.MaxValue = 100;
        $("#SyntQuality").bind("change", function () {
            if (validNumber(this, 0, 100, $.lang.tip["tipVideoImgQualityScopeErr"])) {
                syntSld.SetValue($(this).val());
                this.setAttribute("defaultValue", this.value);
            }
            jpegCfgMap["SyntQuality"] = this.value;
        });
        $("#SyntJPEGSize").bind("change", function () {
            if (validNumber(this, 1, 10000, $.lang.tip["tipVideoJPEGSizeScopeErr"])) {
                this.setAttribute("defaultValue", this.value);
            }
        });

        // 违章单张图
        procSld = new Slider("procQuaSlider", "procQuaBar", {
            onMove: function () {
                if (!bSpecifiedByInput) {
                    var value = Math.round(this.GetValue());
                    var $thistextId = $("#" + this.textId);
                    $thistextId.val(value);
                    $thistextId[0].setAttribute("defaultValue", value);
                }
                jpegCfgMap["ProcQuality"] = value;
            }
        });
        procSld.textId = "ProcQuality";
        procSld.MinValue = 0;
        procSld.MaxValue = 100;
        $("#ProcQuality").bind("change", function () {
            if (validNumber(this, 0, 100, $.lang.tip["tipVideoImgQualityScopeErr"])) {
                procSld.SetValue($(this).val());
                this.setAttribute("defaultValue", this.value);
            }
            jpegCfgMap["ProcQuality"] = this.value;
        });
        $("#ProcJPEGSize").bind("change", function () {
            if (validNumber(this, 1, 4000, $.lang.tip["tipVideoJPEGSizeScopeErr"])) {
                this.setAttribute("defaultValue", this.value);
            }
        });

        // 过车合成图
        passVehicleSld = new Slider("passVehicleQuaSlider", "passVehicleQuaBar", {
            onMove: function () {
                if (!bSpecifiedByInput) {
                    var value = Math.round(this.GetValue());
                    var $thistextId = $("#" + this.textId);
                    $thistextId.val(value);
                    $thistextId[0].setAttribute("defaultValue", value);
                }
                jpegCfgMap["TGSyntQuality"] = value;
            }
        });
        passVehicleSld.textId = "TGSyntQuality";
        passVehicleSld.MinValue = 0;
        passVehicleSld.MaxValue = 100;
        $("#TGSyntQuality").bind("change", function () {
            if (validNumber(this, 0, 100, $.lang.tip["tipVideoImgQualityScopeErr"])) {
                passVehicleSld.SetValue($(this).val());
                this.setAttribute("defaultValue", this.value);
            }
            jpegCfgMap["TGSyntQuality"] = this.value;
        });
        $("#TGSyntJPEGSize").bind("change", function () {
            if (validNumber(this, 1, 6000, $.lang.tip["tipVideoJPEGSizeScopeErr"])) {
                this.setAttribute("defaultValue", this.value);
            }
        });
    }
}

// 初始化
function initData() {
    var j = 0,
        select_options,
        frameRate;
    changeMainStreamEncodeFmt();
    if (!getEncodeData()) return;
    LAPI_GetCfgData(LAPI_URL.AcceptanceMode, AcceptanceModeMap);
    // 界面赋值
    for (var i = 0; i < streamNum; i++) {
        var encodeInfo = encodeList[i];
        var data = encodeInfo["data"];
        // 处理非预设的帧率
        select_options = $("#" + encodeInfo["streamType"] + "FrameRate option");
        frameRate = parseInt(data["FrameRate"]);
        if (0 == $("#" + encodeInfo["streamType"] + "FrameRate option[value='" + frameRate + "']").length) {
            // 插入
            for (j = 0; j < select_options.length; j++) {
                if (Number(select_options[j].value) > frameRate) {
                    $(select_options[j]).before("<option value='" + frameRate + "'>" + frameRate + "</option>");
                    break;
                }
            }
            $("#" + encodeInfo["streamType"] + "FrameRate").val(frameRate);
           
            // 更新帧率列表
            if (isContainsElement(frameRate, frameRateArr) < 0) {
                for (j = 0; j < frameRateArr.length; j++) {
                    if (Number(frameRateArr[j]) > frameRate) {
                        frameRateArr.splice(j, 0, frameRate);
                        break;
                    }
                }
            }
        }

        if (1 == data["IsEnable"]) {
            encodeInfo["encodeBility"] = getEncodeBility(data["Width"], data["Hight"], data["FrameRate"]);
            streamEnable(i);
            $("#"+encodeInfo["streamType"]+"BitRate").val(data["BitRate"]);

        }
        changeEncodeMode(encodeInfo["streamType"]);
        changeEncodeFmt(encodeInfo["streamType"]);
    }
    var maxPicSize_init = $("#VinMode").val().split("*");
    var frameRate_init = maxPicSize_init[2];
    if(frameRate_init > 30) {
       $("#MainStreamUCCodeMode").val(0);
    }
    if (top.banner.isSupportCapture || top.banner.isSupportIpcCapture) {
        var single_closeUp_picSize;
        if (!LAPI_GetCfgData(LAPI_URL.PicQuality, jsonMap_PicQuality)) {
            disableAll();
            return false;
        }
        jsonMap_PicQuality_bak = objectClone(jsonMap_PicQuality);
        changeMapToMapByMapping(jsonMap_PicQuality, mappingMap_PicQuality, jpegCfgMap, 0);
        jpegCfgMap_bak = objectClone(jpegCfgMap);
        jpegCfgMap["ProcJPEGSize"] /= 1000;
        jpegCfgMap["SyntJPEGSize"] /= 1000;
        jpegCfgMap["JPEGSize"] /= 1000;
        jpegCfgMap["TGSyntJPEGSize"] /= 1000;
        cfgToForm(jpegCfgMap, "JpegStream");
        if (!top.banner.isSupportIpcCapture) {
            syntSld.SetValue(jpegCfgMap["SyntQuality"]);
            procSld.SetValue(jpegCfgMap["ProcQuality"]);
            passVehicleSld.SetValue(jpegCfgMap["TGSyntQuality"]);
        }
        if(IVAMode.ILLEGAL != top.banner.IVAType) {
            single_closeUp_picSize = jpegCfgMap["single_closeUp_width"] + '*' + jpegCfgMap["single_closeUp_height"];//特写图分辨率
            $("#single_closeUp_picSize").val(single_closeUp_picSize);
        }
    }
    if (top.banner.isSupportBNC) {
        LAPI_GetCfgData(LAPI_URL.AnalogoutFormat, AnalogoutFormatMap);
        AnalogoutFormatMap_bak = objectClone(AnalogoutFormatMap);
        $("#AnalogoutFormat").val(AnalogoutFormatMap["AnalogoutFormat"]);
    }
    if (GopTypeArr.length > 0) {
        ChangeMainStreamPicSize();
    }
    enableConfig();
    if(3 == $("#MainStreamEncodeFmt").val()) {
        $("#MainStreamUCCodeMode").attr("disabled",true);
        $("#MainStreamEncodeMode").attr("disabled",true);
    }
}
//定制白牌与宇视版本UCode标签初始化
function initUCodeLang(){
    $(".Ucode").each(function(){
        var $this = $(this);
        if(!parent.isUN){  //非宇视
            $this.html($.lang.pub["UcCode"]);
        }
    });
}

$(document).ready(function () {
    parent.selectItem("videoTab");         // 菜单选中
    beforeDataLoad();
    initPage();

    // 初始化语言标签
    initLang();
    initUCodeLang();
    initEvent();
    initData();
    afterDataLoad();
});
