var channelId = 0;
var editType = Number(getparastr("type"));
var curTrackId = Number(getparastr("trackId"));
var curTrackName = getparastr("trackName");
var thInfoList = ["IsSelect:checkbox","Action:select","Speed:select","IsTurning:checkbox","Duration:text","PresetId:select","StayTime:text"];
var actionStartList = [1284,1282,1026,1028,1794,2050,1796,2052,772,770];
var isRemoveRecordTrack = true;
            

//判断元素e是否在数组list中,是的话返回所在位置下标。
function isContain(list, e)
{
    var index = -1;
    var len = (list)? list.length: 0;
    for(var i=0; i<len; i++)
    {
        if(e == list[i])
        {
            index = i;
            break;
        }
    }
    return index;
}
             
//设置巡航路线（下发）
function submitWinData()
{
    if(!validator.form())return;
    var pcParam = "",temMap={};
    var $trackTbl = $("#trackTbl").find("tr");
    temMap["RoutePoint"] = [];
    for(var i=0, num=0, len=$trackTbl.length; i<len; i++)
    {
        var index = $trackTbl.get(i).id.replace("trackTbl", "");

        if($("#IsSelect"+index).is(":hidden"))
        {
            break;
        }
        else
        {
            temMap["RoutePoint"][num] = {};
            for(var j=0, headLen = thInfoList.length; j<headLen; j++)
            {
                var infoArr = thInfoList[j].split(":");
                var id= infoArr[0].trim();
                var type = infoArr[1];
                if("checkbox" == type)continue;
                var $index = $("#" + id + index);
                var value = ("" == $index.val())? 0: $index.val();
                if("Duration" == id){
                    if(770 == $("#" + "Action" + index).val()){
                        value = value*100;
                    }
                }
                if(($index.is(":visible"))&&("PresetId" == id) && (-1 == value))
                {//预置位非法
                    alert($.lang.tip["tipNeedPreset"].replace("s%", (i+1)));
                    return false;
                }
                pcParam += id+num+"="+value+"&";
                if("PresetId" == id || "StayTime" == id)continue;
                temMap["RoutePoint"][num][id] = Number(value);
            }
            num++;
            //是否有转停动作
            var flag = isContain(actionStartList, $("#Action"+index).val());
            var stayTime = Number($("#StayTime" + index).val());
            if((-1 < flag) && (0 < stayTime))
            {
                temMap["RoutePoint"][num] = {};
                temMap["RoutePoint"][num]["Action"] = 2305;
                temMap["RoutePoint"][num]["Speed"] = Number($("#Speed"+index).val());
                temMap["RoutePoint"][num]["Duration"] = stayTime;
                num++;
            }else{
                temMap["RoutePoint"][num-1]["Duration"] = stayTime;
            }
        }
    }
    if("" == pcParam)
    {
        alert($.lang.tip["tipTrackPointCanotEmpty"]);
        return;
    }
    temMap["RouteID"] = Number($("#TrackId").val());
    temMap["RouteName"] = $("#TrackName").val();
    temMap["PointNum"] = num;
    var recode =LAPI_CreateCfgData(LAPI_URL.PTZPatrolRoute,temMap,false);
    if (recode) {
        top.banner.frames["mainIframe"].initCruiseInfo();
        if (1 == editType) {    //录制
            isRemoveRecordTrack = false;
        }
        parent.closeWin();
    } else {
        top.banner.showMsg(false);
    }
}
            
function onclickTDContent()
{
}
            
