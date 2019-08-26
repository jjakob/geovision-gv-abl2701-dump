#!/bin/sh

PartitionName="program"
VolumeName="program"
DeviceName="ubi0"
FolderName="/program"
#PRODUCT_TYPE=`zcat /proc/config.gz | grep "CONFIG_UNIVIEW_" | grep "=y" | sed 's/=y//'`
PRODUCT_ID=255
BUILD_INFO="NULL"

#FLASH存在坏块时，使用manuinfotool会打印bad block等字段导致解析错误。故在此先调用
#一次manuinfotool，会在/tmp/目录下生成manuinfo文件，后续manuinfotool优先访问该文件
/program/bin/manuinfotool get LENS >/dev/null

#if [ -r /program/bin/top -a -r /usr/bin/top ]; then
#	rm -rf /usr/bin/top
#fi
	 
mdev -s

kernel_ver=$(uname -r) 

mcu_load()                                                                        
{
	MCU_MOT=`/program/bin/manuinfotool | grep BUILD_INFO | grep MOT | awk -F "MOT-" '{print $2}' | cut -c 1-8`
	MCU_POW=`/program/bin/manuinfotool get POW`
	
	# PT-stm32, need to analyze BUILD_INFO-->MOT code, code lenth is 8 
	if [ "$MCU_MOT" = "0302C0VV" ]; then
	
		if [ -e /program/bin/isp_stm32 ];then
			/program/bin/isp_stm32 -d
			sleep 1
			/program/bin/isp_stm32 -c /program/bin/STM32_3PT.bin
		fi
		
	elif [ "$MCU_MOT" = "0302C0CK" -o "$MCU_MOT" = "0302C07Q" ]; then  
	                                      
		if [ -r /lib/modules/$kernel_ver/extra/kmotorpt.ko ];then 
		         insmod /lib/modules/$kernel_ver/extra/kmotorpt.ko
		fi 
		
		if [ -e /program/bin/isp_stm32 ];then
			/program/bin/isp_stm32 -d
			sleep 1
			/program/bin/isp_stm32 -c /program/bin/STM32_F10x.bin
		fi
        
	elif [ "$MCU_MOT" = "0302C08T" ]; then 
	
		if [ -r /lib/modules/$kernel_ver/extra/kmotorpt.ko ];then
			insmod /lib/modules/$kernel_ver/extra/kmotorpt.ko
        fi
		
		if [ -e /program/bin/isp_mcu ]; then
			/program/bin/isp_mcu -d
			sleep 1
			/program/bin/isp_mcu -c /program/bin/T0_start.hex
		fi
	else 
		echo "no need to load bin files"
	fi

	# other mcu, reverse
	return 0
}

motor_load()
{
    # 读取电机掉电记忆位置
    if [ -r /config/motorpos ];then
        zoompos=`cat /config/motorpos | grep ZOOM | awk -F ':' '{print $2}'`
        focuspos=`cat /config/motorpos | grep FOCUS | awk -F ':' '{print $4}'`
    else
        zoompos=0xfffffff
        focuspos=0xfffffff
	fi

    if [ "$zoompos" = "" -o "$focuspos" = "" ];then                       
        zoompos=0xfffffff                                            
        focuspos=0xfffffff                                           
    fi

    # 电机模块相关
    if [ "$UV_PRODUCT_NAME" = "dipcv1r2b13" -o \
         "$UV_PRODUCT_NAME" = "gipcv5r1b15" -o \
         "$UV_PRODUCT_NAME" = "gipcv6r1b12" -o \
         "$UV_PRODUCT_NAME" = "gipcv5r5b01" -o \
         "$UV_PRODUCT_NAME" = "qipcv1r2b18" ];then
        if [ -r /lib/modules/$kernel_ver/extra/kmotor.ko ]; then
            insmod  /lib/modules/$kernel_ver/extra/kmotor.ko glZoomPos=$zoompos glFocusPos=$focuspos
        fi
    elif [ "$UV_PRODUCT_NAME" = "hcmv1r1b06" -o \
           "$UV_PRODUCT_NAME" = "qipcv2r1b23" ];then
        # SPI管脚复用寄存器
        himm 0x120400D4 0x1 >/dev/null
        himm 0x120400CC 0x1 >/dev/null
        himm 0x120400D0 0x1 >/dev/null
        himm 0x120400C8 0x1 >/dev/null
        if [ -r /lib/modules/$kernel_ver/extra/kmotorcm.ko ]; then
            insmod  /lib/modules/$kernel_ver/extra/kmotorcm.ko g_uiZoomPos=$zoompos g_uiFocusPos=$focuspos
        fi
    fi
}

