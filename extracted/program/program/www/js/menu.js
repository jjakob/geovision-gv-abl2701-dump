// JavaScript Document
var selected_item = ""; // 当前选中的页面
var currnetMode = "";// 当前展开的模块
var tabNavDefaults = {};
var MenuinfoList = [];  //行业、分销：一级二级菜单关系
var MenuTabMap = {};    //行业、分销：二级三级菜单关系
var Traffick_MenuinfoList = []; //交通版本模块信息
var Traffick_MenuTabMap = {}; //交通版本菜单对应关系
var $LocalCfgLink,
    $systemCfgLink,
    $NetWorkLink,
    $imgCfgLink,
    $AudioVideoLink,
    $ivaCfgLink,
    $osdCfgLink,
    $debuggerCfgLink ,
    $deviceStatusLink,
    $userCfgLink,
    $ptzCfgLink,
    $systemMaintenanceLink,
    $ivaCfgIVABallLink,
    $debuggerCfgIVABallLink,
    $alarmMangeCfgLink;

// 初始化菜单参数
function initMenuParam() {
    var top = GetTopWindow();
    var illegalConfigTabVisible = (IVAMode.ILLEGAL == IVAType);
    var ivaCaptureVisible = (IVACommonMode.KAKOU == IVACommonType); // 人员卡口
    var ivaPersonCountVisible = (IVACommonMode.PC == IVACommonType); // 人数统计
    var illegalConfigPageVisible = (top.banner.isSupportJPEG && !ivaPersonCountVisible) || top.banner.isSupportPersonPhoto||top.banner.isSupportFaceDetection || top.banner.isSupportFaceQualityPro;

    var trafficlightVisible = top.banner.isSupportTrafficLight;
    var intelligentPageName = trafficlightVisible ? "operate_epIntelligent.htm" : "operate_intelligent.htm";
    var isSupportExternalDevice = (top.banner.isSupportSerial || top.banner.isSupportSerialTransport ||
                                    top.banner.isSupportLED || top.banner.isSupportBasicSwitchIn ||
                                    top.banner.isSupportBasicSwitchOut || (top.banner.isSupportRainbrush && (-1 == isContainsElement(2, rainbrushModeList))));
    var isSupportPerson_Capture=(ivaCaptureVisible || top.banner.isSupportPersonPhoto);

    Traffick_MenuinfoList = [
        {
            name: $.lang.pub["LocalCfgTitle"],
            linkId: "LocalCfgLink"
        },
        {
            name: $.lang.pub["cfgManageTitle"],
            linkId: "systemCfgLink"
        },
        {
            name: $.lang.pub["cfgNetWorkTitle"],
            linkId: "NetWorkLink"
        },
        {
            name: $.lang.pub["imgSettingTitle"],
            linkId: "imgCfgLink"
        },
        {
            name: (top.banner.isSupportAudio) ? $.lang.pub["audioAndVideoTitle"] : $.lang.pub["videoTitle"],   //音视频
            linkId: "AudioVideoLink"
        },
        {
            name: $.lang.pub["intelligentCfg"],
            linkId: "ivaCfgLink"
        },
        {
            name: $.lang.pub["alarmMangeTitle"],
            linkId: "alarmMangeCfgLink",
            visible: top.banner.isSupportAlarm
        },
        {
            name: $.lang.pub["osdTitle"],
            linkId: "osdCfgLink"
        },
        {
            name: $.lang.pub["ptzCfgTitle"],
            linkId: "ptzCfgLink",
            visible: top.banner.isSupportPTZ
        },
        {
            name: $.lang.pub["deviceStatusTitle"],
            linkId: "deviceStatusLink",
            defaultVisible:false
        },
        {
            name: $.lang.pub["SecurityCfgTitle"],
            linkId: "userCfgLink",
            defaultVisible:false
        },
        {
            name: $.lang.pub["systemMaintenanceTitle"],
            linkId: "systemMaintenanceLink",
            defaultVisible:false
        },
        {
            name: $.lang.pub["debuggerCfg"],
            linkId: "debuggerCfgLink",
            defaultVisible:false,
            visible: !illegalConfigTabVisible
        },
        {
            name: $.lang.pub["debuggerCfg"],
            linkId: "debuggerCfgIVABallLink",
            defaultVisible:false,
            visible: top.banner.isSupportdebuggerCfgIVABall
        }
    ];

    Traffick_MenuTabMap = {
        systemCfgLink: [
            {
                name: $.lang.pub["time"],
                linkId: "timeCfgTab",
                web_id: "time_config.htm"
            },
            {
                name: $.lang.pub["DST"],
                linkId: "dstCfgTab",
                web_id: "dst_config.htm",
                visible: top.banner.isSupportDST
            },
            {
                name: $.lang.pub["managementServer"],
                linkId: "managementServerTab",
                web_id: "management_server.htm",
                visible:top.banner.isSupportVM
            },
            {
                name: $.lang.pub["photoServer"],
                linkId: "photoServerTab",
                web_id: "photo_server.htm",
                visible: top.banner.isSupportJPEG && VersionType.PRJ != top.banner.versionType && !top.banner.isSupportTrafficFlow
            },
            {
                name: $.lang.pub["smartServer"],
                linkId: "smartServerTab",
                web_id: "smart_server.htm",
                visible: top.banner.isSupportSmartTmsServer || top.banner.isSupportSmartUDPServer
            },
            {
                name: $.lang.pub["trafficDataServerTitle"],
                linkId: "trafficDataServerTab",
                web_id: "trafficdata_server.htm",
                visible: top.banner.isSupportCapture && top.banner.isSupportAnyCfg && !illegalConfigTabVisible && top.banner.isSupportTrafficParam,
                pageType: 1
            },
            {
                name: $.lang.pub["ftpConfigTitle"],
                linkId: "ivaFtpConfigTab",
                web_id: "ftp_config.htm",
                visible: top.banner.isSupportFTP && !top.banner.isSupportIvaPark,
                pageType: 1
            },
            {
                name: $.lang.pub["ftpConfigTitle"],
                linkId: "ftpConfigTab",
                web_id: "ftp_config.htm",
                visible: top.banner.isSupportBasicFTP,
                pageType: 0
            },
            {
                name: $.lang.pub["COMTitle"],
                linkId: "COMTab",
                web_id: "operate_ptz_rs.htm",
                visible: top.banner.isSupportSerial
            },
            {
                name: $.lang.pub["storageCfg"],
                linkId: "storageManagerTab",
                web_id: "operate_storage.htm",
                visible: top.banner.isSupportStorage
            },
            {
                name: $.lang.pub["netPeripheral"],
                linkId: "netPeripheralTab",
                web_id: "operate_netPeripheral.htm",
                visible: top.banner.isSupportNetPeripheral
            }
        ],
        NetWorkLink: [
                {
                     name: $.lang.pub["wired"],
                     linkId: "TCPIPTab",
                     web_id: "network_system.htm"
                },
                {
                    name: "UNP",
                    linkId: "UNPTab",
                    web_id: "UNP.htm",
                    visible: top.banner.isSupportUNP
                },
                {
                    name: $.lang.pub["customLuTitle"],
                    linkId: "customLuTab",
                    web_id: "lu_custom.htm",
                    visible:top.banner.isSupportNetIfaceNum
                },
                {
                    name: "SNMP",
                    linkId: "SNMPCfgTab",
                    web_id: "snmp.htm",
                    visible: top.banner.isSupportSNMP
                },
                {

                    name: "802.1x",
                    linkId: "IEEE8021xCfgTab",
                    web_id: "IEEE8021x.htm",
                    visible: top.banner.isSuppprtIEEE8021x
                },
                {
                    name: "DNS",
                    linkId: "DNSTab",
                    web_id: "DNS.htm"
                },
                {
                    name: $.lang.pub["PortCfgTitle"],
                    linkId: "portCfgTab",
                    web_id: "port_config.htm",
                    visible: top.banner.isSupportPortCfg
                },
                {
                     name: $.lang.pub["portMapCfgTitle"],
                     linkId: "portMapCfgTab",
                     web_id: "port_map.htm"
                },
                {
                    name: "DDNS",
                    linkId: "DDNSConfigTab",
                    web_id: "ddns_config.htm",
                    visible: illegalConfigTabVisible || top.banner.isSupportIvaPark
                },
                {
                    name: $.lang.pub["emailConfigTitle"],
                    linkId: "emailConfigTab",
                    web_id: "email_config.htm",
                    visible: top.banner.isSupportEmail
                },
                {
                    name: $.lang.pub["MCCTransPortCfgTitle"],
                    linkId: "MCCTransPortCfgTab",
                    web_id: "operate_MCCTransPort.htm",
                    visible: top.banner.isSupportMCC
                }
            ],
        imgCfgLink: [
            {
                name: $.lang.pub["imgConfigTitle"],
                linkId: "imgConfigTab",
                web_id: "img_config.htm"
            },
            {
                name: $.lang.pub["LightCfg"],
                linkId: "filllightTab",
                web_id: "filllight_config.htm",
                visible:top.banner.isSupportLED
            },
            {
                name: $.lang.pub["EnableACSynchronism"],
                linkId: "ACSynchronismTab",
                web_id: "ACSynchronism_config.htm",
                visible:top.banner.isSupportACSyncPhase
            },
            {
                name: $.lang.pub["IOPortCfg"],
                linkId: "IOPortTab",
                web_id: "operate_IOPort.htm",
                visible: top.banner.isSupportIOPort
            },
            {
                name: $.lang.pub["coverOsdTitle"],
                linkId: "maskTab",
                web_id: "operate_mask.htm",
                visible: top.banner.isSupportCoverOsd
            }
        ],
        AudioVideoLink: [
            {
                name: $.lang.pub["encodeTitle"],
                linkId: "videoTab",
                pageType: 0,
                web_id: "operate_video.htm"
            },
            {
                name: $.lang.pub["roiTitle"],
                linkId: "roiTab",
                web_id: "operate_roi.htm",
                visible: top.banner.isSupportRoi
            },
            {
                name: $.lang.pub["streamTitle"],
                linkId: "streamTab",
                web_id: "operate_stream.htm",
                visible: top.banner.isSupportMediaStream
            },
            {
                name: $.lang.pub["multicastTitle"],
                linkId: "multicastTab",
                web_id: "operate_multicast.htm"
            },
            {
                name: $.lang.pub["soundBoxIVABallTitle"],
                linkId: "soundBoxTab",
                web_id: "operate_sound.htm",
                visible: top.banner.isSupportAudio
            }
        ],
        ivaCfgLink: [
            {
                name: $.lang.pub["sceneTitle"],
                linkId: "ivaSceneManagerTab",
                web_id: "iva_scene_manager.htm",
                visible: !ivaCaptureVisible && !ivaPersonCountVisible && !isSupportIvaPark && !top.banner.isSupportSmart && illegalConfigTabVisible
            },
            {
                name: $.lang.pub["sceneCruiseTitle"],
                linkId: "sceneCruiseTab",
                web_id: "iva_scene_cruise.htm",
                visible: !ivaCaptureVisible && !ivaPersonCountVisible && !isSupportIvaPark && !top.banner.isSupportSmart && illegalConfigTabVisible
            },
             {
                name: $.lang.pub["intelligentCfg"],
                linkId: "intelligentTab",
                web_id: intelligentPageName,
                visible: top.banner.isSupportCapture && !illegalConfigTabVisible
            },
            {
                name: $.lang.pub["peccancyCaptureCfg"],
                linkId: "peccancyCaptureTab",
                web_id: "operate_peccancycapture.htm",
                visible: top.banner.isSupportCapture && top.banner.isSupportAnyCfg && top.banner.isSupportIllegalParam
            },
            {
                name: $.lang.pub["peccancyTimeCfg"],
                linkId: "peccancyTimeTab",
                web_id: "operate_peccancytime.htm",
                visible: top.banner.isSupportCapture && top.banner.isSupportAnyCfg && !illegalConfigTabVisible && top.banner.isSupportIllegalParam
            },
            {
                name: $.lang.pub["captureImgProcTitle"],
                linkId: "captureImgProcTab",
                web_id: "operate_captureImgProc.htm",
                visible: top.banner.isSupportCapture && top.banner.isSupportAnyCfg
            },
            {
                name: $.lang.pub["synpicCfgTitle"],
                linkId: "synpicCfgTab",
                web_id: "synpic_config.htm",
                visible: top.banner.isSupportAnyCfg && top.banner.isSupportDeviceCombinePic && !top.banner.isSupportIvaPark
            },
            {
                name: $.lang.pub["plateParam"],
                linkId: "plateTab",
                web_id: "operate_videodetect.htm",
                visible: top.banner.isSupportCapture
            },
            {
                name: $.lang.pub["projectParam"],
                linkId: "projectTab",
                web_id: "operate_project.htm",
                visible: top.banner.isSupportEDP
            },
            {
                name: $.lang.pub["dataCollectTitle"],
                linkId: "dataCollectTab",
                web_id: "operate_datacollect.htm",
                visible: top.banner.isSupportCapture && top.banner.isSupportAnyCfg && !illegalConfigTabVisible && top.banner.isSupportTrafficParam
            },
            {
                name: $.lang.pub["illegalParkingCaptureTitle"],
                linkId: "illegalParkingCaptureTab",
                web_id: "iva_manual_capture.htm",
                visible: illegalConfigTabVisible
            },
            {
                name: $.lang.pub["intellisenseTitle"],
                linkId: "intellisenseTab",
                web_id: "intellisense_config.htm",
                visible: top.banner.isSupportIntellisense
            },
            {
                name: $.lang.pub["sceneTitle"],
                linkId: "ivaParkSceneTab",
                web_id: "iva_park_scene.htm",
                visible: top.banner.isSupportIvaPark
            },
            {
                name: $.lang.pub["ledCtrlTitle"],
                linkId: "ivaLEDCtrlTab",
                web_id: "iva_led_ctrl.htm",
                visible: top.banner.isSupportIvaPark
            },
            {
                name: $.lang.pub["photoParam"],
                linkId: "ivaPictureTab",
                web_id: "iva_picture.htm",
                visible: top.banner.isSupportIvaPark
            },
            {
                name: $.lang.pub["parkServer"],
                linkId: "ivaParkServerTab",
                web_id: "iva_park_server.htm",
                visible: top.banner.isSupportCarPortServer
            }
        ],
        alarmMangeCfgLink: [
            {
                name: $.lang.pub["motionDetectAlarmTitle"],
                linkId: "motionDetectAreaAlarmTab",
                web_id: "alarm_motion.htm",
                visible: top.banner.isSupportMotionDetection
            },
            {
                name: $.lang.pub["tamperDetectAlarmTitle"],
                linkId: "tamperDetectAlarmTab",
                web_id: "alarm_tamperdetect.htm",
                visible: top.banner.isSupportTamperDetect
            },
            {
                name: $.lang.pub["temperatureAlarmTitle"],
                linkId: "temperatureAlarmTab",
                web_id: "alarm_temperature.htm",
                pageType: 0,
                visible:  top.banner.isSupportTemperatureDetect && illegalConfigTabVisible
            },
            {
                name: $.lang.pub["audioDetectAlarmTitle"],
                linkId: "audioDetectAlarmTab",
                web_id: "alarm_audiodetect.htm",
                visible: top.banner.isSupportAudio && illegalConfigTabVisible
            },
            {
                name: $.lang.pub["switchInAlarmTitle"],
                linkId: "switchInAlarmTab",
                web_id: "alarm_switchin.htm",
                pageType: 0,
                visible: top.banner.isSupportSwitchIn && illegalConfigTabVisible
            },
            {
                name: $.lang.pub["switchOutAlarmTitle"],
                linkId: "switchOutAlarmTab",
                web_id: "alarm_switchout.htm",
                pageType: 0,
                visible: top.banner.isSupportSwitchOut && illegalConfigTabVisible
            },
            {
                name: $.lang.pub["temperatureTitle"],
                linkId: "temperatureBasicTab",
                web_id: "alarm_temperature.htm",
                visible: top.banner.isSupportBasicTemperature,
                pageType: 1
            },
            {
                name: $.lang.pub["switchInTitle"],
                linkId: "switchInBasicTab",
                web_id: "alarm_switchin.htm",
                visible: top.banner.isSupportBasicSwitchIn,
                pageType: 1
            },
            {
                name: $.lang.pub["switchOutTitle"],
                linkId: "switchOutBasicTab",
                web_id: "alarm_switchout.htm",
                visible: top.banner.isSupportBasicSwitchOut,
                pageType: 1
            }
        ],
        ptzCfgLink: [
             {
                 name:$.lang.pub["watchPosition"],
                 linkId:"ptzCfgTab",
                 web_id:"ptz_config.htm",
                 visible: top.banner.isSupportPTZ
             },
             {
                 name:$.lang.pub["netCtrlPtz"],
                 linkId:"PTZConfigNetctrlTab",
                 web_id:"ptz_config_netctrl.htm",
                 visible: top.banner.isSupportPTZ && !top.banner.isSupportHDMM  && !illegalConfigTabVisible
             },
             {
                 name:$.lang.pub["cruiseCfg"],
                 linkId:"cruiseCfgTab",
                 web_id:"cruise_config.htm",
                 visible: top.banner.isSupportPTZ && !top.banner.isSupportHDMM
             },
             {
                 name:$.lang.pub["advancedParam"],
                 linkId:"ptzcmdRelationTab",
                 web_id:"ptzcmd_relation.htm",
                 visible: top.banner.isSupportHDMM
             }
        ],
        osdCfgLink: [
            {
                name: $.lang.pub["live"],
                linkId: "osdTab",
                web_id: "operate_osd.htm"
            },
            {
                name: $.lang.pub["photo"],
                linkId: "osdJPEGTab",
                web_id: "operate_osd_jpeg.htm",
                pageType: 0,
                visible: top.banner.isSupportCapture && !top.banner.isSupportTrafficFlow
            }
        ],
        LocalCfgLink: [
            {
                name: $.lang.pub["LocalCfgTitle"],
                linkId: "LocalCfgTab",
                web_id: "client_settings.htm"
            }
        ],
        debuggerCfgLink: [
            {
                name: $.lang.pub["commonDebugger"],
                linkId: "debuggerOthersTab",
                web_id: "debugger_others.htm",
                visible: top.banner.isSupportDebugger && !illegalConfigTabVisible
            },
            {
                name: $.lang.pub["radarCfg"],
                linkId: "debuggerRadarTab",
                web_id: "debugger_radar.htm",
                visible: top.banner.isSupportRadar && !illegalConfigTabVisible
            },
            {
                name: $.lang.pub["laserCfg"],
                linkId: "debuggerLaserTab",
                web_id: "debugger_laser.htm",
                visible: top.banner.isSupportLaser && !illegalConfigTabVisible
            },
            {
                name: $.lang.pub["detectorCfg"],
                linkId: "debuggerDetectorTab",
                web_id: "debugger_detector.htm",
                visible: !trafficlightVisible && !illegalConfigTabVisible && !top.banner.isSupportTrafficFlow
            },
            {
                name: $.lang.pub["onvifDebugger"],
                linkId: "onvifTestTab",
                web_id: "onvif_test.htm",
                visible: !illegalConfigTabVisible
            },
            {
                name: $.lang.pub["intelligentDebugger"],
                linkId: "debuggerIntelligentTab",
                web_id: "debugger_intelligent.htm",
                visible: !illegalConfigTabVisible && !top.banner.isSupportTrafficFlow
            },
            {
                name: $.lang.pub["trafficcontrol"],
                linkId: "trafficcontrolTab",
                web_id: "traffic_control.htm",
                visible: top.banner.isSupportTrafficcontrol && !illegalConfigTabVisible && top.banner.isSupportTrafficParam
            }
        ],
        debuggerCfgIVABallLink: [
            {
                name: $.lang.pub["commonDebugger"],
                linkId: "demoFuncTab",
                web_id: "demo_func.htm",
                visible: top.banner.isSupportDemo || (VersionType.PRJ == top.banner.versionType)
            },
            {
                name: $.lang.pub["osdAdvancedParam"],
                linkId: "demoOsdTab",
                web_id: "demo_osd.htm",
                visible: illegalConfigTabVisible || top.banner.isSupportIvaPark
            },
            {
                name: $.lang.pub["onvifDebugger"],
                linkId: "Com_onvifTestTab",
                web_id: "onvif_test.htm",
                visible: illegalConfigTabVisible || top.banner.isSupportIvaPark,
                pageType: 1
            },
            {
                name: $.lang.pub["demoPtz"],
                linkId: "demoPtzTab",
                web_id: "demo_ptz.htm",
                visible: top.banner.isSupportDemoPtz && illegalConfigTabVisible
            }
        ],
        deviceStatusLink: [
            {
                name: $.lang.pub["deviceStatusTitle"],
                linkId: "deviceStatusTab",
                web_id: "navigation.htm",
                pageType: 1
            }
        ],
        userCfgLink: [
            {
                name: $.lang.pub["userCfgTitle"],
                linkId: "userCfgTab",
                web_id: "system_passwd.htm"
            },
            {
                name: $.lang.pub["Https"],
                linkId: "httpsCfgTab",
                web_id: "https_config.htm"
            },
            {
                name: $.lang.pub["RTSPAuthMode"],
                linkId: "authenticationTab",
                web_id: "authentication_config.htm"
            },
            // {
            //     name: $.lang.pub["registInfoTitle"],
            //     linkId: "registInfoTab",
            //     web_id: "system_regist_info.htm"
            // },
            {
                name: $.lang.pub["staticARP"],
                linkId: "staticARPTab",
                web_id: "static_arp.htm"
            },
            // {
            //     name: $.lang.pub["waterMark"],
            //     linkId: "waterMarkTab",
            //     web_id: "water_mark.htm"
            // },
            {
                name: $.lang.pub["ipFilter"],
                linkId: "ipFilterTab",
                web_id: "ip_filter_config.htm"
            },
            {
                name: $.lang.pub["SafeConfig"],
                linkId: "telnetCfgTab",
                web_id: "telnet_config.htm"
            }
        ],
        systemMaintenanceLink: [
            {
                name: $.lang.pub["systemMaintenanceTitle"],
                linkId: "systemMaintenanceTab",
                web_id: "config_manage.htm"
            },
            {
                name: $.lang.pub["noneCaptureTitle"],
                linkId: "noneCaptureTab",
                web_id: "none_capture.htm",
                visible: top.banner.isSupportNoneCapture
            }
        ]
    };

    MenuinfoList = [
        {
            moduleName: $.lang.pub["commonTitle"], // 常用
            className: "icon navigation",
            idName:"navigation",
            menulist: [
                {
                    name: $.lang.pub["navigationTitle"],
                    linkId: "navigationLink"
                },
                {
                    name: $.lang.pub["LocalCfgTitle"],
                    linkId: "LocalCfgLink"
                },
                {
                    name: $.lang.pub["wired"],
                    linkId: "Com_networkConfigLink"
                },
                {
                    name: $.lang.pub["time"],
                    linkId: "Com_timeCfgLink"
                },
                {
                    name: $.lang.pub["serverCfgTitle"],
                    linkId: "Com_serverLink",
                    visible:top.banner.isSupportVM || top.banner.isSupportJPEG || (top.banner.isSupportSmartTmsServer || top.banner.isSupportSmartUDPServer)
                },
                {
                    name: "OSD",
                    linkId: "Com_osdLink"
                },
                {
                    name: $.lang.pub["userCfgTitle"],
                    linkId: "Com_userCfgLink"
                }
            ]
        },
        {
            moduleName: $.lang.pub["cfgNetWorkTitle"], //网络
            className: "icon network",
            idName:"network",
            menulist: [
                {
                    name: $.lang.pub["networkConfigTitle"],
                    linkId: "networkConfigLink"
                },
                {
                    name: "UNP",
                    linkId: "UNPCfgLink",
                    visible:top.banner.isSupportUNP
                },
                {
                    name: "DNS",
                    linkId: "DNSCfgLink"
                },
                {
                    name: $.lang.pub["portConfig"],
                    linkId: "portConfigLink"
                },
                {
                    name: "DDNS",
                    linkId: "DDNSConfigLink"
                },
                {
                    name: top.banner.isUN?$.lang.pub["myCloudName"]:"P2P",
                    linkId: "P2PConfigLink",
                    visible: top.banner.isSupportMycloud//原来的能力集对应mycloud
                },
                {
                    name: $.lang.pub["emailConfigTitle"],
                    linkId: "emailConfigLink",
                    visible: top.banner.isSupportEmail
                },
                {
                    name: "SNMP",
                    linkId: "snmpConfigLink",
                    visible: top.banner.isSupportSNMP
                },
                {
                    name: "802.1x",
                    linkId: "IEEE8021xLink",
                    visible: top.banner.isSuppprtIEEE8021x
                },
                {
                    name: $.lang.pub["sslVpnCfgTitle"],
                    linkId: "sslVpnCfgLink",
                    visible: top.banner.isSupportSSLVPN && illegalConfigTabVisible
                }
            ]
        },
        {
            moduleName: (top.banner.isSupportAudio) ? $.lang.pub["audioAndVideoTitle"] : $.lang.pub["videoTitle"],   //音视频
            className: "icon audio_video",
            idName:"audio_video",
            menulist: [
                {
                    name: $.lang.pub["videoTitle"],
                    linkId: "videoLink",
                    visible: !top.banner.isSupportFishEye
                },
                {
                    name: $.lang.pub["videoTitle"],
                    linkId: "pearEyeLink",
                    visible: top.banner.isSupportFishEye
                },
                {
                    name: $.lang.pub["snapshotTitle"],
                    linkId: "alarmCaptureLink",
                    visible: top.banner.isRefactor && top.banner.isSupportBasicCapture
                },
                {
                    name: $.lang.pub["soundBoxTitle"],
                    linkId: "soundBoxLink",
                    visible: top.banner.isSupportAudio
                },
                {
                    name: $.lang.pub["roiTitle"],
                    linkId: "roiLink",
                    visible: top.banner.isSupportRoi
                },
                {
                    name: $.lang.pub["streamTitle"],
                    linkId: "streamLink"
                }
            ]
        },
        {
            moduleName: $.lang.pub["ptzCfgTitle"],   // 云台
            className: "icon ptz_position",
            idName:"ptz_position",
            menulist:[
                {
                    name:$.lang.pub["watchPosition"],
                    linkId:"ptzCfgLink",
                    visible: top.banner.isSupportPTZ
                },
                {
                    name:$.lang.pub["PTZLimit"],
                    linkId:"ptzLimitLink",
                    visible: top.banner.isSupportPTZ && top.banner.isSupportLimitPTZ
                },
                {
                    name:$.lang.pub["netCtrlPtz"],
                    linkId:"ptzCfgNetctrlLink",
                    visible: top.banner.isSupportPTZ && top.banner.isSupportBasicCapture && !top.banner.isSupportHDMM
                },
                {
                    name:$.lang.pub["cruiseCfg"],
                    linkId:"cruiseCfgLink",
                    visible: top.banner.isSupportPTZ && !top.banner.isSupportHDMM
                },
                {
                    name:$.lang.pub["advancedParam"],
                    linkId:"ptzcmdRelationLink",
                    visible: top.banner.isSupportHDMM
                }
            ]
        },
        {
            moduleName: $.lang.pub["imageTitle"],   //图像
            className: "icon img",
            idName:"img",
            menulist: [
                {
                    name: $.lang.pub["imgConfigTitle"],
                    linkId: "imgCfgLink",
                    visible: !top.banner.isSupportHDMM
                },
                {
                    name: "OSD",
                    linkId: "osdLink"
                },
                {
                    name: $.lang.pub["coverOsdTitle"],
                    linkId: "maskLink",
                    visible: top.banner.isSupportCoverOsd
                }
            ]
        },
        {
            moduleName: $.lang.pub["ivaTitle"], //智能监控
            className: "icon iva",
            idName:"iva",
            visible: top.banner.isSupportIVA || top.banner.isSupportIvaPark || top.banner.isSupportSmart|| top.banner.isSupoortHeatMap || top.banner.isSupportSmartTrack|| top.banner.isSupportPersonPhoto || top.banner.isSupportsystemSetUpLink,

            menulist: [
                {
                    name: $.lang.pub["IntelligentMenuCfg"],
                    linkId: "IntelligentMenuCfgLink",
                    visible: (!top.banner.isSupportIpcCapture) && (top.banner.isSupportSmartAlarm ||(isSupportPerson_Capture||top.banner.isSupportFaceDetection || top.banner.isSupportFaceQualityPro) || top.banner.isSupportSmartPeopleCount || top.banner.isSupportSmartTrack || top.banner.isSupoortHeatMap)
                },
                {
                    name: $.lang.pub["sceneTitle"],
                    linkId: "ivaSceneManagerLink",
                    visible: !ivaCaptureVisible && !ivaPersonCountVisible && !top.banner.isSupportIvaPark && !top.banner.isSupportSmart && !top.banner.isSupoortHeatMap && !top.banner.isSupportSmartTrack && !top.banner.isSupportsystemSetUpLink
                },
                {
                    name: $.lang.pub["sceneCruiseTitle"],
                    linkId: "sceneCruiseLink",
                    visible: !ivaCaptureVisible && !ivaPersonCountVisible && !top.banner.isSupportIvaPark && !top.banner.isSupportSmart && !top.banner.isSupoortHeatMap && !top.banner.isSupportSmartTrack && !top.banner.isSupportsystemSetUpLink
                },
                {
                    name: $.lang.pub["ivaPersonCountTitle"],
                    linkId : "ivaPersonCountLink",
                    visible : ivaPersonCountVisible
                },
                {
                    name: $.lang.pub["advancedParam"],
                    linkId: "ivaAdvancedLink",
                    visible: (illegalConfigPageVisible && !top.banner.isSupportIpcCapture) || (top.banner.isSupportSmartAlarm && top.banner.isSupportSmartAdvanceParam)
                },
                {
                    name: $.lang.pub["smartTraffic"],
                    linkId: "smartTrafficLink",
                    visible: top.banner.isSupportIpcCapture
                },
                {
                    name: $.lang.pub["intellisenseTitle"],
                    linkId: "intellisenseLink",
                    visible: top.banner.isSupportIntellisense
                }
            ]
        },
        {
            moduleName: $.lang.pub["alarmMangeTitle"],  //告警布防
            className: "icon alarm",
            idName:"alarm",
            visible: top.banner.isSupportAlarm,
            menulist: [
                {
                    name: $.lang.pub["commonAlarmTitle"],
                    linkId: "commonAlarmLink"
                }
            ]
        },
        {
            moduleName: $.lang.pub["storageTitle"], //存储
            className: "icon storage",
            idName:"storage",
            visible: top.banner.isSupportStorage ||((top.banner.isSupportBasicFTP) || ((top.banner.isSupportFTP && !top.banner.isSupportIvaPark) || top.banner.isSupportPersonPhoto || top.banner.isSupportFaceDetection)),
            menulist: [
                {
                    name: $.lang.pub["storageCfg"],
                    linkId: "storageManagerLink",
                    visible: top.banner.isSupportStorage
                },
               {
                    name: $.lang.pub["ftpConfigTitle"],
                    linkId: "FtpConfigLink",
                    visible: (top.banner.isSupportBasicFTP) || ((top.banner.isSupportFTP && !top.banner.isSupportIvaPark) || top.banner.isSupportPersonPhoto || top.banner.isSupportFaceDetection)
                }
            ]
        },
        {
            moduleName: $.lang.pub["SecurityCfgTitle"], //安全
            className: "icon Security",
            idName:"Security",
            menulist: [
                {
                    name: $.lang.pub["userCfgTitle"],
                    linkId: "userCfgLink"
                },
                {
                    name: $.lang.pub["networkSecurityTitle"],
                    linkId: "networkSecCfgLink"
                // },
                // {
                //     name: $.lang.pub["registInfoTitle"],
                //     linkId: "registInfoLink"
                // },
                // {
                //     name: $.lang.pub["waterMark"],
                //     linkId: "waterMarkLink"
                }
            ]
        },
        {
            moduleName: $.lang.pub["systemMangeTitle"], //系统
            className: "icon system",
            idName:"system",
            menulist: [
                {
                    name: $.lang.pub["time"],
                    linkId: "timeCfgLink"
                },
                {
                    name: $.lang.pub["serverCfgTitle"],
                    linkId: "serverLink",
                    visible:top.banner.isSupportVM || top.banner.isSupportJPEG || (top.banner.isSupportSmartTmsServer || top.banner.isSupportSmartUDPServer)
                },
                {
                    name: $.lang.pub["externalDevice"],
                    linkId: "externalDeviceLink",
                    visible: isSupportExternalDevice
                },
                {
                    name: $.lang.pub["systemMaintenanceTitle"],
                    linkId: "systemMaintenanceLink"
                },
                {
                    name: $.lang.pub["systemSetUpTitle"],
                    linkId: "systemSetUpLink",
                    visible: top.banner.isSupportsystemSetUpLink
                },
                {
                    name: $.lang.pub["operateLogTitle"],
                    linkId: "operateLogLink",
                    defaultVisible: (1 == top.banner.enhanceMode)
                },
                {
                    name: $.lang.pub["fisheyecfg"],
                    linkId: "fisheyeLink",
                    visible:top.banner.isSupportFishEye
                },
                {
                    name: $.lang.pub["FishGun"],
                    linkId: "fishgunLink",
                    visible:top.banner.isSupportFishGun
                }
            ]
        },
        {
            moduleName: $.lang.pub["funDemoTitle"], //功能演示
            visible: isSupportDemo,
            defaultVisible: false,
            menulist: [
                {
                    name: $.lang.pub["otherCfg"],
                    linkId: "demoFuncLink"
                },
                {
                    name: $.lang.pub["osdAdvancedParam"],
                    linkId: "demoOSDLink"
                },
                {
                    name: $.lang.pub["onvifDebugger"],
                    linkId: "onvifDebuggerLink"
                },
                {
                    name: $.lang.pub["demoPtz"],
                    linkId: "demoPtzLink",
                    visible: top.banner.isSupportDemoPtz
                },
                {
                    name: $.lang.pub["intellisenseOtherTitle"],
                    linkId: "intellisenseOtherLink",
                    visible: top.banner.isSupportIntellisense
                },
                {
                    name: $.lang.pub["DebugLog"],
                    linkId: "DebugLogLink"
                }
            ]
        }
    ];

    MenuTabMap = {
        navigationLink: [
            {
                name: $.lang.pub["navigationTitle"],
                linkId: "navigationTab",
                web_id: "navigation.htm",
                pageType: 0
            }
        ],
        Com_networkConfigLink: [
            {
                name: $.lang.pub["wired"],
                linkId: "Com_TCPIPTab",
                web_id: "network_system.htm",
                pageType: 1
            }
        ],
        Com_timeCfgLink: [
            {
                name: $.lang.pub["time"],
                linkId: "Com_timeCfgTab",
                web_id: "time_config.htm",
                pageType: 1
            },
            {
                name: $.lang.pub["DST"],
                linkId: "Com_dstCfgTab",
                web_id: "dst_config.htm",
                pageType: 1,
                visible:top.banner.isSupportDST
            }
        ],
        Com_serverLink: [
            {
                name: $.lang.pub["managementServer"],
                linkId: "Com_managementServerTab",
                web_id: "management_server.htm",
                pageType: 1,
                visible:top.banner.isSupportVM
            },
            {
                name: $.lang.pub["photoServer"],
                linkId: "Com_photoServerTab",
                web_id: "photo_server.htm",
                pageType: 1,
                visible: top.banner.isSupportJPEG && VersionType.PRJ != top.banner.versionType && !top.banner.isSupportIpcCapture
            },
            {
                name: $.lang.pub["smartServer"],
                linkId: "Com_smartServerTab",
                web_id: "smart_server.htm",
                pageType: 1,
                visible:  top.banner.isSupportSmartTmsServer || top.banner.isSupportSmartUDPServer
            }
        ],
        Com_osdLink: [
            {
                name: $.lang.pub["live"],
                linkId: "Com_osdTab",
                web_id: "operate_osd.htm",
                pageType: 1
            },
            {
                name: $.lang.pub["grabImg"],
                linkId: "Com_osdJPEGTab",
                web_id: "operate_osd_jpeg.htm",
                pageType: 1,
                visible: top.banner.isSupportCapture
            }
        ],
        Com_userCfgLink: [
            {
                name: $.lang.pub["userCfgTitle"],
                linkId: "Com_userCfgTab",
                web_id: "system_passwd.htm",
                pageType: 1
            }
        ],
        networkConfigLink: [
            {
                 name: $.lang.pub["wired"],
                 linkId: "TCPIPTab",
                 web_id: "network_system.htm",
                 pageType: 0
            },
            {
                name: "4G",
                linkId: "4GCfgTab",
                web_id: "4G_config.htm",
                visible: top.banner.isSupportNet4G
            },
            //{
            //    name: $.lang.pub["wifiConfigTitle"],
            //    linkId: "wifiTab",
            //    web_id: "wifi_config.htm",
            //    visible: true
            //},
            {
                name: $.lang.pub["wifiConfigTitle"],
                linkId: "softAPCfgTab",
                web_id: "softAP_config.htm",
                visible:top.banner.isSupportSoftAPWiFi || top.banner.isSupportNormalWiFi || top.banner.isSupportSnifferWIFI
            }

        ],
        UNPCfgLink: [
            {
                name: "UNP",
                linkId: "UNPTab",
                web_id: "UNP.htm",
                visible:top.banner.isSupportUNP
            }
        ],
        DNSCfgLink: [
            {
                name: "DNS",
                linkId: "DNSTab",
                web_id: "DNS.htm"
            }
        ],
        snmpConfigLink: [
            {
                name: "SNMP",
                linkId: "SNMPCfgTab",
                web_id: "snmp.htm",
                visible: top.banner.isSupportSNMP
            }
        ],

        IEEE8021xLink: [
            {
                name: "802.1x",
                linkId: "IEEE8021xCfgTab",
                web_id: "IEEE8021x.htm",
                visible: top.banner.isSuppprtIEEE8021x
            }
        ],
        portConfigLink: [
             {
                 name: $.lang.pub["PortCfgTitle"],
                 linkId: "portCfgTab",
                 web_id: "port_config.htm",
                 visible:top.banner.isSupportPortCfg
             },
            {
                name: $.lang.pub["portMapCfgTitle"],
                linkId: "portMapCfgTab",
                web_id: "port_map.htm"
            }
        ],
        DDNSConfigLink: [
            {
                name: "DDNS",
                linkId: "DDNSConfigTab",
                web_id: "ddns_config.htm"
            }
        ],
        P2PConfigLink: [
                         {
                             name: top.banner.isUN?$.lang.pub["myCloudName"]:"P2P",
                             linkId: "P2PConfigTab",
                             web_id: "p2p_config.htm"
                         }
                     ],
        upnpConfigLink: [
            {
                name: "UPnP",
                linkId: "upnpConfigTab",
                web_id: "upnp_config.htm"
            }
        ],
        emailConfigLink: [
            {
                name: $.lang.pub["emailConfigTitle"],
                linkId: "emailConfigTab",
                web_id: "email_config.htm",
                visible: top.banner.isSupportEmail
            }
        ],
        sslVpnCfgLink: [
            {
                name: $.lang.pub["sslVpnCfgTitle"],
                linkId: "sslVpnCfgTab",
                web_id: "sslvpn_config.htm"
            }
        ],
        videoLink: [
            {
                name: $.lang.pub["videoTitle"],
                linkId: "videoTab",
                web_id: "operate_video.htm",
                pageType: 0,
                visible: !top.banner.isSupportFishEye
            }
        ],
        pearEyeLink: [
            {
                name: $.lang.pub["videoTitle"],
                linkId: "fishEyeEncodeTab",
                web_id: "operate_fishEyeEncode.htm",
                visible: top.banner.isSupportFishEye
            }
        ],
        alarmCaptureLink: [
          {
              name: $.lang.pub["snapshotTitle"],
              linkId: "alarmCaptureTab",
              web_id: "alarm_capture.htm",
              visible: top.banner.isSupportBasicCapture
          }
        ],
        soundBoxLink: [
            {
                name: $.lang.pub["soundBoxTitle"],
                linkId: "soundBoxTab",
                web_id: "operate_sound.htm",
                visible: top.banner.isSupportAudio
            }
        ],
        roiLink: [
            {
                name: $.lang.pub["roiTitle"],
                linkId: "roiTab",
                web_id: "operate_roi.htm",
                visible: top.banner.isSupportRoi
            }
        ],
        streamLink: [
            {
                name: $.lang.pub["streamTitle"],
                linkId: "streamTab",
                web_id: "operate_stream.htm",
                visible: top.banner.isSupportMediaStream
            },
            {
                name: $.lang.pub["multicastTitle"],
                linkId: "multicastTab",
                web_id: "operate_multicast.htm"
            }
        ],
        ptzCfgLink:[
            {
                name:$.lang.pub["watchPosition"],
                linkId:"ptzCfgTab",
                web_id:"ptz_config.htm"
            }
        ],
        ptzCfgNetctrlLink:[
            {
                name:$.lang.pub["netCtrlPtz"],
                linkId:"PTZConfigNetctrlTab",
                web_id:"ptz_config_netctrl.htm"
            }
        ],
        cruiseCfgLink:[
           {
               name:$.lang.pub["cruiseCfg"],
               linkId:"cruiseCfgTab",
               web_id:"cruise_config.htm"
           }
       ],
        ptzcmdRelationLink:[
            {
                name:$.lang.pub["advancedParam"],
                linkId:"ptzcmdRelationTab",
                web_id:"ptzcmd_relation.htm"
            }
        ],
        ptzLimitLink:[
            {
                name:$.lang.pub["PTZLimit"],
                linkId:"PTZLimitTab",
                web_id:"ptz_limit.htm"
            }
        ],
        imgCfgLink: [
            {
                name: $.lang.pub["imgConfigTitle"],
                linkId: "imgConfigTab",
                web_id: "img_config.htm",
                pageType: 0
            }
        ],
        osdLink: [
            {
                name: $.lang.pub["live"],
                linkId: "osdTab",
                web_id: "operate_osd.htm"
            },
            {
                name: $.lang.pub["grabImg"],
                linkId: "osdJPEGTab",
                web_id: "operate_osd_jpeg.htm",
                pageType: 0,
                visible: top.banner.isSupportCapture
            }
        ],
        maskLink: [
            {
                name: $.lang.pub["coverOsdTitle"],
                linkId: "maskTab",
                web_id: "operate_mask.htm",
                visible: top.banner.isSupportCoverOsd
            }
        ],
        IntelligentMenuCfgLink:[
            {
                name: $.lang.pub["IntelligentMenuCfg"],
                linkId: "intelligentMenuCfgTab",
                web_id: "intelligentMenuCfg.htm"
            }
        ],
        ivaSceneManagerLink: [
            {
                name: $.lang.pub["sceneTitle"],
                linkId: "ivaSceneManagerTab",
                web_id: "iva_scene_manager.htm",
                visible: !ivaCaptureVisible && !ivaPersonCountVisible && !isSupportIvaPark && !top.banner.isSupportSmart
            }
        ],
        sceneCruiseLink: [
            {
                name: $.lang.pub["sceneCruiseTitle"],
                linkId: "sceneCruiseTab",
                web_id: "iva_scene_cruise.htm",
                visible: !ivaCaptureVisible && !ivaPersonCountVisible && !isSupportIvaPark && !top.banner.isSupportSmart
            }
        ],
        ivaAdvancedLink: [
            {
                name: $.lang.pub["photoParam"],
                linkId: "ivaPictureTab",
                web_id: "iva_picture.htm"
            },
            {

                name: $.lang.pub["SmartAdvanceParam"],
                linkId: "smartAdvanceParamTab",
                web_id: "smart_advanceParam.htm",
                visible: top.banner.isSupportSmartAdvanceParam
            }
        ],
        smartTrafficLink:[
            {
                name: $.lang.pub["intelligentCfg"],
                linkId: "intelligentTab",
                web_id: "operate_intelligent.htm"
            },
            {
                name: $.lang.pub["captureImgProcTitle"],
                linkId: "captureImgProcTab",
                web_id: "operate_captureImgProc.htm"
            },
            {
                name: $.lang.pub["plateParam"],
                linkId: "plateTab",
                web_id: "operate_videodetect.htm"
            },
            {
                name: $.lang.pub["projectParam"],
                linkId: "projectTab",
                web_id: "operate_project.htm"
            },
            {
                name: $.lang.pub["photo"],
                linkId: "osdJPEGTab1",
                web_id: "operate_osd_jpeg.htm",
                pageType: 2
            }
        ],
        intellisenseLink:[
            {
                name: $.lang.pub["intellisenseTitle"],
                linkId: "intellisenseTab",
                web_id: "intellisense_config.htm",
                visible: top.banner.isSupportIntellisense
            }
        ],
        smartPeopleCountLink:[
              {
                  name:$.lang.pub["smartPeopleCount"],
                  linkId: "smartPeopleCountTab",
                  web_id: "smart_peoplecount.htm",
                  visible:top.banner.isSupportSmartPeopleCount
              }
        ],
        smartTrackLink: [
            {
                  name:$.lang.pub["smartTrackLink"],
                  linkId: "smartTrackTab",
                  web_id: "smart_track.htm",
                  visible:top.banner.isSupportSmartTrack
            }
        ],
        heatMapLink: [
            {
                name: $.lang.pub["heatMap"],
                linkId: "heatMapTab",
                web_id: "heatmap_config.htm",
                visible: top.banner.isSupoortHeatMap
            }
        ],
        ivaCaptureLink: [
            {
                name: $.lang.pub["ivaCaptureTitle"],
                linkId: "ivaCaptureTab",
                web_id: "iva_capture.htm",
                visible: isSupportPerson_Capture||top.banner.isSupportFaceDetection || top.banner.isSupportFaceQualityPro
            }
        ],
        ivaPersonCountLink: [
            {
                name: $.lang.pub["ivaPersonCountTitle"],
                linkId : "ivaPersonCountTab",
                web_id : "iva_person_count.htm",
                visible : ivaPersonCountVisible
            }
        ],
        ivaParkSceneLink: [
            {
                name: $.lang.pub["sceneTitle"],
                linkId: "ivaParkSceneTab",
                web_id: "iva_park_scene.htm",
                visible: top.banner.isSupportIvaPark
            }
        ],
        ivaLEDCtrlLink: [
            {
                name: $.lang.pub["ledCtrlTitle"],
                linkId: "ivaLEDCtrlTab",
                web_id: "iva_led_ctrl.htm",
                visible: top.banner.isSupportIvaPark
            }
        ],
        trafficLightLink: [
            {
                name: $.lang.pub["trafficLightCfg"],
                linkId: "trafficLightTab",
                web_id: "operate_trafficlight.htm",
                visible: trafficlightVisible
            }
        ],
        captureLink: [
            {
                name: $.lang.pub["captureCfg"],
                linkId: "captureTab",
                web_id: "operate_capture.htm",
                visible: top.banner.isSupportCapture
            }
        ],
       commonAlarmLink: [
            {
                name: $.lang.pub["motionDetectAlarmTitle"],
                linkId: "motionDetectAreaAlarmTab",
                web_id: "alarm_motion.htm",
                visible: top.banner.isSupportMotionDetection
            },
            {
                name: $.lang.pub["tamperDetectAlarmTitle"],
                linkId: "tamperDetectAlarmTab",
                web_id: "alarm_tamperdetect.htm",
                visible: top.banner.isSupportTamperDetect
            },
            {
                name: $.lang.pub["temperatureAlarmTitle"],
                linkId: "temperatureAlarmTab",
                web_id: "alarm_temperature.htm",
                pageType: 0,
                visible: top.banner.isSupportTemperatureDetect
            },
            {
                name: $.lang.pub["audioDetectAlarmTitle"],
                linkId: "audioDetectAlarmTab",
                web_id: "alarm_audiodetect.htm",
                visible: top.banner.isRefactor && top.banner.isSupportAudio
            },
            {
                name: $.lang.pub["switchInAlarmTitle"],
                linkId: "switchInAlarmTab",
                web_id: "alarm_switchin.htm",
                pageType: 0,
                visible: top.banner.isRefactor && top.banner.isSupportSwitchIn
            },
            {
                name: $.lang.pub["switchOutAlarmTitle"],
                linkId: "switchOutAlarmTab",
                web_id: "alarm_switchout.htm",
                pageType: 0,
                visible: top.banner.isRefactor && top.banner.isSupportSwitchOut
            }
        ],
        sceneChangeLink:[
            {
                name: $.lang.pub["sceneChangeTitle"],
                linkId: "sceneChangeTab",
                web_id: "smart_scenedetect.htm",
                pageType: 1,
                visible: top.banner.isSupportSceneChange
            }
        ],
        virtualFocusLink:[
            {
                name: $.lang.pub["virtualFocusTitle"],
                linkId: "virtualFocusTab",
                web_id: "smart_scenedetect.htm",
                pageType: 0,
                visible: top.banner.isSupportOutFocus
            }
        ],
        faceDetectLink:[
            {
                name: $.lang.pub["faceDetectTitle"],
                linkId: "faceDetectTab",
                web_id: "smart_facedetect.htm",
                visible: top.banner.isSupportFaceDetect
            }
        ],
        smartChainLink:[
            {
                name: $.lang.pub["Chain_Calculation"],
                linkId: "chainCfgTab",
                web_id: "smart_chain.htm",
                visible: top.banner.isSupportChain
            }
        ],
        crossBorderLink:[
            {
                name: $.lang.pub["crossBorderTitle"],
                linkId: "crossBorderTab",
                web_id: "smart_areadetect.htm",
                pageType: 0,
                visible: top.banner.isSupportCrossLine
            }
        ],
        areaStayLink:[
            {
                name: $.lang.pub["ruleType_stay"],
                linkId: "areaStayTab",
                web_id: "smart_areadetect.htm",
                pageType: 1,
                visible: top.banner.isSupportIntrosionZone
            }
        ],
        enterAreaLink:[
            {
                name: $.lang.pub["enterArea"],
                linkId: "enterAreaTab",
                web_id: "smart_areadetect.htm",
                pageType: 2,
                visible: top.banner.isSupportEnterZone
            }
        ],
        leaveAreaLink:[
            {
                name: $.lang.pub["leaveArea"],
                linkId: "leaveAreaTab",
                web_id: "smart_areadetect.htm",
                pageType: 3,
                visible: top.banner.isSupportLeafeZone
            }
        ],
        wnderDetectLink:[
            {
                name: $.lang.pub["wanderDetect"],
                linkId: "wanderDetectTab",
                web_id: "smart_areadetect.htm",
                pageType: 4,
                visible: top.banner.isSupportWanderDetect
            }
        ],
        peoplegatherLink:[
            {
                name: $.lang.pub["peopleGather"],
                linkId: "peopleGatherTab",
                web_id: "smart_areadetect.htm",
                pageType: 5,
                visible: top.banner.isSupportPeopleGather
            }
        ],
        fastMoveLink:[
            {
                name: $.lang.pub["fastMove"],
                linkId: "fastMoveTab",
                web_id: "smart_areadetect.htm",
                pageType: 6,
                visible: top.banner.isSupportFastMove
            }
        ],
        parkDetectLink:[
            {
                name: $.lang.pub["parkDetect"],
                linkId: "parkDetectTab",
                web_id: "smart_areadetect.htm",
                pageType: 7,
                visible: top.banner.isSupportParkDetect
            }
        ],
        leftGoodLink:[
            {
                name: $.lang.pub["leftGood"],
                linkId: "leftGoodTab",
                web_id: "smart_areadetect.htm",
                pageType: 8,
                visible: top.banner.isSupportLeftGood
            }
        ],
        handerGoodLink:[
            {
                name: $.lang.pub["handleGood"],
                linkId: "handleGoodTab",
                web_id: "smart_areadetect.htm",
                pageType: 9,
                visible: top.banner.isSupportHandleGood
            }
        ],
        smartAlarmLink: [
            {
                name: $.lang.pub["crossBorderTitle"],
                linkId: "crossBorderTab",
                web_id: "smart_areadetect.htm",
                pageType: 0,
                visible: top.banner.isSupportCrossLine
            },
            {
                name: $.lang.pub["ruleType_stay"],
                linkId: "areaStayTab",
                web_id: "smart_areadetect.htm",
                pageType: 1,
                visible: top.banner.isSupportIntrosionZone
            },
            {
                name: $.lang.pub["enterArea"],
                linkId: "enterAreaTab",
                web_id: "smart_areadetect.htm",
                pageType: 2,
                visible: top.banner.isSupportEnterZone
            },
            {
                name: $.lang.pub["leaveArea"],
                linkId: "leaveAreaTab",
                web_id: "smart_areadetect.htm",
                pageType: 3,
                visible: top.banner.isSupportLeafeZone
            },
            {
                name: $.lang.pub["wanderDetect"],
                linkId: "wanderDetectTab",
                web_id: "smart_areadetect.htm",
                pageType: 4,
                visible: top.banner.isSupportWanderDetect
            },
            {
                name: $.lang.pub["peopleGather"],
                linkId: "peopleGatherTab",
                web_id: "smart_areadetect.htm",
                pageType: 5,
                visible: top.banner.isSupportPeopleGather
            },
            {
                name: $.lang.pub["fastMove"],
                linkId: "fastMoveTab",
                web_id: "smart_areadetect.htm",
                pageType: 6,
                visible: top.banner.isSupportFastMove
            },
            {
                name: $.lang.pub["parkDetect"],
                linkId: "parkDetectTab",
                web_id: "smart_areadetect.htm",
                pageType: 7,
                visible: top.banner.isSupportParkDetect
            },
            {
                name: $.lang.pub["leftGood"],
                linkId: "leftGoodTab",
                web_id: "smart_areadetect.htm",
                pageType: 8,
                visible: top.banner.isSupportLeftGood
            },
            {
                name: $.lang.pub["handleGood"],
                linkId: "handleGoodTab",
                web_id: "smart_areadetect.htm",
                pageType: 9,
                visible: top.banner.isSupportHandleGood
            }, 
            {
                name: $.lang.pub["virtualFocusTitle"],
                linkId: "virtualFocusTab",
                web_id: "smart_scenedetect.htm",
                pageType: 0,
                visible: top.banner.isSupportOutFocus
            },
            {
                name: $.lang.pub["sceneChangeTitle"],
                linkId: "sceneChangeTab",
                web_id: "smart_scenedetect.htm",
                pageType: 1,
                visible: top.banner.isSupportSceneChange
            },
            {
                name: $.lang.pub["faceDetectTitle"],
                linkId: "faceDetectTab",
                web_id: "smart_facedetect.htm",
                visible: top.banner.isSupportFaceDetect
            },
            {
                name: $.lang.pub["Chain_Calculation"],
                linkId: "chainCfgTab",
                web_id: "smart_chain.htm",
                visible: top.banner.isSupportChain
            },
            {
                name: $.lang.pub["advancedParam"],
                linkId: "smartAdvanceParamTab",
                web_id: "smart_advanceParam.htm",
                visible: top.banner.isSupportSmartAdvanceParam
            }
        ],
        storageManagerLink: [
            {
                name: $.lang.pub["storageCfg"],
                linkId: "storageManagerTab",
                web_id: "operate_storage.htm"
            }
        ],
        FtpConfigLink: [
            {
                name: $.lang.pub["basicFTPTitle"],
                linkId: "ftpConfigTab",
                web_id: "ftp_config.htm",
                visible: top.banner.isSupportBasicFTP,
                pageType: 0
            },
            {
                name: $.lang.pub["smartFTPTitle"],
                linkId: "ivaFtpConfigTab",
                web_id: "ftp_config.htm",
                visible: (top.banner.isSupportFTP && !top.banner.isSupportIvaPark) || top.banner.isSupportPersonPhoto || top.banner.isSupportFaceDetection || top.banner.isSupportFaceQualityPro,
                pageType: 1
            }

        ],
        networkSecCfgLink: [
            {
                name: $.lang.pub["Https"],
                linkId: "httpsCfgTab",
                web_id: "https_config.htm",
                visible: top.banner.isSupportHttps
            },
            {
                name: $.lang.pub["RTSPAuthMode"],
                linkId: "authenticationTab",
                web_id: "authentication_config.htm"
            },
            {
                name: $.lang.pub["staticARP"],
                linkId: "staticARPTab",
                web_id: "static_arp.htm"
            },
            {
                name: $.lang.pub["ipFilter"],
                linkId: "ipFilterTab",
                web_id: "ip_filter_config.htm"
            },
            {
                name: $.lang.pub["SafeConfig"],
                linkId: "telnetCfgTab",
                web_id: "telnet_config.htm"
            }
        ],
        userCfgLink:[
            {
                name: $.lang.pub["userCfgTitle"],
                linkId: "userCfgTab",
                web_id: "system_passwd.htm"
            }
        ],
        // registInfoLink:[
        //     {
        //         name: $.lang.pub["registInfoTitle"],
        //         linkId: "registInfoTab",
        //         web_id: "system_regist_info.htm"
        //     }
        // ],
        // waterMarkLink: [
        //     {
        //         name: $.lang.pub["waterMark"],
        //         linkId: "waterMarkTab",
        //         web_id: "water_mark.htm"
        //     }
        // ],
        timeCfgLink: [
            {
                name: $.lang.pub["time"],
                linkId: "timeCfgTab",
                web_id: "time_config.htm"
            },
            {
                name: $.lang.pub["DST"],
                linkId: "dstCfgTab",
                web_id: "dst_config.htm",
                visible: top.banner.isSupportDST
            }
        ],
        serverLink: [
            {
                name: $.lang.pub["managementServer"],
                linkId: "managementServerTab",
                web_id: "management_server.htm",
                visible:top.banner.isSupportVM
            },
            {
                name: $.lang.pub["photoServer"],
                linkId: "photoServerTab",
                web_id: "photo_server.htm",
                visible: top.banner.isSupportJPEG && VersionType.PRJ != top.banner.versionType && !top.banner.isSupportIpcCapture && !top.banner.isSupportTrafficFlow
            },
            {
                name: $.lang.pub["smartServer"],
                linkId: "smartServerTab",
                web_id: "smart_server.htm",
                visible: top.banner.isSupportSmartTmsServer || top.banner.isSupportSmartUDPServer
            }
        ],
        externalDeviceLink: [
            {
                name: $.lang.pub["COMTitle"],
                linkId: "COMTab",
                web_id: "operate_ptz_rs.htm",
                visible: top.banner.isSupportSerial
            },
            {
                name: $.lang.pub["LightCfg"],
                linkId: "filllightTab",
                web_id: "filllight_config.htm",
                visible:top.banner.isSupportLED
            },
            {
                name: $.lang.pub["switchInTitle"],
                linkId: "switchInBasicTab",
                web_id: "alarm_switchin.htm",
                visible: top.banner.isSupportBasicSwitchIn,
                pageType: 1
            },
            {
                name: $.lang.pub["switchOutTitle"],
                linkId: "switchOutBasicTab",
                web_id: "alarm_switchout.htm",
                visible: top.banner.isSupportBasicSwitchOut,
                pageType: 1
            },
            {
                name: $.lang.pub["equipmentConfigTitle"],
                linkId: "equipmentConfigTab",
                web_id: "equipment_config.htm",
                visible: isSupportRainbrush && (-1 == isContainsElement(2, rainbrushModeList))
            }
        ],
        systemMaintenanceLink: [
            {
                name: $.lang.pub["systemMaintenanceTitle"],
                linkId: "systemMaintenanceTab",
                web_id: "config_manage.htm"
            },
            {
                name: $.lang.pub["temperatureTitle"],
                linkId: "temperatureBasicTab",
                web_id: "alarm_temperature.htm",
                visible: top.banner.isSupportBasicTemperature,
                pageType: 1
            }
        ],
        systemSetUpLink: [
            {
                name: $.lang.pub["systemSetUpTitle"],
                linkId: "systemSetUpTab",
                web_id: "system_Setup.htm",
                visible:top.banner.isSupportsystemSetUpLink
            }
        ],
        operateLogLink: [
             {
                 name: $.lang.pub["operateLogTitle"],
                 linkId: "operateLogTab",
                 web_id: "operate_log.htm"
             }
         ],      
        fisheyeLink: [
            {
                name: $.lang.pub["fisheyecfg"],
                linkId: "fisheyeTab",
                web_id: "FishEyeCfg.htm"
            }
        ],
        fishgunLink: [
                      {
                          name: $.lang.pub["FishGun"],
                          linkId: "fishgunTab",
                          web_id: "FishGun_cfg.htm"
                      }
                  ],
        LocalCfgLink: [
            {
                name: $.lang.pub["LocalCfgTitle"],
                linkId: "LocalCfgTab",
                web_id: "client_settings.htm"
            }
        ],
        
        demoFuncLink: [
            {
                name: $.lang.pub["otherCfg"],
                linkId: "demoFuncTab",
                web_id: "demo_func.htm",
                visible: top.banner.isSupportDemo || (VersionType.PRJ == top.banner.versionType)
            }
        ],
        DebugLogLink: [
            {
                name: $.lang.pub["DebugLog"],
                linkId: "DebugLogTab",
                web_id: "debug_logs.htm"
            }
        ],
        demoOSDLink: [
           {
               name: $.lang.pub["osdAdvancedParam"],
               linkId: "demoOsdTab",
               web_id: "demo_osd.htm"
           }
       ],
       onvifDebuggerLink: [
           {
               name: $.lang.pub["onvifDebugger"],
               linkId: "onvifTestTab",
               web_id: "onvif_test.htm"
           }
       ],
       demoPtzLink: [
           {
               name: $.lang.pub["demoPtz"],
               linkId: "demoPtzTab",
               web_id: "demo_ptz.htm",
               visible: top.banner.isSupportDemoPtz
           }
       ],
       debuggerRadarLink: [
            {
                name: $.lang.pub["radarCfg"],
                linkId: "debuggerRadarTab",
                web_id: "debugger_radar.htm",
                visible: top.banner.isSupportRadar
            }
        ],
        debuggerDetectorLink: [
            {
                name: $.lang.pub["detectorCfg"],
                linkId: "debuggerDetectorTab",
                web_id: "debugger_detector.htm",
                visible: !trafficlightVisible
            }
        ],
        debuggerLaserLink: [
            {
                name: $.lang.pub["laserCfg"],
                linkId: "debuggerLaserTab",
                web_id: "debugger_laser.htm",
                visible: top.banner.isSupportLaser
            }
        ],
        debuggerOthersLink: [
            {
                name: $.lang.pub["otherCfg"],
                linkId: "debuggerOthersTab",
                web_id: "debugger_others.htm",
                visible: top.banner.isSupportDebugger && !illegalConfigTabVisible
            }
        ],
        intellisenseOtherLink: [
            {
                name: $.lang.pub["intellisenseOtherTitle"],
                linkId: "intellisenseOtherTab",
                web_id: "intellisense_other.htm",
                visible: top.banner.isSupportIntellisense
            }
        ]
    };

    if (top.banner.isRefactor) {
        delete MenuTabMap["motionDetectAlarmLink"];
        delete MenuTabMap["tamperDetectAlarmLink"];
        delete MenuTabMap["faceDetectAlarmLink"];
        delete MenuTabMap["temperatureAlarmLink"];
        delete MenuTabMap["audioDetectAlarmLink"];
        delete MenuTabMap["switchInAlarmLink"];
        delete MenuTabMap["switchOutAlarmLink"];
    } else {
        delete MenuTabMap["commonAlarmLink"];
        delete MenuTabMap["smartAlarmLink"];
    }
}


