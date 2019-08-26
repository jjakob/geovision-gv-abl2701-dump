// JavaScript Document
GlobalInvoke(window);
function safeType_change() {
    var v = $("#safeType").val();
    var arr = v.split(",");
    if ("0,0" == v) {
        $("#passwordDL").addClass("hidden");
    } else {
        $("#passwordDL").removeClass("hidden");
    }
    $("#AuthMode").val(arr[0]);
    if (2 == arr.length) {
        $("#EncrypType").val(arr[1]);
    }
}

function submitWinData() {
    var $SSID = $("#SSID");
    if ($SSID.is(":visible") && !validator("SSID"))
        return;
    var $Key = $("#Key");
    if ($Key.is(":visible") && !validator("Key"))
        return;
    if ("add" == type) {
        parent.$("#SSID").val($SSID.val());
        parent.$("#EncrypType").val($("#EncrypType").val());
        parent.$("#AuthMode").val($("#AuthMode").val());
    }
    parent.$("#Key").val($Key.val());
    var flag = parent.submitF();
    if (("add" == type) || flag) {
        parent.closeWin();
    } else {
        $("#errInfo").removeClass("hidden")
    }
}

function validator(id) {
    var flag = true;
    var v = $("#" + id).val();
    if ("" == v) {
        if ("Key" == id) {
            alert($.lang.tip["tipPasswordCanNotNull"]);
        } else {
            alert($.lang.tip["tipSSIDCanNotNull"]);
        }
        return false;
    } else if (!checkServerID(v)) {
        alert($.lang.tip["tipCharFmtErr"]);
        flag = false;
    }
    return flag;
}

$(document).ready(function() {
    // 初始化语言标签
        initLang();
        document.frmSetup.reset();
    var $SSID = $("#SSID");
    if ("connect" == type) {
            $SSID.val(parent.$("#SSID").val());
            $("#baseDL").addClass("hidden");
            $("#passwordDL").removeClass("hidden");
        }
        $SSID.attr("title", $.lang.tip["tipDeviceID"]);
        $("#Key").attr("title", $.lang.tip["tipDeviceID"]);
        $("#safeType").change(safeType_change);
    });