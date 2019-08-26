var isRefactor = true;// 是否重构线
var isMac = isMacPlatform();
var isSupportRoi = false;
var isSupportAudio = false;
var isSupportAudioSource = false;
var isSupportAudioTalk = false;
var isSupportSerial = false;
var isSupportSerialInput = false;
var isSupportSerialTransport = false;
var isSupportSwitchIn = false;
var isSupportSwitchOut = false;
var isSupportCoverOsd = false;
var isSupport3DCover = false;
var isSupportIntallHeight = false;
var isSupportDCOut = false;
var isSupportLowDelay = false;
var isSupportViewMode = false;
var isSupportTamperDetect = false;
var isSupportTGEPSwitch = false;
var isSupportDBSerialTransport = false;
var isSupportPeripheralPTZ = false;
var isSupportInfrare = false;
var isSupportHeatup = false;
var isSupportRainbrush = false;
var isSupportIlluminate = false;
var isSupportBNC = false;
var isSupportBMServer = false;
var isSupportPTZ = false;
var isSupportPlumbAngle = false;
var isSupport3DAreaZoom = false;
var isSupportSendMode = false;
var isSupportClearSnow = false;
var isSupportClearFog = false;
var isSupportEnablePTReset = false;
var isSupportHCMLowDelay = false;
var isSupportIVALPCheck = false;
var isSupportTrackRecord = false;
var isSupportLens = false;
var isSupportAlureMode = false;
var isSupportMJPEG = false;
var isSupportJPEG = false;
var isSupportCapture = false;
var isSupportOffday = false;
var isSupportIllegalpic = false;
var isSupportCommonCapture = false;
var isSupportAnyCfg = false;
var isSupportEncodePic = false;
var isSupportCommonGB = false;
var isSupportCommonPicVersion = false;
var isSupportCommonPicUploadInterval = false;
var isSupportCommonOSD = false;
var isSupportCommonAutoGrab = false;
var isSupportCommonSpeedLimit = false;
var isSupportCommonCarBodyColorSnd = false;
var isSupportCommonHeatSwitch = false;//是否支持加热策略
var isSupportspclTlSwitch = false;//特殊红绿灯
var isSupportCommonClearFix  = false;
var isSupportCommonIDDL = false;
var isSupportCommonDrivewayType = false;
var isSupportCommonDrivewayAdvance = false;
var isSupportCommonDetectorSwitch = false;
var isSupportCommonExposure = false;
var isSupportCommonLoopCoil = false;
var isSupportCommonIVALight = false;
var isSupportCommonAdv = false;
var isSupportTripThread = false;
var isSupportMotionDetection = false;
var isSupportDiamodDetection = false;
var isSupportLineMotionDetection = false;
var isSupportRealtimeStatus = false;
var isSupportWifi = false;
var isSupportTrafficLight = false;
var isSupportRadar = false;
var isSupportLaser = false;
var isSupportTrafficcontrol = false;
var isSupportStrobeLight = false;
var isSupportPolarizer = false;
var isSupportCoil = false;
var isSupportLED = false;
var isSupportLEDStatus = false;//LED实时状态显示能力集
var isSupportNDFilter = false;
var isSupportOpenDetect = false;
var isSupportCommonCarWayCfg = false;
var isSupportSwitchKND = false;
var isSupportMediaStream = false;
var isSupportStorage = false;
var isSupportIVA = false;
var isSupportIvaPark = false;
var isSupportAlterLampCtrl = false;//是否支持交替灯控制
var isSupportUsualCapture = false;
var isSupportTemperatureDetect = false;
var isSupportWetDetect = false;
var isSupportDemo = false;
var isSupportDebugger = false;
var isSupport485SerialChange = false;//是否支持485串口切换
var isSupportSwitchTrembleTime = false;//是否支持开关量稳定
var isSupportUNP = false;
var isSupportNoAuto = false;
var isSupportNTP = false;
var isSupportVM = false;
var isSupportMycloud = false;
var isSupportIgnoreArea = false;
var isSupportFilterType = false;
var isSupportVirtualCoil = false;
var isSupportIntelArea = false;
var isSupportSubDevice = false;
var isSupportEhcoCancellation = false;
var isSupportIRIS = false; // 光圈
var isSupportAlarm = false;
var isSupportFaceDetect = false;
var isSupportABF = false;
var isSupportMBF = false;
var isSupportIVADebug = false;
var isSupportFTP = false;
var isSupportBMNoRebootPrompt=false;
var isSupportACSynt = false;
var isSupportLensType = false;
var isSupportNoBrand = false;
var isSupportPatchUpdate = false;
var isNOSensitivity = false;
var isSupportRecordPlayback = false;
var isSupportVideoDownload = false;
var isNOSDevHCM = false; //非自研设备
var isSupportJPEGConfig = false;
var isSupportResetMotorLens = false;
var isSupportLenIfMode = false;
var isSupportAutoReboot = false;
var isSupportSansuo = false;
var isSupportPIRIS = false;
var isSupportDST = false;
var isSupportPortCfg = false;
var isSupportFontStyle = false;
var isSupportNoPtzMode = false;
var isSupportRSV = false;
var isSupportIOPort = false;
var isSupportZoomLimitSwitch = false;
var isSupportHttps = false;
var isSuppprtIEEE8021x = false;
var isSupportDemoPtz = false;
var isSupportMotionLinkPreset = false;
var isSupportHDMM = false;
var isSupportBasicFTP = false;
var isSupportEmail = false;
var isSupportBasicCapture = false;
var isSupportDDR=false;
var isSupportSNMP=false;
var isSupportFishEye = false;
var isSupportFishGun = false;
var isSupportFishIpc = false;
var isSupportMicOut = false;
var isSupportSwiftEhcoCancellation = false;
var isSupportNoiseReduction = false;
var isSupportSmart = false;
var isSupportTWCpt = false;
var isSupportSmartPeopleCount = false;
var isSupportSmartTraffic = false;
var isSupportSmartOSD = false;
var isSupportSSLVPN = false;
var isSupportSmartTrack=false;
var isSupportLimitPTZ = false;
var isSupportSVC = false;
var isSupportUCODE = false;
var isSupportSecureAccess = false; // 安全接入
var isSupportDualAudio = false;
var isSupportLEDCtrl = false; //设备支持车位灯控制器实时状态显示
var isSupportFan = false;//是否支持风扇，目前只有智能交通的产品会根据该能力集来显示风扇配置
var isSupportTrafficDataServerStatus = false;//是否支持交通参数服务器实时在线状态上报
var isSupportNetPeripheral = false;//是否支持网络外设

// 智能告警
var isSupportChain  = false;//是否支持链式计算
var isSupportSmartAlarm = false;
var isSupportCrossLine = false;
var isSupportIntrosionZone = false;
var isSupportEnterZone = false;
var isSupportLeafeZone = false;
var isSupportOutFocus = false;
var isSupportSceneChange = false;
var isSupportSpecialLens = false;

var isSupportWanderDetect = false;
var isSupportPeopleGather = false;
var isSupportFastMove = false;
var isSupportParkDetect = false;
var isSupportLeftGood = false;
var isSupportHandleGood = false;
var isSupportH265 = false;
var isSupportIntellisense=false;
var isSupportSmartTmsServer = false;
var isSupportSmartTmsProtocol = false;
var isSupportSmartTmsProtocolMode = [];
var isSupportSmartUDPServer = false;
var isSupportSmartAdvanceParam = false;
var isSupportEleCompass = false;    // 是否支持电子罗盘
var isSupportAreaFocus = false; //是否支持区域聚焦
var isSupportPersonPhoto=false;//人脸抓拍设置
var isSupportFaceDetection =false;//人脸识别设置
var isSupportFaceQualityPro = false;  //人脸优选
var isSupoortHeatMap = false;
var isSupportsystemSetUpLink = false; //是否支持天网卡口与通用智能切换
var isSupportRectManulTrack = false;//是否支持手动跟踪

