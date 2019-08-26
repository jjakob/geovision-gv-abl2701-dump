/**
 * 本文件用于记录一些常量的定义
 */

/* IPC 控件版本号 */
var WEB_CTRL_VERSION = "1.0.402";

/* 默认通道号 */
var DEFAULT_CHANNEL_ID = 0;
/*升级结果*/
var UpdateResult = {
    FILEFINISH:        0,            //文件传输完毕
    INPROCESS:         2,            //升级 处理中
    INVALID:           3,            //未在升级
    SUCCESS:           4,            //升级结束
    FAIL:              5,            //升级出错
    NOMEMORY:          6,            //升级 内存空间不够
    FILE_OPEN_ERR:     7,            //升级 打开镜像文件出错
    FILE_TYPE_ERR:     8,            //升级 文件类型不匹配
    VERSION_ERR:       9,            //升级 版本不匹配
    DEVICE_ERR:        10,           //升级 FLASH出错
    BUSY:              11,           //不能同时加载多个升级进程
    CRC_ERR:           12,           //CRC校验失败
    INIT_ERR:          13,           //初始化失败
    MD5_ERR:           14,           //MD5校验失败
    WAIT_RECEIVE_DATA: 15,           //等待接收升级数据
    SUCCESS_REBOOT:    16            //升级成功，自动恢复默认配置并重新登录（目前用于跨版本升级）
};

/*云升级结果*/
var UpdateCloudResult = {
    FILEFINISH:        0,            //文件传输完毕
    INPROCESS:         2,            //升级 处理中
    INVALID:           3,            //未在升级
    SUCCESS:           4,            //升级结束
    FAIL:              5,            //升级出错
    NOMEMORY:          6,            //升级 内存空间不够
    FILE_OPEN_ERR:     7,            //升级 打开镜像文件出错
    FILE_TYPE_ERR:     8,            //升级 文件类型不匹配
    VERSION_ERR:       9,            //升级 版本不匹配
    DEVICE_ERR:        10,           //升级 FLASH出错
    BUSY:              11,           //不能同时加载多个升级进程
    CRC_ERR:           12,           //CRC校验失败
    INIT_ERR:          13,           //初始化失败
    MD5_ERR:           14,           //MD5校验失败
    WAIT_RECEIVE_DATA: 15,           //等待接收升级数据
    SUCCESS_REBOOT:    16            //升级成功，自动恢复默认配置并重新登录（目前用于跨版本升级）
};

/**
 * 图像大小
 */
var PictureSize = {
    PICTURE_SIZE_D1: 0,       //720*576像素
    PICTURE_SIZE_4CIF: 1,     //320*288像素*4
    PICTURE_SIZE_2CIF: 2,     //320*288像素*2
    PICTURE_SIZE_CIF: 3,      //320*288像素
    PICTURE_SIZE_QCIF: 4,     //176*144像素
    PICTURE_SIZE_HALFD1: 5,   //720*288像素
    PICTURE_SIZE_720: 6,      //720
    PICTURE_SIZE_1080: 7,     //1080
    PICTURE_SIZE_1024: 8,     //1024
    PICTURE_SIZE_1280: 9,     //1280
    PICTURE_SIZE_UXGA: 10     //极速扩展图形阵列
};

/**
 * 图像制式
 */
var PictureFmt = {
    PICTURE_FORMAT_PAL :0,           //PAL制式
    PICTURE_FORMAT_NTSC :1,          //NTSC模式
    PICTURE_FORMAT_720P24HZ :2,      //720P24HZ
    PICTURE_FORMAT_720P25HZ :3,      //720P25HZ
    PICTURE_FORMAT_720P30HZ :4,      //720P30HZ
    PICTURE_FORMAT_720P50HZ :5,      //720P50HZ
    PICTURE_FORMAT_720P60HZ :6,      //720P60HZ
    PICTURE_FORMAT_1080I48HZ :7,     //1080I48HZ
    PICTURE_FORMAT_1080I50HZ :8,     //1080I50HZ
    PICTURE_FORMAT_1080I60HZ :9,     //1080I60HZ
    PICTURE_FORMAT_1080P24HZ :10,    //1080P24HZ
    PICTURE_FORMAT_1080P25HZ :11,    //1080P25HZ
    PICTURE_FORMAT_1080P30HZ :12,    //1080P30HZ
    PICTURE_FORMAT_1080P50HZ :13,    //1080P50HZ
    PICTURE_FORMAT_1080P60HZ :14,    //1080P60HZ
    PICTURE_FORMAT_AUTO :15,         //自动
    PICTURE_FORMAT_INVALID :16       //无效

};

var PictureFmtVV = [];
(function(){
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_PAL]="PAL";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_NTSC]="NTSC";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_720P24HZ]="720P@24";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_720P25HZ]="720P@25";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_720P30HZ]="720P@30";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_720P50HZ]="720P@50";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_720P60HZ]="720P@60";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080I48HZ]="1080I@48";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080I50HZ]="1080I@50";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080I60HZ]="1080I@60";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080P24HZ]="1080P@24";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080P25HZ]="1080P@25";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080P30HZ]="1080P@30";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080P50HZ]="1080P@50";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_1080P60HZ]="1080P@60";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_AUTO]="自动";
    PictureFmtVV[PictureFmt.PICTURE_FORMAT_INVALID]="无效";
})();

/* SDK通用结果码 */
var ResultCode = {
    RESULT_CODE_SUCCEED:        0,      /* 执行成功 */
    RESULT_CODE_FAIL:           1,      /* 执行失败 */
    RESULT_CODE_INVALID_PARAM:  2,      /* 输入参数非法 */
    ERR_SDK_COMMON_LOCK_USER:   364,    /*用户已被锁住*/
    ERR_SDK_REMOTE_USER_WITH_WEAK_PASSWD:    456,    /**< 外网用户弱密码访问 */
    RESULT_CODE_USERFULL:       458,    /* 用户已满 */
    RESULT_CODE_USERNONEXIST:   459,    /* 用户不存在 */
    RESULT_CODE_PASSWD_INVALID: 460,    /* 用户密码错误 */
    RESULT_CODE_TIMEOUT:        472,    /* 请求超时 */
    RESULT_CODE_IP_CONFLICT:    486,    /* 配置网口参数失败--IP冲突 */
    RESULT_CODE_NOT_SUPPORT:    487,    /* 配置网口参数失败--网口模式不支持 */
    RESULT_CODE_UNPPPPOE_CONFLICT:           488,   /**< UNP和PPPoE功能上互斥，在尝试同时开启时会报错 */
    EXCEED_CONFIGF_FULL:        510,    /* Smart规则配置超过最大值 */
    PTZModeNotMatch:            614,    /* 串口模式不匹配 */
    RESULT_CODE_NOT_MOUNT:      558,    /* NAS连接失败 */
    SDK_MEDIA_ENCODELIMITED:    559,    /* 编码能力受限 */
    PTZ_PRESET_ISUSED:          611,     /*预置位禁止删除*/
    DEL_PTZ_PRESET :                       489, /*预置位删除需修改巡航配置*/
    ERR_SDK_PTZ_MODE_CRUISE_FULL:    626, /* 模式路径轨迹点个数已满 */
    RESULT_CODE_DOWNLOADING: 9,
    RESULT_CODE_KEEPALIVEFAIL:  999,     /*通用错误（界面使用）*/
    RESULT_INVALID:             0xff    /* 无效值 */
};

// 球机中间按钮的值的循环
var PtzTurnAroundVal = [0x0502, 0x0501, 0x0504, 0x0503];
/* 第一个值为开始，第二个值为停止 */
var PtzDerectMap = {
    leftUp:         [0x0702, 0x0701],        //左上
    goUp:           [0x0402, 0x0401],        //向上
    rightUp:        [0x0802, 0x0801],        //右上
    goLeft:         [0x0504, 0x0503],        //向左
    goRight:        [0x0502, 0x0501],        //向右
    leftDown:       [0x0704, 0x0703],        //左下
    goDown:         [0x0404, 0x0403],        //向下
    rightDown:      [0x0804, 0x0803]         //右下
};
var PtzLensMap = {
    ApertureAdd1:    [0x0102, 0x0101],       //光圈+
    ApertureSub1:    [0x0104, 0x0103],       //光圈-
    FocusAdd1:       [0x0202, 0x0201],       //对焦+
    FocusSub1:       [0x0204, 0x0203],       //对焦-
    BecomeAdd1:      [0x0304, 0x0303],       //变倍+
    BecomeSub1:      [0x0302, 0x0301]        //变倍-
};

//云台动作类型
var PtzButtonAct = {
    ButtonDown:        0x0201,       //鼠标按下
    ButtonUp:          0x0202,       //鼠标抬起
    MouseWheel:        0x020A        //滚轮
};
//滚轮方向
var PtzButton = {
    WheelZoomIn: 0x8001,             //滚轮向前滑动变倍放大
    WheelZoomOut: 0x8002             //滚轮向后滑动变倍缩小
};

//3D定位模式
var PostionMode = {
    PositionOut: 0x1101, /*云台拉框放大*/
    PositionIn:  0x1102, /*云台拉框缩小*/
    Positionlocation: 0x1103 /*云台3D 定位*/
};

//手动后焦控制类型
var MANUAL_BACK_FOCUS = {
    Near:        213,                //近后焦
    Far:         214,                //远后焦
    Stop:        215                 //停止
};

//语种
var LANG_TYPE = {
    CustomLang: -1,     //样机语言
    Chinese: 0,     //中文
    English: 1 ,     //英文
    TraChinese: 2 ,         //繁体中文
    French: 3,          //法语
    German: 4 ,          //德语
    Spanish: 5,           //西班牙语
    Italian:6,          //意大利语
    Portuguese:7,         //葡萄牙语
    Russian: 8 ,           //俄文
    Ukraine:9,       //乌克兰语
    Georgian:10,         //格鲁尼亚语
    Dutch:11,        //荷兰语
    Danish:12,            //丹麦语
    Finnish:13,            //芬兰语
    Swedish:14,          //瑞典语
    norwegian:15,     //挪威语
    Iceland:16,        //冰岛语
    Polish:17,           //波兰语
    Lithuania:18,        //立陶宛语
    Greek:19,        //希腊语
    Czech:20,         //捷克语
    Slovak:21,      //斯洛伐克语
    Hungarian:22,          //匈牙利语
    Rome:23,          //罗马语
    Serbian:24,          //塞尔维亚语
    Croatia:25,        //克罗地亚语
    Slovenia:26,  //斯洛文尼亚语
    Bulgarian:27,       //保加利亚语
    Belarus:28,      //白俄罗斯语
    Turkish:29,          //土耳其语
    Arabic:30,        //阿拉伯语
    Hebrew:31,           //希伯来语
    India:32,              //印度语
    Bengali:33,         //孟加拉语
    Persian:34,            //波斯语
    Japanese:35,            //日语
    Korean:36,             //韩语
    Thai:37,               //泰语
    Malaysian:38,            //马来西亚语
    Indonesia:39,        //印度尼西亚语
    Philippines:40,          //菲律宾语
    Lao :41,               //老挝语
    Vietnamese:42,         //越南语
    Mongolia :43,       //蒙古国语
    albanian:44,           //阿尔巴尼亚语
    Azerbaijani:45,         //阿塞拜疆语
    Gail:46,              //盖尔语
    Estonia:47,              //爱沙尼亚语
    Bosnian:48,           //波斯尼亚语
    LowGerman:49,         //低地撒克逊语
    Peru:50,             //秘鲁语
    Latvia:51         //拉脱维亚语
};

//键盘按键对应的事件编码
var KEY_CODE =
{
    keyJ:       74,         //j
    keyEnter:   13,         //回车键
    keyTab:     9,          //TAB键
    keyLeft:    37,         //方向键左
    keyUp:      38,         //方向键上
    keyRight:   39,         //方向键右
    keyDown:    40,         //方向键下
    keyF2:      113,        //F2
    keyESC:     27,         //ESC
    keyD:       68,         //d
    keyE:       69,         //e
    keyF:       70,         //f
    keyH:       72,         //h
    keyI:       73,         //i
    keyM:       77,         //m
    keyN:       78,         //n
    keyQ:       81,         //q
    keyU:       85,         //u
    keyY:       89          //y
};

var COMMON_RESULT = {
        DiscCapacityNotEnough: 0x00079C,    /* 磁盘空间不足 */
        AutoFocusBlock:        0x000012,    /* 其他用户正在自动对焦 */
        AudioDevNotReady:       0x0007C2    /* 音频设备未准备好 */
};

//诊断信息错误码
var ExportDebugInfoRst = {
    EXPORT_DEBUG_INFO_SUCCESS:      0,  /* 导出诊断信息成功 */
    EXPORT_DEBUG_INFO_FAIL:         1,  /* 导出诊断信息失败 */
    EXPORT_DEBUG_INFO_TIMEOUT:      2,  /* 导出诊断信息超时 */
    EXPORT_DEBUG_INFO_EXPORTING:    3   /* 正在导出诊断信息 */
};

//云台巡航状态码
var PTZ_STATE_CRUISE = {
    IDLE:           0,      // 空闲状态 */
    USR_CTRL:       1,      // 用户控制 */
    AUTO_CRUISE:    2,      // 自动巡航 ulStatusPara1=轨迹ID
    MANUAL_CRUISE:  3,      // 手动巡航 ulStatusPara1=轨迹ID
    TRACK_RECORD:   4,      // 轨迹录制 ulStatusPara1=轨迹ID
    IVA_PLAN:       5,      // 智能计划启用中
    ECOMPASS_START: 7      // 电子罗盘校准状态
};

