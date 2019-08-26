// JavaScript Document
if ("undefined" == typeof(top.banner)) {
	window.location = "/";
}
var language = parseInt(getparastr("langinfo"));
var user = getparastr("user");
var key = getparastr("Key");
var key2 = getparastr("Key2");
var portMap = {};
var hasLanguage = true; // 是否已设置页面语言
var languageList = showLangList.replace(/\s/g, "").split(",");
var serverIP = window.location.hostname;
var jsonMap = {};
var isMac = isMacPlatform();
var sdk_viewer = null;

top.is64Platform = isWin64Platform();
top.loginUserName = getparastr("userName");
top.loginUserPwd = getparastr("loginCert");
top.language = getparastr("langinfo");
top.SDKPort = getparastr("SDKPort");
if (null == top.SDKPort) {
	if ("https:" == window.location.protocol) {
		top.SDKPort = ("" == window.location.port) ? 443 : window.location.port;
	} else {
		top.SDKPort = ("" == window.location.port) ? 80 : window.location.port;
	}
}
top.RTSPPort = (null == getparastr("RTSPPort") ? 0 : getparastr("RTSPPort"));
top.loginServerIp = window.location.host;
top.loginClientIp = getparastr("clientIpAddr");
top.loginType = (null == getparastr("loginType") ? 0 : getparastr("loginType"));// 界面登陆类型，参见 LoginType
top.menuType = (null == getparastr("menuType") ? 0 : getparastr("menuType"));
top.IsRemote = Number(getparastr("IsRemote"));

//获取到样机语言则显示样机语言选项
$.ajaxSettings.async = false;
$.get("js/custom/custom_lang.js?date=" + new Date().getTime(), function() {
	languageList.push(-1);
});
$.ajaxSettings.async = true;

if (-1 != language) {
	if (0 > isContainsElement(language, languageList)) {
		language = languageList[0];
	}
	top.wdateLang = supportLangList[language]["dateFileName"];
} else {
	top.wdateLang = supportLangList[1]["dateFileName"];
}
top.language = language;
// 加载语言文件
loadlanguageFile(top.language);
top.defaultUserName = "";
var playActiveXObj = null;

//初始化控件
function initOcx() {
	var flag = true,
		clsid,
		application,
		pluginVersion;
	if (top.banner.isMac) {
		application = "netsdkplayer-plugin";
		pluginVersion = "1.2.0.3";
	} else {
		if (isUN) {
			clsid = "B91BB9EA-9CDF-4917-9037-27CE4DEF0D8A";
			application = "netsdkplayer-plugin-un";
			pluginVersion = "0.2.1.6";
			if (top.is64Platform) {
				pluginVersion = "1.2.0.2";
			}
		} else {
			clsid = "0F1A61E3-9097-4550-AC8C-3EA1D34690C9";
			application = "netsdkplayer-plugin-nb";
			pluginVersion = "0.2.1.6";
			if (top.is64Platform) {
				pluginVersion = "1.2.0.2";
			}
		}
	}
	sdk_viewer = new Player({
		application : application,
		eventname :   'plgnevent',
		clsid :       clsid,
		version :     pluginVersion,
		id :          'player',
		container :   'activeX_obj',
		name :        'sdk_viewer',
		szDeviceIp :  top.loginServerIp,
		/**
		 * 事件前缀，由于控件目前所有的事件上报都是一个，同时使用第一个参数作为事件类型，而此参数为数字
		 * 使用数字作为自定义事件名来监听和触发目前看来无法实现，故将事件加上一个前缀
		 * @type {String}
		 */
		prefix :      '__',
		maxWnd :      6,
		noCreateWnd : true
	});
	top.sdk_viewer = sdk_viewer;
}
function showPage() {
	if (null != user && null != key2) { //myCloudy跳转

		portMap = eval('(' + base64decode(key2) + ')');
		top.SDKPort = portMap["sdk"];
		top.RTSPPort = portMap["rtsp"];
	}

	if (LoginType.VM_LOGIN == top.loginType) {   //VM跳转
		window.location = "frame.htm";
	} else {
		$("#login_fullPage").removeClass("hidden");
		if (isUN) {
			$("#password").focus();
		} else {
			$("#userName").focus();
		}
		$("#autoPlay").attr("checked", ("1" == getCookie("isAutoStartVideo")));
		if (null != top.loginUserName && null != top.loginUserPwd) { //IPC自动登录
			window.location = "frame.htm";
		}
	}
}

function init() {
	$("input").attr("autocomplete", "off");
	$("form").attr("autocomplete", "off");
	if ("undefined" != typeof(showDeviceType)) {
		document.getElementById("deviceTypeName").innerHTML = showDeviceType.split("@")[0];
	}
	//初始化语言标签
	initLang();
	initPage();
	initEvent();
	showPage();
}

