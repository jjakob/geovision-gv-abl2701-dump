GlobalInvoke(window);
var channelId = 0;
var jsonMap = {};
var jsonMap_bak = {};
var dataMap = {};
var mappingMap = {
    EnableHTTPS: ["Enable"]
};
var pageType = getparastr("pageType");

function chooseFileText(id) {
    var obj = $("#" + id),
        fileNameTxt = $("#FileNameTxt"),
        fileName = obj.val();
    if("FileName" == id) {
        fileNameTxt.val(fileName);
        $("#importBtn").attr("disabled",false);
    }
}

function importCfg() {
    LAPI_UploadFile(LAPI_URL.HTTPS_SSLCERT, "FileName", importCfg_callback);
}

function importCfg_callback(flag) {
    if(flag) {
        top.banner.showMsg(true, $.lang.tip["Uploaded"]);
    } else {
        top.banner.showMsg(false, $.lang.tip["UploadFailed"]);
    }
    $("#FileNameTxt").val("");
    $("#importBtn").attr("disabled", true);
}

function submitF() {
    var flag;

    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);  
    var isChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    
    if (!isChanged) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }
    
    if (isChanged) {
        flag = LAPI_SetCfgData(LAPI_URL.HTTPS_Cfg, jsonMap);
        if (flag) {
            jsonMap_bak = objectClone(jsonMap);
        }
    }
}

function initFile() {
    $("input#FileName[type='file']").attr("accept", ".pem");
}

function initData(){
	jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.HTTPS_Cfg, jsonMap)) {
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
}

function initEvent() {
    $("#browse").click(function(){
        if(chooseFile(FileType.PEM, "FileName")) {
            $("#importBtn").attr("disabled", false);
        }
    });
    $("#importBtn").bind("click", function() {
        importCfg();
    });
}

$(document).ready(function() {
    if (1 == pageType) {
        parent.selectItem("Com_httpsCfgTab");//菜单选中
    } else {
        parent.selectItem("httpsCfgTab");//菜单选中
    }
        beforeDataLoad();
        // 初始化语言标签
        initLang();
        initFile();
        initEvent();
        initData();
        afterDataLoad();
});