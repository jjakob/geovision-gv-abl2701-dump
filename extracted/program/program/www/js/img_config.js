// JavaScript Document
GlobalInvoke(window);
// 加载语言文件
loadlanguageFile(top.language);
var channelId = 0;
var loginType = parent.loginType;
var bSpecifiedByInput = false;        // 是否通过文本框来调节参数
var isShowVideo = false;
var currentArea = 1;// 当前测光区域
var ImgMap = {};
var ImgMap_bak={};
var ImgStableJsonMap = {};
var ImgStableJsonMap_bak = {};
var minShutter = 0; // 由制式限定的最小快门值
var shutterType = shutterUnit.reciprocal_s; // 快门单位为1/s
var video = top.banner.video;   // 播放器
var DivLeft = 0;
var $xml = null;
var irCrlModeOptions_bak = "";
var LAPI_Type = "/VideoStable";

var isShowPhoto = "";

var AutoSwitchMap = {};
var SceneMap = {};
var MappingMap_SceneMap = {
    SceneID :["SceneID"],
    SceneType :["SceneType"],
    SceneName : ["SceneName"],
    AutoSwitch : ["AutoSwitch"],
    Priority : ["Priority"]
};
var ScenceArr = [];
var ShutterOption = "";
//dataMap ={apiType:[mapppingMap,jsonData]}
var dataMap = {
    Focus : [{FocusMode :["FocusMode"],
             ManualFocusMinDistance :["ManualFocusMinDistance"],
        FocusScene : ["FocusScene"]},{}],
    WhiteBalance :[{WhiteBalanceMode :["Mode"],
                          WhiteBalanceRedOffset :["RedOffset"],
                          WhiteBalanceBlueOffset :["BlueOffset"]},{}],
    Enhance :[{ Brightness : ["Brightness"],
                      Saturation :["Saturation"],
                      Contrast :["Contrast"],
                      Hue :["Hue"],
                      MirrorMode :["MirrorMode"],
                      SharpnessMode :["SharpnessParam","Mode"],
                      Sharpness :["SharpnessParam","Sharpness"],
                      Denoise2D :["Denoise","2DLevel"],
                      Denoise3D :["Denoise","3DLevel"]
    },{}],
    Exposure :[{ExposureMode :["Mode"],
                ExposureCompensate :["ExpCompensate"],
                ExposureGain :["Gain"],
                ExposureMinGain :["CustomExposure","MinGain"],
                ExposureMaxGain :["CustomExposure","MaxGain"],
                ExposureShutter :["Shutter"],
                ExposureFastShutter :["CustomExposure","FastShutter"],
                ExposureSlowShutter :["CustomExposure","SlowShutter"],
                ExposureIris :["Iris"],
                ExposureMinIris :["CustomExposure","MinIris"],
                ExposureMaxIris :["CustomExposure","MaxIris"],
                EnableSlowShutter :["SlowShutter","Enable"],
                MaxSlowShutter :["SlowShutter","MaxSlowShutter"],
                MeteringMode :["Metering","Mode"],
                ExposureWDRMode :["WDR","Mode"],
                ExposureRatioValue :["WDR","ExpRatio"],
                OnSense:["WDR","OnSense"],
                OffSense:["WDR","OffSense"],
                FlickerSuppression:["WDR","AntiFlicker"],
                DayNightMode :["DayNight","Mode"],
                DayNightSense :["DayNight","Sensitivity"],
                TopLeftX :["Metering","Area","TopLeft","X"],
                TopLeftY :["Metering","Area","TopLeft","Y"],
                BotRightX :["Metering","Area","BotRight","X"],
                BotRightY :["Metering","Area","BotRight","Y"]
    },{}],
    SmartIR :[{IrCtrlEnable :["Enable"],
               IrCtrlMode :["Mode"],
               NearIrLed :["NearIrLed"],
               MiddleIrLed :["MiddleIrLed"],
               FarIrLed :["FarIrLed"],
               LaserAngle :["LaserAngle"]},{}],
    LightMode :[{LightMode :["LightMode"]},{}],
    DeFog :[{DeFogMode :["Mode"],
             DeFogLevel: ["Level"]},{}],
    IRIS :[{IrisMode:["IrisMode"],
        IrisValue: ["IrisValue"],
        LensIfMode : ["LensIfMode"]},{}],
    ImageAdjust : [{ImageAdjustEnable : ["Enable"],
        ImageAdjustLevel : ["Grade"]},{}]
};
var dataMap_bak = {};

var DrawObjMap = {};
var sceneTypeName = {
    0: "custom",                        // 自定义
    1: "scene_indoor",                  // 室内
    2: "scene_outdoor",                 // 室外
    3: "scene_road",                    // 车牌
    4: "scene_starLight",               // 星光
    5: "scene_objective",               // 客观
    6: "scene_yard",                    // 园区
    7: "aeMetering4",                   // 道路强光抑制
    8: "wideDynamic",                   // 宽动态
    9: "scene_standard",                // 标准
    10: "scene_bright",                 // 明亮
    11: "scene_vivid",                  // 艳丽
    12: "park_highlight",                //园区强光抑制
    50: "scene_normal",                 // 普通
    51: "scene_weakBackLighting",       // 弱逆光
    52: "scene_intenseBackLighting",    // 强逆光
    53: "scene_weakFrontLighting",      // 弱顺光
    54: "scene_intenseFrontLighting",   // 强顺光
    55: "scene_objective",              // 客观
    56: "scene_indoor",                 // 室内（卡口）
    57: "scene_normal",                 // 普通
    58: "scene_FPIntegrateLight",       // 频爆一体灯
    80: "scene_front",                  // 正装
    81: "scene_side"                    // 侧装
};
var mappingMap={
    "ImageTypeItem":["Type"]
};


// 滑动条参数列表（map<k,map<k,v>>
var slidersMap ={
    Brightness: {
        sliderId: "BrightnessSld" ,
        barId: "BrightnessBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    Contrast: {
        sliderId:"ContrastSld" ,
        barId: "ContrastBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    Saturation: {
        sliderId:"SaturationSld" ,
        barId: "SaturationBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    Hue: {
        sliderId:"HueSld" ,
        barId: "HueBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    Sharpness: {
        sliderId:"SharpnessSld" ,
        barId: "SharpnessBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    WhiteBalanceRedOffset: {
        sliderId:"ROffsetSld" ,
        barId: "ROffsetBar",
        minValue: -127,
        maxValue: 127,
        sld: null
    },
    WhiteBalanceBlueOffset: {
        sliderId:"BOffsetSld" ,
        barId: "BOffsetBar",
        minValue: -127,
        maxValue: 127,
        sld: null
    },
    Denoise2D: {
        sliderId: "Denoise2DSld" ,
        barId: "Denoise2DBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    Denoise3D: {
        sliderId:"Denoise3DSld" ,
        barId: "Denoise3DBar",
        minValue: 0,
        maxValue: 255,
        sld: null
    },
    ExposureCompensate: {
        sliderId:"ExposureCompensateSld" ,
        barId: "ExposureCompensateBar",
        minValue: -100,
        maxValue: 100,
        sld: null
    },
    ExposureRatioValue: {
        sliderId:"ExposureRatioSld" ,
        barId: "ExposureRatioBar",
        minValue: 1,
        maxValue: 9,
        sld: null
    },
    OnSense: {
        sliderId:"OnSenseSld" ,
        barId: "OnSenseBar",
        minValue: 1,
        maxValue: 9,
        sld: null
    },
    OffSense: {
        sliderId:"OffSenseSld" ,
        barId: "OffSenseBar",
        minValue: 1,
        maxValue: 9,
        sld: null
    },
    DeFogLevel: {
        sliderId:"DeFogLevelSld" ,
        barId: "DeFogLevelBar",
        minValue: 1,
        maxValue: 9,
        sld: null
    },
    ImageAdjustLevel: {
        sliderId:"ImageAdjustLevelSld" ,
        barId: "ImageAdjustLevelBar",
        minValue: 1,
        maxValue: 9,
        sld: null
    },
    LaserAngleText: {
        sliderId:"LaserAngleSld" ,
        barId: "LaserAngleBar",
        minValue: 16,
        maxValue: 636,
        sld: null
    },
    HLCRatio: {
        sliderId:"HLCRatioSld" ,
        barId: "HLCRatioBar",
        minValue: 1,
        maxValue: 9,
        sld: null
    },
    IrisValueAutoManual: {
        sliderId:"IrisValueSld" ,
        barId: "IrisValueBar",
        minValue: 0,
        maxValue: 100,
        sld: null
    }
};
var capMap = {
    "ImageTypeItem": "ImageType",
    "BrightnessItem": "Video Enhance Brightness",
    "SaturationtItem": "Video Enhance Saturation",
    "ContrastItem": "Video Enhance Contrast",
    "HueItem": "Video Enhance Hue",
    "SharpnessModeItem": "Video Enhance Sharpness Mode",
    "Denoise2DItem": "Video Enhance Denoise _2D",
    "Denoise3DItem": "Video Enhance Denoise _3D",
    "MirrorModeItem": "Video Enhance Mirror Mode",
    "ExposureModeItem": "Video Exposure Mode",
    "ExposureShutterItem": "Video Exposure Shutter",
    "ExposureIrisItem": "Video Exposure Iris",
    "ExposureGainItem": "Video Exposure Gain",
    "ExposureCompensateItem": "Video Exposure Compensate",
    "MeteringModeItem": "Video Exposure Metering Mode",
    "DayNightModeItem": "Video Exposure DayNight Mode",
    "DayNightSwitchTimeItem": "Video Exposure DayNight Time",
    "ExposureWDRModeItem": "Video Exposure WDR Mode",    
    "ExposureWDRSensibilityItem": "Video Exposure WDR Sensitivity",
    "IrCtrlEnableItem": "Video LedCtrl LedCtrlEnable",
    "LightModeItem": "Video LedCtrl LightMode Mode",
    "WhiteBalanceModeItem": "Video WhiteBalance Mode",
    "FocusModeItem": "Video Focus Mode",
    "FocusSceneItem": "Video Focus Scenario",
    "ImageFreezeItem": "Video Misc ImageFreeze",
    "DeFogItem": "Video Defog Mode",
    "StableModeItem": "Video EIS ImageEIS Mode",
    "ImageAdjustItem": "Video LDC",
    "IFModeItem" : "Hardware Lens IFMode Mode"
};
top.ImageType = (undefined == top.ImageType)? 0: top.ImageType;
var urlType = Number(top.ImageType) ? "Photo" : "Video";
var cmdMap = {
    Enhance: LAPI_URL.ImageEnhance + "/" + urlType,
    Exposure: LAPI_URL.Exposure + "/" + urlType,
    WhiteBalance: LAPI_URL.WhiteBalance + "/" + urlType ,
    Focus: LAPI_URL.FocusCfg + urlType,

    Misc: CMD_TYPE.IMAGE_MISC_CFG,
    SmartIR: LAPI_URL.IrCtrl + urlType,
    DeFog: LAPI_URL.DefogCfg + urlType,
    EIS: LAPI_URL.ImageStable,
    LightMode: LAPI_URL.LightMode,
    ImageAdjust: LAPI_URL.LDC,
    IRIS: LAPI_URL.LensParam
};

function isContain(list, elem)
{
    for(var i=0,len=list.length; i<len; i++)
    {
        if(elem == list[i])
        {
            return true;
        }
    }
    return false;
}