function check_chinese(value) {
	var i;

	for (i = 0; i < value.length; i++) {
		var code = value.charCodeAt(i);
		if (((code >= 256) && (code <= 12287)) // 汉字
		    || ((code >= 12330) && (code <= 65280))) {
			alert($.lang.tip["tipUsrPwdUnCH"]);
			return 0;
		}

	}

	return 1;
}

function enableAutoPlay() {
	var isAutoPlay = $("#autoPlay").is(":checked") ? 1 : 0;

	//将是否播放实况存入cookie中
	setCookie("isAutoStartVideo", isAutoPlay);
}

function generalLangList() {
	var i,
		len = languageList.length,
		langIndex = 0,
		langOptionHtml = "";

	for (i = 0; i < len; i++) {
		langIndex = languageList[i];
		if (-1 == langIndex) {//如果是样机语言。
			langOptionHtml += "<option value='-1'>CustomLang</option>";
		} else {
			langOptionHtml += "<option value='" + langIndex + "'>" + supportLangList[langIndex]["langName"] +
			                  "</option>";
		}
	}

	var $langinfo = $("#langinfo");
	$langinfo.empty();
	$langinfo.append(langOptionHtml);

	if (1 != len) {
		$("#langinfoDiv").removeClass("hide");
	}
}

function showDate(e) {
	var event = getEvent();
	e = e || event;
	var currKey = e.keyCode || e.which || e.charCode;
	if ((KEY_CODE.keyD == currKey) && e.shiftKey && e.ctrlKey && e.altKey) {
		$(".login_IpcDateDiv").removeClass("hidden");
	}
}

function initPage() {
	//初始化控件
	initOcx();
    enableAutoPlay();
	//检测版本号
	var flag = top.sdk_viewer.checkVersion();
	if (null === flag) {    // 未安装控件
		if (isMac || top.is64Platform) {
			$("#ieVersion .activeXDiv").html($.lang.tip["tipInstallPlugin"]);
		} else {
			$("#ieVersion .downloadTip").html($.lang.pub["downloadTip3"] + " ");
		}
		$("#ieVersion").slideDown();
	} else {
		if (!flag) {  //不是最新控件，需要更新
			if (isMac || top.is64Platform) {
				$("#ieVersion .activeXDiv").html($.lang.tip["tipInstallPlugin"]);
			} else {
				$("#ieVersion .downloadTip").html($.lang.pub["downloadTip3"] + " ");
			}
			$("#ieVersion").slideDown();
		}
		// 设置控件不判断可信站点
		top.sdk_viewer.execFunctionReturnAll("NetSDKSetTrustSiteEnable", 0);
	}
	$("#ieVersion").attr("title", $.lang.pub["hiddenTips"]);
	$("#download").attr("title", $.lang.pub["downloadSetup"]);
	if (isUN) {
		$("#findpasswd").removeClass("hidden");
		top.defaultUserName = "admin";
	} else {
		//获取日期
		var ipcTime = new Date(getIPCTime());
		$("#ipcDate").text(ipcTime.getFullYear() + "-" + (ipcTime.getMonth() + 1) + "-" + ipcTime.getDate());
	}
	$("#userName").val(top.defaultUserName);
	generalLangList();

	var isRecordPassword = getCookie("isRecordLoginCert");
	// 若上一次是记住密码登录就填充最近一次登录的用户名和密码
	if ("true" == isRecordPassword) {
		var userName = getCookie("userName");
		var passWord = getCookie("loginCert");
		$("#userName").val(userName);
		$("#password").val(passWord);
		$("#loginCert").val(passWord);
		$("#saveLoginCert").attr("checked", true);
	}

	$("#langinfo").val(top.language);
	strLimit();
	document.title = $.lang.pub["indexTitle"];
}
//点击下载最新控件
function checkInstallStatus() {
	// 初始化控件
	if (checkNavigator("ie") || checkNavigator("firefox")) {
		initOcx();
	}
	// 检测版本号；
	var flag = sdk_viewer.checkVersion();
	if (!flag || null === flag) {
		setTimeout("checkInstallStatus()", 5000);
	} else {
		window.location.reload();//安装成功后刷新页面加载控件
	}
}

function initEvent() {
	if (!isUN) {
		document.onkeydown = showDate;
	}
	$("#ieVersion").bind("dblclick", function() {
		$("#ieVersion").slideUp(0);
	});
	$("#download").bind("click", checkInstallStatus);
	$("#findpasswd").bind("click", function() {
		var $login_form = $(".login_form").offset(),
			left = $login_form.left,
			top = $login_form.top + $(".login_logo").height();
		openWin($.lang.pub["findpassward"], "findpasswd.htm", 548, 200, true, left, top, false);
	});
	$("#langinfo").change(changeLanguage);
	$("#login").bind("click", usrSubmit);
	$("#reset").bind("click", resetLoginInfo);
	//双IP
	if (LAPI_GetCfgData(LAPI_URL.IPModified, jsonMap)) {
		var Modified = jsonMap["Modified"];
		if ("192.168.0.13" == serverIP && 0 == Modified) {
			//IP为192.168.0.13且地址未曾修改过
			$("#doubleIpDIV").removeClass("hidden");
			$("#loginForm").find("input").attr("disabled", true);
			$("#login").unbind("click");
			$("#reset").unbind("click");
		}
	}

}

