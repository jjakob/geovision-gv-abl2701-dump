/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function() {};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor

        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

var Player = Class.extend({
     id: 'player',
     eventname: 'plgnevent',
    /**
     * 事件前缀，由于控件目前所有的事件上报都是一个，同时使用第一个参数作为事件类型，而此参数为数字
     * 使用数字作为自定义事件名来监听和触发目前看来无法实现，故将事件加上一个前缀
     * @type {String}
     */
    prefix: '__',
    maxWnd: 1,
    focusColor: parseInt('ffcc33', 16),
    unfocusColor: parseInt('666666', 16),
    backgColor: parseInt('222222', 16),
    isInstalled: false,
    init: function(cfg) {
        /**
         * 控件事件载体，使用父节点
         * @type {Object}
         */
        this.eventObj = $('#' + cfg.container);

        if (undefined !== cfg.prefix){
            this.prefix = cfg.prefix;
        }
        if (undefined !== cfg.clsid){
            this.clsid = cfg.clsid;
        }
        if (undefined !== cfg.application){
            this.application = cfg.application;
        }
        if (undefined !== cfg.version){
            this.version = cfg.version;
        }
        if (undefined !== cfg.maxWnd){
            this.maxWnd = cfg.maxWnd;
        }
        if (undefined !== cfg.focusColor){
            this.focusColor = parseInt(cfg.focusColor, 16);
        }
        if (undefined !== cfg.unfocusColor){
            this.unfocusColor = parseInt(cfg.unfocusColor, 16);
        }
        if (undefined !== cfg.backgColor){
            this.backgColor = parseInt(cfg.backgColor, 16);
        }
        if (undefined !== cfg.noCreateWnd){
             this.h = '1';
             this.w = '1';
        }else{
            this.h = '100%';
            this.w = '100%';
        }
        /* ie浏览器与非ie浏览器使用不同的方式来加载控件 */
        if (undefined !== window.ActiveXObject) {
            this.loadActivex(cfg);
        } else {
            this.loadNpapi(cfg);
        }
        /* 控件事件监听 */
        this.on(cfg);

        this.onInit(cfg);
        return this;
    },
    /**
     * 加载ActiveX，ie下使用
     * @param  {[type]} cfg [description]
     * @return {[type]}     [description]
     */
    loadActivex: function(cfg) {
        this.eventObj.html("<object  classid='clsid:" + this.clsid + "' id='" + cfg.id + "' class='plugin' height= "+this.h+"  width = "+ this.w+"  events='true'></object>");
        this.obj = document.getElementById(cfg.id);

        this.parseHostname(cfg);

        this.onActivexLoad(cfg);
        return this;
    },
    /**
     * 设置控件执行函数参数
     * @param  {[type]}     [description]
     * @return {[type]}     [description]
     */
    setParam: function(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10){
        var paramObj = [param1, param2, param3, param4, param5, param6, param7, param8, param9, param10];
        return  JSON2.stringify(paramObj);
    },
    /**
     * 调用控件函数执行函数
     * @param  {[type]}     [description]
     * @return {[type]}     [description]
     */
    execFunction: function(funcName, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10){
        var param = this.setParam(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10);
        /*这里直接用top.JSON，跨域问题，通过将信任站点的设置放在最后调用来解决*/
        var result = $.parseJSON(this.obj.NetSDKExecFun(funcName, param));
        if (result.code !== 0){
            return result.code;
        }
        else{
            return result.result;
        }
    },
    /**
     * 调用控件函数执行函数
     * @param  {[type]}     [description]
     * @return {[type]}     [description]
     */
    execFunctionReturnAll: function(funcName, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10){
        if(undefined == this.obj)return {code: 0};
        return $.parseJSON(this.obj.NetSDKExecFun(funcName, this.setParam(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)));
    },
    onActivexLoad: function(cfg){
        return this.addActivexBehaviors(cfg);
    },
    addActivexBehaviors: function(cfg){
        /* 控件初始化 */
        try {
            if (undefined ===  this.noCreateWnd) {
                this.execFunction("NetSDKCreateWnd", this.maxWnd, this.focusColor, this.unfocusColor, this.backgColor);
            }
            this.execFunction("NetSDKInitOCX", cfg.szDeviceIp);
        } catch (err) {
            // alert(err);
        }

        if (undefined === this.obj.attachEvent) {
            this.attachIE11Event(cfg.id, 'NetSDKRUNINFO', cfg.name + '.trigger(p1, p2, p3, p4);');
        } else {
            this.obj.attachEvent('NetSDKRUNINFO', function(_this) {
                return function(p1, p2, p3, p4) {
                    _this.trigger(p1, p2, p3, p4);
                };
            }(this));
        }
        return this;
    },
    attachIE11Event: function(id, eventname, fn) {
        var params = fn.match(/\(\)|\(.+\)/)[0];
        var functionName = fn.match(/^([^(\s]+)/)[1];
        var handler;
        try {
            handler = document.createElement("script");
            handler.setAttribute("for", id);
        } catch (ex) {
            handler = document.createElement('<script for="' + id + '">');
        }
        handler.event = eventname + params;
        handler.appendChild(document.createTextNode(functionName + params + ";"));
        this.eventObj.get(0).appendChild(handler);
        return this;
    },
    /**
     * 加载npapi插件，非ie下使用
     * @param  {[type]} cfg [description]
     * @return {[type]}        [description]
     */
    loadNpapi: function(cfg) {
        this.eventObj.html("<embed type='application/" + this.application + "' id='" + cfg.id + "' class='plugin'  height='" + this.h + "' width = '" + this.w + "'/>");
        this.obj = document.getElementById(cfg.id);

        this.parseHostname(cfg);
        this.onNpapiLoad(cfg);
        /*if (undefined === cfg.stPortInfo) {
            return this;
        }*/

        try {
            if (undefined ===  this.noCreateWnd) {
                this.execFunction("NetSDKCreateWnd", this.maxWnd, this.focusColor, this.unfocusColor, this.backgColor);
            }
            this.execFunction("NetSDKInitOCX", cfg.szDeviceIp);
            // 非ie浏览器需要设置插件事件上报接口函数
            this.obj.NetSDKNPSetEventFunc(cfg.name + '.trigger');
        } catch (err) {
            // alert(err);
        }
        return this;
    },
    /*用于Npapi加载信任站点，只在主框架中使用*/
    onNpapiLoad: function(cfg) {
        return this;
    },
    parseHostname: function(cfg){},
    /**
     * 控件初始化完成事件处理
     * @return {[type]} [description]
     */
    onInit: function(cfg) {
        return this;
    },
    unInit: function(){
        if (undefined === this.obj){
            return this;
        }
        this.beforeUninit();
        try {
            this.execFunction("NetSDKUninitOCX");
        } catch (err) {}
        this.eventObj.hide().get(0).removeChild(this.obj);
        delete this.obj;
        return this;
    },
    beforeUninit: function(){
        return this;
    },
    /**
     * 触发控件上报事件，提供个naapi使用（npapi无法上报事件但是可以执行js代码）
     * @param  {[type]} e  [description]
     * @param  {[type]} p2 [description]
     * @param  {[type]} p3 [description]
     * @param  {[type]} p4 [description]
     * @return {[type]}    [description]
     */
    trigger: function(p1, p2, p3, p4) {
        this.eventObj.trigger(this.eventname, [p1, p2, p3, p4]);
        return this;
    },
    /**
     * 事件监听
     * @param  {[type]} cfg [description]
     */
    on: function(cfg) {
        var _this = this;
        if (undefined === cfg.events){
            return this;
        }
        var events = cfg.events;
        this.eventObj.bind(_this.eventname, function(e, p1, p2, p3, p4) {
            if (undefined === events || undefined === events[_this.prefix + p1]){
                return true;
            }
            events[_this.prefix + p1](p2, p3, p4);
        });
        return this;
    },
    /**
     * 设置焦点到控件
     * @return {[type]} [description]
     */
    focus: function(){
        try {
            this.execFunction("NetSDKActiveWnd");
            // this.eventObj.get(0).focus();
        } catch (err){}
        return this;
    },
    check: function(flag){
        if (Static.ErrorCode.ERR_COMMON_SUCCEED !== flag) {
            throw flag;
        }
    },
     /**
      * 获取控件版本号
      * @return {[str]} [description]
      */
     getVersion: function(){
         var version = null;
         try{
             version = this.execFunction("NetSDKGetVersion");
         }catch(err){
             version = null;
         }
         return version;
     },
     /**
      * 检查控件版本号是否需要升级
      * @return {[bool]}    [匹配返回true，否则为false]
      */
     checkVersion: function(){
         var version = this.getVersion();
         if(null === version){
             return null;
         }
         this.isInstalled = true;
         var aResult = version.split('.');
         var sResult = this.version.split('.');
         if (4 != aResult.length) {
             return false;
         }
         for (var i = 0; i < 4; i++) {
             aResult[i] = parseInt(aResult[i], 10);
             sResult[i] = parseInt(sResult[i], 10);
             if (aResult[i] == sResult[i]) {
                 continue;
             } else if (aResult[i] > sResult[i]) {
                 return true;
             } else if (aResult[i] < sResult[i]) {
                 return false;
             }
         }
         return true;
     },
     /**
      //     * 检查控件版本号是否正确
      //     * @param  {[obj]}   [中文资源对象，例如Live.Lang]
      //     * @return {[str]}    [返回需要提示的HTML文本]
      //     */
    createTip:function(){
        var x64Path = "ActiveX/",//'http://mycloud.uniview.com/plugins/64bit/',
            macPath = "ActiveX/",//'http://mycloud.uniview.com/plugins/mac/',
            pluginPath = "";

        /*64位浏览器，拼接下载地址*/
        if (isWin64Platform()) {
            if(isUN) {
                pluginPath = x64Path + 'WebPlayer.exe';
            } else {
                pluginPath = x64Path + 'Surveillance.exe';
            }
        }
        /*Mac系统下，拼接下载地址*/
        else if (isMac()) {
            if(isUN) {
                pluginPath = macPath + 'WebPlayer.dmg';
            } else {
                pluginPath = macPath + 'Surveillance.dmg';
            }
        }
        /*32位浏览器，拼接下载地址*/
        else {
            pluginPath = '/ActiveX/WebPlayer.exe';
        }
        return pluginPath;
    }
});

/**
 * 主框架控件
 * @example
 * var p = new Utils.Frame({
     *     id: 'frame',                     //加载的控件/插件id
     *     container: 'frameContainer',     //控件/插件的父节点
     *     name: 'f',                       //实例对象的名称，用于设置napi上报事件的入参
     *     events: Main.EventMap,           //控件事件map
     *     stPortInfo: GLOBAL_INFO.stPortInfo,     //用户登录信息
     *     stUserInfo: GLOBAL_INFO.stUserInfo
     * });
 */
//Frame = Player.extend({
//    clsid: '9F022729-5484-4623-B197-9B79F3665D33',
//    application: 'netsdkplayer-plugin',
//    serial: 1000,
//    version: '0.1.5.0',
//    noCreateWnd: true,
//    onInit: function(cfg){
//        if (undefined === cfg.stPortInfo || undefined ===  cfg.stUserInfo){
//            return this;
//        }
//        try {
//            var param = Main.Ctrl.obj2json({
//                cmd: Static.CMD.WEB_VMP_MSG_USER_KEEPALIVE
//            });
//            var port = this.execFunction('NetSDKGetLocalPort', this.serial);
//            this.execFunction('NetSDKOpenMsgMutual',
//                cfg.stUserInfo.szUserName,
//                cfg.stUserInfo.u32UserLoginHandle.toString(10),
//                /**cfg.stPortInfo.stUserLoginIP,*/
//                port,
//                /**cfg.stPortInfo.remoteIp,*/
//                cfg.stPortInfo.u16SDKPort,
//                param,
//                /*用于控件保活时初始化HTTP端口*/
//                cfg.stPortInfo.u16HTTPPort
//            );
//        } catch (err) {}
//        return this;
//    },
//    parseHostname: function(cfg){
//        var RegExp1 = new RegExp(/^\d+\.\d+\.\d+\.\d+$/);
//        if(undefined === cfg.stPortInfo || undefined === cfg.stPortInfo.szDeviceIp) {
//            return this;
//        }
//        var ret = cfg.stPortInfo.szDeviceIp;
//        if(!RegExp1.test(ret)) {
//            try {
//                ret = this.execFunction('NetSDKSwitchDomainToIP', ret);
//                if("" == ret) {
//                    ret = cfg.stPortInfo.szDeviceIp;
//                }
//            } catch (e) {
//                ret = cfg.stPortInfo.szDeviceIp;
//            };
//            cfg.stPortInfo.szDeviceIp = ret;
//        }
//        cfg.initPortInfo();
//        return this;
//    },
//    beforeUninit: function(){
//        return this.stopKeepAlive();
//    },
//    onActivexLoad: function(cfg) {
//        /*先获取版本号*/
//        this.version = this.getVersion();
//        if(undefined !== cfg.hostName){
//            try {
//                this.execFunction('NetSDKSetTrustSite', cfg.hostName);
//            } catch (err) {}
//            return this;
//        }
//        return this.addActivexBehaviors(cfg);
//    },
//    onNpapiLoad: function(cfg) {
//        /*先获取版本号*/
//        this.version = this.getVersion();
//        if(undefined !== cfg.hostName){
//            try {
//                this.execFunction('NetSDKSetTrustSite', cfg.hostName);
//            } catch (err) {}
//            return this;
//        }
//    },
//    stopKeepAlive: function(){
//        try {
//            this.execFunction('NetSDKCloseMsgMutual');
//        } catch (err) {}
//        return this;
//    },
//    /**
//     * 获取控件版本号
//     * @return {[str]} [description]
//     */
//    getVersion: function(){
//        var version = null;
//        try{
//            version = this.execFunction("NetSDKGetVersion");
//        }catch(err){
//            version = null;
//        }
//        return version;
//    },
//    /**
//     * 检查控件版本号是否需要升级
//     * @return {[bool]}    [匹配返回true，否则为false]
//     */
//    checkVersion: function(){
//        var version = this.version;
//        if(null === version){
//            return false;
//        }
//        var aResult = version.split('.');
//        var sResult = this.version.split('.');
//        if (4 != aResult.length) {
//            return false;
//        }
//        for (var i = 0; i < 3; i++) {
//            aResult[i] = parseInt(aResult[i], 10);
//            sResult[i] = parseInt(sResult[i], 10);
//            if (aResult[i] == sResult[i]) {
//                continue;
//            } else if (aResult[i] > sResult[i]) {
//                return true;
//            } else if (aResult[i] < sResult[i]) {
//                return false;
//            }
//        }
//        return true;
//    },
//    /**
//     * 检查控件版本号是否正确
//     * @param  {[obj]}   [中文资源对象，例如Live.Lang]
//     * @return {[str]}    [返回需要提示的HTML文本]
//     */
//    createTip:function(Lang, CustomerCode){
//        var isUNV = function(Mode) {
//            if(Static.CustomizeType.UNIVIEW === Mode || Static.CustomizeType.UNV === Mode) {
//                return true;
//            }
//            return false;
//        }
//        var x64Path = 'http://mycloud.uniview.com/plugins/64bit/',
//            macPath = 'http://mycloud.uniview.com/plugins/mac/',
//            pluginPath = '';
//
//        /*64位浏览器，拼接下载地址*/
//        if (Utils.isWin64Platform()) {
//            if(isUNV(CustomerCode)) {
//                pluginPath = x64Path + 'WebPlayer.exe';
//            } else {
//                pluginPath = x64Path + 'Surveillance.exe';
//            }
//        }
//        /*Mac系统下，拼接下载地址*/
//        else if (true === Utils.isMac()) {
//            if(isUNV(CustomerCode)) {
//                pluginPath = macPath + 'WebPlayer.dmg';
//            } else {
//                pluginPath = macPath + 'Surveillance.dmg';
//            }
//        }
//        /*32位浏览器，拼接下载地址*/
//        else {
//            pluginPath = '/ActiveX/WebPlayer.exe';
//        }
//        var tip = "<a class='download' href='" + pluginPath + "' target='_self' title='" +
//            Lang.Text.TipDownloadPlugin +"'>" +
//            Lang.Text.TipActiveXFailed.replace("%s", "") + "</a>";
//        return tip;
//    }
//});