//定义了跳转界面的ID
var menuDefaultPage = {
 0 : "TCPIPTab", // TCP/IP
 1 : "videoTab", // 编码
 2 : "motionDetectAreaAlarmTab", // 运动检测
 3 : "systemMaintenanceTab", // 设备维护
 4 : "DDNSConfigTab", // mycloud
 5 : "osdTab", // OSD设置
 6 : "roiTab", // 区域增强
 7 : "imgConfigTab", // 图像设置
 8 : "audioDetectAlarmTab", // 声音异常告警
 9 : "tamperDetectAlarmTab", // 遮挡检测告警
 10 : "wifiTab", // wifi设置
 11 : "COMTab", // 串口设置
 12 : "", // 透明通道设置已删除
 13 : "filllightTab", // 补光灯设置
 14 : "managementServerTab", // 系统设置
 15 : "soundBoxTab", // 音频设置
 16 : "captureTab", // 抓拍设置
 17 : "peccancyCaptureTab", // 违章设置
 18 : "trafficLightTab", // 交通灯设置
 19 : "plateTab", // 视频检测
 20 : "intelligentTab", // 智能设置
 21 : "captureImgProcTab", // 图片处理
 22 : "ftpConfigTab", // FTP
 23 : "streamTab", // 流媒体
 24 : "osdJPEGTab", // OSD设置（照片）
 25 : "storageManagerTab", // 存储设置
 26 : "sceneCruiseTab", // 场景计划
 27 : "ivaSceneManagerTab", // 场景管理
 28 : "ivaPeccancyTab", // 智能违章类型
 29 : "ivaPictureTab", // 照片OSD
 30 : "temperatureAlarmTab", // 温度告警
 31 : "switchInAlarmTab", // 开关量输入告警
 32 : "switchOutAlarmTab", // 开关量输出控制
 33 : "userCfgTab", // 用户管理
 34 : "maskTab", // 隐私遮盖
 35 : "photo", // 照片
 36 : "debuggerRadarTab", // 雷达设置
 37 : "debuggerLaserTab", // 激光设置
 38 : "", // 透明通道（调试）已删除
 39 : "debuggerOthersTab", // 其他
 40 : "demoFuncTab", // 演示功能
 41 : "ivaCaptureTab", //人脸抓拍
 42 : "ivaPlateTab", // 车牌识别
 43 : "ivaPersonCountTab", // 人数统计
 44 : "faceDetectAlarmTab", // 人脸检测告警
 45 : "timeCfgTab", // 时间设置
 46 : "photoServerTab", // 照片服务器
 47 : "switchInBasicTab", // 开关量输入（基础配置）
 48 : "switchOutBasicTab", // 开关量输出（基础设置）
 49 : "temperatureBasicTab", // 温度设置（基础设置）
 50 : "portCfgTab",         //端口设置
 51 : "httpsCfgTab",        //https设置
 52 : "synpicCfgTab",       //照片合成设置
 53 : "dstCfgTab",           //夏令时设置
 54 : "ptzCfgTab" ,        //看守位设置
 55 : "operateRecordTab",   // 录像下载
 56 : "ivaCaptureImgProcTab",
 57 : "LocalCfgTab",        
 58 : "debuggerDetectorTab",
 59 : "SNMPCfgTab",        //snmp配置
 60 : "fishEyeEncodeTab",  // 鱼眼编码页面
 61 : "fisheyeTab",//鱼眼参数配置页面
 62 : "fishgunTab",//鱼眼枪模式切换页面
 63 : "peccancyTimeTab",//违章策略设置页面
 64 : "dataCollectTab",//交通数据采集
 65 : "trafficDataServerTab",//交通参数服务器
 66 : "ACSynchronismTab",//交流电同步设置页面
 67 : "MCCTransPortCfgTab",//相机通信设置页面
 69 : "noneCaptureTab",  //空抓拍
 70 :"playback",//回放頁面
 71 : "illegalParkingCaptureTab", //违停取证

 255 : "" // 无效值
};

