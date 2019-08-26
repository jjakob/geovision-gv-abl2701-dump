GlobalInvoke(window);
/********************************* 全局变量定义 start **************************/
var ChannelId = 0;
var ServerDataView = null;
var validator = null;
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {};
var ServerMap = {};
var ServerNum = 5;

var headInfoList = [
    {
        fieldId: "rowNum",
        fieldType: "RowNum"
    },
    {
        fieldId: "Enable",
        fieldType: "checkbox"
    },
    {
        fieldId: "HZLFSerial",
        fieldType: "text"
    },
    {
        fieldId: "IPAddr",
        fieldType: "text"
    },
    {
        fieldId: "Port",
        fieldType: "text"
    },
    {
        fieldId: "PreferredDNSServer",
        fieldType: "text"
    },
    {
        fieldId: "AlternateDNSServer",
        fieldType: "text"
    }
];
/********************************* 全局变量定义 end **************************/

/********************************** 数据解析 start ****************************/
//将车位Map转换为车位list
function getServerDataviewList() {
    var serverList = [],
        i,
        serverInfo;
        
    for (i = 0; i < ServerNum; i++) {
        serverInfo = {};
        serverInfo["ServerID"] = ServerMap["ServerID" + i];
        serverInfo["Enable"] = ServerMap["Enable" + i];
        serverInfo["HZLFSerial"] = ServerMap["HZLFSerial" + i];
        serverInfo["IPAddr"] = ServerMap["IPAddr" + i];
        serverInfo["Port"] = ServerMap["Port" + i];
        serverInfo["PreferredDNSServer"] = ServerMap["PreferredDNSServer" + i];
        serverInfo["AlternateDNSServer"] = ServerMap["AlternateDNSServer" + i];
        serverList.push(serverInfo);
    }
    return serverList;
}
/********************************** 数据解析 end ****************************/

/********************************* 上报事件 start ****************************/
// empty

/******************************* 上报事件 end *******************************/

/***********************************业务逻辑处理 start **********************/

//初始化车位表格
function initDataView() {
    ServerDataView = new DataView("dataview_tbody", getServerDataviewList, headInfoList, ServerNum);
    ServerDataView.createDataView();
}
/***********************************业务逻辑处理 end **********/

function initPage() {
    
}

function initValidator() {
    var i = 0;
    
    $.validator.addMethod("isIPAddress", function(value) {
        return isIPAddress(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);
    $.validator.addMethod("validStrNoNull", function(value) {
        return validStrNoNull(value);
    }, $.lang.validate["valRequired"]);
    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkSerial", function(value) 
    {
        return checkCommonNamePwd(value);
    }, $.lang.tip["tipCharFmtErr"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "TD");
        },
        
        success: function(label) {},
        
        rules: {}
    });
    
    var rules = validator.settings.rules;
   
    for (; i < ServerNum; i++) {
        $("#HZLFSerial" + i).attr("tip", $.lang.tip["tipCommonName"].replace("%s", "0~16"));
        $("#IPAddr" + i).attr("tip", $.lang.tip["tipGatewayInfo"]);
        $("#Port" + i).attr("tip",$.validator.format($.lang.tip["tipIntRange"],0,65535));
        $("#PreferredDNSServer" + i).attr("tip", $.lang.tip["tipGatewayInfo"]);
        $("#AlternateDNSServer" + i).attr("tip", $.lang.tip["tipGatewayInfo"]);
        
        rules["HZLFSerial" + i] = {
            maxlength:16,
            checkSerial: ""
        };
        rules["IPAddr" + i] = {
            checkIPAddrOrEmpty:"",
            checkIP1To223OrEmpty:""
        };
        rules["Port" + i] = {
            required:true,
            integer: true,
            range:[0, 65535]
        };
        rules["PreferredDNSServer" + i] = {
            checkIPAddrOrEmpty:"",
            checkIP1To223OrEmpty:""
        };
        rules["AlternateDNSServer" + i] = {
            checkIPAddrOrEmpty:"",
            checkIP1To223OrEmpty:""
        };
    }
    
    validator.init();
}

function initEvent() {
    for (i = 0; i < ServerNum; i++){
        //服务器地址为空时，自动填充0.0.0.0
        $("#IPAddr" + i).change(function(){
            if("" == this.value) {
                this.value = "0.0.0.0";
            }
        });

        //首选DNS服务器为空时，自动填充0.0.0.0
        $("#PreferredDNSServer" + i).change(function(){
            if("" == this.value) {
                this.value = "0.0.0.0";
            }
        });

        //备选DNS服务器为空时，自动填充0.0.0.0
        $("#AlternateDNSServer" + i).change(function(){
            if("" == this.value) {
                this.value = "0.0.0.0";
            }
        });
    }
}

function FullMappingMap() {
    for (var m = 0; m < ServerNum; m++) {
        mappingMap["ServerID" + m] = ["HZLFServer", m, "ServerID"];
        mappingMap["Enable" + m] = ["HZLFServer", m, "Enable"];
        mappingMap["HZLFSerial" + m] = ["HZLFServer", m, "HZLFSerial"];
        mappingMap["IPAddr" + m] = ["HZLFServer", m, "ServerAddr", "IPAddr"];
        mappingMap["Port" + m] = ["HZLFServer", m, "ServerAddr", "Port"];
        mappingMap["PreferredDNSServer" + m] = ["HZLFServer", m, "DNSServerCfg", "IpAddr"];
        mappingMap["AlternateDNSServer" + m] = ["HZLFServer", m, "DNSServerCfg", "IpAddrBak"];
    }
}

function initData() {
    jsonMap = {};
    FullMappingMap();
    if (!LAPI_GetCfgData(LAPI_URL.HZLFServerInfo, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, ServerMap, mappingMap);
    
    initDataView();
}

function submitF() {
    var flag;
    for (i = 0; i < ServerNum; i++){
        //服务器地址为空时，自动填充0.0.0.0
        if("" == $("#IPAddr" + i).val()) {
            $("#IPAddr" + i).val("0.0.0.0");
        }

        //首选DNS服务器为空时，自动填充0.0.0.0
        if("" == $("#PreferredDNSServer" + i).val()) {
            $("#PreferredDNSServer" + i).val("0.0.0.0");
        }

        //备选DNS服务器为空时，自动填充0.0.0.0
        if("" == $("#AlternateDNSServer" + i).val()) {
            $("#AlternateDNSServer" + i).val("0.0.0.0");
        }
    }
    if (!IsChanged("frmSetup", ServerMap) || !validator.form()) return;
    LAPI_FormToCfg("frmSetup", jsonMap, ServerMap, mappingMap);
    flag = LAPI_SetCfgData(LAPI_URL.HZLFServerInfo, jsonMap);
    if(flag) {
        jsonMap_bak = jsonMap;
    }
}

$(document).ready(function(){
    parent.selectItem("ivaParkServerTab");//菜单选中
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initData();
    initEvent();
    initValidator();
    afterDataLoad();
});