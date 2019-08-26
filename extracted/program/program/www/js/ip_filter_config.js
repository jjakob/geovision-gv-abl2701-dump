GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var jsonMap={};
var dataMap_bak = {};


// 创建场景管理表格需要的表头信息
var headInfoList = [{
	fieldId: "rowNum",
	fieldType: "RowNum"
}, {
	fieldId: "IPAddr",
	fieldType: "text",
	eventMap: {
		"onchange": IpAddrese_Change
	}
}, {
	fieldId: "option",
	fieldType: "option",
	option: "<a href='#' class='icon black-del' rowNum=rowNum onclick='delIP($(this).attr(\"rowNum\"));' title='" + $.lang.pub["del"] + "'></a>"
}];

/**-----------------数据处理start------------------------*/	
function changeMapToList()
{
	for (var k in jsonMap) {
		if(k.indexOf("IPAddr") < 0){
			dataMap[k] = jsonMap[k];
		}
	}
	dataMap["FilterInfos"] = [];
	for (var i = 0; i < Number(jsonMap["IPFilterNum"]); i++) {
		var data = {};
		data["IPAddr"] = jsonMap["FilterInfos"][i]["IPAddr"];
		dataMap["FilterInfos"].push(data);
	};
}

/*------------------数据处理End--------------------------*/

/*------------------数据校验方法start------------------------*/
//校验是否是有效IP(IP不准为0.0.0.0,127.0.0.1,255.255.255.255,224.0.0.1，第一段为1-223，第四段不能为0)
function isValidIP(value) {
	if ("0.0.0.0" == value || "255.255.255.255" == value || "127.0.0.1" == value || "224.0.0.1" == value) {
		return false;
	};
	if (!isIPAddress(value)) {
		return false;
	}
	
	var ipArray = value.split(".");
    var ip1 = ipArray[0];
    var ip4 = ipArray[3];
    if (ip1 < 1 || ip1 > 223) // 第一段范围
    {
        return false;
    }
    return 0 != ip4;
    
}

//校验所有IP地址是否正确
function checkAllIpAddrValid() {
    var invalidNumStr = "";
    for (var i = 0; i < dataMap["FilterInfos"].length; i++) {
        if (!isValidIP(dataMap["FilterInfos"][i]["IPAddr"])) {
            invalidNumStr+=(i+1)+",";
        }
    };
    if("" != invalidNumStr) {
        invalidNumStr = invalidNumStr.substring(0,invalidNumStr.length-1);
        alert($.validator.format($.lang.tip["tipIpAddrNull"],invalidNumStr));
        return false;
    }
    return true;	
}

function isIPExist(value) {
    for (var i = 0; i < dataMap["FilterInfos"].length; i++) {
        if (value == dataMap["FilterInfos"][i]["IPAddr"]) {
            return false;
        }
    };
    return true;
}

/*------------------数据校验方法end------------------------*/

function initPage() {

}

function initEvent() {
    $("#add").click(function() {
        addIp();
        this.blur();
    });
}

function initValidator() {

}

function getIPMapList() {
    return dataMap["FilterInfos"];
}

function addIp() {
    if (dataMap["FilterInfos"].length == 32) {
        alert($.lang.tip["tipIpAddrMax"]);
        return;
    } else{
            if (!checkAllIpAddrValid()) {
            return;
        };
        var ipData = {};
        ipData["IPAddr"] = "";
        dataMap["FilterInfos"].push(ipData);//Ip个数不增加，直到增加正确的IP地址
        IPFilterDataView.refresh(); // 刷新表格
    };
}

function IpAddrese_Change() {
    var event = getEvent(),
    oSrc = event.srcElement ? event.srcElement : event.target,
    id = oSrc.id,
    rowNum = Number(id.replace("IPAddr", "")),
    ipData = dataMap["FilterInfos"][rowNum],
    v = $("#" + id).val();

    if (!isValidIP(v)) {
        $("#"+id).val(ipData["IPAddr"]) ;
        alert($.lang.tip["tipIpAddrErr"]);
        return;
    }

    if (!isIPExist(v)) {
        $("#"+id).val(ipData["IPAddr"]) ;
        alert($.lang.tip["tipIpAddrExist"]);
        return;
    }

    if("" == ipData["IPAddr"]) {
        dataMap["IPFilterNum"] = Number(dataMap["IPFilterNum"])+1;//如果是从默认空变成正确IP则有效IP个数加1
    }
    ipData["IPAddr"] = v;
}

function delIP(rowNum) {
    if("" != dataMap["FilterInfos"][rowNum]["IPAddr"]) {
        dataMap["IPFilterNum"] = Number(dataMap["IPFilterNum"])-1;//如果是有效IP则有效IP-1
    }
    dataMap["FilterInfos"].splice(rowNum,1);
    IPFilterDataView.refresh(); // 刷新表格
}

// 初始化IP管理表格
function initDataView() {

    IPFilterDataView = new DataView("dataview_tbody", getIPMapList, headInfoList, 5);
    IPFilterDataView.createDataView();

    if (getIPMapList().length > 0) {
        if (checkNavigator("safari")) {
            safariClick($("#dataview_tbody").find("tr").get(0));
        } else {
            $("#dataview_tbody").find("tr").get(0).click();
        }
    }
}

function initData() {
    dataMap = {};
    if (!LAPI_GetCfgData(LAPI_URL.IPFilter,dataMap)) {
        disableAll();
        return;
    }
    initDataView();
    LAPI_CfgToForm("frmSetup",dataMap);
    dataMap_bak = objectClone(dataMap);
}


function submitF() {
    var flag;
    var top = GetTopWindow();
    if(!checkAllIpAddrValid() ) {
        return;
    }
    LAPI_FormToCfg("frmSetup", dataMap);
    var isChanged = !isObjectEquals(dataMap,dataMap_bak);
    if (!isChanged) {
       parent.status =  $.lang.tip["tipAnyChangeInfo"];
       return;
    } else {
        flag = LAPI_SetCfgData(LAPI_URL.IPFilter, dataMap);
        if(flag){
            dataMap_bak = objectClone(dataMap);
        }
    }
}

$(document).ready(function() {
	parent.selectItem("ipFilterTab"); // 菜单选中
	beforeDataLoad(); // 公共方法，对按钮、页面风格做处理
	initPage();
	initLang(); // 公共方法，加载语言
	initEvent(); // 为界面元素绑定时间处理函数
	initValidator(); // jquery验证方法初始化
	initData(); // 页面参数初始化
	afterDataLoad(); // 公共方法
});