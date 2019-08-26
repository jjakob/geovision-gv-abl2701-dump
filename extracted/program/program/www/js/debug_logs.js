/**
 * Created by w02927 on 2017/3/22.
 */
function initPage() {
    var htmlStr = "";
    var debugId = ["CTRL","PTZ","ALM","AM_SIP","STOR","MP","MCP","BP","SDK","SERIAL","SRLZ","MWSNMP","IW",
        "IWSERIAL","IWCAP","IWOBJ","IWMSG","IWSTREAM", "IWDSP","IWOSD","IWXML","IWSWITCH"];
    for(var n=0;n < 22;n++){
        htmlStr +="<div class='contentLine'>"+
            "<label class='textLabel strLimit'>"+debugId[n]+"</label>"+
            "<input type='radio'  name='DebugLog" + n+"'  id ='"+debugId[n]+"Enable'  value='1' />"+
            "<label for='"+debugId[n]+"Enable'>" + $.lang.pub["open"] + "</label>"+
            "<input type='radio' name='DebugLog" + n+"' id ='"+debugId[n]+"Close' value='0' checked='checked' />"+
            "<label for='"+debugId[n]+"Close' >" + $.lang.pub["close"] + "</label>"+
            "</div>"
    }
    $("#debugLogList").html(htmlStr);
}

function initData(){
    var debugLogMap ={},
        switchNum,
        switchList = [],
        iwModuleNum,
        iwModuleList = [];
    if(LAPI_GetCfgData("/LAPI/V1.0/Channel/0/Demo/DebugLog", debugLogMap)){
        $("input[name='IsValidAfterReboot'][value = '"+debugLogMap["IsValidAfterReboot"]+"']").attr("checked",true);
        switchNum = debugLogMap["MainModule"].toString(2);
        switchList = switchNum.split("").reverse();
        iwModuleNum = debugLogMap["IwModule"].toString(2);
        iwModuleList = iwModuleNum.split("").reverse();
        for(var i=0;i<13;i++){
            if(1 == Number(switchList[i])){
                $("input[name='DebugLog"+i+"'][value = 1]").attr("checked",true);
            }else{
                $("input[name='DebugLog"+i+"'][value = 0]").attr("checked",true);
            }

        }
        for(var j=13;i<22;i++){
            if(1 == Number(iwModuleList[i-13])){
                $("input[name='DebugLog"+i+"'][value = 1]").attr("checked",true);
            }else{
                $("input[name='DebugLog"+i+"'][value = 0]").attr("checked",true);
            }

        }
    }
}

function DebugLogSubmitF(){
    var debugList =[],
        swithNum,
        debugLogMap={},
        iwModuleNum,
        iwModuleList = [];
    for(var i=0;i<13;i++){
        debugList[i]= $("input[name='DebugLog"+i+"']:checked").val();
    }
    for(var j=13;i<22;i++){
        iwModuleList[i]= $("input[name='DebugLog"+i+"']:checked").val();
    }
    swithNum = debugList.reverse().join("");
    iwModuleNum = iwModuleList.reverse().join("");
    debugLogMap["MainModule"] = parseInt(swithNum,2);
    debugLogMap["IwModule"] = parseInt(iwModuleNum,2);
    debugLogMap["IsValidAfterReboot"] = Number($("input[name='IsValidAfterReboot']:checked").val());
    LAPI_SetCfgData("/LAPI/V1.0/Channel/0/Demo/DebugLog", debugLogMap);
}

$(document).ready(function () {
    parent.selectItem("DebugLogTab");// 选中菜单
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    initData();
    afterDataLoad();
});