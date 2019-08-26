// JavaScript Document
GlobalInvoke(window);
var channelId = 0;
var dataMap = {};
var IsResetVideoWH = true; // 是否重设视频的高宽
var pageType = getparastr("pageType");
var photoTree = null;
var defualtPath = "";   // 本地文件系统根目录
var tmpFileName = "";   // 临时文件名称，用于显示照片
var FileUrl = location.protocol + "//" + parent.loginServerIp + ":" + parent.httpPort + LAPI_URL.PictureInfo +
              "?Name=";
var isLoading = false; // 是否正在加载数据
var isMustLoad = false; // 是否强制刷新数据
var jsonMap = {};
var mappingMap = {
    PicAllocMem :    ["PhotoStorage", "AllocMemory"],
    PicSpareMemory : ["PhotoStorage", "SpareMemory"]
};
// 加载语言文件
loadlanguageFile(top.language);

/**
 * 分批获取目录下的数据
 *
 * @param name 目录名称
 * @param resultList 存储结果的数组
 * @returns {boolean}
 */
function getAllFileOfFolder(name, resultList) {
    var filesMap,
        index = 1,
        len,
        count,
        i = 0,
        j,
        fileList,
        url = LAPI_URL.Photo_DirectoryInfo + "?Name=" + name + "&&index=";

    do {
        filesMap = {};
        if (!LAPI_GetCfgData(url + index, filesMap)) {
            return false;
        }

        fileList = filesMap["StorPathInfo"];
        len = fileList.length;
        if (0 == i) {   // 第一次调用接口需要计算获取的次数
            count = Math.ceil(filesMap["Nums"] / len);
        }
        for (j = 0; j < len; j++) {
            resultList.push(fileList[j]);
        }

        index += len;
        i++;
    } while (i < count);

    return true;
}
/**
 * 过滤选中节点，不包含半选状态的节点
 * @param node
 * @returns {*|boolean}
 */
function nodeFilter(node) {
    var status = node.getCheckStatus();
    return (status.checked && !status.half);
}

/**
 * 根据父节点的URL递归出所有的子孙节点
 *
 * @param parentUrl 父节点的url
 * @param resultList 子孙节点数组
 * @returns {boolean}
 */
function getAllLeafNode(parentUrl, resultList) {
    var flag,
        list = [],
        i,
        len,
        node;

    flag = getAllFileOfFolder(parentUrl, list);
    if (flag) {
        for (i = 0, len = list.length; i < len && flag; i++) {
            node = list[i];
            if (0 == node["DirType"]) {    // 递归获取子节点
                flag = getAllLeafNode(node["Name"], resultList);
            }
            resultList.push(node)
        }
    }

    return flag;
}

// 刷新
function freshInfo() {
    var nodes = photoTree.getSelectedNodes();
    if (nodes.length > 0) {
        photoTree.expandNode(nodes[0], false);  // 先折叠
        photoTree.removeChildNodes(nodes[0]);
        isMustLoad = true;
        photoTree.expandNode(nodes[0], true, false, true, true);
    }
}