// 解析功能点
function ResolveItems(id, node)
{
    var newId = id.replace("Item","");
    if("Shutter" == node.tagName)
    {// 快门范围能力解析
        var childNodes = node.childNodes;
        var len = childNodes.length;
        for(var i=0; i<len; i++)
        {
            var childNode = childNodes[i];
            if(1 != childNode.nodeType)continue;
            var capList = $(childNode).text().split(",");
            var tagName = childNode.tagName;
            if(2 == capList.length)
            {
                if(parseInt(capList[0])>parseInt(capList[1]))
                {
                    var temp = capList[0];
                    capList[0] = capList[1];
                    capList[1] = temp;
                }
                if (shutterUnit.reciprocal_s == shutterType) {
                    if ((capList[0] < minShutter) && (capList[1] > minShutter)) {
                        capList[0] = minShutter;
                    }
                } else if (shutterUnit.us == shutterType) {
                    if ((capList[0] < minShutter) && (capList[1] > minShutter)) {
                        capList[1] = minShutter;
                    }
                }
            }
            switch(tagName)
            {
                case "Unit":// 单位处理
                    break;
                case "SlowShutter":// 慢快门
                    newId ="MaxSlowShutter";
                    var arr = $(node).children("Range").text().split(",");
                    capList[0] = Math.min(parseInt(arr[0]), parseInt(arr[1]));
                    capList[1] = minShutter;
                    $("#EnableSlowShutterItem").removeClass("hidden");
                    break;
                case "Range":// 快门范围
                    newId = "ExposureShutter";
                    break;
                case "SlowRange":// 最慢快门范围
                    newId = "ExposureSlowShutter";
                    $("#"+newId).removeClass("hidden");
                    break;
                case "FastRange":// 最快快门范围
                    newId = "ExposureFastShutter";
                    $("#"+newId).removeClass("hidden");
                    break;
            }
            if(capList && capList.length > 1)
            {
                resetOptions(newId, capList, "range");
            }
        }
    }

    else if($(node).children().length > 0)
    {// 其他范围能力集解析
        var childNodes = node.childNodes;
        var len = childNodes.length;
        for(var i=0; i<len; i++)
        {
            var childNode = childNodes[i];
            if(1 != childNode.nodeType)continue;
            var capList = $(childNode).text().split(",");
            if(1 == childNode.nodeType)
            {
                if(childNode.tagName.indexOf("Min")>-1)
                {
                    if("ExposureIrisItem" == id)
                    {
                        newId = "ExposureMinIris";
                    }
                    else if("ExposureGainItem" == id)
                    {
                        newId = "ExposureMinGain";
                    }
                }
                else if(childNode.tagName.indexOf("Max")>-1)
                {
                    if("ExposureIrisItem" == id)
                    {
                        newId = "ExposureMaxIris";
                    }
                    else if("ExposureGainItem" == id)
                    {
                        newId = "ExposureMaxGain";
                    }
                }
                $("#"+newId).removeClass("hidden");
            }
            if(capList && capList.length > 1)
            {
                if ((3 == currentSceneType) && ("ExposureGainItem" == id)) {
                    capList[1] = 48; //车牌场景增益最大为48
                }
                resetOptions(newId, capList, "range");
            }
        }
    }
    else
    {
        // 选项能力集解析
        var capList = $(node).text().split(",");
        switch(id)
        {
            case "SharpnessModeItem":
                if(isContain(capList,"2"))
                {
                    $("#sharpnessSlider").removeClass();
                }
                else
                {
                    $("#sharpnessSlider").addClass("hidden");
                }
                break;
            case "WhiteBalanceModeItem":
                if(isContain(capList,"2"))
                {
                    $("#rSlider").removeClass();
                    $("#bSlider").removeClass();
                }
                else
                {
                    $("#rSlider").addClass("hidden");
                    $("#bSlider").addClass("hidden");
                }
                break;
            case "DayNightModeItem":
                if(isContain(capList,"1"))
                {
                    $("#DayNightSenseSlider").removeClass();
                }
                else
                {
                    $("#DayNightSenseSlider").addClass("hidden");
                }
                break;
            case "StableModeItem":
                if(isContain(capList,"1"))
                {
                    $("#EisFrequency").removeClass();
                }
                else
                {
                    $("#EisFrequency").addClass("hidden");
                }
                break;
            case "ImageTypeItem":
                if(1 == capList.length)
                {
                    $("#ImageTypeItem").addClass("hidden");
                }
                break;
            case "ExposureWDRModeItem":
                if(isContain(capList,"2"))
                {
                    $("#ExposureRatioSlider").removeClass();
                }
                else
                {
                    $("#ExposureRatioSlider").addClass("hidden");
                }
                break;
            case "DeFogItem":
                newId = "DeFogMode";
                if(isContain(capList,"2"))
                {
                    $("#DeFogLevelUL").removeClass("hidden");
                }
                else
                {
                    $("#DeFogLevelUL").addClass("hidden");
                }
                break;
            case "MeteringModeItem":
                newId = "MeteringModeSel";
                break;
            default:
                break;
        }
        if("Mode" == node.tagName || "Scenario" == node.tagName)
        {
            resetOptions(newId, capList, "mode");
        }
    }
}

// 解析选项
function resetOptions(id, list,type)
{
    var optionsArr = [];
    var e = eval("document.frmSetup."+id);

    if ( undefined == e )return;
    if (typeof(e.name)=="undefined")
    {
        if(e[0].type == 'radio')
        {
            if((1 == list.length) && (1 == $("input[name="+id+"][cap='"+list[0]+"']").length))
            {// 界面仅有一个单选按钮时，隐藏该配置项
                var parentNode = $("input[name="+id+"]").parent();
                while( (parentNode[0].tagName) && ("UL" != parentNode[0].tagName))
                {
                    parentNode = parentNode.parent();
                }
                $(parentNode).addClass("hidden");
                return;
            }
            optionsArr = e;
        }
    }
    else if (e.type=='select-one')
    {
        optionsArr = document.getElementById(id).options;
    }
    if("range" == type)
    {
        if(list[0]==list[1])
        {
            e.disabled = true;
        }
        if(optionsArr.length <=0 )
        {
            if(e.type=="text")
            {// 输入框范围
                $(e).attr("minValue", list[0]);
                $(e).attr("maxValue", list[1]);
                if(list[0] != list[1])
                {
                    e.title = $.lang.pub["range"]+list[0]+"-"+list[1];
                    e.maxLength = list[1].toString().length;
                }
            }
            else
            {// 添加选项
                switch(id)
                {
                    case "ExposureIris":
                        var optionsHtml = "";
                        for(var i=0, len=list.length; i<len; i++)
                        {
                            var v = list[i];
                            var str = (v/100).toString();
                            if(str.indexOf(".")<0)
                            {
                                str +=".0";
                            }
                            optionsHtml += "<option value='"+v+"' cap='"+v+"'>F"+str+"</option>";
                        }
                        $("#ExposureIris").html(optionsHtml);
                        $("#ExposureMinIris").html(optionsHtml);
                        $("#ExposureMaxIris").html(optionsHtml);
                        break;
                    default:
                        break;
                }
            }
            return;
        }
        // 起始
        while(parseInt(list[0]) > parseInt($(optionsArr[0]).attr("cap")))
        {
            $(optionsArr[0]).remove();
        }
        // 结束
        var flag = false;
        for(var i=0,len = optionsArr.length; i<len;)
        {
            var option = optionsArr[i];
            if(parseInt(list[1]) < parseInt($(option).attr("cap")))
            {
                flag = true;
            }
            if(flag)
            {
                $(option).remove();
                if (len == optionsArr.length) {
                    i++;
                } else {
                    len = optionsArr.length;
                }
            }
            else
            {
                i++;
            }
        }
    }
    else
    {
        for(var i=0,len = optionsArr.length; i<len; )
        {
            var option = optionsArr[i];
            if((0 != $(option).attr("cap")) && !isContain(list,$(option).attr("cap")))
            {
                if("radio" == option.type)
                {
                    $("label[for='"+option.id+"']").remove();
                }
                $(option).remove();
                
                // 兼容性处理，部分浏览器删除节点后数组中的节点信息仍然存在
                if (len == optionsArr.length) {
                    i++;
                } else {
                    len = optionsArr.length;
                }
            }
            else
            {
                i++;
            }
        }
    }
}

/**
 * 初始化滑动条
 * 
 * @param f
 * @return
 */