function initMenu(){
    var template_modulemenu = $("#module-menu").html(),
        template_module = $("#module-item").html(),
        template_menu = $("#menu-item").html(),
        template_moduleEnd = $("#module-end").html(),
        i = 0,
        moduleInfo = null,
        menulist = null,
        j = 0,
        menulistLen = 0,
        menuInfo = null,
        menuStr = "",
        hiddenClass = "",
        menuInfoHiddenClass= "",
        result = "",
        menuList,
        len;

    initMenuParam();

    if (top.banner.isSupportHorizontalMenu) { //交通版
        menuList = Traffick_MenuinfoList;
    } else {
        menuList = MenuinfoList;
    }

    len = menuList.length;
    for ( ; i< len; i++) { //功能模块
         hiddenClass = "";
        moduleInfo = menuList[i];
        if (top.banner.isSupportHorizontalMenu) {
            if((UserType.Administrator != top.userType) && ("LocalCfgLink"!= moduleInfo["linkId"])) continue;
        }else{
            if((UserType.Administrator != top.userType) && ($.lang.pub["commonTitle"] != moduleInfo["moduleName"])) continue;
        }

        if(("undefined" != typeof moduleInfo["visible"]) && (false == moduleInfo["visible"])) continue;
        if(("undefined" != typeof moduleInfo["defaultVisible"]) && (false == moduleInfo["defaultVisible"])) {
            hiddenClass = "hidden";
        }

        if (top.banner.isSupportHorizontalMenu) {  //交通版
            result += template_modulemenu.replace(/{{hidden}}/g, hiddenClass).replace("{{linkId}}", moduleInfo["linkId"]).replace("{{name}}", moduleInfo["name"]);;
        } else {     //行业、分销版本
            menuStr = "";
            menulist = moduleInfo["menulist"];

            for (j = 0, menulistLen = menulist.length; j < menulistLen; j++) { //菜单项
                menuInfo = menulist[j];
                if(UserType.Administrator != top.userType) {//非管理员权限的用户，只具有本地配置的权限
                    if ("LocalCfgLink" == menuInfo["linkId"]) {
                        menuStr += template_menu.replace("{{hidden}}", menuInfoHiddenClass).replace("{{linkId}}", menuInfo["linkId"]).replace("{{name}}", menuInfo["name"]);
                        break;
                    }
                 } else {
                      if(("undefined" != typeof menuInfo["visible"]) && (false == menuInfo["visible"])) continue;
                      menuInfoHiddenClass= "";
                      if(("undefined" != typeof menuInfo["defaultVisible"]) && (false == menuInfo["defaultVisible"])) {
                          menuInfoHiddenClass = "hidden";
                      }
                      menuStr += template_menu.replace("{{hidden}}", menuInfoHiddenClass).replace("{{linkId}}", menuInfo["linkId"]).replace("{{name}}", menuInfo["name"]);
                }
            }

            if ("" != menuStr) {
                if ("undefined" == typeof moduleInfo["className"]) {
                    moduleInfo["className"] = "";
                }
                result += template_module.replace( "{{hidden}}", hiddenClass ).replace("{{className}}",
                        moduleInfo["className"]).replace("{{moduleName}}", moduleInfo["moduleName"]).replace("{{idName}}", moduleInfo["idName"]);
                result += menuStr; //模块分隔样式
                result += template_moduleEnd; //模块分隔样式
            }
        }
        
        if (top.banner.isSupportHorizontalMenu) {
            if((UserType.Administrator != top.userType) && ("LocalCfgLink"== moduleInfo["linkId"])) break;
        } else{
            if((UserType.Administrator != top.userType) && ($.lang.pub["commonTitle"] == moduleInfo["moduleName"])) break;
        }
    }

    $("#menuContent").html(result);
}

