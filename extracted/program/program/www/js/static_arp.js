GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var validator = null;
var jsonMap = {};
var mappingMap = {
      Enable:["Enable"],
      IPAddress:["GateWay","IPAddr"],
      MACAddress:["GateWay","MacAddr"]
};
var jsonMap_bak = {};
//加载语言文件
loadlanguageFile(top.language);
function submitF() {
    if (!validator.form())
        return;
    LAPI_FormToCfg("frmSetup",jsonMap,dataMap,mappingMap);
    if (isObjectEquals(jsonMap,jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0); //未修改提示
        return;
    } 
    if(!LAPI_SetCfgData(LAPI_URL.ArpBinding,jsonMap))return;
    jsonMap_bak = objectClone(jsonMap);
}

function initData(){
    jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.ArpBinding, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap,dataMap,mappingMap);
}

function checkMACValid(value)
{
    var t = /[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}/;
    if (!t.test(value) && "" !== value)
    {
        return 0;
    }
    return 1 ;
}

function initValidator(){
    $("#MACAddress").attr("tip",$.lang.tip["tipMacAddress"]);
    
    $.validator.addMethod("checkMACValid", function(value) {
        return checkMACValid(value);
    }, $.lang.tip["tipMacAddress"]);
    
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            MACAddress: {
                checkMACValid:""
            }
        }
    });
     validator.init();
}

$(document).ready(function() {

        parent.selectItem("staticARPTab");//菜单选中

        beforeDataLoad();
        // 初始化语言标签
        initLang();
        initData();
        initValidator();
        afterDataLoad();
});