//海思出入口卡口
var isSupportMoreCamera = false;
var isSupportTrafficParam = false;
var isSupportIllegalParam = false;
var isSupportDeviceCombinePic = false;
var FaceSmallPicArr = [];
var TGTypeArr = [];
var EPTypeArr = [];
var isSupportSpeedModify = false;
var isSupportVideoDetect = false;
var isSupportPassCarDirection = false;
var isSupportPassCarPic = false;

// 卡口电警临时处理，待修改
var isSupportHorizontalMenu = false;//设备界面是否横向排列
var isSupportdebuggerCfgIVABall = false;//设备是否支持调试功能页面
var isSupportwhiteList = false;
var isSupport3DdenoiseTip = false;
var isSupportBasicTemperature = false;
var isSupportSingleCloseUp = false;
var isSupportOnlyEncodeQuality = false;//图像清晰度是否仅支持编码参数编码
var isSupportStrobe = false;
var isSupportACSyncPhase = false;
var isSupportMCC = false;//是否支持相机通信
var isSupportInlay = false;//是否支持内置车位指示灯
var isSupportOutlay = false;//是否支持外置车位指示灯
var isSupportMultiDetect = false;//是否支持多帧识别
var isSupportNoneCapture = false;//是否支持空抓拍
var isSupportPhotoCfg = false;//本地配置是否支持照片配置
var isSupportLiveSwitch = false;//是否支持实况照片切换
var isSupportOnvifPicStream = false;//是否支持Onvif上报照片流
var isSupportTrafficFlow = false;//交通流量机
var isLandSide = false;             //是否为路侧车位检测器
var isSupportCarPortServer = false; //是否支持车位服务器
var isModuleVin = false;      //是否为机芯制式
var UCODEMode = [];
var maxStreamNum = 1;
var coverOsdNum = 8;
var helpType = 0;
var networkType = 0;
var motionAreaNum = 4;
var openFlashType = 0;
var hiddenStreamNum = 0;
var sceneNum = 4;
var ProductType = 1;
var Provider;
var IVADeviceType = 1;
var carportCount = 3;
var IrisNum = 0;
var infoOSDNum = 8;
var FPortNum = 4;
var PPortNum = 4;
var RSVNum = 4;
var ElectPortNum = 1;//1代表不支持双网隔离
var routeMaxNum = 16;//最多只能添加16条路由数据
var demoPtzMaxSpeed = 9;
var demoPtzMinSpeed = 1;
var demoPtzMaxLockForce = 100;
var demoPtzMinLockForce = 0;
var demoPtzMinVerAngle = 0;
var demoPtzMaxVerAngle = 90;
var ptzType = 1;
var PresetNum = 255;
var customType = 0; // 定制类型（0：无定制）
var isSupportNet4G = false; // 4G
var isSupportSoftAPWiFi = false; // wifi热点
var isSupportNormalWiFi = false; // NormalWiFi
var isSupportSnifferWIFI = false; // SnifferWIFI

var isSupportBattery = false; // 电池
var ParseEncodeDir = "Encode";// 能力集解析节点

var isSupportEDP = false;//工程参数页面
var ProjectLenstypeMode = [];//镜头类型

var isNotSupportSwitchOutPlan = false;
var isSupportSpecialPlate = false;

var switchOutArr = [];
var sceneCapArr = [];
var osdTypeList = [];
var switchInArr = [];
var focusMinDistanceArr = [];
var maxDigitalZoomArr = [];
var networkModeArr = [];
var netIPTypeArr = [];
var osdFontStyleArr = [];
var ruleTypeArr = [];
var filterTypeArr = [];
var captureTypeArr = [];
var audioFormatArr = [];
var audioSampling = {};
var audioSourceArr = [];
var storTypeArr = [];
var LEDStatusArr = [];
var TMSProtocolArr = [];
var strobeLightIDArr = [];
var FTPPathNameArr = [];
var FTPFileNameArr = [];
var BasicFTPPathNameArr = [];
var BasicFTPFileNameArr = [];
var vehicleRecordOSDArr = [];
var peccancyRecordOSDArr = [];
var peccancySyntPicOSDArr = [];
var TGSyntPicOSDArr = [];
var closeUpOSDArr = [];
var vehicleRecordGlobalOSDArr = [];
var peccancyRecordGlobalOSDArr = [];
var peccancySyntPicGlobalOSDArr = [];
var TGSyntPicGlobalOSDArr = [];
var closeUpGlobalOSDArr = [];
var IrisDefaultValueArr = [];
var GopTypeArr = [];
var osdFontSizeArr = ["0","1","2","3"];
var marginArr = ["0","1","2"];
var serialIDArr = [1];
var serialModeArr = [];
var serialTypeArr = [];
var versionType = VersionType.NONE;
var IrisModeArr = [];
var MaxVerAngle = [];
var intellisenseWorkTypeArr = [];
var maxZoom = 1000;
var TGEPSwitchArr = [];
var SpecialPlateModeArr = [];
var AudioInItem0Mode = [];
var AudioInItem1Mode = [];
var vehicleFeatureArr = [];
var rainbrushModeList = [];
var AudioInNum;
var RoiAreaNum;
var IOMap = {
    "PPortModeList" : [],
    "FPortModeList" : [],
    "RSVModeList" : []
};
var NetPeripheralArr = [];//表示支持哪些网络外设

var imgCapInfo = "";
var capInfoMap = {
    VinMode : null,
    Resolution : null,
    EncodeFormat : null,
    ALONE : null,
    CONV : null
};

var FishEyeRTcapInfoMap = {
    VinMode : null,
    Resolution0 : null,
    Resolution1 : null,
    Resolution2 : null
};

var FishEyeNRTcapInfoMap = {
    VinMode : null,
    Resolution0 : null,
    Resolution1 : null,
    Resolution2 : null
};

var InlayLedColorArr = [];
var OutlayLedColorArr = [];
var isSupportIpcCapture = false;     //天网卡口
var isSupportNonVehicleDetect = false; //机非人流量统计
   //智能业务页面
var isSupportOnlyCapHead = false; //只抓拍车头
var isSupportdirectionDL = false;  //行驶方向
   //图片处理页面
var isSupportkakou1 = false; // 抓拍帧保留
   //车牌参数
var isSupportexDevTimeout = false;// 外设心跳时间
var isSupportTelPhone = false; //打电话检测
var isSupportwhiteListFieldset = false; //白名单配置
var isSupportVehicleFeature = false; //车牌特征参数
var isSupportLPRParm = false; //本地车牌匹配字段
  //照片OSD
var isSupportSubOSDMode = false; //叠加模式(暂未用到)
var isSupportSpeedPercent = false;   //超速百分比(暂未用到)
var isSupportCharacterGap = false;  //字符间隔(暂未用到)
var DevTypeArr =[];