function initTabItems(linkID){
    var template_tab = $("#tab-item").html(),
        i = 0,
        result = "",
        tabList,
        len,
        tabInfo,
        url;

    if (top.banner.isSupportHorizontalMenu) {  //交通版
        tabList = Traffick_MenuTabMap[linkID];
    } else {
        tabList = MenuTabMap[linkID];
    }

    len = tabList.length;
     for (; i < len; i++) { //tab项
        tabInfo = tabList[i];
        if(("undefined" != typeof tabInfo["visible"]) && (false == tabInfo["visible"])) continue;
        url = "";
        for (n in tabInfo) {
            if ("name" != n && "linkId" != n && "web_id" != n && "visible" != n) {
                url += n + "=" + tabInfo[n] + "&";
            }
        }

        if ("" != url) {
            url = tabInfo["web_id"] + "?" + url.substring(0, url.length - 1);
        } else {
            url = tabInfo["web_id"];
        }

        result += template_tab.replace("{{linkId}}", tabInfo["linkId"]).replace("{{url}}",
                    url).replace("{{name}}", tabInfo["name"]);
    }

    //清除之前的
    var $configTitle = $("#configTitle");
    $configTitle.find("a").each(function(){$(this).remove();});
    //显示新的
    $configTitle.append(result);
}