cp /program/bin/manuinfotool /usr/bin/updateflag -rf
chmod +x /usr/bin/updateflag

#updateflag check
UPDATE_FLAG=`/usr/bin/updateflag get | grep updateflag |cut -d : -f 2`
if [ "$UPDATE_FLAG" = "set" ]; then
	/usr/bin/updateflag clear
	TIME=0
	if [ -e /config/powerofftime ]
	then
		TIME=$(cat /config/powerofftime | awk '{if(NR==1)print $0;}')
	fi

	touch /config/powerofftime
	echo $((TIME+1)) > /config/powerofftime
	date >> /config/powerofftime	
fi

#无电子标签启动中止，自动启动dhcp等待写入电子标签
#check manuinfo
DEVICENAME=`/program/bin/manuinfotool | grep PROTOTYPE_NAME|cut -d : -f 2`
if [ -z "$DEVICENAME" ]; then
      #restart udhcpc & exit
	  echo "-----------------------------------------------------------"
	  echo "----------------begin to start udhcpc----------------------"
	  echo "-----------------------------------------------------------"
	  #无电子标签时 拷贝update 程序至/tmp/bin 支持版本升级
	  cd /
      mkdir -p /tmp/bin   
      cp -rf /program/bin/update_move /tmp/bin/update
      chmod a+x /tmp/bin/update 
      cp -rf /usr/sbin/nandwrite_move /tmp/bin/nandwrite
      chmod a+x /tmp/bin/nandwrite 
      cp -rf /usr/sbin/flashwrite_move /tmp/bin/flashwrite
      chmod a+x /tmp/bin/flashwrite 
      cp -rf /program/bin/reboot.sh  /tmp/bin/reboot.sh
      chmod a+x /tmp/bin/reboot.sh

      cp /program/bin/mwarecmd.sh /tmp/bin/mwarecmd.sh -f
      chmod a+x /tmp/bin/mwarecmd.sh     	
 
      killall -9 udhcpc
      
      udhcpc -s /usr/share/udhcpc/udhcpc.script > /dev/null &
      exit 1
fi

#单板类型需要用电子标签获得
BUILD_INFO=`/program/bin/manuinfotool | grep BUILD_INFO|cut -d : -f 2`
PROTOTYPE_NAME=`/program/bin/manuinfotool | grep PROTOTYPE_NAME|cut -d : -f 2`

if [ -r /lib/modules/$kernel_ver/extra/kgpio.ko ]; then
	insmod /lib/modules/$kernel_ver/extra/kgpio.ko  szBuildInfo=$BUILD_INFO szPrototypeName=$PROTOTYPE_NAME szPTInfo=$PT_NAME
		case "$?" in
		0)
		UV_BOARD_NAE=$(cat /proc/driver/productname)
		;;
		*)
		echo "odporbe kgpio failed!"
		;;
	esac
fi	


tdNum=`cat /proc/mtd | grep $PartitionName | awk '{print $1}' | sed -e s/mtd// | sed -e s/\://`
 
#load3516cv300
if [ -x /lib/modules/$kernel_ver/extra/load3516cv300 ]; then
    #在线模式和离线模式选择
	if [ -e "/config/online" ]; then
	    echo "online mode!"
		/lib/modules/$kernel_ver/extra/load3516cv300 -i
	else
        echo "offline mode!"
		/lib/modules/$kernel_ver/extra/load3516cv300 -offline -i
	fi
else
    echo "load3516cv300 not exist"
	exit 1
fi

