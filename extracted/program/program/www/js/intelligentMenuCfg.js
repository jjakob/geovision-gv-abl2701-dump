/**
 * Created by w02927 on 2017/4/12.
 */
GlobalInvoke(window);
//加载语言文件
loadlanguageFile(top.language);
var smartMap = {};
var totalArr = [0, 1, 3, 4, 100,101,102,103,104,105,200, 201, 202, 203, 204, 205,206]
var totalNum = totalArr.length;
var smart1Arr = [100,101,102,103,104,105];//smart1,放在这供参考
var smart2Arr = [200, 201, 202, 203, 204, 205,206];//smart2
var smartMapping = {
    0 : $.lang.pub["faceDetectTitle"],
    1 : $.lang.pub["peopleCountMenu"],
    2 : $.lang.pub["twCapture"],
    3 : $.lang.pub["smartTrackLink"],
    4 : $.lang.pub["Chain_Calculation"],
    100 : $.lang.pub["crossBorderTitle"],
    101 : $.lang.pub["ruleType_stay"],
    102 : $.lang.pub["enterArea"],
    103 : $.lang.pub["leaveArea"],
    104 : $.lang.pub["wanderDetect"],
    105 : $.lang.pub["fastMove"],
    199 : $.lang.pub["alarmMenu"],
    200 : $.lang.pub["peopleGather"],
    201 : $.lang.pub["parkDetect"],
    202 : $.lang.pub["leftGood"],
    203 : $.lang.pub["handleGood"],
    204 : $.lang.pub["virtualFocusTitle"],
    205 : $.lang.pub["sceneChangeTitle"],
    206 : $.lang.pub["heatMap"],
    299 : $.lang.pub["alarmAbnorMenu"]
}
var smartSpecial =5;//目前总共有五类：人脸检测，天网卡口，客流量，链式计算，告警联动跟踪，数字从0到4



/*互斥逻辑:
1.人脸、人数统计、天网卡口（道路监控）、跟踪这四个功能之间互斥 （链式计算需要重新考虑），只会有一种功能的结果。
2.跟踪与人脸、人数统计、天网卡口、热度图、场景变更、虚焦检测、物品遗留/拿取、停车检测、人员聚集、链式计算全都冲突。
3.人脸与所有功能都冲突。
4.人数统计与人脸检测、天网卡口、跟踪冲突，其他功能开启时会影响人数统计指标（备注：人数统计算法内部可以于人脸检测、天网卡口、跟踪可以同时启用，但是同时启用后会影响性能指标，所以也不允许同时启动，定义为互斥关系）
5.天网卡口与所有功能都冲突。
6.热度图与跟踪冲突。
7.链式计算一期与所有功能冲突。
8.场景变更、虚焦检测、物品遗留/拿取、停车检测、人员聚集、越界检测、区域入侵、进入/离开、快速移动、徘徊检测与上述与其冲突的功能不能同时开。
* */
function getStatusFunc() {
    var checkSmartId,
        smart1 = false,
        smart2 = false,
        smartMap={},
        oldSmartMap = {};

    $(".menuStyle").removeClass("greyColor");
    if(!LAPI_GetCfgData(LAPI_URL.MutexWorkingStatus,oldSmartMap)){
        return ;
    }
    smartMap = filterDataFunc(oldSmartMap);//数据筛选处理
    for(var i in smartMap["DisableIDs"]){
        var noCheckSmart = smartMap["DisableIDs"][i];
        $(".smart_"+noCheckSmart).attr("checked",false);
        $(".smart_"+noCheckSmart).next().removeClass("disabled_"+noCheckSmart).removeClass("open_"+noCheckSmart).addClass("close_"+noCheckSmart);
    }
    for(var i in smartMap["EnableIDs"]){
        $(".smart_"+smartMap["EnableIDs"][i]).attr("checked",true);
        checkSmartId = smartMap["EnableIDs"][i];
        $(".smart_"+checkSmartId).next().addClass("open_"+checkSmartId).removeClass("close_"+checkSmartId).removeClass("disabled_"+checkSmartId);
        if(100 <= checkSmartId && 200 > checkSmartId){
            smart1 = true;
        }
        if(200 <= checkSmartId && 300 > checkSmartId){
            smart2 = true;
        }
    }

    if ($(".smart2").parent(":visible").length > 0) {
        $("#smart2").removeClass("hidden");
    } else {
        $("#smart2").addClass("hidden");
    }

    if(smart1){//smart1开启
        for(var i=0;i<smartSpecial;i++){
            $(".smart_"+i).parent().addClass("greyColor");
        }
        $(".smart1").parent().removeClass("greyColor");

    }
    if(smart2){//smart2开启
        if(!smart1){
            for(var i=0;i<smartSpecial;i++){
                $(".smart_"+i).parent().addClass("greyColor");
            }
            $(".smart1").parent().removeClass("greyColor");
            $(".smart2").parent().removeClass("greyColor");
        }
    }
    if(!smart1 && !smart2 && (smartMap["EnableNum"] > 0)){//smart1和2都未开启但是天网卡口这些开启了任一
        for(var i=0;i<smartSpecial;i++) {
            if (smartMap["EnableIDs"] != i) {
                $(".smart_" + i).parent().addClass("greyColor");
            }else{
                $(".smart_" + i).parent().removeClass("greyColor");
            }
            $(".smart2").parent().addClass("greyColor");
            $(".smart1").parent().addClass("greyColor");
        }
    }

    for(var i in totalArr){//遍历所有背景会互斥灰色的，背景灰色时功能图标对应颜色变淡
        if($(".smart_"+totalArr[i]).parent().hasClass("greyColor")){
            $(".smart_"+totalArr[i]).next().addClass("disable_"+totalArr[i]).removeClass("close_"+totalArr[i]);
            $(".smart_"+totalArr[i]).parent().attr("title",$.lang.pub["smartMutexbgColor"]);//互斥背景显示淡灰色的提示添加悬浮提示语
        }else{//背景不灰显时意味着有可能勾选或者未勾选，未勾选需要将图标背景色变化
            $(".smart_"+totalArr[i]).next().removeClass("disable_"+totalArr[i])
            if(!$(".smart_"+totalArr[i]).next().hasClass("open_"+totalArr[i])){
                $(".smart_"+totalArr[i]).next().addClass("close_"+totalArr[i]);
            }
        }
    }
}