function getModuleNameByTabID(tabID) {
    var menuMap = null,
        moduleName = "",
        n,
        tabList,
        len,
        i;

    if (top.banner.isSupportHorizontalMenu) {  //交通版
        menuMap = Traffick_MenuTabMap;
    } else {
        menuMap = MenuTabMap;
    }

    var tabMenuInfo;
    for(n in menuMap){
        tabList = menuMap[n];
        len = tabList.length;

        for(i = 0; i < len; i++){
            tabMenuInfo = tabList[i];
            if(tabID == tabMenuInfo["linkId"]){
                moduleName = n;
                break;
            }
        }

        if("" != moduleName){
            break;
        }
    }

    return moduleName;
}

function selectItem(item_name) {
    var moduleName = "";
    //修正从智能告警tab切换到实况，回放页面的实况窗口位置不对。
    var $mainIframedDiv = $("#main_iframed_div");
    $mainIframedDiv.removeClass("fullHeight_smart");
    var $menu = $("#menu");
    if (("live" == item_name) || ("playback" == item_name) || ("photo" == item_name)) {// 首页实况页面
        if ("block" == $menu.css("display")) {
            $menu.addClass("hidden");// 隐藏菜单
            $("#configTitle").addClass("hidden");// 隐藏导航页签
            $("#contentDiv").addClass("margin_0");// 横向拉伸首页
            $mainIframedDiv.removeClass("fullHeight");// 纵向拉伸首页
        }
        //选中
        $("li.nav-selected").removeClass("nav-selected");
        $("#" + item_name).addClass("nav-selected");
    } else {// 非首页功能页面
        if ((LoginType.VM_LOGIN == loginType) || (7 == menuType)){
            $mainIframedDiv.addClass("fullHeight_2");//恢复纵向高度
            return;
        }

        if ($menu.hasClass("hidden")) {
            $("#contentDiv").removeClass("margin_0");// 去除横向拉伸样式
            $mainIframedDiv.addClass("fullHeight");// 恢复纵向高度
            $menu.removeClass("hidden");// 显示菜单
            $("#configTitle").removeClass("hidden");//显示导航页签
        }
        //选中配置nav_tab
        $("li.nav-selected").removeClass("nav-selected");
        if (top.banner.isSupportHorizontalMenu &&
            ("deviceStatusTab" == item_name || "userCfgTab" == item_name || "systemMaintenanceTab" == item_name || "httpsCfgTab" == item_name ||
             "authenticationTab" == item_name || "registInfoTab" == item_name || "staticARPTab" == item_name || "noneCaptureTab" == item_name) ||
             "waterMarkTab" == item_name || "telnetCfgTab" == item_name) {
            $("#maintain").addClass("nav-selected");
        } else {
            $("#config").addClass("nav-selected");
        }

        //不在当前展开的模块
        moduleName = getModuleNameByTabID(item_name);
        var $moduleName = $("#" + moduleName);
        $moduleName.attr("data-defaultLink", item_name);
        if (!top.banner.isSupportHorizontalMenu) {
            $moduleName.parent("div").prev("div").trigger("click");
        }
        menuLink_click(moduleName,true);
    }
}

