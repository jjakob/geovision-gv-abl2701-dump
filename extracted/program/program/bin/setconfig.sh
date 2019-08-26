#! /bin/sh
# config path
DEVICE_CAP=/program/factory/device_cap_*.xml
CONFIG_CAP=/config/device_cap.xml
PTZ_CONIFG=/config/PTZ_Config
DOME_SPEED=/config/DomeSpeed

# get/set config
case "$1" in
"stor_flush_interval")
	if [ $# == 1 ] ; then 
		grep \<StorIpsanFlushNum\> $CONFIG_CAP
	elif [ $# == 2 ] ; then
		sed -i 's/<StorIpsanFlushNum>.*</<StorIpsanFlushNum>'"$2"'</g' $DEVICE_CAP
		cfgtool 1>/dev/null 2>&1
		echo "Set stor flush interval as $2"
	else
		echo "Usage: setconfig.sh stor_flush_interval [NUMBER]"
	exit 1; 
	fi
	;;		
"ptz_config")
	if [ $# == 1 ] ; then 
		cat $PTZ_CONIFG | grep -v "SpeedLevel"
	elif [ $# == 2 ] ; then
		cat $PTZ_CONIFG | grep $2 | grep -v "SpeedLevel"
	elif [ $# == 3 ] ; then
		OLD_STREAM=`cat $PTZ_CONIFG | grep $2 | grep -v "SpeedLevel"`
		NEW_STREAM=$2":"$3
		sed -i 's/'"$OLD_STREAM"'/'"$NEW_STREAM"'/g' $PTZ_CONIFG
		echo "Set $1 $2 as $3"
	else
		echo "Usage: setconfig.sh ptz_config [ITEM NAME] [NUMBER]"
	exit 1; 
	fi
	;;		
"dome_speed")
	if [ $# == 1 ] ; then 
		cat $DOME_SPEED
	elif [ $# == 2 ] ; then
		cat $DOME_SPEED | grep $2
	elif [ $# == 3 ] ; then
		OLD_STREAM=`cat $DOME_SPEED | grep $2`
		NEW_STREAM=$2":"$3
		sed -i 's/'"$OLD_STREAM"'/'"$NEW_STREAM"'/g' $DOME_SPEED
		echo "Set $1 $2 as $3"
	else
		echo "Usage: setconfig.sh dome_speed [ITEM NAME] [NUMBER]"
	exit 1; 
	fi
	;;	
*)
	echo "============================================"
    echo "    Current support command:"
    echo "    1. stor_flush_interval"
    echo "    2. ptz_config"
    echo "    3. dome_speed"
    echo "============================================"
    exit 1
esac