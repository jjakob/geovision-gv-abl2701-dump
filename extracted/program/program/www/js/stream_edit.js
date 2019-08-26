// JavaScript Document
GlobalInvoke(window);
var jsonMap = {
    "Src": {
        "StreamID": ""
    },
    "Dest": {
        "Address": "",
        "Port": ""
    },
    "TransMode": "",
    "IsReservedAfterReboot": ""
};
var dataMap = {
    StreamID: 0,
    IPAddr: "",
    Port: 5000,
    TransMode: 0,
    Reserved: 0
};

function callback(recode, map) {
    var flag = (ResultCode.RESULT_CODE_SUCCEED == recode);

    if (flag) {
        parent.dataView.refresh();// 刷新表格数据
        parent.closeWin();
    } else if (XPErrorResult.VIDEO_STREAM_FULL == recode) {
        top.banner.showMsg(flag, $.lang.tip['tipAddStreamFull']);
    } else {
        top.banner.showMsg(flag, $.lang.tip['tipAddStreamFailed']);
    }
}

function submitWinData() {
    if (!validator.form()) {
        return;
    }
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap,parent.mappingMap);
    jsonMap["TransMode"] = (jsonMap["TransMode"] == 11) ? 0 : jsonMap["TransMode"];
    LAPI_CreateCfgData(LAPI_URL.STREAM_CFG + jsonMap["Src"]["StreamID"] + "/Streamings", jsonMap, false, callback);
}

function initpage() {
    if (top.banner.isSupportFishEye) {
        streamSelectHtml = '<option value="10" lang="channelID1" selected="selected"></option>' +
            '<option value="11" lang="channelID2"></option>' +
            '<option value="12" lang="channelID3"></option>' +
            '<option value="13" lang="channelID4"></option>' +
            '<option value="14" lang="channelID5"></option>' +
            '<option value="15" lang="channelID6"></option>';
    } else {
        if (1 == top.banner.maxStreamNum) {
            streamSelectHtml = '<option value="0" lang="mainVideoStream" selected="selected"></option>';
        }
        else if (2 == top.banner.maxStreamNum) {
            streamSelectHtml = '<option value="0" lang="mainVideoStream" selected="selected"></option>' +
                '<option value="1" lang="roleVideoStream"></option>';
        }
        else {
            streamSelectHtml = '<option value="0" lang="mainVideoStream" selected="selected"></option>' +
                '<option value="1" lang="roleVideoStream"></option>' +
                '<option value="2" lang="thirdVideoStream"></option>';
        }
    }
    $("#StreamID").append(streamSelectHtml);
}

// jquery验证框架
function initValidator() {
    $("#IPAddr").attr("tip", $.lang.tip["tipIPInfo"]);
    $("#Port").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
    $.validator.addMethod("checkIPAddress", function (value) {
        return (isIPAddress(value) && (checkIP1To223(value) || checkIP224To239(value)));
    }, $.lang.tip["tipIPErr"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function (error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function (label) {
        },
        rules: {
            IPAddr: {
                required: true,
                checkIPAddress: ""
            },
            Port: {
                integer: true,
                required: true,
                range: [1, 65535]
            }
        }
    });
    validator.init();
}

$(document).ready(function () {
    // 初始化语言标签
    initpage();
    initLang();
    var streamNum = parent.streamNum;
    for (var i = top.banner.maxStreamNum; i > streamNum; i--) {
        $("#StreamID").find(":last-child").remove();
    }
    initValidator();
    document.frmSetup.reset();
    strLimit();
});