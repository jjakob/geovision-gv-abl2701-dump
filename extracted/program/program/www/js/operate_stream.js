// JavaScript Document
var channelId = 0;
GlobalInvoke(window);
loadlanguageFile(top.language);
var streamNum = 1;
var mappingMap = {
    StreamID: ["Src", "StreamID"],
    IPAddr: ["Dest", "Address"],
    Port: ["Dest", "Port"],
    TransMode: ["TransMode"],
    Reserved: ["IsReservedAfterReboot"],
    SessionID: ["ID"]
};

var headInfoList = [
    {
        fieldId: "SessionID",
        hidden: true
    },
    {
        fieldId: "StreamID"
    },
    {
        fieldId: "IPAddr"
    },
    {
        fieldId: "Port"
    },
    {
        fieldId: "TransMode"
    },
    {
        fieldId: "Reserved"
    },
    {
        fieldId: "option",
        fieldType: "option",
        defineContextFn: function (map) {
            var optionStr = "";
            optionStr = "<a href='#' class='icon black-del' rowNum=rowNum onclick='this.blur();removeData($(this).attr(\"rowNum\"));' title='"
                + $.lang.pub["del"] + "'></a>";
            return optionStr;
        }
    }
];
// 删除数据
function removeData(rowNum) {
    var sessionId,
        streamId,
        delMap = {};
    streamId = dataView.getData(rowNum, "StreamID");
    sessionId = dataView.getData(rowNum, "SessionID");
    // 调用删除数据接口
    if (!LAPI_DelCfgData(LAPI_URL.STREAM_CFG + streamId + "/Streamings/" + sessionId, delMap)) {
        alert($.lang.tip["tipDeleteFailed"]);
        return;
    }
    dataView.refresh();
}
// 获取参数
function getData() {
    var dataList = [],
        jsonMap = {},
        index,
        map;

    if (!LAPI_GetCfgData(LAPI_URL.STREAM_CFG+"Streamings", jsonMap)) {
        disableAll();
        return;
    }
    for (index = 0; index < jsonMap["Num"]; index++) {
        map = {};
        changeMapToMapByMapping(jsonMap["StreamingInfos"][index], mappingMap, map, 0);
        dataList.push(map);
    }
    return dataList;
}
function addStream() {
    openWin($.lang.pub["addStream"], "stream_edit.htm", 500, 300, false);
}

function init() {
    var tmpMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.VideoEncode, tmpMap)) {
        disableAll();
        return;
    }
    for (var i = 0; i < top.banner.maxStreamNum; i++) {
        if (tmpMap["VideoEncoderCfg"][i]["VideoStreamCfg"]["IsEnable"] == 0) {
            break;
        }
    }
    streamNum = i;
    dataView = new DataView("dataview_tbody", getData, headInfoList);
    dataView.setFields({
        StreamID: function (data) {
            if (top.banner.isSupportFishEye) {
                if (0 == data)
                    data = $.lang.pub["channelID1"];
                if (1 == data)
                    data = $.lang.pub["channelID2"];
                if (2 == data)
                    data = $.lang.pub["channelID3"];
                if (3 == data)
                    data = $.lang.pub["channelID4"];
                if (4 == data)
                    data = $.lang.pub["channelID5"];
                if (5 == data)
                    data = $.lang.pub["channelID6"];
		if (7 == data)
                    data = $.lang.pub["metaDataStream"];
            } else {
                if (0 == data)
                    data = $.lang.pub["mainVideoStream"];
                if (1 == data)
                    data = $.lang.pub["roleVideoStream"];
                if (2 == data)
                    data = $.lang.pub["thirdVideoStream"];
                if (3 == data)
                    data = $.lang.pub["photoStream"];
		if (7 == data)
                    data = $.lang.pub["metaDataStream"];
            }
            return data;
        },
        TransMode: function (data) {
            if (0 == data || 4 == data) {
                data = "UDP";
            } else {
                data = "TCP";
            }
            return data;
        },
        Reserved: function (data) {
            if (0 == data)
                data = $.lang.pub["no"];
            if (1 == data)
                data = $.lang.pub["yes"];
            return data;
        }
    });
    dataView.createDataView();
}

$(document).ready(function () {
    parent.selectItem("streamTab");//菜单选中
    beforeDataLoad();
    //初始化语言标签
    initLang();
    init();
    afterDataLoad();
});
