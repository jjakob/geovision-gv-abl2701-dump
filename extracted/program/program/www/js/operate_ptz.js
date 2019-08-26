// JavaScript Document
GlobalInvoke(window);
var transPortMap = {};
var ptzMap = {};
var osdMap = {};
var serialModeArr = top.banner.serialModeArr;
var serialArr = top.banner.serialIDArr;
var serialTypeArr = top.banner.serialTypeArr;
var serialNum = serialArr.length;
var channelId = 0;
var serialModeName = [ "", $.lang.pub["PTZControl"], $.lang.pub["biDirectTransChannel"], "", "", "",
        $.lang.pub["detectorS"], $.lang.pub["radarC"], $.lang.pub["laser"], $.lang.pub["pcBoxAlarm"],
        $.lang.pub["trafficLightS"], $.lang.pub["radarA"], $.lang.pub["osdLayout"], $.lang.pub["radarH"],
        $.lang.pub["detectorQ"], $.lang.pub["radarCController"], $.lang.pub["localPTZController"], "RFID",
        $.lang.pub["detectorU"], $.lang.pub["trafficLightU"], $.lang.pub["radarW"], $.lang.pub["radarZ"],
        $.lang.pub["switchKND"], $.lang.pub["trafficLightQ"], $.lang.pub["radarH2"], $.lang.pub["trafficLightY"],
        $.lang.pub["radarAD"], $.lang.pub["radarA2"],$.lang.pub["trafficLightC"],$.lang.pub["weighingXK"],
        $.lang.pub["weighingDS"], $.lang.pub["radarLD"], $.lang.pub["onfivTransChannel"], $.lang.pub["detectorX"],
        $.lang.pub["trafficLightB"], $.lang.pub["nettrafficLight"], $.lang.pub["radarS"], $.lang.pub["detectorH2"],
        $.lang.pub["isMode"], $.lang.pub["FSCapture"], $.lang.pub["weighingDS1"], $.lang.pub["soundPickUp"],
        $.lang.pub["sensorControl"], $.lang.pub["radarJZ"], "", $.lang.pub["radarDH"], $.lang.pub["weighingYH"], $.lang.pub["radarH2S"]];

var jsonMap = {};
var jsonMap_bak = {};
var jsonMap_transPort = {};
var jsonMap_transPort_bak = {};
var mappingMap = {};
var mappingMap_transPort = {};
var jsonMap_PTZCfg = {};
var jsonMap_PTZCfg_bak = {};
var mappingMap_PTZCfg = {
    Serial1PtzAddressCode:["Addr"],
    Serial1PtzFactoryName:["PtzFactoryName"],
    Serial1PtzMode:["PtzMode"]
};
var jsonMap_OSDReport = {};
var jsonMap_OSDReport_bak = {};
var mappingMap_OSDReport = {
    Serial1OSDReport:["Enable"]
};

function enableTransPort(id) {
    var tbName = id.replace("Enable","Table");
    if ($("#" + id).is(":checked")) {
        $("#" + tbName).removeClass("hidden");
    } else {
        $("#" + tbName).addClass("hidden");
    }
    validator.init();
}
/**
 * 改变串口协议
 */
function changePtzProtocol(fieldsetId) {
    var disabled = false,
        $PtzMode = $("#"+fieldsetId+"PtzMode");

    if ("INTERNAL-PTZ" == $("#"+fieldsetId+"PtzFactoryName").val()) {
        disabled = true;
        $PtzMode.val(0);
    }
    $("#"+fieldsetId+"BaudRate").attr("disabled", disabled);
    $("#"+fieldsetId+"DataBit").attr("disabled", disabled);
    $("#"+fieldsetId+"StopBit").attr("disabled", disabled);
    $("#"+fieldsetId+"Parity").attr("disabled", disabled);
    $("#"+fieldsetId+"Flowcontrol").attr("disabled", disabled);
    $PtzMode.attr("disabled", disabled);
    $("#"+fieldsetId+"PtzAddressCode").attr("disabled", disabled);
}

