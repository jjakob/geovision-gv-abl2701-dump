GlobalInvoke(window);
var jsonMap = {};
var jsonMap_bak = {};

function initPage() {
}

function submitF() {
    var flag;
    if (!validator.form()) return;

    LAPI_FormToCfg("frmSetup", jsonMap);
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }

    flag = LAPI_SetCfgData(LAPI_URL.SSLVPN, jsonMap);
    if(flag) {
        jsonMap_bak = objectClone(jsonMap);
    }
}

function initData(){
    if (!LAPI_GetCfgData(LAPI_URL.SSLVPN, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap);
}

//jquery验证框架
function initValidator() {
    $("#Address").attr("tip",$.lang.tip["tipGatewayInfo"]);
    $("#Port").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
    $.validator.addMethod("checkIPAddrOrEmpty", function(value) {
        return checkIPAddrOrEmpty(value);
    }, $.lang.tip["tipIPErr"]);
    $.validator.addMethod("checkIP1To223OrEmpty", function(value) {
        return checkIP1To223OrEmpty(value);
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
        Address : {
            checkIPAddrOrEmpty:"",
            checkIP1To223OrEmpty:""
        },
        Port : {
            integer : true,
            required : true,
            range : [ 1, 65535 ]
        }
    }
});
    validator.init();
}

$(document).ready(function() {
        parent.selectItem("sslVpnCfgTab");//菜单选中
        beforeDataLoad();
        // 初始化语言标签
        initPage();
        initLang();
        initValidator();
        initData();
        afterDataLoad();
});