//处理接入NVR问题，若NVR处未进行互斥管理，会导致本该互斥的同时下发了，界面会异常，在收到接口数据后进行筛选处理
//若enable中有互斥的按照优先级高低来筛选，使结果符合互斥关系
function filterDataFunc(dataMap) {
    var smartIndexArr = [],
        totalSmart = [],
        i,
        len;

    dataMap["EnableIDs"].sort(function (a,b) {
        return a-b;
    });//从小到大排序
    totalSmart = totalSmart.concat(dataMap["EnableIDs"],dataMap["DisableIDs"])
    for(i = 0, len = dataMap["EnableIDs"].length; i < len; i++){
        if(dataMap["EnableIDs"][i] < 10){
            smartIndexArr.push(dataMap["EnableIDs"][i]);//因为排序过所以第一个获取到的优先级就是最高的
            break;
        }
    }

    if(smartIndexArr.length > 0){
        dataMap["EnableIDs"] = smartIndexArr;
        dataMap["EnableNum"] = 1;
        for(var i=0; i<totalSmart.length; i++) {
            if (totalSmart[i] == smartIndexArr[0]) {
                totalSmart.splice(i, 1);
            }
        }
        dataMap["DisableIDs"] = totalSmart;
        dataMap["DisableNum"] = totalSmart.length;
    }
    return dataMap;
}

function initEvent() {
    $(".smartType").bind("click",function () {
        var name = this.className.split(" ")[0];
        var value = name.split("_")[1];

        var flagCheck = $(".smart_"+Number(value)).is(':checked')
        if(!mutexSmartFunc(flagCheck,Number(value))){
            $(".smart_"+Number(value)).attr("checked",!flagCheck);
            return;
        }
        getStatusFunc();
    })
}