function changePtzFactoryName(v, fieldsetId) {
    var localPtzOptionList = ["PELCO-D","Private-KR","PELCO-P"];
    var ptzOptionList = ["INTERNAL-PTZ","PELCO-D","PELCO-P","ALEC","VISCA","ALEC_PELCO-D","ALEC_PELCO-P","MINKING_PELCO-D","MINKING_PELCO-P","YAAN"];
    
    if (SerialMode.PTZ == v || SerialMode.LOCALPTZ == v) {
        var str = "";
        var selectedOption = "";
        var optionList ;
        var $PtzFactoryName = $("#"+fieldsetId+"PtzFactoryName");

        var value = $PtzFactoryName.val();
        $PtzFactoryName.empty();
        optionList = (SerialMode.PTZ == v)?ptzOptionList:localPtzOptionList;
        for (var i = 0; i < optionList.length; i++) {
            str += "<option value='"+optionList[i]+"'>"+optionList[i]+"</option>";
            if (value == optionList[i]) {
                selectedOption = value;
            }
        }
        $PtzFactoryName.append(str);
        if (selectedOption != "") {
            $PtzFactoryName.val(selectedOption);
        }
    } 
}

function changePtzMode(id) {
    var fieldsetId = id.replace("SerialMode",""),
        v = $("#"+id).val(),
        $SerialOSDReport = $("#Serial1OSDReport"),
        $ptzModeTR = $("#" + fieldsetId + "ptzModeTR"),
        $protocolName = $("#" + fieldsetId + "protocolName"),
        $protocolAddr = $("#" + fieldsetId + "protocolAddr"),

        $PtzMode = $("#"+fieldsetId+"PtzMode"),
        $PtzFactoryName = $("#"+fieldsetId+"PtzFactoryName"),
        $PtzAddressCode = $("#"+fieldsetId+"PtzAddressCode"),
        $BaudRate = $("#" + fieldsetId + "BaudRate"),
        $DataBit = $("#" + fieldsetId + "DataBit"),
        $StopBit = $("#" + fieldsetId + "StopBit"),
        $Parity = $("#" + fieldsetId + "Parity"),
        $Flowcontrol = $("#" + fieldsetId + "Flowcontrol");


    if("Serial1" == fieldsetId){
        $SerialOSDReport.parent().parent().addClass("hidden");//默认隐藏
    }
    $SerialOSDReport.val(osdMap["SerialOSDReport"]);
    changePtzFactoryName(v,fieldsetId);
    if (SerialMode.PTZ == v) {
        $ptzModeTR.removeClass("hidden");
        $protocolName.removeClass("hidden");
        $protocolAddr.removeClass("hidden");
        $PtzFactoryName.attr("disabled", false);
        changePtzProtocol(fieldsetId);
    } else if (SerialMode.LOCALPTZ == v) {
        $ptzModeTR.addClass("hidden");
        $protocolName.removeClass("hidden");
        $protocolAddr.removeClass("hidden");
        $PtzMode.attr("disabled", true);
        $PtzFactoryName.attr("disabled", false);
        $PtzAddressCode.attr("disabled", false);
        $BaudRate.attr("disabled", false);
        $DataBit.attr("disabled", false);
        $StopBit.attr("disabled", false);
        $Parity.attr("disabled", false);
        $Flowcontrol.attr("disabled", false);
    } else {
        $ptzModeTR.addClass("hidden");
        $protocolName.addClass("hidden");
        $protocolAddr.addClass("hidden");
        $PtzMode.attr("disabled", true);
        $PtzFactoryName.attr("disabled", true);
        $PtzAddressCode.attr("disabled", true);

        if ((SerialMode.TRANS == v) || (SerialMode.OSDLAYOUT == v) || (SerialMode.ONVIF_TRANS == v)) {

            $BaudRate.attr("disabled", false);
            $DataBit.attr("disabled", false);
            $StopBit.attr("disabled", false);
            $Parity.attr("disabled", false);
            $Flowcontrol.attr("disabled", false);
            if (SerialMode.OSDLAYOUT == v){
                $SerialOSDReport.parent().parent().removeClass("hidden");
            }

        } else if (SerialMode.ISMode == v){
            var keyList = ["BaudRate","DataBit","StopBit","Parity","Flowcontrol"];
            for (var i = keyList.length - 1; i >= 0; i--) {
                $("#"+fieldsetId+keyList[i]).attr("disabled", true);
            }

            $BaudRate.attr("disabled", false);
            $DataBit.attr("disabled", true);
            $StopBit.attr("disabled", true);
            $Parity.attr("disabled", true);
            $Flowcontrol.attr("disabled", true);

        } else if ((SerialMode.VEHICLE_DETECTOR_S == v) || (SerialMode.RADAR_C == v) || (SerialMode.LASER == v)
                || (SerialMode.CASEALARM == v) || (SerialMode.TRAFFICLIGHT == v) || (SerialMode.RADAR_A == v)
                || (SerialMode.RADAR_H == v) || (SerialMode.RADAR_H2 == v) || (SerialMode.RADAR_Z == v)
                || (SerialMode.VEHICLE_DETECTOR_Q == v) || (SerialMode.RADAR_C_CONTROLLER == v)
                || (SerialMode.RFID == v) || (SerialMode.VEHICLE_DETECTOR_U == v) || (SerialMode.TRAFFICLIGHT_U == v)
                || (SerialMode.TRAFFICLIGHT_Y == v) || (SerialMode.RADAR_W == v) || (SerialMode.TRAFFICLIGHT_Q == v)
                || (SerialMode.SWITCHVALUE_TO_485 == v) || (SerialMode.RADAR_AD == v) || (SerialMode.TRAFFICLIGHT_B == v) || (SerialMode.RADAR_A2 == v)
                || (SerialMode.TRAFFICLIGHT_CONTROLLER == v) || (SerialMode.WEIGHING_XK == v) || (SerialMode.WEIGHING_DS == v)
                || (SerialMode.RADAR_LD == v) || (SerialMode.VEHICLE_DETECTOR_X == v) || (SerialMode.TRAFFICLIGHT_NET == v) || (SerialMode.RADAR_S == v)
                || (SerialMode.VEHICLE_DETECTOR_H2 == v)  || (SerialMode.FS_CAPTURE == v) || (SerialMode.WEIGHING_DS1 == v) || (SerialMode.SOUNDPICKUP == v)
                || (SerialMode.RADAR_DH == v) || (SerialMode.RADAR_JZ == v) || (SerialMode.WEIGHING_YH == v) || (SerialMode.RADAR_H2S == v)) {
            $BaudRate.attr("disabled", true);
            $DataBit.attr("disabled", true);
            $StopBit.attr("disabled", true);
            $Parity.attr("disabled", true);
            $Flowcontrol.attr("disabled", true);

            // 波特率
            if ((SerialMode.VEHICLE_DETECTOR_S == v) || (SerialMode.CASEALARM == v)
                    || (SerialMode.VEHICLE_DETECTOR_U == v)) {
                $BaudRate.val(19200);
            } else if ((SerialMode.RADAR_C == v) || (SerialMode.RADAR_A == v) || (SerialMode.RADAR_H == v)
                    || (SerialMode.RADAR_H2 == v) || (SerialMode.RADAR_Z == v) || (SerialMode.RADAR_C_CONTROLLER == v)
                    || (SerialMode.TRAFFICLIGHT == v) || (SerialMode.TRAFFICLIGHT_U == v) || (SerialMode.RADAR_W == v)
                    || (SerialMode.SWITCHVALUE_TO_485 == v) || (SerialMode.RADAR_AD == v) || (SerialMode.RADAR_A2 == v)
                    || (SerialMode.TRAFFICLIGHT_CONTROLLER == v) || (SerialMode.VEHICLE_DETECTOR_X == v) || (SerialMode.TRAFFICLIGHT_NET == v)
                    || (SerialMode.RADAR_S == v) || (SerialMode.VEHICLE_DETECTOR_H2 == v) || (SerialMode.FS_CAPTURE == v)
                    || (SerialMode.RADAR_DH == v) || (SerialMode.RADAR_JZ == v) || (SerialMode.WEIGHING_YH == v) || (SerialMode.RADAR_H2S == v)) {
                $BaudRate.val(9600);
            } else if ((SerialMode.VEHICLE_DETECTOR_Q == v) || (SerialMode.TRAFFICLIGHT_Q == v)
                    || (SerialMode.TRAFFICLIGHT_Y == v) || (SerialMode.TRAFFICLIGHT_B == v) || (SerialMode.RFID == v)) {
                $BaudRate.val(38400);
            } else if ((SerialMode.WEIGHING_XK == v) || (SerialMode.WEIGHING_DS == v) || (SerialMode.WEIGHING_DS1 == v)) {
                $BaudRate.val(4800);
            } else if ((SerialMode.RADAR_LD == v)) {
                $BaudRate.val(57600);
            } else {
                $BaudRate.val(115200);
            }
            
            //数据位,停止位，校验位，流控制
            if(SerialMode.SOUNDPICKUP == v || SerialMode.WEIGHING_YH == v){
                $("#"+fieldsetId+"DataBit").val(8);
                $("#"+fieldsetId+"StopBit").val(1);
                $("#"+fieldsetId+"Flowcontrol").val(0);
            }
            
            //数据位,停止位，校验位，流控制
            if(SerialMode.WEIGHING_YH == v){
                $("#"+fieldsetId+"DataBit").val(8);
                $("#"+fieldsetId+"StopBit").val(1);
                $("#"+fieldsetId+"Parity").val(2);
                $("#"+fieldsetId+"Flowcontrol").val(0);
            } else {
                $("#"+fieldsetId+"Parity").val(0);
            }
        }
        $PtzAddressCode.val(ptzMap[fieldsetId+"PtzAddressCode"]);
        validator.form();// 去除错误浮动信息
    }
    if (top.banner.isSupportNoPtzMode) {
        $("#Serial1ptzModeTR").addClass("hidden");
    }
    
    if (!top.banner.isSupportCapture) {
        changeSerialEnable(fieldsetId);
    }
}

