// JavaScript Document
GlobalInvoke(window);

function callback(retCode) {
    if ((ResultCode.RESULT_CODE_SUCCEED == retCode) || (ResultCode.RESULT_CODE_NOT_MOUNT == retCode)) {
        if(ResultCode.RESULT_CODE_SUCCEED == retCode) {
            top.banner.showMsg(true);
        }
        parent.isFirstConnect = true;
        parent.init();
        parent.closeWin();
    } else {
        alert($.lang.tip["tipConnectFailed"]);
    }
}

function submitWinData() {
    if (!validator.form()) {
        return;
    }
    // 下发参数
    parent.jsonMap_NAS["Address"]["Addr"] = $("#Addr").val();
    parent.jsonMap_NAS["Path"] = $("#Path").val();
    LAPI_SetCfgData(LAPI_URL.STOR_NAS_CFG, parent.jsonMap_NAS, false, callback);
}

// jquery验证框架
function initValidator() {
    $("#Addr").attr("tip", $.lang.tip["tipIPInfo"]);
    $("#Path").attr("tip", "");
    $.validator.addMethod("checkIPAddress", function(value) {
        return (isIPAddress(value) && (checkIP1To223(value) || checkIP224To239(value)));
    }, $.lang.tip["tipIPErr"]);
    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "dd");
        },
        success : function(label) {
        },
        rules : {
            Addr : {
                required : true,
                checkIPAddress : ""
            },
            Path : {
                integer : true
            }
        }
    });
    validator.init();
}

$(document).ready(function() {
    // 初始化语言标签
        initLang();
        initValidator();
        cfgToForm(parent.dataMap, "frmSetup");
    });