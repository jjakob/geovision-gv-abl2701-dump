GlobalInvoke(window);
var channelId = 0;
var supportStr = "";
var statusMap = {};//状态数据
var pageType = getparastr("pageType");
var textMap = {
    "VmRegStatus" : ["regFail", "regSucceed", "untapped"],
    "TmsRegStatus" : ["regFail", "regSucceed", "untapped"],
    "SDStatus" : ["noexist", "fault", "checking", "normal", "exist"],
    "Status" : ["charging", "nocharge", "noexist"]
};

var jsonMap = {};   
var mappingMap = {  
    RunTime: ["RunTime"],            
    DeviceTemperature: ["DeviceTemperature"],  
    
    DeviceModel: ["DeviceModel"], 
    DeviceConfig: ["DeviceConfig"], 
    FirmwareVersion: ["FirmwareVersion"],
    PCBVersion: ["PCBVersion"], 
    HardwareID: ["HardewareID"],  
    UbootVersion: ["UbootVersion"],   
    SerialNumber: ["SerialNumber"],
    CameraVersion: ["CameraVersion"],
    networkMac: ["MAC"],

    Address:["Address"],
    Netmask:["Netmask"],
    Gateway:["Gateway"],
                
    Year: ["Year"], 
    Month: ["Month"], 
    MonthDay: ["MonthDay"], 
    Hour: ["Hour"], 
    Minute: ["Minute"], 
    Second: ["Second"]
};
var jsonMap_VM = {};
var mappingMap_VM = {
    Protocol: ["MngProtocol"],
    DeviceID: ["DeviceID"],
    Password: ["RegPassword"],
    VMIPAddr: ["Address"],
    VMPort: ["Port"]
};
//加载语言文件
loadlanguageFile(top.language);

function changeStatusText()
{
    var status;

    // 网络信息
    statusMap["networkState"] = statusMap["Address"] + "/" + statusMap["Netmask"] + "/" + statusMap["Gateway"];
    
    // 管理服务器
    status = Number(statusMap["manaServer"]);
    status = $.lang.pub[textMap["VmRegStatus"][status]];
    statusMap["manaServer"] = status + " (" + statusMap["VMIPAddr"] + ":" + statusMap["VMPort"] + ")";
    
    // 照片服务器
    status = Number(statusMap["photoServer"]);
    status = $.lang.pub[textMap["TmsRegStatus"][status]];
    statusMap["photoServer"] = status + " (" + statusMap["IPAddr"] + ":" + statusMap["Port"] + ")";
    
    // 存储设备
    status = Number(statusMap["SDStatus"]);
    status = $.lang.pub[textMap["SDStatus"][status]];
    statusMap["SDStatus"] = status;
    
    // 运行时间
    status = statusMap["RunTime"];
    var day = Math.floor(status / (60 * 60 * 24));
    status = status % (60 * 60 * 24);
    var hour = Math.floor(status / (60 * 60));
    status = status % (60 * 60);
    var min = Math.floor(status / 60);
    
    status = day + ' ' + $.lang.pub["days"] + ' ' + hour + ' ' + $.lang.pub["hours"] + ' ' + min + ' ' + $.lang.pub["mins"];
    statusMap["RunTime"] = status; 
    
    // 系统时间
    status = statusMap["Year"] + "/" + statusMap["Month"] + "/" + statusMap["MonthDay"]+ "  " +formatTime(statusMap["Hour"], statusMap["Minute"], statusMap["Second"]);
    statusMap["SystemTime"] = status;

    // Mac地址
    var a = [],macStr = [],list_Mac = [],list_Mac_temp  = [];
    var macStr= statusMap["networkMac"];
    for(var i = 0  ; i < 12 ; i=i+2 ){   //12:Mac地址的位数
        a = macStr.substring(i, i+2);
        list_Mac.push(a);
    }
    list_Mac_temp = list_Mac.join(":");
    statusMap["networkMac"] = list_Mac_temp;

    // 电池状态
    if (top.banner.isSupportBattery) {
        status = Number(statusMap["Status"]);
        if (2 == status) {   //2:不存在电池
            statusMap["BatteryStatus"] = "";
        } else {
            statusMap["BatteryStatus"] = "(" + statusMap["CurrCapPer"] + "%)";
        }
        status = $.lang.pub[textMap["Status"][status]];
        statusMap["BatteryStatus"] = status + statusMap["BatteryStatus"];
    }
}