function validateSerialMode() {
    var count = 0,
        i;
    for (i = 0; i < serialNum; i++) {
        var value = $("#Serial"+ (i+1) + "SerialMode").val();
        if (10 == value || 19 == value || 25 == value || 23 == value || 34 == value || 35 == value) {
            count++;
        }
    }
    if (count > 1) {
        alert($.lang.tip["tipSerialModeSameErr"]);
        return false;
    }
    return true;
}

function changeSerialEnable(fieldsetId) {
        var $Serial1Enable = $("#"+fieldsetId+"Enable");
        if (2 == $("#"+fieldsetId+"SerialMode").val()) {
            $Serial1Enable.attr("disabled", false);
        } else {
            $("#"+fieldsetId+"Table").addClass("hidden");
            $Serial1Enable.attr("checked", false);
            $Serial1Enable.attr("disabled", true);
        }
}

function submitSerialPtzCfg() {
    LAPI_FormToCfg("frmSetup",jsonMap,dataMap,mappingMap);
    LAPI_FormToCfg("frmSetup",jsonMap_PTZCfg,ptzMap,mappingMap_PTZCfg);
    var isSerialChanged = !isObjectEquals(jsonMap,jsonMap_bak);
    var isPTZCfgChanged = !isObjectEquals(jsonMap_PTZCfg,jsonMap_PTZCfg_bak);
    if (isSerialChanged || isPTZCfgChanged) {
            if (!LAPI_SetCfgData(LAPI_URL.SerialCfg,jsonMap)) {
                return false;
            }
            jsonMap_bak = objectClone(jsonMap);
            if (top.banner.isSupportPTZ) {
                if (!LAPI_SetCfgData(LAPI_URL.LAPI_PTZCfg,jsonMap_PTZCfg))
                    return false;
                jsonMap_PTZCfg_bak = objectClone(jsonMap_PTZCfg);   
            }            
    }
    return true;
}