function menuLink_click(id, noJump) {
    var $obj = $("#" + id),
        defaultLink = $("#" + id).attr("data-defaultLink"),
        isSelected = false, //当前菜单是否已选中
        menuTabMap = null;

    if (top.banner.isSupportHorizontalMenu) { //交通版
        isSelected = $obj.hasClass("navigation-active");
        menuTabMap = Traffick_MenuTabMap;
    } else {
        isSelected = $obj.hasClass("menu-active");
        menuTabMap = MenuTabMap;
    }

    if (!isSelected) {
        // 菜单选中
        if (top.banner.isSupportHorizontalMenu) { //交通版
            $(".navigation-active").filter(function() {
                return !$(this).is(":hidden");
            }).removeClass("navigation-active");
            $obj.parent().addClass("navigation-active");
        } else {
            $(".menu-content a").removeClass("menu-active");
            $obj.addClass("menu-active");
        }

        // 生成tab菜单
        initTabItems(id);
        var index=0;
        while ("undefined" == typeof defaultLink) {
            if (undefined == menuTabMap[id][index]["visible"]  || menuTabMap[id][index]["visible"] == true) {
                defaultLink = menuTabMap[id][index]["linkId"];
            }
            index++;
        }
    }
    // 是否跳转到该界面
    if (!noJump) {
        if("IntelligentMenuCfgLink"== id){
            initTabItems(id);
            defaultLink = "intelligentMenuCfgTab";
        }
        if (checkNavigator("safari")) {
            safariClick(defaultLink);
        } else {
            $("#" + defaultLink)[0].click();
        }
    } else {
        menuTab_click(defaultLink);
    }
    //智能告警页面菜单栏特殊处理
    if ("smartAlarmLink" == id || (top.banner.isSupportHorizontalMenu && ("debuggerCfgLink" == id && parseInt(top.language)))) {
        $("#configTitle").removeClass("config-title-bg").addClass("config-title-bg-smart");
        $("#configTitle").find("a").removeClass("config-title").addClass("config-title-smart");
        $("#main_iframed_div").removeClass("fullHeight").addClass("fullHeight_smart");
    } else {
        $("#configTitle").removeClass("config-title-bg-smart").addClass("config-title-bg");
        $("#configTitle a").removeClass("config-title-smart").addClass("config-title");
        $("#main_iframed_div").addClass("fullHeight").removeClass("fullHeight_smart");
    }
    strLimit();
}

