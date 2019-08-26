// JavaScript Document
GlobalInvoke(window);
var validator = null;
var jsonMap = {};
var jsonMap_bak = {};
var pageType = getparastr("pageType");
var LAPI_URL_SWITCHOUT = LAPI_URL.OutputSwitch;
var deviceType = parseInt(top.banner.ProductType);

function submitF()
{
    var planChanged = Plan.IsChanged();
    LAPI_FormToCfg("frmSetup", jsonMap);
    var isPageChange = !isObjectEquals(jsonMap,jsonMap_bak);
    if (!isPageChange && !planChanged)
    {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"],0);
        return;
    }
    if(!validator.form()) return;
    
    if (!top.banner.isNotSupportSwitchOutPlan && planChanged) {
        Plan.submitF(LAPI_URL.WeekPlan + "OutputSwitch");
    }
    
    if (isPageChange) {
        channelId = $("#ChannelId").val();
        LAPI_URL_SWITCHOUT = "/LAPI/V1.0/Channel/"+channelId+"/IO/OutputSwitch";        
        if (LAPI_SetCfgData(LAPI_URL_SWITCHOUT,jsonMap)) {
                jsonMap_bak = objectClone(jsonMap);        
        }
    }
}

function init(f)
{
    jsonMap = {};
    channelId = $("#ChannelId").val();
    LAPI_URL_SWITCHOUT = "/LAPI/V1.0/Channel/"+channelId+"/IO/OutputSwitch";
    if( !LAPI_GetCfgData(LAPI_URL_SWITCHOUT, jsonMap))
    {
        disableAll();
        top.banner.showMsg(false, $.lang.tip["tipGetCfgFail"]);
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap);
    
    if(!top.banner.isNotSupportSwitchOutPlan) {
        $("#planDiv").removeClass("hidden");
        Plan.init(LAPI_URL.WeekPlan + "OutputSwitch");
    }
    showSwitchNameDesc(f);
}

function initPage() {
    if(deviceType == DeviceType.DEVICE_IVAGUN) {
        $("#DurationSecms").removeClass("hidden");
    } else {
        $("#DurationSecs").removeClass("hidden");
    }
}
// 更新开关量名称的悬浮信息
function showSwitchNameDesc(f)
{
    $("#SwitchNameDescTitle").attr("tooltipText",f.SwitchNameDesc.value);
}

// 初始化开关量输出
function initSwitchOut()
{
     for (var i=0,len = top.banner.switchOutArr.length; i<len; i++) {
        var v = parseInt(top.banner.switchOutArr[i]);
        $("#ChannelId").append("<option value='"+v+"'>"+$.lang.pub["switchOutName"+(v+1)]+"</option>");
    }
}
    $(document).ready(function(){
        var min,
            max;
        if (1 == pageType) {
            parent.selectItem("switchOutBasicTab");// 选中菜单
        } else {
            parent.selectItem("switchOutAlarmTab");// 选中菜单
        }
       
        beforeDataLoad();
        // 初始化语言标签
        initLang();
        $("#SwitchNameDesc").attr("tip",$.lang.tip["tipName"]);
        if(deviceType == DeviceType.DEVICE_IVAGUN) {
            $("#DurationSec").attr("tip",$.validator.format($.lang.tip["tipIntRange"], 500, 5000));
            min = 500;
            max = 5000;
        } else {
            $("#DurationSec").attr("tip",$.validator.format($.lang.tip["tipIntRange"], 1, 3600));
            min = 1;
            max = 3600;
        }
        $.validator.addMethod("validStrNoNull", function(value) {
            return validStrNoNull(value);
        }, $.lang.validate["valRequired"]);
        validator = $("#frmSetup").validate({
            debug: false,
            focusInvalid: false,
            errorElement: "span",
            errorPlacement: function(error, element) {
                showJqueryErr(error, element, "span");

   
        },
        success: function(label) {
        },
        rules: {
            SwitchNameDesc: {
                maxlength:20,
                validStrNoNull:""
            },
            DurationSec: {
                integer: true,
                required: true,
                range:[min, max]
            }
        },
        submitHandler:submitF
    });
    $("td").tooltip({
        left: 20
    });
    initPage();
    initSwitchOut();
    init(document.frmSetup);
    afterDataLoad();
});