//显示巡航轨迹的列表
function initTrackTable()
{
    $("#trackTbl").empty();
    var actionList = top.banner.frames["mainIframe"].trackInfoMap[curTrackId];
    var index = $("#trackTbl").find("tr").length;//行号
    var len = (undefined == actionList)? 0: actionList.length;
    for(var i=0; i<len; i++)
    {
        var map = ((undefined == actionList) || (0 == actionList.length))? null: actionList[i];
        if(map && (2305 == map["Action"]))
        {//转停动作
            var $StayTime = $("#StayTime" + (index - 1));
            $StayTime.val(map["Duration"]);
            $StayTime.attr("defaultValue", map["Duration"]);
            continue;
        }
        createRow("trackTbl", index, thInfoList, map);
        if(null != map)
        {
            $("#Action"+index).change();
            if (map["Action"] >= -1 && map["Action"] < 256) {   // 预置位
                $("#Speed" + index).val(map["Speed"]);
                $("#StayTime" + index).val(map["Duration"]);
            } else if ((256 < map["Action"]) && (0 == map["Duration"])) {
                var $IsTurning = $("#IsTurning" + index);
                $IsTurning.click();
                $IsTurning.attr("checked", true);
            }
        }
        index = $("#trackTbl").find("tr").length;
    } 
    for(; index<9; index++)
    {//默认显示9行
        createRow("trackTbl", index, thInfoList, null);
    }
}
            
//创建一行数据。tblId：要增加行的对象的id，index:序号,thInfoList：表头信息数组，data：数据
function createRow(tblId,index,thInfoList,data)
{
    var tbl = document.getElementById(tblId);
    var tr = document.createElement("tr");
    $(tr).attr("id", tblId+index);
    for(var i=0,len=thInfoList.length;i<len;i++)
    {
        var td = document.createElement("td");
        var arr = thInfoList[i].split(":");
        var id = arr[0].trim();
        var tag = arr[1];
        $(td).attr("id",id+index+"TD");
                    
        var value = (null == data)? "": data[id];
        //显示控件label
        var label = document.createElement("label");
        $(label).attr("id",id+index+"Label");
        $(label).html("");
        $(label).addClass("hidden");
        $(td).append(label);
                    
        var node = null;
        if("text" == tag || "checkbox" == tag)
        {//input对象
            node = document.createElement("input");
            $(node).attr("type",tag);
            if("text" == tag)
            {//输入框，需用label显示，input编辑
                $(node).addClass("shortText");
                $(td).bind("click", function(){var id= this.id.replace("TD","");onclickTDContent(id,true)});
                $(node).attr("minValue", 1);
                if("Duration" == id)
                {
                    $(node).attr("maxLength", 6);
                    $(node).attr("maxValue", 300000);
                }else
                {
                    $(node).attr("maxLength", 7);
                    $(node).attr("maxValue", 1800000);
                }
                $(node).bind("blur", function(){
                    if((("Duration"+index) == this.id) && (770 == $("#Action"+index).val())){//770表示变倍到
                        if(validPic_Num(this, parseInt($(this).attr("minValue")), parseInt($(this).attr("maxValue")),true))
                        {
                            this.value = Number(this.value).toFixed(2);
                            this.defaultValue = this.value;
                        }else{
                            this.value = this.defaultValue;
                        }
                    }else{
                        if(validNumber(this, parseInt($(this).attr("minValue")), parseInt($(this).attr("maxValue")),
                            $.lang.tip["tipNumScopeErr"].replace("%s",$(this).attr("minValue")+"-"+$(this).attr("maxValue"))))
                        {
                            this.defaultValue = this.value;
                        }else{
                            this.value = this.defaultValue;
                        }
                    }
                });
            }
            else if("checkbox" == tag)
            {
                if("IsTurning" == id)
                {
                    $(node).bind("click", function(){
                        var index = this.id.replace("IsTurning","");
                        var $Duration = $("#Duration" + index);
                        $Duration.val(this.checked? 0: 10000);
                        $Duration.attr("disabled", this.checked);
                        $("#StayTime"+index).attr("disabled", this.checked);
                    });
                }
            }
        }
        else if("select" == tag)
        {
            node = document.createElement("select");
            var optionsHtml = "";
            if("Action" == id)
            {
                $(node).change(function(){action_change(this.id);});
                optionsHtml = "<option value='1284'>"+$.lang.pub["gotoLeft"]+"</option>"+
                            "<option value='1282'>"+$.lang.pub["gotoRight"]+"</option>"+
                            "<option value='1026'>"+$.lang.pub["gotoUp"]+"</option>"+
                            "<option value='1028'>"+$.lang.pub["gotoDown"]+"</option>"+
                            "<option value='1794'>"+$.lang.pub["gotoLeftUp"]+"</option>"+
                            "<option value='2050'>"+$.lang.pub["gotoRrightUp"]+"</option>"+
                            "<option value='1796'>"+$.lang.pub["gotoLeftDown"]+"</option>"+
                            "<option value='2052'>"+$.lang.pub["gotoRightDown"]+"</option>"+
                            "<option value='770'>"+$.lang.pub["changeZoom"]+"</option>"+
                            "<option id='turnToPreset"+index+"' value='0'>"+$.lang.pub["gotoPreset"]+"</option>";
            }
            else if("Speed" == id)
            {
                optionsHtml = "<option value='1'>1</option>"+
                            "<option value='2'>2</option>"+
                            "<option value='3'>3</option>"+
                            "<option value='4'>4</option>"+
                            "<option value='5'>5</option>"+
                            "<option value='6' selected>6</option>"+
                            "<option value='7'>7</option>"+
                            "<option value='8'>8</option>"+
                            "<option value='9'>9</option>";
            }
            else if("PresetId" == id)
            {
                $(node).change(function(){
                    var index = this.id.replace("PresetId", ""); 
                    $("#turnToPreset"+index).val(this.value);
                });

                optionsHtml = $("#rootPreset").html();
                            
            }
            $(node).append(optionsHtml);
        }
        $(node).attr("id",id+index);
        if(null == data)
        {
            $(node).addClass("hidden");
        }
        $(td).append(node);
        $(tr).append(td);
                    
        if((null == data) || ( "undefined" == typeof data["Action"]))continue;
        //赋值
        if("checkbox" == tag)
        {
            if("IsTurning" == id && 0 == data["Duration"])
            {
                $(node).attr("checked", true);
            }    
        }
        else
        {
            if("Action" == id)
            {
                if(value > -1 && value<256)
                {
                    $(node).find("option[value='0']").val(value);
                    data["PresetId"] = value;
                }
            }
            else if("Duration" == id)
            {
                if(0 == value)
                {
                    $(node).attr("disabled", true);
                }
            }
            $(node).val(value);
            $(node).attr("defaultValue", value);
        }
    }    
    $(tbl).append(tr);
}
            