function submitF() {
    if (!validator.form() || !validateSerialMode())
        return;

    // IPC下发顺序有要求, 开启透明通道时先下发串口模式再下发透明通道
    // 关闭时先下发关闭透明通道再下发串口模式
    var flag = $("#Serial1Enable").is(":checked");
    var pcParam = "SerialNum="+serialNum + "&TransPortNum="+serialNum;
    for (var i = 0; i < serialNum; i++) {
        pcParam += ("&Serial" + (i+1) + "ChannelID=" + serialArr[i]);
    }
    if (flag) {
        if(!submitSerialPtzCfg()) return;
    }
    LAPI_FormToCfg("frmSetup",jsonMap_transPort,transPortMap,mappingMap_transPort);
    var isTransPortChanged = !isObjectEquals(jsonMap_transPort,jsonMap_transPort_bak);
    if (isTransPortChanged || Number(flag) != transPortMap["Serial1Enable"]) {
        if (!LAPI_SetCfgData(LAPI_URL.SerialTrans, jsonMap_transPort))
            return;
        jsonMap_transPort_bak = objectClone(jsonMap_transPort);
    }
    if (!flag) {
        if(!submitSerialPtzCfg()) return;
    }
    LAPI_FormToCfg("frmSetup", jsonMap_OSDReport, osdMap, mappingMap_OSDReport);
    if(!isObjectEquals(jsonMap_OSDReport, jsonMap_OSDReport_bak) && LAPI_SetCfgData(LAPI_URL.SerialOSDReport, jsonMap_OSDReport)) {
        jsonMap_OSDReport_bak = objectClone(jsonMap_OSDReport);
    }
}