function menuTab_click(id) {
    var $id = $("#" + id);
    var linkId = $(".menu-content a.menu-active").attr("id"),
        tabId = $id.attr("id");

    if (top.banner.isSupportHorizontalMenu) { //交通版
        linkId = $(".navigation-active a").filter(function() {
            return !$(this).parent().hasClass("hidden");
        }).attr("id");;
        if(("imgConfigTab" == tabId) || ("videoTab" == tabId) || ("ivaSceneManagerTab" == tabId) || ("intelligentTab" == tabId) || ("ivaParkSceneTab" == tabId)){
            linkId = "localCfgLink";
            cfgLink();
            cfgLinkChange();
        }
    }
    $("#configTitle a").removeClass("menu-tab-active");
    $id.addClass("menu-tab-active");
    $("#" + linkId).attr("data-defaultLink", tabId);
}

function initMenuEvent() {
    //功能模块点击事件
    $('.menu-title-text').bind("click", function() {
        var top = GetTopWindow();
        top.document.title = $.trim($(this).children("a").text());
        if (top.banner.isSupportHorizontalMenu) { //交通版
            var id = $(this).children("a").attr("id");
            menuLink_click(id);
        } else {
            if (!$(this).next("div").hasClass("menu-content") || $(this).next("div").is(":visible")) return;
           $(this).next("div").slideToggle(0).siblings(".menu-content:visible").slideUp(0); //将其他已经展开的收缩

            // 行业版有效
            $(this).siblings(".menu-title-active").removeClass("menu-title-active");
            $(this).toggleClass("menu-title-active"); //展开
        }
    });

    //菜单点击事件
    $(".menu-content a").each(function() {
        $(this).bind("click", function() {
            var id = $(this).attr("id");
            menuLink_click(id);
        });
    });
}