//CMD命令字
var CMD_TYPE = {
        // 参数配置
        DEVICE_CAPTURE_MODE_CFG: 12,          // 设置/获取 图像制式
        ALARM_LINK_CFG: 20,                 // 设置/获取 告警联动配置
        ALARM_TEMPERATURE_CFG: 22,             // 设置/获取 温度配置信息
        PTZ_TRACK_CFG: 30,                    // 设置/获取 巡航轨迹信息
        /* 卡口相关: 基本配置、智能配置 */
        IMAGE_MISC_CFG: 52,                    // 设置/获取 杂项参数配置
        WIFI_CFG: "/LAPI/V1.0/NetWork/WiFi/Configuration",                        // 获取/设置 WiFi配置
        WIFI_SCANNING_INFO: "/LAPI/V1.0/NetWork/WiFi/ScanInfo",                // 获取扫描到的WiFi列表
        WIFI_LINK_STATUS: "/LAPI/V1.0/NetWork/WiFi/LinkStatus",                // 获取WiFi连接状态
        EP_TG_TYPE_CFG: 97,                   // 获取/设置 当前运行环境，卡口或者电警，UCHAR类型 */
        IVA_ILLEGAL_CFG: 105,                 // 获取/设置 智能违章配置
        HCM_LOW_DELAY_CFG: 107,               // 获取/设置 机芯低时延模式
        IVA_CHECK_REPEAT: 110,                // 获取/设置 重复车牌过滤时间
        IVA_COMMON_MODE: 113,                 // 获取/设置 通用款型智能枪的模式
        AUDIO_ECHO_CANCELLATION: 114,         // 获取/设置 回声抵消参数
        IVA_CUSTOM_CFG: 116,                  // 获取/设置 自定义照片osd参数
        DEBUGGER_SATURATION_CFG: 118,         // 获取/设置 自动饱和度开关
        DEBUG_POLARIZER_SWITCH: 137,          // 获取/设置 偏振镜反向开关
        MANUAL_BACK_FOCUS_CTRL: 139,          // 设置 手动后焦镜头控制
        IVA_PERSON_COUNT_CFG: 146,            // 获取/设置 人数统计配置
        IVA_LPR_CFG: 151,                     // 获取/设置 车牌相关参数
        MUTIVIDEO_ENCODER_CFG:152,            // 获取/设置媒体流参数配置
        DEBUG_SANSUO_MODE: 165,               // 获取/设置三所模式
        NET_BROKEN_DETECT: 174,               // 获取/设置 断网检测开关
        IVA_REMOTE_CRTL_CFG: 179,             // 获取/设置 车位半球远程控制配置
        MOTION_AREA_LINK: 181,                // 获取/设置 移动侦测配置
        CMD_RELATION_CFG: 189,                // 获取/设置 指令映射关系表配置
        IPCAX_LOCAL_CFG: 190,                 // 获取/设置 本地配置
        IMAGE_REVERSE_ENABLE_CFG:201,         // 获取/设置图像采集翻转开关
        KEYFRAME_PERIOD: 207,                // 获取/设置 周期I帧时间间隔配置
        FISH_EYE_CFG: 210,                    // 获取/设置 鱼眼配置
        FISH_EYE_SETUP_CFG: 211,              // 获取/设置 鱼眼安装方式
        FISH_GUN_MODE_CFG: 212,               // 获取/设置 鱼眼枪模式
        H264_PAYLOADTYPE_CFG: 222,           //< 获取/设置 H264 PayloadType值配置
        IVA_ITS_LPR_CFG: 233,                //智能球切卡口 获取/设置 车牌相关参数
        IVA_ITS_ILLEGAL_CODE_CFG: 234,       //智能球切卡口 获取/设置 违章代码参数
        IVA_ITS_EVIDENCE_OSD_CFG: 235,       //智能球切卡口 获取/设置 智能违章OSD配置        


        // 业务操作
        CMD_ZOOM_DIGITAL: 1000,               // 打开/关闭 数字放大
        CMD_SNAPSHOT: 1001,                   // 截屏
        CMD_AUTO_BACK_FOCUS: 1002,            // 设置 辅助聚焦配置
        CMD_LOGIN: 1003,                      // SDK登录
        CMD_ZOOM_OPTICS: 1004,                // 打开/关闭 3D 定位
        CMD_ABF_POSITION: 1005,               // 获取ABF标准后焦位置
        CMD_PLAYER_POSITION: 1006,            // 获取当前回放位置
        CMD_PLAYER_PAUSE: 1007,               // 暂停回放存储流
        CMD_PLAYER_RESUME: 1008,              // 恢复回放存储流
        CMD_PLAYER_START: 1009,               // 开始回放存储流

        CMD_PLAYER_STOP: 1010,                // 停止回放存储流
        CMD_RECORD_SEARCH: 1011,              // 查询录像
        CMD_PLAYER_PAUSEREFRESH:1012,         // 暂停/打开实况播放
        CMD_PICTURE_INFO: 1013,               // 过车照片信息
        CMD_PICTURE_PLAY: 1014,               // 过车照片查看
        CMD_PICTURE_ENLARGE: 1015,            // 照片放大
        CMD_EP_PARARM_CHECK: 1016,            // 电警智能参数校验
        CMD_TG_PARARM_CHECK: 1017,            // 卡口智能参数校验
        CMD_OPEN_FOLDER: 1018,                // 打开文件夹
        CMD_TRAFFIC_LIGHT_STATUS: 1019,       // 信号灯状态



        CMD_PLAYER_STOPSTARTIVAPLAY: 1026,     // 暂停/恢复实况播放（用于智能球绘图）
        CDM_STATUS_DEVICE_EX: 1027,            // 设备状态获取（扩展）
        CDM_EXPORT_WHITELIST_CFG: 1028,        // 导入导出白名单设置

        CMD_MANUAL_SNAP: 1030,                 // 手动取证
        CMD_START_STREAM: 1032,                //在指定窗口启流
        CMD_GET_WNDID: 1033,                   //获取选中的窗口ID
        CMD_SET_PAINT: 1034,                   //在选中的窗口中绘制窗格     
        CMD_START_RECORD: 1035,                //在选中的窗口中启动本地录像
        CMD_STOP_RECORD: 1036,                 //在选中的窗口中停止本地录像
        CMD_CTROL_CMD: 1037,                   //对选中的窗口中的对象进行PTZ、变倍等操作
        CMD_STOP_STREAM: 1038,                 //在指定窗口停流

        CMD_PLAYER_DLL_DOWNLOAD: 1040,         // 下载文件

        CMD_START_MEDIA_STREAM: 1042,          // 媒体流起流
        CMD_NEW_DETECTAREA_CFG: 1043,          // 设置 检测区域与红绿灯配置

        CMD_AREA_FOCUS: 1045,                   // 区域聚焦
        CMD_PARK_STATUS: 1046,                  // 车位状态
        CMD_LID_STATUS: 1047,                   // 开箱检测状态

        IPCAX_CMD_PLAYER_SOUND_CHANNEL: 1051,  // 设置 音频声道
        CMD_CARPORT_LEDCTRL_STATUS: 1052,      // 车位灯控制器在线状态
        CMD_TRAFFICSERVER_STATUS: 1053,        // 交通服务器实时在线状态
        INVALID:0xFFFF
};

//流类型对应ID
var StreamID = {
    MAIN_VIDEO: 0,                   // 主流
    AUX_VIDEO: 1,                    // 辅流
    THIRD_VIDEO: 2,                   // 三流
    FORTH_VIDEO: 3                   // 第四流
};

//设备类型
var DeviceType = {
    DEVICE_IPC: 0,                   // IPC
    DEVICE_KAKOU: 1,                 // 卡口
    DEVICE_POLICE: 2,                // 电警
    DEVICE_HTSIPC: 3,                // HTS_IPC
    DEVICE_IVAGUN: 5,                // 智能枪
    DEVICE_IVACOMMON: 10,            // 通用智能
    DEVICE_FISHIPC: 12,             //经济型鱼眼

    INVALID: 0xFF
};

//矫正模式枚举变量
var PlayPtzMode = {
    PLAYER_ORIGINAL : 0,          /*原始图像*/
    PLAYER_180 :1,                   /*2*180度模式*/
    PLAYER_360_1PTZ : 2,              /*360度+1PTZ模式*/
    PLAYER_360_6PTZ : 3,              /*360度+6PTZ模式*/
    PLAYER_FISH_3PTZ : 4,             /*鱼眼+3PTZ模式*/
    PLAYER_FISH_MID_ON_4PTZ : 5,      /*鱼眼图像在中间且显示+4PTZ模式*/
    PLAYER_FISH_MID_OFF_4PTZ : 6,     /*鱼眼图像在中间但不显示+4PTZ模式*/
    PLAYER_FISH_LEFT_4PTZ : 7,        /*鱼眼左边+4PTZ模式*/
    PLAYER_FISH_8PTZ : 8,             /*鱼眼+8PTZ模式*/
    PLAYER_PANORAMA : 9,              /*全景模式*/
    PLAYER_PR_3PTZ : 10,               /*全景+3PTZ模式*/
    PLAYER_PR_4PTZ : 11,               /*全景+4PTZ模式*/
    PLAYER_PR_8PTZ : 12                /*全景+8PTZ模式*/
};

//设备安装模式
var PlayerfFixMode = {
    PLAYER_TOP_INSTALLATION : 0,      /*顶部安装*/
    PLAYER_BOTTOM_INSTALLATION : 1,       /*底部安装*/
    PLAYER_SIDE_INSTALLATION: 2          /*侧面安装*/
};

//传输协议
var Protocol = {
    UDP: 0,                          // UDP协议
    TCP_CLIENT: 1,                   // TCP协议Client端
    TCP_SERVER: 2                    // TCP协议Server端
};

//Mac上报事件
var MacReportType = {
    REPORT_UPDATE : "/LAPI/V1.0/Channel/0/Event/Status/Update", //升级结果
    REPORT_NETWORK_CONFIG : "/LAPI/V1.0/Channel/0/Event/Status/NetWorkChange",  // 网口配置上报
    STOR_MEMORY_CARD_FORMAT : "/LAPI/V1.0/Channel/0/Event/Status/MemoryCardFormate", //格式化SD卡上报
    UPNP_PORT_MAP_INFO : "/LAPI/V1.0/Channel/0/Event/Status/PortMap",  //UPNP端口映射状态上报
    REPORT_USERINFOCHANGED : "/LAPI/V1.0/Channel/0/Event/Status/UserInfoChange", // 用户信息已被修改
    VM_SERVER_ONLINE : "/LAPI/V1.0/Channel/0/Event/Status/ManagerServer",  // VM服务器的连接状态，对应参数BOOL_T: ON:1, OFF:0
    PHOTO_SERVER_ONLINE : "/LAPI/V1.0/Channel/0/Event/Status/PhotoServer", // 照片服务器的连接状态，对应参数BOOL_T: ON:1, OFF:0
    PTZ_STATUS : "/LAPI/V1.0/Channel/0/Event/Status/PTZ",  // 云台状态
    SCENE_CURRENT : "/LAPI/V1.0/Channel/0/Event/Status/SceneCurrent",  //场景自动切换时，当前场景ID上报
    SD_STATUS : "/LAPI/V1.0/Channel/0/Event/Status/SD",  // 订阅SD卡状态变更消息
    DDNS_DOMAIN_CHECK_RESULT: "/LAPI/V1.0/Channel/0/Event/Status/DDNSDomainCheckResult"  //< DDNS域名检测完成 对应参数类型: BOOT_T: 改变:1  不改变:0 */
};

//控件上报事件类型
var ReportType =
{
    REPORT_KEEPALIVE: 0,           // SDK保活
    REPORT_UPDATE: 1,              // 升级结果
    REPORT_USERINFOCHANGED: 3,     // 用户信息已被修改
    WORKMODE_CHANGE: 5,             // 智能枪工作模式切换

    VM_SERVER_ONLINE: 50,           // VM服务器的连接状态，对应参数BOOL_T: ON:1, OFF:0
    PHOTO_SERVER_ONLINE: 51,        // 照片服务器的连接状态，对应参数BOOL_T: ON:1, OFF:0
    BASIC_DEVICE_INFO: 52,          // 设备基本信息
    DEVICE_STATE_INFO: 53,          // 设备运行状态
    REPORT_NETWORK_CONFIG: 54,        // 网口配置上报
    UPNP_PORT_MAP_INFO: 59,           // UPNP端口映射状态上报
    DDNS_DOMAIN_CHECK_RESULT: 61,     //< DDNS域名检测完成 对应参数类型: BOOT_T: 改变:1  不改变:0 */
    STOR_MEMORY_CARD_FORMAT: 90,      // 格式化SD卡上报
    STATUS_STOR_NAS_MOUNT: 91,        // 连接NAS状态上报
    DOWNLOAD_RECORD: 92,              // 录像下载状态

    PTZ_STATUS: 100,                 // 云台状态
    PTZ_ABS_POSITION: 101,           // 云台绝对位置
    PTZ_ABS_ZOOMNUM: 102,            // 云台绝对ZOOM倍数，对应参数类型: ULONG 倍数*100，精确到小数点后两位

    SCENE_CURRENT: 120,              //当前场景ID

    RADAR_STATE: 150,                // 雷达状态
    COIL_STATE: 151,                // 线圈状态，支持 8个
    POLARIZER_STATE: 152,           // 偏振镜状态
    LED_STROBE_STATE: 153,          // LED灯状态
    ND_FILTER_STATE: 154,          // ND滤镜状态
    TRAFFICLIGHT_STATUS: 155,       // 信号灯检测器状态
    SD_STATUS: 156,                 // SD卡状态
    TRAFFICLIGHT_COLOUR: 158,       // 信号灯颜色状态
    IVA_ILLEGAL_DETECT_REPORT: 159,  // 智能手动抓拍参数
    STATUS_IVA_PARK_STATUS_REPORT: 160,   // 车位状态上报
    STATUS_IVA_PARK_STATUS_ALL: 162,      // 所有车位状态
    TRAFFIC_PARAM_REPORT_STATE: 164,      //交通参数上报结果
    LID_STATUS:165,          //开箱检测状态
    STATUS_VEHICLE_QUEUE_LEN:166,          // 车辆排队长度
    STATUS_CARPORT_LEDCTRL_REPORT:167,          //车位灯控制器状态上报
    STATUS_TRAFFICSERVER_REPORT:168,      //交通参数服务器实时在线状态

    PLAYER_RECORD_VIDEO: 200,       // 本地录像过程中上报运行信息
    PLAYER_MEDIA_PROCESS: 201,      // 视频媒体处理过程中的上报运行信息
    PLAYER_SERIES_SNATCH: 202,      // 连续抓拍过程中上报运行信息
    PLAYER_MEDIA_VOICE: 203,        // 语音业务过程中上报运行信息
    PLAYER_RECORD_VIDEOEX: 204,      // 本地录像过程中上报运行信息
    PLAYER_CODE_PROCESS: 205        // 视频解码过程中上报运行信息

};