function recordPassword() {
	// 勾选记住密码，会把记住密码记录到cookie中
	if ($("#saveLoginCert").is(":checked")) {
		setCookie("isRecordLoginCert", "true");
	} else {
		// 取消勾选记住密码，删除cookie中的密码和勾选密码记录
		delCookie("isRecordLoginCert");
		delCookie("loginCert");
	}
}

function resetLoginInfo() {
	delCookie("isRecordLoginCert");
	delCookie("userName");
	delCookie("loginCert");
	$("#userName").val("");
	$("#password").val("");
	$("#loginCert").val("");
	$("#saveLoginCert").attr("checked", false);
}

function usrSubmit() {

	// 防止用户不安装控件强行登录
	var jsonMap = {};


	if (document.loginForm.userName.value == "") {
		alert($.lang.tip["tipUsrNameRequired"]);
		document.loginForm.userName.focus();
		return;
	}

	if (!validUserNameCheck(document.loginForm.userName, $.lang.tip["tipUsrNameInvalid"])) {
		document.loginForm.userName.focus();
		return;
	}
	var $password = $("#password");
	if (!check_chinese($password.val())) {
		$password.focus();
		return;
	}

	top.loginUserName = $("#userName").val();
	top.loginUserPwd = $("#password").val();
	jsonMap["UserName"] = top.loginUserName;
	jsonMap["Password"] = passwd2Cipher(top.loginUserPwd);
	if (!LAPI_SetCfgData(LAPI_URL.LoginCfg, jsonMap, false, queryStatus)) {
		return;
	}
	window.location = "frame.htm";
}

function queryStatus(errCode) {
	var strMsg;
	if (ResultCode.RESULT_CODE_SUCCEED == errCode) {
		return;
	}
	else if (ResultCode.RESULT_CODE_USERFULL == errCode) {
		strMsg = $.lang.tip["tipOcxInitFullUser"];
	} else if ((ResultCode.RESULT_CODE_USERNONEXIST == errCode) ||
	           (ResultCode.RESULT_CODE_PASSWD_INVALID == errCode)) {
		strMsg = $.lang.tip["tipOcxInitInvalidUser"];
	} else if (ResultCode.RESULT_CODE_TIMEOUT == errCode) {
		strMsg = $.lang.tip["tipOcxInitWaiting"];
	} else if (ResultCode.ERR_SDK_COMMON_LOCK_USER == errCode) {
		strMsg = $.lang.tip["tipLockUser"];
	} else if (ResultCode.ERR_SDK_REMOTE_USER_WITH_WEAK_PASSWD == errCode) {
		strMsg = $.lang.tip["tipLockUserPassword"];
	} else {
		strMsg = $.lang.tip["tipOcxInitFail"];
	}
	alert(strMsg);
}


function check_username(f) {
	var event = getEvent();
	var k = event.keyCode;
	var str = f.value;
	if (k == 13) // checks whether the Enter key
	{
		if (str.length == 0) {
			f.focus();
			return;
		}
		$("#password").focus();
	}
}

function check_passwd() {
	var event = getEvent();
	var k = event.keyCode;
	if (k == 13) // checks whether the Enter key
	{
		usrSubmit();
	}
}

if (window.name == 'top')
	window.close();

function changeLanguage() {
	var langInfo = Number($("#langinfo").val());
	var searchArr = top.window.location.search;
	var hrefArr = top.window.location.href;
	if (top.language != langInfo) {
		if (hrefArr.indexOf("langinfo=") > -1) {
			hrefArr = hrefArr.replace("langinfo=" + top.language, "langinfo=" + langInfo);
			top.window.location.href = hrefArr;
		}
		if ("" != searchArr) {
			if (searchArr.indexOf("langinfo=") > -1) {
				searchArr = searchArr.replace("langinfo=" + top.language, "langinfo=" + langInfo);
			} else {
				searchArr = searchArr + "&langinfo=" + langInfo;
			}
			top.window.location.search = searchArr;
		} else {
			top.window.location.search = "langinfo=" + langInfo;
		}
		top.language = langInfo;
	}
}

function release() {
	if (top.sdk_viewer.isInstalled) {
		top.sdk_viewer.unInit();
	}
}

$(window).resize(function() {
	var $login_form = $(".login_form").offset(),
		left = $login_form.left,
		top = $login_form.top + $(".login_logo").height();
	$("#msgObj").css({
		"left" : left,
		"top" :  top
	});
});
