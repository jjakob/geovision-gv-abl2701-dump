GlobalInvoke(window);
var pageType = getparastr("pageType");
var f = document.frmSetup;
var channelId = 0;
var jsonMap = {};
var jsonMap_bak = {};
var trackOptions = [];
var recordTrackOptions = [];

function submitF() {
    if (!validator.form()) {
        return;
    }

    LAPI_FormToCfg("frmSetup",jsonMap);
    var isPtzChanged = !isObjectEquals(jsonMap,jsonMap_bak);
    if (!isPtzChanged) {
        top.banner.showMsg(true, $.lang.tip["tipAnyChangeInfo"], 0);
        return;
    }
    if(!LAPI_SetCfgData(LAPI_URL.PtzGuardCfg, jsonMap)) return;
    jsonMap_bak = objectClone(jsonMap);
}
function initData(){
    jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.PtzGuardCfg, jsonMap)) {
        disableAll();
        return;
    }
    if(1 > Number(jsonMap["Time"])) {
            jsonMap["Time"] = 60;
    }
    jsonMap_bak = objectClone(jsonMap);

    // 需要先确定守望动作模式才能生成守望动作ID选项
    $("#Action").val(jsonMap["Action"]);
    getTrackInfo();
    action_change();
    LAPI_CfgToForm("frmSetup", jsonMap);
}

/**
 * 生成轨迹巡航列表
 */
function getTrackInfo() {
    var tmpMap = {},jsonMap = {};
    if(!LAPI_GetCfgData(LAPI_URL.PTZPatrol,jsonMap))
    {
        return;
    }
    for(var m = 0;m < jsonMap["RouteNum"]; m++){
        tmpMap["Track"+(m+1)+"CruiseNum"] = jsonMap["Route"][m]["PointNum"];
        tmpMap["Track"+(m+1)+"TrackId"] = jsonMap["Route"][m]["RouteID"];
        tmpMap["Track"+(m+1)+"TrackName"] = jsonMap["Route"][m]["RouteName"];
        for(var n = 0;n < jsonMap["Route"][m]["PointNum"]; n++){
            tmpMap["Track"+(m+1)+"Action" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Action"];
            tmpMap["Track"+(m+1)+"Duration" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Duration"];
            tmpMap["Track"+(m+1)+"Speed" + (n+1)] = jsonMap["Route"][m]["RoutePoint"][n]["Speed"];
        }
    }
    trackOptions = [];
    for ( var i = 1; (undefined != tmpMap["Track" + i + "TrackId"]); i++) {
        // 巡航路线下拉列表项
        var preId = "Track" + i;
        var trackId = tmpMap[preId + "TrackId"];
        var firstAction = Number(tmpMap[preId+"Action1"]);
        var optionMap = {};
        optionMap["id"] = trackId;
        optionMap["name"] = tmpMap[preId + "TrackName"];
        if ((firstAction >= modeRouteRange.Start) && ( firstAction <= modeRouteRange.End)) {
            recordTrackOptions.push(optionMap);
        } else {
            trackOptions.push(optionMap);
        }
    }
}

/**
 * 生成下拉框列表
 *
 * @param options
 */
function makeSelectList(options) {
    var select = $("#ID");

    select.empty();
    select.append("<option value='0xFFFFFFFF' title='" + $.lang.pub["none"] + "'>[" + $.lang.pub["none"] + "]</option>");
    for ( var i = 0, len = options.length; i < len; i++) {
        var option = options[i];
        if (!option)
            continue;
        var id = option["id"];
        var name = option["name"];
        var text = id + "[" + name + "]";
        var optionHtml = "<option value='" + id + "' title='" + text + "'>" + text + "</option>";
        select.append(optionHtml);
    }
}

//根据选中的内容显示不同的下拉框值
function action_change(){
    var v = $("#Action").val(),
        presetOption = top.banner.video.$("#position").html();

    if (0 == v) {   // 预置位
        presetOption = presetOption.replace("-1", "0xFFFFFFFF");
        $("#ID").html(presetOption);
    } else if (1 == v) {    // 巡航
        makeSelectList(trackOptions);
    } else if (2 == v) {    // 模式路径
        makeSelectList(recordTrackOptions);
    }
}

function initPage(){
    //支持模式巡航
    if (top.banner.isSupportTrackRecord) {
        $("#Action").append('<option value="2" lang="watchToPrePositionCruise"></option>');
    }
}

//jquery验证框架
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

function initEvent() {
    $("#Action").change(action_change);
}

$(document).ready(function() {
        parent.selectItem("ptzCfgTab");//菜单选中
        beforeDataLoad();
        initPage();
        // 初始化语言标签
        initLang();
        initValidator();
        initEvent();
        initData();
        afterDataLoad();
});