// 运行模式
var RunMode =
{
    LIVE: 0,        // 实况播放
    CONFIG: 1,      // 配置页面（可全屏）
    SERVER: 2,      // 服务器管理模式
    JPEG: 3,        // 显示照片模式
    JPEG_INTEL: 4,  // 照片智能配置模式
    SDFS: 5,        // SD卡操作模式
    CFG_NOFULL: 6,    // 配置页面（不能全屏）
    OSD: 7,         // OSD模式
    EP: 8,          // 电警模式
    EP_INTEL: 9,       // 电警智能
    EP_TL: 10,       // 交通灯模式
    LIVE_JPEG: 11,       // 多窗口
    SCREEN_4: 12,       // 4分屏
    UNKOWN: 0xff    // 未知
};

/**
 * 窗口号
 *说明：参数为页面模式，现针对天网卡口应用：有4种模式：0单独实况窗口页面，1首页三个窗口页面，2照片页面，3配置智能页面（约定枚举）
 * 总共有6种窗口
 *0：实况
 *1：三分屏左上角
 *2：抓拍流显示
 *3：照片页面—SD卡照片列表
 *4: 照片页面—SD卡照片显示窗口
 *5：本地照片显示
 */
var wndIdNum = {
    LIVE : 0,
    CAPTURESCREENLEFT : 1,
    CAPTURESCREEN : 2,
    SDLIST :3,
    SDWND :4,
    LOCALPIC :5
};


//界面比例大小显示
var UIRenderScale =
{
    FULL: 0,         // 满比例
    PROPORTION: 1,   // 按比例
    REAL: 0xff       // 实际大小
};

//流类型
var StreamType =
{
    LIVE: 0,    //实况流
    PICTRUE: 1, //抓拍流（jpeg）
    MJPEG: 2,    //照片流
    IMAGE_TYPE_PLATE: 3, //过车图片流
    PIC_VIEW: 4 //图片查看
};

//窗口类型
var VideoType =
{
    LIVE: 0,    //实况
    PICTRUE: 1  //照片
};

//获取本地文件执行结果码
var FilePath = {
    SUCCESSED: 0x000000,                                   // 成功
    ERR_INPUT_STR_FAIL: 0x000040,                         // 输入参数错误
    ERR_NOTGETMYCOMPUTER: 0x000041,                       // 没有获取到"我的电脑"的路径
    ERR_BROWSE_FILE_CANCEL: 0x000042,                     // 取消选择
    ERR_BROWSE_PATH_FAIL: 0x000043,                       // 获取文件路径失败
    ERR_FILE_NOTEXIST: 0x000044,                          // 本地文件不存在
    ERR_PATH_LEN_EXCEED: 0x000045,                        // 路径长度超过限制
    ERR_SYSTEM_FAIL: 0x000046                             // 系统内部错误
};

//XP错误码
var XPErrorResult = {
        VIDEO_STREAM_FULL:             259,  /**< 设备侧视频流已满 */
        RECORD_FINISHED:               503, /**< 录像结束 */
        VIDEO_STREAM_CLOSED:           260,  /**< 设备侧视频流已关闭 */
        FILE_PLAY_FINISHED:            669,  /**< XP 文件已播放完 */
        DISK_CAPACITY_WARN:            670,  /**< XP 硬盘剩余空间低于阈值 */
        DISK_CAPACITY_NOT_ENOUGH:      671,  /**< XP 硬盘剩余空间不足 */
        NO_PICTURE_TO_SNATCH:          672,  /**< XP 没有解码过的图片可供抓拍 */
        SERIES_SNATCH_FAILED:          673,  /**< XP 连续抓拍过程中抓拍失败 */
        WRITE_FILE_FAILED:             674,  /**< XP 写文件操作失败 */
        FILE_DESTROY:                  675,  /**< XP 文件已损坏 */
        NOT_SUPPORT_MEDIA_ENCODE_TYPE: 676,  /**< XP 媒体编码格式不支持录像操作 */
        PROCESS_MEDIA_DATA_FAILED:     677,  /**< XP 媒体数据处理失败 */
        RECV_DATA_FAILED:              678,  /**< XP 网络故障造成接收数据失败 */
        MEDIA_RESOLUTION_CHANGE:       679,  /**< XP 媒体流分辨率发生变化 */
        VOICE_RUNNING_ERROR:           680,  /**< XP 语音对讲或广播过程中出错 */
        SET_DECODETAG_FAIL:            681,  /**< XP 设置通道厂商信息失败 */
        AUDIO_DEVICE_UNRIPE:           682,  /**< XP 音频设备未准备好 */
        RECORDSTATE_MANUAL:            683,  /**< 手动停止 */
        RECORDSTATE_SUBSECTION:        684,  /**< 按规则分割 */
        RECORDSTATE_CAPACITYLIMIT:     685,  /**< 容量限制到达 */
        NEED_DLL_FOR4K:                686,  /**< 需要4K解码库及依赖库*/
        CREATE_DIR_FAIL:               5647, /**< 创建目录失败 */
        DIR_TOO_LONG:                  5648  /**< 路径太长 */
};

/* 摄像机状态 */
var UICameraStatus ={
    IMMOVE: 0,      /* 固定摄像机*/
    MOVE: 1        /* 云台摄像机 */
};

//视频编码格式
var VideoFormat = {
    MPEG1:              0,          /**< MPEG1 */
    MPEG2:              1,          /**< MPEG2 */
    MPEG4:              2,          /**< MPEG4 */
    MJPEG:              3,          /**< MJPEG */
    H263:               4,          /**< H263 */
    H263PLUS:           5,          /**< H263+ */
    H264:               6,          /**< H.264 */
    AUTO:               7,          /**< 自适应(解码) */
    MPEG4_DS:           8,          /**< MPEG4-ds */
    MPEG2_DS:           9,          /**< MPEG2-ds */
    MPEG4_2:            10,         /**< MPEG4 辅流 */
    H264_2:             11,         /**< H264 辅流 */
    JPEG:               12,          /**< JPEG */
    H265:               13          /**< H265 */
};

//告警联动类型
var AlarmActCommand = {
    PRESET: 0,       // 联动预置位, 对应参数: 预置位ID
    OUTSWITCH: 1,    // 联动开关量输出, 对应参数: 开关量ID
    STOR: 2,         // 联动存储, 暂不支持
    LED: 3,          // 联动指示灯, 暂不支持
    BUZZER: 4,       // 联动蜂鸣器，暂不支持
    CAPTURE: 101,    // 联动抓拍, 不需要参数    
    OSD: 100,           // 联动OSD，暂不支持
    START_USBSTOR: 102, //  联动启动本地存储
    CAPTURE2FTP: 104,   // 联动抓拍且上传Ftp
    CAPTURE2EMAIL: 105  // 联动抓拍且上传E-mail  
    
};

//告警类型
var AlarmType = {
    CROSS_LINE:         301,         // 警戒线 伴线告警 
    INTROSION_ZONE:     302,         // 区域入侵告警 
    ACCESS_ZONE:        303,         // 进入区域(警戒区)告警 
    LEAVE_ZONE:         304,         // 离开区域(警戒区)告警 
    HOVER_ZONE:         305,         // 区域徘徊告警 
    OVER_FENCE:         306,         // 翻越围栏告警 
    CARE_ARTICLE:       307,         // 物品看护告警 
    REMAIN_ARTICLE:     308,         // 物品遗留告警 
    GATHER:             309,         // 人员聚集告警 
    FAST_MOVE:          310,         // 快速移动告警 
    CAR_STOP:           311,         // 停车告警 
    OUT_FOCUS:          312,         // 虚焦告警 
    OUT_FOCUS_RESUME:   313,         // 虚焦告警恢复 
    SCENCE_CHANGE:      314,         // 场景变更告警  
    FACE_DETECT:        315,         // 人脸检测告警 
    ROAD_DETECT:        316,        //  道路监控 
    PEOPLE_COUNT:       317,         //  人数统计
    ALARM_HEATMAP            : 319,         //热度图
    HIGH_TEMPERATURE         : 0x10001,     // 高温告警
    LOW_TEMPERATURE          : 0x10002,     // 低温告警
    MOVE_DETECT              : 0x40005,     // 运动检测告警
    MASK_DETECT              : 0x40007,     // 遮挡侦测告警
    INPUT_SWITCH             : 0x40009,     // 输入开关量告警
    AUDIO_DETECT             : 0x4000F,     // 声音检测告警
    MOTION_DETECT_AREA1      : 0x40012,     // 区域一运动跟踪告警 
    MOTION_DETECT_AREA2      : 0x40013,     // 区域二运动跟踪告警 
    MOTION_DETECT_AREA3      : 0x40014,     // 区域三运动跟踪告警 
    MOTION_DETECT_AREA4      : 0x40015,     // 区域四运动跟踪告警 
    MOTION_DETECT_LINE       : 0x40016,     // 拌线运动检测告警 

    INVALID                  : 0xFFFFF
};

//布防计划类型
var PlanType = {
    MOVE_DETECT:        0,      // 运动检测计划
    INPUT_SWITCH:       1,      // 开关量输入计划
    CRUISE:             2,      // 巡航计划
    STOR:               3,      // 存储计划
    SCENE_SWITCH:       4,      // 场景自动切换命令字
    AUDIO_DETECT:       5,      // 声音检测计划
    TAMPER_DETECT:      6,      // 遮挡检测计划
    TRIPWIRE:           7,      // 拌线检测计划
    AREA_IN:            8,      // 进入区域计划
    AREA_OUT:           9,      // 离开区域计划
    AREA_STAY:          10,     // 区域入侵计划
    ABANDON:            11,     // 物品遗留计划
    THEFT:              12,     // 物品盗移计划
    WANDER:             13,     // 徘徊检测计划
    FASTMOVE:           14,     // 快速移动计划
    STOPCAR:            15,     // 停车检测计划
    GATHER:             16,     // 聚集检测计划
    SCENE_CHANGE:       17,     // 场景变更计划
    FACE:               18,     // 人脸检测计划
    MOVE_DETECT_LINE:   19,     // 拌线运动检测计划
    ROAD_DETECT:        20,     // 道路监控计划
    PEOPLE_CNT:         21,     // 人数统计计划 
    HEATMAP:            22,                             // 热力图工作计划
    INVALID: 0xFFFF
};

//存储类型
var StorType = {
    SD: 0,                                  // SD卡
    NAS: 1,                                 // NAS

    INVALID: 0xFFFF
};

//登录类型
var LoginType = {
    WEB_LOGIN: 0,                // WEB 页面登录
    EZS_LOGIN: 1,                // EZS 跳转登录
    VM_LOGIN: 2,                 // VM 跳转登录
    DDNS_LOGIN: 3                // MYCLOUD 跳转登录
};

//快门状态
var shutterUnit =
{
    us: 0,
    reciprocal_s:  1
};

//激光控制类型
var LaserCtrlType =
{
    LASER_CTRL_REBOOT: 17,    /**< 激光重启 */
    LASER_CTRL_RESTORE: 18    /**< 激光恢复默认配置 */
};

//皮肤风格类型
var SkinStyle = {
    White: 0,                   //白
    Black: 1,                   //黑
    Gray: 2                     //灰
};

//保活错误码
var KeepLiveResult = {
    USER_KEEPALIVEFAIL: 461         // SDK保活
};

//矩形边框大小
var RimRect = {
    MIN_WIDTH:    0,           //最小宽度
    MAX_WIDTH:    93,          //最大宽度
    MIN_HEIGHT: 0,             //最小高度
    MAX_HEIGHT: 93             //最大高度
};

//智能区域类型
var IntelAreaType = {
    PLATE: 0,                 // 车牌识别
    TW: 1,                    // 绊线
    TRAFFICLIGHT: 2,          // 交通灯
    TRACK: 3,                 // 跟踪区域
    GROUND: 4,                // 路面标定
    VEHICLEDETECT: 5,         // 车辆检测
    TRIGGERLINE: 6,           // 触发线
    STOPLINE: 7,              // 停止线
    STRAIGHTLINE: 8,          // 直行触发线
    LEFTLINE: 9,              // 左转触发线
    RIGHTLINE: 10,            // 右转触发线
    DRIVEWAYLINE: 11,         // 车道线
    LEAVELINE: 12,            // 直行离开触发线
    ILLEAGLLEFTTURNLINE: 13,  // 违章调头线
    VIRTUALLINE: 14           // 虚拟线圈
};

//文件类型列表
var FileTypeList = ["tgz","zip","pem"];

//文件类型
var FileType = {
    TGZ: 0,         //TGZ
    ZIP: 1,         //ZIP
    PEM: 2          //PEM
};

//场景类型状态
var sceneConditionType =
{
    ILLUMINATION: 0,  //照度
    CONDITION_TILT: 1 //云台垂直角度
};

