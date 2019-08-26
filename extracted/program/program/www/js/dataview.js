var DataView = function(tableId, getDataFn, headInfoList, defaultRowLen, evenColor) {
    // 要创建数据视图的表格对象
    this.getDataFn = getDataFn;
    this.table = document.getElementById(tableId) ? document.getElementById(tableId) : null;
    this.currectRow = -1; // 当前选中的行
    this._dataList = getDataFn() || []; // 表格数据
    this.headInfoList = headInfoList || []; // 表头信息
    this.trId = "";
    this.trEventMap = {}; // tr 的触发事件表
    this.defaultRowLen = defaultRowLen || 0; // 默认显示行数
    this.evenColor = evenColor || ""; // 偶数行背景色
}

DataView.prototype = {
    createRow : function(i, dataMap) {
        var tr = this.table.insertRow(-1);// 先插入一个空行
        tr.setAttribute("rowNum", i);
        if (null != dataMap) {
            if ("" != this.trId) {
                tr.id = dataMap[this.trId];
            }
            var that = this;// 记录实例化对象
            var clickFun = function(e) {
                var node = checkNavigator("ie")? document.activeElement : e.target;
                if (("TR" != node.tagName) && ("TD" != node.tagName))
                    return;
                that.checkRow(node.getAttribute("rowNum"));
            }
            if (tr.addEventListener) {
                tr.addEventListener("click", clickFun, false);
            } else {
                tr.attachEvent("onclick", clickFun);
            }
    
            for ( var n in this.trEventMap) {
                if ("onclick" == n) {
                    if (tr.removeEventListener) {
                        tr.removeEventListener("click", clickFun, false);
                    } else {
                        tr.detachEvent("onclick", clickFun);
                    }
                }
                if (tr.addEventListener) {
                    tr.addEventListener(n.replace("on", ""), this.trEventMap[n], false);
                } else {
                    tr.attachEvent(n, this.trEventMap[n]);
                }
            }
    
            if (("" !== this.evenColor) && (0 == (i + 1) % 2)) {
                tr.style.backgroundColor = this.evenColor;
            }
        }
    
        // 循环插入td
        var headInfoLen = this.headInfoList ? this.headInfoList.length : 0;
        for ( var headInfoIndex = 0; headInfoIndex < headInfoLen; headInfoIndex++) {
            var headInfo = this.headInfoList[headInfoIndex];
            var td = tr.insertCell(-1);
            // 隐藏需要隐藏的字段
            if (headInfo["hidden"]) {
                td.className = "hidden";
            }
            if (null == dataMap) {
                // 插入空行
                continue;
            }
            var fieldType = headInfo["fieldType"];// 对应的字段类型
            fieldType = ("undefined" == typeof (fieldType)) ? "label" : fieldType;
            var fieldId = headInfo["fieldId"];// 对应的字段id
            var eventMap = headInfo["eventMap"];
            var value = dataMap[fieldId];
            var tdStyle = headInfo["styleText"];
            
            if (("undefined" != typeof headInfo["hiddenFillter"]) && (value == headInfo["hiddenFillter"])) {
                tr.className ="hidden";
            }
            
            td.id = fieldId + i + "_TD";
            td.setAttribute("rowNum", i);
    
            // 生成对应的控件
            var content = "";
            if ("RowNum" == fieldType) {// 序号
                content = (i + 1);
            } else if ("checkbox" == fieldType) {// 选择框
                content = "<input type='checkbox' id='" + fieldId + i + "' name='" + fieldId + i + "'";
                if (1 == Number(value)) {
                    content += "checked='checked'";
                }
                content += "/>";
            } else if ("text" == fieldType) {// 输入框
                content = "<input type='text' class='dv_width' id='" + fieldId + i + "' name='" + fieldId + i + "' value='" + setUpContent(value, headInfo) + "' />";
            } else if ("dateTime" == fieldType) {// 时间控件
                content = "<input type='text' class='Wdate dv_width' id='" + fieldId + i + "' name='" + fieldId + i + "' value='" + value
                        + "' onfocus='pickerTime()' />";
            } else if ("select" == fieldType) {// 下拉框
                content = "<select class='dv_width' id='" + fieldId + i + "' name='" + fieldId + i + "' >" + headInfo["getOptions"]() + "</select>";
                content = content.replace("value=\"" + value + "\"", "value='" + value + "' selected='selected'");
                content = content.replace("value='" + value + "'", "value='" + value + "' selected='selected'");
                content = content.replace("value=" + value + "", "value='" + value + "' selected='selected'");
    
            } else if ("define" == fieldType) {// 自定义内容
                var fn = headInfo["contentFn"];
                if (fn && (fn instanceof Function)) {
                    content = fn(i);
                }
            } else if ("option" == fieldType) {// 操作
                if (headInfo["defineContextFn"]) { // 自定义option内容的函数
                    content = headInfo["defineContextFn"](dataMap);
                } else {   // 自定义option内容的字符串
                    content = headInfo["option"];
                }
                content = content.replace(/rowNum=rowNum/g, "rowNum=" + i);
                content = content.replace(/#rowNum/g, i);
            } else if ("label" == fieldType) {// 文本
                content = setUpContent(value, headInfo);
                // 处理空格
                if ("string" == typeof content && content == value) {
                    content = content.replace(/\s/g, "&nbsp;");
                }
            }
            td.innerHTML = content;
    
            // 样式
            if (tdStyle) {
                td.style.cssText = tdStyle;
            }
    
            // 给控件绑定事件
            if (eventMap) {
                var obj = document.getElementById(fieldId + i);
                for ( var n in eventMap) {
                    var fn = eventMap[n];
    
                    if (obj.addEventListener) {
                        obj.addEventListener(n.replace("on", ""), fn, false);
                    } else {
                        obj.attachEvent(n, fn);
                    }
                }
            }
        }
    },
    
    createDataView : function() {
        this.clearTable(this.table);
        var dataListLen = this._dataList ? this._dataList.length : 0;
        for ( var i = 0; i < dataListLen; i++) {
            var dataMap = this._dataList[i];
            this.createRow(i, dataMap);
        }
    
        // 显示到默认行数
        for (; i < this.defaultRowLen; i++) {
            this.createRow(i, null);
        }
    },
    
    setFields : function(fieldsMap) {
        for ( var i = 0, len = this.headInfoList.length; i < len; i++) {
            var headInfo = this.headInfoList[i];
            var fieldId = headInfo["fieldId"];
            var fn = fieldsMap[fieldId];
            if (fn) {
                headInfo["fn"] = fn;
            }
        }
    },
    
    setTrEvnet : function(eventMap) {
        for ( var eventName in eventMap) {
            this.trEventMap[eventName] = eventMap[eventName];
        }
    },
    
    addData: function() {
        var dataListLen = this._dataList ? this._dataList.length : 0;
        var dataMap = this._dataList[dataListLen - 1];
        
        if (this.defaultRowLen >= dataListLen) {
            this.refresh();
        } else {
            this.createRow(dataListLen - 1, dataMap);
        }
    },
    
    removeI : function() {
        // todo
    },
    
    removeII : function(idList) {
        // todo
    },
    
    getData : function(rowNum, key) {
        var data = this._dataList[rowNum];
        if (undefined != key) {
            data = data[key];
        }
        return data;
    },
    
    checkRow : function(index) {
        if (index < 0)
            return;
        if (-1 != this.currectRow) {
            this.table.rows[this.currectRow].className = this.table.rows[this.currectRow].className.replace("selectedTR", "");
        }
        this.currectRow = index;
        this.table.rows[this.currectRow].className = this.table.rows[this.currectRow].className + " selectedTR";
    },
    
    clearTable : function(tbl) {
        for ( var len = tbl.rows.length; len > 0; len--) {
            tbl.deleteRow(len - 1);
        }
    },
    
    refresh : function() {
        this._dataList = this.getDataFn();
        this.createDataView();
        this.currectRow = -1;
    }
}

function setUpContent(value, headInfo) {
    // var type = headInfo["type"];//字段的类型（输入框，下拉框，文本等待）
    // var isEdit = headInfo["isEdit"];//是否可直接编辑
    var text = value;
    var fn = headInfo["fn"];
    if (fn) {
        text = fn(text);
    }
    return text;
}