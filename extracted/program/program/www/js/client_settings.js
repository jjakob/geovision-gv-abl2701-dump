// JavaScript Document
GlobalInvoke(window);
var validator = null;
var dataMap = {};
var channelId = 0;

//根据音频编码格式，修改音频采样率
function AudioEncformat_change() {
    var v = $("#AudioCodeFmt").val();

    var $AudioCodeRate = $("#AudioCodeRate");
    if (2 == v) {
        $AudioCodeRate.html(" <option value='2'>11.025</option>");
        $AudioCodeRate.val(2)
    } else if (0 == v) {//G.711U,采样率为8K
        $AudioCodeRate.html(" <option value='0'>8</option>");
        $AudioCodeRate.val(0);
    }else if (1 == v) {
        $AudioCodeRate.html(" <option value='0'>8</option><option value='1'>16</option>");
    }
    $AudioCodeRate.attr("disabled", (1 != v));
}

//根据能力集修改音频编码格式
function initVideoFormatOption() {
    var list = top.banner.audioFormatArr;
    var str = "";
    for ( var i = 0; i < list.length; i++) {
        var value = Number(list[i]);
        switch (value) {
            case 2:
                str += "<option value='0'>G.711U</option>";
                break;
            case 6:
                str += "<option value='1'>AAC-LC</option>";
                break;
            case 7:
                str += "<option value='2'>PCM</option>";
                break;
            default:
                break;
        }
    }
    $("#AudioCodeFmt").append(str);
}

function RecordWebInfo_change() {
    //根据录像类型修改界面，但不修改已下发的数值
        var RecordType = $("#RecordSectType").val();
        if (RecordType == 1) {
            $("#RecordSubName").html($.lang.pub["recordsectime"]);
            $("#InputRange").html('[1-60]');
        } else if (RecordType == 2) {
            $("#RecordSubName").html($.lang.pub["recordsecsize"]);
            $("#InputRange").html('[10-1024]');
        }
    strLimit();
}

//切换录像分段类型时，修改界面上的显示
function RecordSectType_change() {
    RecordWebInfo_change();
    var RecordType = $("#RecordSectType").val();
    if (RecordType == 1) {
        $("#RecordSectValue").val("30");
    } else if(RecordType == 2) {
        $("#RecordSectValue").val("100");
    }
    initValidator();
}

function submitF()
{
    var drawFlag;

    if (!IsChanged("frmSetup", dataMap) || !validator.form())
        return;
    formToCfg("frmSetup", dataMap);
    //setCfgData(channelId, CMD_TYPE.IPCAX_LOCAL_CFG, "frmSetup", dataMap);
    var flag = top.sdk_viewer.execFunctionReturnAll("NetSDKSetConfig", dataMap);
    top.banner.showMsg(0 == flag.code);

    /**
     * 元数据画图，控件实况界面是否显示检测框，检测线等
     *1111分别代表：目标框轨迹；未触发规则结果框标志；触发规则结果框标志；规则线框标志
     * 本地配置的智能标记为未触发规则结果框标志故控制二进制的第二位，其他位默认都为1
     */
    if (0 == $("#UntriggeredTarget")) {
        drawFlag = 11; //不启用智能标记 1011
    } else {
        drawFlag = 15; //启用智能标记1111
    }
    top.sdk_viewer.execFunctionReturnAll("NetSDKEnableIvaDraw", 0, 1, drawFlag);

}

function initPage() {
    //控件未安装时，灰显保存按钮，并给出提示
    if (!top.sdk_viewer.isInstalled) {
        $(".submit_btn").attr("disabled", "disabled");
        $("#unInstallTip").removeClass("hidden");
    } else {
        $(".submit_btn").attr("disabled", "");
        $("#unInstallTip").addClass("hidden");
    }
    $("#videoParamFst").removeClass("hidden");
    $("#recordParamFst").removeClass("hidden");
    if (top.banner.isSupportPhotoCfg) {
        $("#photoCfg").removeClass("hidden");
        $("#snappic").removeClass("hidden");
    }
    if (top.banner.isSupportAudio) {
        $("#audiocfg").removeClass("hidden");
    }
    if ((top.banner.isSupportIVA && (IVAMode.TG != top.banner.IVAType)) ||
        (IVADeviceMode.SMART == top.banner.IVADeviceType) || top.banner.isSupportsystemSetUpLink) {
        $("#IntelligentMark").removeClass("hidden");
    }
    $("#defaultFilePath").removeClass("hidden");
    initVideoFormatOption();
}

//数据校验
function initValidator() {   
    $("#RcdTotalCap").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 1024));
    validator = $("#frmSetup").validate({
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "div");
        },
        success : function(label) {
        },
        rules : {
                RcdTotalCap : {
                integer : true,
                required : true,
                range : [ 1, 1024 ]
            }
        }
    });
    
    //根据录像类型修改校验规则
    var min = 1;
    var max = 60;
    var RecordType = $("#RecordSectType").val();
    if(RecordType == 2) {
        min = 10;
        max = 1024;
    }
    $("#RecordSectValue").attr("tip", $.validator.format($.lang.tip["tipIntRange"], min, max));
    rule = validator.settings.rules;
    rule["RecordSectValue"] = {
        integer : true,
        required : true,
        range : [ min, max ]
    };
    validator.init();
}

function initEvent() {
    $("#AudioCodeFmt").change(AudioEncformat_change);
    $("#RecordSectType").change(RecordSectType_change);
    $("#openDefaultPath").bind("click", function(){
        top.sdk_viewer.execFunction("NetSDKOpenFloder", $("#DefaultPath").val());
    });
}

function initData() {
    var pcSelPath,
        retcode;

    retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetConfig");

    if(0!= retcode.code){
        // 获取参数失败或是服务器模式
        disableAll();
        return;
    }else{
        dataMap = $.parseJSON(retcode.result);
        cfgToForm(dataMap, "frmSetup");
    }

    AudioEncformat_change();
    $("#AudioCodeRate").val(dataMap["AudioCodeRate"]);
    RecordWebInfo_change();
}

$(document).ready(function(){
    parent.selectItem("LocalCfgTab");// 菜单选中
    beforeDataLoad();
    // 初始化语言标签
    initPage();
    initLang();
    initEvent();  
    initData();
    initValidator();
    afterDataLoad();
});