function initPage() {
    var serialModeOption = "", i, j, len, v,
        serialHtml, str = "", RS485Num = 0, RS232Num = 0,
        $SerialMode,
        $frmSetup = $("#frmSetup");
    //生成多个串口配置

    serialHtml = $frmSetup.html();
    for (i = 1; i < serialNum; i++) {
        str = serialHtml.replace(/Serial1/g, "Serial"+(i+1));
        $frmSetup.append(str);
    }
    
    for (i = 0; i < serialModeArr.length; i++) {
        serialModeOption = "";
        str = "Serial" + (i+1);
        $SerialMode = $("#" + str + "SerialMode");
        
        if ("RS485" == serialTypeArr[i]) {
            $("#" + str + "Fieldset legend").html("RS485_" + (++RS485Num));
        } else if ("RS232" == serialTypeArr[i]) {
            $("#" + str + "Fieldset legend").html("RS232_" + (++RS232Num));
        }

        $SerialMode.empty();
        for (j = 0, len = serialModeArr[i].length; j < len; j++) {
            v = serialModeArr[i][j];
            if (top.banner.isRefactor && SerialMode.ISMode == v) {
                serialModeName[v] = $.lang.pub["isMode"];
            }
            serialModeOption += "<option value='" + v + "'>" + serialModeName[v] + "</option>";
        }
        $SerialMode.append(serialModeOption);

    }
}

function initValidator() {
    var i;

    $("#Serial1PtzAddressCode").attr("tip",$.validator.format($.lang.tip["tipIntRange"], 0, 255));
    $.validator.addMethod("isIPAddress", function(value) {
        return isIPAddress(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223", function(value) {
        return checkIP1To223(value);
    }, $.lang.tip["tipIPRangeErr"]);
    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success : function(label) {
        },
        rules : {
            Serial1PtzAddressCode: {
                integer: true,
                required: true,
                range:[0, 255]
            }
        }
    });
    
    var rules = validator.settings.rules;
    for (i = 0; i < serialNum; i++) {
        var id = "Serial" + (i+1) + "LocalAddr";
        $("#" + id).attr("tip",$.lang.tip["tipIPInfo"]);
        rules[id] = {
            required: true,
            isIPAddress:"",
            checkIP1To223:""
        };
        id = "Serial" + (i+1) + "LocalPort";
        $("#" + id).attr("tip",$.validator.format($.lang.tip["tipIntRange"],1025,65535));
        rules[id] = {
            integer: true,
            required: true,
            range:[1025,65535]
        };
        id = "Serial" + (i+1) + "PeerPort";
        $("#" + id).attr("tip",$.validator.format($.lang.tip["tipIntRange"],1025,65535));
        rules[id] = {
            integer: true,
            required: true,
            range:[1025,65535]
        };
    }
    validator.init();
}

function initEvent() {
    var i,
        str;

    for (i = 0; i < serialNum; i++) {
        str = "Serial" + (i+1);
        $("#"+str+"SerialMode").bind("change", function(){
            changePtzMode(this.id);
        });
    }    
}

