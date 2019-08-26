// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var dataMap = {};// original data
var CmdRtNum = 0;
var RelationDataView = null;

//表格
headInfoList = [
    {
        fieldId: "OriginalCmd"
    },
    {
        fieldId: "PresetId",
        fieldType: "text"
    },
    {
        fieldId: "PresetCmd",
        fieldType: "select",
        getOptions: getPresetCmdOptions
    }
];

// change dataMap to list<Map>
function changeDataMapToList() {
    var dataList = [],
        tempDataMap = {},
        num = dataMap["CmdRtNum"],
        i,
        j = 0,
        len = headInfoList.length,
        fieldID = "";
    
    num = isNaN(num)? 0 : num;
    for ( i = 0; i < num; i++) {
        tempDataMap = {};
        for (j = 0; j < len; j++) {
            fieldID = headInfoList[j]["fieldId"];
            tempDataMap[fieldID] = dataMap[fieldID + i];
        }
        dataList.push(tempDataMap);
    }
    
    return dataList;
}

// submit
function submitF() {
    if (!validator.form() || !IsChanged("frmSetup", dataMap))
        return false;
    
    setCfgData(channelId, CMD_TYPE.CMD_RELATION_CFG, "frmSetup", dataMap);
}

function initPage() {
}

function initValidator() {
    var i,
        rulse, 
        id;

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

    for (i = 0; i < CmdRtNum; i++) {
        id = "PresetId" + i;

        $("#" + id).attr("tip", $.validator.format($.lang.tip["tipIntRange"], 0, 255));
        rulse[id] = {
            integer : true,
            required : true,
            range : [ 0, 255 ]
        };
    }
    validator.init();
}

function initEvent() {
}

function getPresetCmdOptions() {
    return "<option value='1537'>" + $.lang.pub["setPreset"] + "</option><option value='1538'>" + $.lang.pub["callPreset"] + "</option>";
}

// initialize data
function getData() {
    if (getCfgData(channelId, CMD_TYPE.CMD_RELATION_CFG, dataMap)) {
        CmdRtNum = Number(dataMap["CmdRtNum"]);
    } 
    
    return changeDataMapToList();
}

//初始化数据视图
function initDataView(){
    RelationDataView = new DataView("dataview_tbody", getData, headInfoList);
    RelationDataView.setTrEvnet({
        "onclick": function(){}
    });
    RelationDataView.setFields( {
        OriginalCmd : function(data) {
            var index = data - 0x9000;
            return $.lang.pub["cmdName" + index];
        }
    });
    RelationDataView.createDataView();
}

// initialize page
$(document).ready(function() {
    parent.selectItem("ptzcmdRelationTab");// select menu
        beforeDataLoad();
        initLang();
        initDataView();
        initValidator();
        initEvent();
        afterDataLoad();
    });