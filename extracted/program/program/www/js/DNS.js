// JavaScript Document
GlobalInvoke(window);
var validator = null;
var dataMap = {};
var dnsMap = {};
var channelId = 0;
var jsonMapDNS = {};
var jsonMapDNS_bak = {};
var mappingMapDNS = {
    PreferredDNSServer:["IpAddr"],
    AlternateDNSServer:["IpAddrBak"]
};

function submitF()
{
    if(!validator.form())return;
    LAPI_FormToCfg("frmSetup", jsonMapDNS, dnsMap, mappingMapDNS);
    var isChangedDns = !isObjectEquals(jsonMapDNS,jsonMapDNS_bak);

    if (!isChangedDns)
    {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }

    if (isChangedDns) {
        if (!LAPI_SetCfgData(LAPI_URL.DNS_Cfg, jsonMapDNS)) return;
        jsonMapDNS_bak = objectClone(jsonMapDNS);
    }

}


function initEvent(){

    $("#PreferredDNSServer").change(function(){
        if("" == $("#PreferredDNSServer").val())
        {
            $("#PreferredDNSServer").val("0.0.0.0");
        }
    });

    $("#AlternateDNSServer").change(function(){
        if("" == $("#AlternateDNSServer").val())
        {
            $("#AlternateDNSServer").val("0.0.0.0");
        }
    });
}

function init()
{
    dnsMap = {};
    jsonMapDNS = {};

    if(!LAPI_GetCfgData(LAPI_URL.DNS_Cfg, jsonMapDNS))
    {
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        disableAll();
        return;
    }
    jsonMapDNS_bak = objectClone(jsonMapDNS);
    LAPI_CfgToForm("frmSetup", jsonMapDNS, dnsMap, mappingMapDNS);
}

$(document).ready(function(){
    parent.selectItem("DNSTab");
    beforeDataLoad();
    initLang();

    $("#PreferredDNSServer").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#AlternateDNSServer").attr("tip",$.lang.tip["tipGatewayInfo"]);


    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
    }, $.lang.tip["tipIPRangeErr"]);

    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function(label) {
        },
        rules: {
            PreferredDNSServer: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            },
            AlternateDNSServer: {
                checkIPAddrOrEmpty:"",
                checkIP1To223OrEmpty:""
            }
        }
    });
    initEvent();
    init(document.frmSetup);
    afterDataLoad();
});/**
 * Created by w02927 on 2016/3/18.
 */