function initData() {
    var i;

    jsonMap = {};
    jsonMap_transPort = {};
    mappingMap = {};
    mappingMap_transPort={};
    //根据个数生成mappingMap
    for (i = 0; i < serialNum; i++) {
        //串口
        mappingMap["Serial"+(i+1)+"BaudRate"]=["SingSerialCfg",i,"SerialCfg","SerialParam","BaudRate"];
        mappingMap["Serial"+(i+1)+"DataBit"]=["SingSerialCfg",i,"SerialCfg","SerialParam","DataBit"];
        mappingMap["Serial"+(i+1)+"StopBit"]=["SingSerialCfg",i,"SerialCfg","SerialParam","StopBit"];
        mappingMap["Serial"+(i+1)+"Parity"]=["SingSerialCfg",i,"SerialCfg","SerialParam","Parity"];
        mappingMap["Serial"+(i+1)+"Flowcontrol"]=["SingSerialCfg",i,"SerialCfg","SerialParam","FlowCtrl"];
        mappingMap["Serial"+(i+1)+"SerialMode"]=["SingSerialCfg",i,"SerialCfg","SerialMode"];
        mappingMap["Serial"+(i+1)+"ChannelID"]=["SingSerialCfg",i,"ChannelID"];
        //透明通道映射
        mappingMap_transPort["Serial"+(i+1)+"ChannelID"]=["SingTransPortCfg",i,"ChannelID"];
        mappingMap_transPort["Serial"+(i+1)+"Enable"]=["SingTransPortCfg",i,"TransPortCfg","Enable"];
        mappingMap_transPort["Serial"+(i+1)+"SerialID"]=["SingTransPortCfg",i,"TransPortCfg","SerialID"];
        mappingMap_transPort["Serial"+(i+1)+"TransMode"]=["SingTransPortCfg",i,"TransPortCfg","TransMode"];        
        mappingMap_transPort["Serial"+(i+1)+"LocalAddr"]=["SingTransPortCfg",i,"TransPortCfg","LocalAddr","IPAddr"];
        mappingMap_transPort["Serial"+(i+1)+"LocalPort"]=["SingTransPortCfg",i,"TransPortCfg","LocalAddr","Port"];
        mappingMap_transPort["Serial"+(i+1)+"PeerAddr"]=["SingTransPortCfg",i,"TransPortCfg","PeerAddr","IPAddr"];
        mappingMap_transPort["Serial"+(i+1)+"PeerPort"]=["SingTransPortCfg",i,"TransPortCfg","PeerAddr","Port"];
    }

    if (!LAPI_GetCfgData(LAPI_URL.SerialCfg, jsonMap) ||
            !LAPI_GetCfgData(LAPI_URL.SerialTrans, jsonMap_transPort)) {
        disableAll();
        return;
    }


    if (!LAPI_GetCfgData(LAPI_URL.SerialOSDReport, jsonMap_OSDReport)) {
        disableAll();
        return false;
    }
    jsonMap_OSDReport_bak = objectClone(jsonMap_OSDReport);
    LAPI_CfgToForm("frmSetup", jsonMap_OSDReport, osdMap, mappingMap_OSDReport);


    if (top.banner.isSupportPTZ ){
        jsonMap_PTZCfg = {};
        if (!LAPI_GetCfgData(LAPI_URL.LAPI_PTZCfg,jsonMap_PTZCfg)) {
            disableAll();
            return;
        }
        jsonMap_PTZCfg_bak = objectClone(jsonMap_PTZCfg);
        LAPI_CfgToForm("frmSetup",jsonMap_PTZCfg,ptzMap,mappingMap_PTZCfg);
    }
    
    jsonMap_bak = objectClone(jsonMap);
    jsonMap_transPort_bak = objectClone(jsonMap_transPort);
    LAPI_CfgToForm("frmSetup",jsonMap,dataMap,mappingMap);
    LAPI_CfgToForm("frmSetup",jsonMap_transPort,transPortMap,mappingMap_transPort);
    
    for (i = 0; i < serialNum; i++) {
        changePtzMode("Serial" + (i+1) + "SerialMode");
        enableTransPort("Serial" + (i+1) + "Enable");
    }
}
$(document).ready(function() {
    parent.selectItem("COMTab");// 菜单选中
        beforeDataLoad();
        initPage();
        initLang();
        initValidator();
        initEvent();
        initData();
    var $Serial1SerialMode = $("#Serial1SerialMode");
    if ((1 == $Serial1SerialMode.find("option").length) && (SerialMode.PTZ == $Serial1SerialMode.val())) {
            disableAll();
        }
        afterDataLoad();
    });