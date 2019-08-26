GlobalInvoke(window);
var dataMap = {};
var jsonMap = {
    Telnet: [{TelnetEnable:["Enable"]},{}],
    FriendPassword: [{friendPasswordEnable: ["Enable"]},{}]
};
var jsonMap_bak={};

//加载语言文件
loadlanguageFile(top.language);

function submitF(){
    LAPI_submitF(LAPI_URL.TelnetEnableCfg, jsonMap["Telnet"][1], dataMap, jsonMap["Telnet"][0]);
    LAPI_submitF(LAPI_URL.FriendPwd, jsonMap["FriendPassword"][1], dataMap, jsonMap["FriendPassword"][0]);
    top.banner.isFriendPasswordEnable = dataMap["friendPasswordEnable"];
}
function LAPI_submitF(url, jsonmap, datamap, mappingmap) {
    var flag;
    LAPI_FormToCfg("frmSetup",jsonmap, datamap, mappingmap);
    var isChanged = !isObjectEquals(jsonMap, jsonMap_bak);
    if (!isChanged) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }
    flag = LAPI_SetCfgData(url,jsonmap);
    if(flag) {
        jsonMap_bak=objectClone(jsonMap );
    };
}
function initData(){
    LAPI_initData(LAPI_URL.TelnetEnableCfg, jsonMap["Telnet"][1], dataMap, jsonMap["Telnet"][0]);
    LAPI_initData(LAPI_URL.FriendPwd, jsonMap["FriendPassword"][1], dataMap, jsonMap["FriendPassword"][0]);
    cfgToForm(dataMap, "frmSetup");

    jsonMap_bak = objectClone(jsonMap);
}
function LAPI_initData(url, jsonmap,datamap,mappingmap){
    if (!LAPI_GetCfgData(url, jsonmap)) {
        disableAll();
        return;
    }
    LAPI_CfgToForm("frmSetup",jsonmap,datamap,mappingmap);
}

$(document).ready(function() {
        parent.selectItem("telnetCfgTab");//菜单选中
        beforeDataLoad();
        initLang();
        initData();
        afterDataLoad();
});