function  jumpToPage(page,pageType) {
    var newPage,
        tabLinkName;

    switch (page){
        case 0:
            newPage = "smart_areadetect.htm";
            break;
        case 1:
            newPage = "smart_scenedetect.htm";
            if(0 == pageType){
                tabLinkName = "virtualFocusLink";
            }else{
                tabLinkName = "sceneChangeLink";
            }
            break;
        case 2:
            newPage = "heatmap_config.htm";
            tabLinkName = "heatMapLink";
            break;
        case 3:
            newPage = "iva_capture.htm";
            tabLinkName = "ivaCaptureLink";
            break;
        case 4:
            newPage = "smart_peoplecount.htm";
            tabLinkName = "smartPeopleCountLink";
            break;
        case 5:
            newPage = "operate_intelligent.htm";
            tabLinkName = "smartTrafficLink";
            break;
        case 6:
            newPage = "smart_track.htm";
            tabLinkName = "smartTrackLink";
            break;
        case 7:
            newPage = "smart_chain.htm";
            tabLinkName = "smartChainLink";
            break;
    }
    if(0 == page){
        switch (pageType){
            case 0:
                tabLinkName = "crossBorderLink";
                break;
            case 1:
                tabLinkName = "areaStayLink";
                break;
            case 2:
                tabLinkName = "enterAreaLink";
                break;
            case 3:
                tabLinkName = "leaveAreaLink";
                break;
            case 4:
                tabLinkName = "wnderDetectLink";
                break;
            case 5:
                tabLinkName = "peoplegatherLink";
                break;
            case 6:
                tabLinkName = "fastMoveLink";
                break;
            case 7:
                tabLinkName = "parkDetectLink";
                break;
            case 8:
                tabLinkName = "leftGoodLink";
                break;
            case 9:
                tabLinkName = "handerGoodLink";
                break;
        }
    }
    parent.initTabItems(tabLinkName);
    window.location = newPage+"?pageType="+pageType;
}

function initData() {
    getStatusFunc();
}

function  initPage() {
    if(top.banner.isSupportsystemSetUpLink){
        $(".twCaptureContent").removeClass("hidden");
    }
    if(top.banner.isSupportCrossLine){
        $(".crossBorder").removeClass("hidden");
    }
    if(top.banner.isSupportEnterZone){
        $(".enterArea").removeClass("hidden");
    }
    if(top.banner.isSupportLeafeZone){
        $(".leaveArea").removeClass("hidden");
    }
    if(top.banner.isSupportWanderDetect){
        $(".wanderDetect").removeClass("hidden");
    }
    if(top.banner.isSupportIntrosionZone){
        $(".ruleType_stay").removeClass("hidden");
    }
    if(top.banner.isSupportFastMove){
        $(".fastMove").removeClass("hidden");
    }
    if(top.banner.isSupportPeopleGather){
        $(".peopleGather").removeClass("hidden");
    }
    if(top.banner.isSupportParkDetect){
        $(".parkDetect").removeClass("hidden");
    }
    if(top.banner.isSupportHandleGood){
        $(".handleGood").removeClass("hidden");
    }
    if(top.banner.isSupportLeftGood){
        $(".leftGood").removeClass("hidden");
    }
    if(top.banner.isSupportOutFocus){
        $(".virtualFocusTitle").removeClass("hidden");
    }
    if(top.banner.isSupportSceneChange){
        $(".sceneChangeTitle").removeClass("hidden");
    }
    if(top.banner.isSupoortHeatMap){
        $(".heatMap").removeClass("hidden");
    }
    if((IVACommonMode.KAKOU == top.banner.IVACommonType || top.banner.isSupportPersonPhoto)||top.banner.isSupportFaceDetection || top.banner.isSupportFaceQualityPro){
        $(".faceDetectTitle").removeClass("hidden");
    }
    if(top.banner.isSupportSmartPeopleCount){
        $(".peopleCountMenu").removeClass("hidden");
    }
    if(top.banner.isSupportChain){
        $(".Chain_Calculation").removeClass("hidden");
    }
    if(top.banner.isSupportSmartTrack){
        $(".smartTrackLink").removeClass("hidden");
    }


    if(!top.banner.isSupportSmartAlarm){//该能力集包含了smart1以及smart除了热度图以外
        $("#smart1").addClass("hidden");
        if(!top.banner.isSupoortHeatMap){
            $("#smart2").addClass("hidden");
        }
    }
}

$(document).ready(function(){
    parent.selectItem("intelligentMenuCfgTab");//菜单选中
    beforeDataLoad();
    initPage();
    //初始化语言标签
    initLang();
    initEvent();
    initData();
    afterDataLoad();
});