/**@brief WiFi加密方式 */
var WIFI_ENCRYPT_TYPE =
{
    NONE:          0,   /**< NONE */
    WEP:           1,   /**< WEP */
    TKIP:          2,   /**< TKIP */
    AES:           3,   /**< AES */
    TKIPAES:       4,   /**< TKIPAES */
    UNKNOW:        5    /**< UNKNOW */
};

/**@brief WiFi工作模式 */
var WIFI_NETWORK_TYPE=
{
    INFRA:          0,    /**< InfraStructure */
    ADHOC:          1     /**< AdHoc */
};

// WiFi连接状态
var WiFiLinkStatus = {
    DISCONNECT: 0,       // 未连接
    CONNECT: 1          // 连接
};


/**
 * 编码能力集是否满足开新流的结果
 */
var EncodeRetCode = {
    Successed: 0,        //成功
    Close: 1,            //关闭
    Disable: 2           //否
};

/**
 * 用户类型
 */
var UserType = {
    Administrator: 0,       //管理员
    Operator: 1             //用户
};


/**
 * 串口模式类型
 */
var SerialMode = {
    PTZ:                    1,            // 云台控制
    TRANS:                  2,            // 透明通道
    CONSOLE:                3,            // 控制台
    COMMON:                 4,            // 通用串口
    VEHICLE_DETECTOR_H:     5,            // 车检器 H
    VEHICLE_DETECTOR_S:     6,            // 车检器 S
    RADAR_C:                7,            // 雷达 C
    LASER:                  8,            // 激光
    CASEALARM:              9,            // 机箱告警
    TRAFFICLIGHT:           10,           // 红灯信号检测器 S
    RADAR_A:                11,           // 雷达 A
    OSDLAYOUT:              12,           // 输出OSD
    RADAR_H:                13,           // 雷达 H
    VEHICLE_DETECTOR_Q:     14,           // 车检器 Q
    RADAR_C_CONTROLLER:     15,           // 雷达 C控制器
    LOCALPTZ:               16,           // 本地云台控制
    RFID:                   17,           // RFID
    VEHICLE_DETECTOR_U:     18,           // 车检器 U
    TRAFFICLIGHT_U:         19,           // 红灯信号检测器 U
    RADAR_W:                20,           // 雷达 W
    RADAR_Z:                21,           // 雷达 Z
    SWITCHVALUE_TO_485:     22,           // 外设开关量转485
    TRAFFICLIGHT_Q:         23,           // 泉视通红灯检测器
    RADAR_H2:               24,           // 雷达 H2
    TRAFFICLIGHT_Y:         25,           // 红灯信号检测器 Y
    RADAR_AD:               26,           // 雷达 AD
    RADAR_A2:               27,           // 雷达 A2
    TRAFFICLIGHT_CONTROLLER:28,           // 信号控制机
    WEIGHING_XK:            29,           // 称重控制器XK3190
    WEIGHING_DS:            30,           // 称重控制器DS822_D6P
    RADAR_LD:               31,           // 雷达 LD
    ONVIF_TRANS:            32,           // Onvif 透明通道
    VEHICLE_DETECTOR_X:     33,           // 翔讯车检器
    TRAFFICLIGHT_B:         34,           // 博远红灯检测器
    TRAFFICLIGHT_NET:       35,           // 网口信号灯检测器
    RADAR_S:                36,           // 雷达 S
    VEHICLE_DETECTOR_H2:    37,           //哈工大车检器H
    ISMode:                 38,           // 超感模式
    FS_CAPTURE:             39,           //FS抓拍机
    WEIGHING_DS1:           40,           // 称重控制器DS822_D6P_1
    SOUNDPICKUP:            41,           // 拾音器通道
    RADAR_JZ:               43,           // 雷达JZ
    RADAR_DH:               45,           // 大华雷达
    WEIGHING_YH:            46,           // 耀华地磅
    RADAR_H2S:              47,           // 雷达H2(单车道)

    INVALID:                0xFFFF
};

// 参数类型（恢复默认参数）
var ParamType = {
    OPTICS_VIDEO:           0,        // 视频的图像参数
    OPTICS_PICTURE:         1,        // 照片的图像参数
    PECCANCY:               2,        // 违章默认参数
    IOPORT:                 3         //IO Port端口默认参数 
};

// 照片接收服务器通信协议类型
var PhotoServer = {
    UNVIEW1:                0,          // 宇视1
    UNVIEW2:                1,          // 宇视2长连接
    XC:                     2,          // 先创
    QST:                    3,          // 泉视通
    FTP:                    4,          // FTP
    ZZ:                     5,          // 正直
    HIK:                    6,          // 海康
    ZT:                     7,          // 中通
    QST2:                   8,          // 泉视通2
    YJ:                     9,          // 银江
    LIYUAN:                 10,         // 立元
    XX:                     11,         // 翔讯
    KL:                     12,         // 科力
    DFWL:                   13,         // 东方网力
    QDKJ:                   14,         // 前端科技
    FH:                     15,         // 烽火
    ZK:                     16,         // 中控
    HIK2:                   17,         // 海康2
    ZD:                     18,         // 正德
    DLFTP:                  19,         // 大连ftp
    CX:                     20,         // 慈溪
    HIK2FTP:                21,         // 海康2FTP
    ADAS:                   22,         // ADAS
    KD:                     23,         // 科达
    SYHIK:                  24,         // 上虞HIK
    ZY:                     25,         // 藏愚
    LZHIK:                  26,         // 泸州海康
    ZYFTP:                  27,         // 藏愚FTP
    BK:                     28,         // 博康
    JD:                     29,         // 机电
    YJNAS:                  30,         // 银江NAS
    UNVIEW2_SHORTCONNECT:   31,         // 宇视2短连接
    CDS:                    32,         // CDS直存
    SHBK:                   33,         // 上海宝康
    SL:                     34,         // 松立
    QDKJ2:                  35,         // 前端科技老协议
    ZKTD:                   37,         // 中科通达
    LISHUI:                 38,         // 丽水
    JINPENG:                39,         // 金鹏
    LANGXIN:                40,         // 朗新
    HIKTCP:                 41,         // 海康tcp短连接
    LIYUAN_WEBSERVER:       43,         // 立元Webserver
    SLFTP:                  44,         // 松立FTP
    TDWY:                   46,         // 天地伟业

    INVALID:                0xFFFF
};

/**
 * 智能分析类型
 */
var IVAMode = {
    PERIMETER:              0,          // 周界防范智能
    ILLEGAL:                1,          // 违章智能
    COMMON:                 2,          // 智能枪通用模式（含周界及人员卡口）
    TG:                     3,          // 智能枪低速卡口模式

    INVALID:                0xFFFF
};

/**
 * 智能枪通用模式
 */
var IVACommonMode = {
    PERIMETER:              0,          // 周界
    KAKOU:                  1,          // 人员卡口
    PC:                     2,          // 人数统计
    HEATMAP:                3,          // 热度图
    INVALID:                0xFFFF
};
/**
 * 智能设备类型（按芯片区分）
 */
var IVADeviceMode = {
    HISI:              0,          // 海思智能
    TI:                1,          // 通用智能（智能枪球）
    TG:                2,          // 卡口
    EP:                3,          // 电警
    PARK:              4,          // 停车场
    SMART:             5,          // SMART IPC
    UCPT:              6,          // 智能枪泛卡口
    TWCPT:             7,          //天网卡口
    INVALID:                0xFFFF
};

/**
 * 目标尺寸过滤方式
 */
var IVAFilterMode = {
    NONE:                   0,          // 无过滤尺寸
    SINGLE:                 1,          // 过滤尺寸类型为单景深
    MULTI:                  2,          // 过滤尺寸类型为多景深

    INVALID:                0xFFFF
};

/**
 * 规则类型
 */
var IVARuleType = {
    PICKET_LINE:            0x001,      // 警戒线
    PICKET_AREA:            0x002,      // 进入/离开区域(警戒区)
    AREA_STAY:              0x004,      // 区域入侵
    OBJECT_STATUS:          0x008,      // 物品状态看护
    ILLEGAL_PRESSLINE:      0x010,      // 违章压线
    ILLEGAL_RETROGRADE:     0x020,      // 违章逆行
    FACE_DETECT:            0x0040,     // 人脸检测 
    ILLEGAL_PARKING:        0x100,      // 违章停车
    OUT_FOCUS:              0x0400,     // 失焦侦测 
    SCENE_CHANGE:           0x0800,     // 场景变更侦测 
    WANDER:                 0x1000,     //< 徘徊检测 */
    GATHER:                 0x2000,     //*< 聚集检测 */
    FAST_MOVE:              0x4000,     //*< 快速移动检测 */
    PEOPLE_COUNT:           0x8000,     //**< 人数统计检测 */
    PARKING:                0x0200,     // 停车检测
    INVALID:                0xFFFF
};

/**
 * 规则触发方向
 */
var IVATriggerDirection = {
    NONE:                   0,          //无方向
    DEASIL:                 1,          // 警戒线: 顺时针
    ANTICLOCKWISE:          2,          // 警戒线: 逆时针

    ENTRY:                  3,          // 区域: 进入
    QUIT:                   4,          // 区域: 离开
    ABANDON:                5,          // 物品状态: 遗留
    THEFT:                  6,          // 物品状态: 盗取

    INVALID:                0xFFFF
};

/**
 * 违章场景标定框类型
 */
var IVAMarkType = {
    PRESS_LINE:             0x001,      // 车道线
    PLATE_SIZE:             0x002,      // 车牌框

    INVALID:                0xFFFF
};

/**
 * 图形类型
 */
var DrawType = {
    LINE:                   0,          // 直线
    LINE_ARROW:             1,          // 带方向箭头的直线
    RECT:                   2,          // 矩形
    RECT_ARROW:             3,          // 带方向箭头的矩形
    POLYGON:                4,          // 多边形
    POLYGON_ARROW:          5,          // 带方向箭头的多边形
    CONCENTRIC:             6,          // 同心矩形
    POINT:                  7,          // 点
    TITLE:                  8,          // 只能移动的矩形
    RECT_ZOOM:              9,          // 数字放大的矩形
    EN_DRAW_LINE_ARROW_VERNIER: 10,     //客流量的线段
    RECT_DIAMOND:           11,         // 宏块

    INVALID:                0xFFFF
};

//文字对齐排列方式
var FontAlign = {
    TOP:                0,              //上对齐
    MIDDLE:             1,              //中部对齐
    BOTTOM:             2,              //底部对齐
    LEFT:               3,              //左对齐
    CENTER:             4,              //中心对齐
    RIGHT:              5,              //右对齐
    OUT:                6
};

//设备连接阻塞原因类型
var BlockType = {
    UPDATE:                 0,          // 升级
    REBOOT:                 1,          // 业务操作重启(重启设备，导入配置)
    UNCONNECTED:            2,          // 断网
    IPCHANGE:               3,          // IP变更
    PRODUCT_SWITCH:         4,          // 产品形态切换
    RELOGIN:                5,          //重新登录
    CUSTOM_UPDATE:          6,          //定制包升级

    INVALID:                0xFFFF
};

//车位状态
var ParkDetstaus = {
    Disable: 0,      //无车位
    Enable: 1,       //有车位
    INVALID: 2       //车位无效
};

//违章类型
var peccancyMap = {
        1: "rushLight",                     //闯红灯
        2: "pinline",                       //压线
        3: "remotePlate",                   //异地拍照
        4: "offside",                       //越线（违章变道）
        5: "noFastenSeatBelts",             //不系安全带
        6: "driveTelPhone",                 //开车打电话
        8: "wallop",                        //未按车道行驶
        9: "illicitlyblackList",            //黑名单违章
        16: "illicitlyTurnLeft",            //违章左转
        32: "illicitlyTurnRight",           //违章右转
        64: "converse",                     //逆行
        128: "overspeed",                   //超速
        129: "over20percentminspeed",       //低速20%以上
        130: "under20percentminspeed",      //低速20%以下
        256: "trunRound",                   //违章掉头
        512: "stopGreenLight",              //绿灯停车
        1024: "accommodationRoad",          //专用车道
        2048: "illicitlyPark",              //违章停车
        4096: "illicitlyStraight",          //违章直行
        8192: "backCar",                    //倒车
        16384: "overspeed_50",              //超速50%
        32768: "pinline_doubleYellow",      //压双黄线
        65536: "pinline_yellow",            //压单黄线
        131072: "pinline_stop",             //压停车线
        262144: "overspeed_20",             //超速20%
        524288: "overspeed_100",            //超速100%
        1048576: "rushLight2",              //闯红灯停车
        16777216: "overspeed_10",           //超速10%
        33554432: "overspeed_30",           //超速30%
        67108864: "overspeed_40",           //超速40%
        134217728: "overspeed_60",          //超速60%
        268435456: "overspeed_70",          //超速70%
        536870912: "overspeed_80",          //超速80%
        1073741824: "overspeed_90"          //超速90%
};

//智能球违章类型
var peccancyIllegalIVAMap = {
    16: "pinline_IllegalIVA",                          //违章压线
    32: "converse_IllegalIVA",                         //违章逆行
    256: "illicitlyPark_IllegalIVA"                    //违章停车
};

//车位半球消息码
var CarPortCheck = {
    NO_ERROR:           0x00000000,      // 无错误
    SN_ERROR_SMALL:     0x0000000D,      // 区域过小
    SN_ERROR_BIG:       0x0000000E,      // 区域过大
    SN_ERROR_5SIDE:     0x00000010       // 车辆检测区域应为五边形
};