function initSlider(){
    for(var textId in slidersMap)
    {
        var sldMap = slidersMap[textId];
        var sld = new Slider(sldMap.sliderId,sldMap.barId, {
            onMove: function(){
                if(!bSpecifiedByInput)
                {
                    var value = Math.round(this.GetValue());
                    if("LaserAngleText" == this.textId) {
                        value = value/10;
                        $("#LaserAngle").val(value*100);
                    }
                    if ("HLCRatio" == this.textId) {
                        $("#MeteringMode").val(value);
                    }
                    $("#"+this.textId).val(value);
                }
            },
            onDragStop: function(){
                    if ("IrisValueAutoManual" == this.textId) {
                        var v = Number($("#IrisValueAutoManual").val()) | Number($("#SmallestIRIS").val()) << 16 | Number($("#BiggestIRIS").val()) << 24;
                        $("#IrisValue").val(v);
                    }
                    submitF($("#"+this.textId).attr("apiType"));
            }
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
function setSliderValue()
{
    for(var n in slidersMap)
    {
        var sld = slidersMap[n]["sld"];
        var v = isNaN(ImgMap[n])? 128: Number(ImgMap[n]);
        if("LaserAngleText" == n){
            var v = isNaN(ImgMap[n])? Number(ImgMap["LaserAngle"] / 100): Number(ImgMap[n]);
            $("#LaserAngleText").val(v);
            if(!$("#LaserAngleItem").hasClass("hidden")){
                $("#LaserAngle").val(v*100);
                v = 10*v;
            }
        }
        bSpecifiedByInput = true;
        sld.SetValue(v);
        bSpecifiedByInput = false;
    }
}

/**
 * 滑动条输入框onchange事件（验证下发）
 * 
 * @param obj
 * @return
 */
function onSliderChanged(obj)
{
    var sldMap = slidersMap[obj.id];
    var flag = ("LaserAngleText" == obj.id);
    if (flag) {
        if (!validPic_Num(obj, sldMap.minValue/10, sldMap.maxValue/10, flag))
        {// 恢复到之前的值
            obj.value = ImgMap[obj.id];
            return;
        }
    } else {
        if (!validPic_Num(obj, sldMap.minValue, sldMap.maxValue))
        {// 恢复到之前的值
            obj.value = ImgMap[obj.id];
            return;
        }
    }
    var value = Number(obj.value); 
    if ("LaserAngleText" == obj.id) {
        value = parseInt(value * 10) / 10; // 将类似3.23改成3.2
        $("#LaserAngleText").val(value);
        $("#LaserAngle").val(value * 10 * 10);  // 解决问题2.3*100=229.99997,2.3*10*10=230
        value = 10*value;
    }
    if ("HLCRatio" == obj.id) {
        $("#MeteringMode").val(value);
    }
    if ("IrisValueAutoManual" == obj.id) {
        var v = Number($("#IrisValueAutoManual").val()) | Number($("#SmallestIRIS").val()) << 16 | Number($("#BiggestIRIS").val()) << 24;
        $("#IrisValue").val(v);
    }
    submitF($(obj).attr("apiType"));
    bSpecifiedByInput = true;
    sldMap["sld"].SetValue(value);
    bSpecifiedByInput = false;
}

// 滑动条灰显/不灰显
function setSliderEnable(TxtId, disabled){
    var SliderId = slidersMap[TxtId]["sliderId"];
    var BarId = slidersMap[TxtId]["barId"];
    if(disabled){
        $("#"+SliderId).removeClass().addClass("slider4");
        $("#"+BarId).removeClass().addClass("bar3 bar4");
    } else {
        $("#"+SliderId).removeClass().addClass("slider3");
        $("#"+BarId).removeClass().addClass("bar3");
    }
    slidersMap[TxtId]["sld"].setEnable(!disabled);
    $("#"+TxtId).attr("disabled", disabled);
}

function submitF(type) {
    var isSetCfgOK = false,
        isChange = false;

    if ("string" == typeof cmdMap[type]) {
        if(LAPI_URL.ImageStable == cmdMap[type]){
            LAPI_FormToCfg("frmSetup",ImgStableJsonMap);
            isChange = !isObjectEquals(ImgStableJsonMap, ImgStableJsonMap_bak);
        }else{
            LAPI_FormToCfg("frmSetup",dataMap[type][1],ImgMap,dataMap[type][0]);
            isChange = !isObjectEquals(ImgMap, dataMap_bak);
        }
        if (!isChange)return;
        if (LAPI_URL.ImageStable == cmdMap[type]) {
            isSetCfgOK = LAPI_SetCfgData(cmdMap[type] + LAPI_Type, ImgStableJsonMap);
            if(isSetCfgOK){
                ImgStableJsonMap_bak = objectClone(ImgStableJsonMap);
            }
        } else {
            isSetCfgOK = LAPI_SetCfgData(cmdMap[type], dataMap[type][1]);
            if(isSetCfgOK){
                dataMap_bak = objectClone(ImgMap);
            }
        }
        
    } else {
        if (!IsChanged("frmSetup", ImgMap))return;
        isSetCfgOK = setCfgData(channelId, cmdMap[type], "frmSetup", ImgMap);
    }

    if (!isSetCfgOK) {
        resetForm();
    }else{
        isDeleteExposureShutterOptions();
    }
    return isSetCfgOK;
}

// 镜头接口模式切换事件
function LensIfMode_change() {
    PIRISMode_onclick();
}

// 光圈模式点击事件
function PIRISMode_onclick() {
    if(top.banner.isSupportLenIfMode && 0 < $("#LensIfMode").val()) {     //Z/F或者DC-IRIS
        $("#PIRISItem").addClass("hidden");
        $("#ManualIrisValue").addClass("hidden");
        $("#ManualDefaultValue").addClass("hidden");       
        $("#rangeIRIS").addClass("hidden"); 
        $("#SmallestIRIS").attr("disabled", true);
        $("#BiggestIRIS").attr("disabled", true);
    } else {
        if (top.banner.isSupportPIRIS > 0 && 0 == top.ImageType) {
            $("#PIRISItem").removeClass("hidden");
        }
    }
    if(0 == $("#IrisMode").val()) {
        $("#ManualIrisValue").addClass("hidden");
        $("#ManualDefaultValue").addClass("hidden");       
        $("#rangeIRIS").addClass("hidden"); 
        $("#SmallestIRIS").attr("disabled", true);
        $("#BiggestIRIS").attr("disabled", true);
    } else if(1 == $("#IrisMode").val()) {
        $("#ManualIrisValue").removeClass("hidden");
        $("#ManualDefaultValue").removeClass("hidden");
        $("#rangeIRIS").addClass("hidden"); 
        bSpecifiedByInput = true;
        slidersMap["IrisValueAutoManual"]["sld"].SetValue(parseInt($("#IrisValueAutoManual").val()));
        bSpecifiedByInput = false;
    } else {
        $("#ManualIrisValue").addClass("hidden");
        $("#ManualDefaultValue").addClass("hidden");
        $("#rangeIRIS").removeClass("hidden"); 
        $("#SmallestIRIS").attr("disabled", false);
        $("#BiggestIRIS").attr("disabled", false);
    }
}

// 锐度模式点击事件
function SharpnessMode_onclick()
{
    var bool = (1 != $("input[name='SharpnessMode']:checked").val());
    setSliderEnable("Sharpness", bool);
}

// 昼夜模式点击事件
function DayNightMode_onclick()
{
    var bool = (0 != $("input[name='DayNightMode']:checked").val());
    $("#DayNightSenseValue").attr("disabled", bool);
    $("#DayNightSwitchTime").attr("disabled", bool);
}

// 白平衡点击事件
function WhiteStandoff_change()
{
    var v = $("#WhiteBalanceMode").val();
    var bool = ((1 != v) && (5 != v) && (8 != v));
    if(!bool)
    {// 获取R,B值
        var tmpMap = {},WhiteBalanceMap ={};
        var flag = LAPI_GetCfgData(cmdMap["WhiteBalance"], WhiteBalanceMap);
        tmpMap["WhiteBalanceRedOffset"] = WhiteBalanceMap["RedOffset"];
        tmpMap["WhiteBalanceBlueOffset"] = WhiteBalanceMap["BlueOffset"];
        if(flag)
        {
            $("#WhiteBalanceRedOffset").val(parseInt(tmpMap["WhiteBalanceRedOffset"]));
            $("#WhiteBalanceBlueOffset").val(parseInt(tmpMap["WhiteBalanceBlueOffset"]));
            bSpecifiedByInput = true;
            slidersMap["WhiteBalanceRedOffset"]["sld"].SetValue(parseInt(tmpMap["WhiteBalanceRedOffset"]));

            slidersMap["WhiteBalanceBlueOffset"]["sld"].SetValue(parseInt(tmpMap["WhiteBalanceBlueOffset"]));
            bSpecifiedByInput = false;
        }
    }
    setSliderEnable("WhiteBalanceRedOffset", bool);
    setSliderEnable("WhiteBalanceBlueOffset", bool);
}

// 区间控件的显示隐藏
function rangeStyleChange(bool)
{
    if($("#ExposureSlowShutter").hasClass("hidden") &&
       $("#ExposureFastShutter").hasClass("hidden"))
    {
        $("#ExposureShutter").disableSelectbox(bool);
    }
    else
    {
        if(bool)
        {
            $("#ExposureShutter").hideSelectbox();
            $("#rangeShutter").removeClass("hidden");
        }
        else
        {
            $("#ExposureShutter").showSelectbox();
            $("#rangeShutter").addClass("hidden");
        }
    }

    if($("#ExposureMinIris").hasClass("hidden") &&
       $("#ExposureMaxIris").hasClass("hidden"))
    {
        $("#ExposureIris").disableSelectbox(bool);
    }
    else
    {
        if(bool)
        {
            $("#ExposureIris").hideSelectbox();
            $("#rangeIris").removeClass("hidden");
        }
        else
        {
            $("#ExposureIris").showSelectbox();
            $("#rangeIris").addClass("hidden");
        }
    }

    if($("#ExposureMinGain").hasClass("hidden") &&
       $("#ExposureMaxGain").hasClass("hidden"))
    {
        $("#ExposureGain").attr("disabled", bool);
    }
    else
    {
        if(bool)
        {
            $("#ExposureGain").addClass("hidden");
            $("#rangeGain").removeClass("hidden");
        }
        else
        {
            $("#ExposureGain").removeClass("hidden");
            $("#rangeGain").addClass("hidden");
        }
    }
}

// 曝光模式约束
function exposal_changePage()
{
    var valExposal = parseInt($("#ExposureMode").val());

    // 自定义曝光时控件的隐藏显示
    var bool = (1 == valExposal);
    rangeStyleChange(bool);

    // 手动模式对曝光补偿，测光区域，宽动态的影响
    bool = (7==valExposal);
    
    setSliderEnable("ExposureCompensate", bool);
    $("#MeteringModeSel").disableSelectbox(bool);
    setMeteringArea();
    
    // 自动曝光、自定义曝光、快门优先、50HZ、60HZ、低拖影对宽动态的影响 || 透雾开启也要灰显宽动态
    bool = (0 != valExposal && 1 != valExposal && 2 != valExposal && 5 != valExposal && 6 != valExposal && 8 != valExposal) || ($("#DeFogMode").val() != 0);
    $("#ExposureWDRMode").disableSelectbox(bool);
    if (!bool) {
        DWRMode_change();
    } else {
        setSliderEnable("ExposureRatioValue", bool);
        setSliderEnable("OnSense", bool);
        setSliderEnable("OffSense", bool);
    }
    
    // 光圈优先对慢快门的影响
    bool = (3 == valExposal);
    $("input[name='EnableSlowShutter']").attr("disabled", bool);
    bool = bool || (0 == $("input[name='EnableSlowShutter']:checked").val());// 慢快门是否使能
    $("#MaxSlowShutter").disableSelectbox(bool);
    
    // 快门优先，手动曝光和低拖影对快门的影响
    if(1 == $("#sDiv").length && (2 == valExposal || 7 == valExposal || 8 == valExposal)) {
        ExposureShutterType();
        if (8 == valExposal) {
            resetOptions("ExposureShutter", [Math.max(minShutter, 50), 250], "range");
        } else {
            if(!$("#EnableSlowShutterItem").hasClass("hidden")){
                enableMaxSlowShutter();
            }else{
                ResolveItems("ExposureShutterItem", $xml.find(capMap["ExposureShutterItem"])[0]);
            }
        }
    }
    
    switch(valExposal)
    {
        case 0:
        case 5:
        case 6:
            $("#ExposureShutter").disableSelectbox(true);
            $("#ExposureIris").disableSelectbox(true);
            $("#ExposureGain").attr("disabled", true);
            break;
        case 1:
            setSliderEnable("ExposureCompensate", false);
            $("#MeteringModeSel").disableSelectbox(false);
            break;
        case 2:
        case 8:
            $("#ExposureShutter").disableSelectbox(false);
            $("#ExposureIris").disableSelectbox(true);
            $("#ExposureGain").attr("disabled", true);
            break;
        case 3:
            $("#ExposureShutter").disableSelectbox(true);
            $("#ExposureIris").disableSelectbox(false); 
            $("#ExposureGain").attr("disabled", true);
            break;
        case 4:
            $("#ExposureShutter").disableSelectbox(true);
            $("#ExposureIris").disableSelectbox(true); 
            $("#ExposureGain").attr("disabled", false);
            break;
        case 7:
            $("#ExposureShutter").disableSelectbox(false);
            $("#ExposureIris").disableSelectbox(false);
            $("#ExposureGain").attr("disabled", false);
            break;
        default:
            break;
    }
}

// 宽动态点击事件
function DWRMode_change()
{
    var v = $("#ExposureWDRMode").val();
    setSliderEnable("ExposureRatioValue", (0 == v)); // 关闭时灰显
    setSliderEnable("OnSense", (2 != v));
    setSliderEnable("OffSense", (2 != v));

    //兼容性处理,如果透雾、宽动态两个都开启，则将宽动态设置为0
    if ((0 != $("#DeFogMode").val()) && (0 != $("#ExposureWDRMode").val())) {
        $("#ExposureWDRMode").get(0).selectedIndex = 0;
        $("#ExposureWDRMode").change();
    }

    $("#DeFogMode").attr("disabled",($("#ExposureWDRMode").val() != 0));

}

//畸变矫正使能点击事件
function imageAdjust_change()
{
    var v = $("input[name='ImageAdjustEnable']:checked").val();
    setSliderEnable("ImageAdjustLevel", (0 == v));
}

function enableMaxSlowShutter()
{
    var v= $("input[name='EnableSlowShutter']:checked").val();
    $("#MaxSlowShutter").attr("disabled", (0 == v));
    var valExposal = parseInt($("#ExposureMode").val());
    if(8 == valExposal)return;
    if(1 == v)
    {// 使能慢快门
        MaxSlowShutter_change();
    }
    else
    {// 不使能慢快门，则恢复快门范围
        var $ExposureShutter = $("#ExposureShutter");
        var $ExposureSlowShutter = $("#ExposureSlowShutter");
        var $ExposureFastShutter = $("#ExposureFastShutter");
        if(shutterUnit.reciprocal_s == shutterType)
        {
            for(;minShutter > $ExposureShutter.find("option").first().val();)
            {
                $ExposureShutter.find("option").first().remove();
            }
            for(;minShutter > $ExposureSlowShutter.find("option").first().val();)
            {
                $ExposureSlowShutter.find("option").first().remove();
            }
            for(;minShutter > $ExposureFastShutter.find("option").first().val();)
            {
                $ExposureFastShutter.find("option").first().remove();
            }
        }
        else
        {
            $ExposureShutter.attr("minValue", minShutter);
            var title = $ExposureShutter.attr("title");
            title = minShutter+"-"+title.split("-")[1];
            $ExposureShutter.attr("title", title);
            $ExposureSlowShutter.attr("minValue", minShutter);
            var title = $ExposureSlowShutter.attr("title");
            title = minShutter+"-"+title.split("-")[1];
            $ExposureSlowShutter.attr("title", title);
            $ExposureFastShutter.attr("minValue", minShutter);
            var title = $ExposureFastShutter.attr("title");
            title = minShutter+"-"+title.split("-")[1];
            $ExposureFastShutter.attr("title", title);
        }
    }
}

// 最慢快门change事件
function MaxSlowShutter_change()
{
    var $MaxSlowShutter = $("#MaxSlowShutter");
    var v = $MaxSlowShutter.val();
    var $ExposureShutter = $("#ExposureShutter");
    var $ExposureSlowShutter = $("#ExposureSlowShutter");
    var $ExposureFastShutter = $("#ExposureFastShutter");
    var valExposal = parseInt($("#ExposureMode").val());
    if(8 == valExposal)return;
    if(shutterUnit.reciprocal_s == shutterType)
    {
        var optionHtml = "";
        var option = $MaxSlowShutter.find("option[value='"+v+"']");
        while(option.next().length)
        {
            optionHtml +="<option value='"+option.val()+"' cap='"+option.val()+"'>"+option.text()+"</option>";
            option = option.next();
        }
        for(;minShutter > $ExposureShutter.find("option").first().val();)
        {
            $ExposureShutter.find("option").first().remove();
        }
        for(;minShutter > $ExposureSlowShutter.find("option").first().val();)
        {
            $ExposureSlowShutter.find("option").first().remove();
        }
        for(;minShutter > $ExposureFastShutter.find("option").first().val();)
        {
            $ExposureFastShutter.find("option").first().remove();
        }
        $ExposureShutter.find("option").first().before(optionHtml);
        if(parseInt($ExposureShutter.find("option").first().val()) > parseInt(ImgMap["ExposureShutter"])) {
            ImgMap["ExposureShutter"] = $ExposureShutter.find("option").first().val();
        }
        $ExposureShutter.val(ImgMap["ExposureShutter"]);
        $ExposureSlowShutter.find("option").first().before(optionHtml);
        $ExposureSlowShutter.val(ImgMap["ExposureSlowShutter"]);
        $ExposureFastShutter.find("option").first().before(optionHtml);
        $ExposureFastShutter.val(ImgMap["ExposureFastShutter"]);
    }
    else
    {
        $ExposureShutter.attr("minValue", v);
        var title = $ExposureShutter.attr("title");
        title = v+"-"+title.split("-")[1];
        $ExposureShutter.attr("title", title);
        if($ExposureShutter.val()<v)
        {
            $ExposureShutter.val(v);
        }
        $ExposureSlowShutter.attr("minValue", v);
        var title = $ExposureSlowShutter.attr("title");
        title = v+"-"+title.split("-")[1];
        $ExposureSlowShutter.attr("title", title);
        if($ExposureSlowShutter.val()<v)
        {
            $ExposureSlowShutter.val(v);
        }
        $ExposureFastShutter.attr("minValue", v);
        var title = $ExposureFastShutter.attr("title");
        title = v+"-"+title.split("-")[1];
        $ExposureFastShutter.attr("title", title);
        if($ExposureFastShutter.val()<v)
        {
            $ExposureFastShutter.val(v);
        }
    }
}

// 红外控制变化事件
function IrCtrlMode_change()
{
    var v = $("#IrCtrlMode").val();
    var bool = (3 != v && 7 != v);
    $("#NearIrLed").attr("disabled", bool);
    $("#MiddleIrLed").attr("disabled", bool);
    $("#FarIrLed").attr("disabled", bool);
    $("#Far2IrLed").attr("disabled", bool);
    setSliderEnable("LaserAngleText", bool);
    
    // 存在光敏自动时有特殊约束
    var capList = $xml.find("Image Video IrCtrl Mode").text().split(",");
    if (isContain(capList, "6")) {
        if (5 == v) {    // 补光设置为光敏自动时，昼夜模式为自动并灰显
            $("#BlackWhiteMode_Auto").attr("checked", true);
        } else if (3 == v || 7 == v) {    // 补光设置为手动时，昼夜模式为彩色并灰显自动
            $("#BlackWhiteMode_Auto").attr("disabled", true);
            $("#BlackWhiteMode_Color").attr("checked", true);
        }
    }
}

// 解析智能补光能力
function parserIrItem(){
    var v = Number($("#LightMode").val()),
        defaultValue,
        modeArr,
        capRangeList=[0,1000],
        lightType = {0: "NoneLedCtrl", 1: "WhiteCtrl", 2: "IrCtrl", 3: "LaserCtrl", 100: "GunIrCtrl"},
        ledLevelArr = ["NearIrLed", "MiddleIrLed", "FarIrLed", "Far2IrLed"],
        nodePath = "Video LedCtrl " + lightType[v],
        $ledNum,
        ledNum,
        i;

    modeArr = $xml.find(nodePath + " Mode").text().split(",");
    defaultValue = $xml.find(nodePath + " DefaultMode").text();
    $ledNum = $xml.find(nodePath + " LedNum");
    ledNum = (0 < $ledNum.length) ? Number($ledNum.text()): 0;

    // 恢复解析前的初始状态
    $("#NearIrLedItem").addClass("hidden");
    $("#NearIrLedItem").children().first().text($.lang.pub["nearIrLed"]);
    $("#MiddleIrLedItem").addClass("hidden");
    $("#MiddleIrLedItem").children().first().text($.lang.pub["middleIrLed"]);
    $("#FarIrLedItem").addClass("hidden");
    $("#FarIrLedItem").children().first().text($.lang.pub["farIrLed"]);
    $("#LaserAngleItem").addClass("hidden");
    $("#Far2IrLedItem").addClass("hidden");
    $("#Far2IrLedItem").children().first().text($.lang.pub["far2IrLed"]);
    
    for (i = 0; i < 4; i++) {//对智能补光不同级别的光灯进行遍历
        var $ledLevel = $xml.find(nodePath + " LedLevel" + i + " Range");
        if($ledLevel.length > 0) {
            $("#" + ledLevelArr[i] + "Item").removeClass("hidden");
            capRangeList = $ledLevel.text().split(",");
            parseCapOptions(ledLevelArr[i], capRangeList, "range");
        }
    }

    if (3 == v) {//激光灯下的能力解析,激光灯复用远光灯
        $("#FarIrLedItem").children().first().text($.lang.pub["laserLed"]);
        if ($xml.find(nodePath + " LaserAnger").length > 0) {
            $("#LaserAngleItem").removeClass("hidden");
            capRangeList = $xml.find(nodePath + " LaserAnger Range").text().split(",");
            slidersMap["LaserAngleText"]["minValue"] = Number(capRangeList[0])/10;
            slidersMap["LaserAngleText"]["maxValue"] =  Number(capRangeList[1])/10;
            slidersMap["LaserAngleText"]["sld"].MinValue =  Number(capRangeList[0])/10;
            slidersMap["LaserAngleText"]["sld"].MaxValue =  Number(capRangeList[1])/10;
            setSliderValue();
        }
    } else if (1 == ledNum) {
        // 仅一个灯时显示“补光灯” 2015-5-14新增条件：并且非激光灯
        $("ul[id$='IrLedItem'][class!='hidden']").children().first().text($.lang.pub["irLed"]);
     } else {
        if (!($("#FarIrLedItem").hasClass("hidden")) && !($("#Far2IrLedItem").hasClass("hidden"))) {
            $("#farIrLedLI").text($.lang.pub["far1IrLed"]);
        } else if(!($("#Far2IrLedItem").hasClass("hidden"))) {
            $("#far2IrLedLI").text($.lang.pub["farIrLed"]);
        }
    }

    // 解析控制模式
    $("#IrCtrlMode").html(irCrlModeOptions_bak);
    parseCapOptions("IrCtrlMode", modeArr, "mode");
    $("#IrCtrlMode").val(defaultValue - 1); // 能力值与枚举值差1
    initLang();
}

// 补光模式变化事件
function lightMode_change() {
    var v = $("#LightMode").val(),
        bool = (0 == v);
    
    if (!$("#IrCtrlModeItem").hasClass("hidden")) {
        $("#IrCtrlMode").attr("disabled", bool);
        if (bool) {
            $("#NearIrLed").attr("disabled", bool);
            $("#MiddleIrLed").attr("disabled", bool);
            $("#FarIrLed").attr("disabled", bool);
            $("#Far2IrLed").attr("disabled", bool);
            $("input[name='DayNightMode']").attr("disabled", !bool);
            DayNightMode_onclick();
        } else {
            IrCtrlMode_change();
        }
    }
}

function getImageDevCap() {
    
    var xmlDom = loadXML("device_cap.xml");
    if (!xmlDom) return;  
    $xml = $(xmlDom);
    
}

//动态加载快门时间类型
function ExposureShutterType(){
    var shutter = $("#ExposureShutter").val();
    if ( $("#ExposureShutter option").length > 0) {
        $("#ExposureShutter").empty();
        $("#ExposureShutter").append(ShutterOption);
         // IE9兼容性处理
        if ( $("#ExposureShutter option[value='" + shutter + "']").length > 0) {
            $("#ExposureShutter").val(shutter);
        } else  {
            $("#ExposureShutter option").first().attr("selected", "selected");
        }
    } else {
        if (shutter >= $("#ExposureShutter").attr("min") && shutter <= $("#ExposureShutter").attr("max")) {
            $("#ExposureShutter").val(shutter);
        } else  {
            $("#ExposureShutter").val($("#ExposureShutter").attr("min"));
        }
    }
}

// 布局页面
function initPage()
{
    var videoType = "Video";

    if (top.banner.sceneCapArr.length > 0) {
        $("#sceneForm").removeClass("hidden");
    }
    if(top.banner.isSupport3DdenoiseTip) {
        $("#denoise3DInfo").removeClass("hidden");
    }
    if (!top.banner.isRefactor) {
        $("#db").removeClass("hidden");
    }
    if(top.banner.isSupportPIRIS) {
        parseCapOptions("IrisMode", top.banner.IrisModeArr, "mode");
    }
    resetVideoSize(StreamType.LIVE, "recordManager_div_activeX");

    if (top.banner.isSupportPlumbAngle) {
        $("#plumbAngleDiv").removeClass("hidden");
        $("td").filter(".hidden_td").removeClass("hidden");
        $("col").filter(".planIlluminationCol").attr("width", "150px");
        $("col").filter(".plumbAngleCol").removeAttr("width");
    }
    
    if (top.banner.isSupportNoAuto) {
        $("#SimpleSceneDiv").removeClass("hidden");
        var sceneTypeOption = "";
        for(var i=0; i<top.banner.sceneCapArr.length; i++)
        {
            var capInfo = top.banner.sceneCapArr[i];
            // 简易场景中室外对应IPC通用
            if (2 == capInfo) {
                sceneTypeOption += "<option value='"+i+"' >"+$.lang.pub["whiteStandoff8"]+"</option>";
            } else {
                sceneTypeOption += "<option value='"+i+"' >"+$.lang.pub[sceneTypeName[capInfo]]+"</option>";
            }
        }
        $("#SimpleScene").empty();
        $("#SimpleScene").append(sceneTypeOption);
        
    } else if(top.banner.sceneCapArr.length > 0) {
        $("#sceneTbl").removeClass("hidden");
        $("#enableAutoChange").removeClass("hidden");
    }

    
    // 保持红外控制原始选项
    irCrlModeOptions_bak = $("#IrCtrlMode").html();
    
    // 记录快门选项的初始选项
    ShutterOption = $("select[id='ExposureShutter']").html();
    getImageDevCap();
    // 能力集布局
    if (1 == $("input[name='ImageType']:checked").val()) {
        videoType = "Capture"
    }

    if ($xml.find("Image " + videoType + " Exposure Shutter Unit").length > 0) {
        shutterType = $xml.find("Image " + videoType + " Exposure Shutter Unit").text();
        if (shutterUnit.us == shutterType) {
            minShutter = 1000000/minShutter;
            $("#sDiv").remove();
            $("#sUnit").remove();
            $("#sMaxSlowDiv").remove();
            $("#shutTimeLi").html($.lang.pub["shutTimeMs"]);
        } else {
            $("#usDiv").remove();
            $("#usUnit").remove();
            $("#usMaxSlowDiv").remove();
            $("#shutTimeLi").html($.lang.pub["shutTimeSecs"]);
        }
    }
    // 显示界面
    for(var n in capMap)
    {
        var path = capMap[n].replace("Video", videoType);
        
        if ($xml.find(path).length > 0) {
            $(document.getElementById(n)).removeClass("hidden");
            if (("ImageFreezeItem" == n) || ("ImageAdjustItem" == n)) {
                continue;
            }
            ResolveItems(n, $xml.find(path)[0]);
        } else {
            $(document.getElementById(n)).addClass("hidden");
        }
    }
    if("1" == isShowPhoto) {
        $("#ImageTypeItem").addClass("hidden");
    }
    if (top.banner.isNOSensitivity) {
        $("#DayNightSenseSlider").addClass("hidden");
    }
    if (!$("#LightModeItem").hasClass("hidden")) {
        $("#IrCtrlModeItem").removeClass("hidden");
    }
    var $ExposureSlowShutter = $("#ExposureSlowShutter");
    var $ExposureFastShutter = $("#ExposureFastShutter");
    var shuterLabelDiaplay = ($ExposureSlowShutter.hasClass("hidden") || $ExposureFastShutter.hasClass("hidden"));
    var $ExposureMinIris = $("#ExposureMinIris");
    var $ExposureMaxIris = $("#ExposureMaxIris");
    var irisLabelDiaplay = ($ExposureMinIris.hasClass("hidden") || $ExposureMaxIris.hasClass("hidden"));
    var $ExposureMinGain = $("#ExposureMinGain");
    var $ExposureMaxGain = $("#ExposureMaxGain");
    var gainLabelDiaplay = ($ExposureMinGain.hasClass("hidden") || $ExposureMaxGain.hasClass("hidden"));
      if(shuterLabelDiaplay)
      {
          $("#shutterLabel").addClass("hidden");
          $ExposureSlowShutter.removeClass("shortText2").addClass("nomalTxt");
          $ExposureFastShutter.removeClass("shortText2").addClass("nomalTxt");
      }
      if(irisLabelDiaplay)
      {
          $("#irisLabel").addClass("hidden");
          $ExposureMinIris.removeClass("shortText2").addClass("nomalTxt");
          $ExposureMaxIris.removeClass("shortText2").addClass("nomalTxt");
      }
      if(gainLabelDiaplay)
      {
          $("#gainLabel").addClass("hidden");
          $ExposureMinGain.removeClass("shortText2").addClass("nomalTxt");
          $ExposureMaxGain.removeClass("shortText2").addClass("nomalTxt");
      }
      if(!($("#LaserAngleItem").hasClass("hidden")))
      {
          $("#farIrLedLI").html($.lang.pub["laserLed"]);
      }
    
    if (top.banner.isSupportLenIfMode) {
        $("#lensModeUL").removeClass("hidden");
        if (0 == $xml.find(capMap["IFModeItem"]).length) {
            $("#LensIfMode_dciris").remove();
        } else {
            parseCapOptions("LensIfMode", $xml.find(capMap["IFModeItem"]).text().split(","), "mode");
        }
    }
    if (top.banner.isSupportPIRIS > 0 && 0 == top.ImageType) {
        $("#PIRISItem").removeClass("hidden");
    }
    // 排版
    $("fieldset[id]").each(
        function(){
            // 获取某个fieldset下可见的ul对象
            var items = [];
            
            $("#"+this.id+" ul").each(function(){
                 if($(this).hasClass("hidden") || 
                    ($(this).parent().hasClass("unit") && $(this).parent().hasClass("hidden")))
                 {
                     return;
                 }
                 items.push(this);
            });
            var len = Math.round(items.length/2);
            if(len == 0)
            {
                $(this).addClass("hidden");
            }
            // 不是直接跳转到图像设置界面
            if(7 != parent.menuType)
            {
                for(var i=0; i<len; i++)
                {
                    var item = items[i];
                    var parentNode = item.parentNode;
                    if(("DIV" == parentNode.nodeName) && $(parentNode).hasClass("unit"))
                    {
                        item = parentNode;
                    }
                    $(item).addClass("newLine");
                }
            }
        }
    );

    // 直接跳转图像设置界面时的样式
    if(7 == parent.menuType)
    {
        $("#renderBar").addClass("hidden");
        $("#frmSetup").css("width","490px");
        $("div.div_content").css("width","auto");
        $("Div[class='left_Content']").removeClass("left_Content").addClass("hidden");
        $("Div[class='right_Content']").removeClass("right_Content");
        $("Div[class='right_Content_Content']").removeClass("right_Content_Content");
        $("#resetDiv").css("margin", "0px");
        $("#sceneInfoDiv").css("minWidth", "470px");
        $("#conditionInfoDiv").css("minWidth", "470px");
        $("#sceneTbl").css("min-width","490px");
        $("#MeteringModeItem").addClass("hidden");
        $(".autoChangeCol").css("width", "95px");
        $(".unit").css("width", "480px");
        $("ul").css("width", "480px");
        $(".slider3").css("width", "120px");
        $(".slider4").css("width", "120px");
        $("select").css("width", "160px");
        $(".nomalTxt").css("width", "160px");
        $(".shortText2").css("width", "80px");
    }
}

function changeImageType()
{
    top.ImageType = $("input[name='ImageType']:checked").val();
    isShowVideo = true;
    window.location.reload();
}

/** ******************************* 上报事件 start *************************** */
// 坐标上报事件
function eventDrawObjParam(type, num, strParam) {
    var posMap = {},
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
        paramMap[n] = Number(posMap[n]);
    }
    
    $("#TopLeftX").val(Math.round(paramMap["Left"]/100));
    $("#TopLeftY").val(Math.round(paramMap["Top"]/100));
    $("#BotRightX").val(Math.round(paramMap["Right"]/100));
    $("#BotRightY").val(Math.round(paramMap["Bottom"]/100));
    submitF("Exposure");
}

 // 选中上报事件
function eventSelDrawObj(type, num)
{
    selectDrawObj(type, num);
}
/** ******************************* 上报事件 end *************************** */

function initAreaDrawObjData()
{
    var drawObjParam = {};
    
    DrawObjMap = {};
    DrawObjMap[DrawType.RECT] = [];
    
    drawObjParam["Left"] = Number(ImgMap["TopLeftX"]) * 100;
    drawObjParam["Top"] = Number(ImgMap["TopLeftY"]) * 100;
    drawObjParam["Right"] = Number(ImgMap["BotRightX"]) * 100;
    drawObjParam["Bottom"] = Number(ImgMap["BotRightY"]) * 100;
    drawObjParam["LineColor"] = getDrawObjColor("00FF00");
    drawObjParam["LineWidth"] = 2;
    DrawObjMap[DrawType.RECT].push(drawObjParam);
    initDrawObj(DrawObjMap, setMeteringArea);
}

// 恢复默认参数
function restoreDefaultParam()
{
    if (confirm($.lang.tip["tipResDefaultParam"]))
    {
        var imageType = Number($("input[name='ImageType']:checked").val());
        var tmpJsonMap = {
            Type: imageType
        };
        if (LAPI_SetCfgData(LAPI_URL.ImageParamReset, tmpJsonMap)) {
            initData();
            initAreaDrawObjData();
        }
        else
        {
            alert($.lang.tip["tipResDefParamFailed"]);
        }
     }
}

function setRenderScale()
{
    video.setRenderScale(StreamType.LIVE, 0);
}

// 显示/隐藏实况控件上的测光区域
function setMeteringArea()
{
    var isShow = 0;
    var v = $("#MeteringModeSel").val();
    if((!$("#PlanEnable").is(":checked")) &&
        (!$("#MeteringModeItem").hasClass("hidden")) &&
        (!$("#MeteringModeSel").attr("disabled")) && 
        (1 == v || 5  == v))
    {// 显示测光区域
        isShow = 1;
    }
    showHiddenArea(DrawType.RECT, 0, isShow);
    if (1 == isShow) {
        selectDrawObj(DrawType.RECT, 0);
    }
}


// 输入框验证下发
function setInputValue(obj)
{
    if(validPic_Num(obj, parseInt($(obj).attr("minValue")), parseInt($(obj).attr("maxValue"))))
    {
        if(obj.id.indexOf("Shutter")>-1 &&　!validateRange(obj.id,'shutter'))return false;
        if(obj.id.indexOf("Gain")>-1 && !validateRange(obj.id,'gain'))return false;
        if(obj.id.indexOf("IRIS")>-1 && !validateRange(obj.id,'IRIS'))return false;
        
        if ("DayNightSwitchTime" == obj.id) {
            var v = (Number($(obj).val()) << 16) | Number($("#DayNightSenseValue").val());
            $("#DayNightSense").val(v);
        } else if ("Far2IrLed" == obj.id) {
            $("#LaserAngle").val($("#Far2IrLed").val());
        }
        
        if ("SmallestIRIS" == obj.id || "BiggestIRIS" == obj.id ) {
            var v = Number($("#IrisValueAutoManual").val()) | Number($("#SmallestIRIS").val()) << 16 | Number($("#BiggestIRIS").val()) << 24;
            $("#IrisValue").val(v);
        }
        return submitF($(obj).attr("apiType"));
    }
    else
    {
        obj.value = (undefined == ImgMap[obj.id])? parseInt(obj.minValue): ImgMap[obj.id];
        return false;
    }
}

// 灰显界面
function disablePage()
{
    disableAll();
    for(var textId in slidersMap)
    {
        setSliderEnable(textId, true);
    }
}

/**
 * 控件注销
 * 
 * @return
 */
function release(){
    if(!isShowVideo)
    {
        EnableDrawFun(StreamType.LIVE, 0);
        top.ImageType = 0;
        parent.hiddenVideo();
    }
}

/**
 * 界面初始化
 * 
 * @return
 */
function initData()
{
    initSlider();
    var i = 0,
        len = 0,
        jsonMap = {},
        isGetDataOK = true,
        imageType = $("input[name='ImageType']:checked").val(),
        idList_close = ["div_content_exposure","div_content_smartir","div_content_focus","div_content_whitebalance","div_content_misc"],
        idList_getData = ["div_content_enhance","div_content_exposure","div_content_smartir","LightMode"];
    
    // 折叠起来
    for (len=idList_close.length; i<len; i++) {
       $("#"+idList_close[i]).addClass("hidden");
       $("#"+idList_close[i]).parent().addClass("close");
       $("#"+idList_close[i]).attr("flag", 0);
    }
    
    // 获取参数
    for (i=0, len=idList_getData.length; i<len; i++) {
       var cmd = $("#"+idList_getData[i]).attr("apiType");
       if(!LAPI_GetCfgData(cmdMap[cmd], dataMap[cmd][1]))
       {
            isGetDataOK = false;
            break;
       }
        $("#"+idList_getData[i]).attr("flag", 1);
        LAPI_CfgToForm("frmSetup",dataMap[cmd][1],ImgMap,dataMap[cmd][0]);
    }
    //宽动态与透雾互斥，需要获取透雾与宽动态信息
    if (isGetDataOK && !$("#DeFogItem").hasClass("hidden")) {
        isGetDataOK = LAPI_GetCfgData(cmdMap["DeFog"], dataMap["DeFog"][1]);
        if (isGetDataOK) {
            LAPI_CfgToForm("frmSetup",dataMap["DeFog"][1],ImgMap,dataMap["DeFog"][0]);
        }
    }

    if ($("#sceneForm").is(":visible")) {

        if(isGetDataOK)
        {
            isGetDataOK = getPlanStatus();
        }
        if(isGetDataOK)
        {
            isGetDataOK = getCurrentSceneType();
        }

        if (isGetDataOK && top.banner.isSupportNoAuto) {
            var tmpMap = {};
            isGetDataOK = LAPI_GetCfgData(LAPI_URL.CurrentScene, tmpMap);
            if(isGetDataOK)
            {
                currentID = tmpMap["SceneID"];
            }
            $("#SimpleScene").val(currentID);
        }
    }

    if (isGetDataOK)
    {
        // 拆分昼夜模式灵敏度和昼夜模式切换时间
        var v = Number(ImgMap["DayNightSense"]);
        
        ImgMap["DayNightSenseValue"] = v & 0x0000FFFF;
        ImgMap["DayNightSwitchTime"] = (v & 0xFFFF0000) >> 16;
        
        // 昼夜模式灵敏度兼容性修改
        v = Number(ImgMap["DayNightSenseValue"]);
        if (v >=1 && v <= 3) {
            v = 1;
        } else if (v >=4 && v <= 6) {
            v = 5;
        } else if (v >= 7 && v <= 9) {
            v = 9;
        }
        ImgMap["DayNightSenseValue"] = v;

        resetForm();
    }
    else
    {
        disablePage();
        top.banner.showMsg(true, $.lang.tip["tipGetImgCfgFail"]);
    }
    isDeleteExposureShutterOptions();
}

function repareData()
{
    var v = ImgMap["DayNightSenseValue"];
    
    // 数据校正
    if(2 == v || 3 == v)
    {
        ImgMap["DayNightSenseValue"] = 1;
    }
    else if(4 == v || 6 == v)
    {
        ImgMap["DayNightSenseValue"] = 5;
    }
    else if(7 == v || 8 == v)
    {
        ImgMap["DayNightSenseValue"] = 9;
    }
    
    if((0 == ImgMap["TopLeftX"]) && (0 == ImgMap["TopLeftY"]) &&
    (0 == ImgMap["BotRightX"]) && (0 == ImgMap["BotRightY"]))
    {
        ImgMap["TopLeftX"] = 25;
        ImgMap["TopLeftY"] = 25;
        ImgMap["BotRightX"] = 75;
        ImgMap["BotRightY"] = 75;
    }
}

/**
 * 界面表单重置
 * 
 * @param f
 * @return
 */
function resetForm()
{
    repareData();
    // 若有最慢慢快门则生成快门选项
    if(!$("#EnableSlowShutterItem").hasClass("hidden"))
    {
        $("input[name='EnableSlowShutter'][value='"+ImgMap["EnableSlowShutter"]+"']").attr("checked", true);
        $("#MaxSlowShutter").val(ImgMap["MaxSlowShutter"]);
        enableMaxSlowShutter();
    }
    var $MeteringModeItem = $("#MeteringModeItem");
    var $ExposureWDRModeItem = $("#ExposureWDRModeItem");
    var $ExposureWDRSensibilityItem = $("#ExposureWDRSensibilityItem");
    var $HLCRatioTemp = $("#HLCRatio_temp");
    if ((7 == currentSceneType) || (12 == currentSceneType)) {// 道路强光抑制场景 或者园区强光抑制
        if (!$MeteringModeItem.hasClass("hidden")) {
            $MeteringModeItem.css("display", "none");
        }
        if (!$ExposureWDRModeItem.hasClass("hidden")) {
            $ExposureWDRModeItem.css("display", "none");
        }
        if (!$ExposureWDRSensibilityItem.hasClass("hidden")) {
            $ExposureWDRSensibilityItem.css("display", "none");
        }

        if (12 == currentSceneType) {// 园区强光抑制
            $HLCRatioTemp.text($.lang.pub["HLCRatio_ex"]);
        } else {
            $HLCRatioTemp.text($.lang.pub["HLCRatio"]);
        }
        $("#HLCRatioSlider").removeClass("hidden");
        ImgMap["MeteringModeSel"] = 0;
        ImgMap["HLCRatio"] = ImgMap["MeteringMode"];
    } else {
        if (!$MeteringModeItem.hasClass("hidden")) {
            $MeteringModeItem.css("display", "");
        }
        if (!$ExposureWDRModeItem.hasClass("hidden")) {
            $ExposureWDRModeItem.css("display", "");
        }
        if (!$ExposureWDRSensibilityItem.hasClass("hidden")) {
            $ExposureWDRSensibilityItem.css("display", "");
        }
        $("#HLCRatioSlider").addClass("hidden");
        ImgMap["MeteringModeSel"] = ImgMap["MeteringMode"];
        ImgMap["HLCRatio"] = 0;
    }
    
    if (!$("#ExposureGainItem").hasClass("hidden")) {
        ResolveItems("ExposureGainItem", $xml.find(capMap["ExposureGainItem"])[0]);
    }

    if (!$("#LightModeItem").hasClass("hidden")) {
        // 补光能力集解析依赖于LightMode的值
        $("#LightMode").val(ImgMap["LightMode"]);
        parserIrItem();
        if (!$("#LaserAngleItem").hasClass("hidden")) {
            ImgMap["LaserAngleText"] = ImgMap["LaserAngle"]/100;
        } else {
            ImgMap["Far2IrLed"] = ImgMap["LaserAngle"];
        }
    }
    dataMap_bak = objectClone(ImgMap);
    cfgToForm(ImgMap, "frmSetup");

    setSliderValue();
    if(!$("#WhiteBalanceModeItem").hasClass("hidden"))
    {
        WhiteStandoff_change();
    }
    if(!$("#SharpnessModeUL").hasClass("hidden") && !$("#SharpnessModeUL").parent().hasClass("unit hidden"))
    {
           SharpnessMode_onclick();
    }
    if(!$("#DayNightModeUL").hasClass("hidden") && !$("#DayNightModeUL").parent().hasClass("unit hidden"))
    {
        DayNightMode_onclick();
    }
    if(!$("#ExposureWDRModeUL").hasClass("hidden") )
    {
        DWRMode_change();
    }
    if (!$("#LightModeItem").hasClass("hidden")) {
        lightMode_change();
    }
    if(!$("#DeFogItem").hasClass("hidden"))
    {
        DeFog_change();
    }
    if(!$("#ImageAdjustItem").hasClass("hidden"))
    {
        imageAdjust_change();
    }
    if(!$("#StableModeItem").hasClass("hidden"))
    {
        EIS_click();
    }
    if(!$("#PIRISItem").hasClass("hidden"))
    {
        PIRISMode_onclick();
    }
    if(!$("#ExposureModeItem").hasClass("hidden"))
    {
        exposal_changePage();
    }
    if (!$("#MirrorModeItem").hasClass("hidden")) {
        MirrorMode_changePage();
    } else {
        setMeteringArea();
    }
    if (!$("#lensModeUL").hasClass("hidden")) {
        LensIfMode_change();
    }
    
}

// 镜像的change事件
function MirrorMode_changePage()
{
    var streamInfo;
    
    streamInfo = video.StreamInfoList[StreamID.MAIN_VIDEO];
    
    if ((4 == $("#MirrorMode").val()) || (5 == $("#MirrorMode").val())) {
        video.videoWidth = Number(streamInfo["Height"]);
        video.videoHeight = Number(streamInfo["Width"]);
    } else {
        video.videoWidth = Number(streamInfo["Width"]);
        video.videoHeight = Number(streamInfo["Height"]);
    }
    video.calVideoRealPos();
    setRenderScale();
}

// 透雾选择事件
function DeFog_change()
{
    var bool = (0 == $("#DeFogMode").val());// 关闭时灰显等级
    setSliderEnable("DeFogLevel", bool);


    //兼容性处理如果两个都开启则设置当前除雾为0
     if ((0 != $("#DeFogMode").val()) && (0 != $("#ExposureWDRMode").val())) {
        $("#DeFogMode").get(0).selectedIndex = 0;
        $("#DeFogMode").change();
    }


    $("#ExposureWDRMode").attr("disabled",($("#DeFogMode").val() != 0));

}

// 电子防抖点击事件
function EIS_click()
{
    var bool = (1 == $("#StableMode").val());
    $("#Rate").attr("disabled", !bool);
}

function checkIllum(f)
{
    if(validNumber(f, 0, 999999, $.lang.tip["tipNumScopeErr"].replace("%s",0+"-"+999999)))
    {
        this.defaultValue = this.value;
        
    }
}

function checkElev(f)
{
    if(validNumber(f, 0, 90, $.lang.tip["tipNumScopeErr"].replace("%s",0+"-"+90)))
    {
        this.defaultValue = this.value;
    }
}
/** *************************************场景切换相关代码******************************************* */
var sceneInfoList = {};// 场景基本信息（5个）
var conditionList = [];// 场景触发条件（5个）
var currentID = 0;// 当前场景ID
var currentSceneType = 0;// 当前场景类型
var currentEditID = 0; // 当前正在编辑的场景ID

// 焦点场景名
function focusInSceneName(index)
{
    if(0 != $("#SceneType"+index).val())
    {
        $("#SceneName"+index).blur();
    }
}

// 修改场景名
function changeSceneName(index)
{
    if(0 != $("#SceneType"+index).val())return; 
    var sceneName = $("#SceneName"+index).val();
    if(!validataSceneName(index, sceneName))return;
    if(sceneName == sceneInfoList[index]["SceneName"])return;
    setSceneInfo(index);
}

// 修改场景模版
function changeSceneType(index)
{
    if(!confirm($.lang.tip["tipChangeSceneType"]))
    {
        $("#SceneType"+index).val(sceneInfoList[index]["SceneType"]);
        return;
    }
    var v = $("#SceneType"+index).val();
    var text = $("#SceneType"+index+" option:selected").text();
    if(0 == v)
    {
        $("#SceneName"+index).val("");
        $("#SceneName"+index).focus();
    }
    else
    {
        $("#SceneName"+index).val(text);
    }
    setSceneInfo(index);
    if(index == currentID)
    {
        initData();
    }
}

// 获取默认场景
function getDefaultScene()
{
    var tmpMap = {},jsonMap={};
    var flag = LAPI_GetCfgData(LAPI_URL.DefaultScene, jsonMap);
    tmpMap["DefaultSceneID"] = jsonMap["SceneID"];
    if(flag)
    {
        cfgToForm(tmpMap, "sceneForm");
        var defaultSceneID = tmpMap["DefaultSceneID"];
        $("#AutoSwitch"+defaultSceneID).addClass("hidden2");
        $("#config"+defaultSceneID).addClass("hidden");
        $("#defaultScene"+defaultSceneID).addClass("hidden");
        $("#defaultScene_label"+defaultSceneID).removeClass("hidden");
    }
    return flag;
}

// 设置默认场景
function setDefaultScene(index)
{
    var $DefaultSceneID = $("#DefaultSceneID");
    var defaultSceneID = $DefaultSceneID.val();
    $DefaultSceneID.val(index);
    if(LAPI_SetCfgData(LAPI_URL.DefaultScene, {"SceneID":index}))
    {
        $("#AutoSwitch"+defaultSceneID).removeClass("hidden2");
        $("#config"+defaultSceneID).removeClass("hidden");
        $("#defaultScene"+defaultSceneID).removeClass("hidden");
        $("#defaultScene_label"+defaultSceneID).addClass("hidden");
        $("#AutoSwitch"+index).addClass("hidden2");
        $("#config"+index).addClass("hidden");
        $("#defaultScene"+index).addClass("hidden");
        $("#defaultScene_label"+index).removeClass("hidden");
    }
    else
    {
        $DefaultSceneID.val(defaultSceneID);
    }
}

// 初始化场景切换列表
function initSceneTable()
{
    var sceneTypeOption = "";
    for(var i=0; i<top.banner.sceneCapArr.length; i++)
    {
        var capInfo = top.banner.sceneCapArr[i];
        sceneTypeOption += "<option value='"+capInfo+"' >&lt"+$.lang.pub[sceneTypeName[capInfo]]+"&gt</option>";
        
    }
    for(i=0; i<5; i++)
    {
        var sceneInfo = sceneInfoList[i];
        var isChecked = sceneInfo? ((1 == sceneInfo["AutoSwitch"])): false;
        var trInfo = "<tr>"+
                            "<td>"+(i+1)+"</td>"+
                            "<td>"+
                            "    <input type='radio' name='SceneID' id='SceneID"+i+"' value='"+i+"' onclick='setCurrentScene("+i+")'>"+
                            "</td>"+
                            "<td>"+
                            "    <input type='text' name='SceneName"+i+"' id='SceneName"+i+"' value='' class='SceneNameClass' maxlength='10'  onfocus='focusInSceneName("+i+")' onblur='changeSceneName("+i+")' onKeyPress='onPicKeyPress(this)'>"+
                            "    <select name='SceneType"+i+"' id='SceneType"+i+"' class='SceneTypeClass' onchange='changeSceneType("+i+")'>"+
                                    sceneTypeOption +        
                            "    </select>"+
                            "</td>"+
                            "<td>"+
                            "    <input type='checkbox' name='AutoSwitch"+i+"' id='AutoSwitch"+i+"' onclick='setSceneInfo("+i+")'>"+
                            "</td>"+
                            "<td>"+
                            "    <img id='config"+i+"' alt='"+$.lang.pub["sceneConditions"]+"' src='images/condition.png' onclick='getConditionInfo("+i+")' style='margin-right: 15px;'>"+
                            "    <img id='defaultScene"+i+"' alt='"+$.lang.pub["beDefaultScene"]+"' src='images/default.png' onclick='setDefaultScene("+i+")'>"+
                            "    <label id='defaultScene_label"+i+"' class='hidden'>"+$.lang.pub["defaultScene"]+"</label>"+
                            "</td>"+
                        "</tr>";
        $("#sceneInfo").append(trInfo);
        $("#AutoSwitch"+i).attr("checked", isChecked);
        $("#SceneType"+i).val(sceneInfo["SceneType"]);
        var sceneName = sceneInfo? sceneInfo["SceneName"]: "";
        if(0 != sceneInfo["SceneType"])
        {
            sceneName = $("#SceneType"+i+" option:selected").text();
        }
        $("#SceneName"+i).val(sceneName);
    }
    for(i=1; i<5; i++)
    {
        var className = top.banner.isSupportPlumbAngle? "": "hidden";
        var trInfo = "<tr>"+
                     "        <td>"+
                     "            <input name='StartTime"+i+"' id='StartTime"+i+"' type='text' value='' class='Wdate nomalTxt' readonly='readonly'/>"+
                     "            ~"+
                     "            <input name='EndTime"+i+"' id='EndTime"+i+"' type='text' value='' class='Wdate nomalTxt' readonly='readonly'/>"+
                     "        </td>"+
                     "        <td>"+
                     "            <input type='hidden' name='Condition"+i+"Type1' id='Condition"+i+"Type1'>"+
                     "            <input type='text' name='Condition"+i+"Min1' id='Condition"+i+"Min1' class='shortText' maxlength='6' onchange='' onblur='checkIllum(this)'>"+
                     "            ~"+
                     "            <input type='text' name='Condition"+i+"Max1' id='Condition"+i+"Max1' class='shortText' maxlength='6' onchange='' onblur='checkIllum(this)'>"+
                     "        </td>"+
                     "        <td class='"+className+"'>"+
                     "            <input type='hidden' name='Condition"+i+"Type2' id='Condition"+i+"Type2'>"+
                     "            <input type='text' name='Condition"+i+"Min2' id='Condition"+i+"Min2' title='"+$.lang.pub["range"]+"0-90' class='shortText_25' maxlength='2' onchange='' onblur='checkElev(this)'>"+
                     "            ~"+
                     "            <input type='text' name='Condition"+i+"Max2' id='Condition"+i+"Max2' title='"+$.lang.pub["range"]+"0-90' class='shortText_25' maxlength='2' onchange='' onblur='checkElev(this)'>"+
                     "        </td>"+
                     "    </tr>";
        $("#conditionInfo").append(trInfo);
    }
}

// 场景名校验
function validataSceneName(index, v)
{
    var flag = true;
    if(v.length > 10)
    {
        alert($.lang.tip["tipSceneNameErr"]);
        $("#SceneType"+index).val(sceneInfoList[index]["SceneType"]);
        var sceneName = sceneInfoList[index]["SceneName"];
        if(0 != $("#SceneType"+index).val())
        {
            sceneName = $("#SceneType"+index+" option:selected").text();
        }
        $("#SceneName"+index).val(sceneName);
        flag = false;
    }
    return flag;
}

// 初始化场景信息
function initScene() {
    // 场景信息
    var flag = getSceneInfo();
    if (flag) {// 默认场景ID
        flag = getDefaultScene();
    }
    if (flag) {// 当前场景ID
        flag = getCurrentID();
    }
    if (flag) {// 当前光照
        flag = getCurrentValue("illumination", sceneConditionType.ILLUMINATION, $.lang.tip["tipGetIlluminationFailded"]);
    }
    if (top.banner.isSupportPlumbAngle && flag) {// 当前云台垂直角度
        flag = getCurrentValue("plumbAngle", sceneConditionType.CONDITION_TILT, $.lang.tip["tipGetPlumbAngleFailded"]);
    }
    return flag;
}

// 获取场景信息
function getSceneInfo()
{
    var flag = true;

    for (var m = 0; m < 4; m++) {//每个场景可设置4组计划时间、光照范围和云台仰角
        MappingMap_SceneMap["Condition"+(m+1)+"Max1"] = ["Trigger",m,"Condition",0,"Param2"];
        MappingMap_SceneMap["Condition"+(m+1)+"Min1"] = ["Trigger",m,"Condition",0,"Param1"];
        MappingMap_SceneMap["Condition"+(m+1)+"Type1"] = ["Trigger",m,"Condition",0,"Type"];
        MappingMap_SceneMap["Condition"+(m+1)+"Max2"] = ["Trigger",m,"Condition",1,"Param2"];
        MappingMap_SceneMap["Condition"+(m+1)+"Min2"] = ["Trigger",m,"Condition",1,"Param1"];
        MappingMap_SceneMap["Condition"+(m+1)+"Type2"] = ["Trigger",m,"Condition",1,"Type"];
        MappingMap_SceneMap["StartTime"+(m+1)] = ["Trigger",m,"Begin"];
        MappingMap_SceneMap["EndTime"+(m+1)] = ["Trigger",m,"End"];
    }
    for(var i = 0; i < 5; i++)
    {
        var tmpMap = {};
        SceneMap ={};
        flag = LAPI_initData(LAPI_URL.SceneIndex + i,SceneMap,tmpMap,MappingMap_SceneMap);
        ScenceArr.push(SceneMap);
        if(!flag)break;
        var sceneMap ={};
        var conditionMap = {};
        for(var j = 1; j < 5; j++)
        {// 将起始为0的时间段转变为“”
            if(("00:00:00" == tmpMap["StartTime"+j]) &&
            ("00:00:00" == tmpMap["EndTime"+j]))
            {
                tmpMap["StartTime"+j] = "";
                tmpMap["EndTime"+j] = "";
            }
        }
        for(var n in tmpMap)
        {
            var v = tmpMap[n];
            if("SceneName" == n || "AutoSwitch"==n ||
                "SceneID" == n || "Priority" == n ||
                "SceneType" == n)
            {
                sceneMap[n] = v;
            }
            else
            {
                conditionMap[n] = v;
            }
        }
        sceneInfoList[i] = sceneMap;
        conditionList[i] = conditionMap;        
    }
    initSceneTable();
    $("input").filter(".Wdate").bind("focus", pickerTime);
    return flag;
}

// 获取当前场景ID
function getCurrentID()
{
    var tmpMap = {};
    var flag = LAPI_GetCfgData(LAPI_URL.CurrentScene, tmpMap);
    if(flag)
    {
        currentID = tmpMap["SceneID"];
        $("#SceneID"+currentID).attr("checked", true);
    }
    return flag;
}

// 获取当前某项环境参数
function getCurrentValue(id, parmType, errMsg)
{
    var tmpMap = {};
    var flag = LAPI_GetCfgData(LAPI_URL.SceneEnvironment + parmType, tmpMap);
    if(flag)
    {
        var unit = "";
        if("plumbAngle" == id)
        {
            unit = "°";
        }
        $("#"+id).html(tmpMap["Value"]+unit);
    }
    else
    {
        top.banner.showMsg(flag, errMsg);
    }
    return flag;
}

// 获取自动切换状态
function getPlanStatus()
{
    AutoSwitchMap = {};
    var flag = LAPI_GetCfgData(LAPI_URL.SceneAutoSwitch, AutoSwitchMap);
    if(flag)
    {
        if(1 == AutoSwitchMap["Enable"])
        {
            $("#PlanEnable").attr("checked", true);
            showBlockDiv(true, "autoSwitch");
        }
    }
    else
    {
        top.banner.showMsg(false, $.lang.tip["tipGetAutoSwitchStatusFailded"]);
    }
    return flag;
}

// 设置场景参数
function setSceneInfo(index)
{
    var jsonMap = {};
    var $SceneTypeindex = $("#SceneType" + index);
    var $SceneNameindex = $("#SceneName" + index);
    var $AutoSwitchindex = $("#AutoSwitch" + index);
    jsonMap["SceneID"] = index;
    jsonMap["SceneType"] = $SceneTypeindex.val();
    jsonMap["SceneName"] = $SceneNameindex.val();
    jsonMap["AutoSwitch"] = ($AutoSwitchindex.is(":checked")? 1: 0);
    var flag = LAPI_SetCfgData(LAPI_URL.SceneIndex + index, jsonMap);
    if(flag)
    {
        var sceneMap = {};
        sceneMap["SceneType"] = $SceneTypeindex.val();
        sceneMap["SceneName"] = $SceneNameindex.val();
        sceneMap["AutoSwitch"] = ($AutoSwitchindex.is(":checked")? 1: 0);
        sceneInfoList[index] = sceneMap;
        ScenceArr[index]["SceneType"] = sceneMap["SceneType"];
        ScenceArr[index]["SceneName"] = sceneMap["SceneName"];
        ScenceArr[index]["AutoSwitch"] = sceneMap["AutoSwitch"];
    }
    else
    {
        var sceneMap = sceneInfoList[index];
        $SceneTypeindex.val(sceneMap["SceneType"]);
        $SceneNameindex.val(sceneMap["SceneName"]);
        $AutoSwitchindex.attr("checked", (1==sceneMap["AutoSwitch"]));
    }
    top.banner.showMsg(flag);
}

// 设置当前场景
function setCurrentScene(index)
{
    if (currentID == index) {
        return;
    }
    var flag = LAPI_SetCfgData(LAPI_URL.CurrentScene, {"SceneID":index});
    if(flag)
    {
        currentID = index;
    }
    else
    {
        $("#SceneID"+currentID).attr("checked", true);
    }
    top.banner.showMsg(flag);
    return flag;
}

// 获取触发条件
function getConditionInfo(index)
{
    showBlockDiv(true, "edit");    
    currentEditID = index;
    var conditionMap = conditionList[index];
    $("#sceneNameLabel").text($("#SceneName"+index).val());
    cfgToForm(conditionMap, "sceneForm");
}

// 显示/隐藏 遮盖
function showBlockDiv(flag, type)
{
    var displayStr = flag? "block": "none";
    
    if (flag) {
        var w = (document.body.scrollWidth<document.body.clientWidth)? "100%": document.body.scrollWidth+"px";
        var h = (document.body.scrollHeight<document.body.clientHeight)? "100%": document.body.scrollHeight+"px";
        
        $("#blockDiv").css({width: w, height: h});
    }
    
    if ("edit" == type) {
        scrollDiv(flag? "left": "right");
        if (flag) {
          $("#PlanEnable").css("position", "static");
        } else {
           $("#PlanEnable").css("position", "relative");
        }
    } else if ("autoSwitch" == type) {
        $("#blockDiv2").css("display", displayStr);// 遮盖层显示/隐藏
    }
    $("#blockDiv").css("display", displayStr);// 遮盖层显示/隐藏
}

// 触发条件验证
function ValidConditon() {
    var arrbt = [],
        arret = [],
        i;
    
    for (i = 0; i < 4; i++) {
        arrbt[i] = $("#StartTime" + (i+1)).val();
        arret[i] = $("#EndTime" + (i+1)).val();
        if("" == arrbt[i] && "" == arret[i])continue;
        if("" == arrbt[i] || "" == arret[i])
        {
            alert($.lang.tip["tipSceneTimeFormatErr1"]);
            return false;
        }
        if(arrbt[i] >= arret[i])
        {
            alert($.lang.tip["tipSceneTimeFormatErrStartEnd"]);
            return false;
        }
    }
    for (i = 0; i < 4; i++) {
        if ("" == arrbt[i] && "" == arret[i]) {
             continue;
        }
        for (var j=1; (i+j)<4; j++) {
            var tmpbt = arrbt[i + j];
            var tmpet = arret[i + j];
            
            if ("" == tmpbt && "" == tmpet) {
                continue;
            }
            
            if ((arrbt[i] >= tmpbt && arrbt[i] <= tmpet) || 
                (tmpbt >= arrbt[i] && tmpbt <= arret[i])) {
                alert($.lang.tip["tipSceneTimeOverlap"]);
                return false;
            }
        }
    }
    
    for(i=1; i<5; i++)
    {
        var min = $("#Condition"+i+"Min1").val();
        var max = $("#Condition"+i+"Max1").val();
        if(!validNum(min) || !validNum(max) || "" == min || "" == max)
        {
            alert($.lang.tip["tipLumenFormatErr1"]);
            return false;
        }else if(parseInt(min)>parseInt(max))
        {
            alert($.lang.tip["tipLumenFormatErrStartEnd"]);
            return false;
        }
        min = $("#Condition"+i+"Min2").val();
        max = $("#Condition"+i+"Max2").val();
        if(!validNum(min) || !validNum(max) || "" == min || "" == max)
        {
            alert($.lang.tip["tipPlumbAngleFormatErr"]);
            return false;
        }
        else if(parseInt(min)>90 || parseInt(min)<0 || parseInt(max)>90 || parseInt(max)<0)
        {
            alert($.lang.tip["tipPlumbAngleFormatErr1"]);
            return false;
        }
        else if(parseInt(min)>parseInt(max))
        {
            alert($.lang.tip["tipPlumbAngleFormatErrStartEnd"]);
            return false;
        }
    }
    return true;
}

// 滚动效果
function scrollDiv(direction)
{
    var $sceneInfoDiv = $("#sceneInfoDiv");
    if("right" == direction)
    {// 向右
        if(DivLeft < 0)
        {
            DivLeft += 4;
            $sceneInfoDiv.css("left", DivLeft+"%");
            $sceneInfoDiv.css("right", (0-DivLeft)+"%");
            $("#conditionInfoDiv").css("left", (100+DivLeft)+"%");
            setTimeout("scrollDiv('right')", 40);
        }
    }
    else
    {// 向左
        if(DivLeft > -100)
        {
            DivLeft -= 4;
            $sceneInfoDiv.css("left", DivLeft+"%");
            $sceneInfoDiv.css("right", (0-DivLeft)+"%");
            $("#conditionInfoDiv").css("left", (100+DivLeft)+"%");
            setTimeout("scrollDiv('left')", 40);
        }
    }
}

//
function isDeleteExposureShutterOptions(){
    var str = [2,3,4,8,10,15,20],
        i;
    if(5 == currentSceneType && top.banner.enhanceMode && 2 == ImgMap["ExposureMode"]){              //如果当前是客观场景且开启增强模式，则只保留部分慢快门oW2837ouyangmeijuan
        for(i = 0; i < str.length; i++){
            if($("#ExposureShutter").find("option[value=" + str[i] + "]")){
                $("#ExposureShutter").find("option[value=" + str[i] + "]").remove();
            }
        }
    }
}

// 场景自动切换上报
function eventSwitchScene(sceneID)
{
    currentID = sceneID;
    initData();
    if (1 == $("#sceneDiv").attr("flag"))
    {
       $("#SceneID"+currentID).attr("checked", true);
    }
}

// 获取当前场景的场景类型
function getCurrentSceneType(){
    var tmpMap = {},
        flag = false;
        
    if (getCurrentID()) {
        if (LAPI_initData(LAPI_URL.SceneIndex + currentID,SceneMap,tmpMap,MappingMap_SceneMap)) {
            currentSceneType = Number(tmpMap["SceneType"]);
            flag = true;
        }
    }
    return flag;
}

function setIrisDefaultValue() {
    var value = top.banner.IrisDefaultValueArr[0];
    $("#IrisValueAutoManual").val(value);
    var v = Number(value) | Number(ImgMap["SmallestIRIS"]) << 16 | Number(ImgMap["BiggestIRIS"]) << 24;
    $("#IrisValue").val(v);
    slidersMap["IrisValueAutoManual"]["sld"].SetValue(value);
    submitF("IRIS");
}
/** ******************************************************************************** */

function validateRange(id,type)
{
    var min,max,msg;
    switch(type)
    {
        case "shutter":
            var $ExposureFastShutter = $("#ExposureFastShutter");
            var $ExposureSlowShutter = $("#ExposureSlowShutter");
            if($ExposureFastShutter.hasClass("hidden") || $ExposureSlowShutter.hasClass("hidden"))
            {
                return true;
            }
            msg = $.lang.tip["tipShutterRangeErr"];
            if($("#usDiv").length>0)
            {
                min = $ExposureFastShutter.val();
                max = $ExposureSlowShutter.val();
            }
            else
            {
                min = $ExposureSlowShutter.val();
                max = $ExposureFastShutter.val();
            }
            break;
        case "gain":
            var $ExposureMinGain = $("#ExposureMinGain");
            var $ExposureMaxGain = $("#ExposureMaxGain");
            if($ExposureMinGain.hasClass("hidden") || $ExposureMaxGain.hasClass("hidden"))
            {
                return true;
            }
            msg = $.lang.tip["tipGainRangeErr"];
            min = $ExposureMinGain.val();
            max = $ExposureMaxGain.val();
            break;
        case "iris":
            var $ExposureMinIris = $("#ExposureMinIris");
            var $ExposureMaxIris = $("#ExposureMaxIris");
            if($ExposureMinIris.hasClass("hidden") || $ExposureMaxIris.hasClass("hidden"))
            {
                return true;
            }
            msg = $.lang.tip["tipIrisRangeErr"];
            // 光圈数值越大反而表示实际光圈越小
            min = $ExposureMaxIris.val();
            max = $ExposureMinIris.val();
            break;
        case "IRIS":
            var $SmallestIRIS = $("#SmallestIRIS");
            var $BiggestIRIS = $("#BiggestIRIS");
            if($SmallestIRIS.hasClass("hidden") || $BiggestIRIS.hasClass("hidden"))
            {
                return true;
            }
            msg = $.lang.tip["tipIrisRangeErr"];
            min = $SmallestIRIS.val();
            max = $BiggestIRIS.val();
            break;
        default:
            min = 0;
            max = 0;
            break;
    }
    var flag = (parseInt(min, 10)<=parseInt(max, 10));
    if(!flag)
    {
        alert(msg);
        $("#"+id).val(ImgMap[id]);
    }
    return flag;
}

// 事件绑定
function initEvent(){
    $("input[name='ImageAdjustEnable']").change(function(){imageAdjust_change();submitF($(this).attr("apiType"));});
    $("input[name='FlickerSuppression']").bind("click",function(){submitF($(this).attr("apiType"));});
    $("input[name='ImageType']").bind("click", changeImageType);
    $("#ExposureMode").change(function(){exposal_changePage();submitF($(this).attr("apiType"));});
    $("#WhiteBalanceMode").change(function(){WhiteStandoff_change();submitF($(this).attr("apiType"));});
    $("input[name='SharpnessMode']").bind("click", function(){SharpnessMode_onclick();submitF($(this).attr("apiType"));});
    $("input[name='DayNightMode']").bind("click", function(){DayNightMode_onclick();submitF($(this).attr("apiType"));});
    $("#LensIfMode").change(function(){
        submitF($(this).attr("apiType"));
        LensIfMode_change();
    });
    $("input[name='IrCtrlEnable']").bind("click", function(){
        submitF($(this).attr("apiType"));
    });
    $("#IrisMode").bind("click", function(){
        PIRISMode_onclick();
        var $IrisMode = $("#IrisMode");
        if($IrisMode.val() != ImgMap["IrisMode"]) {
            if(0 == $IrisMode.val() || 1 == $IrisMode.val()) {
                submitF($(this).attr("apiType"));
            }
            if(2 == $IrisMode.val()) {//软件返回的默认值，最大、最小光圈值均为0，在此做判断
                var $BiggestIRIS = $("#BiggestIRIS");
                if(0 == ImgMap["SmallestIRIS"] && 0 == ImgMap["BiggestIRIS"]) {
                    $BiggestIRIS.val("50");
                }
                var v = Number($("#IrisValueAutoManual").val()) | Number($("#SmallestIRIS").val()) << 16 | Number($BiggestIRIS.val()) << 24;
                $("#IrisValue").val(v);
                submitF("IRIS");
            }
        }
    });
    $("#DayNightSenseValue").change(function(){
        var v = Number($(this).val()) | (Number($("#DayNightSwitchTime").val()) << 16);
        $("#DayNightSense").val(v);
        submitF($(this).attr("apiType"));
    });
    $("#MirrorMode").change(function(){
        if(submitF($(this).attr("apiType")))
        {
            MirrorMode_changePage();
        }
    });
    $("#ExposureIris").change(function(){submitF($(this).attr("apiType"));});
    $("#ExposureMinIris").change(function(){if(validateRange(this.id, "iris")){submitF($(this).attr("apiType"));}});
    $("#ExposureMaxIris").change(function(){if(validateRange(this.id, "iris")){submitF($(this).attr("apiType"));}});
    $("#MeteringModeSel").change(function(){
        $("#MeteringMode").val($("#MeteringModeSel").val());
        if (submitF($(this).attr("apiType"))) {
            setMeteringArea();
        }
    });
    $("#ExposureWDRMode").change(function(){DWRMode_change();submitF($(this).attr("apiType"));});
    $("#FocusMode").change(function(){submitF($(this).attr("apiType"));});
    $("#FocusScene").change(function(){submitF($(this).attr("apiType"));});
    $("#ImageFreeze").change(function(){submitF($(this).attr("apiType"));});
    $("#DeFogMode").change(function(){
        if (submitF($(this).attr("apiType"))) {
            DeFog_change();
        }
    });
    $("#StableMode").change(function(){if(submitF($(this).attr("apiType")))EIS_click();});
    $("#Rate").change(function(){submitF($(this).attr("apiType"));});
    $("input[name='EnableSlowShutter']").bind("click", function(){if(submitF($(this).attr("apiType")))enableMaxSlowShutter();});
    $("#LightMode").change(function(){parserIrItem();lightMode_change();submitF($(this).attr("apiType"));});
    $("#SimpleScene").change(function(){setCurrentScene(this.value);});
    $("#PlanEnable").bind("click", 
        function(){
            AutoSwitchMap["Enable"] = this.checked? 1: 0;
            var flag = LAPI_SetCfgData(LAPI_URL.SceneAutoSwitch,AutoSwitchMap );
            if(!flag)
            {
                $(this).attr("checked", !this.checked);
            }
            else
            {
                showBlockDiv(this.checked, "autoSwitch");
                setMeteringArea();
            }
            top.banner.showMsg(flag);
        }
    );
    $("#okBtn").bind("click",
        function(){
            if(!ValidConditon())return false;
            var conditionMap = conditionList[currentEditID];
            var ScenceMappingMap = {};
            if(!IsChanged("sceneForm", conditionMap))return false;
            var pcParam = "";
            var tmpMap = {};
            for(var n in conditionMap)
            {
                tmpMap[n] = conditionMap[n];
            }
            formToCfg("sceneForm", tmpMap);
            for(var n in tmpMap)
            {
                var v = tmpMap[n];
                if(("" == v) && (n.indexOf("StartTime")>-1 || n.indexOf("EndTime")>-1))
                {
                    v = "00:00:00";
                }
            }

            for (var m = 0; m < 4; m++) {//每个场景可设置4组计划时间、光照范围和云台仰角
                ScenceMappingMap["Condition"+(m+1)+"Max1"] = ["Trigger",m,"Condition",0,"Param2"];
                ScenceMappingMap["Condition"+(m+1)+"Min1"] = ["Trigger",m,"Condition",0,"Param1"];
                ScenceMappingMap["Condition"+(m+1)+"Type1"] = ["Trigger",m,"Condition",0,"Type"];
                ScenceMappingMap["Condition"+(m+1)+"Max2"] = ["Trigger",m,"Condition",1,"Param2"];
                ScenceMappingMap["Condition"+(m+1)+"Min2"] = ["Trigger",m,"Condition",1,"Param1"];
                ScenceMappingMap["Condition"+(m+1)+"Type2"] = ["Trigger",m,"Condition",1,"Type"];
                ScenceMappingMap["StartTime"+(m+1)] = ["Trigger",m,"Begin"];
                ScenceMappingMap["EndTime"+(m+1)] = ["Trigger",m,"End"];
            }
            changeMapToMapByMapping(ScenceArr[currentEditID], ScenceMappingMap, tmpMap, 1);
            var flag = LAPI_SetCfgData(LAPI_URL.SceneIndex + currentEditID,ScenceArr[currentEditID]);
            if(flag)
            {
                conditionList[currentEditID] = tmpMap;
                showBlockDiv(false, "edit");
            }
            top.banner.showMsg(flag);
        }
    );
    $("#cancelBtn").bind("click", 
        function(){
            showBlockDiv(false, "edit");
        }
    );
    $("#IrCtrlMode").change(function(){
        IrCtrlMode_change();
        var v = $("#IrCtrlMode").val();
        var capList = $xml.find("Image Video IrCtrl Mode").text().split(",");
        // 是否包含光敏自动
        var flag = isContain(capList, "6");
        if (flag) {
            // 设为光敏时先发昼夜模式自动再发光敏
            if (5 == v) {
                LAPI_SetCfgData(cmdMap["Exposure"],{DayNight:{Mode:0}});
            }
        }
        submitF($(this).attr("apiType"));
        if (flag) {
            // 设为手动时先下发手动再下发昼夜模式彩色
            if (3 == v || 7 == v) {
                LAPI_SetCfgData(cmdMap["Exposure"],{DayNight:{Mode:1}});
            }
        }
    });
    $("fieldset legend").each(
        function(){
            $(this).bind("click", function(){
                var contentDiv = $(this).next();
                if(contentDiv.hasClass("hidden"))
                {
                    // 未获取参数则需获取参数。
                    if(0 == contentDiv.attr("flag"))
                    {
                        var flag = true;
                        var imageType = $("input[name='ImageType']:checked").val();
                        var cmd = contentDiv.attr("apiType");
                        var v;
                        var jsonMap = {};
                        if ("Misc" == cmd) {
                            if (flag && !$("#ImageFreezeItem").hasClass("hidden")) {
                                flag = getCfgData(channelId, CMD_TYPE.IMAGE_MISC_CFG, ImgMap, imageType);
                            }
                            
                            if (flag && !$("#StableModeItem").hasClass("hidden")) {
                                flag = LAPI_GetCfgData(cmdMap["EIS"]+ LAPI_Type, ImgStableJsonMap);
                                if (flag) {
                                    ImgStableJsonMap_bak = objectClone(ImgStableJsonMap);
                                    LAPI_CfgToForm("frmSetup",ImgStableJsonMap);
                                }
                            }
                            if (flag && !$("#ImageAdjustItem").hasClass("hidden")) {
                                flag = LAPI_GetCfgData(cmdMap["ImageAdjust"], dataMap["ImageAdjust"][1]);
                                if (flag) {
                                    LAPI_CfgToForm("frmSetup",dataMap["ImageAdjust"][1],ImgMap,dataMap["ImageAdjust"][0]);
                                    dataMap_bak = objectClone(ImgMap);
                                }
                            }
                            if(flag && (!$("#lensModeUL").hasClass("hidden") || !$("#PIRISItem").hasClass("hidden") )){
                                flag = LAPI_GetCfgData(cmdMap["IRIS"], dataMap["IRIS"][1]);
                                if (flag) {
                                    v = dataMap["IRIS"][1]["IrisValue"];
                                    LAPI_CfgToForm("frmSetup",dataMap["IRIS"][1],ImgMap,dataMap["IRIS"][0]);
                                    dataMap_bak = objectClone(ImgMap);
                                    ImgMap["IrisValueAutoManual"] = v & 0x0000FFFF;
                                    ImgMap["SmallestIRIS"] = (v & 0x00FF0000) >> 16;
                                    ImgMap["BiggestIRIS"] = v >> 24;
                                }
                            }
                        } else if ("scene" == cmd) {
                            flag = initScene();
                            
                            // 直接跳转到图像设置界面时
                            if(7 == parent.menuType)
                            {
                                $("#planTimeCol").css("width","170px");
                                $("#planTimeCol2").css("width","170px");
                                $("input").filter(".Wdate").removeClass("nomalTxt").addClass("shortText_70");
                            }
                        } else {
                            if( "string" !== typeof cmdMap[cmd]){
                                flag = getCfgData(channelId, cmdMap[cmd], ImgMap, imageType);
                            }else{
                                flag = LAPI_GetCfgData(cmdMap[cmd], dataMap[cmd][1]);
                                if(flag){
                                    LAPI_CfgToForm("frmSetup",dataMap[cmd][1],ImgMap,dataMap[cmd][0]);
                                    dataMap_bak = objectClone(ImgMap);
                                 }
                            }
                        }
                        
                        if (flag) {
                           contentDiv.attr("flag", 1);
                           contentDiv.removeClass("hidden");
                           $(this).parent().removeClass("close");
                           resetForm();
                        }
                    } else {
                        contentDiv.removeClass("hidden");
                        $(this).parent().removeClass("close");
                        setSliderValue();
                    }
                }
                else
                {
                    contentDiv.addClass("hidden");
                    $(this).parent().addClass("close");
                }
            });
        }
    );
}

function initVideo_callback(streamType){
    EnableDrawFun(streamType, 1);
    initAreaDrawObjData();
}

function LAPI_initData( url , jsonMap , TempMap ,mappingMap) {
    if (!LAPI_GetCfgData(url, jsonMap)) {
        disableAll();
        return;
    }
    LAPI_CfgToForm("frmSetup", jsonMap, TempMap, mappingMap);
    return true;
}

function LAPI_submitF( url , jsonMap ,TempMap , mappingMap ) {
    LAPI_FormToCfg("frmSetup", jsonMap, TempMap, mappingMap);
    return LAPI_SetCfgData(url, jsonMap);

}

$(document).ready(function(){
    parent.selectItem("imgConfigTab");// 菜单选中
    beforeDataLoad();
    
    // 获得最小快门
    var tmpMap = {};
    if(LAPI_GetCfgData(LAPI_URL.VideoInMode,tmpMap)) {
        minShutter = parseInt(tmpMap["FrameRate"]);
    }
    if (top.banner.isSupportCapture && LAPI_GetCfgData(LAPI_URL.SUBDEVICE_SWITCH_EX_CFG, tmpMap)) {
        isShowPhoto = tmpMap["StrobeMode"];
    }

    // 查询是否开启了图像自定义参数
    if ("undefined" == typeof top.ImgCustomParam) {
        tmpMap = {};
        if(!LAPI_GetCfgData(LAPI_URL.SansuoCheckCfg, tmpMap))
        {
            disableAll();
            return;
        }
        top.ImgCustomParam = Number(tmpMap["Enabled"]);
    }
    if (1 == top.ImgCustomParam) {
        $("#exposalCompensationText").text($.lang.pub["backlightCompensation"]);
    }
    
    top.ImageType = (undefined == top.ImageType)? 0: top.ImageType;
    LAPI_Type = (0 == top.ImageType) ? "/VideoStable" : "/PhotoStable";
    $("input[name='ImageType'][value='"+top.ImageType+"']").attr("checked",true);
    
    initPage();
    
    $("#freshBtn1").attr("title", $.lang.pub["refresh"]);
    $("#freshBtn2").attr("title", $.lang.pub["refresh"]);
    // 初始化语言标签
    initLang();
    initData();
    if(!$("#MeteringModeItem").hasClass("hidden") && 
        !$("#MeteringModeSel").attr("disabled") &&
        (1 == $("#MeteringModeSel").val()))
    {
        $.blockUI({ 
            centerY: false,
            css: { 
                border: 'none',
                top: '280px'
            },
            overlayCSS: {opacity: '0'},
            message: '<h3 id="msg"></h3>'  
        }); 
    }
    initEvent();
    if(7 != parent.menuType)
    {
        initVideo("recordManager_div_activeX", StreamType.LIVE, RunMode.CONFIG, null, top.banner.isSupportPTZ, initVideo_callback);
    }
    afterDataLoad();
});