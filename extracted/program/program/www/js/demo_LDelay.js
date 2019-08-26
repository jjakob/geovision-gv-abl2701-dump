/**
 * Created by oW2837 on 2017/2/20.
 */
function LAPI_SetCfgNoTip(url, map){
    var jsonStr = $.toJSON(map)+"\r\n";
    var flag = true;
    var username,password;

    if("undefined"== typeof(top.banner)){
        username = "";
        password = "";
    }else{
        username = top.banner.loginUserName;
        password = top.banner.loginUserPwd;
    }

    $.ajax({
        type: "PUT",
        async: false,
        url: url,
        data: jsonStr,
        dataType: "json",
        username: username,
        password :password,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Basic ' + base64encode(username + ':' + password));
        },
        success: function(data){
            flag = ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode;
        },
        error: function() {
            flag = false;
        }
    });
    return flag;
}
function LAPI_GetCfgNoTip(url, map){
    var flag = true;
    var dataStr = "";
    var asyncFlag = false;
    var username,password;

    if("undefined"== typeof(top.banner)){
        username = "";
        password = "";
    }else{
        username = top.banner.loginUserName;
        password = top.banner.loginUserPwd;
    }

    url += "?randomkey="+ (new Date().getTime());


    $.ajax({
        type: "GET",
        async: asyncFlag,
        url: url,
        data: dataStr,
        dataType: "json",
        username: username,
        password :password,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Basic ' + base64encode(username + ':' + password));
        },

        success: function(data){
            flag = (ResultCode.RESULT_CODE_SUCCEED == data.Response.StatusCode);
            if (flag) {
                $.extend(true, map, data.Response.Data);
            }
        },
        error: function() {
            flag = false;
        }
    });
    return flag;
}
function getCfgDataNoTip(ChnId, CmdType, map){
    var Param = "";
    var flag = false;
    var top = GetTopWindow();
    var retcode = top.sdk_viewer.ViewerAxGetConfig20(ChnId, CmdType, Param);
    var resultList = getSDKParam(retcode);

    if(ResultCode.RESULT_CODE_SUCCEED == resultList[0]){
        sdkAddCfg(map, resultList[1]);
        flag = true;
    }
    return flag;
}