//电警消息码
var IntelAreaCheck = {
    NO_ERROR:           0x00000000,      // 卡口/电警：无错误
    SN_ERROR_SN3LY:     0x00000001,      // 电警：左转抓拍线头尾的Y坐标相等
    SN_ERROR_SN3RY:     0x00000002,      // 电警：右转抓拍线头尾的Y坐标相等
    SN_ERROR_SN3LR:     0x00000004,      // 电警：左转抓拍线在右转抓拍线右侧，错误ID为0
    SN_ERROR_SN2X:      0x00000008,      // 电警：停止线头尾X坐标相等
    SN_ERROR_SN3X:      0x00000010,      // 电警：直行第三张证据图触发线头尾X坐标相等
    SN_ERROR_SN4X:      0x00000020,      // 电警：直行离开触发线头尾X坐标相等
    SN_ERROR_SN2Y:      0x00000040,      // 电警：停止线 位于 直行第三张证据图触发线上方，错误ID为车道ID
    SN_ERROR_SN3Y:      0x00000080,      // 电警：直行第三张证据图触发线 位于 直行离开触发线上方，错误ID为0
    RW_ERROR_RWLINE:    0x10000001,      // 卡口/电警：车道线头尾Y坐标相等
    RW_ERROR_CROSS:     0x10000002,      // 卡口：相邻车道线在检测区域外无交点，错误ID为车道ID；电警：相邻车道线不相交，错误ID为车道ID
    AREA_ERROR_PL:      0x20000001,      // 车牌标定区域过大或过小：电警要求宽度在50~300像素内；卡口要求宽度在30~600像素内，高度10~400像素内
    AREA_ERROR_DET_S:   0x20000002,      // 卡口：车辆检测区域过小：宽或高小于车牌标定宽度的3倍
    AREA_ERROR_DET_B:   0x20000003,       // 卡口：车辆检测区域过大：高度超过图像高度的一半
    EP_CHK_MALLOC_ERR:          0x40000001,  // 电警：初始化时申请内存错误
    EP_CHK_INPUT_POINTER_ERR:   0x40000002,  // 电警：初始化时输入指针错误
    EP_CHK_DDR_MEM_ERR:         0x40000004,  // 电警：初始化时DDR内存相关变量错误
    EP_CHK_L2_MEM_ERR:          0x40000008,  // 电警：初始化时输入的L2内存相关变量错误
    EP_CHK_ORI_IMG_SIZE_ERR:    0x40000010,  // 电警：初始化时输入的原始图像大小异常
    EP_CHK_MARKED_LP_SIZE_ERR:  0x40000020,  // 电警：初始化时配置的标定车牌的宽度异常
    EP_CHK_MARKED_LP_POSY_ERR:  0x40000040,  // 电警：初始化时配置的标定车牌的Y位置错误
    EP_CHK_MODIFY_LP_AREA_ERR:  0x40000080,  // 电警：初始化时内部车牌大小修正异常
    EP_CHK_ROADWAY_NUM_ERR:     0x40000100,  // 电警：初始化时输入的车道数目错误
    EP_CHK_ROADWAY_LINE_ERR:    0x40000200,  // 电警：初始化时配置的车道线坐标错误  
    EP_CHK_ROADWAY_LINE_ORDER_ERR: 0x40000400,//电警：初始化时输入的车道线顺序错误
    EP_CHK_SN2_LINE_ERR:        0x40000800,  // 电警：初始化时配置的停车线坐标错误
    EP_CHK_STR_SN_LINE_ERR:     0x40001000,  // 电警：初始化时配置的直行触发线坐标错误
    EP_CHK_L_OR_R_SN_LINE_ERR:  0x40002000,  // 电警：初始化时配置的左右触发线坐标错误
    EP_CHK_CAMARA_PARAM_ERR:    0x40004000,  // 电警：初始化时配置的工程参数错误
    EP_CHK_ALERT_LINE_ERR:      0x40008000,  // 电警：初始化时内部车辆捕获拌线计算错误
    EP_CHK_TL_GRP_NUM_ERR:      0x40010000,  // 电警：初始化时输入的灯组个数错误
    EP_CHK_TL_GRP_AREA_ERR:     0x40020000,  // 电警：初始化时输入的灯组坐标错误
    EP_CHK_TL_LIGHT_NUM_ERR:    0x40040000,  // 电警：初始化时配置的灯眼个数错误
    EP_CHK_TL_GRP_RATIO_ERR:    0x40080000,  // 电警：初始化时内部计算灯组方向错误
    EP_CHK_TL_LIGHT_PIXEL_ERR:  0x40100000,  // 电警：初始化时配置的灯眼过小
    EP_CHK_TL_PROP_ERR:         0x40200000,  // 电警：初始化时配置的灯组属性异常
    EP_CHK_TL_IO_ERR:           0x40400000,  // 电警：初始化时配置的检测器IO错误
    EP_CHK_TL_GRP_CUT_ERR:      0x40800000,  // 电警：初始化时内部灯组分割失败
    EP_CHK_TL_PARAM_ERR:        0x41000000,  // 电警：初始化时配置的红绿灯参数错误
    EP_CHK_DETECTAREA_ERR:      0x42000000   // 电警：初始化时车辆检测区域错误
};

//卡口消息码
var IntelAreaCheck_cap = {
    TW_CHK_INPUT_POINTER_ERR:             0x30000001,   // 卡口：智能初始化失败
    TW_CHK_DDR_MEM_ERR:                   0x30000002,   // 卡口：智能初始化失败
    TW_CHK_L2_MEM_ERR:                    0x30000004,   // 卡口：智能初始化失败
    TW_CHK_IMGSIZE_ERR:                   0x30000008,   // 卡口：智能初始化失败
    TW_CHK_LP_WIDTH_ERR:                  0x30000010,   // 卡口：初始化时输入的标定车牌的宽度异常
    TW_CHK_LP_HEIGHT_ERR:                 0x30000020,   // 卡口：初始化时输入的标定车牌的高度异常
    TW_CHK_LP_MARK_ERR:                   0x30000040,   // 卡口：初始化时修正的车牌大小异常
    TW_CHK_ROADWAY_NUM_ERR:               0x30000080,   // 卡口：初始化时输入的车道数目错误
    TW_CHK_MARKED_LP_INPUT_ERR:           0x30000100,   // 卡口：智能初始化失败
    TW_CHK_ROADWAY_LINE_COORD_ERR:        0x30000200,   // 卡口：智能初始化失败
    TW_CHK_ROADWAY_LINE_ORDEA_ERR:        0x30000400,   // 卡口：检查车道线信息数组内是否按从左至右的顺序存放车道线信息，如果不按顺序，则初始化不成功，返回错误
    TW_CHK_ROADWAY_LINE_CROSS_AWAY_ERR:   0x30000800,   // 卡口：未按实际车道线绘制
    TW_CHK_ROADWAY_LINE_PARA_ERR:         0x30001000,   // 卡口：未按实际车道线绘制
    TW_CHK_ROADWAY_CROSSY_ERR:            0x30002000,   // 卡口：未按实际车道线绘制
    TW_CHK_MANUAL_DETAREA_INPUT_ERR:      0x30004000,   // 卡口：检测区域校验失败
    TW_CHK_AUTO_DETAREA_INPUT_ERR:        0x30008000,   // 卡口：检测区域校验失败
    TW_CHK_DETAREA_ERR:                   0x30010000,   // 卡口：检测区域校验失败
    TW_CHK_CAMERA_PARAM_ERR:              0x30020000,   // 卡口：工程参数异常，确认是否满足：焦距8~50mm 路面距离10~50m 杆高5~7m
    TW_CHK_DIST_CCD2LEN_ERR:              0x30040000,   // 卡口：初始化时输入相机和靶面距离过小
    TW_CHK_CAMERA_ANGLE_ERR:              0x30080000,   // 卡口：初始化时输入的相机和地面垂线夹角错误
    TW_CHK_CAP_TYPE_ERR:                  0x30100000,   // 卡口：车道抓拍类型错误
    TW_CHK_DOWNSIZE_DETAREA_ERR:          0x30200000,   // 卡口：检测区域校验失败
    TW_CHK_DOWNSCALE_ERR:                 0x30400000,   // 卡口：图像降采样倍率错误
    TW_CHK_ROADWAY_LINE_CROSS_ON_ERR:     0x30800000,   // 卡口：未按实际车道线绘制
    TW_CHK_ROADWAY_LINE_CROSS_OFF_ERR:    0x31000000,   // 卡口：未按实际车道线绘制
    TW_CHK_XX_ERR_RESERVED_3:             0x32000000,   // 卡口：触发线校验失败
    TW_CHK_AREADECT_ERROR:                0x34000000,   // 流量机：虚拟线框校验失败
    TW_CHK_LENGTHDECT_ERROR:              0x38000000    // 流量机：排队长度检测区域校验失败
};

//违法停车手动取证执行状态码
var IVAManualSnapErr = {
    ILLEGAL_MANUAL_SNAP_START:    327,          /**< 违法停车手动取证开始 */
    ILLEGAL_MANUAL_SNAP_OVER:     328,          /**< 违法停车手动取证结束 */
    MANUAL_SNAP_PTZ_MOVING:       509,          /**< 违法停车手动取证配置下发时球机运动中，配置下发无效 */
    MANUAL_SNAP_OBJ_MAX_FULL:     330,          /**< 违法停车手动取证配置下发最大支持目标数已满，配置下发无效 */
    WORK_MODE_NOT_SUPPORT:        508           /**< 违法停车手动取证配置下发时工作模式不支持，配置下发无效*/
};

//版本类型
var VersionType = {
    NONE:   0,  // 行业
    IN:     1,  // 海外
    DT:     2,  // 分销
    PRJ:    3   // 工程商
};

// 支持的语种列表
var supportLangList = [
   {
       langName: "简体中文",            //简体中文
       fileName: "zh_lang.js",
       dateFileName:"zh-cn"
   },
   {
       langName: "English",            //英语
       fileName: "en_lang.js",
       dateFileName:"en"
   },
   {
       langName: "繁体中文",           //繁体中文
       fileName: "cht_lang.js",
       dateFileName:"cht"
       
   },
   {
       langName: "Français",           //法语
       fileName: "fra_lang.js",
       dateFileName:"fra"
   },
   {
       langName: "Deutsch",           //德语
       fileName: "deu_lang.js",
       dateFileName:"deu"
   },
   {
       langName: "Español",           //西班牙语
       fileName: "esp_lang.js",
       dateFileName:"esp"
   },
   {
       langName: "Italiano",          //意大利语
       fileName: "ita_lang.js",
       dateFileName:"ita"
   },
   {
       langName: "Português",         //葡萄牙语
       fileName: "ptg_lang.js",
       dateFileName:"ptg"
   },
   {
       langName: "Pусский",           //俄文
       fileName: "rus_lang.js",
       dateFileName:"rus"
   },
   {
       langName: "Український",       //乌克兰语
       fileName: "ukr_lang.js",
       dateFileName:"ukr"
   },
   {
       langName: "ქართული",         //格鲁尼亚语
       fileName: "geo_lang.js",
       dateFileName:"geo"
   },
   {
       langName: "Nederlands",        //荷兰语
       fileName: "dut_lang.js",
       dateFileName:"dut"
   },
   {
       langName: "Dansk",            //丹麦语
       fileName: "dan_lang.js",
       dateFileName:"dan"
   },
   {
       langName: "Suomi",            //芬兰语
       fileName: "fin_lang.js",
       dateFileName:"fin"
   },
   {
       langName: "Svenska",          //瑞典语
       fileName: "sve_lang.js",
       dateFileName:"sve"
   },
   {
       langName: "Norsk bokmål",     //挪威语
       fileName: "nor_lang.js",
       dateFileName:"nor"
   },
   {
       langName: "Icelandic",        //冰岛语
       fileName: "ice_lang.js",
       dateFileName:"ice"
   },
   {
       langName: "Polski",           //波兰语
       fileName: "pol_lang.js",
       dateFileName:"pol"
   },
   {
       langName: "Lietuvos",        //立陶宛语
       fileName: "lit_lang.js",
       dateFileName:"lit"
   },
   {
       langName: "Eλληνικά",        //希腊语
       fileName: "gre_lang.js",
       dateFileName:"gre"
   },
   {
       langName: "Čeština",         //捷克语
       fileName: "cze_lang.js",
       dateFileName:"cze"
   },
   {
       langName: "Slovenčina",      //斯洛伐克语
       fileName: "slk_lang.js",
       dateFileName:"slk"
   },
   {
       langName: "Magyar",          //匈牙利语
       fileName: "hun_lang.js",
       dateFileName:"hun"
   },
   {
       langName: "Românǎ",          //罗马语
       fileName: "rom_lang.js",
       dateFileName:"rom"
   },
   {
       langName: "Cрпски",          //塞尔维亚语
       fileName: "ser_lang.js",
       dateFileName:"ser"
   },
   {
       langName: "Hrvatski",        //克罗地亚语
       fileName: "cro_lang.js",
       dateFileName:"cro"
   },
   {
       langName: "Slovenščina",     //斯洛文尼亚语
       fileName: "slv_lang.js",
       dateFileName:"slv"
   },
   {
       langName: "български",       //保加利亚语
       fileName: "bul_lang.js",
       dateFileName:"bul"
   },
   {
       langName: "македонски",      //白俄罗斯语
       fileName: "mac_lang.js",
       dateFileName:"mac"
   },
   {
       langName: "Türkçe",          //土耳其语
       fileName: "trk_lang.js",
       dateFileName:"trk"
   },
   {
       langName: "العربية",        //阿拉伯语
       fileName: "ara_lang.js",
       dateFileName:"ara"
   },
   {
       langName: "עברית",           //希伯来语
       fileName: "heb_lang.js",
       dateFileName:"heb"
   },
   {
       langName: "हिंदी",              //印度语
       fileName: "hid_lang.js",
       dateFileName:"hid"
   },
   {
       langName: "বাংলা ভাষা",         //孟加拉语
       fileName: "ben_lang.js",
       dateFileName:"ben"
   },
   {
       langName: "فارسی",            //波斯语
       fileName: "pes_lang.js",
       dateFileName:"pes"
   },
   {
       langName: "日本語",            //日语
       fileName: "jpnz_lang.js",
       dateFileName:"jpnz"
   },
   {
       langName: "한국어",             //韩语
       fileName: "kor_lang.js",
       dateFileName:"kor"
   },
   {
       langName: "ไทย",               //泰语
       fileName: "tha_lang.js",
       dateFileName:"tha"
   },
   {
       langName: "Melayu",            //马来西亚语
       fileName: "mal_lang.js",
       dateFileName:"mal"
   },
   {
       langName: "Indonesian",        //印度尼西亚语
       fileName: "idn_lang.js",
       dateFileName:"idn"
   },
   {
       langName: "Pilipino",          //菲律宾语
       fileName: "fil_lang.js",
       dateFileName:"fil"
   },
   {
       langName: "ລາວ",               //老挝语
       fileName: "lao_lang.js",
       dateFileName:"lao"
   },
   {
       langName: "tiếng Việt",         //越南语
       fileName: "vie_lang.js",
       dateFileName:"vie"
   },
   {
       langName: "Монгол улсын",       //蒙古国语
       fileName: "mog_lang.js",
       dateFileName:"mog"
   },
   {
       langName: "Shqiptar",           //阿尔巴尼亚语
       fileName: "alb_lang.js",
       dateFileName:"alb"
   },
   {
       langName: "Azərbaycan",         //阿塞拜疆语
       fileName: "azb_lang.js",
       dateFileName:"azb"
   },
   {
       langName: "Irish",              //盖尔语
       fileName: "iri_lang.js",
       dateFileName:"iri"
   },
   {
       langName: "Eesti",              //爱沙尼亚语
       fileName: "est_lang.js",
       dateFileName:"est"
   },
   {
       langName: "Bosanski",           //波斯尼亚语
       fileName: "bos_lang.js",
       dateFileName:"bos"
   },
   {
       langName: "Boole taal",         //低地撒克逊语
       fileName: "afr_lang.js",
       dateFileName:"afr"
   },
   {
       langName: "Latina",             //秘鲁语
       fileName: "lat_lang.js",
       dateFileName:"lat"
   },
   {
       langName: "Latvijas",           //拉脱维亚语
       fileName: "ltv_lang.js",
       dateFileName:"ltv"
   }
];