#spi模块
#insmod /lib/modules/$kernel_ver/extra/extdrv/hi_ssp_sony.ko

#load MCU MOTOR
UV_PRODUCT_NAME=$(cat /proc/driver/productname)
motor_load;

#DMA uart模块
if [ -r /lib/modules/$kernel_ver/extra/hi_uart.ko ]; then
       insmod  /lib/modules/$kernel_ver/extra/hi_uart.ko
       ln -sf /dev/ttyHI0 /dev/ttyAMA1
       ln -sf /dev/ttyHI1 /dev/ttyAMA2
fi    

##机芯单卖产品，使用UART1控制电机变倍
if [ "$UV_PRODUCT_NAME" = "hcmv1r1b06" ]; then
    ln -sf /dev/ttyHI0 /dev/tty_RS232_1
fi

KERNEL_PRODUCT_TYPE=$(cat /proc/driver/producttype)

MOT=`/program/bin/manuinfotool | grep "BUILD_INFO" | grep "MOT" | awk -F ';' '{print $3}' | awk -F '-' '{print $2}'` 

if [ "$KERNEL_PRODUCT_TYPE" = "NET_CAM" ]; then

	if [ "$MOT" = "" -o "$MOT" = "0302C08T" ]; then
	    ln -sf /dev/ttyAMA2 /dev/ttyAMBA1
	else
	    ln -sf /dev/ttyAMA1 /dev/ttyAMBA1
	fi
	
else
    ln -sf /dev/ttyAMA1 /dev/ttyAMBA1
fi

# mcu load bin file
mcu_load;

#runtime模块
insmod /lib/modules/$kernel_ver/extra/kruntime.ko

#电子罗盘模块
if [ -r /lib/modules/$kernel_ver/extra/kecompass.ko ]; then
	# 大球I2C转串口单片机升级,需要放在云台升级之前, 否则第一次读取版本号I2C会报错
	if [ -r /program/bin/STM8S007C8_PWBD.bin ];then
		POW_BD=`/program/bin/manuinfotool get POW`
		if [ "$POW_BD" = "0302C0VW" ];then
			/program/bin/stm8_load -e 2 /program/bin/STM8S007C8_PWBD.bin
		fi
	fi
	insmod  /lib/modules/$kernel_ver/extra/kecompass.ko
fi

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/program/lib

if [ -r /lib/modules/$kernel_ver/extra/kmultisend.ko ]; then

	insmod /lib/modules/$kernel_ver/extra/kmultisend.ko
    case "$?" in
	0)
        echo "insmod kmultisend.ko ok!"
	;;
	*)
	    echo "insmod kmultisend.ko failed!"
	    exit 1
	;;
	esac
fi

insert_wifi_ko()
{
    cd /program/lib
    insmod 8188fu.ko
    echo "insmod RTL8188 for wifi success"
}

set_wifi_mac()
{
    MACADDR_STRING=`/program/bin/mactool -wifi`
    #include dos chracter
    MAC_ADDR_COPPER_TEMP=${MACADDR_STRING#*is:}
    #delete dos chracter
    MAC_ADDR_COPPER=`echo $MAC_ADDR_COPPER_TEMP |awk '{print $1}'`
    if [ "MAC_ADDR_COPPER" != "invalid" ]; then
		ifconfig wlan0 hw ether $MAC_ADDR_COPPER
    else
        echo "wifi mac addr is invalid,so use random mac addr"
    fi
}
#gpio 模块加载成功后，检测wifi 模组是否有接入到设备上，若有加载wifi模块
WIFI_ID=`lsusb |grep f179|cut -d : -f 3`

if [ "$WIFI_ID" == "f179" ];then
    insert_wifi_ko
	sleep 3
	#与厂家交流，芯片自带mac地址，无需再设置。如需保持原有策略，请将下句打开
	#set_wifi_mac     
	ifconfig wlan0 up  
fi

#Run mware.sh
/program/bin/mware_init.sh  &

if [ -e "/config/passwd" ]; then
    echo "passwd has changed"
    echo "cp /config/passwd to /etc/passwd"
    cp -af /config/passwd /etc/passwd
fi