function operSDFileThreed(nodes, cmd) {
    return function() {
        var i,
            len = nodes.length,
            flag = true,
            idKey,
            msg,
            leafList = [],
            node;

        // 过滤出所有叶子节点
        for (i = len - 1; (i >= 0) && flag; i--) {
            node = nodes[i];
            idKey = node["Name"];
            if (node.isParent) {    // 递归出所有子节点
                if (-1 == node.check_Child_State){
                    flag = getAllLeafNode(idKey, leafList);
                }
            }
            leafList.push(node);
        }

        if (flag) {
            for (i = 0, len = leafList.length; i < len; i++) {
                node = leafList[i];
                idKey = node["Name"];

                if ((4 & cmd) > 0) { //导出记录
                    if (top.banner.isMac) {
                        flag = top.sdk_viewer.execFunctionReturnAll("NetSDKFileDownLoad", defualtPath +
                            idKey, FileUrl +
                            idKey, 0);
                    }else{
                        flag = top.sdk_viewer.execFunctionReturnAll("NetSDKFileDownLoad", defualtPath +
                            idKey.replace(/\//g, "\\"), FileUrl +
                            idKey, 0);
                    }

                }

                if (flag && ((1 & cmd) > 0)) { //导出图片
                    if (top.banner.isMac) {
                        flag = top.sdk_viewer.execFunctionReturnAll("NetSDKFileDownLoad", defualtPath +
                            idKey +
                            ".jpg", FileUrl +
                            idKey, 1);
                    }else{
                        flag = top.sdk_viewer.execFunctionReturnAll("NetSDKFileDownLoad", defualtPath +
                            idKey.replace(/\//g, "\\") +
                            ".jpg", FileUrl +
                            idKey, 1);
                    }

                }
                if (flag && ((2 & cmd) > 0)) {  // 删除
                    flag = LAPI_DelCfgData(encodeURI(LAPI_URL.PictureInfo + "?Name=" + idKey), {}, false);
                    if (flag) {
                        photoTree.removeNode(nodes[i]);
                    }
                }

                if (!flag) {
                    break;
                }
            }
        }

        if (5 & cmd > 0) {  // 导出操作
            top.banner.updateBlock(false);
        }

        msg = flag ? $.lang.tip["tipOperateSuccess"] : $.lang.tip["tipOperateFail"];
        top.banner.showMsg(flag, msg);
    }
}

/**
 * SD卡操作
 *
 * data-cmd (1: 导出照片；2：删除照片：4：导出记录)
 */
function operSDFile() {
    var event = getEvent(),
        oSrc = event.srcElement ? event.srcElement : event.target,
        cmd = Number($(oSrc).attr("data-cmd")),
        nodes = photoTree.getNodesByFilter(nodeFilter),
        retcode;

    if (nodes.length == 0) return;

    if (((2 & cmd) > 0) && !confirm($.lang.tip['tipConfirmDel'])) return;

    if ((5 & cmd) > 0) {  // 导出操作
        retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKBrowseDir");
        if(ResultCode.RESULT_CODE_SUCCEED == retcode.code && "" != retcode.result) {
            var tmpMap = {};
            if(LAPI_GetCfgData(LAPI_URL.CAMARA_CAPTURE_CFG, tmpMap)) {

                if (top.banner.isMac) {
                    defualtPath = retcode.result + tmpMap["RoadInfo"] + "(" + top.banner.loginServerIp + ")/";
                }else{
                    defualtPath = retcode.result + tmpMap["RoadInfo"] + "(" + top.banner.loginServerIp + ")\\";
                }

            }
        } else {
            return;
        }
        // 遮盖界面
        top.banner.updateBlock(true, $.lang.tip["tipExportPhotos"]);
    }

    setTimeout(operSDFileThreed(nodes, cmd), 100);
}

/*********************************************** zTree 操作 ********************************************************/
function initTree() {
    var setting = {
        check :    {
            enable : true
        },
        data :     {
            keep :       {
                parent : true
            },
            key :        {
                name : "nameText"
            },
            simpleData : {
                enable :  true,
                idKey :   "Name",
                pIdKey :  "pId",
                rootPId : 0
            }
        },
        view :     {
            selectedMulti :      false,        //设置是否可以按住Ctrl多选。
            autoCancelSelected : false,        //点击节点时，按下 Ctrl 键是否允许取消选择操作。
            expandSpeed :        ""            //zTree 节点展开、折叠时的动画速度:"slow", "normal", or "fast"
        },
        callback : {
            beforeExpand : beforeExpand,
            onExpand :     getData,
            onClick :      onNodeClick
        }
    };
    var treeNodes = [
        {"Name" : "", "pId" : 0, "nameText" : top.banner.loginServerIp, isParent : true}
    ];
    photoTree = $.fn.zTree.init($("#tree"), setting, treeNodes);
}

function beforeExpand(treeId, treeNode) {
    if (!isLoading) {
        treeNode.icon = "../../../css/zTreeStyle/img/loading.gif";
        photoTree.updateNode(treeNode);
        return true;
    } else {
        top.banner.showMsg(true, $.lang.tip["tipLoading"], 0);
        return false;
    }
}

/**
 * 展开节点时获取该节点下的子节点
 *
 * @param event
 * @param treeId
 * @param treeNode 被展开的节点 JSON 数据对象
 */
function getData(event, treeId, treeNode) {
    var name = treeNode.Name,
        isChecked = treeNode.getCheckStatus()["checked"], // 父节点是否选择，若父节点选择，则展开的子节点也要选中
        node,
        i,
        len,
        treeNodes = [];

    // 子节点没有加载过，才加载，防止反复加载
    if (isMustLoad || -1 == treeNode.check_Child_State) {
        isMustLoad = false; // 标志位恢复

        // 解析数据
        if (!getAllFileOfFolder(name, treeNodes)) return;
        len = treeNodes.length;

        for (i = 0; i < len; i++) {
            node = treeNodes[i];

            // 根目录需要特殊处理，仅显示photo目录
            if (("" == name) && ("photo" != node["Name"])) {
                treeNodes.splice(i, 1);
                len = treeNodes.length;
                i--;
                continue;
            }

            if (0 == node["DirType"]) { // 目录
                node["isParent"] = true;
            }
            node["pId"] = name;
            node["nameText"] = node["Name"].substring(node["Name"].lastIndexOf("/") + 1);
            node["checked"] = isChecked;
        }
        photoTree.removeChildNodes(treeNode);
        photoTree.addNodes(treeNode, treeNodes);
    }

    treeNode.icon = "";
    photoTree.updateNode(treeNode);
    isLoading = false;
}

/**
 * 点击照片浏览
 * @param event
 * @param treeId
 * @param treeNode
 */
function onNodeClick(event, treeId, treeNode) {
    var url = FileUrl + treeNode.Name,
        flag;

    if (treeNode.isParent) return;

    // 导出照片到临时目录
    flag = top.sdk_viewer.execFunctionReturnAll("NetSDKFileDownLoad", tmpFileName, url, 1);

    // 通知控件显示临时图片
    if (flag) {
        top.sdk_viewer.execFunctionReturnAll("NetSDKPlayLocalPic", 4, tmpFileName, "");
    }
}
/*******************************************************************************************************/

//实况缩放
function resetVideoWH() {
    var w,
        h,
        $object = $("#object");

    if (!IsResetVideoWH)
        return;
    w = $object.width();
    h = $object.height();
    l = $object.offset().left;
    parent.$("#videoDiv").css({
        width :  w + "px",
        height : h + "px",
        left :   l + "px"
    });
    parent.video.$("#activeX_obj").css({
        width :  w + "px",
        height : h + "px"
    });
}

function release() {
    IsResetVideoWH = false;
    if(top.sdk_viewer.isInstalled) {
        top.sdk_viewer.execFunctionReturnAll("NetSDKStopPlayLocalJPG",wndIdNum.SDWND);//退出时关闭窗口4的播放
    }
    parent.hiddenVideo();
}

function init() {
    var tmpMap;

    window.onresize = resetVideoWH;
    if (!LAPI_GetCfgData(LAPI_URL.Storage, jsonMap)) {// 获取参数失败
        disableAll();
        return;
    }
    changeMapToMapByMapping(jsonMap, mappingMap, dataMap, 0);
    cfgToForm(dataMap, "frmSetup");
    setLabelValue(dataMap);
    initTree();

    // 获取本地临时目录
    if (top.sdk_viewer.isInstalled) {
        retcode = top.sdk_viewer.execFunctionReturnAll("NetSDKGetConfig");
        if (0 == retcode.code) {
            tmpMap = $.parseJSON(retcode.result);
            tmpFileName = tmpMap["DefaultPath"] + "tmpPhoto\\tmpPhoto.jpg";
        }
    }
}

function initPage() {
    var object = document.getElementById("object");
    var w = object.offsetWidth;
    var h = object.offsetHeight;
    var offset = {x : 0, y : 0};
    GetOffset(object, offset);
    parent.showVideo(w, h, offset.y, offset.x);
    if (top.sdk_viewer.isInstalled) {
        /**
         * 新增：设置窗口位置
         *说明：参数为页面模式，现针对天网卡口应用：有4种模式：0单独实况窗口页面，1首页三个窗口页面，2照片页面，3配置智能页面（约定枚举）
         */
        top.sdk_viewer.execFunctionReturnAll("NetSDKSetWndPos", 2);
        top.sdk_viewer.execFunctionReturnAll("NetSDKGetLocalPort", 4);
        top.sdk_viewer.execFunctionReturnAll("NetSDKStartPlayLocalJPG", 4);     // 启用本地播放功能
    } else {
        $("#exportRecord").attr({"disabled" : true, "title" : $.lang.tip["tipInstallPluginBtn"]});
        $("#export").attr({"disabled" : true, "title" : $.lang.tip["tipInstallPluginBtn"]});
        $("#exportAndDel").attr({"disabled" : true, "title" : $.lang.tip["tipInstallPluginBtn"]});
    }
}

function initEvent() {
    $("#submitBtn").click(freshInfo);
    $("button[data-cmd]").click(operSDFile);
}

$(document).ready(function() {
    if (1 == pageType) {
        parent.selectItem("storageStatusTab");//选中菜单
    } else {
        top.document.title = $.lang.pub["photo"];
        parent.selectItem("photo");//选中菜单
    }
    beforeDataLoad();
    //初始化语言标签
    initLang();
    initPage();
    initEvent();
    init();
    afterDataLoad();
});