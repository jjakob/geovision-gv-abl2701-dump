GlobalInvoke(window);
var channelId = 0;
var jsonMap = {};
var jsonMap_bak = {};
var validator = null;
//加载语言文件
loadlanguageFile(top.language);
function submitF() {
    var flag;
    if (!validator.form())
        return;
    LAPI_FormToCfg("frmSetup",jsonMap);
    if (isObjectEquals(jsonMap,jsonMap_bak)) {
        top.banner.showMsg(true,$.lang.tip["tipAnyChangeInfo"],0);
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.Watermark,jsonMap);
    if (flag) {
        jsonMap_bak = objectClone(jsonMap);
    }
}

function initData(){
    if (!LAPI_GetCfgData(LAPI_URL.Watermark,jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup",jsonMap);
}

function initValidator(){
    $("#Info").attr("tip",$.lang.tip["tipWaterMarkLength"]);
    
    $.validator.addMethod("validWaterMark", function(value) {
        var regular = new RegExp("^[0-9A-Za-z]{0,16}$");
        return regular.test(value);
    }, $.lang.tip["tipWaterMarkLength"]);
    
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "span");
        },
        success: function(label) {
        },
        rules: {
            Info: {
                validWaterMark:""
            }
        }
    });
     validator.init();
}

$(document).ready(function() {

        parent.selectItem("waterMarkTab");//菜单选中
        beforeDataLoad();
        // 初始化语言标签
        initLang();
        initData();
        initValidator();
        afterDataLoad();
});