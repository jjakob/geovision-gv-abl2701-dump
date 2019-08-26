// JavaScript Document
GlobalInvoke(window);

var channelId = 0;
var dataMap = {};
var validator = null;
var keyDataList ={};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    DDNSServerName:["ServerName"],
    DDNSUserName:["UserName"],
    DDNSPassword:["PassWord"],
    DDNSDomainName:["DeviceDomain"]
};
//加载语言文件
loadlanguageFile(top.language);


function displayPrivateDDNS(ddnsType){
    if(2 == ddnsType){
        $("#ddnsUserName").parent().addClass("hidden");
        $("#ddnsPassword").parent().addClass("hidden");
        $("#ddnsPasswordConfirm").parent().addClass("hidden");
        $("#CheckDomain").parent().removeClass("hidden");
        $("#ddnsDomainName").parent().removeClass("hidden");
        $("#DDNSDomainName").attr("tip",$.lang.tip["tipDDNSDomainName"]);
        $("#deviceAddress").parent().removeClass("hidden");
        $.validator.addMethod("checkDDNSDomainName", function(value) {
            return checkDDNSDomainName(value);
        }, $.lang.tip["tipDDNSDomainName"]);
        DDNSDomainName_change();
    } else if(5 == ddnsType){
        $("#ddnsUserName").parent().removeClass("hidden");
        $("#ddnsPassword").parent().removeClass("hidden");
        $("#ddnsPasswordConfirm").parent().removeClass("hidden");
        $("#CheckDomain").parent().addClass("hidden");
        $("#ddnsDomainName").parent().addClass("hidden");
        $("#deviceAddress").parent().addClass("hidden");
        $("#testDomainDiv").addClass("hidden");
    } else {
        $("#ddnsUserName").parent().removeClass("hidden");
        $("#ddnsPassword").parent().removeClass("hidden");
        $("#ddnsPasswordConfirm").parent().removeClass("hidden");
        $("#CheckDomain").parent().addClass("hidden");
        $("#ddnsDomainName").parent().removeClass("hidden");
        $("#DDNSDomainName").attr("tip",$.lang.validate["valUrl"]);
        $("#deviceAddress").parent().addClass("hidden");
        $.validator.addMethod("checkDDNSDomainName", function(value) {
            return checkDDNSDomainName(value);
        },$.lang.validate["valUrl"]);
        $("#testDomainDiv").addClass("hidden");
    }
}

function changeDDNSType(value)
{
    var selectedDdnsDataMap=keyDataList[value];
    LAPI_CfgToForm("frmSetup",selectedDdnsDataMap,dataMap,mappingMap);
    $("#DDNSPasswordConfirm").val(selectedDdnsDataMap["PassWord"]);
    displayPrivateDDNS(value);
}

function refreshDDNSTypeOption() {
    var str = "";
    var DDNSs = {},
        i;
    for (i = 0; i < jsonMap["Number"]; i++) {
        DDNSs[jsonMap["DDNSs"][i]["Type"]] = jsonMap["DDNSs"][i];
    }
    for (var each in DDNSs) {
        str += "<option value='" + each +"'>"+DDNSs[each]["TypeName"]+"</option>";
    }
    $("#UsedType").append(str);
}


function checkDDNSDomainName(v) {
    if ( 2 != $("#UsedType").val() )//只要不是私有DDNS时候校验
    {
        var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
            + '|' // 允许IP和DOMAIN（域名） 
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
            + '[a-z]{2,6})' // first level domain- .com or .museum 
            + '(:[0-9]{1,4})?' // 端口- :80 
            + '((/?)|' // a slash isn't required if there is no file name 
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        var reg=new RegExp(strRegex); //RegExp 是正则表达式的缩写，RegExp 对象用于规定在文本中检索的内容。
        return reg.test(v);//test() 方法检索字符串中的指定值。返回值是 true 或 false
    } else {
        return checkDDNSDomainNameLength($("#DDNSDomainName").val());
    }
}

function checkDDNSPasswordConfirm(value){
        return $("#DDNSPassword").val()==value;
}

function DDNSDomainName_change() {
    if (2 != $("#UsedType").val()) return; // 非EZDDNS不处理

    var address = $("#DDNSServerName").val();
    var DDNSDomainName = $("#DDNSDomainName").val();

    if ("" != DDNSDomainName) {
        address +="/" +　DDNSDomainName;
    }

    $("#deviceAddress").html(address)
}