//增加巡航轨迹点
function addAction()
{
    var $trackTbl = $("#trackTbl").find("tr");
    var len = $trackTbl.length;
    var index = 0;
    for(var i=0; i<len; i++)
    {
        index = $trackTbl.get(i).id.replace("trackTbl", "");
        if($("#IsSelect" + index).is(":hidden"))
        {
            break;
        }
    }
    if(i > 31)
    {
        alert($.lang.tip["tipTrackPointFull"]);
        return;
    }
    if(i>8)
    {
        index++;
        createRow("trackTbl", index, thInfoList, {});
    }
    $("#IsSelect" + index).removeClass("hidden");
    var $Action = $("#Action" + index);
    $Action.removeClass("hidden");
    $Action.change();
}
            
//删除巡航轨迹点
function delAction()
{
    var $trackTb2;
    var $trackTbl = $("#trackTbl").find("tr");
    var len = $trackTbl.length;
    for(var i=len-1; i>-1; i--)
    {
        var index = $trackTbl.get(i).id.replace("trackTbl", "");
        if($("#IsSelect"+index).is(":checked"))
        {
            $("#trackTbl"+index).remove();
            $trackTb2 = $("#trackTbl").find("tr");
            if($trackTb2.length<9)
            {
                var lastIndex = $trackTb2.last().attr("id").replace("trackTbl", "");
                createRow("trackTbl", parseInt(lastIndex)+1, thInfoList, null);
            }
        }
    }
}
            
