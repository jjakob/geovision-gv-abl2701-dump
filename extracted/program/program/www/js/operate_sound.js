// JavaScript Document
GlobalInvoke(window);
var validator = null;
var channelId = 0;
var dataMap = {};
var jsonMap = {};
var jsonMap_bak = {};
var mappingMap = {
    Mute: ["IsMute"],
    audioInMode: ["Type"],
    EncFormat: ["EncodeFormat"],
    Sampling: ["SampleRate"],
    InputPlus: ["InputGain"],
    NoiseReduction: ["NoiseReduction", "Enable"],
    AudioDevice1: ["AudioInputs", 0, "Mode"],
    AudioOut1: ["AudioInputs", 0, "Enabled"]
};

function AudioEncformat_change() {
    var v = $("#EncFormat").val();
    var $Sampling = $("#Sampling"),
        $audioInMode = $("#audioInMode");
    if (7 == v) {
        $Sampling.html("<option value='8'>11.025</option>");
        $Sampling.val(8);
        $Sampling.attr("disabled", true);
    } else {
        var samplingList = top.banner.audioSampling;
        var str = "";
        for (var i = 0, len = samplingList[v].length; i < len; i++) {
            var value = parseInt(samplingList[v][i]);
            switch (value) {
                case 0:
                    str += "<option value='0'>8</option>";
                    break;
                case 1:
                    str += "<option value='1'>16</option>";
                    break;
                case 6:
                    str += "<option value='6'>48</option>";
                    break;
            }
        }
        $Sampling.html(str);
        if (1 == len) {
            $Sampling.attr("disabled", true); //只有一个下拉框，灰显
        } else {
            $Sampling.attr("disabled", false);
        }

        if ((6 == v) && (undefined != $audioInMode.val()) && (1 == $audioInMode.val())) {//AAC-LC采样率为32K
            $Sampling.html("<option value='4'>32</option>");
            $Sampling.val(4);
            $Sampling.attr("disabled", true);
        }
    }
}

function audioProcessing_click() {
    var v = $("input[name='audioProcessing']:checked").val();

    if (0 == v) {
        $("#AudioEchoCancellation").val(0);
        $("#NoiseReduction").val(0);
    } else if (1 == v) {
        $("#AudioEchoCancellation").val(0);
        $("#NoiseReduction").val(1);
    } else if (2 == v) {
        $("#AudioEchoCancellation").val(1);
        $("#NoiseReduction").val(0);
    }
}

function initVideoFormatOption() {
    var list = top.banner.audioFormatArr;
    var str = "";
    for (var i = 0; i < list.length; i++) {
        var value = Number(list[i]);
        switch (value) {
            case 1:
                str += "<option value='1'>G.711A</option>";
                break;

            case 2:
                str += "<option value='2'>G.711U</option>";
                break;

            case 6:
                str += "<option value='6'>AAC-LC</option>";
                break;

            case 7:
                str += "<option value='7'>PCM</option>";
                break;

            default:
                throw new Error("This shouldn't happen.");
        }
    }
    $("#EncFormat").html(str);
}
//外接拾音器类型
function initAudioInMode() {
    var AudioInModeHtml,
        $audioInMode = $("#audioInMode");
    AudioInModeHtml = $audioInMode.html();
    if (top.banner.isSupportSerialInput) {
        AudioInModeHtml += "<option value='1'>" + $.lang.pub["audioOutCapture"] + "</option>";
    }
    $audioInMode.html(AudioInModeHtml);
}
function ChannelModeEnable() {
    if ($("#audioInMode").val() == 0) {
        $("#AudioInDevice1").removeClass("hidden");
        if (2 == top.banner.AudioInNum) {
            $("#AudioInDevice2").removeClass("hidden");
        }
    }
}
//若选择AAC-LC编码格式，采样率为48则灰显噪声抑制
function disableAudioEchoCancellation(){
    var flag = (6 == $("#Sampling").val()) ? 1 : 0;   //48KHz采样率下不支持噪声抑制
    $("input[name='NoiseReduction']").attr("disabled",flag);
}

function changeInput() {
    var ModeTmp,
        $EncFormat = $("#EncFormat"),
        $InputPlus = $("#InputPlus"),
        $Sampling = $("#Sampling"),
        $inputTip = $("#inputTip"),
        $audioEchoCancellation = $("#audioEchoCancellation"),
        $audioInMode = $("#audioInMode");
    ModeTmp = $audioInMode.val();
    LAPI_CfgToForm("frmSetup", jsonMap_bak, dataMap, mappingMap);
    $audioInMode.val(ModeTmp);
    if ($audioInMode.val() == 1) { //外接拾音器
        var str = "";
        $EncFormat.html(str);
        $EncFormat.attr("disabled", true);
        $inputTip.fadeIn("slow");
        $InputPlus.attr("disabled", true);
        $EncFormat.html("<option value='6'>AAC-LC</option>");
        $InputPlus.val(128);
        $Sampling.html("<option value='4'>32</option>");
        $Sampling.attr("disabled", true);
        $("#AudioInDevice1").addClass("hidden");
        $("#AudioInDevice2").addClass("hidden");
        $audioEchoCancellation.addClass("hidden");
    } else {
        initVideoFormatOption();
        ChannelModeEnable();
        $EncFormat.attr("disabled", false);
        $EncFormat.val("1" == dataMap["EncFormat"] ? dataMap["EncFormat"] : "2");
        $InputPlus.val(dataMap["InputPlus"]);
        $inputTip.fadeOut("slow");
        $InputPlus.attr("disabled", false);
        if (top.banner.isSupportNoiseReduction) {
            $audioEchoCancellation.removeClass("hidden");
        }
        AudioEncformat_change();
    }
}

