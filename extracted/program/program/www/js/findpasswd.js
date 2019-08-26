/**
 * Created by y00808 on 2016/3/31.
 */
GlobalInvoke(window);
//加载语言文件
loadlanguageFile(top.language);

function initPage() {
    var versionType = ("undefined" != typeof parent.showVersionType)? parent.showVersionType : VersionType.NONE;
    var $ezCloudUrl = $("#ezcloudeUrl");
    var ezCloudUrlStr = "";
    //获取日期
    var ipcTime = new Date(getIPCTime());

    var time = "";
    time += ipcTime.getFullYear();
    if(1 == (ipcTime.getMonth()+1).toString().length)
    {
        time += "0";
    }
    time += (ipcTime.getMonth()+1);
    if(1 == ipcTime.getDate().toString().length)
    {
        time += "0";
    }
    time += ipcTime.getDate();
    $("#ipcDate").text(time);

    //处理ezCloud网址信息
    if (VersionType.IN == versionType || VersionType.DT == versionType || VersionType.PRJ == versionType) {
        $("#ezcloudeUrldiv").removeClass("hidden");
        if (VersionType.IN == versionType) {
            ezCloudUrlStr = "http://en.ezcloud.uniview.com";
        } else {
            ezCloudUrlStr = "http://ezcloud.uniview.com";
        }
    } else {
        $("#findpasswdTip").html($.lang.pub["findpasswdTip6"]);
    }

    $ezCloudUrl.attr("href", ezCloudUrlStr);
    $ezCloudUrl.text(ezCloudUrlStr);
}

$(document).ready(function(){
    beforeDataLoad();
    // 初始化语言标签
    initLang();
    initPage();
    afterDataLoad();
});