//传感器状态
var SensorStatus = {
    INTELLISENSE_STATUS_UNUSED: 0,
    /**< 未使用 */
    INTELLISENSE_STATUS_ONLINE: 1,
    /**< 在线 */
    INTELLISENSE_STATUS_OFFLINE: 2, //**< 离线 */
    INTELLISENSE_STATUS_LOW_POWER: 3 /**< 低电 */
};

var PearlEyeLiveMode = {
    PearlEye:                   1,      // 鱼眼 实时
    Full:                       2,      // 全景 实时
    PTZ4:                       3,      // PTZ1\2\3\4 实时
    PearlEye_Full_3PTZ:         11,     // 鱼眼+全景+PTZ1\2\3 非实时
    PearlEye_4PTZ:              12,     // 鱼眼+PTZ1\2\3\4 非实时
    Full_4PTZ:                  13      // 全景+PTZ1\2\3\4 非实时
};

var LAPI_URL = {
    LoginCfg: "/LAPI/V1.0/Channel/0/System/Login",                                          //用户登录
    Users_Cfg: "/LAPI/V1.0/Channel/0/System/Users",                                        // 获取/设置/删除 用户配置
    DST_Cfg: "/LAPI/V1.0/System/DST",                                                      //获取/设置 夏令时参数
    NTPServer: "/LAPI/V1.0/System/NTPServer",                                              // 获取/设置 NTP配置
    PearlEyeCommonCfg: "/LAPI/V1.0/System/PearlEyeCommonCfg",                              //获取/设置鱼眼通用配置
    LAPI_DiagnosisInfo: "/LAPI/V1.0/System/DiagnosisInfoURL",                               //诊断信息
    ConfigurationInfoURL: "/LAPI/V1.0/System/ConfigurationInfoURL",                        //获取配置文件路径
    ConfigurationInfo: "/LAPI/V1.0/System/ConfigurationInfo/",                             //导入配置
    LAPI_DebugSwitch: "/LAPI/V1.0/Channel/0/Image/DebugSwitch",                            //收集图像调试信息
    LAPI_LensType: "/LAPI/V1.0/Channel/0/Image/LensType",                                   //ABF镜头
    LAPI_Reboot: "/LAPI/V1.0/System/Reboot",                                               // 设备重启
    UpdateStatus: "/LAPI/V1.0/System/UpdateStatus",                                        //软件升级状态查询
    Upgrade: "/LAPI/V1.0/System/Upgrade",                                                  //升级
    UpgradeInfo: "/LAPI/V1.0/System/UpgradeInfo",                                          //升级状态查询
    UploadFirmware: "/LAPI/V1.0/System/UploadFirmware",                                    //软件升级
    LAPI_PTZReset: "/LAPI/V1.0/Channel/0/PTZ/PTZReset",                                    //重置云台
    LAPI_FactoryReset: "/LAPI/V1.0/System/FactoryReset",                                   // 恢复配置（0恢复默认配置，1恢复出厂设置）
    LAPI_Installation: "/LAPI/V1.0/Channel/0/System/Installation",                         //球机安装高度
    LAPI_DCOut: "/LAPI/V1.0/Channel/0/System/DCOut",                                       //电源输出配置
    LAPI_TimingTask: "/LAPI/V1.0/Channel/0/System/TimingTask",                             //获取/设置 定时任务配置
    LAPI_DeviceRunInfo: "/LAPI/V1.0/System/DeviceRunInfo",                                 // 获取 设备运行信息
    LAPI_DeviceBasicInfo: "/LAPI/V1.0/System/DeviceBasicInfo",                             // 获取 设备基本信息
    LAPI_LocalTime: "/LAPI/V1.0/System/TimePrivate/LocalTime",                                              // 设置/获取系统时间(含时区信息)
    LAPI_ManagerServerInfo: "/LAPI/V1.0/Channel/0/System/DeviceStatus/ManagerServer",      // 获取服务器信息
    LAPI_BMServer: "/LAPI/V1.0/System/BMServer",                                           // 获取/设置 BM配置
    LAPI_PhotoServer: "/LAPI/V1.0/Channel/0/System/DeviceStatus/PhotoServer",              //获取照片服务器信息
    PhotoServer: "/LAPI/V1.0/Channel/0/System/PhotoServer",                                // 设置/获取 照片接收服务器信息
    LAPI_SD: "/LAPI/V1.0/Channel/0/System/DeviceStatus/SD",                                //获取sd卡状态信息
    LAPI_BatteryInfo: "/LAPI/V1.0/System/BatteryInfo",                                      //获取电量信息
    LAPI_ManageServer: "/LAPI/V1.0/System/ManageServer",                                    //获取/配置 管理服务器
    Orientation: "/LAPI/V1.0/Channel/0/Media/Orientation",                                   //方位标定
    ZoomLimitSwitch: "/LAPI/V1.0/Image/FocalLimit",                                         // 焦段限制开关
    Fan: "/LAPI/V1.0/System/FanCtrl",                                                       //风扇控制
    SecureAccess: "/LAPI/V1.0/NetWork/SecureAccess",                                        // 安全接入开关
    AcceptanceMode: "/LAPI/V1.0/Channel/0/Demo/AcceptanceMode",                             //工程验收模式
    HideDeviceInfo: "/LAPI/V1.0/System/HideDeviceInfo",                                     //隐藏设备信息
    PTZAbsPosition: "/LAPI/V1.0/Channel/0/System/DeviceStatus/PTZAbsPosition",               // 获取云台绝对位置状态
    PTZAbsZoom: "/LAPI/V1.0/Channel/0/System/DeviceStatus/PTZAbsZoom",                       // 获取云台绝对Zoom倍数
    PtzGuardCfg: "/LAPI/V1.0/PTZ/PtzGuardCfg",                                               // 设置/获取 看守位信息
    AudioVolume: "/LAPI/V1.0/Channel/0/Alarm/AudioVolume",                                   // 获取声音告警音量信息
    SnowMode: "/LAPI/V1.0/Channel/0/System/DeviceStatus/SnowMode",                           // 获取除雪模式状态
    PTZStatus: "/LAPI/V1.0/Channel/0/System/DeviceStatus/PTZ",                               //获取云台状态
    PTZAbsoluteMove: "/LAPI/V1.0/Channel/0/PTZ/PTZCtrl",                                     // 控制云台移动
    RecordDownloadState: "/LAPI/V1.0/Channel/0/Media/RecordDownloadState",                   // 录像下载状态
    RecordDownload: "/LAPI/V1.0/Channel/0/Media/RecordDownload/",                            // 下载录像
    HttpAuth: "/LAPI/V1.0/NetWork/HttpAuth",                                                 // http鉴权
    NetworkInterfaces: "/LAPI/V1.0/Network/Interfaces/NetworkInterfaces/0",                  // 获取 / 配置网口配置
    UNP_Cfg: "/LAPI/V1.0/NetWork/UNP",                                                       // 设置/获取 UNP配置
    DNS_Cfg: "/LAPI/V1.0/NetWork/DNS",                                                       // 获取/设置 DNS参数
    Port_Cfg: "/LAPI/V1.0/NetWork/Port",                                                     //端口配置
    DDNS_Cfg: "/LAPI/V1.0/NetWork/DDNS",                                                     // DDNS配置
    FTP_Cfg: "/LAPI/V1.0/NetWork/FTP",                                                       //FTP配置
    Email_Cfg: "/LAPI/V1.0/Channel/0/NetWork/Email",                                         // 获取/设置 Email存储配置
    SNMP_Cfg: "/LAPI/V1.0/NetWork/SNMP",                                                      // 设置/获取 snmp信息
    HTTPS_Cfg: "/LAPI/V1.0/NetWork/HTTPS",                                                    // 设置/获取 https信息
    RtspAuth: "/LAPI/V1.0/NetWork/RtspAuth",                                                 // 获取/设置 RTSP认证方式配置
    RegistInfo: "/LAPI/V1.0/NetWork/RegistInfo",                                              // 获取/设置 注册信息配置
    ArpBinding: "/LAPI/V1.0/NetWork/ArpBinding",                                              // 获取/设置 静态ARP绑定
    SoftAp: "/LAPI/V1.0/NetWork/SoftAP",                                                      // SoftAp配置
    Net4G: "/LAPI/V1.0/NetWork/Net4G",                                                        //获取/设置 4G网络
    Net4GStatus: "/LAPI/V1.0/NetWork/Net4GStatus",                                            //获取/设置 4G网络状态
    DDNSDomainCheck: "/LAPI/V1.0/Channel/0/NetWork/DDNSDomainCheck",                          //DDNS域名校验
    HTTPS_SSLCERT: "/LAPI/V1.0/Network/HTTPS_SSLCERT",                                        //SSL证书上传
    IEEE8021x: "/LAPI/V1.0/NetWork/IEEE8021x",                                                //IEEE8021x配置
    Routes: "/LAPI/Network/Routes",                                                           //获取/设置 路由
    SoftAPWiFi: "/LAPI/V1.0/NetWork/SoftAPWiFi",                                              //SoftAP Wifi设置
    SSLVPN: "/LAPI/V1.0/NetWork/SSLVPN",                                                      //SSL VPN
    AreaZoomIn: "/LAPI/V1.0/Channel/0/PTZ/AreaZoomIn",                                        //3D定位放大
    AreaZoomOut: "/LAPI/V1.0/Channel/0/PTZ/AreaZoomOut",                                      //3D定位放大关闭
    VideoInMode: "/LAPI/V1.0/Channel/0/Media/VideoInMode",                                    //获取图像制式分辨率
    VideoEncode: "/LAPI/V1.0/Channel/0/Media/VideoEncode",                                    // 设置/获取 视频编码参数配置
    AudioIn: "/LAPI/V1.0/Media/Audio/Inputs",                                            // 设置/获取 音频输入参数配置
    OSD: "/LAPI/V1.0/Channel/0/Media/OSD",                                                    // 设置/获取 OSD 配置
    PrivacyMask: "/LAPI/V1.0/Channel/0/Media/PrivacyMask",                                    //获取遮盖配置信息
    Cover_OSD: "/LAPI/V1.0/Channel/0/Media/PrivacyMask/CoverOSD",                             // 获取/设置/删除 遮盖OSD配置
    OSDStyleCfg: "/LAPI/V1.0/Channel/0/Media/OSDStyle",                                       // 获取/设置 叠加OSD样式配置
    CoverOSDZooms: "/LAPI/V1.0/Channel/0/Media/CoverOSDZooms",                                // 获取/设置 遮盖OSD起始遮盖倍率
    OSD3DCoverPosition: "/LAPI/V1.0/Channel/0/PTZ/OSD3DCoverPosition",                        // 全部3D视频遮盖OSD位置
    ImportFile: "/LAPI/V1.0/Media/ImportFile",                                                //导入配置文件
    Marquee: "/LAPI/V1.0/Channel/0/Media/Marquee",                                            //获取/设置滚动OSD
    RecordSearch: "/LAPI/V1.0/Channel/0/Media/RecordSearch?Begin=",                            //查询录像
    ROI: "/LAPI/V1.0/Channel/0/Media/ROI",                                                     //区域增强
    AlarmStorage: "/LAPI/V1.0/Channel/0/Media/AlarmStorage",                                  //告警存储
    Storage: "/LAPI/V1.0/Channel/0/Media/Storage",                                            //获取/设置 存储
    SDCardSwitch: "/LAPI/Media/SDCardSwitch",                                                 //获取/设置 SD卡存储
    SDFormat: "/LAPI/V1.0/Channel/0/Media/SDFormat",                                          //SD卡格式化
    KeyFrame: "/LAPI/V1.0/Media/KeyFrame",                                                    //I帧设置
    AnalogoutFormat: "/LAPI/Media/AnalogoutFormat",                                           // 设置 / 获取模拟输出制式配置
    CaptureImage: "/LAPI/V1.0/Media/Capture",                                                 // 获取/设置 抓图
    LivingStream: "/LAPI/V1.0/Channel/0/Media/LivingStream",                                  //获取实况流URL
    RecordStream: "/LAPI/V1.0/Channel/0/Media/RecordStream",                                  //获取存储流URL
    MediaStream: "/LAPI/V1.0/Channel/0/Media/MediaStream",                                    // 设置/获取 媒体流参数配置
    StreamInfo: "/LAPI/V1.0/Channel/0/Media/MediaStream/StreamInfo/",                         // 获取 媒体流信息
    AutoSendStreams : "/LAPI/V1.0/Channel/0/Media/AutoSendStreams",                          // 获取/设置 常驻码流
    Watermark: "/LAPI/V1.0/Channel/0/Media/Watermark",                                        // 获取/设置水印配置
    FocusCfg: "/LAPI/Image/Focus/",                                                      // 设置/获取 对焦参数配置
    WhiteBalance: "/LAPI/Image/WhiteBalance",                                                 // 设置/获取 白平衡参数配置
    ImageEnhance: "/LAPI/Image/ImageEnhance",                                                 // 设置/获取 图像增强参数配置
    Exposure: "/LAPI/Image/Exposure",                                                         // 设置/获取 曝光参数配置
    ImageParamReset: "/LAPI/V1.0/Channel/0/Image/ImageParamReset",                            // 恢复图像默认配置
    ImageStable: "/LAPI/V1.0/Image/ImageStable",                                              // 获取/设置 电子防抖配置
    IrCtrl: "/LAPI/Image/IrCtrl/",                                                            //获取/设置 红外控制配置
    DefogCfg: "/LAPI/V1.0/Channel/0/Image/Defog/",                                            //获取/设置 除雾配置
    ROI: "/LAPI/V1.0/Channel/0/Media/ROI",                                                   //获取 / 设置区域增强
    LightMode: "/LAPI/Image/LightMode",                                                       //获取/设置 补光模式
    LDC: "/LAPI/V1.0/Channel/0/Image/LDC",
    LensParam: "/LAPI/V1.0/Channel/0/Image/LensParam",                                        //获取/设置 宽动态
    DefaultScene: "/LAPI/V1.0/Channel/0/Image/DefaultScene",                                  //默认场景设置
    SceneIndex: "/LAPI/V1.0/Channel/0/Image/Scene?Index=",                                    //场景设置
    CurrentScene: "/LAPI/V1.0/Channel/0/Image/CurrentScene",                                  //获取/设置当前场景
    SceneEnvironment: "/LAPI/V1.0/Channel/0/Image/SceneEnvironment?Type=",                    //获取当前某项环境参数
    SceneAutoSwitch: "/LAPI/V1.0/Channel/0/Image/SceneAutoSwitch",                            //获取/设置 自动场景
    MotionDetectType: "/LAPI/V1.0/Alarm/MotionDetectType",                                    // 设置/获取 运动检测配置信息
    MotionDiamondDetect: "/LAPI/V1.0/Alarm/MotionDiamondDetect",                              // 设置/获取 运动检测配置信息
    MotionDetect: "/LAPI/V1.0/Alarm/MotionDetect",                                            // 设置/获取 运动检测配置信息
    MotionDetectLink: "/LAPI/V1.0/Alarm/MotionDetectLink",                                    //设置 / 获取运动检测告警联动配置信息
    MotionActivity: "/LAPI/V1.0/Alarm/MotionActivity/Areas",                                  // 设置 / 获取运动检测运动量
    MotionInterval: "/LAPI/V1.0/Alarm/MotionInterval",                                        // 获取/设置 运动检测告警上报抑制时间以及告警恢复上报间隔时间
    AudioDetect: "/LAPI/V1.0/Alarm/AudioDetect",                                              // 获取 / 设置 声音检测告警配置信息
    AudioDetectLink: "/LAPI/V1.0/Alarm/AudioDetectLink",                                      // 设置 / 获取声音检测告警联动配置信息
    TamperDetect: "/LAPI/V1.0/Channel/0/Alarm/TamperDetect/TamperDetectParam/0",              // 设置/获取 遮挡检测配置
    TamperDetectLink: "/LAPI/V1.0/Alarm/TamperDetectLink",                                    // 设置 / 获取遮挡检测告警联动配置信息
    LowTemperatureDetectLink: "/LAPI/V1.0/Alarm/LowTemperatureDetectLink",                    // 设置 / 获取低温告警联动配置信息
    HighTemperatureDetectLink: "/LAPI/V1.0/Alarm/HighTemperatureDetectLink",                  // 设置 / 获取高温告警联动配置信息
    InputSwitch: "/LAPI/V1.0/Channel/0/IO/InputSwitch",                                       // 设置/获取 输入开关量信息
    InputSwitchLink: "/LAPI/V1.0/Channel/0/IO/InputSwitchLink",                               // 设置/获取 开关量输入告警联动配置
    OutputSwitch: "/LAPI/V1.0/Channel/0/IO/OutputSwitch",                                     // 设置/获取 输出开关量信息
    SerialCfg: "/LAPI/V1.0/Channel/0/IO/Serial",                                              // 设置/获取 串口配置
    SerialTrans: "/LAPI/V1.0/Channel/0/IO/SerialTrans",                                       // 设置/获取 透明通道配置
    Subscription: "/LAPI/V1.0/Channel/0/Event/Subscription/Subscribers",                      //  设置 / 获取 订阅消息
    KeepAlive: "/LAPI/V1.0/System/KeepAlive",                                                 //  保活接口（确认MWareServer当前状态）
    LinkageActions: "/LAPI/V1.0/Smart/FaceDetection/LinkageActions",                       //获取/设置 人脸检测联动告警配置
    FaceDetectionRule: "/LAPI/V1.0/Smart/FaceDetection/Rule",                               //获取/设置 人脸检测参数
    FaceDetections: "/LAPI/V1.0/Smart/FaceDetection/Areas/Detections",                     //获取/设置 人脸检测区参数
    FaceSmart: "/LAPI/V1.0/Smart/FaceEnable",                                                 //获取/设置 人脸检测使能
    CloudCfg: "/LAPI/V1.0/Network/Cloud",                                                    // DDNS相关信息
    Unregistration: "/LAPI/V1.0/Network/Cloud/Unregistration",                               // 注销DDNS
    ReviseTime: "/LAPI/V1.0/Channel/0/Demo/ReviseTime",                                      // 获取/设置 客户端时间同步配置
    SetBackFocus: "/LAPI/V1.0/Image/SetBackFocus",                                           // 设置 手动后焦镜头控制
    LensMotorReset: "/LAPI/V1.0/Channel/0/Demo/LensMotorReset",                              // 获取/设置 点击镜头复位
    SystemTime: "/LAPI/V1.0/System/TimePrivate",                                             // 获取/设置 (新增)系统时间(含时区)
    SyncTime: "LAPI/System/SyncTime",                                                        //获取 / 设置同步时间
    InvertOSDFont: "/LAPI/V1.0/Channel/0/Demo/InvertOSDFont",                                // 获取/设置 反色OSD开关
    CustomOSDFontSize: "/LAPI/V1.0/Channel/0/Demo/CustomOSDFontSize",                        // 获取/设置 演示功能OSD字体大小配置
    DefaultOSDFontSize: "/LAPI/V1.0/Channel/0/Demo/DefaultOSDFontSize",                      // 获取 演示功能默认OSD字体大小配置
    OnvifDebug: "/LAPI/V1.0/Channel/0/Demo/OnvifDebug",                                      // 获取/设置 ONVIF调试模式参数配置
    DemoZoomLimitSwitch: "/LAPI/V1.0/Channel/0/Demo/ZoomLimitSwitch",                        // 获取/设置 demo焦段限制开关
    PortMap: "/LAPI/V1.0/Channel/0/NetWork/PortMap",                                         // 获取/设置 端口映射配置
    IPModified: "/LAPI/V1.0/NetWork/IPModified",                                             //获取/设置 双IP配置
    NetDetect: "/LAPI/V1.0/Channel/0/Demo/NetDetect",                                        // 获取/设置 断网检测开关
    DemoPTZCfg: "LAPI/V1.0/Channel/0/PTZ/PTDrvCfg",                                          // 获取/设置 云台维护配置
    TelnetEnableCfg: "/LAPI/V1.0/Channel/0/NetWork/Telnet",                                  // 获取/设置 telnet开关
    SerialOSDReport: "/LAPI/V1.0/Channel/0/IO/SerialOSDReport",                              // 获取/设置 串口OSD上报配置
    RTSPMulticastAddr: "/LAPI/V1.0/Channel/0/Media/RTSPMulticastAddr",                       // 获取/设置 RTSP组播地址
    H264PayloadType: "/LAPI/V1.0/Channel/0/Demo/H264PayloadType",                            //< 获取/设置 H264 PayloadType值配置
    PeopleCount:"/LAPI/V1.0/Channel/0/Smart/PeopleCount",                                    //< 获取/设置 人数统计规则信息，目前用于SmartIPC
    IPFilter: "/LAPI/V1.0/Channel/0/NetWork/IPFilter",                                       // 获取/设置 IP过滤配置
    DigitalZoom: "/LAPI/V1.0/Channel/0/System/DigitalZoom",                                  // 获取/设置 数字变倍最大倍率配置
    SmartChainCalc:"/LAPI/Smart/SmartChainCalc",                                             // 获取智能链式计算数据
    CheckPort: "/LAPI/V1.0/Channel/0/NetWork/CheckPort",                                     //获取端口是否冲突
    AreaFocus: "/LAPI/V1.0/PTZ/AreaFocus",                                                   //设置/获取区域聚焦
    LAPI_PTZAngleLimitSwitch: "/LAPI/V1.0/PTZ/PTZAngleLimitSwitch",                          //设置/获取云台仰角限位开关
    LAPI_PTZAngleLimit: "/LAPI/V1.0/PTZ/PTZAngleLimit",                                      //设置/获取云台仰角限位
    LAPI_PTZCtrl: "/LAPI/V1.0/Channel/0/PTZ/PTZCtrl",                                        // 云台控制
    LAPI_PTZCfg: "/LAPI/V1.0/Channel/0/PTZ/PTZCfg",                                          // 设置/获取 云台配置信息
    NetCtrlPTZ: "/LAPI/V1.0/Channel/0/PTZ/NetCtrlPTZ",                                       // 获取/设置 远程网络控制云台配置
    PTZPatrolRoute: "/LAPI/V1.0/Channel/0/PTZ/Patrol/Route",                                 //巡航录制轨迹
    PTZPatrol: "/LAPI/V1.0/Channel/0/PTZ/Patrol",                                            //获取轨迹点列表
    PTZWeekPlanStatusPatrol: "/LAPI/V1.0/Channel/0/Plan/WeekPlanStatus/Patrol",              //巡航计划状态
    PTZPatrolWeekPlan: "/LAPI/V1.0/Channel/0/Plan/WeekPlan/Patrol",                          //巡航计划
    PTZStopPatrolRoute: "/LAPI/V1.0/Channel/0/PTZ/StopPatrolRoute",                          //停止巡航
    PTZStartPatrolRoute: "/LAPI/V1.0/Channel/0/PTZ/StartPatrolRoute",                        //开始巡航
    PTZStartPatrolRouteRecord: "/LAPI/V1.0/Channel/0/PTZ/StartPatrolRouteRecord",            //开始巡航录制
    PTZStopPatrolRouteRecord: "/LAPI/V1.0/Channel/0/PTZ/StopPatrolRouteRecord",              //停止巡航录制
    PresetList: "/LAPI/V1.0/Channels/0/PTZ/Presets",                                         //获取预置位列表
    GoPreset: "/LAPI/V1.0/Channels/0/PTZ/Presets/",                                          //预置位预置
    PresetLink: "/LAPI/V1.0/PTZ/PresetLink",                                                 //联动预置位
    ResumeTime: "/LAPI/V1.0/PTZ/ResumeTime",                                                 //持续时间
    WiperInfo: "/LAPI/V1.0/Channel/0/PTZ/WiperInfo",                                         //设置/获取 雨刷配置
    EpExtendDebug: "/LAPI/Intelligent/EpExtendDebug",                                        //获取/设置 显示检测区域(卡口&电警共用)
    HeatMap: "/LAPI/V1.0/Channel/0/Smart/HeatMap",                                           //获取 / 设置热度图
    IsTypeCfg: "/LAPI/V1.0/Smart/IsType",                                                    //设置超感类型配置
    IsStatus: "/LAPI/V1.0/Smart/IsStatus",                                                   //获取/设置某一数据口的超感配置
    ZigbeeNetworkSwitch: "/LAPI/V1.0/Smart/ZigbeeNetworkSwitch",                             //设置IEEE802.15.4
    IsPortCfg: "/LAPI/Smart/IsPortCfg?PortId=",                                              // 设置 超感端口配置
    IsPortsStat: "/LAPI/V1.0/Smart/IsPortsStat",                                             // 获取 超感端口状态信息
    ParkingDetection: "/LAPI/V1.0/Smart/ParkingDetection",                                   // 获取 / 设置停车检测
    SmartRule: "/LAPI/V1.0/Channel/0/Smart/SmartRule/",                                      //获取 / 设置智能规则
    RoadDetectOSD: "/LAPI/V1.0/Channel/0/Smart/RoadDetectOSD",                               //获取 / 设置智能道路检测OSD
    RoadDetect: "/LAPI/V1.0/Channel/0/Smart/RoadDetect",                                     // 获取 / 设置 道路检测
    SmartMode: "/LAPI/V1.0/Smart/Mode",                                                      //获取 / 设置 智能系统模式（天网卡口/智能IPC）
    WeekPlan: "/LAPI/V1.0/Channel/0/Plan/WeekPlan/",                                         //获取 / 设置周计划表格数据
    DebugMessage: "/LAPI/V1.0/System/DebugMessage",                                          // 调试
    UdpServer: "/LAPI/V1.0/Channel/0/System/UdpServer",                                      // 获取 / 设置UDP服务器
    CurrentPasswordInfo: "/LAPI/V1.0/System/CurrentPasswordInfo",                            //获取当前密码信息
    DisconnectCache: "/LAPI/V1.0/Channel/0/System/DisconnectCache",                          //Onvif断网存储地址
    LedCtrl: "/LAPI/V1.0/IPC/1/Channel/0/Intelligent/LedCtrl",                               //LED灯控制
    OutLayLedCtrl: "/LAPI/V1.0/Channel/0/INTELLIGENT/OutLayLedCtrl",                         //外置LED灯控制
    CarPortBindLedID: "/LAPI/V1.0/Channel/0/INTELLIGENT/CarPortBindLedID",                   //车位绑定LED灯ID
    PlateDetect: "/LAPI/V1.0/Channel/0/Intelligent/PlateDetect",                       //获取 / 设置车牌检测
    PicQuality: "/LAPI/V1.0/Channel/0/Intelligent/PicQuality",                         //获取 / 设置照片质量
    OnvifPicStreamEnable: "/LAPI/Intelligent/OnvifPicStreamEnable",                          //获取 / 设置 Onvif上报照片流
    PlateIdentify: "/LAPI/Intelligent/PlateIdentify",                                        //获取 / 设置 车牌鉴定
    HZLFServerInfo: "/LAPI/V1.0/IPC/1/Channel/0/Intelligent/HZLFServerInfo",                 //获取/设置 存储杭州立方服务器信息
    TimerCapture: "/LAPI/Intelligent/TimerCapture",                                          //获取 / 设置 定时抓拍
    ManualCapturePeccancy: "/LAPI/Intelligent/ManualCapturePeccancy",                        //设置手动违章抓拍
    FeastChangeDay: "/LAPI/Intelligent/FeastChangeDay",                                       //节假日调休日
    DDRFrequency: "/LAPI/System/DDRFrequency",                                                // 获取/设置DDR频率
    PTZCapReportLimit: "/LAPI/Demo/PTZCapReportLimit",                                        // PTZ能力上报限制开关是否开启
    LowDelay: "/LAPI/V1.0/Channel/0/Demo/LowDelay",                                           // 获取/设置/删除 低延时配置
    ViewMode: "/LAPI/V1.0/Channel/0/Demo/ViewMode",                                            // 获取/设置 视角模式配置
    StreamSendMode: "/LAPI/V1.0/Channel/0/Demo/StreamSendMode",                               // 获取/设置 码流发送模式
    ClearFog: "/LAPI/V1.0/Channel/0/Demo/ClearFog",                                           // 获取/设置 除雾配置
    Logs: "/LAPI/V1.0/System/Logs",                                                           // 获取日志
    GBTCPStream: "/LAPI/V1.0/Channel/0/Demo/GBTCPStream",                                    // 获取/设置 国标TCP码流配置
    DeFog: "/LAPI/V1.0/System/DeviceStatus/DeFog",                                            // 获取除雾状态
    SpecialLensType: "/LAPI/V1.0/Channel/0/Demo/Debug/SpecialLensType",     //获取/设置 特殊镜头类型频率
    AudioAGC: "/LAPI/V1.0/Channel/0/Demo/Debug/AudioAGC",                     //获取/设置 音频AGC
    ProfileMode: "/LAPI/V1.0/Channel/0/Demo/Debug/ProfileMode",              //获取/设置 Profile 模式
    EnhanceMode: "/LAPI/V1.0/Channel/0/Demo/Debug/EnhanceMode",              //获取/设置 增强模式
    SansuoCheckCfg: "/LAPI/V1.0/Channel/0/Demo/SansuoCheck",           // 获取/设置 图像自定义参数配置
    PhotoStorage: "/LAPI/V1.0/Media/Storage/PhotoStorage",             //获取 / 配置 照片直存方式
    Photo_DirectoryInfo: "LAPI/V1.0/Smart/DirectoryInfo",                           // SD卡照片目录信息
    PictureInfo: "/LAPI/V1.0/Smart/PictureInfo",                                     // SD照片（文件资源）
    STREAM_CFG: "/LAPI/V1.0/Channels/0/Media/Video/Streams/",              // 设置/获取/删除 媒体流参数配置
    CAPTURE_FORMAL :"/LAPI/V1.0/Smart/CaptureExecution?IA_TRIGGER_FORMAL",//手动抓拍
    CAPTURE_DEBUG :"/LAPI/V1.0/Smart/CaptureExecution?IA_TRIGGER_DEBUG",//调试抓拍
    CAMARA_CAPTURE_CFG: "/LAPI/Smart/CameraCapture",               // 设置/获取 抓拍配置
    VIDEO_SPEED_DETECT_CFG: "/LAPI/Smart/VideoDetect",            // 设置/获取 视频检测配置
    DRIVEWAY_CFG: "/LAPI/Smart/DriveWay",                      // 设置/获取 车道配置
    IPCAX_SUBDEVICE_SWITCH_CFG: "/LAPI/IO/SubDeviceSwitch",        // 设置/获取 外设开关配置
    SUB_OSD_CFG: "/LAPI/Media/SubOSD",                      // 获取/设置/删除 其他OSD配置
    DETECTAREA_CFG: "/LAPI/Intelligent/DetectArea",                 // 获取/设置 检测区域配置
    CAPTURE_IMGPROC_CFG: "/LAPI/Smart/CaptureImgproc",              // 获取/设置 图片处理配置
    PictureFTP: "/LAPI/System/PictureFTP",                         // 获取/设置 FTP上传页面配置
    DRIVEWAY_EX_CFG : "/LAPI/Smart/ExpandDriveWay",                // 获取/设置 卡口智能区域扩展参数
    SUBDEVICE_SWITCH_EX_CFG: "/LAPI/IO/ExpandSubDevice",         // 获取/设置 外设开关扩展配置
    SUB_OSD_EXPAND_CFG: "/LAPI/Media/SubOSDExpand",             // 获取/设置osd扩展信息
    TGFlowReset: "/LAPI/V1.0/Smart/TG/FlowReset",                //获取和设置天网卡口流量清零配置
    IQDebugInfo: "/LAPI/V1.0/Channel/0/Demo/Debug/IQDebugInfo",    //获取和设置IQ调试信息
    TriggerLine: "/LAPI/Intelligent/TriggerLine",                   //获取和设置触发线
    DrivewayLine: "/LAPI/Intelligent/DrivewayLine",                 //获取和设置车道线
    DeviceLocation: "/LAPI/V1.0/IPC/1/Channel/0/Intelligent/DeviceLocation",  //获取和设置设备位置
    YJServerInfo: "/LAPI/Intelligent/YJServerInfo",                        // 获取和设置银江协议信息
    SLCDN: "/LAPI/Intelligent/SLCDN",                            //获取和设置松立协议信息
    SmartWorkMode: "/LAPI/V1.0/Smart/DetectMode",
    PHOTO_SERVER_CFG: "/LAPI/System/PhotoServer",                // 设置/获取 照片接收服务器信息
    FLASH_LIGHT_CFG: "/LAPI/IO/FlashLight",                   // 设置/获取 闪光灯配置
    VEHICLE_DETECTOR_CFG: "/LAPI/IO/VehicleDetector",              // 设置/获取 车检器配置
    RADAR_CFG: "/LAPI/IO/Radar",                         // 设置/获取 雷达配置
    LASER_CFG: "/LAPI/IO/Laser",                        // 设置/获取 激光配置
    TRAFFICLIGHT_CFG: "/LAPI/Smart/TrafficLight",               // 获取/设置/删除 交通灯配置
    CAMERA_BASIC_CFG: "/LAPI/System/ACSyncInfo",               // 设置/获取 摄像机基本配置
    EP_VIDEODETECT_CFG: "/LAPI/Smart/EPVideoDetect",             // 获取/设置 视频检测配置
    EP_DRIVEWAY_CFG: "/LAPI/Smart/EPDriveWay",                  // 获取/设置 电警车道配置
    PECCANCY_CAPTURE_CFG: "/LAPI/Smart/ViolationCapture",           // 获取/设置 违章抓拍配置
    POLARIZER_CFG: "/LAPI/IO/Polarizer",                     // 获取/设置 偏振镜参数配置
    STOR_NAS_CFG: "/LAPI/System/Nas",                     // 设置/获取 NAS配置
    TRAFFICLIGHT_INTENSIFY_CFG: "/LAPI/Intelligent/TrafficLightInensity",       // 获取/设置 红绿灯加强配置
    ND_FILTER_CFG: "/LAPI/IO/NDFilter",                   // 获取/设置 ND滤镜配置
    IVA_SCENE_CFG: "/LAPI/Smart/IVASceneList",                   // 获取/设置 智能场景信息
    IVA_RULE_CFG: "/LAPI/Smart/IVARuleList",                    // 获取/设置 智能规则信息
    IVA_SCENE_CRUISE_PLAN: "/LAPI/PTZ/IVACruisePlan",           // 获取/设置 智能场景巡航计划
    IVA_LP_CHECK_CFG: "/LAPI/Smart/IVALPRCheck",                // 获取/设置 车牌一致性校验
    IVA_ALLOW_TIME: "/LAPI/Smart/IVAStayTime",                  // 获取/设置 允许停留时间
    IVA_EX_SCENE_CFG: "/LAPI/Smart/IVAExSenceList",                // 获取/设置 场景扩展参数
    IVA_DEBUG_CFG: "/LAPI/Smart/IVASnapPictureID",                   // 获取/设置 智能球调试模式参数配置
    BREAKRULE_PARAM_CFG: "/LAPI/Smart/RedLightParkTime",             // 获取/设置 违章扩展参数
    VIDEO_SPEED_DETECT_EXT_CFG: "/LAPI/Intelligent/EpExpandVideoDetect",      // 设置/获取 视频检测扩展配置
    IVA_SCENE_MARK_CFG: "/LAPI/Smart/IVAPressLine",              // 获取/设置 场景车道标定配置
    IVA_EVIDENCE_OSD_CFG: "/LAPI/Media/PicOSD",            // 获取/设置 智能违章OSD配置
    SYN_PIC_TYPE_CFG: "/LAPI/Intelligent/SynPicType",                // 获取/设置 照片合成
    IVA_LINK_STOR_SWITCH: "/LAPI/Smart/IVALinkStorSwitch",            // 获取/设置 违停球使能开关
    PHOTO_SERVER_PWD_YJ_CFG: "/LAPI/System/YJPhotoServer",         // 获取/设置 银江服务器64位密码配置
    IO_PORT_CFG: "/LAPI/IO/IOPort",                     // 获取/设置IO端口配置
    IVA_MANUAL_SNAP: "/LAPI/Smart/IVAManualSnap",                 // 获取/设置 智能手动取证配置
    DFWL_SERVER_CFG: "/LAPI/System/DFWLPhotoServer",                 // 获取/设置 东方网力服务器配置
    IVA_SIMILAR_LP_FILTER_CFG: "/LAPI/Intelligent/IVASimilarLPRFilter",      //< 获取/设置 相似车牌过滤使能标志
    PECCANCY_WAY_CFG: "/LAPI/Intelligent/PeccancyWay",                // 获取/设置车道违章配置
    PECCANCY_TIME_CFG: "/LAPI/Smart/ViolationMode",               // 获取/设置分时段违章配置
    IVA_BREAK_RULE_PROC_CFG: "/LAPI/Intelligent/IVABreakRule",        // 获取/设置 违停球违章处理配置
    TRAFFIC_PARAM_SERVER_CFG:"/LAPI/System/TrafficParamServer",        //获取/设置 交通参数服务器配置，对应结构体IMOS_MW_TRAFFIC_PARAM_SERVER_CFG_S
    MCC_TRANSPORT_CFG: "/LAPI/NetWork/CameraComm",               // 获取/设置 相机通信配置
    Evidence_ManualCapture_Info: "/LAPI/V1.0/Smart/Evidence/ManualCaptureInfo", //获取/设置 手动抓拍证据链信息
    Evidence_AutoCapture_Info: "/LAPI/V1.0/Smart/Evidence/AutoCaptureInfo",  //获取/设置 自动抓拍证据链信息
    SMART_TRACK:"/LAPI/V1.0/Channels/0/Smart/ObjTrack/Rule",                  //获取智能跟踪规则
    FriendPwd: "/LAPI/V1.0/System/FriendlyCode",                        //设置和获取友好密码配置
    CustomizeUpdate: "/LAPI/V1.0/System/CustomizePackage",           //定制包升级
    ExPtzSpecFunc:"/LAPI/Demo/ExPtzSpecFunc",                            //获取/设置 外置云台辅助功能
	MutexWorkingStatus: "/LAPI/V1.0/Channels/0/Smart/WorkingStatus",    //智能功能启用状态
    MutexRelationInfo: "/LAPI/Smart/MutexRelationInfos",          //智能互斥关系
    Network_PeripheralList: "/LAPI/Intelligent/NetworkPeripheralList",    //获取/设置 网络外设配置
	FaceDetectSize: "/LAPI/V1.0/Smart/Capabilities"                 //人脸检测目标大小
};
var modeRouteRange={ //模式路径Action的范围
    Start : 0x01000001,
    End : 0x01000010
};