// 获得设备能力参数
function getCapInfo() {
    var top = GetTopWindow();
    var xmlDom = loadXML("device_cap.xml");
    if (!xmlDom) return;
    var $xml = $(xmlDom);

    // 产品类型（行业，海外，分销，工程商）
    if ("undefined" != typeof showVersionType) {
        versionType = showVersionType;
    }

    isSupportHorizontalMenu = ($xml.find("Function SupportHorizontalMenu").length > 0);//界面是否为横向排列
    isSupportdebuggerCfgIVABall = ($xml.find("Function DebuggerCfgIVABallLink").length > 0);//界面是否支持调试功能页面

    // 功能能力
        isSupportRoi = ($xml.find("Function ROI").length > 0);
        if(isSupportRoi){
            RoiAreaNum = Number($xml.find("Function ROI").text());
        }
        isSupportSerialTransport = ($xml.find("Function SerialTransport").length > 0);
        isSupportRealtimeStatus = ($xml.find("Function RealtimeStatus").length > 0);
        isSupportMediaStream = ($xml.find("Function MediaStream").length > 0);
        isSupportVirtualCoil = ($xml.find("Function VirtualCoil").length > 0);
        isSupportIntelArea = ($xml.find("Function IntelArea").length > 0);
        isSupportPatchUpdate = ($xml.find("Function PatchUpdate").length > 0);
        isSupportAutoReboot =  ($xml.find("Function AutoReboot").length > 0);
        isSupportSansuo = ($xml.find("Function SansuoMode").length > 0);
        isSupportHDMM = ($xml.find("Function OtherCtrlHcm").length > 0);
        isSupportFishEye = ($xml.find("Function PearlEye").length > 0);
        isSupportFishGun = ($xml.find("Function PearlEyeSwitch").length > 0);
        isSupportMicOut = ($xml.find("Audio AudioOut LoudSpeaker").length > 0);
        //是否支持SVC
        isSupportSVC = ($xml.find("Encode SvcMode").length > 0);
        //是否支持UCCODE
        isSupportUCODE = ($xml.find("Encode UCode").length > 0);
        if(isSupportUCODE){
            UCODEMode = $xml.find("Encode UCode Mode").text().split(",");
        }else{
            UCODEMode = null;
        }
        //是否是机芯制式
        isModuleVin = ($xml.find("Encode ModuleVin").length > 0);
        // TODO:临时处理，待修改
        isSupportBasicTemperature = ($xml.find("Function BasicTemperature").length > 0);
        ParseEncodeDir = isSupportFishEye? "PearlEyeEncode" : "Encode";
        isSupportSingleCloseUp = ($xml.find(ParseEncodeDir + " Resolution_closeup").length > 0);
        // 特写图分辨率
        if (isSupportSingleCloseUp) {
            capInfoMap["Resolution_closeup"] = $xml.find(ParseEncodeDir + " Resolution_closeup").text().split(",");
        }
        isSupportOnlyEncodeQuality = ($xml.find("Function functionSupport OnlyEncodeQuality").length > 0);
        isSupportBasicSwitchIn = ($xml.find("Function BasicSwitchIn").length > 0);
        isSupportBasicSwitchOut = ($xml.find("Function BasicSwitchOut").length > 0);
        ProductType = Number($xml.find("ProductType").text());
        Provider = Number($xml.find("Intelligent Provider").text());
        isSupportFishIpc = (1 == Number($xml.find("Hardware SpecialLensType").text()));
        isSupportDST = ($xml.find("Function DST").length > 0);
        isSupportPortCfg = !($xml.find("Function NoSupportPort").length > 0);
        isSupportHttps = !($xml.find("Function NoSupportHttps").length > 0);
        isSuppprtIEEE8021x = ($xml.find("MWare Network IEEE8021x").length > 0);
        isSupportDemo = ($xml.find("Function Demo").length > 0);
        if (isSupportDemo) {
            isSupportDCOut = ($xml.find("Function Demo DCOut").length > 0);
            isSupportViewMode = ($xml.find("Function Demo ViewMode").length > 0);
            isSupportSendMode = ($xml.find("Function Demo SendMode").length > 0);
            isSupportLowDelay = ($xml.find("Function Demo LowDelay").length > 0);
            isSupportHCMLowDelay = ($xml.find("Function Demo HCMLowDelay").length > 0);
            isSupportIVALPCheck = ($xml.find("Function Demo IVALPCheck").length > 0);
            isSupportIVADebug = ($xml.find("Function IVADebug").length > 0);
            isSupportSpecialLens = ($xml.find("Function Demo SpecialLens").length > 0);
        }
        isSupportsystemSetUpLink = (DeviceType.DEVICE_IVACOMMON == ProductType && (6 == Provider || 1 == Provider));
        isSupport485SerialChange = ($xml.find("Function Debugger Support485SerialChange").length > 0);
        isSupportCommonHeatSwitch = ($xml.find("Function Debugger HeatSwitch").length > 0);
        isSupportSwitchTrembleTime  = ($xml.find("Function Debugger SwitchTrembleTime").length > 0);
        isSupportDebugger = ($xml.find("Function Debugger").length > 0);
        if (isSupportDebugger) {
            isSupportTGEPSwitch = ($xml.find("Function Debugger TGEPSwitch").length > 0);
            if(isSupportTGEPSwitch) {
                TGEPSwitchArr = $xml.find("Function Debugger TGEPSwitch").text().split(",");
            }
            isSupportDBSerialTransport = ($xml.find("Function Debugger DBSerialTransport").length > 0);
        }

        if ($xml.find("Function HelpType").length > 0) {
            helpType = Number($xml.find("Function HelpType").text());
        }

        isSupportCapture = ($xml.find("Function Capture").length > 0);
        if (isSupportCapture && $xml.find("Function Capture CaptureType").length > 0) {
            captureTypeArr = $xml.find("Function Capture CaptureType Mode").text().split(",");
        }
        //暂时屏蔽天网卡口功能，待切完道路监控接口后开放
        isSupportIpcCapture = ($xml.find("Intelligent SmartTraffic").length > 0);
        isSupportTrafficFlow = ($xml.find("Function TrafficFlow").length > 0);
        //天网卡口机非人流量检测
        isSupportNonVehicleDetect = (1 == Number($xml.find("Function functionSupport NonVehicleDetect").text()));

        isSupportStrobe = ($xml.find("Function StrobeMode").length > 0);
        if(isSupportStrobe) {
            isSupportACSyncPhase = ($xml.find("Function StrobeMode ACSyncPhase").length > 0);
        }

        isSupportMCC = ($xml.find("Function SupportMCC").length > 0);
        isSupportMultiDetect = ($xml.find("Function MultiDetect").length > 0);
        isSupportNoneCapture = ($xml.find("Function NoneCapture").length > 0);
        isSupportPhotoCfg = ($xml.find("Function PhotoCfg").length > 0);
        isSupportLiveSwitch = ($xml.find("Function LiveSwitch").length > 0);
        isSupportOnvifPicStream = ($xml.find("Function OnvifPicStream").length > 0);

        isSupportInlay = ($xml.find("Function InLayLedCFG").length > 0);
        if(isSupportInlay) {
            InlayLedColorArr = $xml.find("Function InLayLedCFG LedColorType").text().split(",");
        }

        isSupportOutlay = ($xml.find("Function OutLayLedCFG").length > 0);
        if(isSupportOutlay) {
            OutlayLedColorArr = $xml.find("Function OutLayLedCFG LedColorType").text().split(",");
        }

        isSupportEDP = ($xml.find("Intelligent ProjectLens").length > 0);
        if(isSupportEDP) {
            ProjectLenstypeMode = $xml.find("Intelligent ProjectLens Mode").text().split(",");
        }

        isLandSide = ($xml.find("Function LandSide").length > 0);
        isSupportCarPortServer = ($xml.find("Intelligent CarPortServer").length > 0);
        isSupportSpecialPlate = ($xml.find("Intelligent SpecialPlate").length > 0);
        if (isSupportSpecialPlate) {
            SpecialPlateModeArr = ($xml.find("Intelligent SpecialPlate Mode").text().split(","));
        }

    // 获取编码能力集
        var n, i, j, tmpList, frameName;
        for (n in capInfoMap) {
            if ($xml.find(n).length > 0) {
                capInfoMap[n] = $xml.find(n).text().split(",");
            }
        }

        for (n in FishEyeRTcapInfoMap) {
            if($xml.find("NormalEncodeMode > " + n).length > 0) {
                FishEyeRTcapInfoMap[n] = $xml.find("NormalEncodeMode > " + n).text().split(",");
            }
        }

        for (n in FishEyeNRTcapInfoMap) {
            if($xml.find("DelayEncodeMode > " + n).length > 0) {
                FishEyeNRTcapInfoMap[n] = $xml.find("DelayEncodeMode > " + n).text().split(",");
            }
        }

        capInfoMap["MaxStream"] = $xml.find(ParseEncodeDir + " MaxStream").text().split(",");

        // 是否禁止修改主码流分辨率
        capInfoMap["NoModifyMainPicSize"] = ($xml.find("Encode NoModifyMainPicSize").length > 0);

        // 辅码流分辨率
        if ($xml.find(ParseEncodeDir + " Resolution1").length > 0) {
            capInfoMap["Resolution1"] = $xml.find(ParseEncodeDir + " Resolution1").text().split(",");
        }

        // 第三流分辨率
        if ($xml.find(ParseEncodeDir + " Resolution2").length > 0) {
            capInfoMap["Resolution2"] = $xml.find(ParseEncodeDir + " Resolution2").text().split(",");
        }

        // 抓拍流能力
        if ($xml.find(ParseEncodeDir + " HiddenStream").length > 0) {
            hiddenStreamNum = Number($xml.find(ParseEncodeDir + " HiddenStream Number").text());
            isSupportMJPEG = ($xml.find(ParseEncodeDir + " MJPEG").length > 0);
            isSupportJPEG = ($xml.find(ParseEncodeDir + " JPEG").length > 0);
            // JPEG分辨率
            if (isSupportJPEG && $xml.find(ParseEncodeDir + " Resolution_jpeg").length > 0) {
                capInfoMap["Resolution_jpeg"] = $xml.find(ParseEncodeDir + " Resolution_jpeg").text().split(",");
            }
        }

        // 抓图流能力
        isSupportBasicCapture = ($xml.find(ParseEncodeDir + " BasicJPEG").length > 0);

        maxStreamNum = Number(capInfoMap["MaxStream"][0]) - hiddenStreamNum;

        tmpList = capInfoMap["VinMode"];
        for (i = 0; i < tmpList.length; i++) {
            frameName = "Framerate_" + tmpList[i].replace(/\*/g, "x").trim();
            if ($xml.find(frameName).length > 0) {
                capInfoMap[frameName] = $xml.find(frameName).text().split(",");
            }

            for(j = 0; j < maxStreamNum; j++) {
                if ($xml.find("NormalEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " Resolution" + j).length > 0) {
                    FishEyeRTcapInfoMap["RT_Resolution" + j + "_" + tmpList[i].replace(/\*/g, "x")] = $xml.find("NormalEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " Resolution" + j).text().split(",");
                }
            }

            if($xml.find("NormalEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " FrameRate").length > 0) {
                capInfoMap["RT_FrameRate_" + tmpList[i].replace(/\*/g, "x")] = $xml.find("NormalEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " FrameRate").text().split(",");
            }

            for(j = 0; j < maxStreamNum; j++) {
                if ($xml.find("DelayEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " Resolution" + j).length > 0) {
                    FishEyeRTcapInfoMap["NRT_Resolution" + j + "_" + tmpList[i].replace(/\*/g, "x")] = $xml.find("DelayEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " Resolution" + j).text().split(",");
                }
            }

            if($xml.find("DelayEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " FrameRate").length > 0) {
                capInfoMap["NRT_FrameRate_" + tmpList[i].replace(/\*/g, "x")] = $xml.find("DelayEncodeMode VinMode_" + tmpList[i].replace(/\*/g, "x") + " FrameRate").text().split(",");
            }
        }

        if ($xml.find(ParseEncodeDir + " IgnoreResolutionLimit").length > 0) {
            capInfoMap["IgnoreResolutionLimit"] = Number($xml.find(ParseEncodeDir + " IgnoreResolutionLimit").text());

        }
        if ($xml.find(ParseEncodeDir + " GopType").length > 0) {
            GopTypeArr = $xml.find(ParseEncodeDir + " GopType Mode").text().split(",");
        }
        isSupportH265 = (isContainsElement(VideoFormat.H265, capInfoMap["EncodeFormat"]) > -1);
    // 硬件能力
        // 开关量输入
        isSupportSwitchIn = ($xml.find("Hardware SwitchIn").length > 0);
        if ($xml.find("Hardware SwitchOut Channel").length > 0) {
            switchOutArr = $xml.find("Hardware SwitchOut Channel").text().split(",");
        }

        // 开关量输出
        isSupportSwitchOut = ($xml.find("Hardware SwitchOut").length > 0);
        if ($xml.find("Hardware SwitchIn Channel").length > 0) {
            switchInArr = $xml.find("Hardware SwitchIn Channel").text().split(",");
        }

        isNotSupportSwitchOutPlan = ($xml.find("BasicSwitchOut HiddenAlarmPlan").length > 0);

        // 安装高度
        isSupportIntallHeight = ($xml.find("Hardware IntallHeight").length > 0);

        // 除雪
        isSupportClearSnow = ($xml.find("Hardware ClearSnow").length > 0);
        //除雾
        isSupportClearFog = ($xml.find("Hardware ClearFog").length > 0);

        // 电动镜头（变倍，对焦）
        isSupportLens = ($xml.find("Hardware Lens").length > 0);
        if (isSupportLens) {
            isSupportIRIS = ($xml.find("Hardware IRIS").length > 0);
            isSupportLenIfMode = ($xml.find("Hardware Lens IFMode").length > 0);
            isSupportZoomLimitSwitch = ($xml.find("Hardware Lens ZoomLimitSwitch").length > 0);

            if ($xml.find("Hardware Lens MinDistance").length > 0) {
                focusMinDistanceArr = $xml.find("Hardware Lens MinDistance Mode").text().split(",");
            }
            isSupportResetMotorLens = ($xml.find("Hardware ResetMotorLens").length > 0);
        }
        if ($xml.find("Function DigitalZoom").length > 0) {
            maxDigitalZoomArr = $xml.find("Function DigitalZoom Mode").text().split(",");
            maxZoom = maxDigitalZoomArr[maxDigitalZoomArr.length-1];
        }
        isSupportPIRIS = ($xml.find("Hardware PIRIS").length > 0);
        if (isSupportPIRIS) {
            IrisNum = Number($xml.find("Hardware PIRIS Cnt").text());
            for (var i = 0; i < IrisNum; i++) {
                IrisDefaultValueArr[i] = $xml.find("Hardware PIRIS Item" + i + " OptIRIS").text();
            }
        }
        // ABF
        isSupportABF = ($xml.find("Hardware ABF").length > 0);
        //MBF
        isSupportMBF = (isRefactor)? ($xml.find("Hardware MBF").length > 0) : isSupportABF;

        // 走廊模式
        isSupportAlureMode = ($xml.find("Hardware AlureMode").length > 0);

        // BNC输出
        isSupportBNC = ($xml.find("Hardware BNC").length > 0);

          //镜头类型
          isSupportLensType = ($xml.find("Hardware Lens LensType").length > 0);
        //双网隔离
        ElectPortNum = Number($xml.find("Network ElectPortNum").text());
        isSupportNetIfaceNum = ElectPortNum > 1;
        routeMaxNum = Number($xml.find("Network RouteMaxNum").text());
        //非自研设备
          isNOSDevHCM = ($xml.find("Hardware NoSelfDevelopHCM").length > 0);
          //IO端口相关配置
          isSupportIOPort = ($xml.find("Hardware IOPort").length > 0);
          isSupportRSV = ($xml.find("Hardware IOPort RSVPort").length > 0);
          FPortNum = $xml.find("Hardware IOPort FPort Number").text();
          PPortNum = $xml.find("Hardware IOPort PPort Number").text();
          RSVNum = $xml.find("Hardware IOPort RSVPort Number").text();

          var preList = ["P","F","RSV"];
          for(var i = 0; i < PPortNum; i++) {
              var arrP = $xml.find(preList[0]+"Port"+i+" Mode").text().split(",");
              IOMap["PPortModeList"].push(arrP);
          }
          for(var i = 0; i < FPortNum; i++) {
              var arrF = $xml.find(preList[1]+"Port"+i+" Mode").text().split(",");
              IOMap["FPortModeList"].push(arrF);
          }
          for(var i = 0; i < RSVNum; i++) {
              var arrV = $xml.find(preList[2]+"Port"+i+" Mode").text().split(",");
              IOMap["RSVModeList"].push(arrV);
          }


          //DDR频率设置
          isSupportDDR=($xml.find("Hardware DDR").length > 0);

          //光圈模式
          IrisModeArr = (isRefactor && !isSupportHorizontalMenu) ? [0, 1] : $xml.find("IrisMode").text().replace(/\s/g,  "").split(",");

        // 电池
        isSupportBattery =($xml.find("Hardware Battery").length > 0);

        //风扇
        isSupportFan = ($xml.find("Hardware Fan").length > 0);

    // 智能类别
    if ($xml.find("Intelligent").length > 0) {
        IVADeviceType = Number($xml.find("Intelligent IVAType Mode").text());
        isSupportSmart= (IVADeviceType == IVADeviceMode.SMART);
        isSupportIVA = ((IVADeviceType == IVADeviceMode.HISI) || (IVADeviceType == IVADeviceMode.TI));
        isSupportIvaPark = (IVADeviceType == IVADeviceMode.PARK);
        isSupportAlterLampCtrl = ($xml.find("Intelligent AlterLampCtrl").length > 0);
        isSupportUsualCapture = (IVADeviceType == IVADeviceMode.UCPT);
        isSupportTWCpt = (IVADeviceType == IVADeviceMode.TWCPT);
        sceneNum = Number($xml.find("Intelligent SceneNum").text());
        isSupportSmartTrack = ($xml.find("Intelligent PTZSmartTrack").length > 0);
        isSupoortHeatMap = ($xml.find("Intelligent Heatmap").length > 0);
        if ($xml.find("Intelligent RuleType").length > 0) {
            ruleTypeArr = $xml.find("Intelligent RuleType Mode").text().split(",");
        }
        isSupportIntellisense=($xml.find("Intelligent Intellisense").length > 0);
        if (isSupportIntellisense) {
            isSupportSnifferWIFI=($xml.find("Intelligent Intellisense Wifi").length > 0);
            intellisenseWorkTypeArr =  $xml.find("Intelligent Intellisense Mode").text().split(",");
            isSupportEleCompass = ($xml.find("Intelligent Intellisense Ecompass").length > 0);
        }
        isSupportAutoTrack = ($xml.find("Intelligent AutoTrack").length > 0);
        isSupportIgnoreArea = ($xml.find("Intelligent IgnoreArea").length > 0);
        isSupportFilterType = ($xml.find("Intelligent FilterType").length > 0);

        isSupportPersonPhoto = ($xml.find("Intelligent FaceDetectPro").length > 0);
        isSupportFaceDetection= ($xml.find("Intelligent FaceRecogPro").length > 0);
        isSupportFaceQualityPro = ($xml.find("Intelligent FaceQualityPro").length > 0);
        if ($xml.find("Intelligent FilterType Mode").length > 0) {
            filterTypeArr = $xml.find("Intelligent FilterType Mode").text().split(",");
        }
        if (isSupportIvaPark) {
            carportCount = Number($xml.find("Intelligent CarPortNum").text());
        }

        isSupportOnlyCapHead = ($xml.find("Function functionSupport OnlyCaptureHead").length > 0);
        isSupportdirectionDL = ($xml.find("Function functionSupport VehicleRunDirc").length > 0);
        isSupportkakou1 = ($xml.find("Function functionSupport RemainCaptureFrame").length > 0);
        isSupportexDevTimeout = ($xml.find("Function functionSupport DeviceHeatbeat").length > 0);
        isSupportTelPhone = ($xml.find("Function functionSupport TelePhone").length > 0);
        isSupportwhiteListFieldset = ($xml.find("Function functionSupport WhiteList").length > 0);
        isSupportLPRParm = ($xml.find("Function functionSupport LPRParm").length > 0);
        isSupportVehicleFeature = ($xml.find("Function functionSupport VehicleFeature").length > 0);
        vehicleFeatureArr = $xml.find("Function functionSupport VehicleFeature").text().split(",");

        isSupportOffday = !isSupportUsualCapture;
        isSupportIllegalpic = !isSupportUsualCapture;
        isSupportCommonCapture = !isSupportUsualCapture;
        isSupportAnyCfg = !isSupportUsualCapture;
        isSupportEncodePic = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonGB = !isSupportUsualCapture;
        isSupportCommonPicVersion = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonPicUploadInterval = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonOSD = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonAutoGrab = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonSpeedLimit = !isSupportUsualCapture;
        isSupportCommonCarBodyColorSnd = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonIDDL = !isSupportUsualCapture && !isSupportTrafficFlow && ($xml.find("Function functionSupport VehicleDetectID").length > 0);
        isSupportCommonDrivewayType = !isSupportUsualCapture;
        isSupportCommonDrivewayAdvance = !isSupportUsualCapture && !isSupportTrafficFlow;
        isSupportCommonDetectorSwitch = !isSupportUsualCapture;
        isSupportCommonExposure = !isSupportUsualCapture;
        isSupportCommonLoopCoil = !isSupportUsualCapture && !isSupportTrafficFlow && ($xml.find("Function functionSupport CoilID").length > 0);
        isSupportCommonIVALight = !isSupportUsualCapture;
        isSupportCommonAdv = !isSupportUsualCapture;
        isSupportTrafficcontrol = !isSupportUsualCapture;
        isSupportTripThread = !isSupportUsualCapture && !top.banner.isSupportTrafficFlow;
        isSupportSmartPeopleCount = ($xml.find("Intelligent SmartPeopleCount").length > 0);
        isSupportSmartTraffic = ($xml.find("Intelligent SmartTraffic").length > 0);
        isSupportSmartOSD = ($xml.find("Intelligent SmartOSD").length > 0);
        isSupportTrafficDataServerStatus = ($xml.find("Intelligent TrafficDataServerStatus").length > 0);
        isSupportLEDCtrl = ($xml.find("Intelligent CarPortLEDCtrl").length > 0);
        isSupportNetPeripheral = ($xml.find("Intelligent NetPeripheral").length > 0);
        if (isSupportNetPeripheral) {
            NetPeripheralArr = $xml.find("Intelligent NetPeripheral Mode").text().split(",");
        }

        //海思出入口卡口
        isSupportTrafficParam = !($xml.find("Function functionSupport TrafficParam").length > 0);
        isSupportIllegalParam = !($xml.find("Function functionSupport IllegalParam").length > 0);
        isSupportDeviceCombinePic = !($xml.find("Function functionSupport DeviceCombinePic").length > 0);
        isSupportMoreCamera = !($xml.find("Function functionSupport MoreCamera").length > 0);
        if($xml.find("Function Face Mode").length > 0) {
            FaceSmallPicArr = $xml.find("Function Face Mode").text().split(",");
        }
        if($xml.find("Function TGType Mode").length > 0) {
            TGTypeArr = $xml.find("Function TGType Mode").text().split(",");
        }
        if($xml.find("Function EPType Mode").length > 0) {
            EPTypeArr = $xml.find("Function EPType Mode").text().split(",");
        }
        isSupportSpeedModify = !($xml.find("Function functionSupport SpeedModify").length > 0);
        isSupportVideoDetect = !($xml.find("Function functionSupport VideoDetect").length > 0);
        isSupportPassCarDirection = !($xml.find("Function functionSupport PassCarDirection").length > 0);
        isSupportPassCarPic = !($xml.find("Function functionSupport PassCarPic").length > 0);
    }
        // OSD
        if ($xml.find("OSD InfoOSD Number").length > 0) {
            infoOSDNum =  Number($xml.find("OSD InfoOSD Number").text());
        }
        isSupportCoverOsd = ($xml.find("OSD CoverOSD").length > 0);
        if (isSupportCoverOsd) {
            coverOsdNum = Number($xml.find("OSD CoverOSD Number").text());
        }
        if ($xml.find("OSD InfoOSD Mode").length > 0) {
            osdTypeList = $xml.find("OSD InfoOSD Mode").text().split(",");
        }
        isSupportFontStyle = ($xml.find("OSD FontStyle").length > 0);
        if (isSupportFontStyle) {
            osdFontStyleArr = $xml.find("OSD FontStyle Mode").text().split(",");
        }
        if ($xml.find("OSD VehicleRecordOSD Mode").length > 0) {
            vehicleRecordOSDArr = $xml.find("OSD VehicleRecordOSD Mode").text().split(",");
        }
        isSupportSpeedPercent = ($xml.find("OSD VehicleRecordOSD OverSpeedPercent").length > 0);
        isSupportCharacterGap = ($xml.find("OSD VehicleRecordOSD FontSpace").length > 0);
        isSupportSubOSDMode = ($xml.find("OSD VehicleRecordOSD OSDPosType").length > 0);
        if ($xml.find("OSD PeccancyRecordOSD Mode").length > 0) {
            peccancyRecordOSDArr = $xml.find("OSD PeccancyRecordOSD Mode").text().split(",");
        }
        if ($xml.find("OSD PeccancySyntPicOSD Mode").length > 0) {
            peccancySyntPicOSDArr = $xml.find("OSD PeccancySyntPicOSD Mode").text().split(",");
        }
        if ($xml.find("OSD TollgateSyntPicOSD Mode").length > 0) {
            TGSyntPicOSDArr = $xml.find("OSD TollgateSyntPicOSD Mode").text().split(",");
        }
        if ($xml.find("OSD CloseupPicOSD Mode").length > 0) {
            closeUpOSDArr = $xml.find("OSD CloseupPicOSD Mode").text().split(",");
        }
        if ($xml.find("OSD VehicleRecordOSD GlobalOSD").length > 0) {
            vehicleRecordGlobalOSDArr = $xml.find("OSD VehicleRecordOSD GlobalOSD").text().split(",");
        }
        if ($xml.find("OSD PeccancyRecordOSD GlobalOSD").length > 0) {
            peccancyRecordGlobalOSDArr = $xml.find("OSD PeccancyRecordOSD GlobalOSD").text().split(",");
        }
        if ($xml.find("OSD PeccancySyntPicOSD GlobalOSD").length > 0) {
            peccancySyntPicGlobalOSDArr = $xml.find("OSD PeccancySyntPicOSD GlobalOSD").text().split(",");
        }
        if ($xml.find("OSD TollgateSyntPicOSD GlobalOSD").length > 0) {
            TGSyntPicGlobalOSDArr = $xml.find("OSD TollgateSyntPicOSD GlobalOSD").text().split(",");
        }
        if ($xml.find("OSD CloseupPicOSD GlobalOSD").length > 0) {
            closeUpGlobalOSDArr = $xml.find("OSD CloseupPicOSD GlobalOSD").text().split(",");
        }
        if ($xml.find("OSD FontSize Mode").length > 0) {
            osdFontSizeArr = $xml.find("OSD FontSize Mode").text().split(",");
        }
        if ($xml.find("OSD Margin Mode").length > 0) {
            marginArr = $xml.find("OSD Margin Mode").text().split(",");
        }

    // 串口
        var i, j, len;
        isSupportSerial = ($xml.find("Serial Mode").length > 0);
        if ($xml.find("Serial EnableChannel").length > 0) {
            serialIDArr = $xml.find("Serial EnableChannel").text().split(",");
        }
        for(i = 0; i < serialIDArr.length; i++) {
            var arr = $xml.find("Serial Serial"+serialIDArr[i]+" Mode").text().split(",");
            for(j = 0; j < arr.length; j++) {
                if (isSubDevice(arr[i])) {
                    isSupportSubDevice = true;
                    break;
                }
            }
            serialModeArr.push(arr);
            var type = $xml.find("Serial Serial"+serialIDArr[i]+" Type").text();
            serialTypeArr.push(type);
        }

    // 图像参数能力集

        if ($xml.find("Image Scene").length > 0) {
            sceneCapArr = $xml.find("Image Scene Mode").text().split(",");
        }
        isSupportNoAuto = ($xml.find("Image Scene NoAuto").length > 0);

        isNOSensitivity = ($xml.find("Image Video Exposure DayNight NoSensitivity").length > 0);
        if ($xml.find("Image ImageType").length > 0) {
            isSupportJPEGConfig = (isContainsElement("1", $xml.find("Image ImageType").text().split(",")) > -1)
        }
        isSupport3DdenoiseTip = ($xml.find("Image Video Enhance Denoise _3Dlimit").length > 0);

        isSupportAreaFocus = ($xml.find("Video Focus Mode").text().split(",").length >= 3);

    // 网口
        // 解析网口类型
        if ($xml.find("Network PortMode").length > 0) {
            networkType = Number($xml.find("Network PortMode").text());
        }
        isSupportWifi = ($xml.find("Network Wifi").length > 0);
        isSupportUNP = ($xml.find("Network UNP").length > 0);
        isSupportMycloud = ($xml.find("Network Mycloud").length > 0);
        isSupportBasicFTP = ($xml.find("Network BasicFTP").length > 0);
        if (($xml.find("Network BasicFTP PathName Mode")).length > 0) {
            BasicFTPPathNameArr = $xml.find("Network BasicFTP PathName Mode").text().split(",");
        }
        if (($xml.find("Network BasicFTP FileName Mode")).length > 0) {
            BasicFTPFileNameArr = $xml.find("Network BasicFTP FileName Mode").text().split(",");
        }
        isSupportEmail = ($xml.find("Network Email").length > 0);
        // 解析网口工作模式
        if ($xml.find("Network WorkMode").length > 0) {
            networkModeArr = $xml.find("Network WorkMode").text().split(",");
        }
        if ($xml.find("Network IPType").length > 0) {
            netIPTypeArr = $xml.find("Network IPType Mode").text().split(",");
        }
    isSupportSSLVPN = ($xml.find("Network SSLVPN").length > 0);
    isSupportNet4G = ($xml.find("Network Net4G").length > 0);
    isSupportSoftAPWiFi = ($xml.find("Network SoftAPWiFi").length > 0);
    isSupportNormalWiFi = ($xml.find("Network NormalWiFi").length > 0);
    isSupportSecureAccess = ($xml.find("Network SecureAccess").length > 0);


    // 告警
        isSupportAlarm = ($xml.find("Alarm").length > 0);
        // 解析运动检测告警
        isSupportMotionDetection = ($xml.find("Alarm MotionDetection").length > 0);
        if (isSupportMotionDetection) {
            motionAreaNum = Number($xml.find("Alarm MotionDetection Num").text());
            isSupportMotionLinkPreset = ($xml.find("Alarm MotionDetection MotionLinkPreset").length > 0);
            isSupportLineMotionDetection = ($xml.find("Alarm MotionDetection LineDetect").length > 0);
        }
        isSupportDiamodDetection = ($xml.find("Alarm DiamondDetect").length > 0);
        isSupportTamperDetect = ($xml.find("Alarm MaskDetection").length > 0);
        isSupportTemperatureDetect = ($xml.find("Alarm TemperatureDetection").length > 0);
        isSupportWetDetect = ($xml.find("Alarm WetDetect").length > 0);
    isSupportChain = ($xml.find("MWare Alarm SmartAlarm SmartChainCalc").length > 0);
    isSupportSmartAlarm = ($xml.find("Alarm SmartAlarm").length > 0);
    if (isSupportSmartAlarm) {
        isSupportCrossLine = ($xml.find("Alarm SmartAlarm CrossLine").length > 0);
        isSupportIntrosionZone = ($xml.find("Alarm SmartAlarm IntrosionZone").length > 0);
        isSupportEnterZone = ($xml.find("Alarm SmartAlarm EnterZone").length > 0);
        isSupportLeafeZone = ($xml.find("Alarm SmartAlarm LeaveZone").length > 0);
        isSupportOutFocus = ($xml.find("Alarm SmartAlarm OutFocus").length > 0);
        isSupportSceneChange = ($xml.find("Alarm SmartAlarm SceneChange").length > 0);
        isSupportFaceDetect = ($xml.find("Alarm SmartAlarm FaceDetect").length > 0);
        isSupportWanderDetect = ($xml.find("Alarm SmartAlarm WanderDetect").length > 0);
        isSupportPeopleGather = ($xml.find("Alarm SmartAlarm PeopleGather").length > 0);
        isSupportFastMove = ($xml.find("Alarm SmartAlarm FastMove").length > 0);
        isSupportParkDetect = ($xml.find("Alarm SmartAlarm ParkDetect").length > 0);
        isSupportLeftGood = ($xml.find("Alarm SmartAlarm LeftGood").length > 0);
        isSupportHandleGood = ($xml.find("Alarm SmartAlarm HandleGood").length > 0);
        isSupportSmartAdvanceParam = (isSupportCrossLine || isSupportIntrosionZone ||
                                      isSupportEnterZone || isSupportLeafeZone ||
                                      isSupportWanderDetect || isSupportFastMove);
    }

    // 外设
        isSupportspclTlSwitch = ($xml.find("Function Debugger TrafficLight").length > 0);
        isSupportTrafficLight = ($xml.find("Device TrafficLight").length > 0);
        isSupportLaser = ($xml.find("Device Laser").length > 0);
        isSupportStrobeLight = ($xml.find("Device FlashLight").length > 0);
        isSupportPolarizer = ($xml.find("Device Polarizer").length > 0);
        isSupportCoil = ($xml.find("Device Coil").length > 0);
        isSupportLED = ($xml.find("Device LEDLight").length > 0);
        isSupportLEDStatus = isSupportLED || ($xml.find("Video LedCtrl LedCtrlEnable").length > 0);
        if ($xml.find("Device LEDLight Mode").length > 0) {
            LEDStatusArr = $xml.find("Device LEDLight Mode").text().split(",");
        }
        if (isSupportStrobeLight && ($xml.find("Device FlashLight Mode").length > 0)) {
            strobeLightIDArr = $xml.find("Device FlashLight Mode").text().split(",");
        }
        isSupportNDFilter = ($xml.find("Device NDFilter").length > 0);
        isSupportOpenDetect = ($xml.find("Device OpenDetect").length > 0);
        isSupportCommonCarWayCfg = ($xml.find("Device CarWayCfg").length > 0);
        isSupportSwitchKND = ($xml.find("Device SwitchKND").length > 0);
        isSupportRadar = ($xml.find("Device Radar").length > 0);
        if ($xml.find("Device OpenLEDThrType").length > 0) {
            openFlashType = Number($xml.find("Device OpenLEDThrType").text());
        }
        isSupportACSynt = ($xml.find("Device TrafficLight ACSyntFunc").length > 0);
        isSupportwhiteList = ($xml.find("Device WhiteListLinkSwitchOut").length > 0);

    // 声音
        isSupportAudio = ($xml.find("Audio > Mode").length > 0);
        isSupportAudioTalk = (($xml.find("Audio AudioOut").length > 0) && ($xml.find("Audio AudioIn").length > 0));
        if (isSupportAudio) {
            audioFormatArr = $xml.find("Audio > Mode").text().split(",");
            isSupportSerialInput = ($xml.find("SerialInput").length >0);
            //拾音器类型
            if(isSupportSerialInput){
                DevTypeArr = $xml.find("SerialInput DevType").text().split(",");
            }
            //采样率
            var encFormat,sampling = [];
            for (var i = 0,len = audioFormatArr.length;i < len;i++){
                encFormat = audioFormatArr[i];
                sampling = $xml.find("Audio > SampleRate > Mode" + encFormat).text().split(",");
                audioSampling[encFormat] = sampling;
            }
            isSupportAudioSource = ($xml.find("Audio AudioIn AudioSource").length > 0);
            if(isSupportAudioSource){
                audioSourceArr = $xml.find("Audio AudioIn AudioSource").text().split(",");
            }
            else{
                audioSourceArr = null;
            }
            isSupportEhcoCancellation = ($xml.find("Audio EhcoCancellation").length > 0);
            isSupportSwiftEhcoCancellation = ($xml.find("Audio SwiftEhcoCancellation").length > 0);
            isSupportNoiseReduction = ($xml.find("Audio NoiseReduction").length > 0);

            if($xml.find("AudioIn Num").length > 0){
                AudioInNum = $xml.find("AudioIn Num").text();
            }
            if($xml.find("AudioIn Item0").length > 0){
                AudioInItem0Mode = $xml.find("AudioIn Item0 Mode").text().split(",");
            }else{
                AudioInItem0Mode = null;
            }
            if($xml.find("AudioIn Item1").length > 0){
                AudioInItem1Mode = $xml.find("AudioIn Item1 Mode").text().split(",");
            }else{
                AudioInItem1Mode = null;
            }
            if ($xml.find("AudioIn DualAudio").length > 0) {
                isSupportDualAudio = Number($xml.find("AudioIn DualAudio").text());
            }
        }
    // 手动跟踪
        isSupportRectManulTrack = ($xml.find("Intelligent ManualTrack").length > 0);
    // 存储
        isSupportStorage = ($xml.find("Storage").length > 0);
        if (isSupportStorage) {
            storTypeArr = $xml.find("Storage Mode").text().split(",");
            isSupportRecordPlayback = ($xml.find("Storage RecordPlayBack").length > 0);
            isSupportVideoDownload = ($xml.find("Storage VideoDownload").length > 0);
        }

    // 云台
        isSupportPTZ = ($xml.find("PTZ").length > 0);
        if ($xml.find("PTZ PresetNum").length > 0) {
            PresetNum = Number($xml.find("PTZ PresetNum").text());
        }
        if ($xml.find("PTZ PtzCap").length > 0) {
            ptzType = $xml.find("PTZ PtzCap").text();
        }
        isSupport3DAreaZoom = ($xml.find("PTZ _3DAreaZoom").length > 0);
        isSupportPlumbAngle = ($xml.find("PTZ PlumbAngle").length > 0);
        isSupportEnablePTReset = ($xml.find("PTZ EnablePTReset").length > 0);
        isSupport3DCover = ($xml.find("PTZ _3DCover").length > 0);
        isSupportTrackRecord = ($xml.find("PTZ TrackRecord").length > 0);
        isSupportPeripheralPTZ = ($xml.find("PTZ PeripheralPTZ").length > 0);
        isSupportNoPtzMode = ($xml.find("PTZ NoSupportPtzMode").length > 0);
        if (isSupportPeripheralPTZ) {
            isSupportInfrare = ($xml.find("PTZ PeripheralPTZ Infrare").length > 0);
            isSupportHeatup = ($xml.find("PTZ PeripheralPTZ Heatup").length > 0);
            isSupportIlluminate = ($xml.find("PTZ PeripheralPTZ Illuminate").length > 0);
            isSupportRainbrush = ($xml.find("PTZ PeripheralPTZ Rainbrush").length > 0);
            if (isSupportRainbrush) {
                rainbrushModeList = $xml.find("PTZ PeripheralPTZ Rainbrush Mode").text().split(",");
            }
        }
        isSupportDemoPtz = ($xml.find("PTZ DomePtCap").length > 0);
        if (isSupportDemoPtz) {
            var tmpArr = $xml.find("PTZ DomePtCap Speed").text().split(",");
            if (tmpArr.length > 1) {
                demoPtzMinSpeed = tmpArr[0];
                demoPtzMaxSpeed = tmpArr[1];
            }
            tmpArr = $xml.find("PTZ DomePtCap Lock").text().split(",");
            if (tmpArr.length > 1) {
                demoPtzMinLockForce = tmpArr[0];
                demoPtzMaxLockForce = tmpArr[1];
            }
            tmpArr = $xml.find("PTZ DomePtCap MaxVerAngle").text().split(",");
            if (tmpArr.length > 1) {
                demoPtzMinVerAngle = tmpArr[0];
                demoPtzMaxVerAngle = tmpArr[1];
            }
        }

        if(isSupportFishEye) {
            isSupportPTZ = false;
        }
        if (isSupportPTZ) {
            isSupportLimitPTZ= ($xml.find("PTZ LimitPTZ").length > 0);
            if ($xml.find("PTZ DomePtCap MaxVerAngle").length > 0) {
                MaxVerAngle = $xml.find("PTZ DomePtCap MaxVerAngle").text().split(",");
            }
        }


    // 服务器
        isSupportNTP = ($xml.find("Server NTP").length > 0);
        if (isSupportSmartTmsServer =($xml.find("Server SmartTms").length > 0)){
            isSupportSmartTmsProtocol = ($xml.find("Server SmartTms Protocol").length > 0);
            isSupportSmartTmsProtocolMode = $xml.find("Server SmartTms Protocol Mode").text().split(",");
        }
        isSupportSmartUDPServer =($xml.find("Server UDPServer").length > 0);
        if (VersionType.DT == versionType) {    // 分销
            isSupportVM = true;
            isSupportBMServer = false;
        } else if (VersionType.PRJ == versionType) {
            isSupportVM = true;
        } else if (VersionType.IN == versionType) {
            isSupportVM = false;
            if(isSupportHorizontalMenu){
                isSupportSmartTmsServer = false;
                isSupportSmartUDPServer = false;
            }
        } else {
            isSupportVM = ($xml.find("Server VMServer").length > 0);
            isSupportBMServer = ($xml.find("Server BMServer").length > 0);
        }
        isSupportSNMP = ((VersionType.PRJ == versionType) && !isSupportH265 ) ? false : isSupportVM;
        isSupportFTP = ($xml.find("Server FTP").length > 0);
        isSupportBMNoRebootPrompt = ($xml.find("Server BMNoRebootPrompt").length > 0);
        isSupportNoBrand = ($xml.find("Server NoBrand").length > 0);
        TMSProtocolArr = $xml.find("Server TmsSupport Protocol Mode").text().split(",");
        if (($xml.find("Server FTP PathName Mode")).length > 0) {
            FTPPathNameArr = $xml.find("Server FTP PathName Mode").text().split(",");
        }
        if (($xml.find("Server FTP FileName Mode")).length > 0) {
            FTPFileNameArr = $xml.find("Server FTP FileName Mode").text().split(",");
        }
        if ($xml.find("Server Custom").length > 0) {
            customType = $xml.find("Server Custom").text();
        }
}

function updateCapInfo() {
    var i = 0,
        j,
        len,
        len1,
        len2;

    // 人脸枪
    if (IVAMode.COMMON == IVAType && IVACommonMode.KAKOU == IVACommonType) {
        isSupportLens = false;
        isSupportPeripheralPTZ = false;
        isSupportPTZ = false;

        for(i = 0, len1 = serialModeArr.length; i < len1; i++) {
            for(j = 0, len2 = serialModeArr[i].length; j < len2; j++) {
                if (SerialMode.PTZ == serialModeArr[i][j]) {
                    serialModeArr[i].splice(j, 1);
                    break;
                }
            }
        }
    } else if (IVAMode.ILLEGAL == IVAType) { // 违章
        isSupportAutoTrack = false;
        isSupportFilterType = false;
        isSupportIgnoreArea = false;

        for (i = 0, len = ruleTypeArr.length; i < len;) {
            if ((IVARuleType.PICKET_LINE == ruleTypeArr[i]) || (IVARuleType.PICKET_AREA == ruleTypeArr[i]) ||
                    IVARuleType.AREA_STAY == ruleTypeArr[i]) {
                ruleTypeArr.splice(i,1);
            } else {
                i++;
            }
        }
    } else if (IVAMode.PERIMETER == IVAType) { // 周界
        for (i = 0, len = ruleTypeArr.length; i < len;) {
            if ((IVARuleType.ILLEGAL_PRESSLINE == ruleTypeArr[i]) || (IVARuleType.ILLEGAL_RETROGRADE == ruleTypeArr[i]) ||
                    IVARuleType.ILLEGAL_PARKING == ruleTypeArr[i]) {
                ruleTypeArr.splice(i,1);
            } else {
                i++;
            }
        }
    }
}

/**
 * 更新开关量输出相关功能(是否显示)
 *
 * @param docObj
 *            document对象
 * @return
 */
function updateSwitchOutFn(docObj) {
    if (isSupportSwitchOut)
        return;
    // 联动到告警开关量输出的功能不存在
    $(docObj.getElementById("switchOutTR")).addClass("hidden");
}

/**
 * 更新控件菜单,智能交通使用
 *
 * @return
 */
function updateVideoMenu(str) {
    var top = GetTopWindow();
    if ("undefined" != typeof (str)) {
        top.sdk_viewer.ViewerAxSetLocalCfg(str);
    }
}