function submitF() {
    var flag;
    if (!IsChanged("frmSetup", dataMap) || !validator.form())
        return;
    if ($("#audioInMode").val() == 0) {
        var AudioOut1 = $("#AudioOut1").is(':checked');
        var AudioOut2 = $("#AudioOut2").is(':checked');
        if (!top.banner.isSupportDualAudio && AudioOut1 && AudioOut2) {
            top.banner.showMsg(false, $.lang.tip["tipDoubleAudio"]);
            return;
        }
    }
    LAPI_FormToCfg("frmSetup", jsonMap, dataMap, mappingMap);
    if (LAPI_SetCfgData(LAPI_URL.AudioIn, jsonMap)) {
        if (dataMap["AudioOut2"] == undefined) {
            flag = (dataMap["AudioOut1"] != jsonMap_bak["AudioInputs"][0]["Enabled"] || dataMap["audioInMode"] != jsonMap_bak["audioInMode"]);
        } else {
            flag = (dataMap["AudioOut1"] != jsonMap_bak["AudioInputs"][0]["Enabled"] || dataMap["AudioOut2"] != jsonMap_bak["AudioInputs"][1]["Enabled"] || dataMap["audioInMode"] != jsonMap_bak["audioInMode"]);
        }
        if (flag) {
            for (var i = 0; i < top.banner.video.statusList.length; i++) {
                if (top.banner.video.statusList[i]["isVideoOpen"]) {
                    top.banner.video.stopVideo(StreamType.LIVE, i);
                }
            }
            if (top.banner.video.isVoiceTalkOpen) {
                top.banner.video.stopVoiceTalk();
                if($("#MuteOn").is(":checked")){
                    top.banner.video.startVoiceTalk();
                }
            }
        }
        jsonMap_bak = objectClone(jsonMap);
    }

}

function initPage() {
    initVideoFormatOption();
    initAudioInMode();
    parseCapOptions("AudioDevice1", top.banner.AudioInItem0Mode, "mode");
    if (2 == top.banner.AudioInNum) {
        $("#AudioInDevice2").removeClass("hidden");
        parseCapOptions("AudioDevice2", top.banner.AudioInItem1Mode, "mode");
        mappingMap["AudioDevice2"] = ["AudioInputs", 1, "Mode"];
        mappingMap["AudioOut2"] = ["AudioInputs", 1, "Enabled"];
    }
    if (top.banner.isSupportFishEye) {
        $("#AudioOutCfg").removeClass("hidden");
        AudioOutHtml = '<option value="0">Line_Out</option>';
        if (top.banner.isSupportMicOut) {
            AudioOutHtml += '<option value="1">' + $.lang.pub["LoudSpeaker"] + '</option>';
        }
        $("#AudioOutMode").append(AudioOutHtml);
    }
    if (top.banner.isSupportNoiseReduction) {
        $("#audioEchoCancellation").removeClass("hidden");
    }
}

function initValidator() {
    $("#InputPlus").attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 255));
    validator = $("#frmSetup").validate({
        debug: false,
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function (error, element) {
            showJqueryErr(error, element, "div");
        },
        success: function (label) {
        },
        rules: {
            InputPlus: {
                integer: true,
                required: true,
                range: [0, 255]
            }
        },
        submitHandler: submitF
    });
    validator.init();
}

function initEvent() {
    $("#audioInMode").change(changeInput);
    $("#EncFormat").change(AudioEncformat_change);
    $("input[name='audioProcessing']").bind("click", audioProcessing_click);
    $("#Sampling").change(disableAudioEchoCancellation);
}

function initData() {
    var $audioInMode = $("#audioInMode");
    jsonMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.AudioIn, jsonMap)) {
        // 获取参数失败或是服务器模式
        disableAll();
        return;
    }
    jsonMap_bak = objectClone(jsonMap);
    LAPI_CfgToForm("frmSetup", jsonMap, dataMap, mappingMap);
    AudioEncformat_change();
    $("#Sampling").val(dataMap["Sampling"]);
    if ((undefined != $audioInMode.val()) && (1 == $audioInMode.val())) {
        changeInput();
    }
    if ($audioInMode.val() == 1) {
        $("#AudioInDevice1").addClass("hidden");
        $("#AudioInDevice2").addClass("hidden");
    }
    disableAudioEchoCancellation();
}

$(document).ready(function () {
    parent.selectItem("soundBoxTab");// 菜单选中
    beforeDataLoad();

    // 初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    afterDataLoad();
});