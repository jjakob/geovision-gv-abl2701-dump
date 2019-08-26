
GlobalInvoke(window);
var dataMap = {};
var channelId = 0;
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    SNMPV3Enable:["Enable"],
    SNMPV3UserName:["UserName"],
    SNMPV3AuthName:["AuthName"],
    SNMPV3AuthKey:["AuthKey"],
    SNMPV3PrivName:["PrivName"],
    SNMPV3PrivKey:["PrivKey"]
};
function validPwdCheck(v)
{
    var t = /[^0-9A-Za-z_\-@]{1,}/;
    if (!t.test(v))
    {
        if(v.length >= 8&& v.length <= 32)
        return true;
    }
    return false;
}
function submitF()
{   
    if(!validator.form()){ 
        return;
    }
    LAPI_FormToCfg("frmSNMP", jsonMap, dataMap, mappingMap);
    var isChanged = !isObjectEquals(jsonMap,jsonMap_bak);
    if(isChanged) {
        if (LAPI_SetCfgData(LAPI_URL.SNMP_Cfg, jsonMap)) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}
function initValidator(){
        
        $("#SNMPV3AuthKey").attr("tip",$.lang.tip["tipSNMPPwdInfo"]);
        $("#cfgAuthKey").attr("tip",$.lang.tip["tipSNMPPwdInfo"]);
        $("#SNMPV3PrivKey").attr("tip",$.lang.tip["tipSNMPPwdInfo"]);
        $("#cfgPrivKey").attr("tip",$.lang.tip["tipSNMPPwdInfo"]);

    $.validator.addMethod("valPwd",function(value){
        return validPwdCheck(value);
    }, $.lang.tip["tipSNMPKeyErr"]);
    $.validator.addMethod("cfgAuthKeyPwd", function(){
        return ($("#SNMPV3AuthKey").val() == $("#cfgAuthKey").val());
    }, $.lang.tip["tipCfmKeyErr"]);
    $.validator.addMethod("cfgPrivPwd", function(){
        return ($("#SNMPV3PrivKey").val() == $("#cfgPrivKey").val());
    }, $.lang.tip["tipCfmKeyErr"]);
    
    
    validator = $("#frmSNMP").validate( {
    focusInvalid : false,
    errorElement : "span",
    errorPlacement : function(error, element) {
        showJqueryErr(error, element, "span");
    },
    success : function(label) {
    },
    rules : {
        SNMPV3AuthKey : {
            required : true,
            valPwd : ""
        },
        cfgAuthKey : {
            required : true,
            valPwd:"",
            cfgAuthKeyPwd:""
        },
        SNMPV3PrivKey : {
            required : true,
            valPwd : ""
        },
        cfgPrivKey : {
            required : true,
            valPwd:"",
            cfgPrivPwd:""
        }
    }
});
    validator.init();
        
}
function initData(){
    jsonMap = {};
    dataMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.SNMP_Cfg,jsonMap))
        return ;
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSNMP", jsonMap, dataMap, mappingMap);
    $("#cfgAuthKey").val($("#SNMPV3AuthKey").val());
    $("#cfgPrivKey").val($("#SNMPV3PrivKey").val());
}


$(document).ready(function(){
    parent.selectItem("SNMPCfgTab");// 菜单选中
    beforeDataLoad();
    initLang();
    initValidator();
    initData();
    afterDataLoad();
});