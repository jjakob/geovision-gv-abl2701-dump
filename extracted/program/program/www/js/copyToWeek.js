// JavaScript Document
GlobalInvoke(window);
// 加载语言文件
loadlanguageFile(top.language);

function selectAll() {
    if ($("#selectAll").is(":checked")) {
        for ( var i = 0; i < 7; i++) {
            if (parent.currentWeek != i) {
                $("#checkbox" + i).attr("checked", true);
            }
        }
    } else {
        for ( var i = 0; i < 7; i++) {
            if (parent.currentWeek != i) {
                $("#checkbox" + i).attr("checked", false);
            }
        }
    }
}

function submitWinData() {
    var list = [], i;

    for (i = 0; i < 7; i++) {
        if ($("#checkbox" + i).is(":checked")) {
            list.push(i);
        }
    }

    parent.doPasteToWeek(list);
    parent.closeWin();
}

function initPage() {
    var $checkbox = $("#checkbox" + parent.currentWeek);
    $checkbox.attr("checked", true);
    $checkbox.attr("disabled", true);
}

$(document).ready(function() {
        beforeDataLoad();
        // 初始化语言标签
        initLang();
        initPage();

    });
