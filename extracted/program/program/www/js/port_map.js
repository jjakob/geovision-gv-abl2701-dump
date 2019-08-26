GlobalInvoke(window);
var dataMap = {};
var jsonMap={};
var jsonMap_bak={};
var textMap = {
        "PortMapStatus" : ["portMapFail","portMapSuccess"]
};
var mappingMap={
    "PortMapEnable" : ["Enable"],
    "PortMapType":["MapAuto"],

    "OutPort0":["UpnpPortMap",0,"NatOutAddr","Port"],
    "OutIPAddress0":["UpnpPortMap",0,"NatOutAddr","IPAddr"],
    "PortMapStatus0":["UpnpPortMap",0,"PortMapStatus"],

    "OutPort2":["UpnpPortMap",2,"NatOutAddr","Port"],
    "OutIPAddress2":["UpnpPortMap",2,"NatOutAddr","IPAddr"],
    "PortMapStatus2":["UpnpPortMap",2,"PortMapStatus"],

    "OutPort1":["UpnpPortMap",1,"NatOutAddr","Port"],
    "OutIPAddress1":["UpnpPortMap",1,"NatOutAddr","IPAddr"],
    "PortMapStatus1":["UpnpPortMap",1,"PortMapStatus"]
};

function eventUPNPStatus() {
    if (!LAPI_GetCfgData(LAPI_URL.PortMap, jsonMap)) {
        disableAll();
        return;
    }
    // 将空的IP地址置为0.0.0.0
    for (var i = 0; i < jsonMap["MapNum"]; i++) {
        if ("" == jsonMap["UpnpPortMap"][i]["NatOutAddr"]["IPAddr"]) {
            jsonMap["UpnpPortMap"][i]["NatOutAddr"]["IPAddr"] = "0.0.0.0";
        }
        if(jsonMap["Enable"]=1){
            dataMap["OutIPAddress" + i] = jsonMap["UpnpPortMap"][i]["NatOutAddr"]["IPAddr"];
        }
        else {
            dataMap["OutIPAddress" + i]="0.0.0.0";
        }
    }
    changeStatusText();
    setLabelValue(dataMap);
}

// 端口不能两两相同
function validatePortNotSame(value) {
    var portArr = [],
        flag = 0,
        i,
        index;
    for(i = 0; i < jsonMap["MapNum"]; i++) {
        index = i;
        if (1 == i) {
            index = 2;
        } else if (2 == i) {
            index = 1;
        }
        portArr.push($("#OutPort" + index).val());
    }
    for (i = 0; i < portArr.length; i++) {
        if (value == portArr[i]) {
            flag++;
        }
    }
    if (flag > 1) {
        return false;
    }
    return true;
}


function changeStatusText() {
    var status = "";
    for (var i = 0; i < jsonMap["MapNum"]; i++) {
        status = Number(jsonMap["UpnpPortMap"][i]["PortMapSuccess"]);
        status = $.lang.pub[textMap["PortMapStatus"][status]];
        jsonMap["UpnpPortMap"][i]["PortMapStatus"] = status;
        dataMap["PortMapStatus" + i] = status;
    }
}

function changePortMapType() {
    var flag = (1 == $("#PortMapType").val());
    for (var i = 0; i < jsonMap["MapNum"]; i++) {
        $("#OutPort" + i).attr("disabled", flag);
    }
}

function initPortMapTable() {
    var str = "";
    $("#portTable").empty();
    for (var i = 0; i < jsonMap["MapNum"]; i++) {
        var index = i;
        if (1 == i) {
            index = 2;
        } else if (2 == i) {
            index = 1;
        }
        str += "<tr>"+
            "<td><label><lang name='portMap"+index+"'></lang></label></td>"+
            "<td><input class='shortInput' type='text' name='OutPort"+index+"' id='OutPort"+index+"'/></td>"+
            "<td><label id='OutIPAddress"+index+"'></label></td>"+
            "<td><label id='PortMapStatus"+index+"'></label></td>"+
            "</tr>";
    }
    $("#portTable").append(str);
}

function initPage() {
}

function initEvent() {
    $("#PortMapType").bind("change",changePortMapType);
}
function submitF() {
    var flag;
    LAPI_FormToCfg("frmSetup", jsonMap,dataMap,mappingMap);
    if (!validator.form()) return;
    if (isObjectEquals(jsonMap, jsonMap_bak)) {
        parent.status = $.lang.tip["tipAnyChangeInfo"];
        return;
    }
    flag = LAPI_SetCfgData(LAPI_URL.PortMap,jsonMap);
    if(flag) {
        jsonMap_bak = objectClone(jsonMap);
    }
}

function initData(){
    
    if (!LAPI_GetCfgData(LAPI_URL.PortMap, jsonMap)) {
        disableAll();
        return;
    }

    // 将空的IP地址置为0.0.0.0
    for (var i = 0; i < jsonMap["MapNum"]; i++) {
        if ("" == jsonMap["UpnpPortMap"][i]["NatOutAddr"]["IPAddr"]) {
            jsonMap["UpnpPortMap"][i]["NatOutAddr"]["IPAddr"] = "0.0.0.0";
        }
    }
    initPortMapTable();
    changeStatusText();
    LAPI_CfgToForm("frmSetup",jsonMap,dataMap,mappingMap );
    jsonMap_bak=objectClone(jsonMap);
    setLabelValue(dataMap);
    changePortMapType();
}

//jquery验证框架
function initValidator() {
     $.validator.addMethod("portNotSame", function(value) {
     return validatePortNotSame(value);
    }, $.lang.tip["tipPortExist"]);
    var i = 0, num = 0, rulse, id;

    validator = $("#frmSetup").validate( {
        focusInvalid : false,
        errorElement : "span",
        errorPlacement : function(error, element) {
            showJqueryErr(error, element, "td");
        },
        success : function(label) {
        },
        rules : {}
    });
    
    rulse = validator.settings.rules;
    for (i = 0; i < jsonMap["MapNum"]; i++) {
        id = "OutPort" + i;
        $("#" + id).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 1, 65535));
        rulse[id] = {
            integer : true,
            required : true,
            range : [ 1, 65535],
	    portNotSame : ""
        };
    }
    validator.init();
}

$(document).ready(function() {
        parent.selectItem("portMapCfgTab");//菜单选中
        beforeDataLoad();
        // 初始化语言标签
        initPage();
        initData();
        initValidator();
        initEvent();
        initLang();
        afterDataLoad();
});