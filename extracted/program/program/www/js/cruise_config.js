GlobalInvoke(window);
loadlanguageFile(top.language);
var jsonMap = {};
var jsonMap_bak = {};
var jsonMapTime = {};
var jsonMapTime_bak = {};
var validator;

function submitF() {
    if (!validator.form()) {
        return;
    }
    LAPI_FormToCfg("frmSetup", jsonMap);
    LAPI_FormToCfg("frmSetup", jsonMapTime);
    var isChanged = !isObjectEquals(jsonMap,jsonMap_bak);
    var isChangedTime = !isObjectEquals(jsonMapTime,jsonMapTime_bak);
    if (!isChanged && !isChangedTime) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }

    if(isChanged){
        if(!LAPI_SetCfgData(LAPI_URL.PresetLink, jsonMap)) return;
        jsonMap_bak = objectClone(jsonMap);
    }
    if(isChangedTime){
        if(!LAPI_SetCfgData(LAPI_URL.ResumeTime, jsonMapTime)) return;
        jsonMapTime_bak = objectClone(jsonMapTime);
    }
}

function initData(){
    if (!LAPI_GetCfgData(LAPI_URL.PresetLink, jsonMap) || !LAPI_GetCfgData(LAPI_URL.ResumeTime, jsonMapTime)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap);
    jsonMapTime_bak = objectClone(jsonMapTime);
    LAPI_CfgToForm("frmSetup", jsonMapTime);
}

function initValidator() {
    $("#Time").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 3600));
    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success : function(label) {
        },
        rules : {
                Time : {
                integer : true,
                required : true,
                range : [1, 3600]
            }
        }
    });
    validator.init();
}

$(document).ready(function() {
    parent.selectItem("cruiseCfgTab");
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initValidator();
    initData();
    afterDataLoad();
});