function submitF() {
    if(!validator.form()) return;
    var selectedIndex= $("#UsedType").val();
    LAPI_FormToCfg("frmSetup",jsonMap);
    LAPI_FormToCfg("frmSetup",keyDataList[selectedIndex],dataMap,mappingMap);
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }
    if(!LAPI_SetCfgData(LAPI_URL.DDNS_Cfg,jsonMap))return;
    jsonMap_bak = objectClone(jsonMap);
}

function checkUserPwdLength(value){
        var str=value.replace(/[^\x00-\xff]/g, 'xxx');
        if(str.length>63){
            return false;
        }
        return true;
}

function checkDDNSDomainNameLength(value){
    var strRegex = /^[a-zA-Z0-9_-]{4,63}$/;
    var reg=new RegExp(strRegex);
    return reg.test(value);
}

function checkDomainValid(){
    var pcParam =$("#DDNSDomainName").val();
    LAPI_SetCfgData(LAPI_URL.DDNSDomainCheck,{"DeviceDomain":pcParam},false);
}

function showResult(id, bool, msg) {
    if (bool) {
        $("#" + id + " a").removeClass("fail").addClass("success");
    } else {
        $("#" + id + " a").removeClass("success").addClass("fail");
    }
    $("#" + id + " span").text(msg);
    $("#" + id).removeClass("hidden");
}

function eventDomainCheck(pcParam){
    if (1 == pcParam){ //1代表可用
        showResult("testDomainDiv", true, $.lang.tip["tipDomainCheckOK"]);
    } else {
        showResult("testDomainDiv", false, $.lang.tip["tipDomainCheckFail"]);
    }
}


function initValidator() {
    $("#DDNSDomainName").attr("tip",$.lang.validate["valUrl"]);
    $("#DDNSUserName").attr("tip",$.lang.tip["tipDDNSUserName"]);
    $("#DDNSPassword").attr("tip",$.lang.tip["tipDDNSPassword"]);
    $("#DDNSPasswordConfirm").attr("tip",$.lang.tip["tipDDNSPasswordConfirm"]);

    $.validator.addMethod("checkDDNSDomainName", function(value) {
        return checkDDNSDomainName(value);
    }, $.lang.validate["valUrl"]);
    $.validator.addMethod("checkDDNSPasswordConfirm", function(value) {
        return checkDDNSPasswordConfirm(value);
    }, $.lang.tip["tipDDNSPasswordConfirm"]);

    $.validator.addMethod("checkUserPwdLength", function(value) {
        return checkUserPwdLength(value);
    }, $.lang.tip["tipDDNSUserName"]);

    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success: function(label) {
        },
        rules: {
            DDNSDomainName: {
                checkDDNSDomainName:""
            },
            DDNSUserName:{
                checkUserPwdLength:""
            },
            DDNSPassword:{
                checkUserPwdLength:""
            },
            DDNSPasswordConfirm: {
                checkDDNSPasswordConfirm:""
            }
        }
    });
     validator.init();
}

function initEvent() {
    $("#UsedType").change(function(){
        changeDDNSType($("#UsedType").val());
    });

    $("#CheckDomain").parent().click(function(){
        checkDomainValid();
    });

    $("#DDNSDomainName").bind("change", DDNSDomainName_change);

}

function initPage() {
    $("#CheckDomain").parent().removeClass("hidden");
}

//获取参数
function initData() {
    //获取参数失败或是服务器模式
    jsonMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.DDNS_Cfg,jsonMap)){
        disableAll();
        return;
    }
    for (var i = 0; i < jsonMap["Number"]; i++) {
        keyDataList[jsonMap["DDNSs"][i]["Type"]] = jsonMap["DDNSs"][i];
    }
    jsonMap_bak =objectClone(jsonMap);
    refreshDDNSTypeOption();
    var DDNSType = jsonMap["UsedType"];
    LAPI_CfgToForm("frmSetup",keyDataList[DDNSType],dataMap,mappingMap);
    LAPI_CfgToForm("frmSetup",jsonMap);
    displayPrivateDDNS(jsonMap["UsedType"]);
    var selectedDdnsDataMap=keyDataList[jsonMap["UsedType"]];
    $("#DDNSPasswordConfirm").val(selectedDdnsDataMap["PassWord"]);
}

$(document).ready(function() {
    parent.selectItem("DDNSConfigTab");//菜单选中
    beforeDataLoad();
    initPage();
    initLang();
    initValidator();
    initData();
    initEvent();
    afterDataLoad();
});