//移动数据
function moveAction(type)
{
    var $trackTbl = $("#trackTbl").find("tr");
    var len = $trackTbl.length;
    if( 0 == len)return;
    var trList = [];//选中的tr 数组
    var trList_unselected = [];//未选中的tr数组
    var i,tr,index;

    for(i=0; i<len; i++)
    {
        tr = $trackTbl.get(i);
        index = tr.id.replace("trackTbl", "");
        var $IsSelect = $("#IsSelect" + index);
        if($IsSelect.is(":hidden"))
        {//没有内容，则停止
            break;
        }
        else 
        {
            if($IsSelect.is(":checked"))
            {
                trList.push(tr);
            }
            else
            {
                trList_unselected.push(tr);
            }
        }
    }
                
    var trObjs = $(trList);
    var trObjs_unselected = $(trList_unselected);
    //全选或全不选时直接返回
    if((0 == trObjs.length) || (0 == trObjs_unselected.length))return;
                
    if(0 == type)
    {//移到顶部
        trObjs.insertBefore(trObjs_unselected.first());    
    }
    else if(1 == type)
    {//向上移动
        tr = $(trList).first();//选中TR中的第一个
        if($(tr).prev())
        {//上面还有一行
            tr = $(tr).prev();
        }
        else
        {//该选中的行为第一行，则操作第一个未选中的行
            tr = trObjs_unselected.first();
        }
        trObjs.insertBefore(tr);    
    }
    else if(2 == type)
    {//向下移动
        tr = $(trList).last();//选中tr中的最后一个
        if($(tr).next())
        {//下面还有一行
            index = $(tr).next().attr("id").replace("trackTbl","");
            if($("#IsSelect"+index).is(":visible"))
            {//下面一行有数据
                tr = $(tr).next();
            }
            else
            {//没数据
                tr = trObjs_unselected.last();
            }
        }
        else
        {//选中的改行为最后一行
            tr = trObjs_unselected.last();
        }
        trObjs.insertAfter(tr);    
    }
    else if(3 == type)
    {
        trObjs.insertAfter(trObjs_unselected.last());
    }
                
}
            
function action_change(id) {
    var index = id.replace("Action","");
    var value = $("#"+id).val();
    var $Duration = $("#Duration" + index);
    var $IsTurning = $("#IsTurning" + index);
    var $StayTime = $("#StayTime" + index);
    var $Speed = $("#Speed" + index);
    var $PresetId = $("#PresetId" + index);
    var $speed = $("#Speed" + index + " option[value='10']");
    if(value >= -1 && value<256)
    {//转到预置位

        if($IsTurning.is(":checked"))
        {
            $IsTurning.attr("checked", false);
            $Duration.attr("disabled", false);
            $StayTime.attr("disabled", false);
        }
        if (0 == $speed.length) {
            $Speed.append("<option value='10' selected='selected'>10</option>");
        }
        $Speed.removeClass("hidden");
        $("#Speed" + index + "Label").addClass("hidden");
        $IsTurning.addClass("hidden");
        $("#IsTurning"+index+"Label").removeClass("hidden");
        $Duration.addClass("hidden");
        $("#Duration"+index+"Label").removeClass("hidden");
        $PresetId.removeClass("hidden");
        $("#PresetId"+index+"Label").addClass("hidden");
        $("#turnToPreset"+index).val($PresetId.val());
    }
    else if(770 == value )
    {//放大缩小动作
        $Speed.addClass("hidden");
        $("#Speed"+index+"Label").removeClass("hidden");
        $IsTurning.addClass("hidden");
        $("#IsTurning"+index+"Label").removeClass("hidden");
        $Duration.removeClass("hidden");
        $("#Duration"+index+"Label").addClass("hidden");
        $PresetId.addClass("hidden");
        $("#PresetId"+index+"Label").removeClass("hidden");
    } else {// 云台动作
        if (0 < $speed.length) {
            $speed.remove();
        }
        $Speed.removeClass("hidden");
        $("#Speed"+index+"Label").addClass("hidden");
        $IsTurning.removeClass("hidden");
        $("#IsTurning"+index+"Label").addClass("hidden");
        if("" ==  $Duration.val())
        {
            $Duration.val(10000);
            $Duration.attr("defaultValue", 10000);
        }
        $Duration.removeClass("hidden");
        $("#Duration"+index+"Label").addClass("hidden");
        $PresetId.addClass("hidden");
        $("#PresetId"+index+"Label").removeClass("hidden");
    }
    if(770 == value){
        if(Number($Duration.val()) > Number(top.banner.maxZoom)){
            $Duration.val(top.banner.maxZoom);
        }
        $Duration.attr("maxValue", top.banner.maxZoom);
        $Duration.attr("defaultValue", top.banner.maxZoom);
        $Duration.attr("maxLength", top.banner.maxZoom.toString().length + 3);
    }else{
        if(parseInt($Duration.val()) != $Duration.val()){
            $Duration.val(10000);
        }
        $Duration.attr("defaultValue", 10000);
        $Duration.attr("maxLength", 6);
        $Duration.attr("maxValue", 300000);
    }
    if("" ==  $StayTime.val())
    {
        $StayTime.val(10000);
        $StayTime.attr("defaultValue", 10000);
    }
    $StayTime.removeClass("hidden");
    $("#StayTime"+index+"Label").addClass("hidden");
}
            