//获取状态信息
function getStatusInfo() {
    jsonMap = {};
    if ("" != supportStr && !top.banner.isMac && top.banner.isOldPlugin) {
        getCfgData(channelId, CMD_TYPE.CDM_STATUS_DEVICE_EX, statusMap, supportStr);
    }
    LAPI_GetCfgData(LAPI_URL.LAPI_DeviceRunInfo, jsonMap);
    LAPI_GetCfgData(LAPI_URL.LAPI_DeviceBasicInfo, jsonMap);
    LAPI_GetCfgData(LAPI_URL.LAPI_LocalTime, jsonMap);
    if(!$("#serverLinkDiv").hasClass("hidden")) {
        LAPI_GetCfgData(LAPI_URL.LAPI_ManagerServerInfo,jsonMap);
    }
    if (!$("#photoServerDiv").hasClass("hidden")) {
        LAPI_GetCfgData(LAPI_URL.LAPI_PhotoServer,jsonMap);
    }
    if (!$("#sdStatusDiv").hasClass("hidden")) {
        LAPI_GetCfgData(LAPI_URL.LAPI_SD,jsonMap);
    }
    changeMapToMapByMapping(jsonMap, mappingMap, statusMap, 0);  

    LAPI_GetCfgData(LAPI_URL.LAPI_ManageServer, jsonMap_VM);
    changeMapToMapByMapping(jsonMap_VM, mappingMap_VM, statusMap, 0);

    // 电池状态
    if (top.banner.isSupportBattery) {
        LAPI_GetCfgData(LAPI_URL.LAPI_BatteryInfo, statusMap);
    }

    changeStatusText();
    
    setLabelValue(statusMap);
    
    if(("undefined" != typeof statusMap["CameraVersion"]) && ("" != statusMap["CameraVersion"])){
        $("#CameraVersion").parent().removeClass("hidden");                 
    }
}

function initPage(){
    $("#deviceType").text(top.banner.prototypeName);
    if ("" != top.banner.prototypeCfg) {
        var $deviceCfg = $("#deviceCfg");
        $deviceCfg.text(top.banner.prototypeCfg);
        $deviceCfg.parent("div").removeClass("hidden");
    }

    
    if(top.banner.isSupportTemperatureDetect){
        $("#boardTempTR").removeClass("hidden");
    }
    if (!top.banner.isSupportRealtimeStatus) {
        if(top.banner.isSupportVM) {
            $("#managementServerDiv").removeClass("hidden");
            $("#serverLinkDiv").removeClass("hidden");
            mappingMap["manaServer"] = ["StatusParam","VMServerOnline"];
        }
        if (top.banner.isSupportJPEG) {
            $("#photoServerDiv").removeClass("hidden");
            supportStr = "SupportJpeg=1";
            mappingMap["photoServer"] = ["StatusParam","PhotoServerOnline"];
        }
        if (top.banner.isSupportStorage) {
            $("#sdStatusDiv").removeClass("hidden");
            mappingMap["SDStatus"] = ["StatusParam","SDStatus"];
        }

    }
    

    if(top.banner.isSupportBattery){
        $("#batteryStatusDiv").removeClass("hidden");
    }

    if (0 == pageType) {
        $("#commonCfgDiv").removeClass("hidden");
    }
}

function initEvent() {
    $(".menu-item").each(function(){
        $(this).bind("click", $(this).attr("data-link"), function(e){
            if (checkNavigator("safari")) {
                parent.safariClick(e.data);
            } else {
                parent.$("#"+e.data)[0].click();
            }
        });
    });
    if (true == top.banner.isUN) {
        $("#netWorkMac_Div").removeClass("hidden");
    }
}

function initData()
{
    getStatusInfo();
}

$(document).ready(function(){
    if (0 == pageType) {
        parent.selectItem("navigationTab");//菜单选中
    } else {
        parent.selectItem("deviceStatusTab");//菜单选中
    }
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initEvent();
    initData();
    window.setInterval("getStatusInfo()",10000);
    afterDataLoad();
});