//jquery验证初始化
function initValidator()
{
    $("#TrackId").attr("tip",$.validator.format($.lang.tip["tipIntRange"],1,16));
    $("#TrackName").attr("tip",$.lang.tip["tipName"]);
    $.validator.addMethod("validStrNoNull", function(value) {
        return validStrNoNull(value);
    }, $.lang.validate["valRequired"]);
    $.validator.addMethod("checkName", function(value) {
        return validNameContent(value);
    }, $.lang.tip["tipCharFmtErr"]);
    validator = $("#frmSetup").validate({
        focusInvalid: false,
        errorElement: "span",
        errorPlacement: function(error, element) {
            showJqueryErr(error, element, "td");
        },
                    
        success: function(label) {},
                    
        rules: {
            TrackName: {
                validStrNoNull: "",
                checkName: ""
            },
            TrackId: {
                integer: true,
                required: true,
                range:[1,16]
            }
        }
    });
    validator.init();
} 
            
function initPage(){
    $("#rootPreset").append(top.banner.video.$("#position").html());
    initTrackTable();
}
            
function initEvent() {
    $("#addAction").bind("click", addAction);
    $("#delAction").bind("click", delAction);
    $("#moveTop").bind("click", function(){moveAction(0);});
    $("#moveUp").bind("click", function(){moveAction(1);});
    $("#moveDown").bind("click", function(){moveAction(2);});
    $("#moveBottom").bind("click", function(){moveAction(3);});
    $("#TrackId").bind("blur", function(){
        if(validator.element(this))
        {
            $(this).val(parseInt(this.value, 10));
        }
    });
}
            
function initData() {
    $("#TrackId").val((-1 == curTrackId)? "" : curTrackId);
    $("#TrackName").val(curTrackName);
}
            
 function release(){
    if((1 == editType) && isRemoveRecordTrack){//录制的轨迹未确定时需要删除
        top.banner.frames["mainIframe"].recodeBlock(false);
        LAPI_DelCfgData(LAPI_URL.PTZPatrolRoute+"/" + curTrackId,{},false);
    }
}
            
$(document).ready(function(){
    beforeDataLoad();
    //初始化语言标签
    initLang();
    initPage();
    initValidator();
    initEvent();
    initData();
    strLimit();
    $("body").focus();    //解决IE8下，添加巡航路径页面第一次点击没有光标无法输入
});
